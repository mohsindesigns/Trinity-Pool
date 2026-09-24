/* Run AFTER add_specialty_solutions_2026_09.cjs. Idempotent.
   - Adds the Premium SRP Sand Deflection System product page
   - Upgrades Gas Pistol with a native force chart, the flyer's runtime charts and its tagline
   - Adds the third product card to the Specialty Rod Pump Solutions landing page */
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const IMG = '/images/trinity/specialty/';

/* ───────────── Sand Deflection System ───────────── */
const SAND = {
  title: 'Premium SRP Sand Deflection System',
  slug: 'sand-deflection-system',
  category: 'specialty-solutions',
  hideFromCatalog: true,
  icon: 'Filter',
  image: IMG + 'sand-deflection-hero.jpg',
  overviewImage: IMG + 'sand-deflection-portrait.jpg',
  imageAlt: 'Premium SRP Sand Deflection System plunger assembly',
  description: 'Patented two-part system — Prime Sand Deflector™ and SandMover™ — that captures solids on the upstroke and flushes them on the downstroke.',
  heroSectionLabel: 'PRIME SAND DEFLECTOR™ + SANDMOVER™',
  heroDescription:
    'Maximize runtime. Beat the sand. A patented, modular plunger system that captures settling solids on the upstroke and actively flushes them upward and away on the downstroke — with a SandMover™ seat plug that assists solids through the traveling ball and seat.',
  specDurationValue: 'Patented Technology',
  specIntensityValue: 'Captures & Flushes Solids',
  specFocusValue: 'Fits Common Pump Configs',
  statsItem1Val: '3',
  statsItem1Label: 'Coordinated Solids Actions',
  statsItem2Val: '2 Parts',
  statsItem2Label: 'Deflector + SandMover™ Seat Plug',
  statsItem3Val: 'Custom Fit',
  statsItem3Label: '-0.003 in to -0.010 in',
  statsItem4Val: 'Patented',
  statsItem4Label: 'Tru Lift Technology',
  overviewSectionLabel: 'CONTROLLED SOLIDS MOVEMENT',
  overviewTitle1: 'Capture on the Upstroke.',
  overviewTitle2: 'Flush on the Downstroke.',
  overviewDescription:
    'Solids hurt pump run life — they settle on top of the plunger, wear the leading edge and hang up the valve. The Premium SRP Sand Deflection System gives them a direct path out: the Prime Sand Deflector™ captures settling solids and uses port flow to flush them upward and away, while the SandMover™ seat plug drives solids through the traveling ball and seat with minimal restriction.',
  tailoredLabel: 'Patented Technology',
  tailoredSub: 'Tru Lift Supply Inc.',
  overviewSuccessRate: 'D + E + I',
  benefits: [
    { title: 'Cleaner Leading Edge', description: "Wash-out ports clear accumulated solids away from the top of the plunger, helping keep material from reaching the plunger's leading edge." },
    { title: 'Reduced Abrasive Contact', description: 'A tighter-fitted hopper with a hardened coating helps stop solids slipping past the assembly.' },
    { title: 'Fewer Solids Hang-Ups', description: 'A dedicated flow path gives collected solids a direct cleanout route, and the SandMover™ drives them through the traveling valve with minimal restriction.' },
    { title: 'More Stable Pump Cycling', description: 'Capture, flush and downstroke thrust work together to keep solids moving through the full stroke cycle.' },
    { title: 'Extended Run-Life Potential', description: 'Less solids build-up and fewer abrasive contact points point toward longer runs — results vary with well conditions.' },
  ],
  pageBlocks: [
    {
      type: 'spec',
      tone: 'light',
      label: 'SYSTEM ARCHITECTURE',
      title1: 'Plunger',
      title2: 'Configuration.',
      description: 'A modular layout designed to integrate with common rod-pump and plunger configurations.',
      figure: { src: IMG + 'sand-config-diagram.jpg', alt: 'Plunger configuration diagram with components A through I labelled' },
      list: [
        { key: 'A', text: 'Bushing — valve rod or HVR bushing' },
        { key: 'B', text: 'Rod — valve rod or hollow pull tube' },
        { key: 'C', text: 'Plunger adapter — valve rod or HVR' },
        { key: 'D', text: 'Prime Sand Deflector™ vent shaft', highlight: true },
        { key: 'E', text: 'Prime Sand Deflector™ hopper', highlight: true },
        { key: 'F', text: 'Grooved plunger — multiple options' },
        { key: 'G', text: 'Closed plunger cage' },
        { key: 'H', text: 'Ball and seat valve' },
        { key: 'I', text: 'SandMover™ seat plug', highlight: true },
      ],
      callout: { label: 'SYSTEM-REQUIRED COMPONENTS', big: 'D + E + I', text: 'Prime Sand Deflector™ + SandMover™ seat plug' },
      rowsTitle: 'BUILD OPTIONS',
      rows: [
        { label: 'Materials', value: 'Alloy 400  |  316L stainless steel  |  4140' },
        { label: 'Coatings', value: 'Spray metal  |  Nitrided finish' },
        { label: 'Custom fit', value: '-0.003 in to -0.010 in' },
      ],
      notes: [
        { title: 'Installation', text: 'The Prime Sand Deflector™ is a two-piece assembly installed between the top of the plunger and the coupling above it.' },
        { title: 'Compatibility', text: 'Valve rod, hollow pull tube, oversize and tubing pumps. Converts standard PE plunger types.' },
      ],
    },
    {
      type: 'figures',
      tone: 'white',
      label: 'OPERATING PRINCIPLE',
      title1: 'How the System',
      title2: 'Works.',
      description: 'Three coordinated actions help keep solids moving and protect the pump through the full stroke cycle.',
      points: [
        { num: '1', title: 'Self-Cleaning Sand Catch', text: "Stage one uses wash-out ports to clear accumulated solids away from the top of the plunger, helping prevent material from reaching the plunger's leading edge." },
        { num: '2', title: 'Drop-In Hopper + Venturi Path', text: 'The hopper is fitted tighter than the components above and features a hardened coating. This helps prevent solids from slipping past the assembly and directs them into the hopper chamber for controlled movement. Within the hopper, a dedicated flow path provides a direct cleanout route for collected solids.' },
        { num: '3', title: 'SandMover™ Downstroke Action', text: 'During the downstroke, the SandMover™ generates additional thrust to drive solids through the traveling valve with minimal restriction. Its coated positive-seal interface and funnel/groove path support consistent movement.' },
      ],
      figures: [
        { src: IMG + 'sand-prime-deflector.jpg', alt: 'Prime Sand Deflector assembly', caption: 'Prime Sand Deflector™ — stages 1 + 2' },
        { src: IMG + 'sand-sandmover.jpg', alt: 'SandMover seat plug', caption: 'SandMover™ seat plug — stage 3' },
      ],
      tagline: 'Maximize runtime. Beat the sand.',
    },
    {
      type: 'figures',
      tone: 'light',
      label: 'STROKE CYCLE',
      title1: 'Upstroke',
      title2: '& Downstroke.',
      description: 'The Prime Sand Deflector™ captures settling solids, then uses port flow to actively flush them upward and away.',
      figures: [
        { src: IMG + 'sand-upstroke.jpg', alt: 'Upstroke: solids collect at the ported lip and into the hopper cup', caption: 'Upstroke — solids capture: oil and solids settle at the ported lip and into the tapered cup.' },
        { src: IMG + 'sand-downstroke.jpg', alt: 'Downstroke: solids flush out through the ports', caption: 'Downstroke — active flush: port flow drives the oil-solids mixture through the ports, then upward and away.' },
      ],
      tagline: 'Capture on the upstroke. Flush on the downstroke.',
    },
    {
      type: 'figures',
      tone: 'white',
      label: 'SANDMOVER™ FLOW ON DOWNSTROKE',
      title1: 'Seat Plug —',
      title2: 'Optimized Flow Control.',
      description: 'Uses an optimized flow path to assist solids passing through the traveling ball and seat.',
      points: [
        { num: '1', title: 'Positive Seal at Barrel', text: 'Close OD-to-barrel contact closes the bypass path around the seat plug.' },
        { num: '2', title: 'Optimized Flow Path', text: 'Oil and solids are funnelled inward toward the SandMover™ inlet.' },
        { num: '3', title: 'Traveling Ball & Seat', text: 'The optimized path assists solids passing through the traveling ball and seat.' },
      ],
      figures: [{ src: IMG + 'sand-flow-cutaway.jpg', alt: 'Transparent barrel cutaway showing the positive seal funnelling flow through the SandMover', caption: 'Transparent barrel cutaway — positive seal funnels the flow.' }],
      result: { label: 'RESULT', title: 'Bypass path sealed. Directed solids flow.', text: 'The positive-seal interface helps keep solids from slipping past the seat plug OD.' },
      chips: ['Coating options: Spray metal', 'Nitrided'],
      tagline: 'Optimized downstroke flow. Assisted solids movement.',
    },
  ],
  sessionSteps: [],
  whoProfiles: [],
  galleryImages: [],
  supplierLogos: [{ name: 'Tru Lift Supply Inc.', logoUrl: '/images/trinity/logos/trulift.png', logoBg: 'light', url: 'https://www.truliftsupply.com' }],
  supplierLogosLabel: 'Made By',
  faqBadge: 'FAQ',
  faqTitle: 'Sand Deflection System Questions',
  faq: [
    { question: 'What is the Premium SRP Sand Deflection System?', answer: 'A patented Tru Lift plunger system built around two required components — the Prime Sand Deflector™ (vent shaft and hopper) and the SandMover™ seat plug. It captures settling solids on the upstroke and flushes them upward and away on the downstroke.' },
    { question: 'Which pumps does it fit?', answer: 'Valve rod, hollow pull tube, oversize and tubing pumps. It also converts standard PE plunger types.' },
    { question: 'What are the build options?', answer: 'Materials: Alloy 400, 316L stainless steel or 4140. Coatings: spray metal or a nitrided finish. Custom plunger fit from -0.003 in to -0.010 in.' },
    { question: 'How is the Prime Sand Deflector™ installed?', answer: 'It is a two-piece assembly installed between the top of the plunger and the coupling above it.' },
    { question: 'Will it guarantee a longer pump run?', answer: "No product can promise that — results depend on your well conditions. The system is designed to keep solids moving away from the plunger's leading edge and through the traveling valve, which points toward extended run-life potential. We'll tell you honestly whether your well is a good candidate." },
  ],
  protocolBannerTitlePrefix: 'Ready to maximize runtime and beat the sand',
  protocolBannerTitleSuffix: '?',
  seo: {
    metaTitle: 'Premium SRP Sand Deflection System | Trinity Pump & Supply Odessa TX',
    metaDescription:
      'Patented Premium SRP Sand Deflection System — Prime Sand Deflector and SandMover seat plug capture solids on the upstroke and flush them on the downstroke. Sourced by Trinity Pump & Supply, Odessa TX.',
  },
};

/* ───────────── Gas Pistol proof blocks ───────────── */
const xs = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const pts = (area) => xs.map((x) => [x, Math.round(area * x * 10) / 10]);
const FOOT_THEORY =
  'Runtime figures are manufacturer-reported (Tru Lift Supply Inc.) from a 9-well pilot with a major oil company, dated August 5, 2026. ' +
  '4X+ reflects theoretical hydraulic opening power from projected area; actual force depends on net pressure and valve dynamics.';

function pistolBlocks(existingFacts) {
  const facts0 = existingFacts[0] && { type: 'facts', ...existingFacts[0] };
  const facts1 = existingFacts[1] && { type: 'facts', ...existingFacts[1], footnote: FOOT_THEORY };
  return [
    facts0,
    {
      type: 'chart',
      tone: 'white',
      label: 'OPENING FORCE BY LOWER-CHAMBER PRESSURE',
      title1: 'Same Pressure.',
      title2: 'More Opening Force.',
      description: 'Force = pressure × projected lift area. The Gas Pistol™ presents 1.5743 in² of pressure-responsive area versus 0.3526 in² for the seat alone.',
      chartTitle: 'Opening force (lbf) by lower-chamber pressure (psi)',
      xLabel: 'LOWER-CHAMBER PRESSURE (psi)',
      yLabel: 'LBF',
      yTicks: [0, 500, 1000, 1500],
      series: [
        { name: 'Gas Pistol™', color: '#C89A45', points: pts(1.5743), labelAt: [100, 300, 500, 700, 900, 1000] },
        { name: 'Seat', color: '#64707a', points: pts(0.3526), labelAt: [100, 300, 500, 700, 900, 1000] },
      ],
      notes: [
        'Seat alone: 0.3526 in² projected lift area',
        'Gas Pistol™: 1.5743 in² projected area (4.46X)',
        '25° API oil at 10,000 ft: ~3,915 psi hydrostatic pressure and ~1,380 lbf closing load on the traveling ball',
        'Equivalent lower-chamber pressure to match: seat alone ~3,915 psi | Gas Pistol™ combined ~877 psi',
      ],
      footnote: 'Theoretical pressure-area comparison from supplied 1.50-in geometry. Actual force depends on net differential pressure and valve dynamics.',
    },
    facts1,
    {
      type: 'figures',
      tone: 'white',
      label: 'FIELD DATA',
      title1: 'Real-World',
      title2: 'Runtime Charts.',
      description: 'Charts supplied by Tru Lift Supply Inc. from the 9-well pilot and a single-well comparison.',
      figures: [
        { src: IMG + 'gas-pistol-9well-runtime.jpg', alt: '9-well runtime profile, previous versus current', caption: '9-well runtime profile — previous vs. current.' },
        { src: IMG + 'gas-pistol-one-well.jpg', alt: 'One well before and after the Gas Pistol', caption: 'One well — before vs. after Gas Pistol™.' },
      ],
      tagline: 'Make every downstroke count. Equip your pumps with Gas Pistol™.',
    },
  ].filter(Boolean);
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const doc = await db.collection('site_contents').findOne({ key: 'complete_data' });
  const d = doc.data;
  const services = d.services.services;

  // 1) Sand Deflection System entry
  const { seo, ...sandItem } = SAND;
  const at = services.findIndex((s) => s.slug === SAND.slug);
  const sandRecord = {
    ...sandItem,
    id: at >= 0 ? services[at].id : String(Date.now()),
    status: 'published',
    seo: { ...seo, canonicalUrl: 'https://trinitypumpsupply.com/' + SAND.slug + '/', metaRobotsIndex: 'index', metaRobotsFollow: 'follow' },
  };
  if (at >= 0) services[at] = sandRecord; else services.push(sandRecord);

  // 2) Gas Pistol upgrades
  const gp = services.find((s) => s.slug === 'gas-pistol');
  if (gp) {
    const existing = Array.isArray(gp.factSections) && gp.factSections.length ? gp.factSections : [];
    if (existing.length) gp.pageBlocks = pistolBlocks(existing);
    gp.factSections = [];
    gp.supplierLogos = [{ name: 'Tru Lift Supply Inc.', logoUrl: '/images/trinity/logos/trulift.png', logoBg: 'light', url: 'https://www.truliftsupply.com' }];
    gp.protocolBannerTitlePrefix = 'Make every downstroke count. Want a Gas Pistol™ evaluated for your well';
    gp.protocolBannerTitleSuffix = '?';
  }

  // 3) Landing page: third product card + updated solids guide
  const land = services.find((s) => s.slug === 'specialty-rod-pump-solutions');
  if (land && Array.isArray(land.productSections) && land.productSections[0]) {
    const cards = land.productSections[0].cards;
    if (!cards.some((c) => c.href === '/sand-deflection-system/')) {
      cards.push({
        title: 'Premium SRP Sand Deflection System',
        image: IMG + 'sand-deflection-card.jpg',
        badge: 'SAND & SOLIDS',
        description: 'A patented two-part system — Prime Sand Deflector™ and SandMover™ — that captures settling solids on the upstroke and flushes them away on the downstroke.',
        points: ['Fewer solids hang-ups', 'Fits valve rod, hollow pull tube, oversize and tubing pumps'],
        href: '/sand-deflection-system/',
        cta: 'See the Sand Deflection System',
      });
    }
  }
  if (land && Array.isArray(land.whoProfiles)) {
    const p = land.whoProfiles.find((x) => x.label === 'Solids & Sand');
    if (p) p.desc = 'The Sand Deflection System, bypass cages and BHA recommendations to better manage solids and extend pump run life.';
  }

  // 4) Form dropdown option
  const addOpt = (arr) => { if (Array.isArray(arr) && !arr.some((o) => o.value === SAND.slug)) arr.push({ label: SAND.title, value: SAND.slug }); };
  addOpt(d.quote && d.quote.services);
  addOpt(d.contactFaq && d.contactFaq.formServicesOptions);

  await db.collection('site_contents').updateOne({ key: 'complete_data' }, { $set: { data: d, lastUpdated: new Date() } });

  // 5) Page docs
  const p = await db.collection('pages').updateOne(
    { slug: SAND.slug },
    {
      $set: {
        title: SAND.title, template: 'service-detail', status: 'published', isTrashed: false, featuredImage: SAND.image,
        seo: { ...SAND.seo, canonicalUrl: 'https://trinitypumpsupply.com/' + SAND.slug + '/', metaRobotsIndex: 'index', metaRobotsFollow: 'follow' },
        content: { image: SAND.image, imageAlt: SAND.imageAlt, overviewImage: SAND.overviewImage, galleryImages: [] },
        updatedAt: new Date(),
      },
      $setOnInsert: { slug: SAND.slug, createdAt: new Date() },
    },
    { upsert: true }
  );
  console.log('sand page upserted:', p.upsertedCount ? 'created' : 'updated');

  const fresh = await db.collection('site_contents').findOne({ key: 'complete_data' });
  await db.collection('pages').updateMany({ $or: [{ slug: 'home' }, { slug: '/' }, { template: 'home' }] }, { $set: { content: fresh.data, updatedAt: new Date() } });
  console.log('gas pistol blocks:', (fresh.data.services.services.find((s) => s.slug === 'gas-pistol').pageBlocks || []).map((b) => b.type).join(', '));
  await client.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
