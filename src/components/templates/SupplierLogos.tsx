"use client";

import { useState } from "react";

interface SupplierLogo {
  name: string;
  logoUrl?: string;
  url?: string;
  logoBg?: 'dark' | 'light';
}

interface SupplierLogosProps {
  logos?: SupplierLogo[];
  label?: string;
}

/**
 * Small labeled row of supplier/manufacturer logos, used on service pages
 * that proudly supply a third-party brand (e.g. TRC Sucker Rods, Percheron
 * Manufacturing, Iron Bear Manufacturing, TechTAC).
 *
 * Each logo image sits on a small chip rather than directly on the page
 * background, since supplied brand marks come in whatever color scheme the
 * supplier drew them in. Some are white/light artwork meant for a dark
 * surface (e.g. Percheron's reversed logo); others are dark/black artwork
 * that would disappear on the same dark chip (e.g. TechTAC's black
 * wordmark). `logoBg` picks the right one per logo -- defaults to 'dark'
 * (the original, still-correct choice for TRC/Percheron/Iron Bear); set it
 * to 'light' for a logo whose own artwork is dark.
 *
 * Each item degrades gracefully to a styled text pill with the supplier's
 * name if `logoUrl` is missing or the image fails to load — never a broken
 * image icon. This means logo file paths can be wired up in content before
 * the actual files exist; the page renders clean text pills today and
 * upgrades silently the moment a file is dropped in, with zero code change.
 */
function SupplierLogoItem({ name, logoUrl, url, logoBg = 'dark' }: SupplierLogo) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logoUrl) && !failed;

  const chipClass = logoBg === 'light'
    ? "inline-flex items-center justify-center h-14 md:h-16 px-6 rounded-lg bg-white border border-border-light hover:border-gold-dark/40 transition-colors duration-300"
    : "inline-flex items-center justify-center h-14 md:h-16 px-6 rounded-lg bg-dark border border-white/10 hover:border-gold/40 transition-colors duration-300";

  const content = showImage ? (
    <span className={chipClass}>
      <img
        src={logoUrl}
        alt={name}
        onError={() => setFailed(true)}
        className="h-7 md:h-8 max-w-[130px] object-contain"
      />
    </span>
  ) : (
    <span className="inline-flex items-center px-4 py-2.5 rounded-md border border-border-light bg-card-bg text-dark/70 text-[12.5px] font-semibold tracking-wide hover:border-gold-dark/50 hover:text-dark transition-colors">
      {name}
    </span>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center"
        aria-label={name}
      >
        {content}
      </a>
    );
  }

  return <div className="inline-flex items-center">{content}</div>;
}

export default function SupplierLogos({ logos = [], label = "Proud Suppliers Of" }: SupplierLogosProps) {
  if (!logos || logos.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border-light">
      {label && (
        <span className="text-dark/40 text-[10.5px] font-mono font-bold uppercase tracking-widest block mb-4">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-4">
        {logos.map((logo, idx) => (
          <SupplierLogoItem key={idx} name={logo.name} logoUrl={logo.logoUrl} url={logo.url} logoBg={logo.logoBg} />
        ))}
      </div>
    </div>
  );
}
