/**
 * Wire in the 4th TAC supplier (TechTAC / tubinganchor.com), replacing the
 * temporary Trinity-logo stand-in, and apply the ® trademark requirement
 * from Luke Reary's (Director of Sales, TechTAC) email: "any time you
 * mention Tech TAC or Slimline, you'll need to put (R) next to it, like
 * this example: 'Proud distributor of TechTAC(R) Slimline(R) Tubing
 * Anchor Catchers.'"
 *
 * Logo file: public/images/trinity/logos/techtac.png -- SupplierLogos.tsx
 * degrades to a clean "TechTAC" text pill via onError until the real file
 * is dropped at that path, then upgrades automatically with zero further
 * code change (same pattern used for every other not-yet-supplied logo
 * this round).
 *
 * Run:  node scripts/update_tacs_techtac_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'trinity_pump_supply';

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
  if (!Array.isArray(catalogue)) throw new Error('services catalogue missing -- aborting');

  const idx = catalogue.findIndex((c) => c.slug === 'tacs');
  if (idx === -1) throw new Error('tacs not found in catalogue -- aborting');

  const before = catalogue[idx];
  catalogue[idx] = {
    ...before,
    heroDescription: "We build and repair TAC's in-house, and we're a proud distributor of TechTAC® Slimline® Tubing Anchor Catchers — sized to your tubing and casing specs, in stock for fast turnaround.",
    benefits: before.benefits.map((b) =>
      b.title === 'High-Quality Vendor Parts'
        ? { title: 'TechTAC® Slimline® Tubing Anchor Catchers', description: "We're a proud distributor of TechTAC® Slimline® TAC's, built to precise tubing and casing specs." }
        : b
    ),
    supplierLogosLabel: 'Proud Distributor Of',
    supplierLogos: [
      { name: 'TechTAC', logoUrl: '/images/trinity/logos/techtac.png', url: 'https://tubinganchor.com' },
    ],
  };

  const r1 = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.services': catalogue } }
  );
  console.log(`catalogue updated: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);

  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage && Array.isArray(homePage?.content?.services?.services)) {
    await pagesCol.updateOne({ _id: homePage._id }, { $set: { 'content.services.services': catalogue } });
    console.log('pages(home) catalogue mirror updated');
  }

  await client.close();
  console.log('\nDone. TACs page now credits TechTAC (R) Slimline (R) by name with proper trademark marks.');
  console.log('Once public/images/trinity/logos/techtac.png exists, the real logo appears automatically -- no further code change needed.');
}

main().catch((e) => { console.error(e); process.exit(1); });
