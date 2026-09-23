"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Activity,
  Target
} from 'lucide-react';
import { useContent } from "../../hooks/useContent";
import ContactFaqSection from '../QAForm';
import SupplierLogos from './SupplierLogos';
import ServiceGallery from './ServiceGallery';
import ContactPersonCard from './ContactPersonCard';

/** Convert markdown links [Label](url) and HTML links to styled clickable anchors */
function formatRichText(content: string | undefined | null, isDark: boolean = false): string {
  if (!content) return "";
  let text = String(content);

  // If content has markdown links [Text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const linkClass = isDark
      ? "text-gold font-medium hover:text-white underline decoration-gold/60 hover:decoration-white transition-colors"
      : "text-gold-dark font-medium hover:text-dark underline decoration-gold-dark/60 hover:decoration-dark transition-colors";
    const target = url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}" class="${linkClass}"${target}>${label}</a>`;
  });

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  // If text doesn't contain HTML tags, preserve newlines as line breaks
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    text = text.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');
  }

  return text.trim();
}

/** Plain text helper for headings/badges */
function sh(html: string | undefined | null): string {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

export default function ServiceDetailTemplate({ pageData, params: syncParams }: { pageData?: any, params?: any }) {
  const { services: servicesData, globalMetadata, serviceDetailPage: globalServiceDetailPage } = useContent();

  const resolvedSlug = pageData?.slug || (syncParams?.slug ? (Array.isArray(syncParams.slug) ? syncParams.slug.join('/') : syncParams.slug) : null);
  const servicesList = (servicesData as any)?.services || [];
  const serviceFromHook = resolvedSlug ? (servicesList.find((s: any) => s.slug === resolvedSlug) || (servicesData as any)?.items?.find((s: any) => s.slug === resolvedSlug)) : null;

  const pageDataInner = {
    ...(pageData?.data || {}),
    ...(pageData?.content?.data || {}),
    ...(pageData || {})
  };

  // pageDataInner spreads pageData's own top-level keys (slug, title,
  // featuredImage, seo, ...) but pageData.content itself stays nested —
  // it never flattens onto pageDataInner. Every per-service field this
  // template reads (heroDescription, benefits, whoProfiles, sessionSteps,
  // supplierLogos, galleryImages, etc.) lives in pageData.content, so it
  // must be spread explicitly here or it silently falls back to the
  // hardcoded defaults below regardless of what's actually saved.
  const service = { ...(serviceFromHook || {}), ...(pageDataInner || {}), ...(pageData?.content || {}) };

  // pageData.content (spread above) also carries the *global* sitewide faq/faqs list
  // under these same key names, which always wins the spread and silently clobbers the
  // real per-service FAQ already resolved onto pageDataInner (by the [...slug] route,
  // from the catalogue item's own .faq) and serviceFromHook — restore whichever of those
  // actually has real data, so every service page shows its own FAQ instead of the same
  // sitewide fallback.
  const realFaq = [pageDataInner?.faq, serviceFromHook?.faq, pageDataInner?.faqs, serviceFromHook?.faqs]
    .find((f: any) => Array.isArray(f) && f.length > 0);
  if (realFaq) {
    service.faq = realFaq;
    service.faqs = realFaq;
  }

  if (!service || (!service.slug && !service.title && !service.id)) {
    return (
      <main className="bg-dark min-h-screen pt-[140px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }


  const pageContent = pageData?.content || {};
  const serviceDetailPage = pageContent.serviceDetailPage || globalServiceDetailPage || {};

  const defaultBookingUrl = "/contact-us/";
  const globalBooking = globalMetadata?.bookingUrl || defaultBookingUrl;

  // Hydrate configurations cleanly with zero duplicate texts
  const pg = {
    backLink: service.backLink || serviceDetailPage.backLink || "Back to All Services",
    heroSectionLabel: service.heroSectionLabel || serviceDetailPage.heroSectionLabel || "OILFIELD SERVICE OVERVIEW",

    // Single distinct Hero Description
    heroDescription: service.heroDescription || service.heroSubtitle || service.heroDescriptionSuffix || service.subheadline || service.description || serviceDetailPage.heroDescription || "USA-built equipment and dependable supply, ready to keep your lease producing.",

    // Specs Strip
    specDurationValue: service.specDurationValue || serviceDetailPage.specDurationValue || "USA-Made Parts",
    specIntensityValue: service.specIntensityValue || serviceDetailPage.specIntensityValue || "Odessa, TX Shop",
    specFocusValue: service.specFocusValue || serviceDetailPage.specFocusValue || "TX & NM Coverage",

    // CTAs & Links
    bookingCta: service.bookingCta || serviceDetailPage.bookingCta || "Get a Quote",
    bookingCtaUrl: service.bookingCtaUrl || globalBooking,
    heroCtaSecondary: service.heroCtaSecondary || serviceDetailPage.heroCtaSecondary || "SEE THE DETAILS",
    heroCtaSecondaryUrl: service.heroCtaSecondaryUrl || "#overview",

    // Stats Strip
    statsItem1Val: service.statsItem1Val || serviceDetailPage.statsItem1Val || "150+",
    statsItem1Label: service.statsItem1Label || serviceDetailPage.statsItem1Label || "Years Combined Experience",
    statsItem2Val: service.statsItem2Val || serviceDetailPage.statsItem2Val || "USA",
    statsItem2Label: service.statsItem2Label || serviceDetailPage.statsItem2Label || "Built Parts",
    statsItem3Val: service.statsItem3Val || serviceDetailPage.statsItem3Val || "TX & NM",
    statsItem3Label: service.statsItem3Label || serviceDetailPage.statsItem3Label || "Oilfield Coverage",
    statsItem4Val: service.statsItem4Val || serviceDetailPage.statsItem4Val || "24/7",
    statsItem4Label: service.statsItem4Label || serviceDetailPage.statsItem4Label || "Field Support",

    // Overview Section
    overviewSectionLabel: service.overviewSectionLabel || serviceDetailPage.overviewSectionLabel || "BUILT FOR RELIABLE WELL PERFORMANCE",
    overviewTitle1: service.overviewTitle1 || service.overviewTitlePrefix || serviceDetailPage.overviewTitle1 || "Quality Equipment.",
    overviewTitle2: service.overviewTitle2 || service.overviewTitleHighlight || serviceDetailPage.overviewTitle2 || "Built to Last.",
    overviewWatermark: service.overviewWatermark || serviceDetailPage.overviewWatermark || "TRINITY PUMP & SUPPLY",
    overviewSuccessRate: service.overviewSuccessRate || serviceDetailPage.overviewSuccessRate || "ODESSA, TX",
    tailoredLabel: service.tailoredLabel ?? serviceDetailPage.tailoredLabel ?? "USA-Made Materials",
    tailoredSub: service.tailoredSub ?? serviceDetailPage.tailoredSub ?? "Built for the Permian Basin",

    // Single distinct Overview Clinical Narrative
    overviewDescription: service.overviewDescription || service.overviewIntroSuffix || service.description || serviceDetailPage.overviewDescription || "We build and supply oilfield equipment using USA-made materials, matched to your well conditions to lower lifting costs and extend run life.",

    overviewCtaText: service.overviewCtaText || serviceDetailPage.overviewCtaText || "REQUEST A QUOTE",
    overviewCtaUrl: service.overviewCtaUrl || service.bookingCtaUrl || globalBooking,
    overviewHipaaText: service.overviewHipaaText || serviceDetailPage.overviewHipaaText || "USA-Built & Field-Tested",

    // Candidates / Why Choose Us Section
    candidateSectionLabel: service.candidateSectionLabel || serviceDetailPage.candidateSectionLabel || "WHY OPERATORS CHOOSE TRINITY",
    candidateTitle1: service.candidateTitle1 || serviceDetailPage.candidateTitle1 || "Reliable Supply.",
    candidateTitle2: service.candidateTitle2 || serviceDetailPage.candidateTitle2 || "Built Around Your Lease.",
    candidateDescription: service.candidateDescription || serviceDetailPage.candidateDescription || "Equipment and support sized to your well conditions, backed by a team that answers the phone and shows up on time.",
    profileBadgePrefix: service.profileBadgePrefix || serviceDetailPage.profileBadgePrefix || "ADVANTAGE",
    candidateSuitability: service.candidateSuitability ?? serviceDetailPage.candidateSuitability ?? "TRINITY STANDARD",
    whoProfiles: service.whoProfiles || serviceDetailPage.whoProfiles || [
      {
        label: "150+ Years Combined Experience",
        desc: "Decades of hands-on rod pump and oilfield supply experience guide every recommendation we make for your well.",
        suitability: "FIELD-TESTED"
      },
      {
        label: "USA-Built Parts",
        desc: "Alloy steel, 316 Stainless and Monel components built to hold up under demanding Permian Basin conditions.",
        suitability: "USA-MADE"
      },
      {
        label: "Lower Lifting Costs",
        desc: "Longer equipment runs mean fewer pulls and less downtime, keeping your lease producing and costs down.",
        suitability: "COST-FOCUSED"
      },
      {
        label: "Odessa, TX Shop",
        desc: "Based at 4608 Gist Ave, Odessa, TX, serving operators throughout Texas and New Mexico with dependable delivery.",
        suitability: "ODESSA, TX"
      }
    ],

    // Treatment Protocol / Stepper Section
    protocolSectionLabel: service.protocolSectionLabel || serviceDetailPage.protocolSectionLabel || "HOW WE WORK",
    protocolTitle1: service.protocolTitle1 || serviceDetailPage.protocolTitle1 || "From Well Evaluation",
    protocolTitle2: service.protocolTitle2 || serviceDetailPage.protocolTitle2 || "to Longer Pump Runs.",
    protocolDescription: service.protocolDescription || serviceDetailPage.protocolDescription || "A straightforward process focused on one goal: lowering your lifting costs and maximizing the longevity of your well.",
    protocolPhasePrefix: service.protocolPhasePrefix || serviceDetailPage.protocolPhasePrefix || "STEP 0",
    protocolDurations: service.protocolDurations || serviceDetailPage.protocolDurations || ["STEP 1", "STEP 2", "STEP 3", "STEP 4"],
    protocolBannerBadge: service.protocolBannerBadge || serviceDetailPage.protocolBannerBadge || "READY TO GET STARTED",
    protocolBannerTitle: service.protocolBannerTitle || serviceDetailPage.protocolBannerTitle,
    protocolBannerTitlePrefix: service.protocolBannerTitlePrefix || serviceDetailPage.protocolBannerTitlePrefix || "Ready to request a quote",
    protocolBannerTitleSuffix: service.protocolBannerTitleSuffix || serviceDetailPage.protocolBannerTitleSuffix || "?",
    protocolBannerDescription: service.protocolBannerDescription || serviceDetailPage.protocolBannerDescription,
    protocolBannerCta: service.protocolBannerCta || serviceDetailPage.protocolBannerCta || "CONTACT US",
    protocolBannerCtaUrl: service.protocolBannerCtaUrl || service.bookingCtaUrl || globalBooking,

    benefitsTitle: service.benefitsTitle || serviceDetailPage.benefitsTitle || "Key Benefits",
    benefitCardDesc: service.benefitCardDesc || serviceDetailPage.benefitCardDesc || "Built to lower costs and keep your well running longer between pulls.",

    // Optional supplier logo strip & photo gallery (both hidden when empty)
    supplierLogos: service.supplierLogos || serviceDetailPage.supplierLogos || [],
    supplierLogosLabel: service.supplierLogosLabel || serviceDetailPage.supplierLogosLabel || "Proud Suppliers Of",
    galleryImages: service.galleryImages || serviceDetailPage.galleryImages || [],

    // Optional page-specific point-of-contact — falls back to the shared
    // per-category contact (e.g. Josh for every Artificial Lift page, Sim for
    // every Projects & Supplies page) so every service in a category shows a
    // contact without having to set it individually on each one.
    contactPerson: service.contactPerson || serviceDetailPage.contactPerson || (servicesData as any)?.categoryContacts?.[service.category] || null,
    contactPersonLabel: service.contactPersonLabel || serviceDetailPage.contactPersonLabel || (servicesData as any)?.categoryContacts?.[service.category]?.label || "YOUR CONTACT",

    // Dynamic Step Sequence
    sessionSteps: service.sessionSteps || (service.process && service.process.length > 0 ? service.process.map((step: any, idx: number) => ({
      num: String(idx + 1).padStart(2, '0'),
      title: step.title,
      desc: step.description || step.desc || ""
    })) : null) || serviceDetailPage.sessionSteps || [
        {
          num: "01",
          title: "Well Evaluation",
          desc: "We evaluate your well and pumping conditions to recommend the right equipment for your duty cycle and fluid characteristics."
        },
        {
          num: "02",
          title: "Build or Repair",
          desc: "We build and repair equipment using USA-made alloy steel, 316 Stainless and Monel components."
        },
        {
          num: "03",
          title: "Timely Delivery",
          desc: "On-time delivery across Texas and New Mexico, with clear communication throughout so your lease stays on schedule."
        },
        {
          num: "04",
          title: "Inspection & Support",
          desc: "Ongoing inspection, repair and field support to keep your equipment running longer between pulls."
        }
      ]
  };

  const serviceName = sh(service.title || service.name || "Service");
  const titleWords = serviceName.split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastTitleWord = titleWords[titleWords.length - 1] || "";
  const serviceImage = service.image || service.featuredImage || "/images/trinity/hero.jpg";

  // Format benefits array
  const benefits = (service.benefits && service.benefits.length > 0) ? service.benefits : [
    {
      title: "USA-Made Materials",
      description: "Alloy steel, 316 Stainless and Monel components built for durability and corrosion resistance."
    },
    {
      title: "Matched to Your Well",
      description: "Equipment sized and configured to your specific well depth, fluid characteristics and duty cycle."
    },
    {
      title: "Lower Lifting Costs",
      description: "Longer equipment runs mean fewer pulls, less downtime, and lower overall cost per barrel."
    },
    {
      title: "Odessa, TX Shop & Support",
      description: "Local shop team and fast delivery across Texas and New Mexico keep your lease on schedule."
    }
  ];

  const statsList = [
    { value: sh(pg.statsItem1Val), label: sh(pg.statsItem1Label) },
    { value: sh(pg.statsItem2Val), label: sh(pg.statsItem2Label) },
    { value: sh(pg.statsItem3Val), label: sh(pg.statsItem3Label) },
    { value: sh(pg.statsItem4Val), label: sh(pg.statsItem4Label) }
  ];

  // Dynamic grid column calculation for Stepper
  const stepCount = pg.sessionSteps.length;
  const stepperGridClass = stepCount === 4
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    : stepCount === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-6"
      : stepCount === 2
        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <>
      <main className="w-full bg-off-white text-body overflow-hidden">
        {/* ════════════════════════════════════════════════════════
           1. HERO SECTION (Matching Site Hero Aesthetics)
           ════════════════════════════════════════════════════════ */}
        <section className="relative bg-dark min-h-[80vh] flex items-center pt-[130px] pb-20 border-b border-border-dark overflow-hidden">
          {/* Ambient Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <img
              src={serviceImage}
              alt={serviceName}
              className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
            />
            {/* Multi-directional luxury gradient masks */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
          </div>

          {/* Subtle Gold Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

          <div className="site-container relative z-10 w-full text-left">
            {/* Breadcrumbs & Navigation — backed by a translucent blurred chip so
               both stay legible over any hero photo, regardless of how bright
               or busy that specific image is (the raw dark gradient behind the
               hero fades to transparent toward the right edge, which left
               "Back to All Services" unreadable over lighter photos). */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/60 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg"
              >
                <Link href="/" className="hover:text-gold transition-colors text-white/80">
                  Home
                </Link>
                <span className="text-gold/50">/</span>
                <span className="text-gold font-medium truncate max-w-[200px] sm:max-w-none">
                  {serviceName}
                </span>
              </nav>

              <Link
                href="/services/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-[11px] font-bold tracking-[0.2em] uppercase transition-colors bg-dark/50 backdrop-blur-md border border-white/10 rounded-full pl-3.5 pr-4 py-2 shadow-lg hover:border-gold/40"
              >
                <ArrowLeft size={13} className="text-gold flex-shrink-0" />
                <span className="hidden sm:inline">{pg.backLink}</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>

            <div className="max-w-[680px]">
              {/* Gold Accent Line + Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
                <p className="section-label text-gold">
                  {pg.heroSectionLabel}
                </p>
              </div>

              {/* Headline with Playfair Display Italic Gold Accent */}
              <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[70px] text-white leading-[1.08] mb-6 tracking-tight">
                {mainTitle ? mainTitle : serviceName}{' '}
                {mainTitle && <span className="text-gold font-medium block sm:inline">{lastTitleWord}</span>}
              </h1>

              {/* Single Hero Description with Link Support */}
              <div
                className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-8 font-light"
                dangerouslySetInnerHTML={{ __html: formatRichText(pg.heroDescription, true) }}
              />

              {/* Quick Specs Pill Strip */}
              <div className="flex flex-wrap items-center gap-5 py-3.5 px-6 rounded-md bg-white/[0.05] border border-white/10 backdrop-blur-md mb-9 max-w-fit shadow-xl">
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <Clock size={16} className="text-gold flex-shrink-0" />
                  <span>{pg.specDurationValue}</span>
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <Activity size={16} className="text-gold flex-shrink-0" />
                  <span>{pg.specIntensityValue}</span>
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <Target size={16} className="text-gold flex-shrink-0" />
                  <span>{pg.specFocusValue}</span>
                </div>
              </div>

              {/* Dual CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href={pg.bookingCtaUrl}
                  target={pg.bookingCtaUrl.startsWith("http") ? "_blank" : undefined}
                  rel={pg.bookingCtaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4"
                >
                  {pg.bookingCta} <ArrowRight size={14} className="ml-1" />
                </a>
                <a
                  href={pg.heroCtaSecondaryUrl}
                  className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4"
                >
                  {pg.heroCtaSecondary} <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           2. HIGHLIGHT STATS STRIP (Dark Luxury Accent)
           ════════════════════════════════════════════════════════ */}
        <div className="bg-dark-2 border-b border-border-dark py-8 relative z-10">
          <div className="site-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {statsList.map((stat: any, idx: number) => (
                <div key={idx} className="relative p-5 md:p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-gold/40 shadow-xl hover:-translate-y-0.5 transition-all duration-300 group text-center overflow-hidden">
                  <span className="pointer-events-none absolute -right-2 -top-3 select-none text-[52px] leading-none font-black text-white/[0.03] group-hover:text-gold/[0.08] transition-colors duration-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="relative text-gold font-serif text-[26px] md:text-[32px] font-bold block leading-none mb-1.5 group-hover:scale-105 transition-transform">{stat.value}</span>
                  <span className="relative text-white/60 text-[10.5px] font-mono uppercase tracking-widest">{stat.label}</span>
                  <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
           3. CLINICAL OVERVIEW & TARGETED PATTERNS (Modern Magazine Editorial Layout)
           ════════════════════════════════════════════════════════ */}
        <section id="overview" className="py-24 md:py-32 bg-white border-b border-border-light relative overflow-hidden">
          {/* Subtle Ambient Light Texture */}
          <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-gold-dark/[0.03] rounded-full blur-[140px] pointer-events-none" />

          <div className="site-container relative z-10">
            {/* Magazine Header Statement */}
            <div className="max-w-3xl mb-16 md:mb-20 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-gold-dark" />
                <p className="section-label text-gold-dark">
                  {pg.overviewSectionLabel}
                </p>
              </div>

              <h2 className="font-display font-medium text-[36px] min-[400px]:text-[44px] md:text-[60px] text-dark leading-[1.06] tracking-tight">
                {pg.overviewTitle1}{' '}
                <span className="text-gold-dark font-medium block sm:inline">
                  {pg.overviewTitle2}
                </span>
              </h2>
            </div>

            {/* Asymmetric 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
              {/* Left Column: Offset Photography Frame with Floating Badge */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="relative w-full h-full min-h-[460px] rounded-lg overflow-hidden shadow-2xl border border-border-light p-2.5 bg-warm-white/80 group">
                  <div className="relative w-full h-full min-h-[440px] rounded-md overflow-hidden">
                    <img
                      src={serviceImage}
                      alt={serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />

                    {/* Top Watermark Tag */}
                    <div className="absolute top-5 left-5 bg-dark/85 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-white/20">
                      <span className="text-gold font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                        {pg.overviewWatermark}
                      </span>
                    </div>

                    {/* Floating Clinical Badge */}
                    <div className="absolute bottom-6 left-6 right-6 p-5 rounded-md bg-white/95 backdrop-blur-md border border-border-light shadow-2xl flex items-center justify-between text-dark">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-sm bg-gold-dark/15 border border-gold-dark/30 flex items-center justify-center text-gold-dark flex-shrink-0">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-dark text-[13.5px] font-bold">{pg.tailoredLabel}</p>
                          <p className="text-dark/50 text-[10.5px] font-mono uppercase tracking-wider">{pg.tailoredSub}</p>
                        </div>
                      </div>
                      <span className="text-gold-dark font-mono text-[11px] font-bold">{pg.overviewSuccessRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative + Targeted Patterns & Benefit Cards */}
              <div className="lg:col-span-7 flex flex-col justify-between text-left">
                <div>
                  {/* Overview Clinical Narrative */}
                  <div
                    className="text-dark/75 text-[16px] md:text-[17.5px] leading-[1.85] font-light mb-8"
                    dangerouslySetInnerHTML={{ __html: formatRichText(pg.overviewDescription, false) }}
                  />

                  {/* Feature & Pattern Cards */}
                  <div className="space-y-4 mb-10">
                    {benefits.map((benefit: any, idx: number) => {
                      const benefitTitle = typeof benefit === 'string' ? benefit : (benefit.title || "");
                      const benefitDesc = typeof benefit === 'string' ? pg.benefitCardDesc : (benefit.description || pg.benefitCardDesc);
                      return (
                        <div
                          key={idx}
                          className="p-6 rounded-2xl bg-white border border-border-light/80 hover:border-gold-dark/50 transition-all duration-300 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.35)] hover:-translate-y-0.5 flex items-start gap-5 group relative overflow-hidden"
                        >
                          <span className="pointer-events-none absolute right-4 top-1 select-none text-[56px] leading-none font-black text-[rgba(7,27,28,0.035)] group-hover:text-[rgba(200,154,69,0.14)] transition-colors duration-500">
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-[0_12px_24px_-8px_rgba(200,154,69,0.55)] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                            <span className="font-serif font-bold text-[16px]">{String(idx + 1).padStart(2, '0')}</span>
                          </div>
                          <div className="flex-1 relative">
                            <h3 className="text-dark font-bold text-[17px] mb-1.5 group-hover:text-gold-dark transition-colors">
                              {sh(benefitTitle)}
                            </h3>
                            <div
                              className="text-dark/60 text-[13.5px] font-light leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: formatRichText(benefitDesc, false) }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Optional Photo Gallery */}
                  <ServiceGallery images={pg.galleryImages} />

                  {/* Optional Supplier Logo Strip */}
                  <SupplierLogos logos={pg.supplierLogos} label={pg.supplierLogosLabel} />

                  {/* Optional Page-Specific Contact */}
                  {pg.contactPerson && (
                    <div className="mb-10">
                      <ContactPersonCard person={pg.contactPerson} label={pg.contactPersonLabel} />
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 border-t border-border-light flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={pg.overviewCtaUrl}
                    target={pg.overviewCtaUrl.startsWith("http") ? "_blank" : undefined}
                    rel={pg.overviewCtaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="btn-gold px-9 py-4 text-[13px] font-bold tracking-wider rounded-md shadow-lg"
                  >
                    {pg.overviewCtaText} <ArrowRight size={14} className="ml-1" />
                  </a>

                  <div className="flex items-center gap-2 text-dark/50 text-[12px] font-mono">
                    <CheckCircle2 size={15} className="text-gold-dark" />
                    <span>{pg.overviewHipaaText}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           4. WHY US & TARGET CANDIDATES (Editorial Grid)
           Hidden entirely when no whoProfiles are supplied — short pages
           skip this section rather than showing the generic fallback.
           ════════════════════════════════════════════════════════ */}
        {pg.whoProfiles.length > 0 && (
        <section className="py-20 md:py-28 bg-brand-bg-light border-b border-border-light relative">
          <div className="site-container">
            {/* Centered Editorial Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-3.5">
                <span className="w-6 h-[1px] bg-gold-dark" />
                <p className="section-label text-gold-dark">
                  {pg.candidateSectionLabel}
                </p>
                <span className="w-6 h-[1px] bg-gold-dark" />
              </div>
              <h2 className="font-display font-medium text-[34px] min-[400px]:text-[44px] md:text-[52px] text-dark leading-[1.08] tracking-tight mb-4">
                {pg.candidateTitle1}{' '}
                <span className="text-gold-dark font-medium block sm:inline">
                  {pg.candidateTitle2}
                </span>
              </h2>
              {pg.candidateDescription && (
                <div
                  className="text-dark/70 text-[15px] md:text-[16.5px] font-light leading-relaxed max-w-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: formatRichText(pg.candidateDescription, false) }}
                />
              )}
            </div>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {pg.whoProfiles.map((profile: any, idx: number) => (
                <div
                  key={idx}
                  className="candidate-card-clean p-8 rounded-2xl bg-white transition-all duration-300 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.35)] hover:-translate-y-0.5 flex flex-col justify-between group relative overflow-hidden"
                >
                  <span className="pointer-events-none absolute right-5 top-2 select-none text-[64px] leading-none font-black text-[rgba(7,27,28,0.035)] group-hover:text-[rgba(200,154,69,0.14)] transition-colors duration-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center justify-between mb-6 border-b border-border-light/70 pb-4 relative z-10">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-[0_12px_24px_-8px_rgba(200,154,69,0.55)] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                        <span className="font-serif font-bold text-[15px]">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-gold-dark/10 text-gold-dark text-[10.5px] font-mono font-bold tracking-widest uppercase">
                        {pg.profileBadgePrefix} {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-dark font-bold text-[19px] mb-2.5 leading-snug group-hover:text-gold-dark transition-colors relative z-10">
                      {sh(profile.label)}
                    </h3>

                    <div
                      className="text-dark/65 text-[14px] font-light leading-relaxed relative z-10"
                      dangerouslySetInnerHTML={{ __html: formatRichText(profile.desc, false) }}
                    />
                  </div>

                  <div className="mt-8 pt-4 border-t border-border-light/80 flex items-center justify-between text-gold-dark text-[11.5px] font-mono font-bold tracking-wider uppercase relative z-10">
                    <span>{profile.suitability || profile.status || pg.candidateSuitability}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ════════════════════════════════════════════════════════
           5. SESSION PROTOCOL (Dark Luxury Connected Stepper Stage)
           The header + step grid are hidden when no sessionSteps are
           supplied, but the Request-a-Quote banner below always shows.
           ════════════════════════════════════════════════════════ */}
        <section className={`${pg.sessionSteps.length > 0 ? 'py-24 md:py-32' : 'py-14 md:py-20'} bg-dark text-white relative border-b border-white/10 overflow-hidden`}>
          {/* Ambient Gold Glow Orbs */}
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[160px] pointer-events-none" />

          <div className="site-container relative z-10">
            {pg.sessionSteps.length > 0 && (
            <div className="max-w-3xl mb-16 md:mb-20 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-gold" />
                <p className="text-gold font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
                  {pg.protocolSectionLabel}
                </p>
              </div>
              <h2 className="font-display font-medium text-[36px] min-[400px]:text-[46px] md:text-[54px] text-white leading-[1.06] tracking-tight mb-4">
                {pg.protocolTitle1} <br />
                <span className="text-gold font-medium">{pg.protocolTitle2}</span>
              </h2>
              {pg.protocolDescription && (
                <div
                  className="text-white/70 text-[15px] md:text-[16px] font-light leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: formatRichText(pg.protocolDescription, true) }}
                />
              )}
            </div>
            )}

            {/* Dynamic Step Connected Cards */}
            {pg.sessionSteps.length > 0 && (
            <div className={stepperGridClass}>
              {pg.sessionSteps.map((step: any, idx: number) => (
                <div
                  key={step.num || idx}
                  className="stepper-card-dark p-8 md:p-9 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] transition-all duration-300 shadow-2xl flex flex-col justify-between group relative overflow-hidden backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="stepper-step-num w-12 h-12 rounded-lg bg-gold/15 flex items-center justify-center text-gold font-mono font-bold text-[15px] transition-all">
                        {step.num || `0${idx + 1}`}
                      </div>
                      <span className="stepper-step-time px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-mono font-bold tracking-widest uppercase">
                        {pg.protocolDurations[idx] || '15 MIN'}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-[19px] mb-3 leading-snug group-hover:text-gold transition-colors">
                      {sh(step.title)}
                    </h3>

                    <div
                      className="text-white/65 text-[14px] font-light leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatRichText(step.desc, true) }}
                    />
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-gold text-[12px] font-bold tracking-wider uppercase">
                    <span>{((pg.protocolPhasePrefix || "STEP").trim().replace(/0+$/, "").trim())} {String(idx + 1).padStart(2, '0')}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Bottom Action Conversion Banner — always visible, per the site-wide
               "Request a Quote CTA everywhere" rule, regardless of sessionSteps. */}
            <div className={`stepper-banner-cta ${pg.sessionSteps.length > 0 ? 'mt-16' : ''} p-8 md:p-10 rounded-2xl bg-gradient-to-r from-gold/20 via-dark to-dark flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-left border border-white/10`}>
              <div className="max-w-xl">
                {pg.protocolBannerBadge && (
                  <span className="text-gold font-mono text-[10.5px] font-bold tracking-widest uppercase block mb-1">
                    {pg.protocolBannerBadge}
                  </span>
                )}
                <h3 className="font-display font-medium text-[22px] md:text-[28px] text-white leading-snug">
                  {pg.protocolBannerTitle ? (
                    pg.protocolBannerTitle
                  ) : (
                    <>
                      {pg.protocolBannerTitlePrefix}  {pg.protocolBannerTitleSuffix}
                    </>
                  )}
                </h3>
                {pg.protocolBannerDescription && (
                  <div
                    className="text-white/70 text-[14px] font-light mt-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatRichText(pg.protocolBannerDescription, true) }}
                  />
                )}
              </div>
              <a
                href={pg.protocolBannerCtaUrl}
                target={pg.protocolBannerCtaUrl.startsWith("http") ? "_blank" : undefined}
                rel={pg.protocolBannerCtaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="btn-gold px-9 py-4 text-[13px] font-bold tracking-wider flex-shrink-0 rounded-md shadow-[0_10px_30px_rgba(200,150,12,0.25)] flex items-center gap-2"
              >
                <span>{pg.protocolBannerCta}</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════════════
         6. BUILT-IN CONTACT & FAQ SECTION
         ════════════════════════════════════════════════════════ */}
      <ContactFaqSection pageData={service} />
    </>
  );
}
