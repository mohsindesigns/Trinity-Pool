"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

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
    imageAlt = ""
  } = hero || {};

  const cleanLabel = stripHtml(label);
  const cleanTitle1 = stripHtml(title1);
  const cleanTitle2 = stripHtml(title2);
  const cleanDescription = stripHtml(description);

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
    <section className="relative bg-dark min-h-screen flex items-center overflow-hidden border-b border-white/10">
      {/* ── Full-bleed background image ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
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
              "linear-gradient(to right, #071B1C 0%, #071B1C 28%, rgba(7,27,28,0.82) 46%, rgba(7,27,28,0.12) 64%, transparent 76%)",
          }}
        />
        {/* Right dark gradient — covers feature badges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, #111516 0%, #111516 14%, rgba(17,21,22,0.88) 28%, transparent 46%)",
          }}
        />
        {/* Top / bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/55 via-transparent to-dark/55" />
      </motion.div>

      {/* ── Main Content ───────────────────────────────── */}
      <div className="relative z-10 site-container pt-32 pb-16 md:pt-40 md:pb-24 w-full">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[560px] flex flex-col items-start"
          >
            {/* Label */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
              <span className="w-5 h-[1px] bg-gold flex-shrink-0" />
              <p className="section-label">{cleanLabel}</p>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="display-heading text-[28px] min-[400px]:text-[34px] md:text-[44px] leading-[1.12] mb-5 tracking-tight"
            >
              <span className="block text-white">{cleanTitle1}</span>
              <span className="block text-gold italic">{cleanTitle2}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-white/65 text-[13.5px] md:text-[14.5px] leading-[1.75] max-w-[440px] mb-8"
            >
              {cleanDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              {primaryUrl.startsWith("http") ? (
                <a
                  href={primaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full sm:w-auto justify-center text-center px-7"
                >
                  {ctaBook} <ArrowRight size={14} className="ml-1" />
                </a>
              ) : (
                <Link
                  href={primaryUrl}
                  className="btn-gold w-full sm:w-auto justify-center text-center px-7"
                >
                  {ctaBook} <ArrowRight size={14} className="ml-1" />
                </Link>
              )}
              {secondaryUrl.startsWith("http") ? (
                <a
                  href={secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-white w-full sm:w-auto justify-center text-center px-7"
                >
                  {ctaServices} <ArrowRight size={14} className="ml-1" />
                </a>
              ) : (
                <Link
                  href={secondaryUrl}
                  className="btn-outline-white w-full sm:w-auto justify-center text-center px-7"
                >
                  {ctaServices} <ArrowRight size={14} className="ml-1" />
                </Link>
              )}
            </motion.div>
          </motion.div>
      </div>
    </section>
  );
}
