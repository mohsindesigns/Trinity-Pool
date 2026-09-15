const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'trinity_pump_supply';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const r = await db.collection('pages').updateOne(
    { slug: 'faq' },
    {
      $set: {
        'seo.metaDescription': 'Find answers to common questions about Trinity Pump & Supply\'s artificial lift equipment, service area, and how to get a quote.',
        'seo.ogDescription': "Get answers to common questions about rod pumps, TAC's, artificial lift supplies, and service across Texas and New Mexico from Trinity Pump & Supply.",
        'seo.twitterDescription': "Get answers to common questions about rod pumps, TAC's, artificial lift supplies, and service across Texas and New Mexico from Trinity Pump & Supply.",
      },
    }
  );
  console.log(`faq.seo updated: matched=${r.matchedCount} modified=${r.modifiedCount}`);
  await client.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
