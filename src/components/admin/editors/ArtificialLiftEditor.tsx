"use client";

import { Trash2 } from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

interface Props {
  data: any;
  setData: (data: any) => void;
}

/**
 * Editor for the Artificial Lift landing page (template:
 * 'artificial-lift-landing'). Every field here is what
 * ArtificialLiftTemplate.tsx reads directly off page.content -- nothing
 * on the live page is hardcoded.
 *
 * Page FAQs (faqBadge/faqTitle/faqDescription/faqs[]) are edited on the
 * "Page FAQs" tab one level up (the generic /admin/pages/[id] wrapper
 * already provides that, in the exact field shape this template reads --
 * no duplicate FAQ UI needed here).
 */
export default function ArtificialLiftEditor({ data, setData }: Props) {
  const d = data || {};
  const update = (field: string, value: any) => setData({ ...d, [field]: value });

  const whyFeatures = Array.isArray(d.whyFeatures) ? d.whyFeatures : [];
  const subPages = Array.isArray(d.subPages) ? d.subPages : [];

  return (
    <div className="space-y-8">
      {/* 1. Hero */}
      <div className="space-y-4">
        <h3 className={UI.sectionHeader}>1. Hero</h3>
        <div className={UI.card}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Eyebrow Label</label>
              <input type="text" value={d.heroSectionLabel || ""} onChange={(e) => update("heroSectionLabel", e.target.value)} className={UI.input} placeholder="e.g. ARTIFICIAL LIFT" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Headline Part 1 (regular)</label>
              <input type="text" value={d.heroTitle1 || ""} onChange={(e) => update("heroTitle1", e.target.value)} className={UI.input} placeholder="e.g. Artificial Lift," />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Headline Part 2 (italic accent)</label>
              <input type="text" value={d.heroTitle2 || ""} onChange={(e) => update("heroTitle2", e.target.value)} className={UI.input} placeholder="e.g. Built for the Permian Basin." />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={UI.label}>Hero Description</label>
            <textarea value={d.heroDescription || ""} onChange={(e) => update("heroDescription", e.target.value)} className={UI.textarea + " h-24"} placeholder="The big Trinity pitch -- experience, USA-made, quality, lower lifting costs, service..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Primary CTA Text</label>
              <input type="text" value={d.heroCtaText || ""} onChange={(e) => update("heroCtaText", e.target.value)} className={UI.input} placeholder="e.g. Get a Quote" />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Primary CTA Link</label>
              <input type="text" value={d.heroCtaUrl || ""} onChange={(e) => update("heroCtaUrl", e.target.value)} className={UI.input} placeholder="e.g. /contact-us/" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Secondary CTA Text</label>
              <input type="text" value={d.heroCtaSecondary || ""} onChange={(e) => update("heroCtaSecondary", e.target.value)} className={UI.input} placeholder="e.g. SEE OUR PRODUCTS" />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Secondary CTA Link</label>
              <input type="text" value={d.heroCtaSecondaryUrl || ""} onChange={(e) => update("heroCtaSecondaryUrl", e.target.value)} className={UI.input} placeholder="e.g. #lineup" />
            </div>
          </div>
          <ImageField
            label="Hero Background Image"
            value={d.image || ""}
            onChange={(url) => update("image", url)}
            altValue={d.imageAlt || ""}
            onAltChange={(alt) => update("imageAlt", alt)}
            description="Full-bleed dark background behind the headline."
          />
        </div>
      </div>

      {/* 2. Stats */}
      <div className="space-y-4">
        <h3 className={UI.sectionHeader}>2. Stats Band</h3>
        <div className={UI.card + " grid grid-cols-1 sm:grid-cols-2 gap-4"}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className={UI.label}>Stat {n} Value</label>
                <input type="text" value={d[`statsItem${n}Val`] || ""} onChange={(e) => update(`statsItem${n}Val`, e.target.value)} className={UI.input} />
              </div>
              <div className="space-y-1.5">
                <label className={UI.label}>Stat {n} Label</label>
                <input type="text" value={d[`statsItem${n}Label`] || ""} onChange={(e) => update(`statsItem${n}Label`, e.target.value)} className={UI.input} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Why Trinity */}
      <div className="space-y-4">
        <h3 className={UI.sectionHeader}>3. Why Trinity (feature grid)</h3>
        <div className={UI.card + " space-y-4"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Eyebrow Label</label>
              <input type="text" value={d.whyLabel || ""} onChange={(e) => update("whyLabel", e.target.value)} className={UI.input} placeholder="e.g. WHY TRINITY" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Heading Part 1 (regular)</label>
              <input type="text" value={d.whyTitle1 || ""} onChange={(e) => update("whyTitle1", e.target.value)} className={UI.input} placeholder="e.g. One Shop." />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Heading Part 2 (italic accent)</label>
              <input type="text" value={d.whyTitle2 || ""} onChange={(e) => update("whyTitle2", e.target.value)} className={UI.input} placeholder="e.g. Every Artificial Lift Need." />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={UI.label}>Description</label>
            <textarea value={d.whyDescription || ""} onChange={(e) => update("whyDescription", e.target.value)} className={UI.textarea + " h-20"} />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[12px] text-[#646970]">Feature cards (icon + title + description). Recommended: 4-6 cards.</p>
          <button type="button" onClick={() => update("whyFeatures", [...whyFeatures, { icon: "ShieldCheck", title: "", description: "" }])} className="text-[#2271b1] text-xs font-bold underline">+ Add Feature</button>
        </div>
        <div className="space-y-3">
          {whyFeatures.map((f: any, i: number) => (
            <div key={i} className={UI.card + " space-y-3"}>
              <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-1">
                <span className="text-[11px] font-mono font-bold text-[#2271b1]">FEATURE #{i + 1}</span>
                <button type="button" onClick={() => update("whyFeatures", whyFeatures.filter((_: any, idx: number) => idx !== i))} className="text-[#d63638] hover:bg-red-50 p-1.5 rounded" title="Remove Feature">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className={UI.label}>Icon (Lucide name)</label>
                  <input type="text" value={f.icon || ""} onChange={(e) => { const nf = [...whyFeatures]; nf[i] = { ...nf[i], icon: e.target.value }; update("whyFeatures", nf); }} className={UI.input} placeholder="e.g. ShieldCheck" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className={UI.label}>Title</label>
                  <input type="text" value={f.title || ""} onChange={(e) => { const nf = [...whyFeatures]; nf[i] = { ...nf[i], title: e.target.value }; update("whyFeatures", nf); }} className={UI.input} placeholder="e.g. USA-Made Components" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={UI.label}>Description</label>
                <textarea value={f.description || ""} onChange={(e) => { const nf = [...whyFeatures]; nf[i] = { ...nf[i], description: e.target.value }; update("whyFeatures", nf); }} className={UI.textarea + " h-16"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sub-page index */}
      <div className="space-y-4">
        <h3 className={UI.sectionHeader}>4. Product & Service Index</h3>
        <div className={UI.card + " space-y-4"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Eyebrow Label</label>
              <input type="text" value={d.subPagesLabel || ""} onChange={(e) => update("subPagesLabel", e.target.value)} className={UI.input} placeholder="e.g. OUR LINEUP" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={UI.label}>Heading Part 1 (regular)</label>
              <input type="text" value={d.subPagesTitle1 || ""} onChange={(e) => update("subPagesTitle1", e.target.value)} className={UI.input} placeholder="e.g. Artificial Lift" />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Heading Part 2 (italic accent)</label>
              <input type="text" value={d.subPagesTitle2 || ""} onChange={(e) => update("subPagesTitle2", e.target.value)} className={UI.input} placeholder="e.g. Products & Services." />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[12px] text-[#646970]">The cards linking to each product/service page. Curated here (not auto-generated) so the order and wording stay predictable.</p>
          <button type="button" onClick={() => update("subPages", [...subPages, { title: "", slug: "", description: "", icon: "Settings" }])} className="text-[#2271b1] text-xs font-bold underline">+ Add Card</button>
        </div>
        <div className="space-y-3">
          {subPages.map((s: any, i: number) => (
            <div key={i} className={UI.card + " space-y-3"}>
              <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-1">
                <span className="text-[11px] font-mono font-bold text-[#2271b1]">CARD #{i + 1}</span>
                <button type="button" onClick={() => update("subPages", subPages.filter((_: any, idx: number) => idx !== i))} className="text-[#d63638] hover:bg-red-50 p-1.5 rounded" title="Remove Card">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className={UI.label}>Title</label>
                  <input type="text" value={s.title || ""} onChange={(e) => { const ns = [...subPages]; ns[i] = { ...ns[i], title: e.target.value }; update("subPages", ns); }} className={UI.input} placeholder="e.g. Rod Pumps" />
                </div>
                <div className="space-y-1.5">
                  <label className={UI.label}>Slug (matches the service's URL)</label>
                  <input type="text" value={s.slug || ""} onChange={(e) => { const ns = [...subPages]; ns[i] = { ...ns[i], slug: e.target.value }; update("subPages", ns); }} className={UI.input} placeholder="e.g. rod-pumps" />
                </div>
                <div className="space-y-1.5">
                  <label className={UI.label}>Icon (Lucide name)</label>
                  <input type="text" value={s.icon || ""} onChange={(e) => { const ns = [...subPages]; ns[i] = { ...ns[i], icon: e.target.value }; update("subPages", ns); }} className={UI.input} placeholder="e.g. Settings" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={UI.label}>Short Description</label>
                <input type="text" value={s.description || ""} onChange={(e) => { const ns = [...subPages]; ns[i] = { ...ns[i], description: e.target.value }; update("subPages", ns); }} className={UI.input} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
