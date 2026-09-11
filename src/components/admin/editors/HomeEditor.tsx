"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Loader2, Image as ImageIcon,
  LayoutTemplate, Type, Star, Briefcase, Users,
  List, Mail, BookOpen, ChevronRight, Check, CheckCircle2, ShieldCheck
} from "lucide-react";
import dynamic from "next/dynamic";
import ContentSelector from "@/components/admin/ContentSelector";
import ImageField from "@/components/admin/ImageField";
import BlogSelector from "@/components/admin/BlogSelector";
import IconSelector from "@/components/admin/IconSelector";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

import { UI } from "./styles";

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        hero: {
          label: "",
          title1: "",
          title2: "",
          description: "",
          ctaBook: "Request a Quote",
          ctaServices: "Explore Services",
          image: "",
          imageAlt: ""
        },
        stats: {
          items: [
            { value: "", label: "", icon: "Droplets" },
            { value: "", label: "", icon: "Droplets" },
            { value: "", label: "", icon: "Droplets" },
            { value: "", label: "", icon: "Droplets" }
          ]
        },
        services: {
          label: "Our Services",
          title: "",
          description: "",
          ctaAll: "View All Services",
          ctaAllUrl: "/services/",
          items: []
        },
        leadership: {
          label: "ABOUT US",
          title: "Your Trusted Partner in Oil & Pump Supply",
          desc1: "<p>We are a leading supplier of high-quality oil products, industrial pumps and related equipment, serving diverse industries across the region. With a commitment to quality, reliability and customer satisfaction, we ensure your operations never stop.</p>",
          photoBadge: "Quality Solutions for a Reliable Tomorrow",
          photoBadgeTitle: "Quality Solutions",
          photoBadgeSubtitle: "for a Reliable Tomorrow",
          image: "/images/about-us.jpg",
          imageAlt: "Oil & Pump Supply Facility",
          ctaMore: "Learn More About Us",
          ctaLink: "/about",
          stats: [
            { value: "20+",  label: "Years Experience" },
            { value: "100+", label: "Trusted Brands"   },
            { value: "500+", label: "Happy Clients"    },
            { value: "24/7", label: "Support"          }
          ]
        },
        process: {
          label: "OUR PROCESS",
          title: "How We Work",
          titleItalicWord: "Work",
          description: "From initial inquiry to long-term support, our process is designed to be simple, transparent and efficient — so you get the right solutions, exactly when you need them.",
          image: "",
          phaseLabel: "STEP",
          items: [
            {
              title: "Request a Quote",
              shortDescription: "Tell us what you need and get a quick, competitive quote.",
              description: "Share your requirements with our team. We'll review your needs and provide a competitive, no-obligation quote — fast and hassle-free.",
              ctaText: "GET A QUOTE",
              ctaUrl: "/contact-us/",
              image: "/images/trinity/process-1.jpg",
              icon: "FileText"
            },
            {
              title: "Consultation",
              shortDescription: "We understand your requirements and provide the best solution.",
              description: "Our expert engineering team assesses your technical specifications, fluid dynamics, and operational requirements to recommend optimal, cost-efficient pump systems.",
              ctaText: "SCHEDULE CONSULTATION",
              ctaUrl: "/contact-us/",
              image: "/images/trinity/process-2.jpg",
              icon: "MessageSquare"
            },
            {
              title: "Supply & Delivery",
              shortDescription: "We source, prepare and deliver on time.",
              description: "Fast-track logistics, certified equipment packaging, and guaranteed on-time site dispatch ensure zero operational downtime for your plant or drilling facility.",
              ctaText: "TRACK SHIPMENTS",
              ctaUrl: "/contact-us/",
              image: "/images/trinity/process-3.jpg",
              icon: "Truck"
            },
            {
              title: "After-Sales Support",
              shortDescription: "Ongoing support for maximum uptime.",
              description: "24/7 technical hotline, rapid OEM spare parts replacement, preventative field diagnostics, and certified technician maintenance for maximum equipment uptime.",
              ctaText: "GET SUPPORT",
              ctaUrl: "/contact-us/",
              image: "/images/trinity/process-4.jpg",
              icon: "Wrench"
            }
          ]
        },
        testimonials: {
          label: "TESTIMONIALS",
          title: "What Our Clients Say",
          testimonials: [],
          items: []
        },
        ctaBanner: {
          label: "GET IN TOUCH",
          title: "",
          description: "",
          button: "Request a Quote",
          buttonUrl: "/contact-us/",
          phone: "",
          email: "",
          image: ""
        },
        quote: {
          section: { badge: "GET IN TOUCH", headline: "", description: "" },
          formClinicPortal: "",
          formClinicPortalSub: "",
          formStyleSeatBtn: "",
          formClinicPortalUrl: "",
          formBtnSubmit: "Send Message",
          formSuccessToast: "Thank you! Your message has been sent.",
          trustHipa: "",
          trustResponse: "",
          services: []
        },
        faq: {
          section: { badge: "FAQ", headline: "Frequently Asked Questions", description: "", ctaText: "" },
          items: []
        },
        blogSection: {
          subtitle: "LATEST NEWS",
          title: "",
          ctaAll: "View All Articles",
          ctaReadMore: "Read More",
          viewAllLink: "/blogs/",
          selectedPosts: []
        },
        whyChooseUs: {
          badge: "WHY CHOOSE US",
          title: "",
          description: "",
          image: "",
          imageAlt: "",
          features: []
        },
        industries: {
          badge: "INDUSTRIES WE SERVE",
          title: "Trusted Across Multiple Industries",
          description: "We support a wide range of industries with reliable equipment and pumping solutions, helping businesses achieve greater efficiency and productivity.",
          ctaLabel: "View All Industries",
          ctaLink: "/industries",
          cards: [
            { image: "", title: "Oil & Gas",                subtitle: "Exploration & Production",   cta: "Learn More", ctaLink: "#" },
            { image: "", title: "Petrochemical",            subtitle: "Refining & Chemicals",       cta: "Learn More", ctaLink: "#" },
            { image: "", title: "Water & Wastewater",       subtitle: "Treatment & Management",     cta: "Learn More", ctaLink: "#" },
            { image: "", title: "Mining & Resources",       subtitle: "Extraction & Processing",    cta: "Learn More", ctaLink: "#" },
            { image: "", title: "Industrial Manufacturing", subtitle: "General Manufacturing",      cta: "Learn More", ctaLink: "#" },
          ]
        }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const updateSection = (section: string, field: string | null, value: any) => {
    setData((prev: any) => {
      const currentData = prev || {};
      const sectionData = currentData[section] || {};
      
      let newValue = value;
      if (typeof value === 'function') {
        const currentValue = field ? sectionData[field] : sectionData;
        newValue = value(currentValue);
      }

      const updatedSection = field ? {
        ...sectionData,
        [field]: newValue,
      } : newValue;

      return {
        ...currentData,
        [section]: updatedSection,
      };
    });
  };

  const tabs = [
    { id: "hero",        label: "1. Hero Banner",          icon: LayoutTemplate },
    { id: "stats",       label: "2. Stats & Achievements",  icon: Star },
    { id: "services",    label: "3. Services Showcase",     icon: Briefcase },
    { id: "industries",  label: "4. Industries We Serve",   icon: Briefcase },
    { id: "leadership",  label: "5. About Us",             icon: Users },
    { id: "whyChooseUs", label: "6. Why Choose Us",        icon: ShieldCheck },
    { id: "process",     label: "7. How We Work",          icon: List },
    { id: "testimonials", label: "8. Testimonials",        icon: Star },
    { id: "ctaBanner",   label: "9. CTA Banner",           icon: LayoutTemplate },
    { id: "contact",     label: "10. Contact & FAQs",      icon: Mail },
    { id: "blog",        label: "11. Blog Insights",       icon: BookOpen },
  ];

  return (
    <div className="bg-white max-w-4xl mx-auto pb-20">
      {/* Visual Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-8 text-[13px] border-b border-[#f0f0f1] pb-2 sticky top-0 bg-white z-10 pt-2 shadow-sm">
        {tabs.map((tab: any) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-medium transition-colors ${
                isActive
                  ? 'text-[#1d2327] font-bold bg-[#f0f0f1] border-b-2 border-[#2271b1]'
                  : 'text-[#2271b1] hover:text-[#135e96] hover:bg-[#f6f7f7]'
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#2271b1]" : "opacity-70"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="space-y-10"
        >

          {/* ═══════════════════════════════════════════════════════════════
              1. HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "hero" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Branding & Labels</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Top Badge / Label</label>
                    <input
                      type="text"
                      value={data.hero?.label || data.hero?.badge || ""}
                      onChange={(e) => {
                        updateSection("hero", "label", e.target.value);
                        updateSection("hero", "badge", e.target.value);
                      }}
                      className={UI.input}
                      placeholder="e.g. Trusted Oilfield Supplier • Est. 2005"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline — Line 1</label>
                      <input
                        type="text"
                        value={data.hero?.title1 || ""}
                        onChange={(e) => updateSection("hero", "title1", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Recover Faster."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline — Line 2 (Highlighted)</label>
                      <input
                        type="text"
                        value={data.hero?.title2 || ""}
                        onChange={(e) => updateSection("hero", "title2", e.target.value)}
                        className={UI.input + " font-bold text-[#2271b1]"}
                        placeholder="e.g. Perform Higher."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Hero Description Narrative</label>
                    <textarea
                      value={data.hero?.description || ""}
                      onChange={(e) => updateSection("hero", "description", e.target.value)}
                      className={UI.input + " h-24"}
                      placeholder="Short hero paragraph..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>2. Call To Action & Social Proof</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Button Label (Booking / Quote)</label>
                      <input
                        type="text"
                        value={data.hero?.ctaBook || ""}
                        onChange={(e) => updateSection("hero", "ctaBook", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Request a Quote"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button Label (Services)</label>
                      <input
                        type="text"
                        value={data.hero?.ctaServices || ""}
                        onChange={(e) => updateSection("hero", "ctaServices", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. EXPLORE SERVICES"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Button URL</label>
                      <input
                        type="text"
                        value={data.hero?.ctaBookUrl || data.hero?.bookingUrl || ""}
                        onChange={(e) => {
                          updateSection("hero", "ctaBookUrl", e.target.value);
                          updateSection("hero", "bookingUrl", e.target.value);
                        }}
                        className={UI.input}
                        placeholder="e.g. /contact-us or https://..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button URL</label>
                      <input
                        type="text"
                        value={data.hero?.ctaServicesUrl || ""}
                        onChange={(e) => updateSection("hero", "ctaServicesUrl", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. /#services or /services"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>3. Hero Background Image</h3>
                <div className={UI.card + " space-y-4"}>
                  <ImageField
                    label="Background Photography"
                    value={data.hero?.image || data.hero?.images?.[0] || ""}
                    onChange={(url) => {
                      updateSection("hero", "image", url);
                      updateSection("hero", "images", [url]);
                    }}
                    altValue={data.hero?.imageAlt || data.hero?.bgImageAlt || ""}
                    onAltChange={(alt) => {
                      updateSection("hero", "imageAlt", alt);
                      updateSection("hero", "bgImageAlt", alt);
                    }}
                    description="High resolution photo with dark contrast for hero background."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>4. Feature Badges (right side of the hero)</h3>
                <div className="space-y-3">
                  {(data.hero?.features || []).map((f: any, i: number) => (
                    <div key={i} className={UI.card + " space-y-3 relative"}>
                      <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                        <span className="text-[10px] font-bold text-[#646970] uppercase">Badge #{i + 1}</span>
                        <button
                          onClick={() => updateSection("hero", "features", (data.hero?.features || []).filter((_: any, idx: number) => idx !== i))}
                          className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <IconSelector
                          label="Icon"
                          value={f.icon || ""}
                          onChange={(val: string) => {
                            const list = [...(data.hero?.features || [])];
                            list[i] = { ...list[i], icon: val };
                            updateSection("hero", "features", list);
                          }}
                        />
                        <div className="space-y-1.5">
                          <label className={UI.label}>Title</label>
                          <input
                            type="text"
                            value={f.title || ""}
                            onChange={(e) => {
                              const list = [...(data.hero?.features || [])];
                              list[i] = { ...list[i], title: e.target.value };
                              updateSection("hero", "features", list);
                            }}
                            className={UI.input + " font-bold"}
                            placeholder="e.g. Premium Quality"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={UI.label}>Subtitle</label>
                          <input
                            type="text"
                            value={f.subtitle || ""}
                            onChange={(e) => {
                              const list = [...(data.hero?.features || [])];
                              list[i] = { ...list[i], subtitle: e.target.value };
                              updateSection("hero", "features", list);
                            }}
                            className={UI.input}
                            placeholder="e.g. Products"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => updateSection("hero", "features", [...(data.hero?.features || []), { icon: "ShieldCheck", title: "", subtitle: "" }])}
                    className={UI.buttonAdd}
                  >
                    + Add Feature Badge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              2. STATS BAR & ACHIEVEMENTS SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Horizontal Highlight Statistics Bar (4 Items)</h3>
                <p className="text-[12px] text-[#646970] -mt-2">These stats are displayed in the quick horizontal strip right under the hero section.</p>
                <div className="space-y-3">
                  {(data.stats?.items || []).map((s: any, i: number) => (
                    <div key={i} className={UI.card + " flex items-center gap-4 relative"}>
                      <span className="text-[11px] font-bold text-[#646970] w-6 flex-shrink-0">#{i + 1}</span>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <IconSelector
                            label="Icon"
                            value={s.icon || "Droplets"}
                            onChange={(val: string) => {
                              const newItems = [...(data.stats?.items || [])];
                              newItems[i] = { ...newItems[i], icon: val };
                              updateSection("stats", "items", newItems);
                            }}
                          />
                        </div>
                        <div>
                          <label className={UI.label}>Value (e.g. 100+, 20+)</label>
                          <input
                            type="text"
                            value={s.value || ""}
                            onChange={(e) => {
                              const newItems = [...(data.stats?.items || [])];
                              newItems[i] = { ...newItems[i], value: e.target.value };
                              updateSection("stats", "items", newItems);
                            }}
                            className={UI.inputLarge}
                          />
                        </div>
                        <div>
                          <label className={UI.label}>Label (e.g. Years of Experience)</label>
                          <input
                            type="text"
                            value={s.label || ""}
                            onChange={(e) => {
                              const newItems = [...(data.stats?.items || [])];
                              newItems[i] = { ...newItems[i], label: e.target.value };
                              updateSection("stats", "items", newItems);
                            }}
                            className={UI.input}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newItems = (data.stats?.items || []).filter((_: any, idx: number) => idx !== i);
                          updateSection("stats", "items", newItems);
                        }}
                        className="text-[#d63638] hover:bg-red-50 p-2 rounded"
                        title="Remove Stat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.stats?.items || [];
                      updateSection("stats", "items", [...current, { value: "", label: "" }]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Stat Item
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              3. SERVICES SHOWCASE SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "services" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Intro & Headlines</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Badge / Label</label>
                    <input
                      type="text"
                      value={data.services?.label || data.services?.badge || ""}
                      onChange={(e) => {
                        updateSection("services", "label", e.target.value);
                        updateSection("services", "badge", e.target.value);
                      }}
                      className={UI.input}
                      placeholder="e.g. Our Services"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Title</label>
                    <input
                      type="text"
                      value={data.services?.title || ""}
                      onChange={(e) => updateSection("services", "title", e.target.value)}
                      className={UI.input + " font-bold"}
                      placeholder="e.g. Comprehensive Oil & Pump Supply Solutions"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Description</label>
                    <textarea
                      value={typeof data.services?.description === 'string' ? data.services.description : ""}
                      onChange={(e) => updateSection("services", "description", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="Short text shown under the title"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>"View All" Button Label</label>
                      <input
                        type="text"
                        value={data.services?.ctaAll || ""}
                        onChange={(e) => updateSection("services", "ctaAll", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. View All Services"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>"View All" Button Link</label>
                      <input
                        type="text"
                        value={data.services?.ctaAllUrl || ""}
                        onChange={(e) => updateSection("services", "ctaAllUrl", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. /services/"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Card link label</label>
                      <input
                        type="text"
                        value={data.services?.ctaLearnMore || ""}
                        onChange={(e) => updateSection("services", "ctaLearnMore", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Learn more"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Featured Services Selection</h3>
                <p className="text-[12px] text-[#646970] -mt-2">Select and order the services shown as cards on the homepage (4 per view; more become a slider).</p>
                <ContentSelector
                  type="services"
                  label="Select Services to Feature on Homepage"
                  selectedItems={data.services?.items || []}
                  onSelect={(items) => {
                    updateSection("services", "items", items);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              5. ABOUT US SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "leadership" && (
            <div className="space-y-8">
              {/* 1. Header & Badges */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Badge & Headline</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Badge / Kicker</label>
                      <input
                        type="text"
                        value={data.leadership?.label || ""}
                        onChange={(e) => updateSection("leadership", "label", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. ABOUT US"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Main Title Headline</label>
                      <input
                        type="text"
                        value={data.leadership?.title || ""}
                        onChange={(e) => updateSection("leadership", "title", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Your Trusted Partner in Oil & Pump Supply"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Narrative Description */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>2. Narrative & Description</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Company Narrative Paragraph</label>
                    <textarea
                      value={data.leadership?.desc1 || ""}
                      onChange={(e) => updateSection("leadership", "desc1", e.target.value)}
                      rows={4}
                      className={UI.input + " h-28 leading-relaxed"}
                      placeholder="We are a leading supplier of high-quality oil products, industrial pumps and related equipment..."
                    />
                  </div>
                </div>
              </div>

              {/* 3. Section Media & Brass Overlay Badge */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>3. Media & Overlay Badge</h3>
                <div className={UI.card + " space-y-4"}>
                  <ImageField
                    label="About Us Feature Image"
                    value={data.leadership?.image || ""}
                    onChange={(url) => updateSection("leadership", "image", url)}
                    altValue={data.leadership?.imageAlt || ""}
                    onAltChange={(alt) => updateSection("leadership", "imageAlt", alt)}
                  />
                  <div className="pt-2 border-t border-[#f0f0f1]">
                    <h4 className="text-[13px] font-semibold text-[#1d2327] mb-3">Bottom-Left Overlay Badge</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <IconSelector
                          label="Badge Icon"
                          value={data.leadership?.photoBadgeIcon || "Droplets"}
                          onChange={(val: string) => updateSection("leadership", "photoBadgeIcon", val)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Badge Headline (Bold)</label>
                        <input
                          type="text"
                          value={data.leadership?.photoBadgeTitle || ""}
                          onChange={(e) => {
                            updateSection("leadership", "photoBadgeTitle", e.target.value);
                            updateSection("leadership", "photoBadge", `${e.target.value} ${data.leadership?.photoBadgeSubtitle || ""}`.trim());
                          }}
                          className={UI.input}
                          placeholder="e.g. Quality Solutions"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Badge Subtext</label>
                        <input
                          type="text"
                          value={data.leadership?.photoBadgeSubtitle || ""}
                          onChange={(e) => {
                            updateSection("leadership", "photoBadgeSubtitle", e.target.value);
                            updateSection("leadership", "photoBadge", `${data.leadership?.photoBadgeTitle || ""} ${e.target.value}`.trim());
                          }}
                          className={UI.input}
                          placeholder="e.g. for a Reliable Tomorrow"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Dedicated About Us Stats (Independent from StatsBar) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={UI.sectionHeader}>4. About Us Dedicated Stats (4 Highlights)</h3>
                    <p className="text-[12px] text-[#646970] mt-0.5">
                      Dedicated numbers displayed horizontally directly under the description.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {(() => {
                    const statsList = Array.isArray(data.leadership?.stats) && data.leadership.stats.length > 0
                      ? data.leadership.stats
                      : [
                          { value: "20+",  label: "Years Experience" },
                          { value: "100+", label: "Trusted Brands"   },
                          { value: "500+", label: "Happy Clients"    },
                          { value: "24/7", label: "Support"          }
                        ];

                    return (
                      <>
                        {statsList.map((statItem: any, idx: number) => (
                          <div key={idx} className={UI.card + " flex items-center gap-4 relative"}>
                            <span className="text-[11px] font-bold text-[#646970] w-6 flex-shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className={UI.label}>Stat Number / Value</label>
                                <input
                                  type="text"
                                  value={statItem.value || ""}
                                  onChange={(e) => {
                                    const updated = [...statsList];
                                    updated[idx] = { ...updated[idx], value: e.target.value };
                                    updateSection("leadership", "stats", updated);
                                  }}
                                  className={UI.inputLarge}
                                  placeholder="e.g. 20+, 100+, 24/7"
                                />
                              </div>
                              <div>
                                <label className={UI.label}>Stat Label</label>
                                <input
                                  type="text"
                                  value={statItem.label || ""}
                                  onChange={(e) => {
                                    const updated = [...statsList];
                                    updated[idx] = { ...updated[idx], label: e.target.value };
                                    updateSection("leadership", "stats", updated);
                                  }}
                                  className={UI.input}
                                  placeholder="e.g. Years Experience"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = statsList.filter((_: any, i: number) => i !== idx);
                                updateSection("leadership", "stats", updated);
                              }}
                              className="text-[#d63638] hover:bg-red-50 p-2 rounded transition-colors"
                              title="Delete Stat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...statsList, { value: "New", label: "Description" }];
                            updateSection("leadership", "stats", updated);
                          }}
                          className={UI.buttonAdd}
                        >
                          + Add About Stat
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 5. Call to Action Button */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>5. Call to Action Button</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button Label</label>
                      <input
                        type="text"
                        value={data.leadership?.ctaMore || ""}
                        onChange={(e) => updateSection("leadership", "ctaMore", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Learn More About Us"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Destination URL</label>
                      <input
                        type="text"
                        value={data.leadership?.ctaLink || ""}
                        onChange={(e) => updateSection("leadership", "ctaLink", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. /about or /contact-us"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              6. WHY CHOOSE US SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "whyChooseUs" && (
            <div className="space-y-8">
              {/* 1. Badge & Headline */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Badge & Headline</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Badge / Kicker</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.badge || data.whyChooseUs?.section?.badge || ""}
                        onChange={(e) => {
                          updateSection("whyChooseUs", "badge", e.target.value);
                          updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), badge: e.target.value });
                        }}
                        className={UI.input}
                        placeholder="e.g. WHY CHOOSE US"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Main Title Headline</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.title || data.whyChooseUs?.headline || data.whyChooseUs?.section?.headline || ""}
                        onChange={(e) => {
                          updateSection("whyChooseUs", "title", e.target.value);
                          updateSection("whyChooseUs", "headline", e.target.value);
                          updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), headline: e.target.value });
                        }}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Why Businesses Trust Us"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Narrative Description */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>2. Narrative & Description</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Description</label>
                    <textarea
                      value={data.whyChooseUs?.description || data.whyChooseUs?.section?.description || ""}
                      onChange={(e) => {
                        updateSection("whyChooseUs", "description", e.target.value);
                        updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), description: e.target.value });
                      }}
                      rows={4}
                      className={UI.input + " h-24 leading-relaxed"}
                      placeholder="We go beyond just supplying products — we fuel your operations and success with reliable, high-quality pump & oilfield solutions."
                    />
                  </div>
                </div>
              </div>

              {/* 3. Right-Side Feature Image */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>3. Right-Side Feature Image</h3>
                <div className={UI.card + " space-y-4"}>
                  <ImageField
                    label="Facility / Engineer Inspection Photo"
                    value={data.whyChooseUs?.image || ""}
                    onChange={(url) => updateSection("whyChooseUs", "image", url)}
                    altValue={data.whyChooseUs?.imageAlt || ""}
                    onAltChange={(alt) => updateSection("whyChooseUs", "imageAlt", alt)}
                  />
                </div>
              </div>

              {/* 4. Features & Value Propositions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={UI.sectionHeader}>4. Features & Value Propositions</h3>
                    <p className="text-[12px] text-[#646970] mt-0.5">
                      Business benefits displayed in a 3-column layout.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(() => {
                    const featureList = Array.isArray(data.whyChooseUs?.features) && data.whyChooseUs.features.length > 0
                      ? data.whyChooseUs.features
                      : [
                          { title: "Premium Quality Products", description: "Engineered to withstand harsh operating conditions.", icon: "ShieldCheck" },
                          { title: "Competitive Pricing", description: "Direct supplier rates that protect your bottom line.", icon: "Coins" },
                          { title: "Fast & Reliable Delivery", description: "Rapid turnaround times to minimize costly downtime.", icon: "Truck" },
                          { title: "Expert Technical Support", description: "Dedicated engineers ready to assist with sizing & specs.", icon: "Headphones" },
                          { title: "Wide Product Range", description: "Complete inventory of pumps, parts, and fluid systems.", icon: "Package" },
                          { title: "Customer Satisfaction", description: "Proven track record with regional industrial operators.", icon: "Award" }
                        ];

                    return (
                      <>
                        {featureList.map((item: any, idx: number) => (
                          <div key={idx} className={UI.card + " flex flex-col gap-3 relative"}>
                            <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
                              <span className="text-[12px] font-bold text-[#1d2327]">
                                Feature #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = featureList.filter((_: any, i: number) => i !== idx);
                                  updateSection("whyChooseUs", "features", updated);
                                }}
                                className="text-[#d63638] hover:bg-red-50 p-1.5 rounded transition-colors text-[12px] flex items-center gap-1"
                                title="Remove Feature"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1.5">
                                <IconSelector
                                  label="Icon"
                                  value={item.icon || "ShieldCheck"}
                                  onChange={(val: string) => {
                                    const updated = [...featureList];
                                    updated[idx] = { ...updated[idx], icon: val };
                                    updateSection("whyChooseUs", "features", updated);
                                  }}
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1.5">
                                <label className={UI.label}>Feature Title</label>
                                <input
                                  type="text"
                                  value={item.title || ""}
                                  onChange={(e) => {
                                    const updated = [...featureList];
                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                    updateSection("whyChooseUs", "features", updated);
                                  }}
                                  className={UI.input + " font-semibold"}
                                  placeholder="e.g. Premium Quality Products"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className={UI.label}>Short Description (Optional)</label>
                              <input
                                type="text"
                                value={item.description || ""}
                                onChange={(e) => {
                                  const updated = [...featureList];
                                  updated[idx] = { ...updated[idx], description: e.target.value };
                                  updateSection("whyChooseUs", "features", updated);
                                }}
                                className={UI.input}
                                placeholder="e.g. Engineered to withstand harsh operating conditions."
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...featureList, { title: "New Feature", description: "", icon: "ShieldCheck" }];
                            updateSection("whyChooseUs", "features", updated);
                          }}
                          className={UI.buttonAdd}
                        >
                          + Add Feature
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              7. HOW WE WORK (PROCESS) SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "process" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Intro</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Badge</label>
                      <input
                        type="text"
                        value={data.process?.label || ""}
                        onChange={(e) => updateSection("process", "label", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. OUR PROCESS"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Title</label>
                      <input
                        type="text"
                        value={data.process?.title || ""}
                        onChange={(e) => updateSection("process", "title", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. How We Work"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Italic Accent Word in Title</label>
                      <input
                        type="text"
                        value={data.process?.titleItalicWord || ""}
                        onChange={(e) => updateSection("process", "titleItalicWord", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Work"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Step Chip Prefix</label>
                      <input
                        type="text"
                        value={data.process?.phaseLabel || ""}
                        onChange={(e) => updateSection("process", "phaseLabel", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. STEP"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Description</label>
                    <textarea
                      value={data.process?.description || ""}
                      onChange={(e) => updateSection("process", "description", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="From initial inquiry to long-term support, our process is designed to be simple, transparent and efficient..."
                    />
                  </div>
                  <ImageField
                    label="Section Background Image (optional, shown faintly behind the whole section)"
                    value={data.process?.image || ""}
                    onChange={(url: string) => updateSection("process", "image", url)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Process Steps</h3>
                <p className="text-[12px] text-[#646970]">Step numbers (01, 02, ...) are generated automatically from the order below. Each step has its own showcase card with image, title, detailed description, and CTA button.</p>
                <div className="space-y-6">
                  {(data.process?.items || []).map((step: any, i: number) => (
                    <div key={i} className={UI.card + " space-y-4 relative border-l-4 border-l-[#2271b1]"}>
                      <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                        <span className="text-[11px] font-bold text-[#2271b1] uppercase">Step {String(i + 1).padStart(2, "0")} — {step.title || "Untitled"}</span>
                        <button
                          onClick={() => {
                            const newItems = data.process.items.filter((_: any, idx: number) => idx !== i);
                            updateSection("process", "items", newItems);
                          }}
                          className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                          title="Delete Step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <IconSelector
                            label="Icon"
                            value={step.icon || ""}
                            onChange={(val: string) => {
                              const newItems = [...data.process.items];
                              newItems[i] = { ...newItems[i], icon: val };
                              updateSection("process", "items", newItems);
                            }}
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className={UI.label}>Step Title</label>
                          <input
                            type="text"
                            value={step.title || ""}
                            onChange={(e) => {
                              const newItems = [...data.process.items];
                              newItems[i] = { ...newItems[i], title: e.target.value };
                              updateSection("process", "items", newItems);
                            }}
                            className={UI.input + " font-bold"}
                            placeholder="e.g. Request a Quote"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className={UI.label}>Timeline Short Summary (Shown on the Left)</label>
                        <input
                          type="text"
                          value={step.shortDescription || ""}
                          onChange={(e) => {
                            const newItems = [...data.process.items];
                            newItems[i] = { ...newItems[i], shortDescription: e.target.value };
                            updateSection("process", "items", newItems);
                          }}
                          className={UI.input}
                          placeholder="e.g. Tell us what you need and get a quick, competitive quote."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={UI.label}>Showcase Detailed Description (Shown on the Right Card)</label>
                        <textarea
                          value={step.description || ""}
                          onChange={(e) => {
                            const newItems = [...data.process.items];
                            newItems[i] = { ...newItems[i], description: e.target.value };
                            updateSection("process", "items", newItems);
                          }}
                          className={UI.input + " h-20"}
                          placeholder="e.g. Share your requirements with our team. We'll review your needs and provide a competitive, no-obligation quote — fast and hassle-free."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className={UI.label}>CTA Button Text</label>
                          <input
                            type="text"
                            value={step.ctaText || ""}
                            onChange={(e) => {
                              const newItems = [...data.process.items];
                              newItems[i] = { ...newItems[i], ctaText: e.target.value };
                              updateSection("process", "items", newItems);
                            }}
                            className={UI.input}
                            placeholder="e.g. GET A QUOTE"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={UI.label}>CTA Button URL</label>
                          <input
                            type="text"
                            value={step.ctaUrl || ""}
                            onChange={(e) => {
                              const newItems = [...data.process.items];
                              newItems[i] = { ...newItems[i], ctaUrl: e.target.value };
                              updateSection("process", "items", newItems);
                            }}
                            className={UI.input}
                            placeholder="e.g. /contact-us/"
                          />
                        </div>
                      </div>

                      <ImageField
                        label="Step Card Image"
                        value={step.image || ""}
                        onChange={(url: string) => {
                          const newItems = [...data.process.items];
                          newItems[i] = { ...newItems[i], image: url };
                          updateSection("process", "items", newItems);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.process?.items || [];
                      updateSection("process", "items", [
                        ...current,
                        {
                          title: "New Step",
                          shortDescription: "Short summary for timeline.",
                          description: "Full description for the showcase card.",
                          ctaText: "LEARN MORE",
                          ctaUrl: "/contact-us/",
                          image: "/images/trinity/process-1.jpg",
                          icon: "ClipboardList"
                        }
                      ]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Process Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              8. TESTIMONIALS SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "testimonials" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Intro</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Badge</label>
                      <input
                        type="text"
                        value={data.testimonials?.label || ""}
                        onChange={(e) => updateSection("testimonials", "label", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. TESTIMONIALS"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Title</label>
                      <input
                        type="text"
                        value={data.testimonials?.title || ""}
                        onChange={(e) => updateSection("testimonials", "title", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. What Our Clients Say"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Testimonial Cards</h3>
                <p className="text-[12px] text-[#646970] -mt-2">Each selected review becomes a card showing its quote, author name, role, and avatar. Up to three cards show at a time (fewer on small screens); the row slides automatically.</p>
                <ContentSelector
                  type="reviews"
                  label="Select Reviews to Display"
                  selectedItems={data.testimonials?.testimonials || data.testimonials?.items || []}
                  onSelect={(items) => {
                    updateSection("testimonials", "testimonials", items);
                    updateSection("testimonials", "items", items);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              9. CTA BANNER SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "ctaBanner" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>CTA Banner</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Badge</label>
                    <input
                      type="text"
                      value={data.ctaBanner?.label || data.ctaBanner?.tagline || ""}
                      onChange={(e) => {
                        updateSection("ctaBanner", "label", e.target.value);
                        updateSection("ctaBanner", "tagline", e.target.value);
                      }}
                      className={UI.input}
                      placeholder="e.g. GET IN TOUCH"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Phone (shown beside the button)</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.phone || ""}
                        onChange={(e) => updateSection("ctaBanner", "phone", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. +92 300 123 4567"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Email (shown beside the button)</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.email || ""}
                        onChange={(e) => updateSection("ctaBanner", "email", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. info@company.com"
                      />
                    </div>
                  </div>
                  <ImageField
                    label="Background Image (optional, shown faintly behind the banner)"
                    value={data.ctaBanner?.image || ""}
                    onChange={(url: string) => updateSection("ctaBanner", "image", url)}
                  />
                  <div className="space-y-1.5">
                    <label className={UI.label}>Headline Title</label>
                    <input
                      type="text"
                      value={data.ctaBanner?.title || ""}
                      onChange={(e) => updateSection("ctaBanner", "title", e.target.value)}
                      className={UI.input + " font-bold text-lg"}
                      placeholder="e.g. Need Oilfield Equipment or Pump Supply?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Description Narrative</label>
                    <textarea
                      value={data.ctaBanner?.description || ""}
                      onChange={(e) => updateSection("ctaBanner", "description", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="Book your appointment today and start your journey..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Button Text Label</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.button || ""}
                        onChange={(e) => updateSection("ctaBanner", "button", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Request a Quote"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Button Link URL (Optional override)</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.buttonUrl || data.ctaBanner?.btnUrl || ""}
                        onChange={(e) => {
                          updateSection("ctaBanner", "buttonUrl", e.target.value);
                          updateSection("ctaBanner", "btnUrl", e.target.value);
                        }}
                        className={UI.input}
                        placeholder="e.g. /contact-us/"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              10. CONTACT FORM & FAQ SECTION (QAForm)
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "contact" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Contact Form</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Form Section Badge</label>
                      <input
                        type="text"
                        value={data.quote?.section?.badge || "GET IN TOUCH"}
                        onChange={(e) => updateSection("quote", "section", { ...(data.quote?.section || {}), badge: e.target.value })}
                        className={UI.input}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Form Headline</label>
                      <input
                        type="text"
                        value={data.quote?.section?.headline || "Have Questions? Let's Connect."}
                        onChange={(e) => updateSection("quote", "section", { ...(data.quote?.section || {}), headline: e.target.value })}
                        className={UI.input + " font-bold"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Description</label>
                    <textarea
                      value={data.quote?.section?.description || ""}
                      onChange={(e) => updateSection("quote", "section", { ...(data.quote?.section || {}), description: e.target.value })}
                      className={UI.input + " h-20"}
                      placeholder="Short text shown under the form title"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#f0f0f1]">
                    <p className="text-[12px] text-[#646970] mb-3">Call banner shown above the form. Leave the tag and subtitle empty to hide it.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner Tag</label>
                        <input
                          type="text"
                          value={data.quote?.formClinicPortal || ""}
                          onChange={(e) => updateSection("quote", "formClinicPortal", e.target.value)}
                          className={UI.input}
                          placeholder="e.g. DIRECT FIELD DISPATCH"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner Subtitle</label>
                        <input
                          type="text"
                          value={data.quote?.formClinicPortalSub || ""}
                          onChange={(e) => updateSection("quote", "formClinicPortalSub", e.target.value)}
                          className={UI.input}
                          placeholder="e.g. Call our office at 830-279-3996"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner Button Label</label>
                        <input
                          type="text"
                          value={data.quote?.formStyleSeatBtn || ""}
                          onChange={(e) => updateSection("quote", "formStyleSeatBtn", e.target.value)}
                          className={UI.input}
                          placeholder="e.g. CALL 830-279-3996"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner Link (URL or tel:)</label>
                        <input
                          type="text"
                          value={data.quote?.formClinicPortalUrl || ""}
                          onChange={(e) => updateSection("quote", "formClinicPortalUrl", e.target.value)}
                          className={UI.input}
                          placeholder="e.g. tel:8302793996 — if empty, the phone in the text above is used"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Submit Button Label</label>
                      <input
                        type="text"
                        value={data.quote?.formBtnSubmit || ""}
                        onChange={(e) => updateSection("quote", "formBtnSubmit", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Request Quote"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Trust Badge 1 (under the form)</label>
                      <input
                        type="text"
                        value={data.quote?.trustHipa || ""}
                        onChange={(e) => updateSection("quote", "trustHipa", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. USA-Manufactured Parts"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Trust Badge 2 (under the form)</label>
                      <input
                        type="text"
                        value={data.quote?.trustResponse || ""}
                        onChange={(e) => updateSection("quote", "trustResponse", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. 24/7 Field Support"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f0f0f1]">
                    <p className="text-[12px] text-[#646970] mb-3">Form field labels and placeholders.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        ["formNameLabel", "Name label", "Full Name"], ["formNamePlaceholder", "Name placeholder", "Your name"],
                        ["formEmailLabel", "Email label", "Email Address"], ["formEmailPlaceholder", "Email placeholder", "you@company.com"],
                        ["formPhoneLabel", "Phone label", "Phone Number"], ["formPhonePlaceholder", "Phone placeholder", "Your phone number"],
                        ["formServiceLabel", "Service label", "Service"], ["formServicePlaceholder", "Service placeholder", "Select a service"],
                        ["formMessageLabel", "Message label", "Message"], ["formMessagePlaceholder", "Message placeholder", "Tell us what you need..."],
                        ["formBtnSuccess", "Button text after sending", "Message Sent"], ["formSuccessToast", "Success message", "Thank you! Your message has been sent."],
                        ["panelPhoneLabel", "Info panel: phone label", "Call us"], ["panelEmailLabel", "Info panel: email label", "Email us"],
                        ["panelAddressLabel", "Info panel: address label", "Visit us"],
                      ].map(([key, lbl, ph]) => (
                        <div key={key} className="space-y-1.5">
                          <label className={UI.label}>{lbl}</label>
                          <input
                            type="text"
                            value={data.quote?.[key] || ""}
                            onChange={(e) => updateSection("quote", key, e.target.value)}
                            className={UI.input}
                            placeholder={`e.g. ${ph}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Form Service Categories Dropdown Options</h3>
                <div className="space-y-3">
                  {(data.quote?.services || []).map((s: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={typeof s === 'string' ? s : (s.label || s.title || "")}
                        onChange={(e) => {
                          const newServices = [...(data.quote?.services || [])];
                          newServices[i] = { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') };
                          updateSection("quote", "services", newServices);
                        }}
                        className={UI.input}
                        placeholder="Service Category Name"
                      />
                      <button
                        onClick={() => {
                          const newServices = data.quote.services.filter((_: any, idx: number) => idx !== i);
                          updateSection("quote", "services", newServices);
                        }}
                        className="text-[#d63638] hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.quote?.services || [];
                      updateSection("quote", "services", [...current, { label: "New Option", value: "new-option" }]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Dropdown Option
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>3. Homepage FAQ Accordion</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>FAQ Badge</label>
                      <input
                        type="text"
                        value={data.faq?.section?.badge || ""}
                        onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), badge: e.target.value })}
                        className={UI.input}
                        placeholder="e.g. FAQ"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>FAQ Section Title</label>
                      <input
                        type="text"
                        value={data.faq?.section?.headline || data.faq?.section?.title || ""}
                        onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), headline: e.target.value, title: e.target.value })}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Frequently Asked Questions"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>FAQ Description</label>
                    <textarea
                      value={data.faq?.section?.description || ""}
                      onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), description: e.target.value })}
                      className={UI.input + " h-20"}
                      placeholder="Short text shown under the FAQ title"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>"Still have a question" link text (optional — links to your contact email/phone; leave empty to hide)</label>
                    <input
                      type="text"
                      value={data.faq?.section?.ctaText || ""}
                      onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), ctaText: e.target.value })}
                      className={UI.input}
                      placeholder="e.g. Still have a question? Contact us"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {(data.faq?.items || []).map((faq: any, i: number) => (
                    <div key={i} className={UI.card + " space-y-3 relative"}>
                      <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                        <span className="text-[10px] font-bold text-[#646970] uppercase">Question #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newFaqs = data.faq.items.filter((_: any, idx: number) => idx !== i);
                            updateSection("faq", "items", newFaqs);
                          }}
                          className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Question</label>
                        <input
                          type="text"
                          value={faq.question || faq.q || ""}
                          onChange={(e) => {
                            const newFaqs = [...data.faq.items];
                            newFaqs[i] = { ...newFaqs[i], question: e.target.value, q: e.target.value };
                            updateSection("faq", "items", newFaqs);
                          }}
                          className={UI.input + " font-bold"}
                          placeholder="e.g. What areas do you deliver to?"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Answer</label>
                        <textarea
                          value={faq.answer || faq.a || ""}
                          onChange={(e) => {
                            const newFaqs = [...data.faq.items];
                            newFaqs[i] = { ...newFaqs[i], answer: e.target.value, a: e.target.value };
                            updateSection("faq", "items", newFaqs);
                          }}
                          className={UI.input + " h-24"}
                          placeholder="Answer text..."
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.faq?.items || [];
                      updateSection("faq", "items", [...current, { question: "", answer: "" }]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add FAQ Item
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              11. BLOG INSIGHTS SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "blog" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Intro & Headlines</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Badge / Subtitle</label>
                      <input
                        type="text"
                        value={data.blogSection?.subtitle || ""}
                        onChange={(e) => updateSection("blogSection", "subtitle", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. FROM THE BLOG"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Title</label>
                      <input
                        type="text"
                        value={data.blogSection?.title || ""}
                        onChange={(e) => updateSection("blogSection", "title", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Insights & Industry Updates"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>"View All" Button Text</label>
                      <input
                        type="text"
                        value={data.blogSection?.ctaAll || ""}
                        onChange={(e) => updateSection("blogSection", "ctaAll", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. View All Articles"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>"Read More" Link Text</label>
                      <input
                        type="text"
                        value={data.blogSection?.ctaReadMore || ""}
                        onChange={(e) => updateSection("blogSection", "ctaReadMore", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Read Article"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>"View All" Button Link</label>
                    <input
                      type="text"
                      value={data.blogSection?.viewAllLink || ""}
                      onChange={(e) => updateSection("blogSection", "viewAllLink", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. /blogs/"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Featured Blog Posts Selection</h3>
                <BlogSelector
                  selectedIds={data.blogSection?.selectedPosts || []}
                  onChange={(ids) => updateSection("blogSection", "selectedPosts", ids)}
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              4. INDUSTRIES WE SERVE SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "industries" && (
            <div className="space-y-8">

              {/* Section Header Fields */}
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Header</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Badge / Top Label</label>
                      <input
                        type="text"
                        value={data.industries?.badge || ""}
                        onChange={(e) => updateSection("industries", "badge", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. INDUSTRIES WE SERVE"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Title</label>
                      <input
                        type="text"
                        value={data.industries?.title || ""}
                        onChange={(e) => updateSection("industries", "title", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Trusted Across Multiple Industries"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Description</label>
                    <textarea
                      value={data.industries?.description || ""}
                      onChange={(e) => updateSection("industries", "description", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="We support a wide range of industries with reliable equipment..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button Label</label>
                      <input
                        type="text"
                        value={data.industries?.ctaLabel || ""}
                        onChange={(e) => updateSection("industries", "ctaLabel", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. View All Industries"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button Link</label>
                      <input
                        type="text"
                        value={data.industries?.ctaLink || ""}
                        onChange={(e) => updateSection("industries", "ctaLink", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. /industries"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Industry Cards */}
              <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Industry Cards</h3>
                <p className="text-[12px] text-[#646970] -mt-2">Add up to 6 industry cards. Each card shows an image, title, subtitle and optional CTA.</p>
                <div className="space-y-3">
                  {(data.industries?.cards || []).map((card: any, i: number) => (
                    <div key={i} className={UI.card + " space-y-3 relative"}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#646970]">Card #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newCards = (data.industries?.cards || []).filter((_: any, idx: number) => idx !== i);
                            updateSection("industries", "cards", newCards);
                          }}
                          className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                          title="Remove Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image */}
                      <ImageField
                        label="Card Image"
                        value={card.image || ""}
                        onChange={(url) => {
                          const newCards = [...(data.industries?.cards || [])];
                          newCards[i] = { ...newCards[i], image: url };
                          updateSection("industries", "cards", newCards);
                        }}
                        altValue={card.title || ""}
                        onAltChange={() => {}}
                        description="Recommended: 400×280px landscape image"
                      />

                      {/* Title & Subtitle */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className={UI.label}>Card Title</label>
                          <input
                            type="text"
                            value={card.title || ""}
                            onChange={(e) => {
                              const newCards = [...(data.industries?.cards || [])];
                              newCards[i] = { ...newCards[i], title: e.target.value };
                              updateSection("industries", "cards", newCards);
                            }}
                            className={UI.input}
                            placeholder="e.g. Oil & Gas"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={UI.label}>Subtitle / Tag</label>
                          <input
                            type="text"
                            value={card.subtitle || ""}
                            onChange={(e) => {
                              const newCards = [...(data.industries?.cards || [])];
                              newCards[i] = { ...newCards[i], subtitle: e.target.value };
                              updateSection("industries", "cards", newCards);
                            }}
                            className={UI.input}
                            placeholder="e.g. Exploration & Production"
                          />
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className={UI.label}>CTA Label</label>
                          <input
                            type="text"
                            value={card.cta || ""}
                            onChange={(e) => {
                              const newCards = [...(data.industries?.cards || [])];
                              newCards[i] = { ...newCards[i], cta: e.target.value };
                              updateSection("industries", "cards", newCards);
                            }}
                            className={UI.input}
                            placeholder="e.g. Learn More"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={UI.label}>CTA Link</label>
                          <input
                            type="text"
                            value={card.ctaLink || ""}
                            onChange={(e) => {
                              const newCards = [...(data.industries?.cards || [])];
                              newCards[i] = { ...newCards[i], ctaLink: e.target.value };
                              updateSection("industries", "cards", newCards);
                            }}
                            className={UI.input}
                            placeholder="e.g. /industries/oil-gas"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const current = data.industries?.cards || [];
                      updateSection("industries", "cards", [
                        ...current,
                        { image: "", title: "", subtitle: "", cta: "Learn More", ctaLink: "#" }
                      ]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Industry Card
                  </button>
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
