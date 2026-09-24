"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { stripHtml } from "../../lib/utils";

/* Optional content blocks for service-detail pages. Every block returns null
   when its data is empty, so pages that don't use them are unchanged. */

interface SectionHeader {
  label?: string;
  title1?: string;
  title2?: string;
  description?: string;
}

const TONE_BG: Record<string, string> = {
  white: "bg-white",
  light: "bg-brand-bg-light",
  dark: "bg-dark",
};

function Header({ h, dark }: { h: SectionHeader; dark: boolean }) {
  if (!h.label && !h.title1 && !h.title2 && !h.description) return null;
  return (
    <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
      {h.label && (
        <div className="inline-flex items-center gap-3 mb-3.5">
          <span className={`w-6 h-[1px] ${dark ? "bg-gold" : "bg-gold-dark"}`} />
          <p className={`section-label ${dark ? "text-gold" : "text-gold-dark"}`}>{stripHtml(h.label)}</p>
          <span className={`w-6 h-[1px] ${dark ? "bg-gold" : "bg-gold-dark"}`} />
        </div>
      )}
      {(h.title1 || h.title2) && (
        <h2 className={`font-display font-medium text-[32px] min-[400px]:text-[40px] md:text-[50px] leading-[1.08] tracking-tight mb-4 ${dark ? "text-white" : "text-dark"}`}>
          {h.title1}{" "}
          {h.title2 && <span className={`${dark ? "text-gold" : "text-gold-dark"} font-medium block sm:inline`}>{h.title2}</span>}
        </h2>
      )}
      {h.description && (
        <p className={`text-[15px] md:text-[16.5px] font-light leading-relaxed max-w-2xl mx-auto ${dark ? "text-white/70" : "text-dark/70"}`}>
          {h.description}
        </p>
      )}
    </div>
  );
}

/* ── Product cards: each links to its own page ─────────────────────────── */
export function ProductSections({ sections }: { sections?: any[] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;
  return (
    <>
      {sections.map((sec, si) => {
        const cards: any[] = Array.isArray(sec.cards) ? sec.cards : [];
        if (cards.length === 0) return null;
        const tone = sec.tone && TONE_BG[sec.tone] ? sec.tone : si % 2 === 0 ? "light" : "white";
        const cols = cards.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";
        return (
          <section key={si} className={`py-20 md:py-28 ${TONE_BG[tone]} border-b border-border-light`}>
            <div className="site-container">
              <Header h={sec} dark={false} />
              <div className={`grid grid-cols-1 ${cols} gap-6 lg:gap-8 max-w-5xl mx-auto`}>
                {cards.map((c, i) => {
                  const href = c.href || "#";
                  const external = /^https?:\/\//i.test(href);
                  const Wrapper: any = external ? "a" : Link;
                  const wrapperProps = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
                  return (
                    <Wrapper
                      key={i}
                      {...wrapperProps}
                      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-border-light/80 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] hover:border-gold/50 hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.5)] hover:-translate-y-1.5 transition-all duration-300"
                    >
                      {c.image && (
                        <div className="relative aspect-[4/3] overflow-hidden bg-dark">
                          <img
                            src={c.image}
                            alt={stripHtml(c.title || "")}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {c.badge && (
                            <span style={{ background: "rgba(7,27,28,0.88)" }} className="absolute top-4 left-4 backdrop-blur-md border border-white/15 text-gold text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full">
                              {c.badge}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-7">
                        <h3 className="font-display font-medium text-[24px] leading-tight text-dark group-hover:text-gold-dark transition-colors mb-2.5">
                          {stripHtml(c.title || "")}
                        </h3>
                        <p className="text-dark/60 text-[14px] leading-[1.7] font-light flex-1">{c.description}</p>
                        {Array.isArray(c.points) && c.points.length > 0 && (
                          <ul className="mt-4 space-y-1.5">
                            {c.points.map((p: string, pi: number) => (
                              <li key={pi} className="flex items-start gap-2 text-[13px] text-dark/70">
                                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gold-dark flex-shrink-0" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        )}
                        <span className="mt-6 inline-flex items-center gap-2.5 text-[12.5px] font-semibold text-gold-dark">
                          <span className="h-8 w-8 rounded-full border border-gold/40 flex items-center justify-center group-hover:bg-gold group-hover:border-gold group-hover:text-white transition-all duration-300">
                            <ArrowUpRight size={14} />
                          </span>
                          {c.cta || "View details"}
                        </span>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ── Fact tiles on a dark ink section (numbers, comparisons, proof) ────── */
export function FactSections({ sections }: { sections?: any[] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;
  return (
    <>
      {sections.map((sec, si) => {
        const tiles: any[] = Array.isArray(sec.tiles) ? sec.tiles : [];
        if (tiles.length === 0) return null;
        const dark = sec.tone !== "light";
        return (
          <section key={si} className={`relative overflow-hidden py-20 md:py-28 border-b ${dark ? "bg-dark border-border-dark" : "bg-brand-bg-light border-border-light"}`}>
            {dark && (
              <div
                className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(200,154,69,0.16) 0%, rgba(200,154,69,0) 68%)" }}
              />
            )}
            <div className="site-container relative z-10">
              <Header h={sec} dark={dark} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                {tiles.map((t, i) => {
                  const isCompare = t.from && t.to;
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl p-7 border ${isCompare ? "sm:col-span-2 lg:col-span-2" : ""} ${
                        dark ? "bg-white/[0.04] border-white/10" : "bg-white border-border-light"
                      }`}
                    >
                      {isCompare ? (
                        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
                          <div>
                            <p className={`display-heading text-[38px] leading-none ${dark ? "text-white/60" : "text-dark/50"}`}>{t.from}</p>
                            {t.fromLabel && <p className={`text-[11px] font-semibold tracking-[0.12em] uppercase mt-2 ${dark ? "text-white/45" : "text-dark/45"}`}>{t.fromLabel}</p>}
                          </div>
                          <ArrowRight className="text-gold mb-3 flex-shrink-0" size={26} />
                          <div>
                            <p className="display-heading text-[46px] leading-none text-gold">{t.to}</p>
                            {t.toLabel && <p className={`text-[11px] font-semibold tracking-[0.12em] uppercase mt-2 ${dark ? "text-white/70" : "text-dark/70"}`}>{t.toLabel}</p>}
                          </div>
                          {t.unit && <p className={`w-full text-[12.5px] font-light ${dark ? "text-white/55" : "text-dark/55"}`}>{t.unit}</p>}
                        </div>
                      ) : (
                        <>
                          <p className="display-heading text-[40px] md:text-[46px] leading-none text-gold mb-3">{t.value}</p>
                          <p className={`text-[12px] font-bold tracking-[0.12em] uppercase mb-2 ${dark ? "text-white" : "text-dark"}`}>{t.label}</p>
                          {t.note && <p className={`text-[13px] font-light leading-relaxed ${dark ? "text-white/55" : "text-dark/60"}`}>{t.note}</p>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              {sec.footnote && (
                <p className={`max-w-4xl mx-auto mt-10 text-center text-[12.5px] leading-relaxed font-light ${dark ? "text-white/50" : "text-dark/55"}`}>
                  {sec.footnote}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ── Full-width infographic (never cropped) ────────────────────────────── */
export function InfographicBlock({ data }: { data?: any }) {
  if (!data || !data.src) return null;
  return (
    <section className="py-20 md:py-28 bg-white border-b border-border-light">
      <div className="site-container">
        <Header h={data} dark={false} />
        <figure className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden border border-border-light shadow-[0_30px_70px_-30px_rgba(7,27,28,0.45)] bg-dark">
            <img src={data.src} alt={data.alt || ""} width={data.w} height={data.h} className="w-full h-auto block" loading="lazy" decoding="async" />
          </div>
          {data.caption && (
            <figcaption className="mt-4 text-center text-[12.5px] text-dark/55 font-light">{data.caption}</figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
