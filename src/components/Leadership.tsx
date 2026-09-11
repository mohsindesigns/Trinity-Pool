"use client";

import {
  ArrowRight, Droplets, ShieldCheck, Award, Flame, Zap,
  Wrench, Truck, Star, CheckCircle2, LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";
import Link from "next/link";

const BADGE_ICONS: Record<string, LucideIcon> = {
  Droplets,
  ShieldCheck,
  Award,
  Flame,
  Zap,
  Wrench,
  Truck,
  Star,
  CheckCircle2,
};

const resolveBadgeIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return ShieldCheck;
  if (BADGE_ICONS[iconName]) return BADGE_ICONS[iconName];
  const lower = iconName.toLowerCase().trim();
  for (const k of Object.keys(BADGE_ICONS)) {
    if (k.toLowerCase() === lower) return BADGE_ICONS[k];
  }
  return ShieldCheck;
};

export default function Leadership() {
  const { leadership } = useContent();

  const label            = stripHtml(leadership?.label            || "ABOUT US");
  const title            = stripHtml(leadership?.title            || "Your Trusted Partner in Oil & Pump Supply");
  const desc1            = stripHtml(leadership?.desc1            || "We are a leading supplier of high-quality oil products, industrial pumps and related equipment, serving diverse industries across the region. With a commitment to quality, reliability and customer satisfaction, we ensure your operations never stop.");
  const photoBadgeTitle  = stripHtml(leadership?.photoBadgeTitle  || "Quality Solutions");
  const photoBadgeSubtitle = stripHtml(leadership?.photoBadgeSubtitle || "for a Reliable Tomorrow");
  const photoBadgeIcon   = leadership?.photoBadgeIcon || "ShieldCheck";
  const ctaMore          = stripHtml(leadership?.ctaMore          || "Learn More About Us");
  const ctaLink          = leadership?.ctaLink          || "/about";
  const image            = leadership?.image            || "/images/about-us.jpg";
  const imageAlt         = leadership?.imageAlt         || "About Us";

  const BadgeIcon = resolveBadgeIcon(photoBadgeIcon);

  const defaultStats = [
    { value: "20+",  label: "Years Experience" },
    { value: "100+", label: "Trusted Brands"   },
    { value: "500+", label: "Happy Clients"    },
    { value: "24/7", label: "Support"          },
  ];

  const aboutStats = (Array.isArray(leadership?.stats) && leadership.stats.length > 0)
    ? leadership.stats
    : defaultStats;

  const keyHighlights = [
    "Certified industrial fluid handling & precision equipment",
    "Direct supplier access with fast, reliable turnaround",
    "Continuous technical support for maximum equipment uptime"
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden border-t border-border-light/40">
      {/* Subtle ambient decorative accents */}
      <div
        className="bg-radial-dots-gold absolute top-0 right-0 w-[480px] h-[480px] opacity-[0.14] pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(circle at top right, black, transparent 70%)",
          maskImage: "radial-gradient(circle at top right, black, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.12) 0%, rgba(200,154,69,0) 65%)" }}
      />

      <div className="site-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Left Column: Premium Framed Image with Floating Badge ── */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-5 relative"
          >
            <div className="relative">
              {/* Subtle background offset gold frame */}
              <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-tr from-gold/25 via-gold/10 to-transparent -z-10 blur-[1px] transform -rotate-1 hidden sm:block" />

              {/* Main Image Container */}
              <div className="relative rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.14)] bg-dark aspect-[4/3] sm:h-[450px] lg:h-[490px] w-full border border-slate-200/80">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (!el.src.includes("/images/about-us.jpg")) {
                      el.src = "/images/about-us.jpg";
                    }
                  }}
                />

                {/* Vignette overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, rgba(10, 15, 23, 0.92) 0%, rgba(10, 15, 23, 0.4) 35%, transparent 70%)",
                  }}
                />

                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-dark/85 backdrop-blur-md border border-white/15 shadow-xl flex items-center gap-3.5 z-10">
                  <div className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gold-light via-gold to-gold-dark text-dark shadow-[0_4px_14px_rgba(200,154,69,0.35)]">
                    <BadgeIcon size={22} className="text-dark" strokeWidth={2.2} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-bold text-[14px] sm:text-[15px] leading-snug truncate drop-shadow-sm">
                      {photoBadgeTitle}
                    </span>
                    <span className="text-white/75 text-[12px] font-normal leading-snug truncate">
                      {photoBadgeSubtitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: Content, Key Highlights, Stats & Signature CTA ── */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center"
          >
            {/* Kicker Badge */}
            <div className="flex items-center gap-3 mb-3.5">
              <span className="w-6 h-[2px] bg-gold flex-shrink-0" />
              <p className="section-label">{label}</p>
            </div>

            {/* Main Headline */}
            <h2 className="display-heading text-[30px] min-[400px]:text-[34px] sm:text-[40px] lg:text-[44px] text-dark leading-[1.14] tracking-tight mb-5">
              {title}
            </h2>

            {/* Narrative Paragraph */}
            <p className="text-slate-600 text-[15px] sm:text-[16px] leading-[1.75] font-light mb-6 max-w-2xl">
              {desc1}
            </p>

            {/* Feature Checkpoints */}
            <div className="space-y-2.5 mb-8">
              {keyHighlights.map((pt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full flex items-center justify-center bg-gold/15 text-gold-dark flex-shrink-0">
                    <CheckCircle2 size={14} className="text-gold-dark" strokeWidth={2.5} />
                  </div>
                  <span className="text-[14px] text-slate-700 font-medium">{pt}</span>
                </div>
              ))}
            </div>

            {/* Dedicated Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-9 pt-6 pb-6 border-y border-slate-100">
              {aboutStats.map((s: any, idx: number) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight leading-none mb-1">
                    {s.value}
                  </span>
                  <span className="text-[12px] sm:text-[13px] text-slate-500 font-medium leading-snug">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Site Signature CTA Button */}
            <div>
              <Link href={ctaLink} className="btn-gold-pill">
                <span>{ctaMore}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
