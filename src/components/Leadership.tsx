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
  if (!iconName) return Droplets;
  if (BADGE_ICONS[iconName]) return BADGE_ICONS[iconName];
  const lower = iconName.toLowerCase().trim();
  for (const k of Object.keys(BADGE_ICONS)) {
    if (k.toLowerCase() === lower) return BADGE_ICONS[k];
  }
  return Droplets;
};

export default function Leadership() {
  const { leadership } = useContent();

  const label       = stripHtml(leadership?.label       || "ABOUT US");
  const title       = stripHtml(leadership?.title       || "Your Trusted Partner in Oil & Pump Supply");
  const desc1       = stripHtml(leadership?.desc1       || "We are a leading supplier of high-quality oil products, industrial pumps and related equipment, serving diverse industries across the region. With a commitment to quality, reliability and customer satisfaction, we ensure your operations never stop.");
  const photoBadgeTitle = stripHtml(leadership?.photoBadgeTitle || "Quality Solutions");
  const photoBadgeSubtitle = stripHtml(leadership?.photoBadgeSubtitle || "for a Reliable Tomorrow");
  const photoBadge  = stripHtml(leadership?.photoBadge  || "Quality Solutions for a Reliable Tomorrow");
  const photoBadgeIcon = leadership?.photoBadgeIcon || "Droplets";
  const ctaMore     = stripHtml(leadership?.ctaMore     || "Learn More About Us");
  const ctaLink     =           leadership?.ctaLink     || "/about";
  const image       =           leadership?.image       || "";
  const imageAlt    =           leadership?.imageAlt    || "About Us";

  const BadgeIcon = resolveBadgeIcon(photoBadgeIcon);

  // Dedicated own stats for About Us section (independent from StatsBar)
  const defaultStats = [
    { value: "20+",  label: "Years Experience" },
    { value: "100+", label: "Trusted Brands"   },
    { value: "500+", label: "Happy Clients"    },
    { value: "24/7", label: "Support"          },
  ];

  const aboutStats = (Array.isArray(leadership?.stats) && leadership.stats.length > 0)
    ? leadership.stats
    : defaultStats;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ── Left Column: Image with Gradient & Brass Droplet Badge ── */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900 aspect-[4/3] sm:h-[420px] lg:h-[460px] w-full">
              {/* Background Image */}
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />

              {/* Bottom Gradient Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.45) 40%, transparent 75%)",
                }}
              />

              {/* Bottom Overlay Badge Card */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3.5 z-10">
                <div
                  className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center backdrop-blur-md"
                  style={{
                    background: "rgba(217, 159, 38, 0.18)",
                    border: "1.5px solid rgba(217, 159, 38, 0.75)",
                  }}
                >
                  <BadgeIcon size={22} className="text-[#D99F26]" />
                </div>
                <div className="flex flex-col">
                  {photoBadgeTitle ? (
                    <>
                      <span className="text-white font-bold text-[15px] sm:text-base leading-tight tracking-tight drop-shadow-sm">
                        {photoBadgeTitle}
                      </span>
                      <span className="text-white/85 text-[12px] sm:text-[13px] font-normal leading-tight mt-0.5 drop-shadow-sm">
                        {photoBadgeSubtitle}
                      </span>
                    </>
                  ) : (
                    <span className="text-white font-semibold text-[14px] leading-tight drop-shadow-sm">
                      {photoBadge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: Text & Dedicated Stats ── */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center lg:pl-4"
          >
            {/* Category / Kicker Badge */}
            <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#D99F26] mb-3.5">
              {label}
            </p>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] leading-[1.18] tracking-tight mb-5">
              {title}
            </h2>

            {/* Narrative Paragraph */}
            <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed mb-8 max-w-2xl">
              {desc1}
            </p>

            {/* Dedicated Stats Row with Vertical Dividers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 mb-9 sm:divide-x sm:divide-slate-200 border-y sm:border-y-0 border-slate-100 py-4 sm:py-0">
              {aboutStats.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:px-5 first:pl-0 last:pr-0"
                >
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-none mb-1.5">
                    {s.value}
                  </span>
                  <span className="text-[12px] sm:text-[13px] text-slate-500 font-medium leading-snug">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Warm Golden CTA Button */}
            <div>
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg font-semibold text-sm !text-[#0F172A] hover:!text-[#0F172A] transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] group bg-[#D99F26] hover:bg-[#C88E1B]"
                style={{
                  backgroundColor: "#D99F26",
                  color: "#0F172A",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#C88E1B";
                  (e.currentTarget as HTMLElement).style.color = "#0F172A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#D99F26";
                  (e.currentTarget as HTMLElement).style.color = "#0F172A";
                }}
              >
                <span className="!text-[#0F172A] font-semibold">{ctaMore}</span>
                <ArrowRight
                  size={16}
                  className="!text-[#0F172A] group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}


