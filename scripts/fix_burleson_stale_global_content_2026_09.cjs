/**
 * Found via a client bug report on /gas-sand-separators/: the site-wide
 * default FAQ (used as a fallback by any service page without its own
 * custom FAQ list -- 12 of the 14 product pages, including Rod Pumps)
 * referred to the "Burleson HD Rod Rotator". Trinity's actual supplier is
 * Iron Bear Manufacturing -- "Burleson" appears nowhere else on the real,
 * current site. The same wrong name also appeared in a second, separate
 * FAQ set (data.contactFaq.faqs, used by the contact/quote section) and
 * in the homepage's portfolio showcase (data.portfolio.projects).
 *
 * This is a global fallback fix, not a change to any specific page's own
 * wording -- Rod Pumps and the other 11 pages that inherit this FAQ are
 * unaffected in every other respect.
 *
 * Run:  node scripts/fix_burleson_stale_global_content_2026_09.cjs
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
  const col = db.collection('site_contents');
  const doc = await col.findOne({ key: 'complete_data' });
  const data = doc.data;

  // 1. Global default FAQ (data.faq.items[0]) -- used as fallback by 12 of 14 service pages.
  const newFaqAnswer = "We build and repair downhole rod pumps, and we build, repair or supply tubing anchor catchers, sucker rods and sinker bars, gas and sand separators, general artificial lift supplies, and the Iron Bear HD Rod Rotator and HD Plunger.";
  data.faq.items[0].question = "What do you build and repair?";
  data.faq.items[0].q = "What do you build and repair?";
  data.faq.items[0].answer = newFaqAnswer;
  data.faq.items[0].a = newFaqAnswer;
  console.log('data.faq.items[0] fixed');

  // 2. Second FAQ set used by the contact/quote section (data.contactFaq.faqs[3]).
  const cf = data.contactFaq.faqs.find((f) => /burleson/i.test(f.question) || /burleson/i.test(f.answer));
  if (cf) {
    cf.question = "What makes the Iron Bear HD Rod Rotator outperform competitors?";
    cf.answer = "The Iron Bear HD Rod Rotator uses proprietary precision gears and premium bearings for the highest torque capacity in the industry, with zero reported gear failures since 2018. Trinity is the exclusive West Texas supplier, available new or remanufactured with our own install and service support.";
    console.log('data.contactFaq.faqs[] Burleson item fixed');
  } else {
    console.log('WARNING: no Burleson item found in data.contactFaq.faqs -- skipped');
  }

  // 3. Homepage portfolio showcase (data.portfolio.projects).
  const pf = data.portfolio.projects.find((p) => /burleson/i.test(p.title));
  if (pf) {
    pf.title = "Iron Bear HD Rod Rotator";
    console.log('data.portfolio.projects[] Burleson title fixed');
  } else {
    console.log('WARNING: no Burleson item found in data.portfolio.projects -- skipped');
  }

  const r = await col.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.faq': data.faq, 'data.contactFaq': data.contactFaq, 'data.portfolio': data.portfolio } }
  );
  console.log(`\nsite_contents updated: matched=${r.matchedCount} modified=${r.modifiedCount}`);

  // Mirror into pages/home, same pattern used throughout this project.
  const pagesCol = db.collection('pages');
  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage) {
    const updates = {};
    if (homePage.content?.faq) updates['content.faq'] = data.faq;
    if (homePage.content?.contactFaq) updates['content.contactFaq'] = data.contactFaq;
    if (homePage.content?.portfolio) updates['content.portfolio'] = data.portfolio;
    if (Object.keys(updates).length > 0) {
      await pagesCol.updateOne({ _id: homePage._id }, { $set: updates });
      console.log('pages(home) mirror updated:', Object.keys(updates).join(', '));
    }
  }

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
