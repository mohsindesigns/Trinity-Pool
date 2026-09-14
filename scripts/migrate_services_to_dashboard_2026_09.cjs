/**
 * Make every service page's content fully editable from the admin
 * dashboard (2026-09-14 follow-up).
 *
 * Root cause found during audit: /admin/services saves rich content
 * (benefits, whoProfiles, heroDescription, etc.) directly onto the flat
 * catalogue item (data.services.services[i]) -- that is the ONE place
 * this admin editor writes to. But the actual rich content for the 7
 * pages this round touched was written to a separate Page.content
 * document instead, and Page.content wins the merge in
 * ServiceDetailTemplate.tsx. Net effect: editing a service in the
 * dashboard and clicking Save would silently do nothing visible on the
 * live site, because the old Page.content copy would keep overriding it.
 *
 * Fix: move the rich content into the catalogue item (the single place
 * the dashboard actually manages), then clear the shadow copy out of
 * Page.content so it stops overriding future dashboard edits. Page docs
 * are kept (still needed for routing/SEO/featuredImage) -- only their
 * `content` field is cleared.
 *
 * Run:  node scripts/migrate_services_to_dashboard_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';

const SLUGS = [
  'sucker-rods-sinker-bars', 'tacs', 'artificial-lift-supplies',
  'rod-pump-tracking-api-certification', 'gas-sand-separators',
  'hd-rod-rotator', 'hd-plunger',
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

  let merged = 0, clearedPages = 0;
  const newCatalogue = [];

  for (const item of catalogue) {
    if (!SLUGS.includes(item.slug)) {
      newCatalogue.push(item);
      continue;
    }
    const page = await pagesCol.findOne({ slug: item.slug });
    const richContent = page?.content || {};
    // Merge: catalogue item's own {title, slug, category, icon, image,
    // description} stay authoritative for those fields; everything else
    // (heroDescription, benefits, whoProfiles, sessionSteps,
    // supplierLogos, galleryImages, stats*, overview*, faq*, ...) comes
    // from the richer Page.content this round wrote.
    const mergedItem = { ...richContent, ...item };
    newCatalogue.push(mergedItem);
    merged++;
    console.log(`  merged rich content into catalogue item: ${item.slug} (${Object.keys(richContent).length} fields)`);
  }

  const r1 = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.services': newCatalogue } }
  );
  console.log(`\ncatalogue updated: matched=${r1.matchedCount} modified=${r1.modifiedCount} (${merged}/${SLUGS.length} services merged)`);

  // Mirror into pages/home's own copy of the catalogue too (same shadow
  // risk as before -- pages/home.content.services.services would
  // otherwise keep showing the pre-migration snapshot).
  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage && Array.isArray(homePage?.content?.services?.services)) {
    await pagesCol.updateOne({ _id: homePage._id }, { $set: { 'content.services.services': newCatalogue } });
    console.log('pages(home) catalogue mirror updated');
  }

  // Clear the shadow: each of these 7 Page documents' own `content` field
  // now only needs to stay empty so it never again overrides the
  // catalogue (the dashboard's real, single source of truth going
  // forward). Routing, SEO and featuredImage are untouched -- they live
  // on other top-level Page fields, not inside `content`.
  for (const slug of SLUGS) {
    const r = await pagesCol.updateOne({ slug }, { $set: { content: {} } });
    if (r.modifiedCount > 0) clearedPages++;
  }
  console.log(`Page.content cleared on ${clearedPages}/${SLUGS.length} pages (routing/SEO/featuredImage untouched)`);

  await client.close();
  console.log('\nDone. Every field editable via /admin/services now flows straight to the live site.');
}

main().catch((e) => { console.error(e); process.exit(1); });
