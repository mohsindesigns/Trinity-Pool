"use client";

import { Mail, Phone } from "lucide-react";

export interface ContactPerson {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  image?: string;
  intro?: string;
}

export default function ContactPersonCard({
  person,
  label = "YOUR CONTACT",
}: {
  person?: ContactPerson;
  label?: string;
}) {
  if (!person || !person.name) return null;

  const initials = person.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-7 rounded-2xl bg-white border border-border-light shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)]">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <span className="relative h-16 w-16 rounded-full ring-2 ring-gold/30 shadow-sm flex-shrink-0 overflow-hidden bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white text-[18px] font-bold flex items-center justify-center">
          {person.image ? (
            <img src={person.image} alt={person.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            initials || "•"
          )}
        </span>
        <div className="min-w-0">
          <p className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-gold-dark mb-1">{label}</p>
          <p className="text-dark font-bold text-[17px] leading-tight truncate">{person.name}</p>
          {person.role && <p className="text-dark/50 text-[13px] leading-tight mt-0.5 truncate">{person.role}</p>}
        </div>
      </div>

      {person.intro && (
        <p className="text-dark/60 text-[13.5px] leading-relaxed font-light sm:max-w-[280px] sm:border-l sm:border-border-light sm:pl-6">
          {person.intro}
        </p>
      )}

      <div className="flex flex-col xs:flex-row sm:flex-col gap-2.5 flex-shrink-0">
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-dark text-white hover:bg-gold-dark transition-colors text-[12.5px] font-semibold whitespace-nowrap"
          >
            <Mail size={14} className="flex-shrink-0" /> {person.email}
          </a>
        )}
        {person.phone && (
          <a
            href={`tel:${person.phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border-light text-dark hover:border-gold-dark hover:text-gold-dark transition-colors text-[12.5px] font-semibold whitespace-nowrap"
          >
            <Phone size={14} className="flex-shrink-0" /> {person.phone}
          </a>
        )}
      </div>
    </div>
  );
}
