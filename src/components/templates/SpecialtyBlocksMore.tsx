"use client";

import { ProductSections, FactSections, InfographicBlock } from "./SpecialtyBlocks";

/* More optional content blocks for service-detail pages (spec/architecture,
   figures with numbered steps, a native line chart) plus PageBlocks, which
   renders any mix of blocks in the exact order a page lists them. */

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

function Header({ h }: { h: SectionHeader }) {
  if (!h.label && !h.title1 && !h.title2 && !h.description) return null;
  return (
    <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
      {h.label && (
        <div className="inline-flex items-center gap-3 mb-3.5">
          <span className="w-6 h-[1px] bg-gold-dark" />
          <p className="section-label text-gold-dark">{h.label}</p>
          <span className="w-6 h-[1px] bg-gold-dark" />
        </div>
      )}
      {(h.title1 || h.title2) && (
        <h2 className="font-display font-medium text-[32px] min-[400px]:text-[40px] md:text-[50px] leading-[1.08] tracking-tight mb-4 text-dark">
          {h.title1}{" "}
          {h.title2 && <span className="text-gold-dark font-medium block sm:inline">{h.title2}</span>}
        </h2>
      )}
      {h.description && (
        <p className="text-[15px] md:text-[16.5px] font-light leading-relaxed max-w-2xl mx-auto text-dark/70">{h.description}</p>
      )}
    </div>
  );
}

/* ── Spec / architecture: labelled diagram beside a component list ─────── */
export function SpecSections({ sections }: { sections?: any[] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;
  return (
    <>
      {sections.map((sec, si) => {
        const list: any[] = Array.isArray(sec.list) ? sec.list : [];
        const rows: any[] = Array.isArray(sec.rows) ? sec.rows : [];
        const notes: any[] = Array.isArray(sec.notes) ? sec.notes : [];
        const tone = sec.tone && TONE_BG[sec.tone] ? sec.tone : "light";
        return (
          <section key={si} className={`py-20 md:py-28 ${TONE_BG[tone]} border-b border-border-light`}>
            <div className="site-container">
              <Header h={sec} />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto items-start">
                {sec.figure?.src && (
                  <div className="lg:col-span-4">
                    <figure className="rounded-3xl overflow-hidden border border-border-light shadow-[0_20px_50px_-28px_rgba(7,27,28,0.4)] bg-white max-w-[340px] mx-auto lg:max-w-none">
                      <img src={sec.figure.src} alt={sec.figure.alt || ""} width={sec.figure.w} height={sec.figure.h} className="w-full h-auto block" loading="lazy" decoding="async" />
                    </figure>
                  </div>
                )}
                <div className={sec.figure?.src ? "lg:col-span-8" : "lg:col-span-12"}>
                  {list.length > 0 && (
                    <div className="space-y-3 mb-8">
                      {list.map((it, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-4 rounded-xl px-4 py-3 border ${
                            it.highlight ? "bg-[#fbf3e3] border-gold/40" : "bg-white border-border-light"
                          }`}
                        >
                          {it.key && (
                            <span
                              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold ${
                                it.highlight ? "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white" : "bg-dark/10 text-dark/70"
                              }`}
                            >
                              {it.key}
                            </span>
                          )}
                          <span className={`text-[14.5px] ${it.highlight ? "font-semibold text-dark" : "text-dark/75"}`}>{it.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {sec.callout && (
                    <div className="rounded-2xl bg-dark p-6 md:p-7 mb-8 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        {sec.callout.label && <p className="section-label mb-2">{sec.callout.label}</p>}
                        {sec.callout.big && <p className="display-heading text-white text-[34px] leading-none">{sec.callout.big}</p>}
                      </div>
                      {sec.callout.text && <p className="text-white/70 text-[14px] font-light max-w-[240px] sm:text-right">{sec.callout.text}</p>}
                    </div>
                  )}
                  {rows.length > 0 && (
                    <div className="mb-2">
                      {sec.rowsTitle && <p className="text-dark/45 text-[11px] font-bold tracking-[0.22em] uppercase mb-3">{sec.rowsTitle}</p>}
                      <dl>
                        {rows.map((r, i) => (
                          <div key={i} className="flex flex-wrap gap-x-6 gap-y-1 py-3.5 border-b border-border-light">
                            <dt className="w-28 flex-shrink-0 text-gold-dark text-[12px] font-bold tracking-[0.14em] uppercase">{r.label}</dt>
                            <dd className="text-dark text-[14.5px]">{r.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </div>
              {notes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto mt-10">
                  {notes.map((n, i) => (
                    <div key={i} className="rounded-2xl bg-[#fbf3e3] border border-gold/25 p-6">
                      <p className="text-gold-dark text-[12px] font-bold tracking-[0.16em] uppercase mb-2">{n.title}</p>
                      <p className="text-dark/75 text-[14.5px] leading-relaxed font-light">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ── Figures (never cropped), optional numbered points / result / chips ── */
export function FigureSections({ sections }: { sections?: any[] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;
  return (
    <>
      {sections.map((sec, si) => {
        const figures: any[] = Array.isArray(sec.figures) ? sec.figures : [];
        const points: any[] = Array.isArray(sec.points) ? sec.points : [];
        const chips: string[] = Array.isArray(sec.chips) ? sec.chips : [];
        if (figures.length === 0 && points.length === 0) return null;
        const tone = sec.tone && TONE_BG[sec.tone] ? sec.tone : si % 2 === 0 ? "white" : "light";
        const figureNodes = figures.map((f, i) => (
          <figure key={i} className="rounded-3xl overflow-hidden border border-border-light bg-white shadow-[0_20px_50px_-30px_rgba(7,27,28,0.4)]">
            <img src={f.src} alt={f.alt || ""} width={f.w} height={f.h} className="w-full h-auto block" loading="lazy" decoding="async" />
            {f.caption && (
              <figcaption className="px-5 py-3.5 text-[13px] leading-relaxed text-dark/65 font-light border-t border-border-light bg-white">{f.caption}</figcaption>
            )}
          </figure>
        ));
        return (
          <section key={si} className={`py-20 md:py-28 ${TONE_BG[tone]} border-b border-border-light`}>
            <div className="site-container">
              <Header h={sec} />
              {points.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
                  <div className={`${figures.length ? "lg:col-span-7" : "lg:col-span-12"} space-y-5`}>
                    {points.map((p, i) => (
                      <div key={i} className="flex gap-5 rounded-2xl bg-white border border-border-light p-6 shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)]">
                        <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white font-bold flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(200,154,69,0.55)]">
                          {p.num || String(i + 1)}
                        </span>
                        <div>
                          <h3 className="text-dark font-bold text-[16px] tracking-wide uppercase mb-1.5">{p.title}</h3>
                          <p className="text-dark/65 text-[14.5px] leading-[1.75] font-light">{p.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {figures.length > 0 && <div className="lg:col-span-5 space-y-5">{figureNodes}</div>}
                </div>
              ) : (
                <div className={`grid grid-cols-1 ${figures.length > 1 ? "md:grid-cols-2" : ""} gap-6 max-w-5xl mx-auto items-start`}>{figureNodes}</div>
              )}
              {sec.result && (
                <div className="max-w-6xl mx-auto mt-8 rounded-2xl bg-dark p-7 md:p-8">
                  {sec.result.label && <p className="section-label mb-2">{sec.result.label}</p>}
                  {sec.result.title && <p className="display-heading text-white text-[26px] md:text-[30px] leading-tight mb-2">{sec.result.title}</p>}
                  {sec.result.text && <p className="text-white/70 text-[14.5px] font-light leading-relaxed max-w-2xl">{sec.result.text}</p>}
                </div>
              )}
              {chips.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {chips.map((c, i) => (
                    <span key={i} className="rounded-full border border-gold/50 bg-white px-4 py-2 text-[11.5px] font-bold tracking-[0.14em] uppercase text-gold-dark">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {sec.tagline && (
                <p className="max-w-6xl mx-auto mt-8 rounded-2xl bg-dark px-7 py-5 text-gold font-display text-[20px] md:text-[24px]">{sec.tagline}</p>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ── Simple native line chart (crisp in any theme, scrolls on phones) ──── */
export function ChartSections({ sections }: { sections?: any[] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;
  return (
    <>
      {sections.map((sec, si) => {
        const series: any[] = Array.isArray(sec.series) ? sec.series.filter((s: any) => Array.isArray(s.points) && s.points.length > 1) : [];
        if (series.length === 0) return null;
        const tone = sec.tone && TONE_BG[sec.tone] ? sec.tone : "white";
        const W = 900, H = 430, L = 70, R = 40, T = 40, B = 70;
        const xs: number[] = series.flatMap((s) => s.points.map((p: number[]) => p[0]));
        const ys: number[] = series.flatMap((s) => s.points.map((p: number[]) => p[1]));
        const xMin = Math.min(...xs), xMax = Math.max(...xs);
        const yTicks: number[] = Array.isArray(sec.yTicks) && sec.yTicks.length ? sec.yTicks : [0, Math.ceil(Math.max(...ys) / 2), Math.ceil(Math.max(...ys))];
        const yMax = Math.max(...yTicks, Math.max(...ys));
        const px = (x: number) => L + ((x - xMin) / (xMax - xMin)) * (W - L - R);
        const py = (y: number) => H - B - (y / yMax) * (H - T - B);
        const xTicks = Array.from(new Set(xs)).sort((a, b) => a - b);
        return (
          <section key={si} className={`py-20 md:py-28 ${TONE_BG[tone]} border-b border-border-light`}>
            <div className="site-container">
              <Header h={sec} />
              <div className="max-w-5xl mx-auto rounded-3xl border border-border-light bg-white p-4 md:p-8 shadow-[0_20px_50px_-30px_rgba(7,27,28,0.35)]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
                  <p className="text-dark font-bold text-[13px] tracking-[0.12em] uppercase">{sec.chartTitle}</p>
                  <div className="flex items-center gap-5">
                    {series.map((s, i) => (
                      <span key={i} className="flex items-center gap-2 text-[12px] font-semibold text-dark/70">
                        <span className="inline-block w-7 h-[4px] rounded-full" style={{ background: s.color }} />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[640px] w-full h-auto" role="img" aria-label={sec.chartTitle || "Chart"}>
                    {yTicks.map((t, i) => (
                      <g key={i}>
                        <line x1={L} x2={W - R} y1={py(t)} y2={py(t)} stroke="#DDD9CE" strokeWidth="1" />
                        <text x={L - 10} y={py(t) + 4} textAnchor="end" fontSize="13" fill="#6b7476">{t.toLocaleString()}</text>
                      </g>
                    ))}
                    {xTicks.map((t, i) => (
                      <g key={i}>
                        <line x1={px(t)} x2={px(t)} y1={T} y2={H - B} stroke="#EEEBE2" strokeWidth="1" />
                        <text x={px(t)} y={H - B + 22} textAnchor="middle" fontSize="13" fill="#6b7476">{t}</text>
                      </g>
                    ))}
                    {sec.yLabel && <text x={L} y={T - 16} fontSize="12" fontWeight="700" fill="#6b7476">{sec.yLabel}</text>}
                    {sec.xLabel && <text x={(L + W - R) / 2} y={H - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill="#6b7476">{sec.xLabel}</text>}
                    {series.map((s, k) => (
                      <g key={k}>
                        <polyline fill="none" stroke={s.color} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" points={s.points.map((p: number[]) => `${px(p[0])},${py(p[1])}`).join(" ")} />
                        {s.points.map((p: number[], i: number) => (
                          <circle key={i} cx={px(p[0])} cy={py(p[1])} r="5" fill={s.color} stroke="#fff" strokeWidth="2" />
                        ))}
                        {(s.labelAt || []).map((lx: number) => {
                          const pt = s.points.find((p: number[]) => p[0] === lx);
                          if (!pt) return null;
                          return (
                            <text key={lx} x={px(pt[0])} y={py(pt[1]) - 14} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={s.color}>
                              {pt[1].toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </text>
                          );
                        })}
                      </g>
                    ))}
                  </svg>
                </div>
                {Array.isArray(sec.notes) && sec.notes.length > 0 && (
                  <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2 px-1">
                    {sec.notes.map((n: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-dark/65 font-light">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gold-dark flex-shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {sec.footnote && <p className="max-w-4xl mx-auto mt-8 text-center text-[12.5px] leading-relaxed font-light text-dark/55">{sec.footnote}</p>}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ── Ordered blocks: one list, rendered in the order given ─────────────── */
export function PageBlocks({ blocks }: { blocks?: any[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  return (
    <>
      {blocks.map((b, i) => {
        switch (b?.type) {
          case "products": return <ProductSections key={i} sections={[b]} />;
          case "facts": return <FactSections key={i} sections={[b]} />;
          case "chart": return <ChartSections key={i} sections={[b]} />;
          case "spec": return <SpecSections key={i} sections={[b]} />;
          case "figures": return <FigureSections key={i} sections={[b]} />;
          case "infographic": return <InfographicBlock key={i} data={b} />;
          default: return null;
        }
      })}
    </>
  );
}
