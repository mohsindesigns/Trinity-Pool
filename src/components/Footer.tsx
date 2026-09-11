"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { useContentContext } from "../context/ContentContext";
import { stripHtml } from "../lib/utils";

/* ── Brand lockup (mirrors the navbar) ─────────────────── */
function FooterBrand({
  logoUrl, siteTitle, text1, text2,
}: { logoUrl?: string; siteTitle?: string; text1: string; text2: string }) {
  const hasImage = !!logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("/uploads") || logoUrl.startsWith("/cdn-images") || logoUrl.startsWith("/images"));
  return (
    <Link href="/" className="nav-link inline-flex items-center gap-3 mb-5">
      {hasImage ? (
        <span className="relative h-11 w-11 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src={logoUrl} alt={siteTitle || text1} className="object-contain w-full h-full" />
        </span>
      ) : (
        <span className="h-11 w-11 flex items-center justify-center flex-shrink-0">
          <svg width="100%" height="100%" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L38 9.5V23.5C38 33.2 31.2 39.6 22 42C12.8 39.6 6 33.2 6 23.5V9.5L22 2Z" stroke="var(--color-gold, #C89A45)" strokeWidth="1.75" fill="none" />
            <path d="M22 13C26.5 19.5 30 24.2 30 27.5C30 32.19 26.42 36 22 36C17.58 36 14 32.19 14 27.5C14 24.2 17.5 19.5 22 13Z" fill="var(--color-gold, #C89A45)" />
          </svg>
        </span>
      )}
      <span className="flex flex-col leading-none">
        {text1 && <span className="text-[17px] font-extrabold tracking-wide text-white uppercase whitespace-nowrap">{text1}</span>}
        {text2 && <span className="text-[8.5px] font-semibold tracking-[0.16em] text-gold uppercase mt-1.5 whitespace-nowrap">{text2}</span>}
      </span>
    </Link>
  );
}

/* ── Social icons (only platforms added in the dashboard) ── */
function SocialIcons({ items }: { items: any[] }) {
  const active = (items || []).filter((s) => s?.platform && String(s.platform).trim() !== "");
  if (active.length === 0) return null;

  return (
    <div className="flex gap-2.5 mt-6">
      {active.map((s, i) => {
        const raw = String(s.icon || s.platform || "");
        const name = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        const Icon = (LucideIcons as any)[name] || (LucideIcons as any)[raw] || LucideIcons.Share2;
        const href = s.href && String(s.href).trim() !== "" ? s.href : "#";
        return (
          <a
            key={`${s.platform}-${i}`}
            href={href}
            target={href !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={s.platform}
            className="nav-link h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-gold hover:bg-gold transition-all duration-200"
          >
            <Icon size={15} strokeWidth={1.6} />
          </a>
        );
      })}
    </div>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-white font-bold text-[12px] tracking-[0.2em] uppercase mb-5 flex items-center gap-2.5">
      <span className="h-px w-5 bg-gold" />
      {children}
    </h4>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="nav-link group inline-flex items-center gap-2 text-white/70 text-[13.5px] hover:text-gold transition-colors duration-200"
      >
        <ArrowRight size={12} className="text-gold opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
        {label}
      </Link>
    </li>
  );
}

/* Build "Mon–Fri: 9–5 / Sat: …" lines from the 7-day hours object, grouping consecutive identical days. */
function buildHoursText(hours: Record<string, string> | undefined): string {
  if (!hours || typeof hours !== "object") return "";
  const order = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const short: Record<string, string> = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun" };
  const days = order.filter((d) => hours[d] && String(hours[d]).trim() !== "");
  if (days.length === 0) return "";

  const groups: { from: string; to: string; value: string }[] = [];
  for (const d of days) {
    const v = String(hours[d]).trim();
    const last = groups[groups.length - 1];
    const prevIdx = last ? order.indexOf(last.to) : -1;
    if (last && last.value === v && order.indexOf(d) === prevIdx + 1) last.to = d;
    else groups.push({ from: d, to: d, value: v });
  }
  return groups.map((g) => `${g.from === g.to ? short[g.from] : `${short[g.from]}–${short[g.to]}`}: ${g.value}`).join("\n");
}

const normalizeHref = (href: string) => {
  let h = href || "/";
  if (h === "/blog" || h === "/blog/") h = "/blogs/";
  if (h.startsWith("/") && !h.endsWith("/") && !h.includes("#") && !h.includes("?")) h = `${h}/`;
  return h;
};

export default function Footer() {
  const { footer, navbar, services: servicesData, hours } = useContent();
  const rawCtx = useContentContext();
  const rawFooter = rawCtx?.footer || {};

  const company = footer?.company || {};
  const contact = footer?.contact || {};
  const bottom = footer?.bottom || {};
  const footerServices = footer?.services || {};
  const materials = footerServices.materials || {};
  const social: any[] = Array.isArray(rawFooter.social) ? rawFooter.social : Array.isArray((footer as any)?.social) ? (footer as any).social : [];

  /* Headings (all CMS-managed) */
  const quickLinksLabel = stripHtml(materials.title || (footer as any)?.quickLinksLabel || "Quick Links");
  const servicesLabel = stripHtml(footerServices.title || (footer as any)?.servicesLabel || "Our Services");
  const contactLabel = stripHtml(contact.title || (footer as any)?.contactLabel || "Contact Us");

  /* Brand */
  const brandText1 = stripHtml(company.name || navbar?.logoText1 || navbar?.siteTitle || "");
  const brandText2 = stripHtml(company.tagline || "");
  const brandDescription = stripHtml(company.description || (footer as any)?.brandDescription || "");

  /* Contact */
  const rawAddress: string = contact.address || (footer as any)?.address || "";
  const iframeMatch = rawAddress.match(/<iframe[^>]*>[\s\S]*?<\/iframe>/i);
  const iframeHtml = iframeMatch ? iframeMatch[0].replace(/width="[^"]*"/i, 'width="100%"').replace(/height="[^"]*"/i, 'height="100%"') : null;
  const addressText = stripHtml(rawAddress.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/i, ""));
  const phoneText = stripHtml(contact.phone || (footer as any)?.phone || "");
  const emailText = stripHtml(contact.email || (footer as any)?.email || "");
  // Hours: the override text wins; otherwise build from the 7-day schedule in Settings → Contact.
  const hoursText = stripHtml(contact.hours || "") || buildHoursText(hours as Record<string, string>);

  /* Quick links: CMS "Quick Links" list if provided, else the navbar menu */
  const cmsQuickLinks = Array.isArray(materials.items) ? materials.items.filter((l: any) => l?.label) : [];
  const quickLinks = (cmsQuickLinks.length > 0 ? cmsQuickLinks : (navbar?.companyLinks || navbar?.links || []))
    .map((l: any) => ({ label: stripHtml(l.label), href: normalizeHref(l.href) }));

  /* Services: CMS-selected (by id, slug, or title), else published services */
  const published = (servicesData?.services || []).filter((s: any) => s.status === "published" || s.status === undefined);
  const selected: string[] = Array.isArray(footerServices.selectedServices) ? footerServices.selectedServices.map(String) : [];
  const norm = (v: any) => String(v ?? "").trim().toLowerCase();
  const serviceLinks: { label: string; href: string }[] = (selected.length > 0
    ? selected.map((key) => {
        const match = published.find((s: any) =>
          [s._id, s.id, s.slug, s.title, s.name].some((v) => v && norm(v) === norm(key))
        );
        return match ? { label: stripHtml(match.title || match.name), href: `/${match.slug}/` } : { label: stripHtml(key), href: "/services/" };
      })
    : published.map((s: any) => ({ label: stripHtml(s.title || s.name), href: `/${s.slug}/` }))
  ).filter((s: { label: string; href: string }) => s.label).slice(0, 8);

  /* Bottom bar (all CMS-managed) */
  const legalLinks: { label: string; href: string }[] = (Array.isArray(bottom.links) ? bottom.links : [])
    .filter((l: any) => l?.label)
    .map((l: any) => ({ label: stripHtml(l.label), href: normalizeHref(l.href) }));
  const copyright = stripHtml(bottom.copyright || "");
  const creditText = stripHtml(bottom.creditText ?? "Designed & Developed by");
  const creditName = stripHtml(bottom.creditName ?? "Mohsin Design");
  const creditUrl: string = bottom.creditUrl ?? "https://mohsindesigns.com/";
  const showCredit = !!creditName;

  return (
    <footer className="relative bg-dark-2 text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div
        className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,154,69,0.12) 0%, rgba(200,154,69,0) 65%)" }}
      />

      <div className="site-container relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1.4fr] gap-10 lg:gap-12 pt-14 md:pt-16 pb-12 border-b border-white/10">

          {/* Brand */}
          <div>
            <FooterBrand logoUrl={company.logo || navbar?.logo} siteTitle={navbar?.siteTitle} text1={brandText1} text2={brandText2} />
            {brandDescription && (
              <p className="text-white/60 text-[13.5px] leading-[1.8] max-w-[300px] font-light">{brandDescription}</p>
            )}
            <SocialIcons items={social} />
          </div>

          {/* Quick links */}
          {quickLinks.length > 0 && (
            <div>
              <FooterHeading>{quickLinksLabel}</FooterHeading>
              <ul className="flex flex-col gap-3">
                {quickLinks.map((l: any, i: number) => <FooterLink key={`${l.label}-${i}`} href={l.href} label={l.label} />)}
              </ul>
            </div>
          )}

          {/* Services */}
          {serviceLinks.length > 0 && (
            <div>
              <FooterHeading>{servicesLabel}</FooterHeading>
              <ul className="flex flex-col gap-3">
                {serviceLinks.map((s, i) => <FooterLink key={`${s.label}-${i}`} href={s.href} label={s.label} />)}
              </ul>
            </div>
          )}

          {/* Contact */}
          {(addressText || phoneText || emailText || hoursText || iframeHtml) && (
            <div>
              <FooterHeading>{contactLabel}</FooterHeading>
              <ul className="flex flex-col gap-4">
                {addressText && (
                  <li className="flex items-start gap-3">
                    <span className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0"><MapPin size={14} /></span>
                    <span className="text-white/75 text-[13.5px] leading-snug whitespace-pre-line pt-1.5">{addressText}</span>
                  </li>
                )}
                {phoneText && (
                  <li className="flex items-start gap-3">
                    <span className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0"><Phone size={14} /></span>
                    <a href={`tel:${phoneText.replace(/[^0-9+]/g, "")}`} className="nav-link text-white/75 text-[13.5px] hover:text-gold transition-colors pt-1.5">{phoneText}</a>
                  </li>
                )}
                {emailText && (
                  <li className="flex items-start gap-3">
                    <span className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0"><Mail size={14} /></span>
                    <a href={`mailto:${emailText}`} className="nav-link text-white/75 text-[13.5px] hover:text-gold transition-colors pt-1.5 break-all">{emailText}</a>
                  </li>
                )}
                {hoursText && (
                  <li className="flex items-start gap-3">
                    <span className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0"><Clock size={14} /></span>
                    <span className="text-white/75 text-[13.5px] leading-snug whitespace-pre-line pt-1.5">{hoursText}</span>
                  </li>
                )}
              </ul>
              {iframeHtml && (
                <div className="mt-5 h-[150px] w-full rounded-xl overflow-hidden border border-white/10" dangerouslySetInnerHTML={{ __html: iframeHtml }} />
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        {(copyright || showCredit || legalLinks.length > 0) && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-6 text-[13px] text-center md:text-left">
            <p className="text-white/60">
              {copyright}
              {copyright && showCredit && <span className="hidden md:inline text-white/25 mx-3">•</span>}
              {showCredit && (
                <span className="block md:inline mt-1 md:mt-0">
                  {creditText && <>{creditText} </>}
                  {creditUrl ? (
                    <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="nav-link text-gold hover:text-white font-semibold transition-colors">{creditName}</a>
                  ) : (
                    <span className="text-gold font-semibold">{creditName}</span>
                  )}
                </span>
              )}
            </p>
            {legalLinks.length > 0 && (
              <div className="flex items-center gap-5">
                {legalLinks.map((l, i) => (
                  <Link key={`${l.label}-${i}`} href={l.href} className="nav-link text-white/60 hover:text-gold transition-colors">{l.label}</Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
