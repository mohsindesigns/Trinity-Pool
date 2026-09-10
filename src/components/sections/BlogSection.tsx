"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CalendarDays } from "lucide-react";
import { normalizeBlogImage } from "@/lib/blogImage";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  excerpt?: string;
  publishedAt?: string;
  createdAt?: string;
  date?: string;
  author?: string | { name: string };
  categories?: string[];
  tags?: string[];
  category?: string;
}

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  ctaAll?: string;
  ctaReadMore?: string;
  posts?: BlogPost[];
  viewAllLink?: string;
}

const GAP_PX = 24;
const AUTOPLAY_MS = 5000;
const SLIDE_MS = 550;

function formatDate(raw?: string) {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogSection({
  title = "Insights & Industry Updates",
  subtitle = "Latest News",
  ctaAll = "View All Articles",
  ctaReadMore = "Read More",
  posts = [],
  viewAllLink = "/blogs/",
}: BlogSectionProps) {
  const n = posts.length;
  const loop = n > 1;
  // Infinite loop: three copies, index kept inside the middle copy.
  const track = loop ? [...posts, ...posts, ...posts] : posts;

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

  useEffect(() => { setPos(n); }, [n]);

  const step = useCallback((dir: 1 | -1) => {
    if (!loop || busyRef.current) return;
    busyRef.current = true;
    setAnimate(true);
    setPos((p) => p + dir);
    window.setTimeout(() => { busyRef.current = false; }, SLIDE_MS);
  }, [loop]);

  const handleTransitionEnd = () => {
    if (!loop) return;
    if (pos >= n * 2) { setAnimate(false); setPos(pos - n); }
    else if (pos < n) { setAnimate(false); setPos(pos + n); }
  };

  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  useEffect(() => {
    if (!loop || paused) return;
    const id = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [loop, paused, step]);

  if (n === 0) return null;

  return (
    <section id="blog" className="relative bg-white py-14 md:py-20 border-t border-border-light/40">
      <div className="site-container">

        {/* ── Header ── */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="section-label mb-3">{subtitle}</p>
            <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[38px] text-dark leading-[1.12]">
              {title}
            </h2>
          </div>

          <div
            className="flex items-center gap-4 flex-shrink-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <Link
              href={viewAllLink}
              className="nav-link group hidden sm:inline-flex items-center gap-2 text-dark text-[13px] font-semibold hover:text-gold-dark transition-colors duration-200"
            >
              {ctaAll}
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {loop && (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous articles"
                  className="h-10 w-10 rounded-full border border-border-light bg-white flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-all duration-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => step(1)}
                  aria-label="Next articles"
                  className="h-10 w-10 rounded-full border border-border-light bg-white flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-all duration-200"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Cards carousel ── */}
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
            {track.map((post, i) => {
              const cleanExcerpt = (post.excerpt || "").replace(/<[^>]*>?/gm, "").trim();
              const date = formatDate(post.publishedAt || post.date || post.createdAt);
              const postUrl = `/blogs/${post.slug}/`;

              return (
                <article
                  key={`${post._id}-${i}`}
                  className="group relative flex flex-col bg-white rounded-2xl border border-border-light overflow-hidden shadow-[0_2px_10px_rgba(7,27,28,0.05)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_18px_36px_-14px_rgba(200,154,69,0.42)]"
                  style={{ flex: `0 0 calc((100% - ${GAP_PX * (per - 1)}px) / ${per})` }}
                >
                  <Link href={postUrl} className="nav-link flex flex-col flex-1 text-dark">
                    <div className="relative h-[190px] w-full overflow-hidden bg-warm-cream">
                      {post.featuredImage ? (
                        <Image
                          src={normalizeBlogImage(post.featuredImage)}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ArrowRight size={28} className="text-gold/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      {date && (
                        <span className="inline-flex items-center gap-1.5 text-[12px] text-dark/50 mb-3">
                          <CalendarDays size={14} className="text-gold" />
                          {date}
                        </span>
                      )}
                      <h3 className="text-[16px] font-bold text-dark leading-snug mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-gold-dark">
                        {post.title}
                      </h3>
                      {cleanExcerpt && (
                        <p className="text-dark/55 text-[13px] leading-[1.65] font-light line-clamp-2 mb-5">
                          {cleanExcerpt}
                        </p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-dark group-hover:text-gold-dark transition-colors duration-300">
                        {ctaReadMore}
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        {/* Mobile "view all" (header link is hidden on small screens to make room for arrows) */}
        <div className="sm:hidden mt-7 text-center">
          <Link href={viewAllLink} className="nav-link inline-flex items-center gap-2 text-dark text-[13px] font-semibold hover:text-gold-dark transition-colors">
            {ctaAll} <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
