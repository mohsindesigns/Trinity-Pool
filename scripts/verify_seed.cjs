const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = 'trinity_pump_supply';

async function check() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const doc = await db.collection('site_contents').findOne({ key: 'complete_data' });
        console.log("Seeded Document Title:", doc?.data?.globalMetadata?.title);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
check();
