const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: 'C:/Users/dell/Desktop/Trinity Pump/.env.local', quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log('dbName used:', dbName);
  const cols = await db.listCollections().toArray();
  console.log('collections:', cols.map(c => c.name));

  const posts = await db.collection('posts').find({}).toArray();
  const blogs = await db.collection('blogs').find({}).toArray();
  console.log('posts count:', posts.length, 'blogs count:', blogs.length);
  console.log('posts trashed:', posts.filter(p => p.isTrashed === true).length);
  console.log('posts live (isTrashed false/missing):', posts.filter(p => p.isTrashed !== true).length);
  console.log('posts published:', posts.filter(p => p.status === 'published').length);
  console.log('sample post keys:', posts[0] ? Object.keys(posts[0]) : 'none');
  console.log('sample blog keys:', blogs[0] ? Object.keys(blogs[0]) : 'none');

  // Print any doc where JSON contains "410" as digits at all (broadest)
  let any410 = 0;
  for (const doc of [...posts, ...blogs]) {
    const s = JSON.stringify(doc);
    if (s.indexOf('410') !== -1) {
      any410++;
      console.log('---FOUND 410 in doc', doc._id, doc.slug);
    }
  }
  console.log('any410 docs total:', any410);

  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
