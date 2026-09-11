/**
 * Seed the homepage, header and footer with Trinity Pump & Supply's real
 * content (from the client's current site). Writes only the sections listed
 * below in site_contents.complete_data, mirrors them into the Home page
 * document, and upserts three blog posts (by slug) for the homepage carousel.
 *
 * Run:  node scripts/seed_trinity_homepage.cjs
 * Images live under public/images/trinity/ (see CREDITS.md there).
 */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';
const IMG = (name) => `/images/trinity/${name}.jpg`;

const COMPANY = 'Trinity Pump & Supply';
const PHONE = '830-279-3996';
const PHONE_TEL = 'tel:8302793996';
const EMAIL = 'trinitypumpsupply@gmail.com';
const ADDRESS = '2501 FM 866, Odessa, TX 79763';

const hero = {
  label: 'DOWNHOLE ROD PUMPS & OILFIELD SUPPLIES',
  badge: 'DOWNHOLE ROD PUMPS & OILFIELD SUPPLIES',
  title1: 'Your Trusted Partner for Downhole Rod Pumps and',
  title2: 'Oilfield Supplies',
  description: 'Delivering high-quality USA-manufactured pump parts and services across Texas and New Mexico.',
  ctaBook: 'Call Now',
  ctaBookUrl: PHONE_TEL,
  bookingUrl: PHONE_TEL,
  ctaServices: 'Contact Us',
  ctaServicesUrl: '/contact-us/',
  image: IMG('hero'),
  images: [IMG('hero')],
  imageAlt: 'Pump jacks on an oil lease at sunset',
  bgImageAlt: 'Pump jacks on an oil lease at sunset',
  features: [
    { icon: 'Flag', title: 'USA-Manufactured', subtitle: 'Pump Parts' },
    { icon: 'Award', title: '100+ Years', subtitle: 'Combined Experience' },
    { icon: 'MapPin', title: 'Texas & New Mexico', subtitle: 'Service Area' },
  ],
};

const stats = {
  items: [
    { value: '100+', label: 'Years of Combined Experience', icon: 'Award' },
    { value: 'USA', label: 'Manufactured Pump Parts', icon: 'ShieldCheck' },
    { value: 'TX & NM', label: 'Oilfield Coverage', icon: 'Globe' },
    { value: '6', label: 'Product & Service Lines', icon: 'Package' },
  ],
};

const serviceCatalogue = [
  { title: 'Downhole Rod Pumps', description: 'Manufacturing, building and repairing downhole sucker rod pumps with USA-made parts.', slug: 'downhole-rod-pumps', icon: 'pump' },
  { title: 'Burleson HD Rod Rotator', description: 'Heavy-duty rod rotators built to outperform, extending rod and pump life.', slug: 'hd-rod-rotator', icon: 'RefreshCw' },
  { title: 'Downhole Supplies', description: 'Quality downhole components and accessories for longer pump runs.', slug: 'downhole-supplies', icon: 'Wrench' },
  { title: 'General Oilfield Supplies', description: 'Everyday oilfield supplies delivered on time across Texas and New Mexico.', slug: 'general-oilfield-supplies', icon: 'Package' },
  { title: 'Battery & Well head Supplies', description: 'Tank battery and wellhead supplies to keep your lease producing.', slug: 'battery-wellhead-supplies', icon: 'Gauge' },
  { title: 'Poly Pipe and Fittings', description: 'Poly pipe and fittings for gathering, transfer and lease piping.', slug: 'poly-pipe-and-fittings', icon: 'Droplets' },
];

const servicesSection = {
  label: 'OUR SERVICES',
  badge: 'OUR SERVICES',
  title: 'Downhole Pumps, Rod Rotators & Oilfield Supplies',
  description: 'From well evaluation to comprehensive pump inspection and repair, we manufacture, build and repair downhole sucker rod pumps and supply everything your lease needs.',
  ctaAll: 'View All Services',
  ctaAllUrl: '/services/',
  items: [], // empty = show the whole catalogue above
  services: serviceCatalogue,
};

const industries = {
  badge: 'WHO WE SERVE',
  title: 'Oilfield Operators Across the Permian Basin',
  description: 'We serve oilfield operators throughout Texas and New Mexico with a focus on lowering pump-related lifting costs and maximizing production efficiency.',
  ctaLabel: 'Contact Us',
  ctaLink: '/contact-us/',
  cards: [
    { image: IMG('industry-oil-gas'), title: 'Oil & Gas Operators', subtitle: 'Exploration & Production', cta: 'Learn More', ctaLink: '/services/' },
    { image: IMG('industry-manufacturing'), title: 'Well Servicing', subtitle: 'Pulling & Workover Crews', cta: 'Learn More', ctaLink: '/downhole-rod-pumps/' },
    { image: IMG('industry-petrochemical'), title: 'Tank Batteries & Wellheads', subtitle: 'Battery & Wellhead Supplies', cta: 'Learn More', ctaLink: '/battery-wellhead-supplies/' },
    { image: IMG('industry-water'), title: 'Gathering & Transfer', subtitle: 'Poly Pipe & Fittings', cta: 'Learn More', ctaLink: '/poly-pipe-and-fittings/' },
    { image: IMG('industry-mining'), title: 'Lease Operations', subtitle: 'General Oilfield Supplies', cta: 'Learn More', ctaLink: '/general-oilfield-supplies/' },
  ],
};

const leadership = {
  label: 'ABOUT US',
  title: 'Your Trusted Partner in Downhole Rod Pumps & Oilfield Supplies',
  desc1: '<p>At Trinity Pump &amp; Supply, we are dedicated to providing industry-leading solutions for your oilfield operations. With over 100+ years of combined experience, our team specializes in manufacturing, building, and repairing downhole sucker rod pumps. From well evaluation to comprehensive pump inspection and repair services, we offer unparalleled expertise and commitment to quality.</p>',
  photoBadgeTitle: 'Quality at All Costs',
  photoBadgeSubtitle: 'USA-made parts, longer pump runs',
  photoBadge: 'Quality at All Costs USA-made parts, longer pump runs',
  photoBadgeIcon: 'ShieldCheck',
  image: IMG('about'),
  imageAlt: 'Pump jacks and tank battery on a Texas lease',
  ctaMore: 'Learn More About Us',
  ctaLink: '/about-us/',
  stats: [
    { value: '100+', label: 'Years Combined Experience' },
    { value: 'USA', label: 'Manufactured Parts' },
    { value: 'TX & NM', label: 'Service Area' },
    { value: '6', label: 'Product Lines' },
  ],
};

const whyChooseUs = {
  badge: 'WHY CHOOSE US',
  title: 'Why Choose Trinity Pump & Supply?',
  description: "In the oilfield industry, it's not just about what you pay, but how many times you pay it. By producing high-quality, long-lasting pump parts, we help you minimize pulling costs and extend the lifespan of your equipment.",
  image: IMG('why-choose-us'),
  imageAlt: 'Technician working on pump equipment',
  features: [
    { icon: 'Award', title: 'Over 100+ Years of Expertise', description: 'Extensive experience guarantees the highest quality products and solutions tailored to your needs.' },
    { icon: 'ShieldCheck', title: 'Quality You Can Trust', description: 'We exclusively use USA-manufactured alloy steel, 316 Stainless and Monel for our downhole pump parts.' },
    { icon: 'TrendingUp', title: 'Lower Lifting Costs', description: 'Longer-lasting pump parts mean fewer replacements and repairs, lowering your lifting costs.' },
    { icon: 'Truck', title: 'Timely Delivery and Service', description: 'On-time deliveries, and we keep you informed throughout the process.' },
    { icon: 'BadgeCheck', title: 'Honesty and Transparency', description: 'Clear communication and trustworthy business practices.' },
    { icon: 'Star', title: 'Service Excellence', description: 'We aim to exceed expectations with every project, at competitive pricing.' },
  ],
};

const processSection = {
  label: 'HOW WE WORK',
  title: 'From Well Evaluation to Longer Pump Runs',
  description: 'A straightforward process focused on one goal: lowering your pump-related lifting costs and maximizing the longevity of your well.',
  image: '',
  phaseLabel: 'Step',
  items: [
    { step: '01', icon: 'ClipboardList', title: 'Well Evaluation', description: 'We evaluate your well and pumping conditions to recommend the right pump and parts.' },
    { step: '02', icon: 'Wrench', title: 'Build or Repair', description: 'We manufacture, build and repair downhole sucker rod pumps using USA-made parts.' },
    { step: '03', icon: 'Truck', title: 'Timely Delivery', description: 'On-time delivery across Texas and New Mexico, with clear communication throughout.' },
    { step: '04', icon: 'Headphones', title: 'Inspection & Support', description: 'Comprehensive pump inspection and repair services to keep your equipment running longer.' },
  ],
};

const testimonialItems = [
  {
    quote: 'Gave Trinity Pump & Supply a chance with their rod rotators and they have not skipped a beat. With the recommended maintenance they have proven themselves to be bulletproof. If you want a product in the field that you can essentially "set it and forget it", a rod rotator from Trinity Pump & Supply will check off that box.',
    author: 'Major Oil & Gas Company', name: 'Major Oil & Gas Company', role: 'Rod Rotator Customer', avatar: '',
  },
  {
    quote: "Been doing business with Olin and his team over at Trinity Pump & Supply for a couple years now and can't say enough great things about them. With every request and task that has been thrown their way, they have gone above and beyond to ensure we're not left hanging. The service they provide and expertise on their products is unmatched.",
    author: 'Michael Snider', name: 'Michael Snider', role: 'ConocoPhillips', avatar: '',
  },
  {
    quote: 'The quickest, most reliable service we have ever received in the Permian Basin.',
    author: 'Sabinal Energy', name: 'Sabinal Energy', role: 'Permian Basin Operator', avatar: '',
  },
];
const testimonials = { label: 'CLIENT TESTIMONIALS', title: 'What Our Clients Say', testimonials: testimonialItems, items: testimonialItems };

const ctaBanner = {
  label: 'GET IN TOUCH',
  tagline: 'GET IN TOUCH',
  title: 'Ready to Optimize Your Oilfield Operations?',
  description: 'Get in touch with Trinity Pump & Supply today for high-quality downhole pumps and oilfield supplies. Let us help you reduce operational costs and improve efficiency.',
  button: 'Contact Us',
  buttonUrl: '/contact-us/',
  btnUrl: '/contact-us/',
  phone: PHONE,
  email: EMAIL,
  image: IMG('cta'),
};

const faq = {
  section: {
    badge: 'FAQ',
    headline: 'Frequently Asked Questions',
    title: 'Frequently Asked Questions',
    description: 'Quick answers about our pumps, rod rotators, parts and service area. Still unsure? Call our Odessa office.',
    ctaText: 'Still have a question? Contact us',
  },
  items: [
    { question: 'What do you manufacture and repair?', answer: 'We manufacture, build and repair downhole sucker rod pumps, and we supply the Burleson HD Rod Rotator, downhole supplies, general oilfield supplies, battery and wellhead supplies, and poly pipe and fittings.' },
    { question: 'What materials do you use for pump parts?', answer: 'We exclusively use high-quality USA-manufactured alloy steel, 316 Stainless and Monel for our downhole pump parts, designed for longer pump runs.' },
    { question: 'Where do you operate?', answer: 'We serve oilfield operators throughout Texas and New Mexico from our shop at 2501 FM 866, Odessa, TX 79763.' },
    { question: 'How do you help lower lifting costs?', answer: 'By producing long-lasting pump parts and repairing pumps to last, we reduce how often you have to pull a well, minimizing pulling costs and extending equipment life.' },
    { question: 'How do I get a quote?', answer: `Call ${PHONE}, email ${EMAIL}, or use the form on this page. Tell us about your well and we will respond promptly with pricing and availability.` },
  ].map((f) => ({ ...f, q: f.question, a: f.answer })),
};

const quotePatch = {
  'data.quote.section.badge': 'REQUEST A FREE QUOTE',
  'data.quote.section.headline': 'Request a Free Quote',
  'data.quote.section.description': 'We offer high-quality USA-manufactured pump parts and comprehensive oilfield solutions to keep your operations running smoothly. Choose us for honesty, reliability, and products that stand the test of time.',
  'data.quote.formBtnSubmit': 'Request Quote',
  'data.quote.trustHipa': 'High-Quality USA-Manufactured Parts',
  'data.quote.trustResponse': 'Serving Texas & New Mexico',
  'data.quote.formClinicPortal': 'DIRECT LINE',
  'data.quote.formClinicPortalSub': `Call our Odessa office at ${PHONE}`,
  'data.quote.formStyleSeatBtn': `Call ${PHONE}`,
  'data.quote.formClinicPortalUrl': PHONE_TEL,
  'data.quote.services': serviceCatalogue.map((s) => ({ label: s.title, value: s.slug })),
};

const posts = [
  {
    slug: 'why-usa-made-sucker-rod-pump-parts-lower-lifting-costs',
    title: 'Why USA-Made Sucker Rod Pump Parts Lower Your Lifting Costs',
    excerpt: "It's not just what you pay for a pump, but how many times you pay it. Here's how part quality drives pulling costs.",
    featuredImage: IMG('about'),
    publishedAt: new Date('2025-05-12T09:00:00Z'),
    content: '<p>In the oilfield, the price of a pump part is only the first cost. Every time a well has to be pulled, you pay again in rig time, lost production and labor.</p><h2>Material matters</h2><p>USA-manufactured alloy steel, 316 Stainless and Monel components resist wear and corrosion far longer than budget alternatives, which means longer pump runs between pulls.</p><h2>What that means for your lease</h2><ul><li>Fewer pulling jobs per year.</li><li>Less downtime and deferred production.</li><li>Lower pump-related lifting cost per barrel.</li></ul><p>That is the philosophy behind every pump we build or repair at Trinity Pump &amp; Supply.</p>',
  },
  {
    slug: 'how-a-rod-rotator-extends-sucker-rod-life',
    title: 'How a Rod Rotator Extends Sucker Rod and Tubing Life',
    excerpt: 'A quick look at what a heavy-duty rod rotator does downhole and why maintenance keeps it "set it and forget it".',
    featuredImage: IMG('blog-pump'),
    publishedAt: new Date('2025-04-28T09:00:00Z'),
    content: '<p>A rod rotator slowly turns the sucker rod string so wear from rod-on-tubing contact is spread evenly around the rod and coupling instead of grinding one side flat.</p><h2>Why heavy duty</h2><p>Loose arms and rotators that stop turning send crews back to the well. The Burleson HD Rod Rotator is built to keep rotating in Permian conditions.</p><h2>Keep it greased</h2><p>With the recommended greasing schedule, a rotator should run for years without attention. Add it to the same maintenance visit as your pumping unit.</p>',
  },
  {
    slug: 'downhole-pump-inspection-what-we-check-and-why',
    title: 'Downhole Pump Inspection: What We Check and Why',
    excerpt: 'From barrel and plunger fit to valves and cages, a thorough teardown tells you why a pump failed and how to prevent the next pull.',
    featuredImage: IMG('blog-safety'),
    publishedAt: new Date('2025-04-15T09:00:00Z'),
    content: '<p>When a pump comes into our Odessa shop, we do not just swap parts. A full inspection tells you what actually happened downhole.</p><h2>What we look at</h2><ul><li>Barrel and plunger clearance and scoring.</li><li>Standing and traveling valve seats and balls.</li><li>Cages, seating assemblies and hold-downs.</li><li>Evidence of sand, scale, gas interference or corrosion.</li></ul><h2>Why it matters</h2><p>Matching the repair and the metallurgy to the failure mode is how you turn a repeat puller into a long-running well.</p>',
  },
];
// Earlier placeholder posts to unpublish (kept in the database as drafts)
const retireSlugs = ['importance-of-using-high-quality-lubricants', 'how-to-choose-the-right-pump-for-your-industry', 'safety-tips-for-handling-industrial-oils'];

const navbarLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/', useMegaMenu: true },
  { label: 'HD Rod Rotator', href: '/hd-rod-rotator/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Contact Us', href: '/contact-us/' },
];

const navbarPatch = {
  'data.navbar.logo': '',
  'data.navbar.siteTitle': COMPANY,
  'data.navbar.logoText1': 'TRINITY PUMP & SUPPLY',
  'data.navbar.logoText2': 'Downhole Rod Pumps • Oilfield Supplies',
  'data.navbar.ctaText': 'Call Now',
  'data.navbar.ctaLink': PHONE_TEL,
  'data.navbar.companyLinks': navbarLinks,
  'data.navbar.links': navbarLinks,
};

const footerPatch = {
  'data.footer.company.logo': '',
  'data.footer.company.name': 'TRINITY PUMP & SUPPLY',
  'data.footer.company.tagline': 'Downhole Rod Pumps • Oilfield Supplies',
  'data.footer.company.description': 'Delivering high-quality USA-manufactured pump parts and services across Texas and New Mexico.',
  'data.footer.services.title': 'Our Services',
  'data.footer.services.selectedServices': serviceCatalogue.map((s) => s.slug),
  'data.footer.services.materials': { title: 'Quick Links', items: [
    { label: 'Home', href: '/' }, { label: 'Services', href: '/services/' }, { label: 'HD Rod Rotator', href: '/hd-rod-rotator/' },
    { label: 'About Us', href: '/about-us/' }, { label: 'Reviews', href: '/reviews/' }, { label: 'Contact Us', href: '/contact-us/' },
  ] },
  'data.footer.contact.title': 'Contact Information',
  'data.footer.contact.phone': PHONE,
  'data.footer.contact.email': EMAIL,
  'data.footer.contact.address': ADDRESS,
  'data.footer.contact.hours': '',
  'data.footer.bottom.copyright': `© ${new Date().getFullYear()} ${COMPANY}. All Rights Reserved.`,
  'data.footer.bottom.creditText': 'Designed & Developed by',
  'data.footer.bottom.creditName': 'Mohsin Designs',
  'data.footer.bottom.creditUrl': 'https://mohsindesigns.com/',
  'data.footer.bottom.links': [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Service', href: '/terms/' },
  ],
  'data.footer.social': [],
};

const settingsPatch = {
  'data.settings.siteTitle': COMPANY,
  'data.settings.companyName': COMPANY,
  'data.settings.contactEmail': EMAIL,
  'data.settings.contactPhone': PHONE,
  'data.settings.contactAddress': ADDRESS,
};

async function main() {
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected. DB: ${dbName}`);

  // 1) Blog posts
  const postsCol = db.collection('posts');
  const r0 = await postsCol.updateMany({ slug: { $in: retireSlugs } }, { $set: { status: 'draft', updatedAt: new Date() } });
  console.log(`retired placeholder posts: ${r0.modifiedCount}`);
  const postIds = [];
  for (const p of posts) {
    const now = new Date();
    const res = await postsCol.findOneAndUpdate(
      { slug: p.slug },
      {
        $set: { ...p, status: 'published', isTrashed: false, trashedAt: null, updatedAt: now,
          seo: { metaTitle: `${p.title} | ${COMPANY}`, metaDescription: p.excerpt, featuredImage: p.featuredImage, featuredImageAlt: p.title } },
        $setOnInsert: { createdAt: now, categories: [], tags: [], location: 'Odessa, TX' },
      },
      { upsert: true, returnDocument: 'after' }
    );
    const doc = res.value || res;
    postIds.push(String(doc._id));
    console.log(`post: ${p.slug} -> ${doc._id}`);
  }

  const blogSection = {
    subtitle: 'FROM THE SHOP',
    title: 'Oilfield Insights & Updates',
    ctaAll: 'View All Articles',
    ctaReadMore: 'Read More',
    viewAllLink: '/blogs/',
    selectedPosts: postIds,
    visible: true,
  };

  // 2) Global content
  const set = {
    'data.hero': hero,
    'data.stats': stats,
    'data.services.label': servicesSection.label,
    'data.services.badge': servicesSection.badge,
    'data.services.title': servicesSection.title,
    'data.services.description': servicesSection.description,
    'data.services.ctaAll': servicesSection.ctaAll,
    'data.services.ctaAllUrl': servicesSection.ctaAllUrl,
    'data.services.items': servicesSection.items,
    'data.services.services': servicesSection.services,
    'data.industries': industries,
    'data.leadership': leadership,
    'data.whyChooseUs': whyChooseUs,
    'data.process': processSection,
    'data.testimonials': testimonials,
    'data.ctaBanner': ctaBanner,
    'data.faq': faq,
    'data.blogSection': blogSection,
    ...quotePatch,
    ...navbarPatch,
    ...footerPatch,
    ...settingsPatch,
    lastUpdated: new Date(),
  };
  const r = await db.collection('site_contents').updateOne({ key: 'complete_data' }, { $set: set }, { upsert: true });
  console.log(`site_contents.complete_data: matched=${r.matchedCount} modified=${r.modifiedCount}`);

  // 3) Mirror into the Home page document
  const pages = db.collection('pages');
  const home = await pages.findOne({ $or: [{ template: 'home' }, { slug: '/' }, { slug: 'home' }], isTrashed: { $ne: true } });
  if (home) {
    const pageSet = {
      title: `${COMPANY} | Downhole Rod Pumps & Oilfield Supplies`,
      'content.hero': hero, 'content.stats': stats, 'content.industries': industries, 'content.leadership': leadership,
      'content.whyChooseUs': whyChooseUs, 'content.process': processSection, 'content.testimonials': testimonials,
      'content.ctaBanner': ctaBanner, 'content.faq': faq, 'content.blogSection': blogSection,
      'content.services.label': servicesSection.label, 'content.services.title': servicesSection.title,
      'content.services.description': servicesSection.description, 'content.services.ctaAll': servicesSection.ctaAll,
      'content.services.ctaAllUrl': servicesSection.ctaAllUrl, 'content.services.items': servicesSection.items,
      'content.services.services': servicesSection.services,
      updatedAt: new Date(),
    };
    for (const [k, v] of Object.entries(quotePatch)) pageSet[k.replace(/^data\./, 'content.')] = v;
    const pr = await pages.updateOne({ _id: home._id }, { $set: pageSet });
    console.log(`pages(home "${home.slug}"): modified=${pr.modifiedCount}`);
  } else {
    console.log('pages: no home page document found (skipped mirror)');
  }

  await client.close();
  console.log('Seed complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });
