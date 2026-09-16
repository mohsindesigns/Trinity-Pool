"use client";

import Link from 'next/link';
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Icon } from '../../config/icons';
import ContactFaqSection from '../QAForm';

/** Convert markdown links [Label](url) and decode HTML entities — same helper as ServiceDetailTemplate. */
function formatRichText(content: string | undefined | null): string {
  if (!content) return "";
  let text = String(content);
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const target = url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}" class="text-gold font-medium hover:text-white underline decoration-gold/60 hover:decoration-white transition-colors"${target}>${label}</a>`;
  });
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    text = text.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');
  }
  return text.trim();
}

export default function ArtificialLiftTemplate({ pageData }: { pageData?: any; params?: any }) {
  const content = pageData?.content || {};

  const pg = {
    heroSectionLabel: content.heroSectionLabel || "ARTIFICIAL LIFT",
    heroTitle1: content.heroTitle1 || "Artificial Lift,",
    heroTitle2: content.heroTitle2 || "Built for the Permian Basin.",
    heroDescription: content.heroDescription || "USA-made components, decades of combined experience, and a shop in Odessa built to keep your wells producing and your lifting costs down.",
    heroCtaText: content.heroCtaText || "Get a Quote",
    heroCtaUrl: content.heroCtaUrl || "/contact-us/",
    heroCtaSecondary: content.heroCtaSecondary || "SEE OUR PRODUCTS",
    heroCtaSecondaryUrl: content.heroCtaSecondaryUrl || "#lineup",
    image: content.image || "/images/trinity/hero.jpg",
    imageAlt: content.imageAlt || "Pump jack on a Permian Basin lease",

    statsItem1Val: content.statsItem1Val || "100+",
    statsItem1Label: content.statsItem1Label || "Years Combined Experience",
    statsItem2Val: content.statsItem2Val || "USA",
    statsItem2Label: content.statsItem2Label || "Built Components",
    statsItem3Val: content.statsItem3Val || "TX & NM",
    statsItem3Label: content.statsItem3Label || "Oilfield Coverage",
    statsItem4Val: content.statsItem4Val || "Odessa",
    statsItem4Label: content.statsItem4Label || "Shop & Support",

    whyLabel: content.whyLabel || "WHY TRINITY",
    whyTitle1: content.whyTitle1 || "One Shop.",
    whyTitle2: content.whyTitle2 || "Every Artificial Lift Need.",
    whyDescription: content.whyDescription || "From the pump itself to the accessories that keep it running, Trinity builds, sources and supports the equipment your lease depends on.",
    whyFeatures: Array.isArray(content.whyFeatures) && content.whyFeatures.length > 0 ? content.whyFeatures : [
      { icon: 'ShieldCheck', title: 'USA-Made Components', description: 'Alloy steel, 316 Stainless and Monel parts built for durability and corrosion resistance.' },
      { icon: 'Settings', title: 'Built &amp; Repaired In-House', description: 'Our Odessa shop builds, repairs and reconditions rod pumps and TACs on-site.' },
      { icon: 'TrendingDown', title: 'Lower Lifting Costs', description: 'Longer equipment runs mean fewer pulls, less downtime, and lower cost per barrel.' },
      { icon: 'Truck', title: 'Fast Delivery', description: 'In-stock inventory and dependable delivery across Texas and New Mexico.' },
      { icon: 'ClipboardCheck', title: 'Tracked &amp; Certified', description: 'Rod Pump Tracker software and API-certified materials on every build.' },
      { icon: 'Phone', title: 'One-Call Support', description: 'A team that answers the phone and shows up when your lease needs it.' },
    ],

    subPagesLabel: content.subPagesLabel || "OUR LINEUP",
    subPagesTitle1: content.subPagesTitle1 || "Artificial Lift",
    subPagesTitle2: content.subPagesTitle2 || "Products & Services.",
    subPagesCta: content.subPagesCta || "View Details",
    subPages: Array.isArray(content.subPages) ? content.subPages : [],

    faqBadge: content.faqBadge,
    faqTitle: content.faqTitle,
    faqDescription: content.faqDescription,
    faqs: Array.isArray(content.faqs) ? content.faqs : [],
  };

  const isRawImage = pg.image.startsWith('http') || pg.image.startsWith('/uploads') || pg.image.startsWith('/cdn-images');
  const stats = [
    { value: pg.statsItem1Val, label: pg.statsItem1Label },
    { value: pg.statsItem2Val, label: pg.statsItem2Label },
    { value: pg.statsItem3Val, label: pg.statsItem3Label },
    { value: pg.statsItem4Val, label: pg.statsItem4Label },
  ];

  return (
    <>
      <main className="w-full bg-off-white text-body overflow-hidden">
        {/* ════════════════════════════════════════════════════════
           1. HERO
           ════════════════════════════════════════════════════════ */}
        <section className="relative bg-dark min-h-[80vh] flex items-center pt-[130px] pb-20 border-b border-border-dark overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <img
              src={pg.image}
              alt={pg.imageAlt}
              className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
          </div>

          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

          <div className="site-container relative z-10 w-full text-left">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/50">
                <Link href="/" className="hover:text-gold transition-colors text-white/70">Home</Link>
                <span className="text-gold/50">/</span>
                <span className="text-gold font-medium">Artificial Lift</span>
              </nav>
              <Link
                href="/services/"
                className="hidden sm:inline-flex items-center gap-2 text-white/60 hover:text-gold text-[11px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                <ArrowLeft size={13} className="text-gold" />
                Back to All Services
              </Link>
            </div>

            <div className="max-w-[680px]">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
                <p className="section-label text-gold">{pg.heroSectionLabel}</p>
              </div>

              <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[70px] text-white leading-[1.08] mb-6 tracking-tight">
                {pg.heroTitle1}{' '}
                <span className="text-gold italic font-light block sm:inline">{pg.heroTitle2}</span>
              </h1>

              <div
                className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-9 font-light"
                dangerouslySetInnerHTML={{ __html: formatRichText(pg.heroDescription) }}
              />

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a href={pg.heroCtaUrl} className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4">
                  {pg.heroCtaText} <ArrowRight size={14} className="ml-1" />
                </a>
                <a href={pg.heroCtaSecondaryUrl} className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4">
                  {pg.heroCtaSecondary} <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           2. STATS STRIP
           ════════════════════════════════════════════════════════ */}
        <div className="bg-dark-2 border-b border-border-dark py-8 relative z-10">
          <div className="site-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-gold/40 shadow-xl transition-all duration-300 group text-center">
                  <span className="text-gold font-serif text-[26px] md:text-[32px] font-bold block leading-none mb-1 group-hover:scale-105 transition-transform">{stat.value}</span>
                  <span className="text-white/60 text-[10.5px] font-mono uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
           3. WHY TRINITY (feature grid)
           ════════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white border-b border-border-light relative overflow-hidden">
          <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-gold-dark/[0.03] rounded-full blur-[140px] pointer-events-none" />

          <div className="site-container relative z-10">
            <div className="max-w-3xl mb-16 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-gold-dark" />
                <p className="section-label text-gold-dark">{pg.whyLabel}</p>
              </div>
              <h2 className="font-display font-medium text-[36px] min-[400px]:text-[44px] md:text-[56px] text-dark leading-[1.06] tracking-tight mb-4">
                {pg.whyTitle1}{' '}
                <span className="text-gold-dark italic font-light block sm:inline">{pg.whyTitle2}</span>
              </h2>
              <p className="text-dark/70 text-[15px] md:text-[17px] font-light leading-relaxed max-w-2xl">
                {pg.whyDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pg.whyFeatures.map((feature: any, idx: number) => (
                <div
                  key={idx}
                  className="p-7 rounded-xl bg-card-bg border border-border-light/80 hover:border-gold-dark/60 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl group"
                >
                  <div className="w-11 h-11 rounded-md bg-gold-dark/15 border border-gold-dark/30 flex items-center justify-center text-gold-dark mb-4 group-hover:bg-gold-dark group-hover:text-white transition-colors">
                    <Icon name={feature.icon || 'ShieldCheck'} className="w-5 h-5" />
                  </div>
                  <h3 className="text-dark font-bold text-[17px] mb-2 group-hover:text-gold-dark transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dark/65 text-[13.5px] font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           4. SUB-PAGE INDEX
           ════════════════════════════════════════════════════════ */}
        {pg.subPages.length > 0 && (
        <section id="lineup" className="py-24 md:py-32 bg-brand-bg-light border-b border-border-light relative">
          <div className="site-container">
            <div className="max-w-3xl mb-16 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-gold-dark" />
                <p className="section-label text-gold-dark">{pg.subPagesLabel}</p>
              </div>
              <h2 className="font-display font-medium text-[36px] min-[400px]:text-[44px] md:text-[56px] text-dark leading-[1.06] tracking-tight">
                {pg.subPagesTitle1}{' '}
                <span className="text-gold-dark italic font-light block sm:inline">{pg.subPagesTitle2}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pg.subPages.map((sub: any, idx: number) => (
                <Link
                  key={idx}
                  href={`/${sub.slug}/`}
                  className="p-7 rounded-xl bg-white border border-border-light hover:border-gold-dark/60 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-md bg-gold-dark/15 border border-gold-dark/30 flex items-center justify-center text-gold-dark mb-4 group-hover:bg-gold-dark group-hover:text-white transition-colors">
                      <Icon name={sub.icon || 'Settings'} className="w-5 h-5" />
                    </div>
                    <h3 className="text-dark font-bold text-[17px] mb-2 group-hover:text-gold-dark transition-colors">
                      {sub.title}
                    </h3>
                    {sub.description && (
                      <p className="text-dark/60 text-[13.5px] font-light leading-relaxed">
                        {sub.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-light flex items-center gap-2 text-gold-dark text-[11.5px] font-mono font-bold tracking-wider uppercase">
                    <span>{pg.subPagesCta}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════
         5. BUILT-IN CONTACT & FAQ SECTION
         ════════════════════════════════════════════════════════ */}
      <ContactFaqSection
        pageData={{
          faqBadge: pg.faqBadge,
          faqTitle: pg.faqTitle,
          faqDescription: pg.faqDescription,
          faq: pg.faqs,
        }}
      />
    </>
  );
}
