import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });
import connectToDatabase from '../src/lib/mongodb';
import SiteContent from '../src/models/Content';

const homepageData = {
  hero: {
    label: "Performance Recovery Specialist • Est. 2020",
    title1: "Recover Faster.",
    title2: "Perform Higher.",
    description: "Specialized performance bodywork, mobility restoration, and injury prevention designed for athletes and active adults since 2020.",
    ctaBook: "BOOK RECOVERY SESSION",
    ctaServices: "EXPLORE SERVICES",
    socialProofText: "Trusted by 500+ athletes & active adults",
    image: "/images/hero-bg.webp",
    imageAlt: "Expert muscle therapy session",
  },
  stats: {
    label: "Our Achievements",
    titleLine1: "Proven Results.",
    titleLine2: "Professional",
    titleItalicWord: "Standards.",
    description: "At Trinity Pump & Supply, we believe that true recovery is built on specialized bodywork and precision movement science.",
    image: "/images/blog-3.webp",
    imageAlt: "Clinical sports massage session",
    items: [
      { value: "8+", label: "Years of Experience" },
      { value: "5,000+", label: "Clients Treated" },
      { value: "15,000+", label: "Sessions Completed" },
      { value: "100%", label: "Satisfaction Rate" },
    ],
  },
  services: {
    label: "Our Services",
    titleLine1: "Therapies",
    titleLine2: "Designed",
    titleLine3: "Around",
    titleItalicWord: "You",
    description: "Experience specialized therapeutic bodywork engineered around your performance and athletic recovery goals.",
    ctaAll: "VIEW ALL SERVICES",
    ctaLearnMore: "LEARN MORE",
    services: [],
    items: [],
  },
  leadership: {
    label: "ABOUT US",
    title: "Your Trusted Partner in Oil & Pump Supply",
    tagline: "Quality Solutions for a Reliable Tomorrow",
    desc1: "<p>We are a leading supplier of high-quality oil products, industrial pumps and related equipment, serving diverse industries across the region. With a commitment to quality, reliability and customer satisfaction, we ensure your operations never stop.</p>",
    desc2: "",
    photoBadge: "Quality Solutions for a Reliable Tomorrow",
    photoBadgeTitle: "Quality Solutions",
    photoBadgeSubtitle: "for a Reliable Tomorrow",
    image: "/images/about-us.jpg",
    imageAlt: "Oil & Pump Supply Facility",
    ctaMore: "Learn More About Us",
    ctaLink: "/about",
    stats: [
      { value: "20+", label: "Years Experience" },
      { value: "100+", label: "Trusted Brands" },
      { value: "500+", label: "Happy Clients" },
      { value: "24/7", label: "Support" },
    ],
  },
  process: {
    label: "OUR PROCESS",
    title: "How We Work",
    description: "A simple and transparent process to get you the right solutions, exactly when you need them.",
    items: [
      { title: "Request a Quote", description: "Share your requirements with our team.", icon: "FileText" },
      { title: "Consultation", description: "We analyze your needs and suggest the best solution.", icon: "MessageSquare" },
    ],
  },
  testimonials: {
    label: "TESTIMONIALS",
    title: "What Our Clients Say",
    testimonials: [],
    items: [],
  },
  ctaBanner: {
    tagline: "Take the First Step",
    title: "Ready to Feel Your Best?",
    description: "Book your appointment today and start your journey to a pain-free, stronger you.",
    button: "BOOK APPOINTMENT",
    buttonUrl: "",
  },
  quote: {
    section: { badge: "GET IN TOUCH", headline: "Have Questions? Let's Connect." },
    formClinicPortal: "INSTANT ONLINE BOOKING",
    formClinicPortalSub: "Book directly on StyleSeat portal",
    formStyleSeatBtn: "BOOK ON STYLESEAT",
    formBtnSubmit: "SEND MESSAGE",
    formSuccessToast: "Thank you! Your inquiry has been sent. We will reply within 24 hours.",
    trustHipa: "HIPAA Compliant & Secure",
    trustResponse: "Avg Response: 2 Hours",
    services: [
      { label: "Corrective Movement Therapy", value: "corrective-movement" },
      { label: "Maryland Sports Massage", value: "sports-massage" },
      { label: "Fascial Stretch Therapy", value: "stretch-therapy" },
      { label: "Deep Tissue Massage", value: "deep-tissue" },
    ],
  },
  faq: {
    section: { badge: "FAQ", headline: "Frequently Asked Questions" },
    items: [],
  },
  blogSection: {
    subtitle: "FROM THE BLOG",
    title: "Insights & Recovery Tips",
    ctaAll: "View All Articles",
    ctaReadMore: "Read Article",
    description: "Explore the latest clinical insights, recovery methods, and athletic performance tips from our certified specialists.",
    selectedPosts: [],
  },
  industries: {
    badge: "INDUSTRIES WE SERVE",
    title: "Trusted Across Multiple Industries",
    description: "We support a wide range of industries with reliable equipment and pumping solutions, helping businesses achieve greater efficiency and productivity.",
    ctaLabel: "View All Industries",
    ctaLink: "/industries",
    cards: [
      { image: "", title: "Oil & Gas", subtitle: "Exploration & Production", cta: "Learn More", ctaLink: "#" },
      { image: "", title: "Petrochemical", subtitle: "Refining & Chemicals", cta: "Learn More", ctaLink: "#" },
      { image: "", title: "Water & Wastewater", subtitle: "Treatment & Management", cta: "Learn More", ctaLink: "#" },
      { image: "", title: "Mining & Resources", subtitle: "Extraction & Processing", cta: "Learn More", ctaLink: "#" },
      { image: "", title: "Industrial Manufacturing", subtitle: "General Manufacturing", cta: "Learn More", ctaLink: "#" },
    ],
  },
};

(async () => {
  try {
    await connectToDatabase();
    const result = await SiteContent.updateOne(
      { key: "complete_data" },
      { $set: { data: homepageData, lastUpdated: new Date() } },
      { upsert: true }
    );
    console.log("Seeding complete. Result:", result);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
})();
