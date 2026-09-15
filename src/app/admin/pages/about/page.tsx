"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, LayoutTemplate, BookOpen, Heart, HelpCircle, ChevronRight, Plus, Trash2, Star, ShieldCheck, Megaphone } from "lucide-react";
import Link from "next/link";
import ImageField from "@/components/admin/ImageField";

const UI = {
  label: "text-xs uppercase tracking-widest text-slate-500 font-extrabold",
  input: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
  textarea: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none",
  card: "bg-slate-50 border border-slate-200 rounded-2xl p-5 relative",
  removeBtn: "absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors",
  addBtn: "flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors",
};

const ICON_OPTIONS = ["ShieldCheck", "Clock", "Users", "MapPin", "Wrench", "Award", "Truck", "Star", "CheckCircle2", "Zap", "Heart", "Target", "Coins", "Headphones", "Package", "Layers", "Settings", "Flame", "Globe"];

const EMPTY = {
  hero: { label: "", title1: "", title2: "", description: "", image: "", imageAlt: "", ctaText: "", ctaUrl: "", ctaSecondaryText: "", ctaSecondaryUrl: "" },
  story: { label: "", title1: "", title2: "", paragraphs: [], image: "", imageAlt: "", highlights: [], badgeTitle: "", badgeSubtitle: "" },
  values: { label: "", title1: "", title2: "", items: [] },
  stats: { items: [] },
  whyChooseUs: { badge: "", title: "", description: "", image: "", imageAlt: "", features: [] },
  ctaBanner: { label: "", title: "", description: "", button: "", buttonUrl: "", phone: "" },
  faq: { badge: "", title: "", description: "", items: [] },
};

export default function AboutPageEditor() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => {
        const d = { ...json };
        d.aboutPage = {
          hero: { ...EMPTY.hero, ...(d.aboutPage?.hero || {}) },
          story: { ...EMPTY.story, ...(d.aboutPage?.story || {}) },
          values: { ...EMPTY.values, ...(d.aboutPage?.values || {}) },
          stats: { ...EMPTY.stats, ...(d.aboutPage?.stats || {}) },
          whyChooseUs: { ...EMPTY.whyChooseUs, ...(d.aboutPage?.whyChooseUs || {}) },
          ctaBanner: { ...EMPTY.ctaBanner, ...(d.aboutPage?.ctaBanner || {}) },
          faq: { ...EMPTY.faq, ...(d.aboutPage?.faq || {}) },
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
        setMessage("About page saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save content.");
      }
    } catch (err) {
      setMessage("Error saving content.");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const { aboutPage } = data;

  const updateSection = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      aboutPage: {
        ...prev.aboutPage,
        [section]: { ...prev.aboutPage[section], [field]: value },
      },
    }));
  };

  const tabs = [
    { id: "hero", label: "1. Hero Section", icon: LayoutTemplate },
    { id: "story", label: "2. Our Story", icon: BookOpen },
    { id: "values", label: "3. Values Grid", icon: Heart },
    { id: "stats", label: "4. Stats Strip", icon: Star },
    { id: "whyChooseUs", label: "5. Why Choose Us", icon: ShieldCheck },
    { id: "ctaBanner", label: "6. CTA Banner", icon: Megaphone },
    { id: "faq", label: "7. About Page FAQ", icon: HelpCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin/pages" className="hover:text-gray-900 transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-bold">About Page</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Edit About Page</h1>
          <p className="text-slate-500 mt-1 italic font-medium">
            Everything shown at /about-us/ — including its own Stats, "Why Choose Us" and CTA banner, completely independent from the homepage. Only the contact form itself (name/email/phone fields and your business phone/email/address) stays shared sitewide, since that's the same real contact info everywhere.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.includes("success") ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
          {message}
        </div>
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
                  value={aboutPage.hero.image}
                  onChange={(url: string) => updateSection("hero", "image", url)}
                  altValue={aboutPage.hero.imageAlt}
                  onAltChange={(alt: string) => updateSection("hero", "imageAlt", alt)}
                  description="Full-bleed dark hero photo behind the headline. Optimal size: 1920x1080px."
                />

                <div className="space-y-2">
                  <label className={UI.label}>Section Label (small kicker above the headline)</label>
                  <input type="text" value={aboutPage.hero.label} onChange={(e) => updateSection("hero", "label", e.target.value)} className={UI.input} placeholder="e.g. WHO WE ARE" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Headline (main)</label>
                    <input type="text" value={aboutPage.hero.title1} onChange={(e) => updateSection("hero", "title1", e.target.value)} className={UI.input} placeholder="e.g. Built in Odessa." />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Headline (gold italic accent)</label>
                    <input type="text" value={aboutPage.hero.title2} onChange={(e) => updateSection("hero", "title2", e.target.value)} className={UI.input} placeholder="e.g. Trusted Across the Basin." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={UI.label}>Hero Description</label>
                  <textarea rows={3} value={aboutPage.hero.description} onChange={(e) => updateSection("hero", "description", e.target.value)} className={UI.textarea} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className={UI.label}>Primary Button Text</label>
                    <input type="text" value={aboutPage.hero.ctaText} onChange={(e) => updateSection("hero", "ctaText", e.target.value)} className={UI.input} placeholder="e.g. Request a Quote" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Primary Button Link</label>
                    <input type="text" value={aboutPage.hero.ctaUrl} onChange={(e) => updateSection("hero", "ctaUrl", e.target.value)} className={UI.input} placeholder="Defaults to your booking/contact URL" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Secondary Button Text</label>
                    <input type="text" value={aboutPage.hero.ctaSecondaryText} onChange={(e) => updateSection("hero", "ctaSecondaryText", e.target.value)} className={UI.input} placeholder="e.g. See Our Services" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Secondary Button Link</label>
                    <input type="text" value={aboutPage.hero.ctaSecondaryUrl} onChange={(e) => updateSection("hero", "ctaSecondaryUrl", e.target.value)} className={UI.input} placeholder="e.g. /services/" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════ STORY ═══════════════════ */}
            {activeTab === "story" && (
              <motion.div key="story" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-6">Our Story</h2>

                <div className="space-y-2">
                  <label className={UI.label}>Section Label</label>
                  <input type="text" value={aboutPage.story.label} onChange={(e) => updateSection("story", "label", e.target.value)} className={UI.input} placeholder="e.g. OUR STORY" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Title (main)</label>
                    <input type="text" value={aboutPage.story.title1} onChange={(e) => updateSection("story", "title1", e.target.value)} className={UI.input} />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Title (gold italic accent)</label>
                    <input type="text" value={aboutPage.story.title2} onChange={(e) => updateSection("story", "title2", e.target.value)} className={UI.input} />
                  </div>
                </div>

                <ImageField
                  label="Story Photo"
                  value={aboutPage.story.image}
                  onChange={(url: string) => updateSection("story", "image", url)}
                  altValue={aboutPage.story.imageAlt}
                  onAltChange={(alt: string) => updateSection("story", "imageAlt", alt)}
                  description="Photo shown beside the story text — a shop, warehouse or job-site photo works well."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Photo Badge Title</label>
                    <input type="text" value={aboutPage.story.badgeTitle} onChange={(e) => updateSection("story", "badgeTitle", e.target.value)} className={UI.input} placeholder="e.g. Built & Tracked In-House" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Photo Badge Subtitle</label>
                    <input type="text" value={aboutPage.story.badgeSubtitle} onChange={(e) => updateSection("story", "badgeSubtitle", e.target.value)} className={UI.input} placeholder="e.g. Odessa, TX Shop" />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className={UI.label}>Story Paragraphs</label>
                    <button
                      type="button"
                      onClick={() => updateSection("story", "paragraphs", [...(aboutPage.story.paragraphs || []), ""])}
                      className={UI.addBtn}
                    >
                      <Plus className="w-4 h-4" /> Add Paragraph
                    </button>
                  </div>
                  {(aboutPage.story.paragraphs || []).map((p: string, idx: number) => (
                    <div key={idx} className={UI.card}>
                      <button
                        type="button"
                        onClick={() => updateSection("story", "paragraphs", aboutPage.story.paragraphs.filter((_: any, i: number) => i !== idx))}
                        className={UI.removeBtn}
                        aria-label="Remove paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const next = [...aboutPage.story.paragraphs];
                          next[idx] = e.target.value;
                          updateSection("story", "paragraphs", next);
                        }}
                        className={UI.textarea + " pr-10"}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className={UI.label}>Checkmark Highlights</label>
                    <button
                      type="button"
                      onClick={() => updateSection("story", "highlights", [...(aboutPage.story.highlights || []), ""])}
                      className={UI.addBtn}
                    >
                      <Plus className="w-4 h-4" /> Add Highlight
                    </button>
                  </div>
                  {(aboutPage.story.highlights || []).map((h: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const next = [...aboutPage.story.highlights];
                          next[idx] = e.target.value;
                          updateSection("story", "highlights", next);
                        }}
                        className={UI.input}
                      />
                      <button
                        type="button"
                        onClick={() => updateSection("story", "highlights", aboutPage.story.highlights.filter((_: any, i: number) => i !== idx))}
                        className="p-3 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                        aria-label="Remove highlight"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════ VALUES ═══════════════════ */}
            {activeTab === "values" && (
              <motion.div key="values" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-6">Values Grid</h2>

                <div className="space-y-2">
                  <label className={UI.label}>Section Label</label>
                  <input type="text" value={aboutPage.values.label} onChange={(e) => updateSection("values", "label", e.target.value)} className={UI.input} placeholder="e.g. WHAT WE STAND ON" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Title (main)</label>
                    <input type="text" value={aboutPage.values.title1} onChange={(e) => updateSection("values", "title1", e.target.value)} className={UI.input} />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Title (gold italic accent)</label>
                    <input type="text" value={aboutPage.values.title2} onChange={(e) => updateSection("values", "title2", e.target.value)} className={UI.input} />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className={UI.label}>Value Cards</label>
                    <button
                      type="button"
                      onClick={() => updateSection("values", "items", [...(aboutPage.values.items || []), { icon: "ShieldCheck", title: "", description: "" }])}
                      className={UI.addBtn}
                    >
                      <Plus className="w-4 h-4" /> Add Value
                    </button>
                  </div>
                  {(aboutPage.values.items || []).map((v: any, idx: number) => (
                    <div key={idx} className={UI.card + " space-y-3"}>
                      <button
                        type="button"
                        onClick={() => updateSection("values", "items", aboutPage.values.items.filter((_: any, i: number) => i !== idx))}
                        className={UI.removeBtn}
                        aria-label="Remove value"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 pr-8">
                        <div className="space-y-1">
                          <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Icon</label>
                          <select
                            value={v.icon || "ShieldCheck"}
                            onChange={(e) => {
                              const next = [...aboutPage.values.items];
                              next[idx] = { ...next[idx], icon: e.target.value };
                              updateSection("values", "items", next);
                            }}
                            className={UI.input}
                          >
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Title</label>
                          <input
                            type="text"
                            value={v.title || ""}
                            onChange={(e) => {
                              const next = [...aboutPage.values.items];
                              next[idx] = { ...next[idx], title: e.target.value };
                              updateSection("values", "items", next);
                            }}
                            className={UI.input}
                          />
                        </div>
                      </div>
                      <div className="space-y-1 pr-8">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Description</label>
                        <textarea
                          rows={2}
                          value={v.description || ""}
                          onChange={(e) => {
                            const next = [...aboutPage.values.items];
                            next[idx] = { ...next[idx], description: e.target.value };
                            updateSection("values", "items", next);
                          }}
                          className={UI.textarea}
                        />
                      </div>
                    </div>
                  ))}
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
                      onClick={() => updateSection("stats", "items", [...(aboutPage.stats.items || []), { value: "", label: "", icon: "Award" }])}
                      className={UI.addBtn}
                    >
                      <Plus className="w-4 h-4" /> Add Stat
                    </button>
                  </div>
                  {(aboutPage.stats.items || []).map((s: any, idx: number) => (
                    <div key={idx} className={UI.card + " grid grid-cols-1 md:grid-cols-[110px_140px_1fr] gap-3 items-end"}>
                      <button
                        type="button"
                        onClick={() => updateSection("stats", "items", aboutPage.stats.items.filter((_: any, i: number) => i !== idx))}
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
                          onChange={(e) => { const next = [...aboutPage.stats.items]; next[idx] = { ...next[idx], value: e.target.value }; updateSection("stats", "items", next); }}
                          className={UI.input}
                          placeholder="e.g. 100+"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Icon</label>
                        <select
                          value={s.icon || "Award"}
                          onChange={(e) => { const next = [...aboutPage.stats.items]; next[idx] = { ...next[idx], icon: e.target.value }; updateSection("stats", "items", next); }}
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
                          onChange={(e) => { const next = [...aboutPage.stats.items]; next[idx] = { ...next[idx], label: e.target.value }; updateSection("stats", "items", next); }}
                          className={UI.input}
                          placeholder="e.g. Years Combined Experience"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
            {activeTab === "whyChooseUs" && (
              <motion.div key="whyChooseUs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-6">Why Choose Us</h2>
                <p className="text-sm text-slate-500 -mt-4">Independent from the homepage's "Why Choose Us" section.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Badge</label>
                    <input type="text" value={aboutPage.whyChooseUs.badge} onChange={(e) => updateSection("whyChooseUs", "badge", e.target.value)} className={UI.input} placeholder="e.g. WHY CHOOSE US" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Title</label>
                    <input type="text" value={aboutPage.whyChooseUs.title} onChange={(e) => updateSection("whyChooseUs", "title", e.target.value)} className={UI.input} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={UI.label}>Description</label>
                  <textarea rows={2} value={aboutPage.whyChooseUs.description} onChange={(e) => updateSection("whyChooseUs", "description", e.target.value)} className={UI.textarea} />
                </div>

                <ImageField
                  label="Side Image"
                  value={aboutPage.whyChooseUs.image}
                  onChange={(url: string) => updateSection("whyChooseUs", "image", url)}
                  altValue={aboutPage.whyChooseUs.imageAlt}
                  onAltChange={(alt: string) => updateSection("whyChooseUs", "imageAlt", alt)}
                  description="Photo shown beside the feature list."
                />

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className={UI.label}>Features (shown in 3 columns)</label>
                    <button
                      type="button"
                      onClick={() => updateSection("whyChooseUs", "features", [...(aboutPage.whyChooseUs.features || []), { icon: "ShieldCheck", title: "", description: "" }])}
                      className={UI.addBtn}
                    >
                      <Plus className="w-4 h-4" /> Add Feature
                    </button>
                  </div>
                  {(aboutPage.whyChooseUs.features || []).map((f: any, idx: number) => (
                    <div key={idx} className={UI.card + " space-y-3"}>
                      <button
                        type="button"
                        onClick={() => updateSection("whyChooseUs", "features", aboutPage.whyChooseUs.features.filter((_: any, i: number) => i !== idx))}
                        className={UI.removeBtn}
                        aria-label="Remove feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 pr-8">
                        <div className="space-y-1">
                          <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Icon</label>
                          <select
                            value={f.icon || "ShieldCheck"}
                            onChange={(e) => { const next = [...aboutPage.whyChooseUs.features]; next[idx] = { ...next[idx], icon: e.target.value }; updateSection("whyChooseUs", "features", next); }}
                            className={UI.input}
                          >
                            {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Title</label>
                          <input
                            type="text"
                            value={f.title || ""}
                            onChange={(e) => { const next = [...aboutPage.whyChooseUs.features]; next[idx] = { ...next[idx], title: e.target.value }; updateSection("whyChooseUs", "features", next); }}
                            className={UI.input}
                          />
                        </div>
                      </div>
                      <div className="space-y-1 pr-8">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Description</label>
                        <textarea
                          rows={2}
                          value={f.description || ""}
                          onChange={(e) => { const next = [...aboutPage.whyChooseUs.features]; next[idx] = { ...next[idx], description: e.target.value }; updateSection("whyChooseUs", "features", next); }}
                          className={UI.textarea}
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
                <p className="text-sm text-slate-500 -mt-4">Independent from the homepage's CTA banner.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Badge</label>
                    <input type="text" value={aboutPage.ctaBanner.label} onChange={(e) => updateSection("ctaBanner", "label", e.target.value)} className={UI.input} placeholder="e.g. GET IN TOUCH" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Title</label>
                    <input type="text" value={aboutPage.ctaBanner.title} onChange={(e) => updateSection("ctaBanner", "title", e.target.value)} className={UI.input} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={UI.label}>Description</label>
                  <textarea rows={2} value={aboutPage.ctaBanner.description} onChange={(e) => updateSection("ctaBanner", "description", e.target.value)} className={UI.textarea} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className={UI.label}>Button Text</label>
                    <input type="text" value={aboutPage.ctaBanner.button} onChange={(e) => updateSection("ctaBanner", "button", e.target.value)} className={UI.input} placeholder="e.g. Contact Us" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Button Link</label>
                    <input type="text" value={aboutPage.ctaBanner.buttonUrl} onChange={(e) => updateSection("ctaBanner", "buttonUrl", e.target.value)} className={UI.input} placeholder="/contact-us/" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Phone Number</label>
                    <input type="text" value={aboutPage.ctaBanner.phone} onChange={(e) => updateSection("ctaBanner", "phone", e.target.value)} className={UI.input} placeholder="e.g. 830-279-3996" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════ FAQ ═══════════════════ */}
            {activeTab === "faq" && (
              <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-6">About Page FAQ</h2>
                <p className="text-sm text-slate-500 -mt-4">
                  These questions are specific to the About page and won't be shared with other pages' FAQs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={UI.label}>Badge</label>
                    <input type="text" value={aboutPage.faq.badge} onChange={(e) => updateSection("faq", "badge", e.target.value)} className={UI.input} placeholder="e.g. FAQ" />
                  </div>
                  <div className="space-y-2">
                    <label className={UI.label}>Title</label>
                    <input type="text" value={aboutPage.faq.title} onChange={(e) => updateSection("faq", "title", e.target.value)} className={UI.input} placeholder="e.g. About Trinity Pump & Supply" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={UI.label}>Description</label>
                  <textarea rows={2} value={aboutPage.faq.description} onChange={(e) => updateSection("faq", "description", e.target.value)} className={UI.textarea} />
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className={UI.label}>Questions</label>
                    <button
                      type="button"
                      onClick={() => updateSection("faq", "items", [...(aboutPage.faq.items || []), { q: "", a: "" }])}
                      className={UI.addBtn}
                    >
                      <Plus className="w-4 h-4" /> Add Question
                    </button>
                  </div>
                  {(aboutPage.faq.items || []).map((item: any, idx: number) => (
                    <div key={idx} className={UI.card + " space-y-3"}>
                      <button
                        type="button"
                        onClick={() => updateSection("faq", "items", aboutPage.faq.items.filter((_: any, i: number) => i !== idx))}
                        className={UI.removeBtn}
                        aria-label="Remove question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-1 pr-8">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Question</label>
                        <input
                          type="text"
                          value={item.q || ""}
                          onChange={(e) => {
                            const next = [...aboutPage.faq.items];
                            next[idx] = { ...next[idx], q: e.target.value };
                            updateSection("faq", "items", next);
                          }}
                          className={UI.input}
                        />
                      </div>
                      <div className="space-y-1 pr-8">
                        <label className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Answer</label>
                        <textarea
                          rows={2}
                          value={item.a || ""}
                          onChange={(e) => {
                            const next = [...aboutPage.faq.items];
                            next[idx] = { ...next[idx], a: e.target.value };
                            updateSection("faq", "items", next);
                          }}
                          className={UI.textarea}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
