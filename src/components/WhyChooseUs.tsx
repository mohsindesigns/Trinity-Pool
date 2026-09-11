"use client";

import { motion } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import {
  ShieldCheck, Coins, Truck, Headphones, Package, Award,
  Shield, Star, Zap, CheckCircle2, Clock, Flame, Users,
  Layers, Settings, LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Coins,
  Truck,
  Headphones,
  Package,
  Award,
  Shield,
  Star,
  Zap,
  CheckCircle2,
  Clock,
  Flame,
  Users,
  Layers,
  Settings
};

const resolveFeatureIcon = (name?: string): LucideIcon => {
  if (!name) return ShieldCheck;
  if (iconMap[name]) return iconMap[name];
  const lower = name.toLowerCase().trim();
  for (const k of Object.keys(iconMap)) {
    if (k.toLowerCase() === lower) return iconMap[k];
  }
  return ShieldCheck;
};

export default function WhyChooseUs() {
  const { whyChooseUs } = useContent();

  const badge = whyChooseUs?.badge || whyChooseUs?.section?.badge || "WHY CHOOSE US";
  const title = whyChooseUs?.title || whyChooseUs?.headline || whyChooseUs?.section?.headline || "Why Businesses Trust Us";
  const description = whyChooseUs?.description || whyChooseUs?.section?.description || "We go beyond just supplying products — we fuel your operations and success with reliable, high-quality pump & oilfield solutions.";
  const image = whyChooseUs?.image || "";
  const imageAlt = whyChooseUs?.imageAlt || "Why Businesses Trust Us";

  const defaultFeatures = [
    { title: "Premium Quality Products", description: "Engineered to withstand harsh operating conditions.", icon: "ShieldCheck" },
    { title: "Competitive Pricing", description: "Direct supplier rates that protect your bottom line.", icon: "Coins" },
    { title: "Fast & Reliable Delivery", description: "Rapid turnaround times to minimize costly downtime.", icon: "Truck" },
    { title: "Expert Technical Support", description: "Dedicated engineers ready to assist with sizing & specs.", icon: "Headphones" },
    { title: "Wide Product Range", description: "Complete inventory of pumps, parts, and fluid systems.", icon: "Package" },
    { title: "Customer Satisfaction", description: "Proven track record with regional industrial operators.", icon: "Award" }
  ];

  const features = (Array.isArray(whyChooseUs?.features) && whyChooseUs.features.length > 0)
    ? whyChooseUs.features
    : defaultFeatures;

  // Dynamically distribute any number of features across 3 columns
  const columns: any[][] = [[], [], []];
  features.forEach((feat: any, idx: number) => {
    columns[idx % 3].push(feat);
  });

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* ── Left Column: Header + 6 Features ── */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Kicker Badge */}
            <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase text-[#D99F26] mb-3">
              {badge}
            </p>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0F172A] leading-[1.18] tracking-tight mb-4">
              {title}
            </h2>

            {/* Description */}
            <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed mb-10 max-w-xl">
              {description}
            </p>

            {/* 6 Features: 3 columns with vertical dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-slate-200">
              {columns.map((colItems, colIdx) => (
                <div
                  key={colIdx}
                  className={`flex flex-col space-y-8 ${
                    colIdx === 0 ? "sm:pr-6" : colIdx === 1 ? "sm:px-6" : "sm:pl-6"
                  }`}
                >
                  {colItems.map((item: any, itemIdx: number) => {
                    const IconComp = resolveFeatureIcon(item?.icon);
                    return (
                      <div key={itemIdx} className="flex flex-col items-start group">
                        {/* Icon */}
                        <div className="text-[#D99F26] mb-3 transition-transform duration-200 group-hover:scale-110">
                          <IconComp size={32} strokeWidth={1.8} />
                        </div>

                        {/* Title */}
                        <h3 className="text-[#0F172A] font-bold text-[15px] sm:text-[16px] leading-snug whitespace-pre-line mb-1.5">
                          {item?.title}
                        </h3>

                        {/* Optional Description */}
                        {item?.description && (
                          <p className="text-slate-500 text-[12px] sm:text-[13px] leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right Column: Image with Warm Amber Accent Corners ── */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[480px] lg:max-w-none">
              {/* Top-Right Decorative Amber Accent Block */}
              <div
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-28 sm:w-36 h-36 sm:h-44 rounded-2xl pointer-events-none z-0"
                style={{ background: "#D99F26" }}
              />

              {/* Bottom-Left Decorative Amber Accent Block */}
              <div
                className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-28 sm:w-36 h-36 sm:h-44 rounded-2xl pointer-events-none z-0"
                style={{ background: "#D99F26" }}
              />

              {/* Foreground Image Card */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-900 w-full">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
