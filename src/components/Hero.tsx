"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";
import { Icon } from "../config/icons";

export default function HeroSection() {
  const { hero, globalMetadata, stats } = useContent();

  const {
    label = "",
    title1 = "",
    title2 = "",
    description = "",
    ctaBook = "Request a Quote",
    ctaServices = "Explore Services",
    image = "",
    imageAlt = "",
    features = [],
  } = hero || {};

  const cleanLabel = stripHtml(label);
  const cleanTitle1 = stripHtml(title1);
  const cleanTitle2 = stripHtml(title2);
  const cleanDescription = stripHtml(description);
  const badges: any[] = Array.isArray(features) ? features.slice(0, 3) : [];
  const heroStat = stats?.items?.[0];

  const primaryUrl = hero?.ctaBookUrl || hero?.bookingUrl || hero?.ctaUrl1 || globalMetadata?.bookingUrl || "/contact-us";
  const secondaryUrl = hero?.ctaServicesUrl || hero?.ctaUrl2 || "/#services";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <section className="relative bg-dark overflow-hidden border-b border-white/10">
      {/* Faint dot-grid texture on the ink panel — the same ambient-texture
          language used elsewhere on the site, so the left side reads as
          intentional rather than empty now that it's no longer a photo. */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #E8C87A 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* Ambient gold glow, anchored behind the headline */}
      <div
        className="absolute top-1/4 -left-32 w-[560px] h-[560px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.14) 0%, rgba(200,154,69,0) 68%)" }}
      />

      <div className="relative z-10 site-container grid grid-cols-1 lg:grid-cols-12 items-center gap-y-14 lg:gap-x-12 pt-28 pb-16 lg:pt-40 lg:pb-24">

        {/* ── Left: Ink panel with the pitch ───────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col items-start"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
            <span className="w-6 h-[1px] bg-gradient-to-r from-gold to-gold/40 flex-shrink-0" />
            <p className="section-label">{cleanLabel}</p>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="display-heading text-[40px] min-[400px]:text-[48px] md:text-[58px] lg:text-[60px] xl:text-[68px] leading-[1.04] mb-6 tracking-tight"
          >
            <span className="block text-white">{cleanTitle1}</span>
            <span className="block text-gold italic font-light">{cleanTitle2}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-white/70 text-[14.5px] md:text-[16px] leading-[1.8] font-light max-w-[440px] mb-9"
          >
            {cleanDescription}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start gap-3.5 mb-11"
          >
            {primaryUrl.startsWith("http") ? (
              <a
                href={primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4"
              >
                {ctaBook} <ArrowRight size={14} className="ml-1" />
              </a>
            ) : (
              <Link
                href={primaryUrl}
                className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4"
              >
                {ctaBook} <ArrowRight size={14} className="ml-1" />
              </Link>
            )}
            {secondaryUrl.startsWith("http") ? (
              <a
                href={secondaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4"
              >
                {ctaServices} <ArrowRight size={14} className="ml-1" />
              </a>
            ) : (
              <Link
                href={secondaryUrl}
                className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4"
              >
                {ctaServices} <ArrowRight size={14} className="ml-1" />
              </Link>
            )}
          </motion.div>

          {/* Trust list — stacked rows instead of a wide pill, since this
              column is narrower now than the old full-bleed layout. */}
          {badges.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-col gap-3.5 w-full max-w-[360px]">
              {badges.map((b: any, i: number) => (
                <div key={i} className="flex items-center gap-3 pb-3.5 border-b border-white/10 last:border-b-0 last:pb-0">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex-shrink-0">
                    <Icon name={b.icon || "ShieldCheck"} className="text-gold" size={15} strokeWidth={1.9} />
                  </span>
                  <span className="text-white text-[13.5px] font-medium">
                    {stripHtml(b.title)} <span className="text-white/50 font-light">{stripHtml(b.subtitle)}</span>
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ── Right: Framed photo card, not full-bleed ─────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative mx-auto max-w-[520px] lg:max-w-none">
            {/* Soft gold glow behind the card for depth */}
            <div
              className="absolute -top-8 -right-8 w-64 h-64 rounded-full pointer-events-none blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(200,154,69,0.35) 0%, rgba(200,154,69,0) 70%)" }}
            />

            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
              {image.startsWith("http") || image.startsWith("/uploads") || image.startsWith("/cdn-images") ? (
                <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
              ) : (
                <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" priority />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none" />
            </div>

            {/* Floating stat card — overlapping the frame for depth, the
                classic layered-composition move that a flat full-bleed
                photo can't do. */}
            {heroStat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="absolute -bottom-7 -left-6 sm:-left-9 bg-dark-2/95 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5 shadow-2xl"
              >
                <p className="display-heading text-gold text-[34px] sm:text-[40px] leading-none mb-1.5">{stripHtml(heroStat.value)}</p>
                <p className="text-white/60 text-[11px] font-semibold tracking-[0.12em] uppercase max-w-[140px] leading-snug">
                  {stripHtml(heroStat.label)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-white/40 text-[10px] font-semibold tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-gold/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
