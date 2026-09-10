"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";
import { Icon } from "../config/icons";

const CARDS_PER_PAGE = 4;

export default function ServicesSection() {
  const { services: servicesContent } = useContent();
  const {
    label,
    title,
    description,
    ctaAll,
    ctaAllUrl,
    items: allServices = [], // curated in the Home editor; falls back to all published services
  } = servicesContent || {};

  const [page, setPage] = useState(0);

  // Group services into pages of 4 (2x2 grid per page) — becomes a slider
  // automatically once there are more than 4 services.
  const pages = useMemo(() => {
    const list = Array.isArray(allServices) ? allServices : [];
    const chunks: any[][] = [];
    for (let i = 0; i < list.length; i += CARDS_PER_PAGE) {
      chunks.push(list.slice(i, i + CARDS_PER_PAGE));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [allServices]);

  const totalPages = pages.length;
  const isSlider = totalPages > 1;

  const goTo = (idx: number) => setPage((idx + totalPages) % totalPages);

  return (
    <section id="services" className="relative bg-white py-20 md:py-28 overflow-hidden border-t border-border-light/40">
      {/* Subtle decorative dot pattern, top-left */}
      <div
        className="bg-radial-dots-gold absolute top-0 left-0 w-[360px] h-[360px] opacity-[0.14] pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(circle at top left, black, transparent 70%)",
          maskImage: "radial-gradient(circle at top left, black, transparent 70%)",
        }}
      />

      <div className="site-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-12 lg:gap-16 items-center">

          {/* ── Left: Section Intro ── */}
          <div className="flex flex-col">
            <p className="section-label mb-4">{stripHtml(label) || "Our Services"}</p>
            <h2 className="display-heading text-[30px] min-[400px]:text-[34px] md:text-[38px] text-dark leading-[1.2] mb-5">
              {stripHtml(title)}
            </h2>
            <p className="text-dark/55 text-[14.5px] leading-[1.75] font-light mb-8 max-w-[420px]">
              {stripHtml(typeof description === "string" ? description : "")}
            </p>
            <Link href={ctaAllUrl || "/services/"} className="btn-gold-pill w-fit">
              <span>{ctaAll || "View All Services"}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* ── Right: Service Cards (slider when > 4) ── */}
          <div className="w-full min-w-0">
            {/* Clip the horizontal slide only. overflow-x:'clip' (unlike
                'hidden') does NOT force the y-axis into a clipping scroll
                container, so hover shadows/lift on the cards stay fully
                visible with no padding/margin hacks needed. */}
            <div style={{ overflowX: "clip", overflowY: "visible" }}>
              <motion.div
                className="flex"
                animate={{ x: `-${page * 100}%` }}
                transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                {pages.map((group, pIdx) => (
                  <div
                    key={pIdx}
                    className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-7 auto-rows-fr p-6"
                  >
                    {group.map((svc: any, i: number) => (
                      <Link
                        key={svc.slug || `${pIdx}-${i}`}
                        href={`/${svc.slug}/`}
                        className="group relative flex flex-col bg-white rounded-2xl p-6 pb-14 border border-border-light will-change-transform shadow-[0_2px_10px_rgba(7,27,28,0.05)] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-[0_18px_38px_-12px_rgba(200,154,69,0.4)]"
                      >
                        {/* Top accent bar, sweeps in on hover (scaled, not width-clipped — avoids corner artifacts) */}
                        <span className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />

                        <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-gold group-hover:scale-105">
                          <Icon
                            name={svc.icon || "Wrench"}
                            className="h-6 w-6 text-gold transition-colors duration-300 group-hover:text-white"
                            strokeWidth={1.7}
                          />
                        </div>

                        <h3 className="text-[15.5px] font-bold text-dark mb-1.5 leading-snug transition-colors duration-300 group-hover:text-gold-dark">
                          {stripHtml(svc.title || svc.name)}
                        </h3>
                        <p className="text-dark/50 text-[12.5px] leading-[1.6] font-light">
                          {stripHtml(svc.description)}
                        </p>

                        <span className="absolute bottom-5 right-5 h-9 w-9 rounded-full border border-gold/30 flex items-center justify-center text-gold transition-all duration-300 group-hover:bg-gold group-hover:border-gold group-hover:text-white group-hover:translate-x-0.5">
                          <ArrowRight size={15} />
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {isSlider && (
              <div className="flex items-center justify-between mt-7">
                <div className="flex items-center gap-2">
                  {pages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => goTo(dotIdx)}
                      aria-label={`Go to services page ${dotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${dotIdx === page ? "w-6 bg-gold" : "w-1.5 bg-border-light hover:bg-gold/50"
                        }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => goTo(page - 1)}
                    aria-label="Previous services"
                    className="h-10 w-10 rounded-full border border-border-light flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-all duration-200"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    onClick={() => goTo(page + 1)}
                    aria-label="Next services"
                    className="h-10 w-10 rounded-full border border-border-light flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-all duration-200"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
