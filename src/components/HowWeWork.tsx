"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";
import { Icon } from "../config/icons";

const AUTOPLAY_MS = 5000;

export default function HowItWorksSection() {
  const { process } = useContent();
  const { label, title, description, phaseLabel, items = [] } = process || {};
  const stepWord = stripHtml(phaseLabel || "Step");
  const steps: any[] = Array.isArray(items) ? items : [];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // restarts the progress bar animation

  const go = useCallback((i: number) => {
    setActive(((i % steps.length) + steps.length) % steps.length);
    setCycle((c) => c + 1);
  }, [steps.length]);

  useEffect(() => {
    if (steps.length < 2 || paused) return;
    const id = window.setInterval(() => go(active + 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, paused, steps.length, go]);

  if (steps.length === 0) return null;

  const numberOf = (step: any, i: number) => String(step.step || step.id || i + 1).padStart(2, "0");
  const current = steps[active] || steps[0];

  return (
    <section id="process" className="relative bg-dark text-white py-16 md:py-24 overflow-x-clip">
      {/* CMS background image (optional), kept faint under a navy gradient */}
      {process?.image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.22] pointer-events-none"
            style={{ backgroundImage: `url(${process.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/85 to-dark pointer-events-none" />
        </>
      )}
      <div
        className="absolute -top-40 left-[-10%] w-[620px] h-[620px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.2) 0%, rgba(200,154,69,0) 62%)" }}
      />
      <div
        className="bg-radial-dots-gold absolute bottom-0 right-0 w-[460px] h-[460px] opacity-[0.14] pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(circle at bottom right, black, transparent 70%)",
          maskImage: "radial-gradient(circle at bottom right, black, transparent 70%)",
        }}
      />

      <div className="site-container relative">
        <div
          className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {/* ── Left: intro + step list ── */}
          <div>
            <p className="section-label mb-3">{stripHtml(label) || "Our Process"}</p>
            <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[40px] leading-[1.12] text-white mb-4">
              {stripHtml(title) || "How We Work"}
            </h2>
            {description && (
              <p className="text-white/60 text-[14.5px] leading-[1.75] font-light max-w-lg mb-10">
                {stripHtml(description)}
              </p>
            )}

            <ol className="relative flex flex-col">
              {/* vertical rail */}
              <span className="absolute left-[23px] top-6 bottom-6 w-px bg-white/10" />
              {steps.map((step: any, i: number) => {
                const isActive = i === active;
                return (
                  <li key={i}>
                    <button
                      onClick={() => go(i)}
                      className="group relative w-full flex items-center gap-5 py-3.5 text-left"
                    >
                      <span
                        className={`relative z-10 h-12 w-12 rounded-full flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 ring-[6px] ring-dark transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-dark shadow-[0_8px_20px_rgba(200,154,69,0.4)] scale-105"
                            : "bg-white/[0.06] text-white/60 border border-white/10 group-hover:border-gold/50 group-hover:text-gold"
                        }`}
                      >
                        {numberOf(step, i)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[16px] font-bold leading-snug transition-colors duration-300 ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                          {stripHtml(step.title)}
                        </span>
                        {/* Description under the title on mobile only (panel is hidden there) */}
                        <span className="lg:hidden block text-white/55 text-[13px] leading-[1.65] font-light mt-1">
                          {stripHtml(step.description)}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        className={`hidden lg:block flex-shrink-0 text-gold transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0"}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ── Right: active step panel (desktop) ── */}
          <div className="hidden lg:block">
            <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-gold/60 via-white/10 to-transparent">
              <div className="relative rounded-[27px] bg-dark-2 overflow-hidden min-h-[440px] flex flex-col">
                <div
                  className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(200,154,69,0.25) 0%, rgba(200,154,69,0) 62%)" }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex-1 p-10 xl:p-12 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-gold">
                        {stepWord} {numberOf(current, active)} <span className="text-gold/50">/ {String(steps.length).padStart(2, "0")}</span>
                      </span>
                      <span className="text-[72px] leading-none font-black text-[rgba(255,255,255,0.05)] select-none">
                        {numberOf(current, active)}
                      </span>
                    </div>

                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-dark flex items-center justify-center shadow-[0_14px_30px_rgba(200,154,69,0.35)] mb-8">
                      <Icon name={current.icon || "ClipboardList"} className="h-9 w-9" strokeWidth={1.8} />
                    </div>

                    <h3 className="display-heading text-[28px] xl:text-[32px] text-white leading-[1.15] mb-4">
                      {stripHtml(current.title)}
                    </h3>
                    <p className="text-white/65 text-[15px] leading-[1.8] font-light max-w-md">
                      {stripHtml(current.description)}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress bar (autoplay) */}
                {steps.length > 1 && (
                  <div className="relative h-1 bg-white/10">
                    <motion.div
                      key={`${active}-${cycle}-${paused}`}
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
                      initial={{ width: "0%" }}
                      animate={{ width: paused ? "0%" : "100%" }}
                      transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
