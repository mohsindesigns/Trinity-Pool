"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function CtaBanner() {
  const { ctaBanner } = useContent();

  const {
    label,
    tagline,
    title,
    description,
    button,
    buttonUrl,
    btnUrl,
    phone,
    image,
  } = ctaBanner || {};

  const badge = stripHtml(label || tagline || "GET IN TOUCH");
  const heading = stripHtml(title || "Ready to Optimize Your Oilfield Operations?");
  const body = stripHtml(description || "Get in touch with Trinity Pump & Supply today for high-quality downhole pumps and oilfield supplies. Let us help you reduce operational costs and improve efficiency.");
  const ctaText = stripHtml(button || "Contact Us");
  const href = btnUrl || buttonUrl || "/contact-us/";
  const isExternal = /^https?:\/\//i.test(href);
  const phoneText = stripHtml(phone || "");

  return (
    <section id="cta" className="bg-white py-16 md:py-24">
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-[#0c1219] text-white p-8 sm:p-12 lg:p-14 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        >
          {/* Background image (optional, from CMS) */}
          {image && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.25] pointer-events-none"
              style={{ backgroundImage: `url(${image})` }}
            />
          )}

          {/* Depth gradient & ambient gold radial light */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1219] via-[#0c1219]/90 to-[#0c1219]/70 pointer-events-none" />
          <div
            className="absolute -top-32 -right-24 w-[450px] h-[450px] rounded-full pointer-events-none opacity-25 blur-[100px]"
            style={{ background: "radial-gradient(circle, #C89A45 0%, transparent 70%)" }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* ── Left Column: Headline & Description ── */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-3.5">
                <span className="w-6 h-[2px] bg-gradient-to-r from-gold to-gold/40" />
                <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-gold">
                  {badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="display-heading text-[28px] sm:text-[34px] md:text-[40px] leading-[1.14] text-white tracking-tight mb-4">
                {heading}
              </h2>

              {/* Description */}
              {body && (
                <p className="text-white/70 text-[14.5px] sm:text-[15.5px] leading-[1.75] font-light max-w-xl">
                  {body}
                </p>
              )}
            </div>

            {/* ── Right Column: CTA Button & Phone Pill ── */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
              {/* Main Action Button */}
              {isExternal ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-pill text-[14px] sm:text-[15px] px-8 py-3.5 shadow-xl hover:shadow-[0_8px_25px_rgba(200,154,69,0.45)] inline-flex items-center gap-2 group"
                >
                  <span>{ctaText}</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              ) : (
                <Link
                  href={href}
                  className="btn-gold-pill text-[14px] sm:text-[15px] px-8 py-3.5 shadow-xl hover:shadow-[0_8px_25px_rgba(200,154,69,0.45)] inline-flex items-center gap-2 group"
                >
                  <span>{ctaText}</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}

              {/* Phone Number Pill */}
              {phoneText && (
                <a
                  href={`tel:${phoneText.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 hover:border-gold/50 text-white/85 hover:text-white transition-all duration-300 text-[13.5px] font-medium backdrop-blur-md group shadow-sm"
                >
                  <span className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors flex-shrink-0">
                    <Phone size={13} strokeWidth={2.2} />
                  </span>
                  <span className="tracking-wide font-semibold">{phoneText}</span>
                </a>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
