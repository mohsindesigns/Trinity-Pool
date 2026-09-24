/* Specialty Rod Pump Solutions: landing page + Gas Pistol + Bypass Cage.
   Idempotent (upserts by slug). Run: node scripts/add_specialty_solutions_2026_09.cjs */
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const IMG = '/images/trinity/specialty/';
const JOSH = {
  name: 'Josh Storey',
  role: 'Shop Manager',
  email: 'josh@trinitypumpsupply.com',
  image: '/images/trinity/team/josh-storey.png',
  label: 'CONTACT FOR ARTIFICIAL LIFT',
};

const FOOT_THEORY =
  'Runtime figures are manufacturer-reported (Tru Lift Supply Inc.) from a 9-well pilot with a major oil company, dated August 5, 2026. ' +
  '4X+ reflects theoretical hydraulic opening power from projected area; actual force depends on net pressure and valve dynamics. ' +
  'Theoretical pressure-area comparison from supplied 1.50-in geometry.';

/* ───────────────────────── Landing ───────────────────────── */
const LANDING = {
  title: 'Specialty Rod Pump Solutions',
  slug: 'specialty-rod-pump-solutions',
  category: 'artificial-lift',
  icon: 'Sparkles',
  image: IMG + 'specialty-hero.jpg',
  overviewImage: IMG + 'specialty-portrait.jpg',
  imageAlt: 'Gas Pistol valve opener and bypass cage trial photo — specialty rod pump solutions',
  description:
    'Gas Pistol™, bypass cages and more — as an independent pump shop we source the rod pump solution that fits each downhole well condition.',
  heroSectionLabel: 'SPECIALTY ROD PUMP SOLUTIONS',
  heroDescription:
    "Every well fights its own battle — gas, solids, wear, deviation. Trinity Pump & Supply is an independent pump shop, so we aren't tied to one product line: we source and recommend the rod pump solution that actually fits your downhole condition.",
  specDurationValue: 'Independent Pump Shop',
  specIntensityValue: 'Matched to Your Well',
  specFocusValue: 'Odessa, TX Shop',
  statsItem1Val: 'Any Brand',
  statsItem1Label: 'Independent — Not Tied to One Line',
  statsItem2Val: 'Any Well',
  statsItem2Label: 'Condition-Matched Solutions',
  statsItem3Val: '150+',
  statsItem3Label: 'Years Combined Experience',
  statsItem4Val: 'TX & NM',
  statsItem4Label: 'Delivery Coverage',
  overviewSectionLabel: 'ONE SHOP. MANY SOLUTIONS.',
  overviewTitle1: 'The Right Fix,',
  overviewTitle2: 'Not the Only Fix.',
  overviewDescription:
    "Because Trinity is independent, we can look across a wide range of rod pump technology and pick what works for the well in front of us — not just what's on one manufacturer's shelf. That flexibility is one of our biggest strengths. Below are the specialty solutions we're proud to put to work, each with its own page.",
  tailoredLabel: 'Independent Pump Shop',
  tailoredSub: 'Sourced for your well',
  overviewSuccessRate: 'ODESSA, TX',
  benefits: [
    { title: 'Independent by Design', description: "We aren't locked into a single brand, so our recommendation follows your downhole condition — not our inventory." },
    { title: 'Matched to the Problem', description: 'Gas lock, solids, wear, deviation — each gets the component built to address it, sized and sourced for your well.' },
    { title: 'Field-Proven, Trial-Backed', description: 'We lean on real results: same-well side-by-side trials and field-wide run-life data, not just brochures.' },
    { title: 'Built Into Your BHA Plan', description: 'A specialty component works best as part of the whole pump and BHA design — we help plan that, start to finish.' },
  ],
  productSections: [
    {
      label: 'SPECIALTY COMPONENTS',
      title1: 'Purpose-Built Solutions for',
      title2: 'Specific Downhole Problems.',
      description: 'Each solution has its own page with the details, the proof, and the wells it fits.',
      tone: 'light',
      cards: [
        {
          title: 'Gas Pistol™ Self-Actuating Valve Opener',
          image: IMG + 'gas-pistol-card.jpg',
          badge: 'GAS INTERFERENCE',
          description:
            'A self-actuating traveling-valve opener that converts lower-chamber pressure into 4X+ theoretical opening power — built for gas lock and gas interference.',
          points: ['Earlier valve opening, more usable stroke', 'Works alongside gas separators and gas top checks'],
          href: '/gas-pistol/',
          cta: 'See the Gas Pistol™',
        },
        {
          title: 'Bypass Cage',
          image: IMG + 'bypass-cage-card.jpg',
          badge: 'SOLIDS HANDLING',
          description:
            'A proven bypass cage that moves solids efficiently — backed by a same-well side-by-side trial and a field-wide jump in average pump run life from 4 months to 1.2 years.',
          points: ['Improved solids handling', 'Helpful in select well conditions'],
          href: '/bypass-cage/',
          cta: 'See the Bypass Cage',
        },
      ],
    },
    {
      label: "DON'T MISS",
      title1: 'More From Our',
      title2: 'Specialty Lineup.',
      description: "Two Iron Bear products we're proud to supply — each has its own page, so be sure to check them out.",
      tone: 'white',
      cards: [
        {
          title: 'HD Plunger',
          image: '/images/trinity/hd-plunger-threaded-top.png',
          badge: 'IRON BEAR',
          description:
            "100% American made with welded Monel pins and up to 3X more wear resistant than a standard spray-metal plunger — priced like the plunger you're already running.",
          href: '/hd-plunger/',
          cta: 'View the HD Plunger',
        },
        {
          title: 'HD Rod Rotator',
          image: '/images/trinity/hd-rod-rotator-closeup.png',
          badge: 'EXCLUSIVE WEST TEXAS SUPPLIER',
          description:
            'A heavy-duty slow-gear rotator that turns the rod string every stroke for even wear on rod guides and longer run life in deviated and horizontal wells.',
          href: '/hd-rod-rotator/',
          cta: 'View the HD Rod Rotator',
        },
      ],
    },
  ],
  candidateSectionLabel: 'WHICH PROBLEM ARE YOU FIGHTING?',
  candidateTitle1: 'Start With the Well.',
  candidateTitle2: "We'll Match the Solution.",
  candidateDescription: 'A quick guide to where our specialty solutions fit.',
  whoProfiles: [
    { label: 'Gas Interference & Gas Lock', desc: 'Gas Pistol™ self-actuating valve opener, alongside gas separators and gas top checks.', suitability: 'GAS' },
    { label: 'Solids & Sand', desc: 'Bypass cages and BHA recommendations to better manage solids and extend pump run life.', suitability: 'SOLIDS' },
    { label: 'Wear & Deviated Wells', desc: 'Iron Bear HD Plunger for wear resistance and the HD Rod Rotator for even rod-guide wear.', suitability: 'WEAR' },
    { label: 'Not Sure Yet?', desc: "Tell us about your well. As an independent shop, we'll source whatever fits — even if it isn't on this page.", suitability: 'ANY WELL' },
  ],
  sessionSteps: [],
  faqBadge: 'FAQ',
  faqTitle: 'Specialty Solutions Questions',
  faq: [
    { question: 'What does "independent pump shop" mean for me?', answer: "Trinity isn't tied to one manufacturer's product line. We source and recommend from a wide range of rod pump solutions, so the component we suggest is the one that fits your downhole well condition." },
    { question: 'Can you recommend a solution for my well?', answer: 'Yes. Tell us about the problem — gas, solids, wear, deviation — and we can help design the pump and BHA and recommend the specialty component that fits.' },
    { question: "What if my problem isn't listed here?", answer: "Call us. Because we're independent, we can source solutions beyond what's shown on this page." },
  ],
  protocolBannerTitlePrefix: 'Got a well that needs a specialty solution',
  protocolBannerTitleSuffix: '?',
  seo: {
    metaTitle: 'Specialty Rod Pump Solutions | Trinity Pump & Supply Odessa TX',
    metaDescription:
      'Independent Odessa, TX pump shop sourcing specialty rod pump solutions — Gas Pistol valve openers, bypass cages, HD plungers and rod rotators — matched to your downhole well condition.',
  },
};

/* ───────────────────────── Gas Pistol ───────────────────────── */
const GAS_PISTOL = {
  title: 'Gas Pistol™',
  slug: 'gas-pistol',
  category: 'specialty-solutions',
  hideFromCatalog: true,
  icon: 'Gauge',
  image: IMG + 'gas-pistol-hero.jpg',
  overviewImage: IMG + 'gas-pistol-portrait.jpg',
  imageAlt: 'Gas Pistol self-actuating traveling-valve opener',
  description: 'Self-actuating traveling-valve opener with 4X+ theoretical opening power for gas interference and gas lock.',
  heroSectionLabel: 'SELF-ACTUATING VALVE OPENER',
  heroDescription:
    "Gas compresses on the pump's downstroke, so the traveling valve opens late — or not at all — wasting stroke and leaving production behind. The Gas Pistol™ converts that same lower-chamber pressure into greater valve-opening power: more opening power, less wasted stroke.",
  specDurationValue: 'Anti-Gas-Lock',
  specIntensityValue: '4X+ Opening Power*',
  specFocusValue: 'Canadian & U.S. Patented',
  statsItem1Val: '4X+',
  statsItem1Label: 'Opening Power (Theoretical)',
  statsItem2Val: '4.46X',
  statsItem2Label: 'More Pressure-Responsive Area',
  statsItem3Val: '157 lbf',
  statsItem3Label: 'Opening Force per 100 psi (vs. 35 lbf)',
  statsItem4Val: '+93.4%',
  statsItem4Label: 'Runtime Gain · Mfr. 9-Well Pilot',
  overviewSectionLabel: 'THE PRESSURE PROBLEM',
  overviewTitle1: 'Gas Compresses.',
  overviewTitle2: 'The Valve Waits.',
  overviewDescription:
    "On the downstroke, gas compresses instead of pushing the traveling valve open — so the valve opens late, or may not open at all. The Gas Pistol™ is more than a gas breaker: it's a self-actuating traveling-valve component that converts the same lower-chamber pressure into greater opening power. Positive opening, every downstroke. It works alongside gas separators and gas top checks.",
  tailoredLabel: 'Anti-Gas-Lock Technology',
  tailoredSub: 'Canadian & U.S. patented',
  overviewSuccessRate: '4X+',
  benefits: [
    { title: 'Earlier Valve Opening', description: 'Converts the same lower-chamber pressure into greater traveling-valve opening power, so the valve opens earlier on the downstroke.' },
    { title: 'More Usable Stroke', description: 'Less stroke wasted waiting for the valve to open — more usable stroke and more consistent valve function.' },
    { title: 'Less System Stress', description: 'Reduced system stress and tubing wear, with less reliance on impact-based gas-lock practices.' },
    { title: 'More Than a Gas Breaker', description: 'A self-actuating traveling-valve component — the ball lifts on the downstroke and seats on the upstroke — that works alongside gas separators and gas top checks.' },
  ],
  factSections: [
    {
      label: 'THE PROOF BEHIND THE ADVANTAGE',
      title1: 'A Smaller Pressure Problem.',
      title2: 'A Bigger Production Opportunity.',
      description: 'The same lower-chamber pressure, converted into far more opening force at the traveling valve.',
      tone: 'dark',
      tiles: [
        { from: '35.26', to: '157.43', fromLabel: 'Standard ball + seat', toLabel: 'Gas Pistol™ response', unit: 'lbf of opening force for each 100 psi of lower-chamber pressure' },
        { value: '4.46X', label: 'More pressure-responsive opening area', note: '+122.2 additional lbf per 100 psi.' },
        { value: '877 psi', label: 'Theoretical Gas Pistol™ match', note: 'vs. 3,915 psi for the seat alone, in a 10,000-ft, 25° API oil example (~1,380 lbf closing load on the traveling ball).' },
      ],
    },
    {
      label: 'REAL-WORLD RUNTIME PROOF',
      title1: 'Positive Opening.',
      title2: 'Proven to Go the Distance.',
      description: 'Manufacturer-reported field results from a 9-well pilot with a major oil company.',
      tone: 'light',
      tiles: [
        { value: '6,500+', label: 'Deployed', note: 'Units in service, per the manufacturer.' },
        { value: '6+', label: 'Countries', note: 'Field-proven across multiple basins worldwide.' },
        { value: '+5,706', label: 'Added runtime days', note: 'Across the 9-well pilot, previous vs. current.' },
        { value: '+93.4%', label: 'Runtime improvement', note: 'Average across the pilot wells.' },
      ],
      footnote: FOOT_THEORY,
    },
  ],
  candidateSectionLabel: 'WHEN TO EQUIP GAS PISTOL™',
  candidateTitle1: 'Built for the Wells That',
  candidateTitle2: 'Fight Gas.',
  candidateDescription: 'Works alongside gas separators and gas top checks.',
  whoProfiles: [
    { label: 'Gas Interference / High GOR', desc: "Wells where free gas compresses on the downstroke and delays the traveling valve's opening.", suitability: 'GOOD FIT' },
    { label: 'Recurring Gas Lock', desc: 'A self-actuating opener to help the valve open positively instead of relying on impact.', suitability: 'GOOD FIT' },
    { label: 'Low Fluid Levels', desc: 'Another condition the Gas Pistol™ is designed for — pair it with your separator and BHA plan.', suitability: 'GOOD FIT' },
    { label: 'Inconsistent Pump Fillage', desc: 'Helps keep valve function consistent when fillage swings from stroke to stroke.', suitability: 'GOOD FIT' },
    { label: 'Move Past Older Approaches', desc: 'Tagging / tapping, critical spacing, stationary probe ball openers, and pressure-trap / release devices.', suitability: 'UPGRADE PATH' },
  ],
  sessionSteps: [],
  galleryImages: [],
  supplierLogos: [{ name: 'Tru Lift Supply Inc.', logoUrl: '/images/trinity/logos/trulift.png', logoBg: 'light' }],
  supplierLogosLabel: 'Made By',
  faqBadge: 'FAQ',
  faqTitle: 'Gas Pistol™ Questions',
  faq: [
    { question: 'What does the Gas Pistol™ do?', answer: "It's a self-actuating traveling-valve opener. It converts lower-chamber pressure into greater opening power so the traveling valve opens earlier on the downstroke, reducing wasted stroke in gassy wells." },
    { question: 'Does it replace my gas separator?', answer: 'No — it works alongside gas separators and gas top checks. We help you build the right combination for your well.' },
    { question: 'Is the 4X+ figure a guaranteed result?', answer: '4X+ reflects theoretical hydraulic opening power from projected area. Actual force depends on net pressure and valve dynamics, so results vary by well — we\'ll tell you honestly whether your well is a good fit.' },
    { question: 'Who makes it?', answer: 'The Gas Pistol™ is Canadian and U.S. patented technology from Tru Lift Supply Inc. Trinity sources it as part of our independent lineup of specialty rod pump solutions.' },
  ],
  protocolBannerTitlePrefix: 'Want a Gas Pistol™ evaluated for your well',
  protocolBannerTitleSuffix: '?',
  seo: {
    metaTitle: 'Gas Pistol™ Self-Actuating Valve Opener | Trinity Pump & Supply',
    metaDescription:
      'Gas Pistol™ self-actuating traveling-valve opener — 4X+ theoretical opening power for gas interference and gas lock. Sourced by Trinity Pump & Supply, Odessa TX.',
  },
};

/* ───────────────────────── Bypass Cage ───────────────────────── */
const BYPASS = {
  title: 'Bypass Cage',
  slug: 'bypass-cage',
  category: 'specialty-solutions',
  hideFromCatalog: true,
  icon: 'Filter',
  image: IMG + 'bypass-cage-hero.jpg',
  overviewImage: IMG + 'bypass-cage-portrait.jpg',
  imageAlt: 'Bypass cage vs. competitor insert cage from a same-well side-by-side trial',
  description: 'A proven solids-handling cage — same-well trial results and a field-wide jump in run life from 4 months to 1.2 years.',
  heroSectionLabel: 'SOLIDS HANDLING',
  heroDescription:
    "In a same-well side-by-side trial, the bypass cage moved solids efficiently while a competitor's insert cage repeatedly failed to. It's a proven component to add in the right solids-handling situations.",
  specDurationValue: 'Solids Handling',
  specIntensityValue: 'Same-Well Trial Proven',
  specFocusValue: 'Built Into Your BHA Plan',
  statsItem1Val: '1.2 yrs',
  statsItem1Label: 'Field-Avg Pump Run Life',
  statsItem2Val: '4 mo',
  statsItem2Label: 'Previous Average (Before)',
  statsItem3Val: 'Same-Well',
  statsItem3Label: 'Side-by-Side Trial',
  statsItem4Val: '3 yrs',
  statsItem4Label: 'Field-Wide Result Period',
  overviewSectionLabel: 'PERFORMANCE YOU CAN SEE',
  overviewTitle1: 'Move the Solids.',
  overviewTitle2: 'Extend the Run.',
  overviewDescription:
    "An operator's field averaged just 4 months of pump run life after cycling through several rod pump shops. After switching to Trinity, changing to bypass cages, and making a few BHA recommendations to better manage solids, the field's average pump run life improved from 4 months to 1.2 years over a 3-year period.",
  tailoredLabel: 'Bypass Cage',
  tailoredSub: 'Moved solids efficiently',
  overviewSuccessRate: '1.2 YRS',
  benefits: [
    { title: 'Improved Solids Handling', description: 'In a same-well side-by-side trial, the bypass cage demonstrated superior solids handling while the competitor insert cage repeatedly failed to move solids efficiently.' },
    { title: 'Extended Pump Run Life', description: "One field's average pump run life went from 4 months to 1.2 years over a 3-year period after moving to Trinity, bypass cages, and a few BHA recommendations." },
    { title: 'Helpful in Select Well Conditions', description: "It's a proven component to add in the right solids-handling situations — we'll tell you honestly whether your well is one of them." },
    { title: 'Part of the Whole BHA', description: 'Solids are managed by the full pump and BHA design, not one part alone — we help plan the whole string.' },
  ],
  factSections: [
    {
      label: 'FIELD-WIDE RESULTS',
      title1: 'From Months',
      title2: 'to Years.',
      description: 'What changed when one operator moved to Trinity and bypass cages.',
      tone: 'dark',
      tiles: [
        { from: '4 mo', to: '1.2 yrs', fromLabel: 'Average pump run life before', toLabel: 'After Trinity + bypass cages', unit: "Field-wide result for one oil and gas operator over a 3-year period." },
        { value: '3 yrs', label: 'Field-wide period', note: 'How long the improvement was tracked.' },
        { value: 'Same-Well', label: 'Side-by-side trial', note: 'Bypass cage vs. a competitor insert cage in the same well.' },
      ],
      footnote: "Results reflect Trinity's field experience with one operator and a same-well trial; performance varies with well conditions. The bypass cage is helpful in select well conditions.",
    },
  ],
  infographic: {
    src: IMG + 'bypass-cage-infographic.jpg',
    alt: 'Same-well side-by-side trial: bypass cage proven to move solids efficiently, plus field-wide results improving pump run life from 4 months to 1.2 years.',
    label: 'THE TRIAL',
    title1: 'See the Same-Well',
    title2: 'Side-by-Side Trial.',
    caption: 'Performance you can see. Reliability you can trust.',
  },
  candidateSectionLabel: 'WHEN A BYPASS CAGE MAKES SENSE',
  candidateTitle1: 'The Right Cage for',
  candidateTitle2: 'the Right Solids Problem.',
  candidateDescription: 'A proven component — added where it fits, not everywhere.',
  whoProfiles: [
    { label: 'Solids-Heavy Wells', desc: 'Where solids repeatedly foul standard or insert-style cages and cut pump run life.', suitability: 'GOOD FIT' },
    { label: 'Short Pump Runs', desc: 'Fields averaging months instead of years — one operator moved from a 4-month average to 1.2 years.', suitability: 'GOOD FIT' },
    { label: 'Pair With BHA Changes', desc: 'Bypass cage plus a few BHA recommendations to better manage solids.', suitability: 'BEST RESULTS' },
    { label: 'Select Well Conditions', desc: "Not a cure-all. It's a proven component for the right solids-handling situations — we'll help you decide.", suitability: 'CASE BY CASE' },
  ],
  sessionSteps: [],
  galleryImages: [],
  faqBadge: 'FAQ',
  faqTitle: 'Bypass Cage Questions',
  faq: [
    { question: 'When should I use a bypass cage?', answer: 'In the right solids-handling situations — wells where solids are shortening pump run life. It is helpful in select well conditions, and we will help you decide if yours is one.' },
    { question: 'Does a bypass cage fix every solids problem?', answer: 'No. It is one proven component. In the field-wide result, it was paired with a switch to Trinity and a few BHA recommendations to better manage solids.' },
    { question: 'What results have you seen?', answer: "In a same-well side-by-side trial the bypass cage moved solids efficiently while a competitor's insert cage repeatedly failed to. Field-wide, one operator's average pump run life improved from 4 months to 1.2 years over a 3-year period." },
  ],
  protocolBannerTitlePrefix: 'Fighting solids and short pump runs',
  protocolBannerTitleSuffix: '?',
  seo: {
    metaTitle: 'Bypass Cage for Solids Handling | Trinity Pump & Supply Odessa TX',
    metaDescription:
      'Bypass cage proven in a same-well side-by-side trial to move solids efficiently. One field improved average pump run life from 4 months to 1.2 years. Trinity Pump & Supply, Odessa TX.',
  },
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const doc = await db.collection('site_contents').findOne({ key: 'complete_data' });
  const d = doc.data;
  const services = d.services.services;

  const entries = [LANDING, GAS_PISTOL, BYPASS];
  let idSeed = Date.now();
  for (const e of entries) {
    const { seo, ...item } = e;
    const existing = services.findIndex((s) => s.slug === e.slug);
    const record = { ...item, id: existing >= 0 ? services[existing].id : String(idSeed++), status: 'published', seo: { ...(existing >= 0 ? services[existing].seo : {}), ...seo, canonicalUrl: 'https://trinitypumpsupply.com/' + e.slug + '/', metaRobotsIndex: 'index', metaRobotsFollow: 'follow' } };
    if (existing >= 0) services[existing] = record;
    else if (e.slug === LANDING.slug) {
      // last artificial-lift item, so it lands last in the Artificial Lift menu
      let lastAL = -1;
      services.forEach((s, i) => { if (s.category === 'artificial-lift') lastAL = i; });
      services.splice(lastAL + 1, 0, record);
    } else services.push(record);
  }

  d.services.categoryLabels = { ...(d.services.categoryLabels || {}), 'specialty-solutions': 'Specialty Solutions' };
  d.services.categoryContacts = { ...(d.services.categoryContacts || {}), 'specialty-solutions': JOSH };

  // Quote / contact form service options
  const addOpt = (arr, label, value) => { if (Array.isArray(arr) && !arr.some((o) => o.value === value)) arr.push({ label, value }); };
  for (const e of entries) addOpt(d.quote && d.quote.services, e.title, e.slug);
  for (const e of entries) addOpt(d.contactFaq && d.contactFaq.formServicesOptions, e.title, e.slug);

  await db.collection('site_contents').updateOne({ key: 'complete_data' }, { $set: { data: d, lastUpdated: new Date() } });

  // Page docs (thin, matching the existing service pages: SEO + images)
  for (const e of entries) {
    const set = {
      title: e.title,
      template: 'service-detail',
      status: 'published',
      isTrashed: false,
      featuredImage: e.image,
      seo: { ...e.seo, canonicalUrl: 'https://trinitypumpsupply.com/' + e.slug + '/', metaRobotsIndex: 'index', metaRobotsFollow: 'follow' },
      content: { image: e.image, imageAlt: e.imageAlt, overviewImage: e.overviewImage, galleryImages: e.galleryImages || [] },
      updatedAt: new Date(),
    };
    await db.collection('pages').updateOne({ slug: e.slug }, { $set: set, $setOnInsert: { slug: e.slug, createdAt: new Date() } }, { upsert: true });
  }

  // Artificial Lift landing: add Specialty to the sub-page index
  const al = await db.collection('pages').findOne({ slug: 'artificial-lift' });
  if (al && Array.isArray(al.content.subPages) && !al.content.subPages.some((p) => p.slug === LANDING.slug)) {
    al.content.subPages.push({ title: LANDING.title, slug: LANDING.slug, description: 'Gas Pistol™, bypass cages and more — sourced for your downhole condition.', icon: 'Sparkles' });
    await db.collection('pages').updateOne({ slug: 'artificial-lift' }, { $set: { 'content.subPages': al.content.subPages, updatedAt: new Date() } });
  }

  const fresh = await db.collection('site_contents').findOne({ key: 'complete_data' });
  await db.collection('pages').updateMany({ $or: [{ slug: 'home' }, { slug: '/' }, { template: 'home' }] }, { $set: { content: fresh.data, updatedAt: new Date() } });

  console.log('catalogue order:', fresh.data.services.services.map((s) => s.slug).join(', '));
  await client.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
