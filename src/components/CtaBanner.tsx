"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
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
    email,
    image,
  } = ctaBanner || {};

  const badge = stripHtml(label || tagline || "Get in Touch");
  const heading = stripHtml(title || "Ready to Get Started?");
  const body = stripHtml(description || "");
  const ctaText = stripHtml(button || "Request a Quote");
  const href = btnUrl || buttonUrl || "/contact-us/";
  const isExternal = /^https?:\/\//i.test(href);
  const phoneText = stripHtml(phone || "");
  const emailText = stripHtml(email || "");

  return (
    <section id="cta" className="bg-white py-14 md:py-20">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-dark text-white px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
        >
          {/* Background image (optional, from CMS) */}
          {image && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
              style={{ backgroundImage: `url(${image})` }}
            />
          )}
          {/* Depth gradient + gold glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/70" />
          <div
            className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(200,154,69,0.28) 0%, rgba(200,154,69,0) 65%)" }}
          />
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-light via-gold to-gold-dark" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-14 items-center">

            {/* ── Text ── */}
            <div className="max-w-2xl">
              <p className="section-label mb-3">{badge}</p>
              <h2 className="display-heading text-[26px] min-[400px]:text-[30px] md:text-[36px] leading-[1.15] text-white mb-3">
                {heading}
              </h2>
              {body && (
                <p className="text-white/65 text-[14.5px] leading-[1.75] font-light max-w-xl">
                  {body}
                </p>
              )}
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-col items-start lg:items-end gap-5">
              {isExternal ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="btn-gold-pill text-[14px] px-7 py-3.5">
                  <span>{ctaText}</span>
                  <ArrowRight size={16} />
                </a>
              ) : (
                <Link href={href} className="btn-gold-pill text-[14px] px-7 py-3.5">
                  <span>{ctaText}</span>
                  <ArrowRight size={16} />
                </Link>
              )}

              {(phoneText || emailText) && (
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 sm:gap-5">
                  {phoneText && (
                    <a
                      href={`tel:${phoneText.replace(/[^0-9+]/g, "")}`}
                      className="nav-link group inline-flex items-center gap-2.5 text-white/85 hover:text-gold transition-colors"
                    >
                      <span className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                        <Phone size={14} />
                      </span>
                      <span className="text-[13.5px] font-semibold">{phoneText}</span>
                    </a>
                  )}
                  {emailText && (
                    <a
                      href={`mailto:${emailText}`}
                      className="nav-link group inline-flex items-center gap-2.5 text-white/85 hover:text-gold transition-colors"
                    >
                      <span className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                        <Mail size={14} />
                      </span>
                      <span className="text-[13.5px] font-semibold">{emailText}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
