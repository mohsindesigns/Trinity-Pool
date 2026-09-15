/**
 * The single largest issue found in the final "everything dynamic,
 * everything complete" audit: 75 of the site's 81 blog posts are leftover
 * content from an unrelated massage-therapy business (matching the CMS's
 * original "trinity_pump_supply" template lineage) -- all still `status:
 * 'published'`, `isTrashed: false`. Confirmed these are individually
 * live, publicly reachable blog posts (deep tissue massage, cupping
 * therapy, sports massage certification, etc.) AND get pulled into
 * "related articles"/"latest posts" widgets on real Trinity pages
 * (contact-us, services, faq), which is how "Timonium Maryland" and
 * "massage therapy" text kept surfacing on those pages even after their
 * own page-level content was fixed.
 *
 * Fix: soft-delete (isTrashed: true, status: 'draft') rather than hard
 * delete -- matches this app's existing Page-trashing convention, is
 * fully reversible, and immediately removes them from every public
 * listing and widget without permanently destroying the records.
 *
 * The 6 real Trinity posts (3 published, 3 draft) are left untouched.
 *
 * Run:  node scripts/trash_contaminated_blog_posts_2026_09.cjs
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

  const postsCol = db.collection('posts');
  const all = await postsCol.find({}).toArray();
  const contaminated = all.filter((p) => /massage|cupping|myofascial|deep tissue|timonium/i.test(JSON.stringify(p)));

  console.log(`Found ${contaminated.length} contaminated posts out of ${all.length} total.`);

  const now = new Date();
  let trashed = 0;
  for (const post of contaminated) {
    const r = await postsCol.updateOne(
      { _id: post._id },
      { $set: { isTrashed: true, status: 'draft', trashedAt: now } }
    );
    if (r.modifiedCount > 0) trashed++;
  }
  console.log(`Trashed ${trashed}/${contaminated.length} contaminated posts.`);

  const remaining = await postsCol.find({ isTrashed: { $ne: true }, status: 'published' }).toArray();
  console.log(`\nRemaining live, published posts (${remaining.length}):`);
  remaining.forEach((p) => console.log('-', p.slug));

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
