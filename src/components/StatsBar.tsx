"use client";

import { motion } from "framer-motion";
import {
  Droplets, Gauge, ShieldCheck, Users, Star, Truck, Wrench,
  BarChart2, Award, Clock, Headphones, Zap, Package, Globe,
  CheckCircle, TrendingUp, Activity, Flame, Settings, Box,
} from "lucide-react";
import { useContent } from "../hooks/useContent";

const ICON_MAP: Record<string, React.ElementType> = {
  Droplets, Gauge, ShieldCheck, Users, Star, Truck, Wrench,
  BarChart2, Award, Clock, Headphones, Zap, Package, Globe,
  CheckCircle, TrendingUp, Activity, Flame, Settings, Box,
  droplets: Droplets, gauge: Gauge, shield: ShieldCheck, users: Users,
  star: Star, truck: Truck, wrench: Wrench, award: Award, clock: Clock,
  headphones: Headphones, zap: Zap, package: Package, globe: Globe,
  check: CheckCircle, trending: TrendingUp, activity: Activity,
  flame: Flame, settings: Settings, box: Box,
};

function DynamicIcon({ name }: { name?: string }) {
  const Icon = (name && ICON_MAP[name]) || Droplets;
  return <Icon size={26} strokeWidth={1.6} />;
}

export default function StatsBar({ overrideItems }: { overrideItems?: any[] } = {}) {
  const { stats } = useContent();

  const defaultStats = [
    { value: "100+", label: "Oil & Lubricant Products", icon: "Droplets" },
    { value: "50+", label: "Pump Solutions", icon: "Gauge" },
    { value: "20+", label: "Years of Experience", icon: "Award" },
    { value: "500+", label: "Happy Clients", icon: "Users" },
  ];

  // overrideItems lets a specific page (e.g. About Us) show its own independent
  // stats instead of the shared sitewide ones, with zero risk of either page's
  // content leaking into the other.
  const items = (overrideItems && overrideItems.length > 0)
    ? overrideItems
    : (stats?.items && stats.items.length > 0 ? stats.items : defaultStats);
  const statsItems = items; // renders every stat added in the editor (wraps to a new row beyond 4)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: "easeOut" } },
  } as const;

  return (
    <div
      className="relative z-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #071B1C 0%, #0D2425 50%, #111516 100%)",
        borderTop: "1px solid rgba(200,154,69,0.3)",
        borderBottom: "1px solid rgba(200,154,69,0.15)",
      }}
    >
      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(-45deg, #C89A45 0px, #C89A45 1px, transparent 1px, transparent 12px)",
        }}
      />

      {/* Top brass glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, transparent 0%, #C89A45 30%, #E8C87A 50%, #C89A45 70%, transparent 100%)" }}
      />

      <div className="relative site-container">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {statsItems.map((stat: any, idx: number) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group flex flex-col items-center text-center px-6 py-8 cursor-default relative"
              style={{
                borderRight: idx < statsItems.length - 1 ? "1px solid rgba(200,154,69,0.15)" : "none",
              }}
            >
              {/* Subtle radial glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(200,154,69,0.08) 0%, transparent 70%)" }}
              />

              {/* Icon circle */}
              <motion.div
                className="relative mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(200,154,69,0.2) 0%, rgba(200,154,69,0.05) 100%)",
                  border: "1px solid rgba(200,154,69,0.45)",
                  color: "#C89A45",
                  boxShadow: "0 0 20px rgba(200,154,69,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                whileHover={{ scale: 1.12, boxShadow: "0 0 28px rgba(200,154,69,0.35)" }}
                transition={{ duration: 0.22 }}
              >
                <DynamicIcon name={stat.icon} />
              </motion.div>

              {/* Value */}
              <motion.span
                className="block font-bold leading-none mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(30px, 3.8vw, 44px)",
                  color: "#FFFFFF",
                  letterSpacing: "-0.03em",
                  textShadow: "0 0 40px rgba(200,154,69,0.25)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 + idx * 0.12, ease: "easeOut" }}
              >
                {stat.value}
              </motion.span>

              {/* Brass accent line */}
              <motion.div
                className="mb-2.5 rounded-full"
                style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C89A45, transparent)" }}
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "40px", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 + idx * 0.12 }}
              />

              {/* Label */}
              <span
                className="text-[11.5px] md:text-[12.5px] leading-snug font-medium tracking-wider uppercase"
                style={{ color: "#899397" }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
