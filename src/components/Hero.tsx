"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  } as const;

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  const PhotoImg = () =>
    image.startsWith("http") || image.startsWith("/uploads") || image.startsWith("/cdn-images") ? (
      <img src={image} alt={imageAlt} className="w-full h-full object-cover object-center" />
    ) : (
      <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover object-center" priority />
    );

  const Content = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-start">
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
        <span className="w-6 h-[1px] bg-gradient-to-r from-gold to-gold/40 flex-shrink-0" />
        <p className="section-label">{cleanLabel}</p>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="display-heading text-[36px] min-[400px]:text-[42px] md:text-[42px] lg:text-[60px] leading-[1.05] mb-5 tracking-tight max-w-[440px]"
      >
        <span className="block text-white">{cleanTitle1}</span>
        <span className="block text-gold">{cleanTitle2}</span>
      </motion.h1>

      <motion.p variants={itemVariants} className="text-white/70 text-[13.5px] md:text-[14.5px] leading-[1.75] font-light mb-8 max-w-[430px]">
        {cleanDescription}
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start gap-3 mb-10">
        {primaryUrl.startsWith("http") ? (
          <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="btn-gold w-full sm:w-auto justify-center text-center px-7">
            {ctaBook} <ArrowRight size={14} className="ml-1" />
          </a>
        ) : (
          <Link href={primaryUrl} className="btn-gold w-full sm:w-auto justify-center text-center px-7">
            {ctaBook} <ArrowRight size={14} className="ml-1" />
          </Link>
        )}
        {secondaryUrl.startsWith("http") ? (
          <a href={secondaryUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-white w-full sm:w-auto justify-center text-center px-7">
            {ctaServices} <ArrowRight size={14} className="ml-1" />
          </a>
        ) : (
          <Link href={secondaryUrl} className="btn-outline-white w-full sm:w-auto justify-center text-center px-7">
            {ctaServices} <ArrowRight size={14} className="ml-1" />
          </Link>
        )}
      </motion.div>

      {badges.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-7 gap-y-4">
          {badges.map((b: any, i: number) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-full border border-gold/40 flex-shrink-0">
                <Icon name={b.icon || "ShieldCheck"} className="text-gold" size={15} strokeWidth={1.8} />
              </span>
              {/* Title over subtitle on two lines (as in the reference) --
                  this is what lets all three fit on one row. */}
              <span className="flex flex-col leading-tight">
                <span className="text-white text-[12.5px] font-semibold whitespace-nowrap">{stripHtml(b.title)}</span>
                <span className="text-white/50 text-[11.5px] font-light whitespace-nowrap">{stripHtml(b.subtitle)}</span>
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <section className="relative bg-dark px-3 pt-[100px] pb-6 sm:px-4 sm:pt-[112px] md:px-6 md:pt-[128px]">
      {/* ── Mobile / small tablet: simple stacked card (photo on top,
          text below) — a thin diagonal sliver of photo doesn't read on a
          narrow screen, so this isn't the same layout scaled down, it's a
          deliberately different arrangement of the same pieces. ── */}
      <div className="md:hidden rounded-[1.75rem] overflow-hidden bg-[#0b2a2c]">
        <div className="relative h-[280px] min-[400px]:h-[320px]">
          <PhotoImg />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2a2c] via-[#0b2a2c]/10 to-transparent" />
        </div>
        <div className="p-7 pt-0 -mt-10 relative">
          <Content />
        </div>
      </div>

      {/* ── md+: diagonal split card ─────────────────────────────── */}
      <div className="hidden md:block relative rounded-[2.25rem] overflow-hidden bg-[#0b2a2c] min-h-[600px] lg:min-h-[660px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
          style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 63% 100%)" }}
        >
          <PhotoImg />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-dark/20" />
        </motion.div>

        {/* Thin gold accent traced exactly along the diagonal edge -- a
            narrow parallelogram, since a box-shadow on a clip-pathed element
            gets clipped away with it and never shows. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: "polygon(calc(52% - 5px) 0, calc(52% - 2px) 0, calc(63% - 2px) 100%, calc(63% - 5px) 100%)",
            background: "linear-gradient(to bottom, rgba(232,200,122,0.85), rgba(200,154,69,0.55))",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: "polygon(calc(52% - 14px) 0, calc(52% - 12px) 0, calc(63% - 12px) 100%, calc(63% - 14px) 100%)",
            background: "rgba(200,154,69,0.25)",
          }}
        />

        <div className="relative z-10 max-w-[310px] lg:max-w-[600px] p-9 lg:p-16">
          <Content />
        </div>
      </div>
    </section>
  );
}
