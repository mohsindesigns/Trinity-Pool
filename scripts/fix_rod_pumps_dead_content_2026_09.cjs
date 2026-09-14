/**
 * Fix a pre-existing bug on the ONE service page this round's work never
 * touched: Rod Pumps (client explicitly said "keep exactly as is").
 *
 * Found during the "make sure everything is dynamic" audit: Rod Pumps'
 * real benefit cards ("Customized Pump Design", "USA-Made High-Quality
 * Alloys", "Lower Lifting Costs", "Precision Reconditioning") and imageAlt
 * text were written to Page.content.service.* (the same trapped location
 * as the original root-cause bug this round fixed on 7 other pages), which
 * ServiceDetailTemplate.tsx never reads. The live page has been silently
 * showing the template's generic hardcoded fallback benefits instead
 * ("USA-Made Materials", "Matched to Your Well", "Lower Lifting Costs",
 * "Odessa, TX Shop & Support") -- confirmed by direct HTML inspection.
 *
 * This ALSO means opening Rod Pumps in /admin/services today and hitting
 * Save would silently inject the editor's unrelated default placeholder
 * benefits into production, since the catalogue's `benefits` field is
 * currently undefined there.
 *
 * Fix: move only the two genuinely dead/invisible fields (benefits,
 * imageAlt) from Page.content.service into the catalogue item, then clear
 * Page.content so it stops being an inert trap -- matching the exact
 * pattern already applied to the 7 other service pages. Title, short
 * description, headlines and every other already-VISIBLE field are left
 * completely untouched, so nothing the client currently sees changes --
 * only the invisible bug is fixed.
 *
 * Run:  node scripts/fix_rod_pumps_dead_content_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';

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

  const page = await pagesCol.findOne({ slug: 'rod-pumps' });
  const trapped = page?.content?.service || {};
  if (!trapped.benefits) throw new Error('rod-pumps content.service.benefits not found -- nothing to migrate, aborting to avoid clobbering');

  const idx = catalogue.findIndex((c) => c.slug === 'rod-pumps');
  if (idx === -1) throw new Error('rod-pumps not found in catalogue -- aborting');

  const before = catalogue[idx];
  catalogue[idx] = {
    ...before,
    benefits: trapped.benefits,
    imageAlt: trapped.imageAlt || before.imageAlt,
  };

  const r1 = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.services': catalogue } }
  );
  console.log(`catalogue updated: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);
  console.log(`  rod-pumps.benefits: ${before.benefits ? before.benefits.length : 0} -> ${catalogue[idx].benefits.length} items`);
  console.log(`  rod-pumps.imageAlt: ${JSON.stringify(before.imageAlt)} -> ${JSON.stringify(catalogue[idx].imageAlt)}`);

  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage && Array.isArray(homePage?.content?.services?.services)) {
    await pagesCol.updateOne({ _id: homePage._id }, { $set: { 'content.services.services': catalogue } });
    console.log('pages(home) catalogue mirror updated');
  }

  const r2 = await pagesCol.updateOne({ slug: 'rod-pumps' }, { $set: { content: {} } });
  console.log(`Page(rod-pumps).content cleared: modified=${r2.modifiedCount} (routing/SEO/featuredImage untouched)`);

  await client.close();
  console.log('\nDone. Rod Pumps now shows its real benefit cards; /admin/services can edit it safely.');
}

main().catch((e) => { console.error(e); process.exit(1); });
