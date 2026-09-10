"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function IndustriesSection() {
  const { industries } = useContent();

  const badge       = stripHtml(industries?.badge       || "INDUSTRIES WE SERVE");
  const title       = stripHtml(industries?.title       || "Trusted Across Multiple Industries");
  const description = stripHtml(industries?.description || "We support a wide range of industries with reliable equipment and pumping solutions, helping businesses achieve greater efficiency and productivity.");
  const ctaLabel    = stripHtml(industries?.ctaLabel    || "View All Industries");
  const ctaLink     =           industries?.ctaLink     || "/industries";

  // Cards come only from the CMS (Home editor → Industries). No hardcoded fallback cards.
  const cards: any[] = Array.isArray(industries?.cards) ? industries.cards : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
  } as const;

  return (
    <section
      className="relative overflow-hidden py-16 md:py-20"
      style={{ background: "linear-gradient(135deg, #071B1C 0%, #0C1F20 60%, #111516 100%)" }}
    >
      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(-45deg, #C89A45 0px, #C89A45 1px, transparent 1px, transparent 14px)",
        }}
      />

      {/* Brass top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, transparent, #C89A45 30%, #E8C87A 50%, #C89A45 70%, transparent)" }}
      />

      <div className="relative site-container">

        {/* ── Top Row: Badge / Title / Description / CTA ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 md:gap-12 mb-10 items-end">

          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "#C89A45" }}
            >
              {badge}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-white font-bold leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </motion.h2>
          </div>

          {/* Right */}
          <div className="flex flex-col justify-end gap-4">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[14px] md:text-[15px] leading-relaxed"
              style={{ color: "#899397" }}
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 text-[13px] font-semibold group"
                style={{ color: "#C89A45" }}
              >
                {ctaLabel}
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── Cards Row ─────────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {cards.map((card: any, idx: number) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="group relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
              style={{
                border: "1px solid rgba(200,154,69,0.15)",
                background: "#0D2425",
              }}
            >
              {/* Image */}
              <div className="relative h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title || "Industry"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: "linear-gradient(135deg, #0D2425, #1a3a3c)" }}
                  />
                )}
                {/* Dark gradient over image bottom */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(7,27,28,0.85) 100%)" }}
                />
                {/* Hover brass overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(to bottom, rgba(200,154,69,0.08), transparent)" }}
                />
              </div>

              {/* Card Footer */}
              <div className="p-3.5">
                <h3
                  className="text-white font-semibold text-[13px] md:text-[14px] leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="text-[11px] md:text-[12px]" style={{ color: "#899397" }}>
                    {card.subtitle}
                  </p>
                )}
                {card.cta && card.ctaLink && (
                  <Link
                    href={card.ctaLink || "#"}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: "#C89A45" }}
                  >
                    {card.cta}
                    <ChevronRight size={11} />
                  </Link>
                )}
              </div>

              {/* Bottom brass line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: "linear-gradient(90deg, #C89A45, #E8C87A, #C89A45)" }}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
