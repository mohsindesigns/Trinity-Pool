"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

export default function BlogCard({
  href,
  image,
  imageAlt,
  category,
  title,
  excerpt,
  date,
  readTime,
  ctaText = "Read More",
}: {
  href: string;
  image: string;
  imageAlt?: string;
  category?: string;
  title: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  ctaText?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col bg-white rounded-2xl border border-border-light overflow-hidden shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-24px_rgba(200,154,69,0.4)]"
    >
      <div className="relative h-[200px] w-full overflow-hidden bg-warm-cream flex-shrink-0">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <span className="absolute top-4 left-4 bg-gold text-dark text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        {(date || readTime) && (
          <div className="flex items-center gap-4 text-[12px] text-dark/50 mb-3">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} className="text-gold" /> {date}
              </span>
            )}
            {readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} className="text-gold" /> {readTime}
              </span>
            )}
          </div>
        )}
        <h3 className="text-[16px] font-bold text-dark leading-snug mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-gold-dark">
          {title}
        </h3>
        {excerpt && (
          <p className="text-dark/55 text-[13px] leading-[1.65] font-light line-clamp-2 mb-5">
            {excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-dark group-hover:text-gold-dark transition-colors duration-300">
          {ctaText}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
