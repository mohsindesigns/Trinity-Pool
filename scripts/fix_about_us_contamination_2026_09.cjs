/**
 * Fix severe leftover contamination found on the live About Us page during
 * the final "everything dynamic, everything complete" audit.
 *
 * Root cause: this page's `content` still carried several fields verbatim
 * from the CMS's original massage-therapy/decking template, never
 * replaced when the site was customized for Trinity Pump & Supply:
 *
 *  - content.services (182KB, 10 items) -- a full duplicate "capabilities"
 *    section for a residential decking/roofing/fencing business
 *    ("Residential massage therapy", "Custom Decks", "PVC Decking",
 *    "Vinyl & Aluminum Fencing", real deck/roof/fence stock photos). This
 *    rendered directly and visibly on the live page (confirmed via
 *    screenshot) in the "Our Capabilities" section, since AboutTemplate's
 *    ServicesSection prefers a non-empty featuredServices array over its
 *    own real-catalogue fallback.
 *  - content.mission / content.story -- both plain strings (massage-
 *    therapy/sports-recovery copy) where AboutTemplate's MissionSection
 *    and FounderStory expect an OBJECT ({badge, headline, description,
 *    ...}). Because every field access uses optional chaining, this
 *    didn't crash -- it silently rendered both sections almost entirely
 *    blank (confirmed via screenshot: no headline, no description, no
 *    founder name/bio, just decorative wrapper chrome).
 *  - content.titleLine1/titleLine2/label -- "Specialized Recovery" /
 *    "Bodywork." / leftover wording. Confirmed dead/unread anywhere in
 *    AboutTemplate.tsx, so zero live impact, but cleaned up anyway so
 *    nothing wrong-industry lingers in the data an admin might see.
 *
 * NOT touched: content.commitments, content.whyChoose, content.team,
 * content.philosophy, content.description -- all independently verified
 * as genuine, correct Trinity-specific content (including the real team:
 * Olin Brown, Sim Brown, Josh Storey). Also not touched: the founder
 * portrait image (src/assets/ownerupdatedimage.jpeg) -- that's a real
 * personal photo, not template garbage, and swapping it out is not this
 * audit's call to make.
 *
 * Run:  node scripts/fix_about_us_contamination_2026_09.cjs
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

  const pagesCol = db.collection('pages');
  const page = await pagesCol.findOne({ slug: 'about-us' });
  if (!page) throw new Error('about-us page not found -- aborting');

  const beforeServicesLen = JSON.stringify(page.content.services || []).length;

  const mission = {
    badge: 'OUR MISSION',
    headline: 'Built on Reliability.',
    highlight: 'Reliability.',
    description: "Our mission is to keep Permian Basin operators producing -- supplying and building USA-made artificial lift equipment that lowers lifting costs and extends the life of every well we touch.",
    stats: [],
    principles: [
      { title: 'USA-Made Materials', val: '100%', desc: 'Alloy steel, 316 Stainless and Monel components built for durability and corrosion resistance.', icon: 'ShieldCheck' },
      { title: 'Lower Lifting Costs', val: 'USA', desc: 'Longer equipment runs mean fewer pulls, less downtime and lower cost per barrel.', icon: 'TrendingDown' },
      { title: 'Odessa, TX Shop', val: 'TX & NM', desc: 'A local shop team and dependable delivery across Texas and New Mexico keep your lease on schedule.', icon: 'Truck' },
      { title: 'Tracked & Certified', val: 'API', desc: 'Rod Pump Tracker software and API-certified materials on every build.', icon: 'ClipboardCheck' },
    ],
  };

  const story = {
    badge: 'OUR STORY',
    headline: 'Family-Run, ',
    highlight: 'Field-Proven.',
    description: "Trinity Pump & Supply is a family-run shop built by people who've spent their careers in the Permian Basin oilfield. We build, repair and supply the artificial lift equipment that keeps Texas and New Mexico wells producing -- backed by real people who answer the phone and show up.",
    founder: {
      name: 'Olin Brown',
      title: 'President',
      quote: "We treat every pump like it's going down our own well.",
      bio: 'Olin leads Trinity Pump & Supply with a hands-on approach built from years in the Permian Basin oilfield. His focus: quality parts, honest pricing, and a shop that answers the phone.',
      secondaryQuote: '',
      footer: 'Olin Brown, President',
      email: 'trinitypumpsupply@gmail.com',
      social: { linkedin: '' },
    },
  };

  const r = await pagesCol.updateOne(
    { slug: 'about-us' },
    {
      $set: {
        'content.services': [],
        'content.mission': mission,
        'content.story': story,
        'content.titleLine1': '',
        'content.titleLine2': '',
        'content.label': 'Our Story',
      },
    }
  );
  console.log(`about-us page updated: matched=${r.matchedCount} modified=${r.modifiedCount}`);
  console.log(`content.services: ${beforeServicesLen} bytes of wrong-industry data -> [] (falls back to the real 6 published services automatically)`);
  console.log('content.mission and content.story reshaped from plain strings into the objects AboutTemplate.tsx actually reads.');

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
