"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { Icon } from "../../config/icons";
import { stripHtml } from "../../lib/utils";

const StatsBar = dynamic(() => import("@/components/StatsBar"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const CtaBanner = dynamic(() => import("@/components/CtaBanner"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });

const DEFAULT_VALUES = [
  {
    icon: "ShieldCheck",
    title: "Built to Last",
    description: "USA-made parts and materials in every pump, TAC and rotator that leaves our shop — not a cost-cut import substitute.",
  },
  {
    icon: "Clock",
    title: "Fast Turnaround",
    description: "In-stock inventory and a hands-on Odessa shop mean your workover doesn't sit waiting on us.",
  },
  {
    icon: "Users",
    title: "Family-Run, Field-Tested",
    description: "150+ years of combined experience, and a team that still picks up the phone when your pumper calls.",
  },
  {
    icon: "MapPin",
    title: "Local to the Basin",
    description: "Based in Odessa, delivering across Texas and New Mexico — we know these wells because we work them.",
  },
];

const DEFAULT_STATS = [
  { value: "150+", label: "Years Combined Experience", icon: "Award" },
  { value: "1", label: "Odessa, TX Shop", icon: "MapPin" },
  { value: "TX & NM", label: "States Served", icon: "Truck" },
  { value: "24/7", label: "On-Call Support", icon: "Headphones" },
];

const DEFAULT_WHY_CHOOSE_US = {
  badge: "WHY CHOOSE US",
  title: "What Sets Trinity Apart",
  description: "It's not just about what you pay, but how many times you pay it — here's how we keep your lease running without the repeat costs.",
  image: "/images/trinity/about-2.jpg",
  imageAlt: "Trinity Pump & Supply facility at night",
  features: [
    { icon: "ShieldCheck", title: "USA-Built Materials", description: "Alloy steel, 316 Stainless and Monel parts built to outlast cheaper imports." },
    { icon: "Truck", title: "Odessa Shop, Fast Turnaround", description: "In-house build and repair means your equipment isn't waiting on a warehouse three states away." },
    { icon: "Award", title: "150+ Years Combined Experience", description: "Our team had already spent decades on this exact equipment before Trinity existed." },
    { icon: "Star", title: "Exclusive Iron Bear Supplier", description: "The only West Texas source for the Iron Bear HD Rod Rotator and HD Plunger." },
    { icon: "Package", title: "Tracked From Bench to Well", description: "Every pump we build or repair is logged with Rod Pump Tracker software." },
    { icon: "Headphones", title: "Direct Line to Real People", description: "Call and reach the shop, not a call center." },
  ],
};

const DEFAULT_CTA_BANNER = {
  label: "GET IN TOUCH",
  title: "Ready to Work With Trinity?",
  description: "Whether it's a quote, a quick question, or a walkthrough of our shop — reach out and we'll get you an answer fast.",
  button: "Contact Us",
  buttonUrl: "/contact-us/",
  phone: "830-279-3996",
};

const DEFAULT_FAQ = [
  {
    q: "Where is Trinity Pump & Supply located?",
    a: "We're based at 4608 Gist Ave, Odessa, TX 79764 — in the heart of the Permian Basin. Stop by the shop or call ahead to make sure the right person's around.",
  },
  {
    q: "How much experience does your team actually have?",
    a: "Combined, our team brings over 100 years of hands-on experience building, repairing and troubleshooting downhole rod pumps and artificial lift equipment.",
  },
  {
    q: "Do you only sell parts, or do you build and repair equipment too?",
    a: "Both. We build and repair rod pumps, TAC's and rotators in-house at our Odessa shop, and we supply the parts and equipment your lease needs — one call covers it.",
  },
  {
    q: "Is Trinity really the only supplier of the Iron Bear HD Rod Rotator in West Texas?",
    a: "Yes — we're the exclusive West Texas supplier of the Iron Bear HD Rod Rotator and HD Plunger, available new or remanufactured through our shop.",
  },
  {
    q: "What areas do you deliver to?",
    a: "We deliver across Texas and New Mexico, with same-day and next-day turnaround for most of the Permian Basin.",
  },
];

export default function AboutTemplate({ pageData }: { pageData?: any; params?: any }) {
  const { globalMetadata, aboutPage } = useContent();

  const hero = aboutPage?.hero || {};
  const heroLabel = stripHtml(hero.label || "WHO WE ARE");
  const heroTitle1 = hero.title1 || "Built in Odessa.";
  const heroTitle2 = hero.title2 || "Trusted Across the Basin.";
  const heroDescription = stripHtml(
    hero.description ||
      "Trinity Pump & Supply is a family-run oilfield equipment shop in Odessa, Texas — building, repairing and supplying downhole rod pumps and artificial lift equipment for operators across Texas and New Mexico."
  );
  const heroImage = hero.image || "/images/trinity/about.jpg";
  const heroImageAlt = hero.imageAlt || "Trinity Pump & Supply";
  const bookingUrl = globalMetadata?.bookingUrl || "/contact-us/";
  const heroCtaText = hero.ctaText || "Request a Quote";
  const heroCtaUrl = hero.ctaUrl || bookingUrl;
  const heroCtaSecondaryText = hero.ctaSecondaryText || "See Our Services";
  const heroCtaSecondaryUrl = hero.ctaSecondaryUrl || "/services/";

  const story = aboutPage?.story || {};
  const storyLabel = stripHtml(story.label || "OUR STORY");
  const storyTitle1 = story.title1 || "Decades in the Field,";
  const storyTitle2 = story.title2 || "One Shop You Can Call.";
  const storyParagraphs: string[] = Array.isArray(story.paragraphs) && story.paragraphs.length > 0
    ? story.paragraphs
    : [
        "Trinity Pump & Supply started the way most good oilfield shops do — with people who'd already spent decades turning wrenches on the equipment they now build and repair. Between our team, that's over 100 years of combined experience in downhole rod pumps and artificial lift.",
        "We're not a national chain reading specs off a screen. We're a local Odessa shop that builds and repairs sucker rod pumps, TAC's, and artificial lift equipment with USA-made materials, and we're the exclusive West Texas supplier of the Iron Bear HD Rod Rotator and HD Plunger.",
        "Every pump we build or repair is tracked from the bench to the well with Rod Pump Tracker software, so you always know what's downhole and what it's built to. That's the whole approach: real parts, real tracking, and a shop that answers the phone.",
      ];
  const storyImage = story.image || "/images/trinity/artificial-lift-supplies-warehouse.jpg";
  const storyImageAlt = story.imageAlt || "Artificial lift supplies staged in the Trinity Pump & Supply shop";
  const storyBadgeTitle = story.badgeTitle || "Built & Tracked In-House";
  const storyBadgeSubtitle = story.badgeSubtitle || "Odessa, TX Shop";
  const storyHighlights: string[] = Array.isArray(story.highlights) && story.highlights.length > 0
    ? story.highlights
    : [
        "USA-made materials in every rod pump we build or repair",
        "Exclusive West Texas supplier of the Iron Bear HD Rod Rotator & HD Plunger",
        "Every teardown tracked with Rod Pump Tracker software",
      ];

  const valuesData = aboutPage?.values || {};
  const valuesLabel = stripHtml(valuesData.label || "WHAT WE STAND ON");
  const valuesTitle1 = valuesData.title1 || "Four Things We";
  const valuesTitle2 = valuesData.title2 || "Never Cut Corners On.";
  const values = Array.isArray(valuesData.items) && valuesData.items.length > 0 ? valuesData.items : DEFAULT_VALUES;

  // Stats, Why Choose Us and the CTA banner get their own independent content
  // here (never the shared homepage useContent() data), so editing the About
  // page can never change what shows on the homepage or vice versa.
  const statsItems = Array.isArray(aboutPage?.stats?.items) && aboutPage.stats.items.length > 0 ? aboutPage.stats.items : DEFAULT_STATS;
  const whyChooseUsData = aboutPage?.whyChooseUs && Object.keys(aboutPage.whyChooseUs).length > 0 ? aboutPage.whyChooseUs : DEFAULT_WHY_CHOOSE_US;
  const ctaBannerData = aboutPage?.ctaBanner && Object.keys(aboutPage.ctaBanner).length > 0 ? aboutPage.ctaBanner : DEFAULT_CTA_BANNER;

  const faqData = aboutPage?.faq || {};
  const faqPageData = {
    ...pageData,
    content: {
      ...(pageData?.content || {}),
      faqBadge: faqData.badge || "FAQ",
      faqTitle: faqData.title || "About Trinity Pump & Supply",
      faqDescription: faqData.description || "Common questions about who we are and how we work — call our Odessa office for anything else.",
      faq: Array.isArray(faqData.items) && faqData.items.length > 0 ? faqData.items : DEFAULT_FAQ,
    },
  };

  return (
    <main className="w-full bg-off-white text-body overflow-hidden">
      {/* ════════════════════════════════════════════════════════
         1. HERO
         ════════════════════════════════════════════════════════ */}
      <section className="relative bg-dark min-h-[60vh] flex items-center pt-[130px] pb-14 border-b border-border-dark overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
        </div>

        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="site-container relative z-10 w-full text-left">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/60 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg"
            >
              <Link href="/" className="hover:text-gold transition-colors text-white/80">
                Home
              </Link>
              <span className="text-gold/50">/</span>
              <span className="text-gold font-medium">About Us</span>
            </nav>
          </div>

          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
              <p className="section-label text-gold">{heroLabel}</p>
            </div>

            <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[70px] text-white leading-[1.08] mb-6 tracking-tight">
              {heroTitle1}{' '}
              <span className="text-gold font-medium block sm:inline">{heroTitle2}</span>
            </h1>

            <p className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-9 font-light">
              {heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a href={heroCtaUrl} className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4">
                {heroCtaText} <ArrowRight size={14} className="ml-1" />
              </a>
              <Link href={heroCtaSecondaryUrl} className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4">
                {heroCtaSecondaryText} <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         2. STATS — reuses the homepage's component for visual
         consistency, but with the About page's own independent
         content (never the shared sitewide stats).
         ════════════════════════════════════════════════════════ */}
      <StatsBar overrideItems={statsItems} />

      {/* ════════════════════════════════════════════════════════
         3. OUR STORY
         ════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-white relative overflow-hidden border-b border-border-light/40">
        <div
          className="bg-radial-dots-gold absolute top-0 right-0 w-[480px] h-[480px] opacity-[0.14] pointer-events-none"
          style={{
            WebkitMaskImage: "radial-gradient(circle at top right, black, transparent 70%)",
            maskImage: "radial-gradient(circle at top right, black, transparent 70%)",
          }}
        />

        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 xl:col-span-5 relative">
              <div className="relative">
                <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-tr from-gold/25 via-gold/10 to-transparent -z-10 blur-[1px] transform -rotate-1 hidden sm:block" />
                <div className="relative rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.14)] bg-dark aspect-[4/3] sm:h-[450px] lg:h-[490px] w-full border border-slate-200/80">
                  <img src={storyImage} alt={storyImageAlt} className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(10, 15, 23, 0.92) 0%, rgba(10, 15, 23, 0.4) 35%, transparent 70%)" }}
                  />
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-dark/85 backdrop-blur-md border border-white/15 shadow-xl flex items-center gap-3.5 z-10">
                    <div className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gold-light via-gold to-gold-dark text-dark shadow-[0_4px_14px_rgba(200,154,69,0.35)]">
                      <Icon name="Wrench" className="text-dark" size={22} strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-bold text-[14px] sm:text-[15px] leading-snug truncate drop-shadow-sm">
                        {storyBadgeTitle}
                      </span>
                      <span className="text-white/75 text-[12px] font-normal leading-snug truncate">{storyBadgeSubtitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-left">
              <div className="flex items-center gap-3 mb-3.5">
                <span className="w-6 h-[2px] bg-gold flex-shrink-0" />
                <p className="section-label">{storyLabel}</p>
              </div>

              <h2 className="display-heading text-[30px] min-[400px]:text-[34px] sm:text-[40px] lg:text-[44px] text-dark leading-[1.14] tracking-tight mb-6">
                {storyTitle1} <span className="text-gold-dark font-medium">{storyTitle2}</span>
              </h2>

              <div className="space-y-4 mb-7">
                {storyParagraphs.map((p, i) => (
                  <p key={i} className="text-slate-600 text-[15px] sm:text-[16px] leading-[1.75] font-light max-w-2xl">
                    {p}
                  </p>
                ))}
              </div>

              <div className="space-y-2.5">
                {storyHighlights.map((pt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center bg-gold/15 text-gold-dark flex-shrink-0">
                      <CheckCircle2 size={14} className="text-gold-dark" strokeWidth={2.5} />
                    </div>
                    <span className="text-[14px] text-slate-700 font-medium">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         4. VALUES
         ════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-brand-bg-light border-b border-border-light relative">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-3.5">
              <span className="w-6 h-[1px] bg-gold-dark" />
              <p className="section-label text-gold-dark">{valuesLabel}</p>
              <span className="w-6 h-[1px] bg-gold-dark" />
            </div>
            <h2 className="font-display font-medium text-[34px] min-[400px]:text-[44px] md:text-[52px] text-dark leading-[1.08] tracking-tight">
              {valuesTitle1}{' '}
              <span className="text-gold-dark font-medium block sm:inline">{valuesTitle2}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value: any, idx: number) => (
              <div
                key={idx}
                className="relative p-7 rounded-2xl bg-white border border-border-light/80 hover:border-gold-dark/50 transition-all duration-300 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.35)] hover:-translate-y-0.5 group overflow-hidden text-left"
              >
                <span className="pointer-events-none absolute right-3 top-0 select-none text-[56px] leading-none font-black text-[rgba(7,27,28,0.035)] group-hover:text-[rgba(200,154,69,0.14)] transition-colors duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-[0_12px_24px_-8px_rgba(200,154,69,0.55)] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                  <Icon name={value.icon || "ShieldCheck"} size={22} strokeWidth={1.8} />
                </div>
                <h3 className="relative text-dark font-bold text-[17px] mb-2 group-hover:text-gold-dark transition-colors">
                  {stripHtml(value.title)}
                </h3>
                <p className="relative text-dark/60 text-[13.5px] font-light leading-relaxed">
                  {stripHtml(value.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         5. WHY CHOOSE US — reuses the homepage's component for visual
         consistency, but with the About page's own independent content.
         ════════════════════════════════════════════════════════ */}
      <WhyChooseUs overrideData={whyChooseUsData} />

      {/* ════════════════════════════════════════════════════════
         6. CTA — reuses the homepage's component for visual consistency,
         but with the About page's own independent content. Both CtaBanner
         and WhyChooseUs sit on a plain white background with their own
         generous padding — back to back with nothing between them (unlike
         the homepage, which has other sections in between), their padding
         simply stacks into one large blank gap. Pull CtaBanner up to
         tighten it without touching the shared component itself.
         ════════════════════════════════════════════════════════ */}
      <div className="-mt-10 md:-mt-16 relative">
        <CtaBanner overrideData={ctaBannerData} />
      </div>

      {/* ════════════════════════════════════════════════════════
         7. CONTACT FORM + FAQ — the contact form itself (name/email/phone
         fields, submit button, business phone/email/address) intentionally
         stays shared sitewide: it's the same physical lead form and the
         same real business info on every page, so a single source of truth
         is correct here, not a leak. Only the FAQ content (faqPageData,
         built above) is page-specific.
         ════════════════════════════════════════════════════════ */}
      <QAForm pageData={faqPageData} />
    </main>
  );
}
