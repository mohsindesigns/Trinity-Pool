"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

const GAP_PX = 24;
const AUTOPLAY_MS = 4500;
const SLIDE_MS = 550;

function Avatar({ src, name }: { src?: string; name: string }) {
  // Show initials immediately; swap to the photo only once it has loaded.
  const [loaded, setLoaded] = useState(false);
  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <span className="relative h-11 w-11 rounded-full ring-2 ring-white shadow-sm flex-shrink-0 overflow-hidden bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white text-[13px] font-bold flex items-center justify-center">
      {!loaded && (initials || "•")}
      {src && (
        <img
          src={src}
          alt={name}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}

export default function TestimonialsSection() {
  const { testimonials } = useContent();
  const {
    label,
    title,
    title1,
    title2,
    items = [],
  } = testimonials || {};

  const base: any[] = (Array.isArray(items) ? items : []).map((t: any) => ({
    quote: t.quote || t.text || "",
    author: t.author || t.name || "",
    role: t.role || t.position || "",
    avatar: t.avatar || t.image || "",
  }));

  const heading = title || [title1, title2].filter(Boolean).join(" ") || "What Our Clients Say";

  // Infinite loop: render three copies and keep the index inside the middle copy.
  const n = base.length;
  const loop = n > 1;
  const track = loop ? [...base, ...base, ...base] : base;

  const [per, setPer] = useState(3);
  const [pos, setPos] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    const update = () => setPer(mqLg.matches ? 3 : mqSm.matches ? 2 : 1);
    update();
    mqLg.addEventListener("change", update);
    mqSm.addEventListener("change", update);
    return () => {
      mqLg.removeEventListener("change", update);
      mqSm.removeEventListener("change", update);
    };
  }, []);

  // Keep pos inside the middle copy if the item count changes.
  useEffect(() => { setPos(n); }, [n]);

  const step = useCallback((dir: 1 | -1) => {
    if (!loop || busyRef.current) return;
    busyRef.current = true;
    setAnimate(true);
    setPos((p) => p + dir);
    window.setTimeout(() => { busyRef.current = false; }, SLIDE_MS);
  }, [loop]);

  // After a slide, silently re-center into the middle copy when we've drifted out of it.
  const handleTransitionEnd = () => {
    if (!loop) return;
    if (pos >= n * 2) {
      setAnimate(false);
      setPos(pos - n);
    } else if (pos < n) {
      setAnimate(false);
      setPos(pos + n);
    }
  };

  // Re-enable the transition on the frame after a silent jump.
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // Autoplay
  useEffect(() => {
    if (!loop || paused) return;
    const id = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [loop, paused, step]);

  if (n === 0) return null;

  return (
    <section id="testimonials" className="relative bg-white py-14 md:py-20 border-t border-border-light/40">
      <div className="site-container relative">

        {/* ── Header ── */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="section-label mb-3">{stripHtml(label) || "Testimonials"}</p>
            <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[38px] text-dark leading-[1.12]">
              {stripHtml(heading)}
            </h2>
          </div>

          {loop && (
            <div
              className="flex items-center gap-2.5 flex-shrink-0"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <button
                onClick={() => step(-1)}
                aria-label="Previous testimonials"
                className="h-10 w-10 rounded-full border border-border-light bg-white flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-all duration-200"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next testimonials"
                className="h-10 w-10 rounded-full border border-border-light bg-white flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-all duration-200"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── Cards slider ── */}
        <div
          style={{ overflowX: "clip", overflowY: "visible" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex"
            onTransitionEnd={handleTransitionEnd}
            style={{
              gap: `${GAP_PX}px`,
              transform: `translateX(calc(-${pos} * (100% + ${GAP_PX}px) / ${per}))`,
              transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none",
            }}
          >
            {track.map((t, i) => (
              <article
                key={i}
                className="group relative flex flex-col bg-white rounded-2xl border border-border-light p-7 shadow-[0_2px_10px_rgba(7,27,28,0.05)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_18px_36px_-14px_rgba(200,154,69,0.42)]"
                style={{ flex: `0 0 calc((100% - ${GAP_PX * (per - 1)}px) / ${per})` }}
              >
                <Quote size={26} className="text-gold mb-4 fill-gold" strokeWidth={0} />
                <p className="text-dark/75 text-[14.5px] leading-[1.7] mb-7 flex-1 flex items-center">
                  {stripHtml(t.quote)}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-border-light/70">
                  <Avatar src={t.avatar} name={t.author} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-dark leading-tight truncate">{stripHtml(t.author)}</p>
                    {t.role && (
                      <p className="text-[12px] text-dark/50 leading-tight mt-0.5 truncate">{stripHtml(t.role)}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
