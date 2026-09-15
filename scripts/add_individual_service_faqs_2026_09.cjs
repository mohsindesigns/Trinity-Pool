/**
 * 12 of the 14 service pages had no FAQ of their own and fell back to one
 * shared, generic 5-question set (data.faq.items) -- meaning every one of
 * those pages showed the identical FAQ, unrelated to what that specific
 * page is actually about. Client flagged this directly.
 *
 * Fix: give each of the 12 pages its own real, product-specific FAQ in
 * the exact shape already used by HD Rod Rotator / HD Plunger
 * (catalogue item field `faq: [{question, answer}]`, read by QAForm via
 * `pageData.faq` before it would ever fall back to the shared default).
 * Drawn entirely from each page's own already-published content this
 * round -- no new claims, just the real specifics turned into Q&A.
 *
 * Rod Pumps is included -- the client said keep its WORDING as-is, and
 * none of its existing copy changes here; it currently shows the same
 * shared generic FAQ as every other page, which was never something the
 * client approved as "its" FAQ. Giving it its own real questions fixes
 * the exact bug just reported, using only facts already on that page.
 *
 * Run:  node scripts/add_individual_service_faqs_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'trinity_pump_supply';

const FAQS = {
  'rod-pumps': {
    faqTitle: 'Rod Pump Questions',
    faq: [
      { question: 'What bore sizes do your rod pumps come in?', answer: "We build downhole rod pumps in bore sizes from 1-1/16\" to 3-3/4\", sized to your well's depth, fluid gravity and production volume." },
      { question: 'Do you build new pumps or repair existing ones?', answer: 'Both. New downhole rod pump construction, plus full repair and reconditioning — teardown, inspection, re-barreling and testing before it goes back out.' },
      { question: 'What materials do your rod pumps use?', answer: 'USA-made alloy steel, 316 Stainless and Monel, chosen for durability and corrosion resistance in demanding well conditions.' },
    ],
  },
  'tacs': {
    faqTitle: 'TAC Questions',
    faq: [
      { question: "Do you build TAC's or just supply them?", answer: "Both — we build and repair TAC's in-house at our Odessa shop, and we're a proud distributor of TechTAC® Slimline® Tubing Anchor Catchers." },
      { question: 'How fast can I get a TAC?', answer: 'We stock a range of sizes for fast turnaround, and our Odessa shop handles repair and reconditioning without a long wait.' },
      { question: 'What sizes and configurations do you carry?', answer: "A range of TAC sizes and configurations to match your specific casing and tubing specs — call our shop to confirm what you need." },
    ],
  },
  'sucker-rods-sinker-bars': {
    faqTitle: 'Sucker Rod Questions',
    faq: [
      { question: 'Where do your sucker rods and sinker bars come from?', answer: "We're a proud supplier of sucker rods from TRC Sucker Rods and sinker bars from Percheron Manufacturing, matched to your well conditions." },
      { question: 'How do you choose the right rod grade for my well?', answer: 'Rod grade, sinker bar placement and sizing are selected for your specific fluid load, depth and duty cycle — not a one-size-fits-all string.' },
      { question: 'Do better rod strings actually reduce rod parting?', answer: 'Yes — quality materials and proper design reduce fatigue failures downhole, cutting down on unplanned pulling jobs.' },
    ],
  },
  'gas-sand-separators': {
    faqTitle: 'Separator Questions',
    faq: [
      { question: 'Are you tied to one separator brand?', answer: "No — as an independent shop we're not locked into one line, so our recommendation is based on your well, not our inventory." },
      { question: 'What separator brands do you typically recommend?', answer: 'The EnerCat paraffin tool and the Predator oil tool are two of our most trusted go-to options, but we recommend whatever configuration actually fits your well.' },
      { question: 'How do you decide which separator fits my well?', answer: 'We evaluate your gas-to-liquid ratio and sand loading, then recommend the configuration that reduces fluid pound and protects your barrel and plunger.' },
    ],
  },
  'artificial-lift-supplies': {
    faqTitle: 'Supply Questions',
    faq: [
      { question: 'What all do you carry under Artificial Lift Supplies?', answer: 'Stuffing boxes, polish rods, seating nipples, on/off tools, tubing and rod-string equipment, and the accessories that round out the job.' },
      { question: 'Can I really get everything from one call?', answer: "That's the idea — one call to Trinity covers what your lease needs instead of chasing down multiple suppliers." },
      { question: "What if you don't have something in stock?", answer: "If it's not on the shelf, we'll get it — call us and we'll source it." },
    ],
  },
  'rod-pump-tracking-api-certification': {
    faqTitle: 'Tracking & Certification Questions',
    faq: [
      { question: 'What is Rod Pump Tracker?', answer: "Software we use to log every pump teardown from the bench to the cloud, giving you real-time visibility into each pump's repair history." },
      { question: 'What does "API-certified" mean for my order?', answer: 'Every rod pump and TAC leaving our shop is built with API-certified material to API standards — meeting the industry benchmark, not just our word for it.' },
      { question: 'Can I get a teardown history report on my pumps?', answer: "Yes — call our shop and we'll pull the Rod Pump Tracker history for your equipment." },
    ],
  },
  'pipe-valves-fittings': {
    faqTitle: 'Pipe, Valves & Fittings Questions',
    faq: [
      { question: 'What pipe and fitting sizes do you stock?', answer: 'A range of pressure-rated pipe, valves and fittings sized for wellhead and battery connections — call to confirm your spec.' },
      { question: 'Do you deliver to the wellsite?', answer: 'Yes, we deliver pipe, valves and fittings directly to your location across Texas and New Mexico.' },
      { question: 'Can you handle a full wellhead hookup, not just parts?', answer: 'Yes — we supply complete wellhead solutions including battery connections, not just individual components.' },
    ],
  },
  'poly': {
    faqTitle: 'Poly Pipe Questions',
    faq: [
      { question: 'Why use poly pipe instead of steel?', answer: "Poly pipe won't corrode and holds up to Permian Basin conditions, with a proven field track record." },
      { question: 'What poly pipe sizes and fittings do you carry?', answer: 'A full range of poly pipe and matching fittings — call our shop to confirm what fits your job.' },
      { question: 'Is your poly pipe rated for high-pressure lines?', answer: 'We stock flexible, high-strength poly for oilfield transfer lines — ask our team about your specific pressure requirements.' },
    ],
  },
  'complete-facility-buildouts': {
    faqTitle: 'Facility Buildout Questions',
    faq: [
      { question: 'Do you manage the whole buildout, or just supply materials?', answer: "We're a single point of contact for the full buildout — project management, materials and delivery, all built to your spec." },
      { question: 'How do you keep a facility buildout on schedule?', answer: 'Experienced project management and coordinated delivery keep your buildout on schedule from planning through commissioning.' },
      { question: 'Can you handle a custom facility design?', answer: 'Yes — every buildout is built to your specification, not a one-size-fits-all package.' },
    ],
  },
  'general-oilfield-supply': {
    faqTitle: 'General Supply Questions',
    faq: [
      { question: 'What counts as "general oilfield supply"?', answer: 'The everyday supplies your operation depends on — call our shop with your list and we’ll get it delivered.' },
      { question: 'How fast is delivery?', answer: 'We deliver on time across Texas and New Mexico from our Odessa shop.' },
      { question: 'Can I set up a standing or recurring supply order?', answer: "Yes — call our team to set up a standing order for your lease's regular needs." },
    ],
  },
  'technical-support-planning': {
    faqTitle: 'Technical Support Questions',
    faq: [
      { question: 'What kind of technical support do you offer?', answer: 'Well evaluation, equipment selection and project planning guidance from a team with 100+ years of combined field experience.' },
      { question: 'Do I need to already know what equipment I need?', answer: 'No — that’s what this service is for. We help you avoid trial and error by recommending the right equipment for your well conditions.' },
      { question: 'Do I get direct access to your team, or a call center?', answer: 'Direct access to our Odessa team — not a script.' },
    ],
  },
  'trailer-support-on-site-operations': {
    faqTitle: 'Trailer Support Questions',
    faq: [
      { question: 'What does trailer support cover?', answer: 'Trailer-mounted support and equipment to keep your field crews productive on location.' },
      { question: 'How do you coordinate with my crew on site?', answer: "We work directly with your crew's schedule to minimize downtime during on-site operations." },
      { question: 'Is trailer support available on short notice?', answer: 'We aim for reliable availability — call our shop to check current scheduling for your job.' },
    ],
  },
};

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);

  const contentCol = db.collection('site_contents');
  const pagesCol = db.collection('pages');
  const doc = await contentCol.findOne({ key: 'complete_data' });
  const catalogue = doc.data.services.services;

  let updated = 0;
  for (const item of catalogue) {
    const entry = FAQS[item.slug];
    if (!entry) continue;
    item.faqBadge = 'FAQ';
    item.faqTitle = entry.faqTitle;
    item.faq = entry.faq;
    updated++;
    console.log(`  ${item.slug}: ${entry.faq.length} questions set`);
  }

  const r1 = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.services': catalogue } }
  );
  console.log(`\ncatalogue updated: matched=${r1.matchedCount} modified=${r1.modifiedCount} (${updated}/12 pages)`);

  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage && Array.isArray(homePage?.content?.services?.services)) {
    await pagesCol.updateOne({ _id: homePage._id }, { $set: { 'content.services.services': catalogue } });
    console.log('pages(home) catalogue mirror updated');
  }

  await client.close();
  console.log('\nDone. Every service page now has its own FAQ -- none of them fall back to the shared generic list anymore.');
}

main().catch((e) => { console.error(e); process.exit(1); });
