/**
 * Services audit follow-up: ServicesIndexGrid.tsx grouped the /services/
 * catalogue under three hardcoded group headings ("Artificial Lift",
 * "Projects & Supplies", "More Services") with no CMS binding. The
 * component and useContent.ts's services block were updated to read
 * services.categoryLabels["artificial-lift" | "projects-supplies" | "other"]
 * (falling back to those same literal strings if the field is empty), so
 * this just seeds that new field in the DB with those current defaults --
 * pure backfill, doesn't change anything visible on the live page.
 *
 * Run:  node scripts/add_services_category_labels_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'trinity_pump_supply';

const DEFAULT_CATEGORY_LABELS = {
  'artificial-lift': 'Artificial Lift',
  'projects-supplies': 'Projects & Supplies',
  'other': 'More Services',
};

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);

  const contentCol = db.collection('site_contents');
  const doc = await contentCol.findOne({ key: 'complete_data' });
  if (!doc) throw new Error("site_contents doc with key 'complete_data' not found -- aborting");

  const existing = doc?.data?.services?.categoryLabels || {};
  const merged = { ...DEFAULT_CATEGORY_LABELS, ...existing };

  const r = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.categoryLabels': merged } }
  );
  console.log(`services.categoryLabels set:`, merged);
  console.log(`matched=${r.matchedCount} modified=${r.modifiedCount}`);

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
