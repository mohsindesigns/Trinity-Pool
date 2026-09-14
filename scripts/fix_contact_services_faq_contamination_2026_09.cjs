/**
 * Fix severe leftover contamination found on 3 more live pages during the
 * final "everything dynamic, everything complete" audit (same root cause
 * as about-us: original massage-therapy template content, in Timonium MD /
 * O'Fallon MO, never replaced when the site was customized for Trinity
 * Pump & Supply).
 *
 * contact-us: the page's own info cards (Phone/Email/Address) showed a
 * fabricated Missouri address, a fake email, and a wrong phone number --
 * live and visible, confirmed via curl, DESPITE the navbar's separate
 * "Call Now" button correctly showing the real Texas number. A customer
 * visiting the page directly would see the wrong contact info in the main
 * content area.
 *
 * services (the real "/services/" index, linked from the main nav as
 * "Projects / Supplies"): whyChooseUs section, ctaBanner (fake phone
 * 443-473-2322, a styleseat.com spa-booking link), and all 5 inline FAQs
 * were 100% massage-therapy content -- all confirmed live via curl.
 * content.process was leftover unfinished placeholder data (literally
 * "test" in every field) but confirmed NOT read by ServicesTemplate.tsx --
 * removed for hygiene, zero live impact either way.
 *
 * faq (the dedicated FAQ page): description and all 6 FAQs were massage-
 * therapy content, including one FAQ whose answer states the business is
 * located at "1301 York Rd., 8th Floor, Ste 48, Timonium, MD 21093" --
 * confirmed live via curl.
 *
 * Run:  node scripts/fix_contact_services_faq_contamination_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';

const REAL_PHONE = '830-279-3996';
const REAL_EMAIL = 'trinitypumpsupply@gmail.com';
const REAL_ADDRESS = '4608 Gist Ave, Odessa, TX 79764';

const SERVICES_FAQS = [
  {
    question: 'What makes Trinity Pump & Supply different?',
    answer: "<p>We're a family-run shop with 100+ years of combined experience, building and repairing artificial lift equipment with USA-made materials -- not a big-box supplier reading from a script.</p>",
  },
  {
    question: 'Do you only sell rod pumps, or do you handle the full artificial lift picture?',
    answer: "<p>The full picture. From rod pumps and TAC's to sucker rods, gas/sand separators and general artificial lift supplies, one call to Trinity covers what your lease needs.</p>",
  },
  {
    question: 'How do I know which product or service fits my well?',
    answer: "<p>Call our shop and talk to our team -- we'll walk through your well conditions and recommend the right equipment, not just what's on the shelf.</p>",
  },
  {
    question: 'Do you serve wells outside of Odessa?',
    answer: '<p>Yes -- we deliver and support operations across Texas and New Mexico from our Odessa shop.</p>',
  },
  {
    question: 'How do I request a quote?',
    answer: `<p>Call ${REAL_PHONE}, email ${REAL_EMAIL}, or use our contact form to request a quote on any product or service.</p>`,
  },
];

const FAQ_PAGE_FAQS = [
  {
    question: 'What areas does Trinity Pump & Supply serve?',
    answer: '<p>We serve oilfield operators across Texas and New Mexico, with our shop based in Odessa, TX at the heart of the Permian Basin.</p>',
  },
  {
    question: 'What kind of equipment do you build and repair?',
    answer: "<p>We build, repair and supply downhole rod pumps, tubing anchor catchers (TAC's), sucker rods and sinker bars, gas and sand separators, and a full range of artificial lift supplies -- plus the Iron Bear HD Rod Rotator and HD Plunger.</p>",
  },
  {
    question: 'What materials do you use in your pump parts?',
    answer: '<p>We use USA-made alloy steel, 316 Stainless and Monel for our downhole components, chosen for durability and corrosion resistance in demanding well conditions.</p>',
  },
  {
    question: 'How do you track and certify your pumps?',
    answer: "<p>Every rod pump teardown is logged with Rod Pump Tracker software, and our rod pumps and TAC's are built with API-certified material to API standards.</p>",
  },
  {
    question: 'How fast can you turn around a repair or new build?',
    answer: '<p>Turnaround depends on the job, but our Odessa shop keeps in-stock inventory and a dedicated team to get your equipment back in service as quickly as possible -- call us to talk about your specific timeline.</p>',
  },
  {
    question: 'Where is Trinity Pump & Supply located?',
    answer: `<p>Our shop is located at ${REAL_ADDRESS}. Call us at ${REAL_PHONE} or email ${REAL_EMAIL}.</p>`,
  },
];

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);
  const pagesCol = db.collection('pages');

  // ---- contact-us ----
  const r1 = await pagesCol.updateOne(
    { slug: 'contact-us' },
    {
      $set: {
        'content.contactPage.info': { phone: REAL_PHONE, email: REAL_EMAIL, address: REAL_ADDRESS, hours: '' },
        'content.contactPage.header': {
          badge: 'GET IN TOUCH',
          headline: 'Contact Trinity Pump & Supply',
          description: "Have a question about a product, need a quote, or want to talk through your well's artificial lift setup? Reach out and our Odessa team will get back to you.",
        },
        'content.address': REAL_ADDRESS,
        'content.email': REAL_EMAIL,
        'content.phone': REAL_PHONE,
      },
    }
  );
  console.log(`contact-us updated: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);

  // ---- services (index) ----
  const r2 = await pagesCol.updateOne(
    { slug: 'services' },
    {
      $set: {
        'content.whyChooseUs.section': {
          badge: 'WHY TRINITY',
          headline: 'Why Operators Choose Trinity Pump & Supply',
          description: "We're a family-run oilfield equipment shop with 100+ years of combined experience -- not a call center reading from a script. Every rod pump, TAC and sucker rod we build or supply uses USA-made materials matched to your well conditions, backed by a team that answers the phone and shows up. From Odessa, we deliver and support operators across Texas and New Mexico, focused on lowering your lifting costs and keeping your wells producing.",
        },
        'content.ctaBanner': {
          tagline: 'Get Started',
          title: 'Ready to Lower Your Lifting Costs?',
          description: `Call ${REAL_PHONE} or request a quote online and our Odessa shop will help you find the right equipment for your well.`,
          button: 'Request a Quote',
          btnUrl: '/contact-us/',
        },
        'content.faqs': SERVICES_FAQS,
      },
      $unset: { 'content.process': '' },
    }
  );
  console.log(`services updated: matched=${r2.matchedCount} modified=${r2.modifiedCount}`);

  // ---- faq (dedicated page) ----
  const r3 = await pagesCol.updateOne(
    { slug: 'faq' },
    {
      $set: {
        'content.description': 'Everything you need to know about our artificial lift equipment, service area, and how to get a quote.',
        'content.faqs': FAQ_PAGE_FAQS,
      },
    }
  );
  console.log(`faq updated: matched=${r3.matchedCount} modified=${r3.modifiedCount}`);

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
