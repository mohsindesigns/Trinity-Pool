"use client";

import { useState } from "react";
import { Send, ArrowRight, ShieldCheck, Clock, Plus, Minus, Phone, Mail, MapPin, CheckCircle2, ChevronDown, User, MessageSquare, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

interface QAFormProps {
  pageData?: any;
}

const fieldWrap = "group relative";
const iconWrap = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark/35 group-focus-within:text-gold transition-colors";
const inputClass =
  "w-full bg-warm-cream/50 border border-border-light rounded-xl pl-11 pr-4 py-3.5 text-dark text-[14px] placeholder:text-dark/35 " +
  "focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/10 focus:outline-none transition-all duration-200";
const labelClass = "block text-dark/70 text-[12px] font-semibold tracking-wide mb-2";

export default function ContactFaqSection({ pageData }: QAFormProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { contactFaq, footer } = useContent();

  const {
    faqLabel = "FAQ",
    faqTitle = "Frequently Asked Questions",
    faqDescription = "",
    faqCtaText = "",
    panelPhoneLabel = "Call us",
    panelEmailLabel = "Email us",
    panelAddressLabel = "Visit us",
    formLabel = "Get in Touch",
    formTitle = "Have Questions? Let's Connect.",
    formDescription = "",
    formClinicPortal = "",
    formClinicPortalSub = "",
    formStyleSeatBtn = "",
    formClinicPortalUrl = "",
    formNameLabel = "Full Name",
    formNamePlaceholder = "Your name",
    formEmailLabel = "Email Address",
    formEmailPlaceholder = "you@company.com",
    formPhoneLabel = "Phone Number",
    formPhonePlaceholder = "Your phone number",
    formServiceLabel = "Service",
    formServicePlaceholder = "Select a service",
    formMessageLabel = "Message",
    formMessagePlaceholder = "Tell us what you need...",
    formBtnSubmit = "Send Message",
    formBtnSuccess = "Message Sent",
    formSuccessToast = "Thank you! Your message has been sent.",
    trustHipa = "",
    trustResponse = "",
    formServicesOptions = [],
    faqs = []
  } = contactFaq || {};

  /* Page-specific FAQ overrides (unchanged behaviour) */
  const rawPageFaqs: any[] = (() => {
    if (Array.isArray(pageData?.faq) && pageData.faq.length > 0) return pageData.faq;
    if (Array.isArray(pageData?.faqs) && pageData.faqs.length > 0) return pageData.faqs;
    if (Array.isArray(pageData?.data?.faq) && pageData.data.faq.length > 0) return pageData.data.faq;
    if (Array.isArray(pageData?.data?.faqs) && pageData.data.faqs.length > 0) return pageData.data.faqs;
    if (Array.isArray(pageData?.content?.faq) && pageData.content.faq.length > 0) return pageData.content.faq;
    if (Array.isArray(pageData?.content?.faqs) && pageData.content.faqs.length > 0) return pageData.content.faqs;
    if (Array.isArray(pageData?.content?.faq?.items) && pageData.content.faq.items.length > 0) return pageData.content.faq.items;
    if (Array.isArray(pageData?.content?.data?.faq) && pageData.content.data.faq.length > 0) return pageData.content.data.faq;
    if (Array.isArray(pageData?.content?.data?.faqs) && pageData.content.data.faqs.length > 0) return pageData.content.data.faqs;
    return [];
  })();

  const activeFaqs = rawPageFaqs.length > 0
    ? rawPageFaqs
        .filter((f: any) => f && (f.q || f.question || f.title || f.a || f.answer || f.desc || f.description))
        .map((f: any) => ({ q: f.q || f.question || f.title || "", a: f.a || f.answer || f.desc || f.description || "" }))
    : (Array.isArray(faqs) ? faqs : []);

  const activeFaqLabel =
    pageData?.faqBadge || pageData?.data?.faqBadge || pageData?.content?.faqBadge || pageData?.content?.data?.faqBadge ||
    pageData?.content?.faq?.section?.badge || pageData?.content?.faq?.badge || faqLabel;

  const activeFaqTitle =
    pageData?.faqTitle || pageData?.data?.faqTitle || pageData?.content?.faqTitle || pageData?.content?.data?.faqTitle ||
    pageData?.content?.faq?.section?.headline || pageData?.content?.faq?.section?.title || pageData?.content?.faq?.title || faqTitle;

  const activeFaqDescription =
    pageData?.faqDescription || pageData?.data?.faqDescription || pageData?.content?.faqDescription || pageData?.content?.data?.faqDescription ||
    pageData?.content?.faq?.section?.description || pageData?.content?.faq?.description || faqDescription || "";

  /* Contact details (Settings → Contact) */
  const contact = footer?.contact || {};
  const phoneText = stripHtml(contact.phone || "");
  const emailText = stripHtml(contact.email || "");
  const addressText = stripHtml((contact.address || "").replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/i, ""));

  /* Call banner link: CMS URL → phone found in the banner text → contact phone */
  const bannerHref = (() => {
    if (formClinicPortalUrl) return formClinicPortalUrl;
    const fromText = `${formStyleSeatBtn} ${formClinicPortalSub}`.match(/\+?\d[\d\s().-]{6,}\d/);
    const phone = fromText ? fromText[0] : phoneText;
    return phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : "";
  })();
  const showBanner = !!(formClinicPortal || formClinicPortalSub) && !!bannerHref;

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    } catch (err) {
      console.error("Submission error:", err);
    }
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    }, 3500);
  };

  return (
    <section id="contact-support" className="relative bg-warm-cream py-16 md:py-24 border-t border-border-light/40 overflow-x-clip">
      <div
        className="absolute -top-40 right-[-10%] w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.14) 0%, rgba(200,154,69,0) 65%)" }}
      />

      <div className="site-container relative">

        {/* ═══ Contact card ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] rounded-[28px] overflow-hidden bg-white shadow-[0_30px_80px_-40px_rgba(7,27,28,0.45)]"
        >
          {/* gold top edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light z-10" />

          {/* ── Info panel ── */}
          <div className="relative bg-dark text-white p-8 sm:p-10 lg:p-12 flex flex-col overflow-hidden">
            <div
              className="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(200,154,69,0.3) 0%, rgba(200,154,69,0) 62%)" }}
            />
            <div
              className="bg-radial-dots-gold absolute bottom-0 left-0 w-[300px] h-[300px] opacity-[0.14] pointer-events-none"
              style={{ WebkitMaskImage: "radial-gradient(circle at bottom left, black, transparent 70%)", maskImage: "radial-gradient(circle at bottom left, black, transparent 70%)" }}
            />

            <div className="relative">
              <p className="section-label mb-3">{stripHtml(formLabel)}</p>
              <h2 className="display-heading text-[26px] min-[400px]:text-[30px] md:text-[34px] leading-[1.15] text-white mb-4">
                {stripHtml(formTitle)}
              </h2>
              {formDescription && (
                <p className="text-white/60 text-[14.5px] leading-[1.75] font-light mb-8">{stripHtml(formDescription)}</p>
              )}

              {(phoneText || emailText || addressText) && (
                <ul className="flex flex-col gap-3 mb-8">
                  {phoneText && (
                    <li>
                      <a href={`tel:${phoneText.replace(/[^0-9+]/g, "")}`} className="nav-link group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 hover:border-gold/50 hover:bg-white/[0.07] transition-all">
                        <span className="h-10 w-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:text-dark transition-colors"><Phone size={16} /></span>
                        <span className="min-w-0">
                          <span className="block text-[11px] uppercase tracking-[0.16em] text-white/45 font-semibold">{stripHtml(panelPhoneLabel)}</span>
                          <span className="block text-[14.5px] font-semibold text-white truncate">{phoneText}</span>
                        </span>
                        <ArrowRight size={15} className="ml-auto text-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  )}
                  {emailText && (
                    <li>
                      <a href={`mailto:${emailText}`} className="nav-link group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 hover:border-gold/50 hover:bg-white/[0.07] transition-all">
                        <span className="h-10 w-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:text-dark transition-colors"><Mail size={16} /></span>
                        <span className="min-w-0">
                          <span className="block text-[11px] uppercase tracking-[0.16em] text-white/45 font-semibold">{stripHtml(panelEmailLabel)}</span>
                          <span className="block text-[14.5px] font-semibold text-white truncate">{emailText}</span>
                        </span>
                        <ArrowRight size={15} className="ml-auto text-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  )}
                  {addressText && (
                    <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                      <span className="h-10 w-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center flex-shrink-0"><MapPin size={16} /></span>
                      <span className="min-w-0">
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-white/45 font-semibold">{stripHtml(panelAddressLabel)}</span>
                        <span className="block text-[14.5px] font-semibold text-white whitespace-pre-line">{addressText}</span>
                      </span>
                    </li>
                  )}
                </ul>
              )}

              {showBanner && (
                <a href={bannerHref} className="nav-link group block rounded-2xl bg-gradient-to-br from-gold-dark via-gold to-gold-light p-[1px]">
                  <span className="block rounded-[15px] bg-dark p-5 group-hover:bg-dark-3 transition-colors">
                    {formClinicPortal && <span className="block text-gold text-[11px] font-bold tracking-[0.18em] uppercase mb-1">{stripHtml(formClinicPortal)}</span>}
                    {formClinicPortalSub && <span className="block text-white/85 text-[14px] leading-snug mb-4">{stripHtml(formClinicPortalSub)}</span>}
                    {formStyleSeatBtn && (
                      <span className="btn-gold-pill text-[13px] px-5 py-2.5">
                        <span>{stripHtml(formStyleSeatBtn)}</span>
                        <ArrowRight size={14} />
                      </span>
                    )}
                  </span>
                </a>
              )}
            </div>

            {(trustHipa || trustResponse) && (
              <div className="relative mt-auto pt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[12.5px] text-white/60">
                {trustHipa && <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-gold" />{stripHtml(trustHipa)}</span>}
                {trustResponse && <span className="flex items-center gap-2"><Clock size={15} className="text-gold" />{stripHtml(trustResponse)}</span>}
              </div>
            )}
          </div>

          {/* ── Form ── */}
          <div className="relative p-8 sm:p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelClass}>{stripHtml(formNameLabel)}</label>
                  <div className={fieldWrap}>
                    <span className={iconWrap}><User size={16} /></span>
                    <input id="name" type="text" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={stripHtml(formNamePlaceholder)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>{stripHtml(formPhoneLabel)}</label>
                  <div className={fieldWrap}>
                    <span className={iconWrap}><Phone size={16} /></span>
                    <input id="phone" type="tel" required value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={stripHtml(formPhonePlaceholder)} className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>{stripHtml(formEmailLabel)}</label>
                <div className={fieldWrap}>
                  <span className={iconWrap}><Mail size={16} /></span>
                  <input id="email" type="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={stripHtml(formEmailPlaceholder)} className={inputClass} />
                </div>
              </div>

              {formServicesOptions.length > 0 && (
                <div>
                  <label htmlFor="service" className={labelClass}>{stripHtml(formServiceLabel)}</label>
                  <div className={fieldWrap}>
                    <span className={iconWrap}><Briefcase size={16} /></span>
                    <select id="service" required value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className={inputClass + " appearance-none cursor-pointer pr-10"}>
                      <option value="" disabled>{stripHtml(formServicePlaceholder)}</option>
                      {formServicesOptions.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-dark/40"><ChevronDown size={16} /></span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className={labelClass}>{stripHtml(formMessageLabel)}</label>
                <div className={fieldWrap}>
                  <span className="pointer-events-none absolute left-4 top-4 text-dark/35 group-focus-within:text-gold transition-colors"><MessageSquare size={16} /></span>
                  <textarea id="message" rows={5} value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={stripHtml(formMessagePlaceholder)} className={inputClass + " resize-none"} />
                </div>
              </div>

              <button type="submit" disabled={submitted} className="btn-gold-pill justify-center w-full py-4 text-[14px] mt-1 disabled:opacity-80">
                {submitted ? (
                  <><CheckCircle2 size={16} /><span>{stripHtml(formBtnSuccess)}</span></>
                ) : (
                  <><span>{stripHtml(formBtnSubmit)}</span><Send size={15} /></>
                )}
              </button>
            </form>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute inset-x-8 bottom-8 rounded-xl bg-dark text-white text-[13px] font-medium px-5 py-4 flex items-center gap-3 shadow-[0_18px_36px_-14px_rgba(7,27,28,0.5)]"
                >
                  <CheckCircle2 size={18} className="text-gold flex-shrink-0" />
                  <span>{stripHtml(formSuccessToast)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ═══ FAQ ═══ */}
        {activeFaqs.length > 0 && (
          <div className="mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="section-label mb-3">{stripHtml(activeFaqLabel)}</p>
              <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[38px] text-dark leading-[1.12] mb-4">
                {stripHtml(activeFaqTitle)}
              </h2>
              {activeFaqDescription && (
                <p className="text-dark/55 text-[14.5px] leading-[1.75] font-light mb-6">{stripHtml(activeFaqDescription)}</p>
              )}
              {faqCtaText && (phoneText || emailText) && (
                <a
                  href={emailText ? `mailto:${emailText}` : `tel:${phoneText.replace(/[^0-9+]/g, "")}`}
                  className="btn-gold-pill text-[13px] px-5 py-3"
                >
                  <span>{stripHtml(faqCtaText)}</span>
                  <ArrowRight size={15} />
                </a>
              )}
            </div>

            {/* Accordion: one white card, items separated by hairlines, open item gets a gold rail + tinted band */}
            <div className="rounded-3xl bg-white border border-border-light shadow-[0_24px_60px_-40px_rgba(7,27,28,0.35)] overflow-hidden divide-y divide-border-light/70">
              {activeFaqs.map((faq: any, i: number) => {
                const isOpen = openIdx === i;
                return (
                  <div key={i} className={`relative transition-colors duration-300 ${isOpen ? "bg-gold/[0.05]" : "hover:bg-warm-cream/50"}`}>
                    {/* left rail */}
                    <span className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gold-light via-gold to-gold-dark transition-transform duration-300 origin-top ${isOpen ? "scale-y-100" : "scale-y-0"}`} />

                    <button
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full text-left flex items-start gap-5 px-6 sm:px-7 py-5 focus:outline-none"
                    >
                      <span className={`mt-0.5 text-[12px] font-bold tracking-[0.18em] flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-gold-dark" : "text-dark/35"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`flex-1 text-[15.5px] md:text-[16px] font-semibold leading-snug transition-colors duration-300 ${isOpen ? "text-dark" : "text-dark/80"}`}
                        dangerouslySetInnerHTML={{ __html: faq.q }}
                      />
                      <span className={`relative h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-gold text-white rotate-180" : "bg-gold/10 text-gold"}`}>
                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-6 sm:px-7 pb-6 pl-[64px] sm:pl-[68px] text-dark/65 text-[14px] leading-[1.75] font-light prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.a }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
