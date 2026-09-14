/**
 * Service page content overhaul (2026-09-14), per the client's batch of
 * requested changes:
 *
 *  1) "manufacture" -> "build" everywhere (targeted, surgical fixes to the
 *     live database — see the note below on why this script does NOT
 *     re-run seed_trinity_homepage.cjs or update_client_changes.cjs).
 *  2) New dedicated Artificial Lift landing page at /artificial-lift/,
 *     carrying the big general Trinity pitch. The "Artificial Lift" navbar
 *     entry is repointed to it. "Projects / Supplies" is left untouched.
 *  3) New "Rod Pump Tracking & API Certification" service, added to the
 *     Artificial Lift category.
 *  4) Six existing artificial-lift service pages rewritten short and
 *     specific, with real client photos and (where supplied) supplier
 *     logos: Sucker Rods/Sinker Bars, TAC's, Artificial Lift Supplies,
 *     Gas/Sand Separators, HD Rod Rotator, HD Plunger.
 *  5) Rod Pumps kept exactly as-is — only the two "manufacture" word-swaps.
 *
 * IMPORTANT: data.navbar.companyLinks has drifted since
 * update_client_changes.cjs last ran (the live "About Us" entry now has a
 * real Team subLink that script doesn't know about). This script patches
 * the navbar surgically (read the live array, change only the Artificial
 * Lift entry's href) rather than overwriting it wholesale.
 *
 * Run:  node scripts/update_service_pages_2026_09.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';
const IMG = (name) => `/images/trinity/${name}.jpg`;
const COMPANY = 'Trinity Pump & Supply';

/* ════════════════════════════════════════════════════════════════════
   1) Targeted manufacture -> build fixes (live DB text, exact matches
      confirmed via a read-only query before writing this script)
   ════════════════════════════════════════════════════════════════════ */

// Shared across site_contents.complete_data ('data.*') and the mirrored
// copy on the Home page doc ('content.*') — same values, different prefix.
const wordSwapFields = {
  'settings.siteDescription': 'Delivering High-Quality USA-Built Pump Parts and Services Across Texas and New Mexico. 100+ Years Combined Oilfield Experience.',
  'stats.items.1.label': 'Built Pump Parts',
  'services.description': 'From well evaluation to comprehensive pump inspection and repair, we build and repair downhole sucker rod pumps and supply everything your lease needs.',
  'leadership.desc1': '<p>At Trinity Pump &amp; Supply, we are dedicated to providing industry-leading solutions for your oilfield operations. With over 100+ years of combined experience, our team specializes in building and repairing downhole sucker rod pumps. From well evaluation to comprehensive pump inspection and repair services, we offer unparalleled expertise and commitment to quality.</p>',
  'leadership.stats.1.label': 'Built Parts',
  'process.items.1.shortDescription': 'We build and repair pumps with USA-made parts.',
  'process.items.1.description': 'We build and repair downhole sucker rod pumps using USA-made alloy steel, 316 Stainless and Monel components.',
  'quote.section.description': 'We offer high-quality USA-built pump parts and comprehensive oilfield solutions to keep your operations running smoothly. Choose us for honesty, reliability, and products that stand the test of time.',
  'quote.trustHipa': 'High-Quality USA-Built Parts',
  'faq.items.0.question': 'What do you build and repair?',
  'faq.items.0.answer': 'We build and repair downhole sucker rod pumps, and we supply the Burleson HD Rod Rotator, downhole supplies, general oilfield supplies, battery and wellhead supplies, and poly pipe and fittings.',
  'faq.items.0.q': 'What do you build and repair?',
  'faq.items.0.a': 'We build and repair downhole sucker rod pumps, and we supply the Burleson HD Rod Rotator, downhole supplies, general oilfield supplies, battery and wellhead supplies, and poly pipe and fittings.',
  'faq.items.1.answer': 'We exclusively use high-quality USA-made alloy steel, 316 Stainless and Monel for our downhole pump parts, designed for longer pump runs.',
  'faq.items.1.a': 'We exclusively use high-quality USA-made alloy steel, 316 Stainless and Monel for our downhole pump parts, designed for longer pump runs.',
  'footer.company.description': 'Delivering high-quality USA-built pump parts and services across Texas and New Mexico.',
  'contactFaq.faqs.1.answer': 'We exclusively use high-quality USA-made alloy steel, 316 Stainless, and Monel for our downhole pump parts to ensure longer pump runs and significantly lower pulling costs.',
  'whyChooseUs.features.1.description': 'We exclusively use USA-made alloy steel, 316 Stainless and Monel for our downhole pump parts.',
};

/* ════════════════════════════════════════════════════════════════════
   2) Full 14-item services catalogue (flat — drives the navbar mega-menu,
      the /services/ index, and the quote form's service dropdown)
   ════════════════════════════════════════════════════════════════════ */
const serviceCatalogue = [
  // ── Artificial Lift ──
  {
    title: 'Rod Pumps', slug: 'rod-pumps', category: 'artificial-lift', icon: 'Settings',
    image: IMG('service-downhole-rod-pumps'),
    description: 'Building and repairing downhole rod pumps with USA-made parts, bore sizes 1-1/16" to 3-3/4".',
  },
  {
    title: "TAC's", slug: 'tacs', category: 'artificial-lift', icon: 'Anchor',
    image: '/images/trinity/tac-truck-bed.jpg',
    description: "We build and repair TAC's, in stock for fast turnaround.",
  },
  {
    title: 'Sucker Rods / Sinker Bars', slug: 'sucker-rods-sinker-bars', category: 'artificial-lift', icon: 'Link2',
    image: '/images/trinity/sucker-rods-flatbed.jpg',
    description: 'Quality rod strings and sinker bars, supplied by TRC Sucker Rods and Percheron Manufacturing.',
  },
  {
    title: 'Gas / Sand Separators', slug: 'gas-sand-separators', category: 'artificial-lift', icon: 'Filter',
    image: IMG('cta'),
    description: 'Independent sourcing and recommendations, matched to your well conditions.',
  },
  {
    title: 'Artificial Lift Supplies', slug: 'artificial-lift-supplies', category: 'artificial-lift', icon: 'Package',
    image: '/images/trinity/artificial-lift-supplies-warehouse.jpg',
    description: 'Your one-call source for stuffing boxes, polish rods, on/off tools and rod-string equipment.',
  },
  {
    title: 'HD Rod Rotator', slug: 'hd-rod-rotator', category: 'artificial-lift', icon: 'RotateCw',
    image: IMG('hero_banner'),
    description: 'The exclusive West Texas supplier of the Iron Bear HD Rod Rotator.',
  },
  {
    title: 'HD Plunger', slug: 'hd-plunger', category: 'artificial-lift', icon: 'Gauge',
    image: IMG('process-1'),
    description: 'The Iron Bear HD Plunger — 57% greater wear resistance, priced like a standard plunger.',
  },
  {
    title: 'Rod Pump Tracking & API Certification', slug: 'rod-pump-tracking-api-certification', category: 'artificial-lift', icon: 'ClipboardCheck',
    image: IMG('process-4'),
    description: 'Real-time teardown tracking with Rod Pump Tracker software, and rod pumps built with API-certified material to API standards.',
  },
  // ── Projects / Supplies (untouched, copied verbatim from the live catalogue) ──
  {
    title: 'Pipe, Valves & Fittings', slug: 'pipe-valves-fittings', category: 'projects-supplies', icon: 'Wrench',
    image: IMG('industry-petrochemical'),
    description: 'Pressure-rated ball valves, check valves, plug valves, fittings, swages and flanges, in stock.',
  },
  {
    title: 'Poly', slug: 'poly', category: 'projects-supplies', icon: 'Layers',
    image: IMG('service-poly-pipe-fittings'),
    description: 'Poly pipe and fittings for gathering, transfer and lease piping in a range of SDR ratings.',
  },
  {
    title: 'Complete Facility Buildouts', slug: 'complete-facility-buildouts', category: 'projects-supplies', icon: 'Building2',
    image: IMG('process-2'),
    description: 'Full-service tank battery and facility construction, from planning through commissioning.',
  },
  {
    title: 'General Oilfield Supply', slug: 'general-oilfield-supply', category: 'projects-supplies', icon: 'Truck',
    image: IMG('cta'),
    description: 'Everyday oilfield supplies delivered on time across Texas and New Mexico.',
  },
  {
    title: 'Technical Support & Planning', slug: 'technical-support-planning', category: 'projects-supplies', icon: 'MessageSquare',
    image: IMG('hero'),
    description: 'Engineering guidance from well evaluation through equipment selection and project planning.',
  },
  {
    title: 'Trailer Support for On-Site Operations', slug: 'trailer-support-on-site-operations', category: 'projects-supplies', icon: 'Warehouse',
    image: IMG('industry-mining'),
    description: 'Trailer-mounted support equipment and supplies to keep field crews productive on location.',
  },
];

/* ════════════════════════════════════════════════════════════════════
   3) Flat service-detail page content — the exact field shape
      ServiceDetailTemplate.tsx actually reads (top-level, not nested
      under content.service like the old broken pageContent map).
   ════════════════════════════════════════════════════════════════════ */
const pageContent = {
  'sucker-rods-sinker-bars': {
    heroSectionLabel: 'SUCKER RODS & SINKER BARS',
    heroDescription: "Trinity Pump & Supply is a proud supplier of quality sucker rods and sinker bars — sourced from trusted partners TRC Sucker Rods and Percheron Manufacturing and matched to your well conditions to reduce parting, wear and unplanned pulling jobs.",
    specDurationValue: 'Multiple Grades', specIntensityValue: 'TRC & Percheron', specFocusValue: 'Odessa, TX Shop',
    statsItem1Val: '100+', statsItem1Label: 'Years Combined Experience',
    statsItem2Val: 'TRC', statsItem2Label: 'Sucker Rod Supply Partner',
    statsItem3Val: 'Percheron', statsItem3Label: 'Sinker Bar Supply Partner',
    statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
    overviewSectionLabel: 'QUALITY ROD STRINGS, BUILT TO LAST',
    overviewTitle1: 'Rod Strings.', overviewTitle2: 'Matched to Your Well.',
    overviewDescription: "We supply sucker rods and sinker bars engineered to handle the loads and fluid conditions of your well. From standard steel grades to corrosion-resistant options, our rod strings are selected to reduce parting, wear and unplanned pulling jobs.",
    benefits: [
      { title: 'Matched to Your Well Conditions', description: 'Rod grade, sinker bar placement and sizing selected for your specific fluid load, depth and duty cycle — not a one-size-fits-all string.' },
      { title: 'Trusted Supply Partners', description: 'We proudly supply sucker rods from TRC Sucker Rods and sinker bars from Percheron Manufacturing, backed by our own rod string know-how.' },
      { title: 'Reduced Rod Parting', description: 'Quality materials and proper design reduce fatigue failures downhole, cutting down on unplanned pulling jobs.' },
    ],
    image: '/images/trinity/sucker-rods-flatbed.jpg', imageAlt: 'Sucker rod string ends staged on a flatbed truck',
    galleryImages: [{ src: '/images/trinity/sucker-rods-rack-warehouse.jpg', alt: 'Sucker rod and pipe inventory rack in the Trinity shop' }],
    supplierLogos: [
      { name: 'TRC Sucker Rods', logoUrl: '/images/trinity/logos/trc-sucker-rods.png', url: 'https://trcsuckerrods.com' },
      { name: 'Percheron Manufacturing', logoUrl: '/images/trinity/logos/percheron-manufacturing.png', url: 'https://percheronmfg.com' },
    ],
    whoProfiles: [], sessionSteps: [],
    protocolBannerTitlePrefix: 'Ready to spec your next rod string', protocolBannerTitleSuffix: '?',
  },
  'tacs': {
    heroSectionLabel: "TUBING ANCHOR CATCHERS",
    heroDescription: "We build and repair TAC's in-house, and we're proud suppliers of Tubing Anchor Catchers built with high-quality parts from our trusted vendors — sized to your tubing and casing specs, in stock for fast turnaround.",
    specDurationValue: 'Build & Repair', specIntensityValue: 'In-Stock Sizes', specFocusValue: 'Odessa, TX Shop',
    statsItem1Val: '100+', statsItem1Label: 'Years Combined Experience',
    statsItem2Val: 'In-House', statsItem2Label: 'Build & Repair',
    statsItem3Val: 'In-Stock', statsItem3Label: 'For Fast Turnaround',
    statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
    overviewSectionLabel: 'RELIABLE STRING ANCHORING',
    overviewTitle1: "TAC's, Built", overviewTitle2: 'and Repaired Right.',
    overviewDescription: "Tubing Anchor Catchers hold your tubing string secure under rod pump loading, reducing tubing movement, wear and gas interference. We build and repair TAC's in our Odessa shop and stock a range of sizes and configurations to match your casing and tubing specs.",
    benefits: [
      { title: 'We Build & Repair In-House', description: "From new builds to repair and reconditioning, our Odessa shop keeps your TAC's in service." },
      { title: 'High-Quality Vendor Parts', description: "We're proud suppliers of TAC's built with high-quality components from our trusted vendors." },
      { title: 'Fast Turnaround', description: 'In-stock inventory and quick shop turnaround keep your workover on schedule.' },
    ],
    image: '/images/trinity/tac-truck-bed.jpg', imageAlt: 'Tubing Anchor Catcher staged on a truck bed',
    galleryImages: [
      { src: '/images/trinity/tac-threaded-tops.jpg', alt: 'TAC threaded tops ready for install' },
      { src: '/images/trinity/tac-thandle-install.jpg', alt: 'Trinity technician installing a TAC with a T-handle tool' },
      { src: '/images/trinity/tac-components-floor.jpg', alt: 'TAC components staged in the Trinity shop' },
    ],
    supplierLogos: [],
    whoProfiles: [], sessionSteps: [],
    protocolBannerTitlePrefix: 'Need a TAC built or repaired', protocolBannerTitleSuffix: '?',
  },
  'artificial-lift-supplies': {
    heroSectionLabel: 'ARTIFICIAL LIFT SUPPLIES',
    heroDescription: "One call gets you everything you need to keep your artificial lift operation moving — stuffing boxes, polish rods, seating nipples, on/off tools, tubing and rod-string equipment, and the accessories that round out the job.",
    specDurationValue: 'One-Call Source', specIntensityValue: 'In-Stock', specFocusValue: 'Odessa, TX Shop',
    statsItem1Val: '100+', statsItem1Label: 'Years Combined Experience',
    statsItem2Val: 'One-Call', statsItem2Label: 'Source for Lift Supplies',
    statsItem3Val: 'In-Stock', statsItem3Label: 'Ready to Deploy',
    statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
    overviewSectionLabel: 'EVERYTHING YOUR OPERATION NEEDS',
    overviewTitle1: 'Your One-Call', overviewTitle2: 'Source for Lift Supplies.',
    overviewDescription: "We stock a full range of artificial lift supplies so one call to Trinity covers the job — stuffing boxes, polish rods, seating nipples, on/off tools, tubing and rod-string equipment, and the other accessories that keep your wells producing.",
    benefits: [
      { title: 'Stuffing Boxes & Polish Rods', description: 'In-stock stuffing boxes and polish rods sized to your wellhead, ready when you need them.' },
      { title: 'Seating Nipples & On/Off Tools', description: 'Hold-downs, seating nipples and on/off tools for reliable pump seating and easy retrieval.' },
      { title: 'Tubing & Rod-String Equipment', description: 'The connective hardware that keeps your string running — in stock at our Odessa shop.' },
      { title: 'Your One-Call Source', description: "Whatever your operation needs to keep moving, call Trinity first — if it's not on the shelf, we'll get it." },
    ],
    image: '/images/trinity/artificial-lift-supplies-warehouse.jpg', imageAlt: 'Artificial lift supplies warehouse shelving at Trinity Pump & Supply',
    galleryImages: [{ src: '/images/trinity/artificial-lift-supplies-tools-floor.jpg', alt: 'On/off tools and rod-string equipment staged in the shop' }],
    whoProfiles: [], sessionSteps: [],
    protocolBannerTitlePrefix: 'Need supplies on your lease', protocolBannerTitleSuffix: '?',
  },
  'rod-pump-tracking-api-certification': {
    heroSectionLabel: 'TRACKING & CERTIFICATION',
    heroDescription: "Every rod pump we build, repair or service is tracked from the bench to the cloud — and built with API-certified material to API standards, so you always know what's in your well and what it's built to.",
    specDurationValue: 'Rod Pump Tracker', specIntensityValue: 'API-Certified', specFocusValue: 'Full Teardown History',
    statsItem1Val: 'RPT', statsItem1Label: 'Rod Pump Tracker Software',
    statsItem2Val: 'API', statsItem2Label: 'Certified Material & Standards',
    statsItem3Val: '100%', statsItem3Label: 'Teardowns Logged',
    statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
    overviewSectionLabel: "KNOW WHAT'S DOWNHOLE",
    overviewTitle1: 'Tracked.', overviewTitle2: 'Certified. Accounted For.',
    overviewDescription: "Rod Pump Tracker (RPT) gives you real-time visibility into every pump's repair history. All rod pumps and TAC's leaving our shop are built with API-certified material and to API standards. Two commitments, one goal: you always know exactly what's downhole and what it's built to.",
    benefits: [
      { title: 'Real-Time Teardown Tracking', description: "We track every pump teardown from the bench to the cloud using Rod Pump Tracker software — giving you real-time visibility into every pump's repair history, plus clear teardown reporting and troubleshooting history." },
      { title: 'Built to API-Certified Standards', description: "All rod pumps and TAC's are built with API-certified material and to API standards — so every component you get from Trinity meets the industry benchmark, not just our word for it." },
    ],
    image: IMG('process-4'), imageAlt: 'Rod pump teardown and inspection at the Trinity shop bench',
    whoProfiles: [], sessionSteps: [],
    protocolBannerTitlePrefix: 'Want teardown history on your pumps', protocolBannerTitleSuffix: '?',
  },
  'gas-sand-separators': {
    heroSectionLabel: 'GAS & SAND SEPARATORS',
    heroDescription: "As an independent pump shop, we're not locked into one separator line. We source and recommend whatever gas and sand separator configuration actually fits your well conditions — protecting your pump from gas interference and abrasive sand without pushing a one-size-fits-all product.",
    specDurationValue: 'Independent', specIntensityValue: 'Case-by-Case Fit', specFocusValue: 'Odessa, TX Shop',
    statsItem1Val: '100+', statsItem1Label: 'Years Combined Experience',
    statsItem2Val: 'Independent', statsItem2Label: 'Not Tied to One Line',
    statsItem3Val: 'EnerCat', statsItem3Label: '& Predator Go-To Options',
    statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
    overviewSectionLabel: 'THE RIGHT SEPARATOR FOR YOUR WELL',
    overviewTitle1: 'Fit to Your Well.', overviewTitle2: 'Not Our Inventory.',
    overviewDescription: "Gas and sand separators protect your downhole pump from gas interference and abrasive sand, but no single manufacturer's separator is the right call for every well. As an independent shop, we evaluate your gas-to-liquid ratio and sand loading and recommend the configuration that actually fits.",
    benefits: [
      { title: 'Independent, Not Locked In', description: "We're not tied to a single supplier, so our recommendation is based on your well, not our inventory." },
      { title: 'Go-To Options, Case by Case', description: "The EnerCat paraffin tool and the Predator oil tool are two of our most trusted go-to options — but we'll recommend whatever configuration fits your specific well." },
      { title: 'Protects Pump Efficiency', description: 'Effective separation reduces fluid pound from gas interference and keeps abrasive sand out of your barrel, extending plunger and barrel life.' },
    ],
    image: IMG('cta'), imageAlt: 'Pumpjack on a Permian Basin lease',
    whoProfiles: [], sessionSteps: [],
    protocolBannerTitlePrefix: "Not sure which separator fits your well", protocolBannerTitleSuffix: '?',
  },
  'hd-rod-rotator': {
    heroSectionLabel: 'IRON BEAR HD ROD ROTATOR',
    heroDescription: "Trinity Pump & Supply is the exclusive West Texas supplier of the Iron Bear HD Rod Rotator — a heavy-duty slow-gear rotator built to rotate the rod string on every stroke, delivering even wear on rod guides and dramatically extending rod and tubing run life in deviated and horizontal wells.",
    specDurationValue: 'New or Reman', specIntensityValue: 'Highest Torque Capacity', specFocusValue: 'Exclusive West TX Supplier',
    statsItem1Val: '0', statsItem1Label: 'Reported Gear Failures Since 2018',
    statsItem2Val: 'Highest', statsItem2Label: 'Torque Capacity in the Industry',
    statsItem3Val: 'OKC', statsItem3Label: 'Assembled & Tested',
    statsItem4Val: 'West TX', statsItem4Label: 'Exclusive Trinity Territory',
    overviewSectionLabel: 'BUILT TO OUTLAST',
    overviewTitle1: 'The Longest-Lasting', overviewTitle2: 'Rod Rotator in the Field.',
    overviewDescription: "The Iron Bear HD Rod Rotator uses proprietary precision gears and premium bearings to rotate the rod string on every stroke — the most economical way we know to lower your lift cost on deviated and horizontal wells with guided rods.",
    benefits: [
      { title: 'Built for the Toughest Wells', description: 'Proprietary precision gears and premium bearings deliver the highest torque capacity in the industry.' },
      { title: "A Track Record That Speaks for Itself", description: 'Thousands of units sold since 2018 with zero reported gear failures.' },
      { title: "Visual Proof It's Working", description: "The black housing's patented visual position indicator gives instant, at-a-glance confirmation the rotator is turning — no guessing." },
      { title: 'New or Remanufactured, Field-Proven', description: 'Available new or remanufactured, field-proven across Oklahoma, West Texas, North Dakota and Wyoming.' },
    ],
    candidateSectionLabel: 'FIELD-PROVEN PERFORMANCE',
    candidateTitle1: 'Built to Outlast.', candidateTitle2: 'Proven in the Field.',
    candidateDescription: 'Independent field comparisons and thousands of units in service tell the same story.',
    whoProfiles: [
      { label: '5-Year Run: Minimal to No Wear', desc: "In side-by-side field comparisons, the Iron Bear HD gear shows minimal to no wear after a 5-year run — a leading competitor's gear sheared in 60 days, a 67% failure rate.", suitability: 'FIELD-PROVEN' },
      { label: 'Optional Electronic Position Indicator', desc: 'A patent-pending option that monitors internal gear movement and triggers an RPC alarm in about 4 minutes if rotation stops — simple, reliable, wired, no batteries.', suitability: 'OPTIONAL UPGRADE' },
      { label: 'Exclusive West Texas Supplier', desc: 'Trinity Pump & Supply is the exclusive West Texas supplier of the Iron Bear HD Rod Rotator, available through our Odessa shop with our own install and service support.', suitability: 'TRINITY EXCLUSIVE' },
    ],
    sessionSteps: [],
    supplierLogos: [{ name: 'Iron Bear Manufacturing', logoUrl: '/images/trinity/logos/iron-bear.png' }],
    faqBadge: 'FAQ', faqTitle: 'Rod Rotator Questions',
    faq: [
      { q: 'Is the Iron Bear HD Rod Rotator available anywhere in West Texas?', a: 'Trinity Pump & Supply is the exclusive West Texas supplier of the Iron Bear HD Rod Rotator — available new or remanufactured through our Odessa shop.' },
      { q: 'What maintenance does the rotator need?', a: "Routine greasing per the recommended schedule is all it takes — the patented visual position indicator lets your pumper confirm it's rotating at a glance." },
    ],
    protocolBannerTitlePrefix: 'Ready to put an Iron Bear HD on your well', protocolBannerTitleSuffix: '?',
  },
  'hd-plunger': {
    heroSectionLabel: 'IRON BEAR HD PLUNGER',
    heroDescription: "Trinity Pump & Supply supplies the Iron Bear HD Plunger — 100% American made with welded Monel pins, up to 3X more wear resistant than a standard spray-metal plunger, and priced to make the upgrade an easy call.",
    specDurationValue: '1-1/4" to 2"', specIntensityValue: '100% American Made', specFocusValue: 'Smooth or Grooved',
    statsItem1Val: '57%', statsItem1Label: 'Greater Wear Resistance',
    statsItem2Val: '3X', statsItem2Label: 'More Wear Resistant',
    statsItem3Val: '100%', statsItem3Label: 'American Made',
    statsItem4Val: '90 Days', statsItem4Label: 'Field-Proven Run (and Counting)',
    overviewSectionLabel: 'FIELD PROOF, NOT PROMISES',
    overviewTitle1: 'Runs Longer.', overviewTitle2: 'Costs the Same.',
    overviewDescription: "The Iron Bear HD Plunger delivers 57% greater wear resistance than a standard spray-metal plunger, often wears evenly enough to be flipped and reused, and is priced like the plunger you're already running. No excuses.",
    benefits: [
      { title: '57% Greater Wear Resistance', description: 'Built to outlast standard spray-metal plungers without the premium price tag.' },
      { title: 'Often Flipped and Reused', description: 'Wears evenly enough that plungers can often be flipped and put back to work instead of scrapped.' },
      { title: '100% American Made', description: 'Welded Monel pins, built in the USA, available smooth or grooved in sizes 1-1/4" to 2".' },
      { title: 'Priced Like a Standard Plunger', description: "3X the wear resistance, priced like the spray-metal plunger you're already running." },
    ],
    candidateSectionLabel: 'FIELD PROOF, NOT PROMISES',
    candidateTitle1: 'Runs Longer.', candidateTitle2: 'Costs the Same.',
    whoProfiles: [
      { label: 'Field Proof: 30 Days vs. 90+ Days', desc: 'A standard competitor plunger consistently failed and was scrapped in 30 days. The Iron Bear HD ran 90 days with minimal wear, was flipped, and went back to work — still running 6 months later.', suitability: 'FIELD-PROVEN' },
      { label: '100% American Made', desc: 'Welded Monel pins, built in the USA, smooth or grooved, sizes 1-1/4" to 2".', suitability: 'USA-MADE' },
    ],
    sessionSteps: [],
    supplierLogos: [{ name: 'Iron Bear Manufacturing', logoUrl: '/images/trinity/logos/iron-bear.png' }],
    faqBadge: 'FAQ', faqTitle: 'HD Plunger Questions',
    faq: [
      { q: 'Is this the HD or HDX plunger?', a: 'Trinity supplies the Iron Bear HD Plunger — 57% greater wear resistance, welded Monel pins, priced like a standard spray-metal plunger.' },
      { q: 'What sizes are available?', a: 'Smooth or grooved, in sizes 1-1/4" through 2".' },
    ],
    protocolBannerTitlePrefix: 'Ready to try the Iron Bear HD Plunger', protocolBannerTitleSuffix: '?',
  },
};

/* ════════════════════════════════════════════════════════════════════
   4) New Artificial Lift landing page content
   ════════════════════════════════════════════════════════════════════ */
const artificialLiftLanding = {
  heroSectionLabel: 'ARTIFICIAL LIFT',
  heroTitle1: 'Artificial Lift,',
  heroTitle2: 'Built for the Permian Basin.',
  heroDescription: "USA-made components, over 100 years of combined experience, and a shop in Odessa built to keep your wells producing and your lifting costs down. From the rod pump itself to every accessory that keeps it running, Trinity is built to be your one-call artificial lift partner.",
  heroCtaText: 'Get a Quote', heroCtaUrl: '/contact-us/',
  heroCtaSecondary: 'SEE OUR PRODUCTS', heroCtaSecondaryUrl: '#lineup',
  image: IMG('hero'), imageAlt: 'Pump jack on a Permian Basin lease',

  statsItem1Val: '100+', statsItem1Label: 'Years Combined Experience',
  statsItem2Val: 'USA', statsItem2Label: 'Built Components',
  statsItem3Val: 'TX & NM', statsItem3Label: 'Oilfield Coverage',
  statsItem4Val: 'Odessa', statsItem4Label: 'Shop & Support',

  whyLabel: 'WHY TRINITY',
  whyTitle1: 'One Shop.', whyTitle2: 'Every Artificial Lift Need.',
  whyDescription: "From the pump itself to the accessories that keep it running, Trinity builds, sources and supports the equipment your lease depends on — backed by a team that answers the phone and shows up when you need it.",
  whyFeatures: [
    { icon: 'ShieldCheck', title: 'USA-Made Components', description: 'Alloy steel, 316 Stainless and Monel parts built for durability and corrosion resistance.' },
    { icon: 'Settings', title: 'Built & Repaired In-House', description: "Our Odessa shop builds, repairs and reconditions rod pumps and TAC's on-site." },
    { icon: 'TrendingDown', title: 'Lower Lifting Costs', description: 'Longer equipment runs mean fewer pulls, less downtime, and lower cost per barrel.' },
    { icon: 'Truck', title: 'Fast Delivery', description: 'In-stock inventory and dependable delivery across Texas and New Mexico.' },
    { icon: 'ClipboardCheck', title: 'Tracked & Certified', description: 'Rod Pump Tracker software and API-certified materials on every build.' },
    { icon: 'Phone', title: 'One-Call Support', description: 'A team that answers the phone and shows up when your lease needs it.' },
  ],

  subPagesLabel: 'OUR LINEUP',
  subPagesTitle1: 'Artificial Lift',
  subPagesTitle2: 'Products & Services.',
  subPages: [
    { title: 'Rod Pumps', slug: 'rod-pumps', description: 'Building and repairing downhole rod pumps with USA-made parts, bore sizes 1-1/16" to 3-3/4".', icon: 'Settings' },
    { title: 'HD Rod Rotator', slug: 'hd-rod-rotator', description: 'The exclusive West Texas supplier of the Iron Bear HD Rod Rotator.', icon: 'RotateCw' },
    { title: 'HD Plunger', slug: 'hd-plunger', description: '57% greater wear resistance, priced like a standard plunger.', icon: 'Gauge' },
    { title: "TAC's", slug: 'tacs', description: "We build and repair TAC's, in stock for fast turnaround.", icon: 'Anchor' },
    { title: 'Sucker Rods / Sinker Bars', slug: 'sucker-rods-sinker-bars', description: 'Supplied by TRC Sucker Rods and Percheron Manufacturing.', icon: 'Link2' },
    { title: 'Artificial Lift Supplies', slug: 'artificial-lift-supplies', description: 'Your one-call source for stuffing boxes, polish rods and more.', icon: 'Package' },
    { title: 'Gas / Sand Separators', slug: 'gas-sand-separators', description: 'Independent sourcing, matched to your well conditions.', icon: 'Filter' },
    { title: 'Rod Pump Tracking & API Certification', slug: 'rod-pump-tracking-api-certification', description: 'Real-time teardown tracking and API-certified builds.', icon: 'ClipboardCheck' },
  ],
};

/* ════════════════════════════════════════════════════════════════════ */

function setWith(prefix, patch) {
  const out = {};
  for (const [k, v] of Object.entries(patch)) out[`${prefix}.${k}`] = v;
  return out;
}

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);

  const contentCol = db.collection('site_contents');
  const pagesCol = db.collection('pages');
  const postsCol = db.collection('posts');

  /* ── A) Targeted manufacture -> build fixes ───────────────────────── */
  const dataSet = setWith('data', wordSwapFields);
  const r1 = await contentCol.updateOne({ key: 'complete_data' }, { $set: dataSet });
  console.log(`site_contents.complete_data word-swap: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);

  const homePage = await pagesCol.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (homePage) {
    const homeSet = setWith('content', wordSwapFields);
    const rh = await pagesCol.updateOne({ _id: homePage._id }, { $set: homeSet });
    console.log(`pages(home "${homePage.slug}") word-swap: modified=${rh.modifiedCount}`);
  } else {
    console.log('pages: no home page document found (skipped word-swap mirror)');
  }

  const rServices = await pagesCol.updateOne(
    { slug: 'services' },
    { $set: {
      'content.services.description': 'At Trinity Pump & Supply, we are dedicated to providing industry-leading solutions for your oilfield operations. With over 100+ years of combined experience, our team specializes in building and repairing downhole sucker rod pumps. Operating throughout Texas and New Mexico, we serve oilfield operators with a focus on lowering pump-related lifting costs and maximizing production efficiency.',
      'content.services.services.0.description': 'Our downhole rod pumps are built to last, with bore sizes ranging from 1-1/16" to 3-3/4". Whether you need a new pump or a repair, we use only the highest quality materials and proven engineering techniques to ensure long-lasting, reliable performance. Each pump we build or repair is designed to minimize downtime and reduce lifting costs, giving you the peace of mind that your operations are running efficiently.',
    } }
  );
  console.log(`pages(services) word-swap: matched=${rServices.matchedCount} modified=${rServices.modifiedCount}`);

  const rGallery = await pagesCol.updateOne(
    { slug: 'gallery' },
    { $set: {
      'content.galleryPage.header.description': '<p>Explore our USA-built downhole rod pumps, Burleson HD rod rotator installations, precision pump shop reconditioning, and Permian Basin oilfield supplies.</p>',
      'content.portfolio.projects.0.desc': 'USA-built downhole rod pump assembly built with precision-machined barrels, plungers, and API valves.',
    } }
  );
  console.log(`pages(gallery) word-swap: matched=${rGallery.matchedCount} modified=${rGallery.modifiedCount}`);

  const rAbout = await pagesCol.updateOne(
    { slug: 'about-us' },
    { $set: {
      'content.description': 'At Trinity Pump & Supply, we are dedicated to providing industry-leading solutions for your oilfield operations. With over 100+ years of combined experience, our team specializes in building and repairing downhole sucker rod pumps. Operating throughout Texas and New Mexico, we serve oilfield operators with a focus on lowering pump-related lifting costs and maximizing production efficiency.',
      'content.whyChoose.1.desc': 'We exclusively use high-quality USA-made alloy steel, 316 Stainless, and Monel for our downhole pump parts.',
    } }
  );
  console.log(`pages(about-us) word-swap (2 clean Trinity fields only): matched=${rAbout.matchedCount} modified=${rAbout.modifiedCount}`);

  // SEO metadata lives on Page.seo, a sibling of Page.content — separate
  // fields that the word-swap above (which only touches content.*) misses.
  const rGallerySeo = await pagesCol.updateOne({ slug: 'gallery' }, { $set: {
    'seo.metaDescription': 'Explore our gallery of USA-built downhole rod pumps, Burleson HD rod rotators, wellhead supplies, and Odessa TX pump shop facility.',
    'seo.ogDescription': 'Explore our gallery of USA-built downhole rod pumps, Burleson HD rod rotators, and Permian Basin oilfield supplies.',
    'seo.twitterDescription': 'Explore our gallery of USA-built downhole rod pumps, Burleson HD rod rotators, and Permian Basin oilfield supplies.',
  } });
  console.log(`pages(gallery) seo word-swap: matched=${rGallerySeo.matchedCount} modified=${rGallerySeo.modifiedCount}`);

  const rAboutSeo = await pagesCol.updateOne({ slug: 'about-us' }, { $set: {
    'seo.metaDescription': 'With over 100+ years of combined experience, Trinity Pump & Supply builds and repairs downhole sucker rod pumps across Texas and New Mexico.',
  } });
  console.log(`pages(about-us) seo word-swap: matched=${rAboutSeo.matchedCount} modified=${rAboutSeo.modifiedCount}`);

  const rHomeSeo = await pagesCol.updateOne({ slug: 'home' }, { $set: {
    'seo.metaDescription': 'Delivering High-Quality USA-Built Pump Parts and Services Across Texas and New Mexico.',
    'seo.ogDescription': 'Delivering High-Quality USA-Built Pump Parts and Services Across Texas and New Mexico.',
  } });
  console.log(`pages(home) seo word-swap: matched=${rHomeSeo.matchedCount} modified=${rHomeSeo.modifiedCount}`);

  const blogPost = await postsCol.findOne({ slug: 'why-usa-made-sucker-rod-pump-parts-lower-lifting-costs' });
  if (blogPost && typeof blogPost.content === 'string' && blogPost.content.includes('USA-manufactured alloy steel')) {
    const newContent = blogPost.content.replace('USA-manufactured alloy steel', 'USA-made alloy steel');
    await postsCol.updateOne({ _id: blogPost._id }, { $set: { content: newContent } });
    console.log('posts(why-usa-made...) word-swap: modified=1');
  } else {
    console.log('posts(why-usa-made...) word-swap: no match found, skipped (0 modified)');
  }

  /* ── B) Navbar: repoint "Artificial Lift" only, preserve live drift ── */
  const liveContent = await contentCol.findOne({ key: 'complete_data' });
  const liveLinks = liveContent?.data?.navbar?.companyLinks || [];
  let navChanged = false;
  const newLinks = liveLinks.map((link) => {
    if (link.label === 'Artificial Lift') {
      navChanged = true;
      return { ...link, href: '/artificial-lift/' };
    }
    return link;
  });
  if (navChanged) {
    await contentCol.updateOne(
      { key: 'complete_data' },
      { $set: { 'data.navbar.companyLinks': newLinks, 'data.navbar.links': newLinks } }
    );
    console.log('navbar: "Artificial Lift" repointed to /artificial-lift/ (all other links preserved untouched)');
  } else {
    console.log('WARNING: no navbar link labeled "Artificial Lift" found — nav not patched, check manually.');
  }

  /* ── C) Rewrite the flat services catalogue (14 items) ────────────── */
  const rCatalogue = await contentCol.updateOne(
    { key: 'complete_data' },
    { $set: {
      'data.services.services': serviceCatalogue,
      'data.quote.services': serviceCatalogue.map((s) => ({ label: s.title, value: s.slug })),
    } }
  );
  console.log(`services catalogue (14 items) rewritten: matched=${rCatalogue.matchedCount} modified=${rCatalogue.modifiedCount}`);

  /* ── D) Rod Pumps — word-swap only, structure untouched ───────────── */
  const rRodPumps = await pagesCol.updateOne(
    { slug: 'rod-pumps' },
    { $set: {
      'content.service.description': 'Our downhole rod pumps are built to last, with bore sizes ranging from 1-1/16" to 3-3/4". Whether you need a new pump or a repair, we use only the highest quality materials and proven engineering techniques to ensure long-lasting, reliable performance. Each pump we build or repair is designed to minimize downtime and reduce lifting costs.',
      'content.service.imageAlt': 'Rod Pumps - Precision USA-Built Parts',
    } }
  );
  console.log(`pages(rod-pumps) word-swap (kept as-is otherwise): matched=${rRodPumps.matchedCount} modified=${rRodPumps.modifiedCount}`);

  /* ── E) The 7 changed/new pages: drop the dead content.service.* blob,
         write flat content in the shape the template actually reads ──── */
  let created = 0, updated = 0;
  for (const [slug, pc] of Object.entries(pageContent)) {
    const catalogueEntry = serviceCatalogue.find((s) => s.slug === slug);
    const title = catalogueEntry ? catalogueEntry.title : slug;
    const res = await pagesCol.updateOne(
      { slug },
      {
        // Replacing the whole `content` field below already drops the old
        // dead content.service.* blob — no separate $unset needed (and
        // combining $unset('content.service') with $set('content') in one
        // call is rejected by MongoDB as a path conflict).
        $set: {
          title,
          template: 'service-detail',
          status: 'published',
          isTrashed: false,
          featuredImage: pc.image,
          seo: {
            metaTitle: `${title} | ${COMPANY} Odessa TX`,
            metaDescription: (pc.heroDescription || '').slice(0, 155),
            canonicalUrl: `https://trinitypumpsupply.com/${slug}/`,
            metaRobotsIndex: 'index',
            metaRobotsFollow: 'follow',
          },
          content: pc,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
    if (res.upsertedCount > 0) created++; else if (res.modifiedCount > 0) updated++;
  }
  console.log(`7 service pages (flat content): created=${created} updated=${updated}`);

  /* ── F) New Artificial Lift landing page ──────────────────────────── */
  const rLanding = await pagesCol.updateOne(
    { slug: 'artificial-lift' },
    {
      $set: {
        title: `Artificial Lift | ${COMPANY} Odessa TX`,
        template: 'artificial-lift-landing',
        status: 'published',
        isTrashed: false,
        featuredImage: artificialLiftLanding.image,
        seo: {
          metaTitle: `Artificial Lift | ${COMPANY} Odessa TX`,
          metaDescription: artificialLiftLanding.heroDescription.slice(0, 155),
          canonicalUrl: 'https://trinitypumpsupply.com/artificial-lift/',
          metaRobotsIndex: 'index',
          metaRobotsFollow: 'follow',
        },
        content: artificialLiftLanding,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
  console.log(`pages(artificial-lift) landing page: matched=${rLanding.matchedCount} modified=${rLanding.modifiedCount} upserted=${rLanding.upsertedCount ? 1 : 0}`);

  await client.close();
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
