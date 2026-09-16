"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { stripHtml } from "../../lib/utils";

const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });

export default function ContactTemplate({ pageData }: { pageData?: any }) {
  const { contactPage, globalMetadata, footer } = useContent();

  const header = contactPage?.header || {};
  const badge = stripHtml(header.badge || "GET IN TOUCH");
  const headline = header.headline || "Let's Talk Oilfield Supply.";
  const description = stripHtml(
    header.description ||
      "Questions about a part, a quote, or your next job? Call our Odessa shop or send us a message and we'll get right back to you."
  );
  const heroImage = header.image || "/images/trinity/about.jpg";
  const heroImageAlt = header.imageAlt || "Trinity Pump & Supply";
  const bookingUrl = globalMetadata?.bookingUrl || "/contact-us/";
  // Real business phone — single source of truth is the shared footer contact
  // info (editable from Home editor → Contact & FAQs), never hardcoded here.
  const phone = footer?.contact?.phone || "830-279-3996";
  const ctaText = header.ctaText || `Call ${phone}`;
  const ctaUrl = header.ctaUrl || `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const ctaSecondaryText = header.ctaSecondaryText || "Send a Message";
  const ctaSecondaryUrl = header.ctaSecondaryUrl || "#contact-support";

  return (
    <main className="w-full bg-off-white text-body overflow-hidden">
      {/* ════════════════════════════════════════════════════════
         HERO
         ════════════════════════════════════════════════════════ */}
      <section className="relative bg-dark min-h-[55vh] flex items-center pt-[130px] pb-14 border-b border-border-dark overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
        </div>

        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="site-container relative z-10 w-full text-left">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/60 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg"
            >
              <Link href="/" className="hover:text-gold transition-colors text-white/80">
                Home
              </Link>
              <span className="text-gold/50">/</span>
              <span className="text-gold font-medium">Contact Us</span>
            </nav>
          </div>

          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
              <p className="section-label text-gold">{badge}</p>
            </div>

            <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[68px] text-white leading-[1.08] mb-6 tracking-tight">
              {headline}
            </h1>

            <p className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-9 font-light">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a href={ctaUrl} className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4">
                {ctaText} <ArrowRight size={14} className="ml-1" />
              </a>
              <a href={ctaSecondaryUrl} className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4">
                {ctaSecondaryText} <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         CONTACT FORM + FAQ — the shared component used sitewide, so
         the form, business phone/email/address and FAQ are all a
         single source of truth instead of a separate bespoke form.
         ════════════════════════════════════════════════════════ */}
      <QAForm pageData={pageData} />
    </main>
  );
}
