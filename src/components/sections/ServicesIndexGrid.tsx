"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import { stripHtml } from "@/lib/utils";
import { Icon } from "@/config/icons";

/** Cursor-following spotlight: sets CSS vars the card's overlay reads. Same recipe as the homepage Services grid. */
function useSpotlight() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  }, []);
}

function ServiceCard({ svc, index, spotlight, spanClass, learnMore, onMove }: { svc: any; index: number; spotlight: boolean; spanClass: string; learnMore: string; onMove: any }) {
  const number = String(index + 1).padStart(2, "0");
  const hasImage = spotlight && !!svc.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={spanClass}
    >
      <Link
        href={`/${svc.slug}/`}
        onMouseMove={onMove}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 md:p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 ${
          spotlight
            ? "bg-dark text-white shadow-[0_30px_60px_-30px_rgba(7,27,28,0.6)] min-h-[280px]"
            : "bg-white text-dark border border-border-light/80 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] hover:border-gold/50 hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.5)]"
        }`}
        style={{ ["--sx" as any]: "50%", ["--sy" as any]: "50%" }}
      >
        {hasImage && (
          <>
            <Image
              src={svc.image}
              alt={stripHtml(svc.title || svc.name)}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
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

        <span
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: spotlight
              ? "radial-gradient(420px circle at var(--sx) var(--sy), rgba(200,154,69,0.28), transparent 45%)"
              : "radial-gradient(360px circle at var(--sx) var(--sy), rgba(200,154,69,0.16), transparent 45%)",
          }}
        />
        {!spotlight && (
          <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-inset ring-gold group-hover:ring-1 transition-[box-shadow] duration-500" />
        )}

        {spotlight && !hasImage && (
          <>
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

        <span
          className={`pointer-events-none absolute right-6 top-4 select-none text-[72px] leading-none font-black transition-colors duration-500 ${
            spotlight ? "text-[rgba(255,255,255,0.06)] group-hover:text-[rgba(200,154,69,0.16)]" : "text-[rgba(7,27,28,0.04)] group-hover:text-[rgba(200,154,69,0.16)]"
          }`}
        >
          {number}
        </span>

        <div className="relative flex items-start justify-between mb-6">
          <span
            className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-[0_12px_24px_-8px_rgba(200,154,69,0.55)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${
              spotlight ? "h-14 w-14" : "h-12 w-12"
            }`}
          >
            <Icon name={svc.icon || "Wrench"} className={spotlight ? "h-6 w-6" : "h-5 w-5"} strokeWidth={1.8} />
          </span>
          <span className={`text-[11px] font-bold tracking-[0.22em] ${spotlight ? "text-gold" : "text-dark/30 group-hover:text-gold-dark"} transition-colors`}>
            {number}
          </span>
        </div>

        <div className="relative flex-1">
          <h3
            className={`font-bold leading-snug mb-2 transition-colors duration-300 ${
              spotlight ? "display-heading text-[22px] md:text-[24px] text-white" : "text-[16px] text-dark group-hover:text-gold-dark"
            }`}
          >
            {stripHtml(svc.title || svc.name)}
          </h3>
          <p className={`text-[13px] leading-[1.65] font-light ${spotlight ? "text-white/70 max-w-md" : "text-dark/55"}`}>
            {stripHtml(svc.description)}
          </p>
        </div>

        <span className={`relative mt-6 inline-flex items-center gap-2.5 text-[12.5px] font-semibold ${spotlight ? "text-gold-light" : "text-gold-dark"}`}>
          <span
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              spotlight ? "bg-gold text-dark group-hover:bg-gold-light" : "border border-gold/40 text-gold-dark group-hover:bg-gold group-hover:border-gold group-hover:text-white"
            }`}
          >
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {learnMore}
        </span>
      </Link>
    </motion.div>
  );
}

/**
 * Full-catalogue services grid for the /services/ index page, using the
 * same light "bento card" visual language as the homepage's Services
 * component (src/components/Services.tsx) -- white section background,
 * mostly-white cards with one dark "spotlight" card per group, gold
 * accents, watermark numbers. Replaces the old all-dark sticky-scroll
 * list so this page matches the rest of the site instead of standing
 * apart from it.
 *
 * Items are grouped by category (artificial-lift / projects-supplies) so
 * a 14-item catalogue still reads as organized sections rather than one
 * long undifferentiated grid.
 */
export default function ServicesIndexGrid() {
  const { services: servicesData } = useContent();
  const rawItems = (servicesData?.services && Array.isArray(servicesData.services) && servicesData.services.length > 0)
    ? servicesData.services
    : (servicesData?.items || []);

  const items = rawItems.filter((s: any) => s.status === "published" || s.status === undefined);
  const onMove = useSpotlight();
  const learnMore = "Learn more";

  if (items.length === 0) return null;

  const groups: { key: string; label: string; items: any[] }[] = [
    { key: "artificial-lift", label: "Artificial Lift", items: items.filter((s: any) => s.category === "artificial-lift") },
    { key: "projects-supplies", label: "Projects & Supplies", items: items.filter((s: any) => s.category === "projects-supplies") },
  ];
  const uncategorized = items.filter((s: any) => s.category !== "artificial-lift" && s.category !== "projects-supplies");
  if (uncategorized.length > 0) groups.push({ key: "other", label: "More Services", items: uncategorized });

  return (
    <section className="relative bg-white py-16 md:py-24 overflow-x-clip border-t border-border-light/40">
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

      <div className="site-container relative space-y-16 md:space-y-20">
        {groups.filter((g) => g.items.length > 0).map((group) => (
          <div key={group.key}>
            <div className="mb-8 md:mb-10 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-gold-dark flex-shrink-0" />
              <h2 className="display-heading text-[24px] md:text-[30px] text-dark leading-tight">{group.label}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((svc: any, i: number) => {
                const total = group.items.length;
                const featured = i === 0;
                // Stretch the last card to fill whatever's left in its row instead of
                // leaving it stranded alone next to empty column tracks.
                const isLast = i === total - 1 && !featured;
                const spotlight = featured || isLast;
                const lgSpan = isLast ? 3 - (total % 3 || 3) + (total % 3 === 0 ? 3 : 0) : 1;
                const mdSpan = isLast && (total - 1) % 2 === 1 ? 2 : 1;
                const spanClass = [
                  featured ? "md:col-span-2 lg:col-span-2" : "",
                  isLast && mdSpan === 2 ? "md:col-span-2" : "",
                  isLast && lgSpan === 2 ? "lg:col-span-2" : "",
                  isLast && lgSpan === 3 ? "lg:col-span-3" : "",
                ].join(" ");
                return (
                  <ServiceCard key={svc.slug || i} svc={svc} index={i} spotlight={spotlight} spanClass={spanClass} learnMore={learnMore} onMove={onMove} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
