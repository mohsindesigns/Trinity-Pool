"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

const AUTOPLAY_MS = 6000;

export default function HowWeWork() {
  const { process } = useContent();
  const {
    label = "OUR PROCESS",
    title = "How We Work",
    titleItalicWord = "Work",
    description = "From initial inquiry to long-term support, our process is designed to be simple, transparent and efficient — so you get the right solutions, exactly when you need them.",
    phaseLabel = "STEP",
    items = []
  } = process || {};

  const defaultSteps = [
    {
      title: "Request a Quote",
      shortDescription: "Tell us what you need and get a quick, competitive quote.",
      description: "Share your requirements with our team. We'll review your needs and provide a competitive, no-obligation quote — fast and hassle-free.",
      ctaText: "GET A QUOTE",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-1.jpg"
    },
    {
      title: "Consultation",
      shortDescription: "We understand your requirements and provide the best solution.",
      description: "Our expert engineering team assesses your technical specifications, fluid dynamics, and operational requirements to recommend optimal, cost-efficient pump systems.",
      ctaText: "SCHEDULE CONSULTATION",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-2.jpg"
    },
    {
      title: "Supply & Delivery",
      shortDescription: "We source, prepare and deliver on time.",
      description: "Fast-track logistics, certified equipment packaging, and guaranteed on-time site dispatch ensure zero operational downtime for your plant or drilling facility.",
      ctaText: "TRACK SHIPMENTS",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-3.jpg"
    },
    {
      title: "After-Sales Support",
      shortDescription: "Ongoing support for maximum uptime.",
      description: "24/7 technical hotline, rapid OEM spare parts replacement, preventative field diagnostics, and certified technician maintenance for maximum equipment uptime.",
      ctaText: "GET SUPPORT",
      ctaUrl: "/contact-us/",
      image: "/images/trinity/process-4.jpg"
    }
  ];

  const steps: any[] = Array.isArray(items) && items.length > 0 ? items : defaultSteps;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => {
    setActive(((i % steps.length) + steps.length) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (steps.length < 2 || paused) return;
    const id = window.setInterval(() => go(active + 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, paused, steps.length, go]);

  if (steps.length === 0) return null;

  const numberOf = (i: number) => String(i + 1).padStart(2, "0");
  const current = steps[active] || steps[0];

  // Helper to highlight the italic word in the title
  const renderTitle = () => {
    const rawTitle = stripHtml(title) || "How We Work";
    const italicWord = stripHtml(titleItalicWord) || "Work";

    if (!italicWord || !rawTitle.toLowerCase().includes(italicWord.toLowerCase())) {
      return <span>{rawTitle}</span>;
    }

    const regex = new RegExp(`(${italicWord})`, "i");
    const parts = rawTitle.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === italicWord.toLowerCase()) {
        return (
          <span key={index} className="font-serif italic font-normal text-gold-light ml-2">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <section
      id="process"
      className="relative bg-[#080b0f] text-white py-20 md:py-28 overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-[-15%] w-[650px] h-[650px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #C89A45 0%, rgba(200,154,69,0) 70%)" }}
      />
      <div
        className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #E5B869 0%, rgba(200,154,69,0) 70%)" }}
      />

      {/* Subtle bottom textured silhouette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-40 bg-gradient-to-t from-black via-black/40 to-transparent"
      />

      <div className="site-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* ════════════════ LEFT COLUMN: HEADER & TIMELINE ════════════════ */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Header Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-gradient-to-r from-gold to-gold/40" />
              <span className="text-[12px] font-bold tracking-[0.22em] uppercase text-gold">
                {stripHtml(label) || "OUR PROCESS"}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="display-heading text-[36px] sm:text-[44px] md:text-[50px] leading-[1.08] text-white tracking-tight mb-5">
              {renderTitle()}
            </h2>

            {/* Subtitle description */}
            {description && (
              <p className="text-white/60 text-[14.5px] leading-[1.75] font-light max-w-md mb-12">
                {stripHtml(description)}
              </p>
            )}

            {/* Vertical timeline steps */}
            <div className="relative flex flex-col">
              {steps.map((step: any, i: number) => {
                const isActive = i === active;
                const isLast = i === steps.length - 1;
                const stepNum = numberOf(i);
                const stepBadgeText = `${stripHtml(phaseLabel) || "STEP"} ${stepNum}`;
                const stepShortDesc = stripHtml(step.shortDescription || step.description || "");

                return (
                  <div key={i} className="relative flex items-start group">
                    {/* Vertical Connector Line */}
                    {!isLast && (
                      <span
                        className={`absolute left-[21px] top-[46px] bottom-[-6px] w-[1.5px] transition-colors duration-500 z-0 ${
                          isActive || i < active ? "bg-gradient-to-b from-gold to-gold/40" : "bg-white/10"
                        }`}
                      />
                    )}

                    {/* Step button container */}
                    <button
                      type="button"
                      onClick={() => go(i)}
                      className="relative z-10 w-full flex items-start gap-4 sm:gap-5 py-3.5 text-left transition-all duration-300 rounded-xl focus:outline-none"
                    >
                      {/* Step Circle Badge */}
                      <span
                        className={`h-11 w-11 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? "border-[1.5px] border-gold text-gold bg-[#12171f] shadow-[0_0_15px_rgba(200,154,69,0.35)] scale-105"
                            : "border border-white/20 text-white/50 bg-[#0c1015]/80 group-hover:border-gold/50 group-hover:text-white"
                        }`}
                      >
                        {stepNum}
                      </span>

                      {/* Step Text */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <span
                          className={`block text-[11px] font-bold tracking-[0.16em] uppercase mb-0.5 transition-colors duration-300 ${
                            isActive ? "text-gold" : "text-white/40 group-hover:text-white/60"
                          }`}
                        >
                          {stepBadgeText}
                        </span>
                        <span
                          className={`block text-[17px] sm:text-[19px] font-bold leading-snug transition-colors duration-300 ${
                            isActive ? "text-white" : "text-white/70 group-hover:text-white"
                          }`}
                        >
                          {stripHtml(step.title)}
                        </span>
                        {stepShortDesc && (
                          <span className="block text-white/55 text-[13px] leading-[1.6] font-light mt-1 max-w-sm">
                            {stepShortDesc}
                          </span>
                        )}
                      </div>

                      {/* Active Indicator Arrow */}
                      <div className="pt-3 pr-2">
                        <ArrowRight
                          size={18}
                          className={`text-gold transition-all duration-300 ${
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2 pointer-events-none"
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ════════════════ RIGHT COLUMN: INTERACTIVE SHOWCASE CARD ════════════════ */}
          <div className="lg:col-span-7 relative">
            {/* Massive Background Watermark Number */}
            <div className="absolute -top-16 -right-6 lg:-top-20 lg:-right-4 text-[130px] sm:text-[170px] lg:text-[200px] font-serif font-black text-white/[0.04] select-none pointer-events-none leading-none tracking-tighter z-0">
              {numberOf(active)}
            </div>

            {/* Geometric Gold Line Accent */}
            <div className="absolute -top-6 -right-6 w-36 h-36 pointer-events-none hidden sm:block z-10">
              <svg viewBox="0 0 140 140" fill="none" className="w-full h-full stroke-gold/60">
                <line x1="140" y1="0" x2="60" y2="140" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Showcase Card Container */}
            <div className="relative z-10 rounded-[24px] sm:rounded-[28px] p-[1px] bg-gradient-to-br from-white/20 via-white/5 to-gold/20 shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="relative rounded-[23px] sm:rounded-[27px] bg-[#0d1219] overflow-hidden aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/11] min-h-[440px] flex flex-col justify-end">

                {/* Animated Image Background */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${current.image || defaultSteps[active % defaultSteps.length].image})`
                    }}
                  />
                </AnimatePresence>

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f] via-[#080b0f]/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080b0f]/80 via-transparent to-transparent z-10" />

                {/* Card Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-20 p-8 sm:p-10 lg:p-12 max-w-xl"
                  >
                    {/* Step Tag */}
                    <span className="block text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-gold mb-2">
                      {stripHtml(phaseLabel) || "STEP"} {numberOf(active)}
                    </span>

                    {/* Step Title */}
                    <h3 className="display-heading text-[26px] sm:text-[32px] md:text-[36px] text-white leading-[1.12] mb-3">
                      {stripHtml(current.title)}
                    </h3>

                    {/* Step Detailed Description */}
                    <p className="text-white/80 text-[14px] sm:text-[15px] leading-[1.75] font-light mb-6 line-clamp-3 sm:line-clamp-none">
                      {stripHtml(current.description || current.shortDescription || "")}
                    </p>

                    {/* Pill CTA Button */}
                    <div>
                      <Link
                        href={current.ctaUrl || "/contact-us/"}
                        className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-gold/70 text-gold text-[12px] font-bold tracking-[0.14em] uppercase transition-all duration-300 hover:bg-gold hover:text-black hover:border-gold hover:shadow-[0_0_20px_rgba(200,154,69,0.4)] group"
                      >
                        <span>{stripHtml(current.ctaText) || "GET A QUOTE"}</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Horizontal Carousel Indicator Bars */}
            <div className="flex items-center gap-2.5 mt-6 px-4 sm:px-2">
              {steps.map((_: any, idx: number) => {
                const isCurrent = idx === active;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => go(idx)}
                    aria-label={`Go to step ${idx + 1}`}
                    className="py-2 focus:outline-none transition-all"
                  >
                    <span
                      className={`block h-[3.5px] rounded-full transition-all duration-400 ${
                        isCurrent
                          ? "w-10 bg-gold shadow-[0_0_12px_rgba(200,154,69,0.8)]"
                          : "w-7 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
