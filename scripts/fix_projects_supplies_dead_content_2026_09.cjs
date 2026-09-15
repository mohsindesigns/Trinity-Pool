/**
 * Same bug as fix_rod_pumps_dead_content_2026_09.cjs, found on the 6
 * "Projects / Supplies" pages during the "make sure everything is dynamic"
 * audit -- these were never part of the client's requested changes this
 * round, but they are live, nav-linked pages showing the SAME pre-existing
 * bug: real, written benefit cards sit unused in Page.content.service.*
 * while the visible page silently shows the template's generic hardcoded
 * fallback benefits instead. Also the same dashboard landmine: opening any
 * of these in /admin/services and saving would currently inject unrelated
 * placeholder benefits into production, since the catalogue's `benefits`
 * field is undefined for all 6.
 *
 * Fix, identical pattern: move only benefits + imageAlt (the dead/invisible
 * fields) into the catalogue item per page, then clear Page.content.
 * Title, short card description, headlines -- everything already visible
 * today -- stays untouched.
 *
 * Run:  node scripts/fix_projects_supplies_dead_content_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'trinity_pump_supply';

const SLUGS = [
  'pipe-valves-fittings', 'poly', 'complete-facility-buildouts',
  'general-oilfield-supply', 'technical-support-planning',
  'trailer-support-on-site-operations',
];

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);

  const contentCol = db.collection('site_contents');
  const pagesCol = db.collection('pages');

  const doc = await contentCol.findOne({ key: 'complete_data' });
  const catalogue = doc?.data?.services?.services;
  if (!Array.isArray(catalogue)) throw new Error('services catalogue missing/not an array -- aborting');

  let fixed = 0, cleared = 0;

  for (const slug of SLUGS) {
    const page = await pagesCol.findOne({ slug });
    const trapped = page?.content?.service || {};
    const idx = catalogue.findIndex((c) => c.slug === slug);
    if (idx === -1) { console.log(`  SKIP ${slug}: not in catalogue`); continue; }
    if (!trapped.benefits) { console.log(`  SKIP ${slug}: no trapped content.service.benefits found`); continue; }

    const before = catalogue[idx];
    catalogue[idx] = {
      ...before,
      benefits: trapped.benefits,
      imageAlt: trapped.imageAlt || before.imageAlt,
    };
    fixed++;
    console.log(`  ${slug}: benefits ${before.benefits ? before.benefits.length : 0} -> ${catalogue[idx].benefits.length} items`);
  }

  const r1 = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.services': catalogue } }
  );
  console.log(`\ncatalogue updated: matched=${r1.matchedCount} modified=${r1.modifiedCount} (${fixed}/${SLUGS.length} pages fixed)`);

  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage && Array.isArray(homePage?.content?.services?.services)) {
    await pagesCol.updateOne({ _id: homePage._id }, { $set: { 'content.services.services': catalogue } });
    console.log('pages(home) catalogue mirror updated');
  }

  for (const slug of SLUGS) {
    const r = await pagesCol.updateOne({ slug }, { $set: { content: {} } });
    if (r.modifiedCount > 0) cleared++;
  }
  console.log(`Page.content cleared on ${cleared}/${SLUGS.length} pages (routing/SEO/featuredImage untouched)`);

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
