"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";
import { Icon } from "../config/icons";

/* Cursor-following spotlight: sets CSS vars the card's overlay reads. */
function useSpotlight() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  }, []);
}

export default function ServicesSection() {
  const { services: servicesContent } = useContent();
  const {
    label,
    title,
    description,
    ctaAll,
    ctaAllUrl,
    ctaLearnMore,
    items = [], // curated in the Home editor; falls back to all published services
    services: allServices = [],
  } = servicesContent || {};

  const curated: any[] = Array.isArray(items) ? items : [];
  const list: any[] = curated.length > 0 ? curated : (Array.isArray(allServices) ? allServices : []);
  const learnMore = stripHtml(ctaLearnMore || "") || "Learn more";
  const onMove = useSpotlight();

  if (list.length === 0) return null;

  return (
    <section id="services" className="relative bg-white py-16 md:py-24 overflow-x-clip border-t border-border-light/40">
      {/* Ambient texture */}
      <div
        className="bg-radial-dots-gold absolute top-0 right-0 w-[520px] h-[520px] opacity-[0.16] pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(circle at top right, black, transparent 70%)",
          maskImage: "radial-gradient(circle at top right, black, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -left-32 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.12) 0%, rgba(200,154,69,0) 65%)" }}
      />

      <div className="site-container relative">

        {/* ── Header ── */}
        <div className="mb-12 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
          <div className="max-w-2xl">
            <p className="section-label mb-3">{stripHtml(label) || "Our Services"}</p>
            <h2 className="display-heading text-[30px] min-[400px]:text-[34px] md:text-[42px] text-dark leading-[1.1]">
              {stripHtml(title)}
            </h2>
          </div>
          <div className="max-w-md lg:text-right flex flex-col lg:items-end gap-5">
            <p className="text-dark/55 text-[14.5px] leading-[1.75] font-light">
              {stripHtml(typeof description === "string" ? description : "")}
            </p>
            <Link href={ctaAllUrl || "/services/"} className="btn-gold-pill w-fit">
              <span>{ctaAll || "View All Services"}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((svc: any, i: number) => {
            const featured = i === 0;
            const number = String(i + 1).padStart(2, "0");
            const isLast = i === list.length - 1 && !featured;
            // Both the first and the last tile get the premium dark "spotlight" treatment.
            const spotlight = featured || isLast;
            // The feature tile spans 2 of 3 columns; stretch the last tile so no row is left with a gap.
            const lgSpan = isLast ? 3 - (list.length % 3 || 3) + (list.length % 3 === 0 ? 3 : 0) : 1;
            const mdSpan = isLast && (list.length - 1) % 2 === 1 ? 2 : 1;
            const spanClass = [
              featured ? "md:col-span-2 lg:col-span-2" : "",
              isLast && mdSpan === 2 ? "md:col-span-2" : "",
              isLast && lgSpan === 2 ? "lg:col-span-2" : "",
              isLast && lgSpan === 3 ? "lg:col-span-3" : "",
            ].join(" ");
            const hasImage = spotlight && !!svc.image;

            return (
              <motion.div
                key={svc.slug || i}
                className={spanClass}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/${svc.slug}/`}
                  onMouseMove={onMove}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 ${
                    spotlight
                      ? "bg-dark text-white shadow-[0_30px_60px_-30px_rgba(7,27,28,0.6)] min-h-[300px]"
                      : "bg-white text-dark border border-border-light/80 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] hover:border-gold/50 hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.5)]"
                  }`}
                  style={{ ["--sx" as any]: "50%", ["--sy" as any]: "50%" }}
                >
                  {/* Background photo (spotlight cards with an image set) */}
                  {hasImage && (
                    <>
                      <Image
                        src={svc.image}
                        alt={stripHtml(svc.title || svc.name)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority={featured}
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      {/* Left-to-right darkening (same recipe as the hero) keeps icon/title/description/button legible over the photo */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to right, #071B1C 0%, #071B1C 32%, rgba(7,27,28,0.86) 52%, rgba(7,27,28,0.25) 74%, rgba(7,27,28,0.05) 100%)",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-dark/30" />
                    </>
                  )}

                  {/* Cursor spotlight */}
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: spotlight
                        ? "radial-gradient(420px circle at var(--sx) var(--sy), rgba(200,154,69,0.28), transparent 45%)"
                        : "radial-gradient(360px circle at var(--sx) var(--sy), rgba(200,154,69,0.16), transparent 45%)",
                    }}
                  />
                  {/* Gold ring on hover (white cards) */}
                  {!spotlight && (
                    <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-inset ring-gold group-hover:ring-1 transition-[box-shadow] duration-500" />
                  )}

                  {spotlight && !hasImage && (
                    <>
                      {/* Gold glow + concentric rings — decorative fallback when no photo is set */}
                      <span
                        className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.35) 0%, rgba(200,154,69,0) 62%)" }}
                      />
                      <svg className="pointer-events-none absolute -right-16 -bottom-16 w-[360px] h-[360px] opacity-[0.12]" viewBox="0 0 400 400" fill="none">
                        {[60, 110, 160, 200].map((r) => (
                          <circle key={r} cx="200" cy="200" r={r} stroke="#E8C87A" strokeWidth="1" />
                        ))}
                      </svg>
                    </>
                  )}

                  {/* Watermark number */}
                  <span
                    className={`pointer-events-none absolute right-6 top-4 select-none text-[84px] leading-none font-black transition-colors duration-500 ${
                      spotlight ? "text-[rgba(255,255,255,0.06)] group-hover:text-[rgba(200,154,69,0.16)]" : "text-[rgba(7,27,28,0.04)] group-hover:text-[rgba(200,154,69,0.16)]"
                    }`}
                  >
                    {number}
                  </span>

                  {/* Content */}
                  <div className="relative flex items-start justify-between mb-7">
                    <span
                      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-[0_12px_24px_-8px_rgba(200,154,69,0.55)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${
                        spotlight ? "h-16 w-16" : "h-14 w-14"
                      }`}
                    >
                      <Icon name={svc.icon || "Wrench"} className={spotlight ? "h-7 w-7" : "h-6 w-6"} strokeWidth={1.8} />
                    </span>
                    <span className={`text-[11px] font-bold tracking-[0.22em] ${spotlight ? "text-gold" : "text-dark/30 group-hover:text-gold-dark"} transition-colors`}>
                      {number}
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <h3
                      className={`font-bold leading-snug mb-2.5 transition-colors duration-300 ${
                        spotlight ? "display-heading text-[24px] md:text-[28px] text-white" : "text-[17px] text-dark group-hover:text-gold-dark"
                      }`}
                    >
                      {stripHtml(svc.title || svc.name)}
                    </h3>
                    <p className={`text-[13.5px] leading-[1.7] font-light ${spotlight ? "text-white/70 max-w-md md:text-[15px]" : "text-dark/55"}`}>
                      {stripHtml(svc.description)}
                    </p>
                  </div>

                  <span className={`relative mt-7 inline-flex items-center gap-2.5 text-[13px] font-semibold ${spotlight ? "text-gold-light" : "text-gold-dark"}`}>
                    <span
                      className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        spotlight ? "bg-gold text-dark group-hover:bg-gold-light" : "border border-gold/40 text-gold-dark group-hover:bg-gold group-hover:border-gold group-hover:text-white"
                      }`}
                    >
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    {learnMore}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
