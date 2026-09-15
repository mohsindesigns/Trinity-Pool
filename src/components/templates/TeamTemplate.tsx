"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { stripHtml } from "../../lib/utils";
import RichTextRenderer from "../ui/RichTextRenderer";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const StatsBar = dynamic(() => import("@/components/StatsBar"));
const CtaBanner = dynamic(() => import("@/components/CtaBanner"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });

const DEFAULT_STATS = [
  { value: "5", label: "Team Members", icon: "Users" },
  { value: "100+", label: "Years Combined Experience", icon: "Award" },
  { value: "1", label: "Odessa, TX Shop", icon: "MapPin" },
  { value: "24/7", label: "On-Call Support", icon: "Headphones" },
];

const DEFAULT_CTA_BANNER = {
  label: "WORK WITH US",
  title: "Want to Talk to the Team Directly?",
  description: "No call centers — reach out and you'll hear back from the same people who build and repair your equipment.",
  button: "Contact Us",
  buttonUrl: "/contact-us/",
  phone: "830-279-3996",
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Images = {
  Pattern: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  Studio: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
};

const Icons = {
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 8h4v12H4V8z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8h4v2c.6-.8 1.5-2 3-2 2.5 0 4 1.5 4 4v8h-4v-6c0-1.5-.5-2-2-2s-2 .5-2 2v6h-4V8z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 7l-10 7L2 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Quote: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10 11H6V7h4v4z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M18 11h-4V7h4v4z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
    </svg>
  ),
  Award: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14l-2 6 6-2 6 2-2-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

const ParallaxLayer = ({ children, speed = 0.1, className = "", sectionRef }: any) => {
  const ref = useRef<any>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 50]);
  return (
    <motion.div ref={ref} style={{ y }} className={`absolute inset-0 will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
};

const TeamPortrait = ({ image, title, badge1, badge2, alignRight = false }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const fallbackImage = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={`relative group w-full ${alignRight ? 'lg:ml-auto' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative z-10 w-full max-w-[500px] mx-auto lg:mx-0">
        <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-br from-gold/10 via-slate-500/10 to-gold-dark/10 rounded-[2rem] sm:rounded-[2.5rem] blur-xl sm:blur-2xl group-hover:from-gold/20 group-hover:via-slate-500/20 group-hover:to-gold-dark/20 transition-all duration-700" />
        <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.08)] group-hover:shadow-[0_20px_50px_rgb(0,0,0,0.15)] transition-shadow duration-700">
          <motion.img 
            src={imageError ? fallbackImage : image} 
            alt={title} 
            onError={() => setImageError(true)}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }} 
            transition={{ duration: 1.5, ease: "easeOut" }} 
            className="w-full h-[280px] min-[350px]:h-[380px] sm:h-[450px] lg:h-[550px] object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-80" />
        </div>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <div className="bg-white/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white group-hover:-translate-y-1 transition-transform duration-500">
            <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] min-[350px]:text-[10px] sm:text-xs font-bold text-slate-800 tracking-[0.1em]"><Icons.Sparkle />{badge1}</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }} className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-700/50 group-hover:-translate-y-1 transition-transform duration-500">
            <span className="flex items-center gap-1.5 sm:gap-2 text-[9px] min-[350px]:text-[10px] sm:text-xs font-bold text-gold tracking-[0.1em]"><Icons.Award />{badge2}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function TeamTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  const sectionRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const { team: teamData, globalMetadata } = useContent();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.leadership-reveal', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
    }, sectionRef);
    return () => ctx.revert();
  }, [isClient]);

  if (!isClient) return null;

  const section = teamData?.section || {};
  const heroBadge = stripHtml(section.badge || "OUR LEADERSHIP");
  const heroImage = section.image || "/images/trinity/about.jpg";
  const heroImageAlt = section.imageAlt || "Trinity Pump & Supply";
  const bookingUrl = globalMetadata?.bookingUrl || "/contact-us/";
  const hasCustomHeadline = section.headlinePrefix || section.headlineHighlight || section.headlineSuffix;

  // Stats and CTA get their own independent content here (never the shared
  // homepage useContent() data), so editing this page can never change what
  // shows on the homepage or vice versa.
  const statsItems = Array.isArray(teamData?.stats?.items) && teamData.stats.items.length > 0 ? teamData.stats.items : DEFAULT_STATS;
  const ctaBannerData = teamData?.ctaBanner && Object.keys(teamData.ctaBanner).length > 0 ? teamData.ctaBanner : DEFAULT_CTA_BANNER;

  return (
    <main className="bg-white" ref={sectionRef}>
      {/* ── Dark Hero: Badge / Headline / Description ── */}
      <section className="relative bg-dark min-h-[55vh] flex items-center pt-[130px] pb-14 border-b border-border-dark overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
        </div>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="site-container relative z-10 w-full">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/60 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg"
            >
              <Link href="/" className="hover:text-gold transition-colors text-white/80">
                Home
              </Link>
              <span className="text-gold/50">/</span>
              <span className="text-gold font-medium">Team</span>
            </nav>
          </div>

          <div className="max-w-3xl text-left leadership-reveal relative z-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
              <p className="section-label text-gold">{heroBadge}</p>
            </div>
            <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[68px] text-white leading-[1.08] mb-6 tracking-tight">
              {hasCustomHeadline ? (
                <>
                  {section.headlinePrefix}{' '}
                  {section.headlineHighlight && (
                    <span className="text-gold italic font-light">{section.headlineHighlight}</span>
                  )}
                  {section.headlineSuffix ? ` ${section.headlineSuffix}` : ""}
                </>
              ) : (
                <>
                  Built by <span className="text-gold italic font-light">Real People.</span>
                </>
              )}
            </h1>
            <div className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-9 font-light">
              <RichTextRenderer content={section.description} />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a href={bookingUrl} className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4">
                Request a Quote <ArrowRight size={14} className="ml-1" />
              </a>
              <Link href="/about-us/" className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4">
                Our Story <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS — reuses the homepage's component for visual consistency,
           with this page's own independent content. ── */}
      <StatsBar overrideItems={statsItems} />

      {/* ── Light: Team Member List ── */}
      <section className="relative py-14 md:py-18 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[#f8fafc]">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
        </div>
        <div className="site-container relative z-30">
          {teamData?.members?.map((member: any, index: number) => {
            const alignRight = index % 2 !== 0;
            return (
              <div key={member.id || index} className="grid lg:grid-cols-12 gap-8 items-center lg:items-start mb-24 sm:mb-32 md:mb-40 relative">
                <div className={`lg:col-span-7 space-y-8 ${alignRight ? 'order-2 lg:order-1 lg:pr-6' : 'lg:pl-6 order-2 lg:order-2'} leadership-reveal relative z-10 w-full`}>
                  <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <h3 className="text-2xl sm:text-5xl font-light text-slate-900">
                        {member.name}
                        <span className="block text-[10px] sm:text-xs font-mono font-bold text-gold-dark mt-2 tracking-[0.2em] uppercase">{member.role}</span>
                      </h3>
                      <div className="flex items-center gap-3">
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-gold-dark hover:border-gold/30 transition-all">
                            <Icons.Linkedin />
                          </a>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-gold-dark hover:border-gold/30 transition-all">
                            <Icons.Mail />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="mt-8 relative">
                      <div className="absolute -left-3 sm:-left-6 -top-4 text-gold/20 scale-[1.2] sm:scale-[1.8] pointer-events-none"><Icons.Quote /></div>
                      <div className="space-y-4 text-slate-600 text-[13px] sm:text-lg leading-relaxed relative z-10">
                        <RichTextRenderer content={member.description} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`lg:col-span-5 ${alignRight ? 'order-1 lg:order-2' : 'order-1 lg:order-1'} leadership-reveal lg:sticky lg:top-32 relative z-10 w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0`}>
                  <TeamPortrait
                    image={
                      member.image ? (
                        (member.image.startsWith('/') || member.image.startsWith('http'))
                          ? member.image
                          : (Images[member.image as keyof typeof Images] || Images.Studio)
                      ) : Images.Studio
                    }
                    title={`${member.name} - ${member.role}`}
                    badge1={member.badge1}
                    badge2={member.badge2}
                    alignRight={alignRight}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA — reuses the homepage's component for visual consistency,
           with this page's own independent content. ── */}
      <div className="-mt-10 md:-mt-16 relative">
        <CtaBanner overrideData={ctaBannerData} />
      </div>

      {/* ── CONTACT FORM + FAQ — shared sitewide, same as every other page. ── */}
      <QAForm pageData={pageData} />
    </main>
  );
}
