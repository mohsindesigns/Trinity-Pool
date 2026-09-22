require('dotenv').config({ path: '.env.local', quiet: true });
const { MongoClient } = require('mongodb');

const SIM = { name: 'Sim', role: 'Project Manager', email: 'sim@trinitypumpsupply.com', image: '/images/trinity/team/sim.jpg' };
const JOSH = { name: 'Josh', role: 'Shop Manager', email: 'josh@trinitypumpsupply.com', image: '/images/trinity/team/josh.jpg' };

const POLY_CONTENT = {
  heroSectionLabel: 'POLY PIPE, FITTINGS & TRANSITIONS',
  heroDescription: "Trinity Pump & Supply features a full line of poly pipe, poly fittings and poly transitions — stocked across SDR 7, SDR 9, SDR 11 and SDR 17 so you get the right pressure rating for your job, not just what's on the shelf.",
  specDurationValue: 'SDR 7 - 17',
  specIntensityValue: 'Pipe, Fittings & Transitions',
  specFocusValue: 'Odessa, TX Shop',
  statsItem1Val: '4', statsItem1Label: 'SDR Ratings Stocked',
  statsItem2Val: 'SDR 7-17', statsItem2Label: 'Full Pressure Range',
  statsItem3Val: '3', statsItem3Label: 'Product Lines',
  statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
  overviewSectionLabel: 'THE RIGHT POLY FOR THE JOB',
  overviewTitle1: 'Poly Pipe, Fittings', overviewTitle2: '& Transitions.',
  overviewDescription: "Whether you're running gathering lines or tying poly into steel, we stock the pipe, fittings and transitions to get it done — across SDR 7, SDR 9, SDR 11 and SDR 17, so the pressure rating matches the job instead of forcing a compromise.",
  benefits: [
    { title: 'Poly Pipe', description: 'Stocked across SDR 7, SDR 9, SDR 11 and SDR 17 for the pressure rating your line actually needs.' },
    { title: 'Poly Fittings', description: 'A full range of poly fittings to match your pipe size and SDR rating, ready for fast turnaround.' },
    { title: 'Poly Transitions', description: 'Poly-to-steel and other transition fittings that keep your gathering system connected and leak-free.' },
    { title: 'Odessa, TX Shop & Delivery', description: 'In-stock inventory and dependable delivery across Texas and New Mexico.' },
  ],
  whoProfiles: [], sessionSteps: [],
  contactPerson: SIM, contactPersonLabel: 'YOUR CONTACT',
  protocolBannerTitlePrefix: 'Need poly pipe, fittings or transitions', protocolBannerTitleSuffix: '?',
};

const PVF_CONTENT = {
  heroSectionLabel: 'PIPE, VALVES & FITTINGS',
  heroDescription: 'From ball, butterfly and gate valves to a full fittings program in Schedule 40, Schedule 80 and Schedule 160 — in both stainless steel and carbon steel — Trinity keeps your PVF program stocked and moving.',
  specDurationValue: 'Sch. 40 / 80 / 160',
  specIntensityValue: 'Stainless & Carbon Steel',
  specFocusValue: 'Odessa, TX Shop',
  statsItem1Val: '3', statsItem1Label: 'Schedule Ratings Stocked',
  statsItem2Val: 'SS & CS', statsItem2Label: 'Stainless & Carbon Steel',
  statsItem3Val: '4+', statsItem3Label: 'Valve Types',
  statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
  overviewSectionLabel: 'A COMPLETE PVF PROGRAM',
  overviewTitle1: 'Pipe, Valves', overviewTitle2: '& Fittings, In Stock.',
  overviewDescription: 'One call covers your PVF needs — ball, butterfly and gate valves, plus a fittings program in Schedule 40, Schedule 80 and Schedule 160, stocked in both stainless steel and carbon steel to match your spec.',
  benefits: [
    { title: 'Butterfly & Gate Valves', description: 'Butterfly and gate valves alongside our ball valve line, sized to your system.' },
    { title: 'Schedule 40, 80 & 160 Fittings', description: 'A full fittings program across Schedule 40, Schedule 80 and Schedule 160 pressure ratings.' },
    { title: 'Stainless & Carbon Steel', description: 'Every schedule stocked in both 316 stainless steel and carbon steel.' },
    { title: 'Odessa, TX Shop & Delivery', description: 'In-stock inventory and dependable delivery across Texas and New Mexico.' },
  ],
  whoProfiles: [], sessionSteps: [],
  protocolBannerTitlePrefix: 'Need valves or fittings on your next job', protocolBannerTitleSuffix: '?',
};

const TRAILER_CONTENT = {
  heroSectionLabel: 'TRAILER SUPPORT FOR ON-SITE OPERATIONS',
  heroDescription: 'Enclosed trailers can be left on-site for projects, giving crews grab-and-go access to the supplies they need for buildouts and offset fracs.',
  specDurationValue: 'Left On-Site',
  specIntensityValue: 'Grab-and-Go Access',
  specFocusValue: 'Odessa, TX Shop',
  statsItem1Val: 'On-Site', statsItem1Label: 'Trailers Stay With the Project',
  statsItem2Val: 'Grab-and-Go', statsItem2Label: 'Crew Access to Supplies',
  statsItem3Val: 'Buildouts', statsItem3Label: '& Offset Fracs Covered',
  statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
  overviewSectionLabel: 'SUPPLIES, RIGHT WHERE THE CREW IS',
  overviewTitle1: 'Trailers Stay', overviewTitle2: 'On-Site With the Project.',
  overviewDescription: 'Enclosed trailers can be left on-site for projects, giving crews grab-and-go access to the supplies they need for buildouts and offset fracs — no waiting on a supply run to keep the job moving.',
  benefits: [
    { title: 'Left On-Site for the Duration', description: 'The trailer stays with your project, stocked and ready for as long as the job runs.' },
    { title: 'Grab-and-Go Access', description: 'Crews pull what they need without waiting on a delivery or a trip to the shop.' },
    { title: 'Built for Buildouts & Offset Fracs', description: 'Stocked to match the pace of active buildouts and offset frac operations.' },
    { title: 'Backed by the Odessa Shop', description: 'Restocked and supported out of our Odessa, TX shop.' },
  ],
  whoProfiles: [], sessionSteps: [],
  protocolBannerTitlePrefix: 'Want a trailer staged for your next project', protocolBannerTitleSuffix: '?',
};

const TECH_SUPPORT_CONTENT = {
  heroSectionLabel: 'TECHNICAL SUPPORT & PLANNING',
  heroDescription: 'Trinity can help design the complete rod-pump system, from rod-pump design through BHA design — and help plan and advise on full facility and project buildouts.',
  specDurationValue: 'Design Through BHA',
  specIntensityValue: 'Facility & Project Planning',
  specFocusValue: 'Odessa, TX Shop',
  statsItem1Val: '100+', statsItem1Label: 'Years Combined Experience',
  statsItem2Val: 'Rod Pump', statsItem2Label: 'to BHA System Design',
  statsItem3Val: 'Full', statsItem3Label: 'Facility & Project Buildouts',
  statsItem4Val: 'TX & NM', statsItem4Label: 'Delivery Coverage',
  overviewSectionLabel: 'DESIGN, PLANNING & ADVISORY',
  overviewTitle1: 'From Rod-Pump Design', overviewTitle2: 'to Full Buildouts.',
  overviewDescription: 'Trinity can help design the complete rod-pump system, from rod-pump design through BHA design. We can also help plan and advise on full facility and project buildouts, so your project starts with the right equipment and the right plan.',
  benefits: [
    { title: 'Rod-Pump System Design', description: 'Design support for the complete rod-pump system, matched to your well conditions.' },
    { title: 'BHA Design', description: 'Bottom-hole assembly design that works together with your rod-pump system, not around it.' },
    { title: 'Facility & Project Planning', description: 'Planning and advisory support for full facility and project buildouts, from concept to execution.' },
    { title: 'Odessa, TX Shop & Support', description: 'Backed by our Odessa shop team and delivery across Texas and New Mexico.' },
  ],
  whoProfiles: [], sessionSteps: [],
  protocolBannerTitlePrefix: 'Ready to plan your next system or buildout', protocolBannerTitleSuffix: '?',
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const siteContents = db.collection('site_contents');
  const pages = db.collection('pages');

  const doc = await siteContents.findOne({ key: 'complete_data' });
  const data = doc.data;

  // ── 1 & 2. Poly page content ────────────────────────────────
  await pages.updateOne({ slug: 'poly' }, { $set: Object.fromEntries(Object.entries(POLY_CONTENT).map(([k, v]) => [`content.${k}`, v])) });
  console.log('✓ Poly page content written');

  await pages.updateOne({ slug: 'pipe-valves-fittings' }, { $set: Object.fromEntries(Object.entries(PVF_CONTENT).map(([k, v]) => [`content.${k}`, v])) });
  console.log('✓ Pipe, Valves & Fittings page content written');

  // ── 3 & 4. Remove Complete Facility Buildouts & General Oilfield Supply ──
  const services = (data.services && data.services.services) || [];
  let removedCount = 0;
  const updatedServices = services.map((s) => {
    if (s.slug === 'complete-facility-buildouts' || s.slug === 'general-oilfield-supply') {
      removedCount++;
      return { ...s, status: 'draft' };
    }
    return s;
  });
  await siteContents.updateOne({ key: 'complete_data' }, { $set: { 'data.services.services': updatedServices } });
  await pages.updateMany(
    { slug: { $in: ['complete-facility-buildouts', 'general-oilfield-supply'] } },
    { $set: { status: 'draft' } }
  );
  console.log(`✓ Removed ${removedCount} catalogue entries (Complete Facility Buildouts, General Oilfield Supply) — set to draft, both catalogue + page doc`);

  // ── 5. Reviews page removed for now ─────────────────────────
  await pages.updateOne({ slug: 'reviews' }, { $set: { status: 'draft' } });
  const navLinks = (data.navbar && data.navbar.companyLinks) || [];
  const updatedNavLinks = navLinks.filter((l) => l.label !== 'Reviews');
  await siteContents.updateOne({ key: 'complete_data' }, { $set: { 'data.navbar.companyLinks': updatedNavLinks } });
  console.log(`✓ Reviews page unpublished (draft) and nav link removed (${navLinks.length} -> ${updatedNavLinks.length})`);

  // ── 6. Trailer Support reworded ─────────────────────────────
  await pages.updateOne({ slug: 'trailer-support-on-site-operations' }, { $set: Object.fromEntries(Object.entries(TRAILER_CONTENT).map(([k, v]) => [`content.${k}`, v])) });
  console.log('✓ Trailer Support page content written');

  // ── 7. Technical Support & Planning real content ────────────
  await pages.updateOne({ slug: 'technical-support-planning' }, { $set: Object.fromEntries(Object.entries(TECH_SUPPORT_CONTENT).map(([k, v]) => [`content.${k}`, v])) });
  console.log('✓ Technical Support & Planning page content written');

  // ── 8. Leadership: remove "Team of 5", Lyndon 30+, 150+ combined ──
  const leadershipStats = (data.leadership && data.leadership.stats) || [];
  const updatedLeadershipStats = leadershipStats.map((s) =>
    s.label === 'Years Combined Experience' ? { ...s, value: '150+' } : s
  );
  await siteContents.updateOne({ key: 'complete_data' }, { $set: { 'data.leadership.stats': updatedLeadershipStats } });

  const teamStatsItems = (data.team && data.team.stats && data.team.stats.items) || [];
  const updatedTeamStats = teamStatsItems.map((s) => {
    if (s.label === 'Team Members') return { value: '6', label: 'Product Lines', icon: 'Package' };
    if (s.label === 'Years Combined Experience') return { ...s, value: '150+' };
    return s;
  });
  await siteContents.updateOne({ key: 'complete_data' }, { $set: { 'data.team.stats.items': updatedTeamStats } });

  const teamMembers = (data.team && data.team.members) || [];
  const updatedTeamMembers = teamMembers.map((m) => {
    if (m.id !== 'lyndon-kauk') return m;
    return {
      ...m,
      badge1: '30+ Years Oil & Gas Experience',
      description: (m.description || []).map((p) =>
        typeof p === 'string' ? p.replace(/more than 20 years/gi, 'more than 30 years') : p
      ),
    };
  });
  await siteContents.updateOne({ key: 'complete_data' }, { $set: { 'data.team.members': updatedTeamMembers } });
  console.log('✓ Leadership/Team stats updated (150+ combined experience, "Team of 5" replaced with "6 Product Lines", Lyndon -> 30+ years)');

  // ── 9. Artificial Lift page: Josh as main contact ───────────
  await pages.updateOne({ slug: 'artificial-lift' }, { $set: { 'content.contactPerson': JOSH, 'content.contactPersonLabel': 'YOUR CONTACT' } });
  console.log('✓ Artificial Lift page contact set to Josh');

  // ── 10. Projects & Supplies contact: Sim ────────────────────
  await siteContents.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.categoryContacts': { 'projects-supplies': { ...SIM, label: 'CONTACT FOR PROJECTS & SUPPLIES' } } } }
  );
  console.log('✓ Projects & Supplies contact set to Sim on /services/');

  // ── verification readback ───────────────────────────────────
  console.log('\n--- Verification ---');
  const after = await siteContents.findOne({ key: 'complete_data' }, { projection: {
    'data.leadership.stats': 1, 'data.team.stats': 1, 'data.services.categoryContacts': 1, 'data.navbar.companyLinks': 1
  }});
  console.log(JSON.stringify(after.data, null, 2));

  const lyndon = (await siteContents.findOne({ key: 'complete_data' }, { projection: { 'data.team.members': 1 } })).data.team.members.find((m) => m.id === 'lyndon-kauk');
  console.log('Lyndon badge1:', lyndon.badge1);

  const draftPages = await pages.find({ slug: { $in: ['complete-facility-buildouts', 'general-oilfield-supply', 'reviews'] } }, { projection: { slug: 1, status: 1 } }).toArray();
  console.log('Unpublished pages:', draftPages);

  await client.close();
}

main().catch((err) => { console.error(err); process.exit(1); });
