"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Quote, Star } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { stripHtml } from "../../lib/utils";

const StatsBar = dynamic(() => import("@/components/StatsBar"));
const CtaBanner = dynamic(() => import("@/components/CtaBanner"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });

const GOOGLE_REVIEW_URL = "https://maps.app.goo.gl/PbvRBs4tJsDAJVMy6";

const DEFAULT_STATS = [
  { value: "5.0", label: "Average Rating", icon: "Star" },
  { value: "100%", label: "Google Verified", icon: "ShieldCheck" },
  { value: "TX & NM", label: "Service Area", icon: "Truck" },
  { value: "100+", label: "Years Combined Experience", icon: "Award" },
];

const DEFAULT_CTA_BANNER = {
  label: "SHARE YOUR EXPERIENCE",
  title: "Had a Good Experience With Us?",
  description: "If we've kept your lease running, a quick Google review helps other operators find us.",
  button: "Leave a Google Review",
  buttonUrl: GOOGLE_REVIEW_URL,
  phone: "830-279-3996",
};

function Avatar({ src, name }: { src?: string; name: string }) {
  const [loaded, setLoaded] = useState(false);
  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <span className="relative h-12 w-12 rounded-full ring-2 ring-white shadow-sm flex-shrink-0 overflow-hidden bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white text-[14px] font-bold flex items-center justify-center">
      {!loaded && (initials || "•")}
      {src && (
        <img
          src={src}
          alt={name}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}

function ReviewCard({ review, index }: { review: any; index: number }) {
  const stars = Math.max(1, Math.min(5, Number(review.stars) || 5));
  return (
    <article
      className="group relative flex flex-col bg-white rounded-2xl border border-border-light p-7 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.4)]"
    >
      <span className="pointer-events-none absolute right-5 top-3 select-none text-[52px] leading-none font-black text-[rgba(7,27,28,0.035)] group-hover:text-[rgba(200,154,69,0.14)] transition-colors duration-500">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < stars ? "text-gold fill-gold" : "text-border-light fill-border-light"} />
        ))}
      </div>

      <Quote size={26} className="relative text-gold mb-3 fill-gold" strokeWidth={0} />
      <p className="relative text-dark/75 text-[14.5px] leading-[1.7] mb-7 flex-1">
        {stripHtml(review.quote)}
      </p>
      <div className="relative flex items-center gap-3 pt-5 border-t border-border-light/70">
        <Avatar src={review.avatar} name={review.author || review.name} />
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-dark leading-tight truncate">{stripHtml(review.author || review.name)}</p>
          {review.role && (
            <p className="text-[12px] text-dark/50 leading-tight mt-0.5 truncate">{stripHtml(review.role)}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ReviewsTemplate({ pageData }: { pageData?: any; params?: any }) {
  const { testimonials, globalMetadata } = useContent();

  const section = testimonials?.section || {};
  const badge = stripHtml(section.badge || "CLIENT TESTIMONIALS");
  const headline = section.headline || "Trusted Across the Permian Basin.";
  const description = stripHtml(
    section.description ||
      "Real feedback from operators who count on Trinity Pump & Supply to keep their leases running."
  );
  const heroImage = section.image || "/images/trinity/about.jpg";
  const heroImageAlt = section.imageAlt || "Trinity Pump & Supply";
  const bookingUrl = globalMetadata?.bookingUrl || "/contact-us/";

  const reviews: any[] = Array.isArray(testimonials?.items) && testimonials.items.length > 0 ? testimonials.items : [];

  // Stats and CTA get their own independent content here (never the shared
  // homepage useContent() data), so editing this page can never change what
  // shows on the homepage or vice versa.
  const statsItems = Array.isArray(testimonials?.stats?.items) && testimonials.stats.items.length > 0 ? testimonials.stats.items : DEFAULT_STATS;
  const ctaBannerData = testimonials?.ctaBanner && Object.keys(testimonials.ctaBanner).length > 0 ? testimonials.ctaBanner : DEFAULT_CTA_BANNER;

  return (
    <main className="w-full bg-off-white text-body overflow-hidden">
      {/* ════════════════════════════════════════════════════════
         HERO
         ════════════════════════════════════════════════════════ */}
      <section className="relative bg-dark min-h-[55vh] flex items-center pt-[130px] pb-14 border-b border-border-dark overflow-hidden">
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
              <span className="text-gold font-medium">Reviews</span>
            </nav>
          </div>

          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
              <p className="section-label text-gold">{badge}</p>
            </div>

            <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[68px] text-white leading-[1.08] mb-6 tracking-tight">
              {headline}
            </h1>

            <p className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-9 font-light">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a href={bookingUrl} className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4">
                Request a Quote <ArrowRight size={14} className="ml-1" />
              </a>
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4">
                Leave a Review <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         STATS — reuses the homepage's component for visual
         consistency, with this page's own independent content.
         ════════════════════════════════════════════════════════ */}
      <StatsBar overrideItems={statsItems} />

      {/* ════════════════════════════════════════════════════════
         REVIEWS GRID
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
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review: any, i: number) => (
                <ReviewCard key={i} review={review} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-dark/40 text-sm">No reviews yet — add some from the dashboard.</div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         CTA — reuses the homepage's component for visual consistency,
         with this page's own independent content (links to the real
         Google review page by default).
         ════════════════════════════════════════════════════════ */}
      <div className="-mt-10 md:-mt-16 relative">
        <CtaBanner overrideData={ctaBannerData} />
      </div>

      {/* ════════════════════════════════════════════════════════
         CONTACT FORM + FAQ — shared sitewide, same as every other page.
         ════════════════════════════════════════════════════════ */}
      <QAForm pageData={pageData} />
    </main>
  );
}
