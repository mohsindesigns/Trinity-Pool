"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";
import { Icon } from "../config/icons";

export default function HeroSection() {
  const { hero, globalMetadata } = useContent();

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
    <section className="relative bg-dark min-h-[92vh] md:min-h-screen flex items-center overflow-hidden border-b border-white/10">
      {/* ── Full-bleed background image ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {image.startsWith("http") || image.startsWith("/uploads") || image.startsWith("/cdn-images") ? (
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        )}

        {/* Left dark gradient — covers text column */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #071B1C 0%, #071B1C 30%, rgba(7,27,28,0.86) 48%, rgba(7,27,28,0.18) 68%, transparent 82%)",
          }}
        />
        {/* Right dark gradient — grounds the floating trust badges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, #111516 0%, #111516 10%, rgba(17,21,22,0.7) 24%, transparent 44%)",
          }}
        />
        {/* Bottom gradient — anchors the content and hides the seam into the next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/10 to-transparent" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-transparent to-transparent" />
      </motion.div>

      {/* Ambient gold glow — same recipe used elsewhere on the site for depth */}
      <div
        className="absolute top-1/3 -right-40 w-[620px] h-[620px] rounded-full pointer-events-none z-[1]"
        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.16) 0%, rgba(200,154,69,0) 68%)" }}
      />

      {/* ── Main Content ───────────────────────────────── */}
      <div className="relative z-10 site-container pt-32 pb-20 md:pt-40 md:pb-28 w-full">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[640px] flex flex-col items-start"
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
            <span className="w-6 h-[1px] bg-gradient-to-r from-gold to-gold/40 flex-shrink-0" />
            <p className="section-label">{cleanLabel}</p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="display-heading text-[40px] min-[400px]:text-[48px] md:text-[64px] lg:text-[74px] leading-[1.04] mb-6 tracking-tight"
          >
            <span className="block text-white">{cleanTitle1}</span>
            <span className="block text-gold italic font-light">{cleanTitle2}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-white/70 text-[14.5px] md:text-[16px] leading-[1.8] font-light max-w-[480px] mb-9"
          >
            {cleanDescription}
          </motion.p>

          {/* CTA Buttons */}
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

          {/* Trust strip — same glass-pill treatment used on service pages, so the
              headline claim isn't left to just be taken on faith. */}
          {badges.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-5 py-3.5 px-6 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-xl"
            >
              {badges.map((b: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  {i > 0 && <span className="text-white/15 hidden sm:inline">|</span>}
                  <div className="flex items-center gap-2.5">
                    <Icon name={b.icon || "ShieldCheck"} className="text-gold flex-shrink-0" size={17} strokeWidth={1.9} />
                    <span className="text-white text-[13px] font-medium whitespace-nowrap">
                      {stripHtml(b.title)} <span className="text-white/55 font-light">{stripHtml(b.subtitle)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 pointer-events-none"
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
