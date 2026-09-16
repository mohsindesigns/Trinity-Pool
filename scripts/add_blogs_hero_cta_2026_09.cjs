require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const DEFAULTS = {
  'blogsPage.header.image': '/images/trinity/blog-pump.jpg',
  'blogsPage.header.imageAlt': 'Trinity Pump & Supply shop floor',
  'blogsPage.ctaBanner': {
    label: 'NEED PARTS OR SERVICE?',
    title: 'Talk to Our Team About Your Well.',
    description: 'From sucker rods to rod pump tracking, our Odessa shop is ready to help — call or send us the details of your job.',
    button: 'Get a Quote',
    buttonUrl: '/contact-us/',
  },
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const col = db.collection('site_contents');

  const doc = await col.findOne({ key: 'complete_data' });
  const existing = doc?.data?.blogsPage || {};

  const toSet = {};
  if (!existing.header?.image) toSet['data.blogsPage.header.image'] = DEFAULTS['blogsPage.header.image'];
  if (!existing.header?.imageAlt) toSet['data.blogsPage.header.imageAlt'] = DEFAULTS['blogsPage.header.imageAlt'];
  if (!existing.ctaBanner || Object.keys(existing.ctaBanner).length === 0) toSet['data.blogsPage.ctaBanner'] = DEFAULTS['blogsPage.ctaBanner'];

  if (Object.keys(toSet).length === 0) {
    console.log('Nothing to set — blogsPage.header.image/imageAlt/ctaBanner already present.');
  } else {
    const result = await col.updateOne({ key: 'complete_data' }, { $set: toSet });
    console.log('Set fields:', Object.keys(toSet));
    console.log('Matched:', result.matchedCount, 'Modified:', result.modifiedCount);
  }

  const after = await col.findOne({ key: 'complete_data' }, { projection: { 'data.blogsPage': 1 } });
  console.log('blogsPage now:', JSON.stringify(after?.data?.blogsPage, null, 2));

  await client.close();
}

main().catch((err) => { console.error(err); process.exit(1); });
