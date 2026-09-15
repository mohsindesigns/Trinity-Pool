/**
 * Client-requested changes (2026-09-11):
 *  1) Navbar: "Services" -> "Artificial Lift" (mega menu) + new "Projects / Supplies" (mega menu)
 *  2) New 13-item service catalogue split across the two categories above
 *  3) Leadership/Team bios (5 people) on the Team page (/about/team/), now published
 *  4) New shop address: 4608 Gist Ave, Odessa, TX 79764
 *  5) Team member email addresses
 *
 * Run:  node scripts/update_client_changes.cjs
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'trinity_pump_supply';
const IMG = (name) => `/images/trinity/${name}.jpg`;

const COMPANY = 'Trinity Pump & Supply';
const ADDRESS = '4608 Gist Ave, Odessa, TX 79764';

/* ────────────────────────────────────────────────────────────
   1) New services catalogue (13 items, category-tagged)
   ──────────────────────────────────────────────────────────── */
const serviceCatalogue = [
  // ── Artificial Lift ──
  {
    title: 'Rod Pumps', slug: 'rod-pumps', category: 'artificial-lift', icon: 'Settings',
    image: IMG('service-downhole-rod-pumps'),
    description: 'Building and repairing downhole rod pumps with USA-made parts, bore sizes 1-1/16" to 3-3/4".',
  },
  {
    title: "TAC's", slug: 'tacs', category: 'artificial-lift', icon: 'Anchor',
    image: IMG('industry-oil-gas'),
    description: 'Tubing Anchor Catchers sized to your tubing and casing specs, in stock for fast turnaround.',
  },
  {
    title: 'Sucker Rods / Sinker Bars', slug: 'sucker-rods-sinker-bars', category: 'artificial-lift', icon: 'Link2',
    image: IMG('why_choose_engineer'),
    description: 'Quality rod strings and sinker bars matched to your well conditions to reduce parting and wear.',
  },
  {
    title: 'Gas / Sand Separators', slug: 'gas-sand-separators', category: 'artificial-lift', icon: 'Filter',
    image: IMG('industry-manufacturing'),
    description: 'Multiple separator configurations to protect your pump from gas interference and abrasive sand.',
  },
  {
    title: 'Artificial Lift Supplies', slug: 'artificial-lift-supplies', category: 'artificial-lift', icon: 'Package',
    image: IMG('why-choose-us'),
    description: 'Tubing and rod string equipment, on-off tools, seating nipples and hold-downs in stock.',
  },
  {
    title: 'HD Rod Rotator', slug: 'hd-rod-rotator', category: 'artificial-lift', icon: 'RotateCw',
    image: IMG('hero_banner'),
    description: 'Field-proven Burleson HD Rod Rotators built to outperform, extending rod and pump life.',
  },
  {
    title: 'HD Plunger', slug: 'hd-plunger', category: 'artificial-lift', icon: 'Gauge',
    image: IMG('process-1'),
    description: 'Heavy-duty plungers machined to tight tolerances for reliable sealing and extended run life.',
  },
  // ── Projects / Supplies ──
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

/* ────────────────────────────────────────────────────────────
   2) Full service-detail page content (per slug)
   ──────────────────────────────────────────────────────────── */
const pageContent = {
  'rod-pumps': {
    tag: 'Rod Pumps', icon: 'Settings', image: IMG('service-downhole-rod-pumps'),
    subheadline: 'Precision Engineering for Maximum Pump Life',
    description: 'Our downhole rod pumps are built to last, with bore sizes ranging from 1-1/16" to 3-3/4". Whether you need a new pump or a repair, we use only the highest quality materials and proven engineering techniques to ensure long-lasting, reliable performance. Each pump we build or repair is designed to minimize downtime and reduce lifting costs.',
    offerings: ['New downhole rod pump construction', 'Pump repair and reconditioning', 'Pump design customized to your well conditions', 'Longer pump run life to reduce pulling costs'],
    benefits: [
      { title: 'Customized Pump Design', description: 'Engineered specifically for your well depth, fluid gravity, and production volume.' },
      { title: 'USA-Made High-Quality Alloys', description: 'Alloy steel, 316 Stainless, and Monel parts designed for high durability and corrosion resistance.' },
      { title: 'Lower Lifting Costs', description: 'Longer pump runs minimize pulling unit frequency and equipment downtime.' },
      { title: 'Precision Reconditioning', description: 'Thorough teardown, inspection, re-barreling, and testing before reinstallation.' },
    ],
    imageAlt: 'Rod Pumps - Precision USA-Built Parts',
  },
  'tacs': {
    tag: "TAC's", icon: 'Anchor', image: IMG('industry-oil-gas'),
    subheadline: 'Reliable String Anchoring for Rod Pump Wells',
    description: "Tubing Anchor Catchers hold your tubing string secure under rod pump loading, reducing tubing movement, wear and gas interference. We stock a range of TAC sizes and configurations to match your casing and tubing specs, with quick turnaround for Permian Basin operators.",
    offerings: ['TACs sized to your tubing and casing specs', 'Reliable hold-and-release mechanical action', 'Reduced tubing wear from rod pump movement', 'In-stock inventory for fast turnaround'],
    benefits: [
      { title: 'Secure String Anchoring', description: 'Holds the tubing string firmly in place, preventing damaging movement during the pump stroke.' },
      { title: 'Reduced Tubing Wear', description: 'Anchoring the string reduces compression and wear that shortens tubing life.' },
      { title: 'Easy Release When Needed', description: 'Engineered to release cleanly for workovers without fishing complications.' },
      { title: 'In-Stock at Our Odessa Shop', description: 'Ready-to-deploy inventory keeps your workover on schedule.' },
    ],
    imageAlt: "Tubing Anchor Catchers (TAC's)",
  },
  'sucker-rods-sinker-bars': {
    tag: 'Sucker Rods', icon: 'Link2', image: IMG('why_choose_engineer'),
    subheadline: 'Quality Rod Strings Built for Long Service Life',
    description: 'We supply sucker rods and sinker bars engineered to handle the loads and fluid conditions of your well. From standard steel grades to corrosion-resistant options, our rod strings are selected to reduce parting, wear and unplanned pulling jobs.',
    offerings: ['Sucker rods in multiple steel grades and sizes', 'Sinker bars for rod string weight and buckling control', 'Corrosion-resistant options for aggressive fluids', 'Rod string design support for your well conditions'],
    benefits: [
      { title: 'Matched to Well Conditions', description: 'Rod grade and sinker bar placement selected for your fluid load and depth.' },
      { title: 'Reduced Rod Parting', description: 'Quality materials and proper design reduce fatigue failures downhole.' },
      { title: 'Corrosion Resistance', description: 'Options built to withstand aggressive produced fluids and extend service life.' },
      { title: 'Fast Availability', description: 'In-stock rod and sinker bar inventory at our Odessa shop.' },
    ],
    imageAlt: 'Sucker Rods and Sinker Bars',
  },
  'gas-sand-separators': {
    tag: 'Separators', icon: 'Filter', image: IMG('industry-manufacturing'),
    subheadline: 'Protecting Your Pump from Gas Interference and Sand',
    description: "Gas and sand separators protect your downhole rod pump from gas interference and abrasive sand production, improving pump efficiency and extending equipment life. We stock multiple separator configurations to match your well's gas-to-liquid ratio and sand loading.",
    offerings: ['Multiple gas separator configurations', 'Sand separator options for abrasive wells', 'Sizing support based on your production data', 'In-stock availability for quick deployment'],
    benefits: [
      { title: 'Effective Gas Separation', description: 'Reduces gas interference that causes pump fluid pound and lost efficiency.' },
      { title: 'Sand Protection', description: 'Keeps abrasive sand out of your pump barrel, extending plunger and barrel life.' },
      { title: 'Improved Pump Efficiency', description: 'Cleaner fluid entry means more consistent, efficient pump strokes.' },
      { title: 'Configuration Support', description: "Our team helps match separator sizing to your well's production profile." },
    ],
    imageAlt: 'Gas and Sand Separators',
  },
  'artificial-lift-supplies': {
    tag: 'Lift Supplies', icon: 'Package', image: IMG('why-choose-us'),
    subheadline: 'Comprehensive Inventory for Your Operational Needs',
    description: 'We stock a full range of artificial lift supplies to support your oilfield operations. Our inventory includes everything you need to keep your wells producing efficiently, from replacement parts to essential tools, with timely delivery and top-quality materials.',
    offerings: ['Tubing and rod string equipment', 'Gas/sand separator options', "Tubing Anchor Catchers (TAC's)", 'On-off tools, seating nipples, and hold-downs'],
    benefits: [
      { title: 'Immediate Inventory Availability', description: 'Ready-to-deploy components in stock at our Odessa shop.' },
      { title: 'Effective Gas & Sand Separation', description: 'Protect your downhole pumps against gas interference and abrasive sand.' },
      { title: 'Reliable String Anchoring', description: 'Tubing anchor catchers engineered to hold securely and release easily when needed.' },
      { title: 'Rigorous Quality Assurance', description: 'All components inspected to meet or exceed industry standards.' },
    ],
    imageAlt: 'Artificial Lift Supplies - Tubing Anchors & Separators',
  },
  'hd-rod-rotator': {
    tag: 'Rod Rotator', icon: 'RotateCw', image: IMG('hero_banner'),
    subheadline: 'Field-Proven Rod Rotator Engineered to Outperform',
    description: "Gave Trinity Pump & Supply a chance with their rod rotators and they have not skipped a beat. With recommended maintenance (greasing accordingly), our Burleson HD Rod Rotators have proven themselves to be bulletproof. Designed for operators who want equipment they can 'set it and forget it' without loose arm issues.",
    offerings: ['Heavy-duty internal gearing and robust arm design', 'Continuous and reliable rod string rotation', 'Even wear distribution along tubing and rod strings', 'Field-tested reliability across harsh Permian Basin conditions'],
    benefits: [
      { title: 'Eliminates Loose Arm Failures', description: 'Proven design that stays tight and rotates continuously under heavy loads.' },
      { title: 'Extends Rod & Tubing Lifespan', description: 'Even rod wear prevents premature tubing cuts and rod parting.' },
      { title: 'Low Maintenance Requirement', description: 'Routine greasing keeps the rotator operating flawlessly for extended cycles.' },
      { title: 'Outperforms Big-Name Competitors', description: 'Built with rugged materials that withstand extreme field demands.' },
    ],
    imageAlt: 'Burleson HD Rod Rotator Installed on Wellhead',
  },
  'hd-plunger': {
    tag: 'HD Plunger', icon: 'Gauge', image: IMG('process-1'),
    subheadline: 'Heavy-Duty Plungers Built for Extended Run Life',
    description: 'Our HD plungers are built to tight tolerances for reliable sealing and long service life, even in abrasive or corrosive well conditions. Built with premium materials and precision fit, they help reduce slippage and keep your pump running efficiently between pulls.',
    offerings: ['HD plungers in multiple sizes and fits', 'Premium wear-resistant coatings available', 'Precision machining for consistent sealing', 'Fast turnaround on repair and replacement'],
    benefits: [
      { title: 'Precision Fit & Sealing', description: 'Tight tolerances reduce fluid slippage for consistent pump efficiency.' },
      { title: 'Wear-Resistant Materials', description: 'Built to handle abrasive and corrosive well fluids without premature failure.' },
      { title: 'Longer Run Life', description: 'Quality construction extends time between pulls and lowers lifting costs.' },
      { title: 'Quick Turnaround', description: 'In-stock sizes and fast shop turnaround keep your pump running.' },
    ],
    imageAlt: 'HD Plunger - Precision Machined',
  },
  'pipe-valves-fittings': {
    tag: 'PVF', icon: 'Wrench', image: IMG('industry-petrochemical'),
    subheadline: 'Pressure-Rated Pipe, Valves and Fittings for Every Hookup',
    description: 'From wellhead hookups to tank battery manifolds, we supply pressure-rated pipe, valves and fittings built to meet the demanding standards of Permian Basin operations. Ball valves, check valves, plug valves, swages, nipples and flanges — all in stock and ready to ship.',
    offerings: ['Ball valves, check valves and plug valves', 'High-pressure fittings, swages and nipples', 'Flanges and wellhead connection components', 'Custom hookup configurations on request'],
    benefits: [
      { title: 'Complete Wellhead Solutions', description: 'From stuffing box packing to flowline connections, we supply full hookups.' },
      { title: 'Pressure-Rated Reliability', description: 'Valves and fittings certified for demanding Permian Basin pressure regimes.' },
      { title: 'Battery Connections', description: 'Everything required for reliable tank battery plumbing and manifold setups.' },
      { title: 'Fast Delivery to Wellsite', description: 'Prompt dispatch across Texas and New Mexico to keep workovers on schedule.' },
    ],
    imageAlt: 'Pipe, Valves & Fittings',
  },
  'poly': {
    tag: 'Poly', icon: 'Layers', image: IMG('service-poly-pipe-fittings'),
    subheadline: 'Durable, High-Quality Materials for Your Oilfield Operations',
    description: 'We supply a wide range of poly pipe and fittings designed for oilfield applications. Our poly pipe solutions are built to last, providing the strength and flexibility needed to perform under the most demanding conditions. From installations to repairs, we ensure you have the right materials to get the job done efficiently.',
    offerings: ['Poly pipe for water transportation and well servicing', 'A variety of sizes and pressure ratings (SDR ratings)', 'Electrofusion and butt-fusion poly fittings', 'Expert guidance on selecting the right materials for your operation'],
    benefits: [
      { title: 'Corrosion-Free Longevity', description: 'Poly pipe withstands harsh produced water, chemicals, and corrosive fluids.' },
      { title: 'Flexible & High-Strength', description: 'Absorbs terrain variations and pressure surges without cracking.' },
      { title: 'Full Range of Fittings', description: 'Tees, elbows, transition fittings, and flanged adapters in stock.' },
      { title: 'Proven Field Performance', description: 'Trusted by operators across the Permian Basin for reliable transfer lines.' },
    ],
    imageAlt: 'Poly Pipe & SDR Pressure Fittings',
  },
  'complete-facility-buildouts': {
    tag: 'Facility Buildouts', icon: 'Building2', image: IMG('process-2'),
    subheadline: 'Full-Service Tank Battery and Facility Construction',
    description: 'From initial planning to final hookup, we manage complete tank battery and facility buildouts for operators across the Permian Basin. Our team coordinates equipment, materials and installation so your facility comes online on schedule and on spec.',
    offerings: ['Tank battery design and construction', 'Equipment sourcing and coordination', 'Facility hookup and commissioning support', 'Project scheduling and on-site coordination'],
    benefits: [
      { title: 'Single Point of Contact', description: 'One team manages planning, materials and installation from start to finish.' },
      { title: 'Experienced Project Management', description: 'Our project managers have overseen facility builds ranging into the millions.' },
      { title: 'On-Schedule Delivery', description: 'Careful coordination keeps your buildout on track and on budget.' },
      { title: 'Built to Spec', description: 'Facilities constructed to your operational and regulatory requirements.' },
    ],
    imageAlt: 'Complete Facility Buildout',
  },
  'general-oilfield-supply': {
    tag: 'Oilfield Supplies', icon: 'Truck', image: IMG('cta'),
    subheadline: 'Everything You Need for Oilfield Maintenance and Operation',
    description: 'From general equipment to complete battery hookups to complete wellhead hookups, Trinity Pump & Supply offers a comprehensive range of oilfield supplies. Whether you need valves, fittings, or other essential materials, we have you covered with products that meet the highest industry standards.',
    offerings: ['Valves (ball valves, check valves, plug valves)', 'Wellhead hookups, BOPs, stuffing boxes, and flanges', 'Tank battery supplies and manifold equipment', 'High-pressure fittings, swages, and nipples'],
    benefits: [
      { title: 'Complete Wellhead Solutions', description: 'From stuffing box packing to flowline connections, we supply full hookups.' },
      { title: 'Pressure-Rated Reliability', description: 'Valves and fittings certified for demanding Permian Basin pressure regimes.' },
      { title: 'Battery Connections', description: 'Everything required for reliable tank battery plumbing and manifold setups.' },
      { title: 'Fast Delivery to Wellsite', description: 'Prompt dispatch across Texas and New Mexico to keep workovers on schedule.' },
    ],
    imageAlt: 'General Oilfield Supply - Valves & Flanges',
  },
  'technical-support-planning': {
    tag: 'Technical Support', icon: 'MessageSquare', image: IMG('hero'),
    subheadline: 'Engineering Guidance from Well Evaluation to Startup',
    description: "Our team provides technical support and planning assistance from initial well evaluation through equipment selection and startup. Whether you're troubleshooting an underperforming well or planning a new buildout, we help you make informed decisions before you spend a dollar.",
    offerings: ['Well evaluation and equipment selection guidance', 'Troubleshooting for underperforming wells', 'Project planning and bid support', 'On-call technical consultation'],
    benefits: [
      { title: 'Experienced Guidance', description: 'Decades of rod pump and project management experience behind every recommendation.' },
      { title: 'Reduced Trial and Error', description: 'Get it right the first time with equipment matched to your well conditions.' },
      { title: 'Planning Support', description: 'Help with bidding, estimating and scheduling for larger projects.' },
      { title: 'Direct Access to Our Team', description: 'Talk to the people who will actually build and support your equipment.' },
    ],
    imageAlt: 'Technical Support & Planning',
  },
  'trailer-support-on-site-operations': {
    tag: 'Trailer Support', icon: 'Warehouse', image: IMG('industry-mining'),
    subheadline: 'Mobile Support Equipment for Field Operations',
    description: 'We provide trailer-mounted support equipment for on-site operations, helping crews stay equipped and productive without repeated trips back to the yard. From tooling to supplies, our trailer support keeps your field team moving.',
    offerings: ['Trailer-mounted equipment and tooling', 'On-site supply support for active jobs', 'Coordination with your field crews', 'Flexible scheduling for project timelines'],
    benefits: [
      { title: 'Less Downtime', description: 'Equipment and supplies on-site mean fewer delays waiting on parts.' },
      { title: 'Flexible Field Support', description: 'Trailer support scaled to the size and duration of your project.' },
      { title: 'Coordinated with Your Crew', description: 'We work directly with your field team to keep the job moving.' },
      { title: 'Reliable Availability', description: 'Dependable scheduling so support shows up when you need it.' },
    ],
    imageAlt: 'Trailer Support for On-Site Operations',
  },
};

/* ────────────────────────────────────────────────────────────
   3) Navbar
   ──────────────────────────────────────────────────────────── */
const navbarLinks = [
  { label: 'Home', href: '/' },
  { label: 'Artificial Lift', href: '/services/', useMegaMenu: true, megaCategory: 'artificial-lift' },
  { label: 'Projects / Supplies', href: '/services/', useMegaMenu: true, megaCategory: 'projects-supplies' },
  { label: 'About Us', href: '/about-us/', subLinks: [
      { label: 'Our Story', href: '/about-us/' },
      { label: 'Leadership', href: '/about/team/' },
    ] },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Contact Us', href: '/contact-us/' },
];

/* ────────────────────────────────────────────────────────────
   4) Team / Leadership bios
   ──────────────────────────────────────────────────────────── */
const teamMembers = [
  {
    id: 'olin-brown', name: 'Olin Brown', role: 'CEO & President', image: '/images/trinity/team/olin-brown.jpg', linkedin: '',
    email: 'Olin@trinitypumpsupply.com', badge1: '15+ Years Rod Pump Experience', badge2: 'Majority Owner',
    description: [
      'Olin Brown is the CEO and President of Trinity Pump & Supply, an Odessa, Texas-based oilfield service and supply company serving operators throughout the Permian Basin.',
      "With more than 15 years of hands-on rod pump and artificial lift experience, Olin brings a strong technical background to Trinity's leadership. His experience spans rod pump applications, troubleshooting, equipment selection, downhole performance, production challenges, and the day-to-day demands of supporting oil and gas operators in the field.",
      "As majority owner and managing partner, Olin oversees Trinity's overall strategy, operations, customer development, quality standards, and continued growth. Under his leadership, Trinity has developed into a multi-million-dollar operation specializing in artificial lift, downhole rod pumps, production equipment, PVF, and oilfield supply.",
      "Olin's approach combines technical knowledge with strong customer relationships and a practical understanding of what operators need from their vendors: quality equipment, quick turnaround, dependable communication, and a team that stands behind its work.",
      'He remains directly involved in key customer relationships, rod pump operations, quality programs, product development, and the continued expansion of Trinity Pump & Supply throughout the Permian Basin and beyond.',
    ],
  },
  {
    id: 'sim', name: 'Sim', role: 'Project Manager', image: '/images/trinity/team/sim.jpg', linkedin: '',
    email: 'Sim@trinitypumpsupply.com', badge1: '15+ Years Experience', badge2: 'Large-Scale Project Management',
    description: [
      'Sim serves as Project Manager for Trinity Pump & Supply, bringing more than 15 years of experience across rod pump operations and oilfield project management.',
      'Throughout his career, Sim has managed and supported major oilfield facility projects ranging into the eight- and nine-figure range, giving him extensive experience in project planning, bidding, estimating, customer coordination, scheduling, and execution. His focus is ensuring complex buildouts are completed safely, efficiently, and with clear communication between the customer, vendors, and field teams.',
      'In addition to his project background, Sim spent several years as a shop foreman for a major rod pump supplier, giving him valuable hands-on knowledge of rod pump equipment, shop operations, quality expectations, and artificial lift applications.',
      'That combination of large-scale project management, bidding experience, customer service, and rod pump expertise allows Sim to bridge the gap between the field, the shop, and the customer.',
      'At Trinity, he plays a key role in overseeing major projects from initial bid through completion while helping ensure every job is executed with the responsiveness, quality, and attention to detail Trinity Pump & Supply is built around.',
    ],
  },
  {
    id: 'josh', name: 'Josh', role: 'Shop Manager', image: '/images/trinity/team/josh.jpg', linkedin: '',
    email: 'Josh@trinitypumpsupply.com', badge1: '12+ Years Oil & Gas Experience', badge2: 'Rod Pump Shop Operations',
    description: [
      'Josh serves as Shop Manager for Trinity Pump & Supply, bringing more than 12 years of experience in the oil and gas industry across warehouse operations, shop management, counter sales, inventory, and customer support.',
      'Throughout his career, Josh has developed a strong understanding of oilfield equipment, shop workflow, inventory control, and the importance of keeping customers supplied and operations moving efficiently.',
      "At Trinity, Josh has been personally trained and mentored by Olin Brown in rod pump operations and now oversees the company's day-to-day rod pump shop activities. His responsibilities include pump assembly and repair, quality control, shop organization, workflow management, inventory coordination, and ensuring equipment is built and prepared to Trinity's standards before it reaches the customer.",
      "Josh's combination of oilfield experience, operational leadership, customer service, and hands-on rod pump knowledge makes him a key part of Trinity's artificial lift operation.",
      'As Shop Manager, he helps ensure every rod pump job moves through the shop efficiently, accurately, and with the quality and attention to detail Trinity Pump & Supply expects.',
    ],
  },
  {
    id: 'loren', name: 'Loren', role: 'Accountant', image: '/images/trinity/team/loren.jpg', linkedin: '',
    email: 'Loren@trinitypumpsupply.com', badge1: 'BBA in Accounting', badge2: 'Financial Operations',
    description: [
      'Loren serves as Accountant for Trinity Pump & Supply, bringing a strong background in accounting, financial administration, banking, and business operations.',
      'She earned her Bachelor of Business Administration in Accounting from Eastern New Mexico University and brings several years of professional accounting experience to Trinity. Prior to joining the company, Loren spent nearly four years with NRT Consulting Group, where she developed extensive experience in accounts payable, account reconciliation, financial recordkeeping, and day-to-day accounting support.',
      "At Trinity, Loren helps oversee the company's accounting processes and financial organization, ensuring transactions are accurately recorded, accounts remain reconciled, and management has reliable financial information to support business decisions.",
      'Her combination of formal accounting education, hands-on financial experience, attention to detail, and understanding of business operations makes her an important part of Trinity\'s continued growth.',
      'As Trinity Pump & Supply continues to expand, Loren plays a key role in maintaining the financial structure, accuracy, and accountability needed to support a growing oilfield organization.',
    ],
  },
  {
    id: 'lyndon-kauk', name: 'Lyndon Kauk', role: 'Business Development', image: '/images/trinity/team/lyndon-kauk.jpg', linkedin: '',
    email: '', badge1: '20+ Years Oil & Gas Experience', badge2: 'BBA Finance, Texas Tech',
    description: [
      'Lyndon Kauk serves in Business Development for Trinity Pump & Supply, bringing more than 20 years of oil and gas experience with a strong background in sales, customer relations, business development, and company leadership.',
      'Throughout his career, Lyndon has built long-standing relationships with oil and gas producers, service companies, and industry professionals across the Permian Basin. He is known for his ability to understand customer needs, develop strong partnerships, and maintain the level of communication and service required to earn long-term business.',
      'Before joining Trinity, Lyndon spent more than a decade as Vice President and Owner of Maple Leaf Marketing, where he helped build and operate a successful oilfield business focused on specialty downhole production products. His career also includes experience in downhole pump sales, production equipment, account management, and general management.',
      'Lyndon also holds a BBA in Finance from Texas Tech University, combining his industry experience with a strong business foundation.',
      "At Trinity, Lyndon focuses on developing new business, strengthening existing customer relationships, and connecting operators with solutions that improve their operations. His extensive industry network, sales experience, and customer-first approach make him an important part of Trinity Pump & Supply's continued growth.",
    ],
  },
];

const teamSection = {
  badge: 'OUR LEADERSHIP',
  headlinePrefix: 'Leadership',
  headlineHighlight: 'with Decades of Oilfield Experience',
  headlineSuffix: '',
  description: 'The people behind Trinity Pump & Supply — combining hands-on rod pump expertise, large-scale project management, and a commitment to keeping Permian Basin operators running.',
};

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);

  const contentCol = db.collection('site_contents');
  const pagesCol = db.collection('pages');

  // ── A) Content doc: navbar, services catalogue, team, address ──
  const footerSelectedServices = [
    'rod-pumps', 'hd-rod-rotator', 'artificial-lift-supplies', 'poly',
    'pipe-valves-fittings', 'general-oilfield-supply', 'complete-facility-buildouts', 'technical-support-planning',
  ];

  const set = {
    'data.navbar.companyLinks': navbarLinks,
    'data.navbar.links': navbarLinks,
    'data.services.services': serviceCatalogue,
    'data.services.items': [], // empty = curated grid shows the whole catalogue
    'data.quote.services': serviceCatalogue.map((s) => ({ label: s.title, value: s.slug })),
    'data.footer.services.selectedServices': footerSelectedServices,
    'data.footer.contact.address': ADDRESS,
    'data.settings.contactAddress': ADDRESS,
    'data.team.section': teamSection,
    'data.team.members': teamMembers,
  };

  const r = await contentCol.updateOne({ key: 'complete_data' }, { $set: set }, { upsert: true });
  console.log(`site_contents.complete_data: matched=${r.matchedCount} modified=${r.modifiedCount}`);

  // Fix the address inside the existing FAQ answer text (string replace, not overwrite)
  const doc = await contentCol.findOne({ key: 'complete_data' });
  const faqs = doc?.data?.faq?.items || doc?.data?.faq || [];
  if (Array.isArray(faqs)) {
    let changed = false;
    const updated = faqs.map((f) => {
      if (f && typeof f.answer === 'string' && f.answer.includes('2501 FM 866, Odessa, TX 79763')) {
        changed = true;
        return { ...f, answer: f.answer.replace('2501 FM 866, Odessa, TX 79763', ADDRESS) };
      }
      return f;
    });
    if (changed) {
      const key = doc.data.faq.items ? 'data.faq.items' : 'data.faq';
      await contentCol.updateOne({ key: 'complete_data' }, { $set: { [key]: updated } });
      console.log('faq address updated');
    }
  }

  // Mirror into pages.home content (same shape used by earlier seed script)
  await pagesCol.updateOne(
    { slug: 'home' },
    { $set: {
      'content.navbar.companyLinks': navbarLinks,
      'content.services.services': serviceCatalogue,
      'content.team.section': teamSection,
      'content.team.members': teamMembers,
      'content.footer.contact.address': ADDRESS,
    } }
  );

  // ── B) Publish the Team page ──
  const teamPageR = await pagesCol.updateOne(
    { slug: 'about/team' },
    { $set: { status: 'published', updatedAt: new Date() } }
  );
  console.log(`about/team published: matched=${teamPageR.matchedCount} modified=${teamPageR.modifiedCount}`);

  // ── C) Create/update the 13 service-detail pages ──
  let created = 0, updated = 0;
  for (let i = 0; i < serviceCatalogue.length; i++) {
    const svc = serviceCatalogue[i];
    const pc = pageContent[svc.slug];
    if (!pc) continue;
    const number = String(i + 1).padStart(2, '0');
    const content = {
      service: {
        id: number, number, name: svc.title, title: svc.title, slug: svc.slug,
        tag: pc.tag, icon: pc.icon, image: pc.image, status: 'published',
        subheadline: pc.subheadline, description: pc.description,
        offerings: pc.offerings, benefits: pc.benefits, imageAlt: pc.imageAlt,
      },
    };
    const res = await pagesCol.updateOne(
      { slug: svc.slug },
      {
        $set: {
          title: svc.title,
          template: 'service-detail',
          status: 'published',
          isTrashed: false,
          featuredImage: pc.image,
          seo: {
            metaTitle: `${svc.title} | ${COMPANY} Odessa TX`,
            metaDescription: pc.description.slice(0, 155),
            canonicalUrl: `https://trinitypumpsupply.com/${svc.slug}/`,
            metaRobotsIndex: 'index',
            metaRobotsFollow: 'follow',
          },
          content,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
    if (res.upsertedCount > 0) created++; else if (res.modifiedCount > 0) updated++;
  }
  console.log(`service-detail pages: created=${created} updated=${updated}`);

  // ── D) Retire superseded old service slugs (kept as drafts, not deleted) ──
  const retireSlugs = ['downhole-rod-pumps', 'downhole-supplies', 'general-oilfield-supplies', 'poly-pipe-and-fittings', 'battery-wellhead-supplies'];
  const retireR = await pagesCol.updateMany(
    { slug: { $in: retireSlugs } },
    { $set: { status: 'draft', updatedAt: new Date() } }
  );
  console.log(`retired superseded service pages: ${retireR.modifiedCount}`);

  await client.close();
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
