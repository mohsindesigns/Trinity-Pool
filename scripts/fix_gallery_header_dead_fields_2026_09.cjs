/**
 * Hardcoded/disconnected-content audit: GalleryTemplate.tsx reads
 * galleryPage.header.titlePrefix / titleHighlight / ctaBook to render the
 * real H1 ("Real Results, Real Stories") and the CTA button on /gallery/,
 * but the admin editor at src/app/admin/pages/gallery/page.tsx never
 * exposed inputs for those fields -- so they were never set in the DB and
 * the page has always silently fallen back to the template's hardcoded
 * defaults.
 *
 * This script only reports the current live values and, if any of the
 * three fields are unset/blank, seeds them with the same copy the template
 * currently falls back to, so the new admin inputs aren't blank on first
 * load and nothing changes visually on the live page.
 *
 * Run:  node scripts/fix_gallery_header_dead_fields_2026_09.cjs
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'trinity_pump_supply';

const DEFAULTS = {
  titlePrefix: 'Real Results,',
  titleHighlight: 'Real Stories',
  ctaBook: 'REQUEST A QUOTE',
};

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);

  const col = db.collection('site_contents');
  const doc = await col.findOne({ key: 'complete_data' }, { projection: { 'data.galleryPage.header': 1 } });
  const header = doc?.data?.galleryPage?.header || {};

  console.log('\nCurrent galleryPage.header:');
  console.log(JSON.stringify(header, null, 2));

  const set = {};
  for (const [field, fallback] of Object.entries(DEFAULTS)) {
    const current = header[field];
    if (!current || !String(current).trim()) {
      set[`data.galleryPage.header.${field}`] = fallback;
    }
  }

  if (Object.keys(set).length === 0) {
    console.log('\nAll three fields already set -- nothing to do.');
    await client.close();
    return;
  }

  console.log('\nSeeding unset fields with template fallback copy:');
  console.log(JSON.stringify(set, null, 2));

  const r = await col.updateOne({ key: 'complete_data' }, { $set: set });
  console.log(`\nmatched=${r.matchedCount} modified=${r.modifiedCount}`);

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
