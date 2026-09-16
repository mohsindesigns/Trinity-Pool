"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Type, BookOpen, Megaphone } from "lucide-react";
import dynamic from "next/dynamic";
import BlogSelector from "@/components/admin/BlogSelector";
import ImageField from "@/components/admin/ImageField";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

import { UI } from "./styles";

export default function BlogEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        label: "Recovery Insights",
        titleLine1: "Our",
        titleLine2: "Journal.",
        description: "Explore our latest articles, insights, and clinical tips on deep tissue therapy, mobility, and athletic recovery.",
        ctaReadMore: "Read More",
        emptyStateTitle: "No posts yet",
        emptyStateDescription: "Check back later for new updates.",
        selectedPosts: []
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const updateBlogContent = (field: string, value: any) => {
    setData({
      ...data,
      [field]: value
    });
  };

  const updateHeader = (field: string, value: any) => {
    setData({
      ...data,
      header: { ...(data.header || {}), [field]: value }
    });
  };

  const updateCtaBanner = (field: string, value: any) => {
    setData({
      ...data,
      ctaBanner: { ...(data.ctaBanner || {}), [field]: value }
    });
  };

  const tabs = [
    { id: "header", label: "Blog Page Narrative", icon: Type, title: "Blog Journal Introduction" },
    { id: "posts", label: "Selected Posts", icon: BookOpen, title: "Manage Visible Blog Posts" },
    { id: "cta", label: "CTA Banner", icon: Megaphone, title: "Bottom Call-To-Action Banner" }
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  return (
    <div className="bg-white">
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6">
        <div className="mb-6">
           <h2 className={UI.sectionHeader}>{activeTabTitle}</h2>
           <p className="text-[12px] text-[#646970] -mt-2">Configure the headline, intro narrative, and visible blog posts of the main blog index page.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="space-y-8 pb-10"
          >
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-6">
                <div className={UI.card + " space-y-5"}>
                  <ImageField
                    label="Hero Background Image"
                    value={data.header?.image || ""}
                    onChange={(url: string) => updateHeader("image", url)}
                    altValue={data.header?.imageAlt || ""}
                    onAltChange={(alt: string) => updateHeader("imageAlt", alt)}
                    description="Full-bleed dark hero photo behind the headline."
                  />

                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Badge</label>
                    <input 
                      type="text" 
                      value={data.label || ""} 
                      onChange={(e) => updateBlogContent("label", e.target.value)} 
                      className={UI.input} 
                      placeholder="e.g. Recovery Insights" 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className={UI.label}>Main Title</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-[#646970] font-semibold uppercase">Prefix Text (Plain)</label>
                        <input 
                          type="text" 
                          value={data.titleLine1 || ""} 
                          onChange={(e) => updateBlogContent("titleLine1", e.target.value)} 
                          className={UI.input} 
                          placeholder="e.g. Our" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-[#646970] font-semibold uppercase">Highlight Text (Italic/Gold)</label>
                        <input 
                          type="text" 
                          value={data.titleLine2 || ""} 
                          onChange={(e) => updateBlogContent("titleLine2", e.target.value)} 
                          className={UI.input + " font-bold border-[#2271b1]"} 
                          placeholder="e.g. Journal." 
                        />
                      </div>
                    </div>
                  </div>

                  <RichTextEditor 
                    label="Intro Narrative Description" 
                    content={data.description || ""} 
                    onChange={(html) => updateBlogContent("description", html)} 
                  />

                  <div className="space-y-1.5">
                    <label className={UI.label}>Read More Button Label</label>
                    <input
                      type="text"
                      value={data.ctaReadMore || ""}
                      onChange={(e) => updateBlogContent("ctaReadMore", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. Read More"
                    />
                  </div>
                </div>

                <div className={UI.card + " space-y-5"}>
                  <label className={UI.label}>Empty State (shown when there are no posts)</label>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-[#646970] font-semibold uppercase">Title</label>
                    <input
                      type="text"
                      value={data.emptyStateTitle || ""}
                      onChange={(e) => updateBlogContent("emptyStateTitle", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. No posts yet"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-[#646970] font-semibold uppercase">Description</label>
                    <input
                      type="text"
                      value={data.emptyStateDescription || ""}
                      onChange={(e) => updateBlogContent("emptyStateDescription", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. Check back later for new updates."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-6">
                <BlogSelector
                  selectedIds={data.selectedPosts || []}
                  onChange={(ids) => updateBlogContent("selectedPosts", ids)}
                />
              </div>
            )}

            {activeTab === "cta" && (
              <div className="max-w-3xl space-y-6">
                <div className={UI.card + " space-y-5"}>
                  <p className="text-[12px] text-[#646970] -mt-1">
                    Shown at the bottom of the blog page, below the article grid. This is independent from the homepage's CTA banner — editing one never changes the other.
                  </p>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Badge</label>
                    <input
                      type="text"
                      value={data.ctaBanner?.label || ""}
                      onChange={(e) => updateCtaBanner("label", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. NEED PARTS OR SERVICE?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Title</label>
                    <input
                      type="text"
                      value={data.ctaBanner?.title || ""}
                      onChange={(e) => updateCtaBanner("title", e.target.value)}
                      className={UI.input + " font-bold"}
                      placeholder="e.g. Talk to Our Team About Your Well."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Description</label>
                    <textarea
                      value={data.ctaBanner?.description || ""}
                      onChange={(e) => updateCtaBanner("description", e.target.value)}
                      className={UI.input + " h-24"}
                      placeholder="e.g. From sucker rods to rod pump tracking, our Odessa shop is ready to help."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Button Text</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.button || ""}
                        onChange={(e) => updateCtaBanner("button", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Get a Quote"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Button Link</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.buttonUrl || ""}
                        onChange={(e) => updateCtaBanner("buttonUrl", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. /contact-us/"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
