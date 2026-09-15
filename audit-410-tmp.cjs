const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local'), quiet: true });

// __dirname will be scratchpad, so fix path to project .env.local
require('dotenv').config({ path: 'C:/Users/dell/Desktop/Trinity Pump/.env.local', quiet: true });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';

const PATTERNS = [
  '410-muscletherapy',
  '410_muscle_therapy',
  '410 Muscle Therapy',
  '410muscletherapy',
];

function findMatches(obj, path, results) {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'string') {
    for (const pat of PATTERNS) {
      if (obj.toLowerCase().includes(pat.toLowerCase())) {
        results.push({ path, value: obj, pattern: pat });
      }
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => findMatches(item, `${path}[${i}]`, results));
    return;
  }
  if (typeof obj === 'object') {
    // handle ObjectId, Date etc gracefully by toString check too but primarily walk keys
    for (const [k, v] of Object.entries(obj)) {
      const newPath = path ? `${path}.${k}` : k;
      findMatches(v, newPath, results);
    }
  }
}

(async () => {
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const collections = ['posts', 'blogs'];
    const liveResults = [];
    let trashedCount = 0;
    let totalDocs = 0;
    let totalMatches410 = 0; // any doc containing raw "410" substring anywhere (for broader visibility)

    for (const collName of collections) {
      const docs = await db.collection(collName).find({}).toArray();
      totalDocs += docs.length;
      for (const doc of docs) {
        const results = [];
        findMatches(doc, '', results);

        // Also do a raw whole-document stringify scan for literal "410" to catch anything the walker might miss (e.g. nested weird types)
        const wholeStr = JSON.stringify(doc);
        if (wholeStr.includes('410')) {
          totalMatches410++;
        }

        if (results.length === 0) continue;

        const isTrashed = doc.isTrashed === true;
        const isLive = !isTrashed && (doc.status === 'published' || doc.status === undefined ? (doc.isTrashed !== true) : false);
        // More precise live definition per instructions: isTrashed:false or missing, AND status:'published'
        const liveFlag = (doc.isTrashed === false || doc.isTrashed === undefined) && doc.status === 'published';

        for (const r of results) {
          const entry = {
            collection: collName,
            id: String(doc._id),
            slug: doc.slug || doc.slugId || null,
            title: doc.title || null,
            isTrashed: doc.isTrashed,
            status: doc.status,
            fieldPath: r.path,
            value: r.value,
            pattern: r.pattern,
          };
          if (liveFlag) {
            liveResults.push(entry);
          } else {
            trashedCount++;
          }
        }
      }
    }

    console.log('=== SUMMARY ===');
    console.log('Total docs scanned (posts+blogs):', totalDocs);
    console.log('Docs whose raw JSON contains literal "410" anywhere:', totalMatches410);
    console.log('');
    console.log('=== LIVE MATCHES (' + liveResults.length + ') ===');
    console.log(JSON.stringify(liveResults, null, 2));
    console.log('');
    console.log('=== TRASHED/NON-LIVE MATCH COUNT ===', trashedCount);

  } finally {
    await client.close();
  }
})().catch(e => { console.error('ERROR', e); process.exit(1); });
