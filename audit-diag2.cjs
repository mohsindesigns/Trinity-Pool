const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'C:/Users/dell/Desktop/Trinity Pump/.env.local', quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const posts = await db.collection('posts').find({}).toArray();
  const blogs = await db.collection('blogs').find({}).toArray();
  const all = [...posts.map(d=>({...d,__coll:'posts'})), ...blogs.map(d=>({...d,__coll:'blogs'}))];

  const needles = ['muscletherapy', 'muscle therapy', 'muscle-therapy', '410', 'trinity', 'trinitypump'];
  for (const doc of all) {
    const s = JSON.stringify(doc).toLowerCase();
    for (const n of needles) {
      if (s.includes(n)) {
        console.log(`MATCH "${n}" in ${doc.__coll}/${doc.slug || doc._id} (isTrashed=${doc.isTrashed}, status=${doc.status})`);
      }
    }
  }
  console.log('done scanning', all.length, 'docs');
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
