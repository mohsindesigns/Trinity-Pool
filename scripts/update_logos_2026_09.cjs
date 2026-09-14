/**
 * Real logo files landed from the client (2026-09-14, follow-up to
 * update_service_pages_2026_09.cjs):
 *  1) Trinity Pump & Supply's own logo -> site navbar/footer (Footer falls
 *     back to navbar.logo when footer.company.logo is unset, so only the
 *     navbar field needs setting).
 *  2) Percheron Manufacturing's logo was supplied as .webp, not .png —
 *     fix the sucker-rods-sinker-bars page's supplierLogos entry to point
 *     at the real file (kept as .webp; renaming the extension without
 *     converting the format would break the image).
 *  3) TAC's page: the 4th (TAC) supplier logo isn't available yet, so per
 *     the client's own call, use the Trinity logo as a stand-in there
 *     ("Built In-House By Trinity Pump & Supply") instead of leaving that
 *     section hidden — swap to the real vendor logo once it arrives.
 *
 * Run:  node scripts/update_logos_2026_09.cjs
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

  // 1) Site logo
  const r1 = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.navbar.logo': '/uploads/trinity-logo.png' } }
  );
  console.log(`navbar.logo set: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);

  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage) {
    const r1b = await pagesCol.updateOne({ _id: homePage._id }, { $set: { 'content.navbar.logo': '/uploads/trinity-logo.png' } });
    console.log(`pages(home) navbar.logo mirror: modified=${r1b.modifiedCount}`);
  }

  // 2) Percheron: fix extension to the real supplied format (.webp)
  const r2 = await pagesCol.updateOne(
    { slug: 'sucker-rods-sinker-bars' },
    { $set: { 'content.supplierLogos.1.logoUrl': '/images/trinity/logos/percheron-manufacturing.webp' } }
  );
  console.log(`sucker-rods-sinker-bars Percheron logoUrl fix: matched=${r2.matchedCount} modified=${r2.modifiedCount}`);

  // 3) TAC's: Trinity logo as a stand-in until the 4th vendor logo arrives
  const r3 = await pagesCol.updateOne(
    { slug: 'tacs' },
    { $set: {
      'content.supplierLogos': [{ name: 'Trinity Pump & Supply', logoUrl: '/uploads/trinity-logo.png' }],
      'content.supplierLogosLabel': 'Built In-House By',
    } }
  );
  console.log(`tacs supplierLogos (Trinity stand-in): matched=${r3.matchedCount} modified=${r3.modifiedCount}`);

  await client.close();
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
