"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, ChevronRight, Star, Plus, Trash2, ShieldCheck, Megaphone } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ImageField from "@/components/admin/ImageField";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-40 bg-slate-50 animate-pulse border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs">Loading Rich Text Editor...</div>
});

const UI = {
  label: "text-xs uppercase tracking-widest text-slate-500 font-extrabold",
  input: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
  textarea: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none",
  card: "bg-slate-50 border border-slate-200 rounded-2xl p-5 relative",
  removeBtn: "absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors",
  addBtn: "flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors",
};

const ICON_OPTIONS = ["Star", "ShieldCheck", "Award", "Truck", "Clock", "Users", "MapPin", "Wrench", "CheckCircle2", "Zap", "Headphones", "Package"];

const EMPTY = {
  section: { badge: "", headline: "", description: "", image: "", imageAlt: "" },
  stats: { items: [] },
  ctaBanner: { label: "", title: "", description: "", button: "", buttonUrl: "", phone: "" },
};

export default function ReviewsPageEditor() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => {
        const d = { ...json };
        d.testimonials = {
          ...d.testimonials,
          section: { ...EMPTY.section, ...(d.testimonials?.section || {}) },
          stats: { ...EMPTY.stats, ...(d.testimonials?.stats || {}) },
          ctaBanner: { ...EMPTY.ctaBanner, ...(d.testimonials?.ctaBanner || {}) },
        };
        setData(d);
      })
      .catch((err) => console.error("Failed to load content:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Changes saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Save failed:", err);
      setMessage("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        [section]: { ...prev.testimonials?.[section], [field]: value },
      },
    }));
  };

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const t = data.testimonials;

  const tabs = [
    { id: "hero", label: "1. Hero Section", icon: Star },
    { id: "stats", label: "2. Stats Strip", icon: ShieldCheck },
    { id: "ctaBanner", label: "3. CTA Banner", icon: Megaphone },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
            <Link href="/admin/pages" className="hover:text-primary transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">Reviews Page</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Edit Reviews Page</h1>
          <p className="text-slate-500 mt-1 italic font-medium">
            Everything shown at /reviews/ — hero, stats and CTA banner, completely independent from the homepage. To manage the individual reviews shown in the grid, visit{" "}
            <Link href="/admin/reviews" className="text-primary font-bold hover:underline">Reviews Management</Link>.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl mb-6 text-center font-bold ${
            message.includes("success") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-3xl p-8">
          <AnimatePresence mode="wait">
            {/* ═══════════════════ HERO ═══════════════════ */}
            {activeTab === "hero" && (
              <motion.div key="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-6">Hero Section</h2>

                <ImageField
                  label="Hero Background Image"
                  value={t.section.image}
                  onChange={(url: string) => updateSection("section", "image", url)}
                  altValue={t.section.imageAlt}
                  onAltChange={(alt: string) => updateSection("section", "imageAlt", alt)}
                  description="Full-bleed dark hero photo behind the headline."
                />

                <div className="space-y-2">
                  <label className={UI.label}>Section Badge</label>
                  <input
                    type="text"
                    value={t.section.badge}
                    onChange={(e) => updateSection("section", "badge", e.target.value)}
                    className={UI.input}
                    placeholder="e.g. CLIENT TESTIMONIALS"
                  />
                </div>

                <div className="space-y-2">
                  <label className={UI.label}>Headline</label>
                  <input
                    type="text"
                    value={t.section.headline}
                    onChange={(e) => updateSection("section", "headline", e.target.value)}
                    className={UI.input}
                    placeholder="e.g. Trusted Across the Permian Basin."
                  />
                </div>

                <div className="space-y-2">
                  <label className={UI.label}>Description</label>
                  <RichTextEditor
                    content={t.section.description}
                    onChange={(v) => updateSection("section", "description", v)}
                  />
                </div>
              </motion.div>
            )}

            {/* ═══════════════════ STATS ═══════════════════ */}
            {activeTab === "stats" && (
              <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-6">Stats Strip</h2>
                <p className="text-sm text-slate-500 -mt-4">The 4-number strip right under the hero. Independent from the homepage's stats.</p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className={UI.label}>Stat Tiles</label>
                    <button
                      type="button"
                      onClick={() => updateSection("stats", "items", [...(t.stats.items || []), { value: "", label: "", icon: "Star" }])}
                      className={UI.addBtn}
                    >
                      <Plus className="w-4 h-4" /> Add Stat
                    </button>
                  </div>
                  {(t.stats.items || []).map((s: any, idx: number) => (
                    <div key={idx} className={UI.card + " grid grid-cols-1 md:grid-cols-[110px_140px_1fr] gap-3 items-end"}>
                      <button
                        type="button"
                        onClick={() => updateSection("stats", "items", t.stats.items.filter((_: any, i: number) => i !== idx))}
                        className={UI.removeBtn}
                        aria-label="Remove stat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Value</label>
                        <input
                          type="text"
                          value={s.value || ""}
                          onChange={(e) => { const next = [...t.stats.items]; next[idx] = { ...next[idx], value: e.target.value }; updateSection("stats", "items", next); }}
                          className={UI.input}
                          placeholder="e.g. 5.0"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Icon</label>
                        <select
                          value={s.icon || "Star"}
                          onChange={(e) => { const next = [...t.stats.items]; next[idx] = { ...next[idx], icon: e.target.value }; updateSection("stats", "items", next); }}
                          className={UI.input}
                        >
                          {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1 pr-8">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Label</label>
                        <input
                          type="text"
                          value={s.label || ""}
                          onChange={(e) => { const next = [...t.stats.items]; next[idx] = { ...next[idx], label: e.target.value }; updateSection("stats", "items", next); }}
                          className={UI.input}
                          placeholder="e.g. Average Rating"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════ CTA BANNER ═══════════════════ */}
            {activeTab === "ctaBanner" && (
              <motion.div key="ctaBanner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-6">CTA Banner</h2>
                <p className="text-sm text-slate-500 -mt-4">Independent from the homepage's CTA banner. Defaults to your real Google review link.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Badge</label>
                    <input type="text" value={t.ctaBanner.label} onChange={(e) => updateSection("ctaBanner", "label", e.target.value)} className={UI.input} placeholder="e.g. SHARE YOUR EXPERIENCE" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Title</label>
                    <input type="text" value={t.ctaBanner.title} onChange={(e) => updateSection("ctaBanner", "title", e.target.value)} className={UI.input} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={UI.label}>Description</label>
                  <textarea rows={2} value={t.ctaBanner.description} onChange={(e) => updateSection("ctaBanner", "description", e.target.value)} className={UI.textarea} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className={UI.label}>Button Text</label>
                    <input type="text" value={t.ctaBanner.button} onChange={(e) => updateSection("ctaBanner", "button", e.target.value)} className={UI.input} placeholder="e.g. Leave a Google Review" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Button Link</label>
                    <input type="text" value={t.ctaBanner.buttonUrl} onChange={(e) => updateSection("ctaBanner", "buttonUrl", e.target.value)} className={UI.input} placeholder="Your Google review link" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Phone Number</label>
                    <input type="text" value={t.ctaBanner.phone} onChange={(e) => updateSection("ctaBanner", "phone", e.target.value)} className={UI.input} placeholder="e.g. 830-279-3996" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
