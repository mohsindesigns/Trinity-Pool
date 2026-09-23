"use client"

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import Link from "next/link";

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
};

const Navbar = () => {
  const content = useContent();
  const { navbar, settings, services: servicesData } = content;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [expandedMobileLink, setExpandedMobileLink] = useState<string | null>(null);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { companyLinks } = navbar;
  const services = (servicesData.services || []).filter((s: any) => s.status === 'published' || s.status === undefined);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMegaMenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHoveringMegaMenu(true);
  };

  const handleMegaMenuMouseLeave = () => {
    setIsHoveringMegaMenu(false);
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
      setHoveredService(null);
    }, 150);
  };

  const handleLinkClick = () => {
    setActiveMegaMenu(null);
    setIsMenuOpen(false);
    setHoveredService(null);
    setExpandedMobileLink(null);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const normalizeNavHref = (href: string) => {
    if (!href) return "/";
    if (href === "/blog" || href === "/blog/") return "/blogs/";
    if (href.startsWith("http") || href.startsWith("#") || href.includes("?") || href.endsWith("/")) return href;
    return `${href}/`;
  };

  const isLinkActive = (rawHref: string) => {
    const href = normalizeNavHref(rawHref);
    if (href === '/') return pathname === '/' || pathname === '';
    if (href.startsWith('/#')) return false;
    const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
    return cleanPath.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-dark shadow-[0_4px_24px_rgba(0,0,0,0.6)] py-1' : 'bg-transparent py-3'}`}
      >
        <div className="site-container flex items-center justify-between h-[76px] sm:h-[96px]">

          {/* ── Logo ───────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 md:gap-3" onClick={handleLinkClick}>
            {navbar.logo && (navbar.logo.startsWith('http') || navbar.logo.startsWith('/uploads') || navbar.logo.startsWith('/cdn-images')) ? (
              // The source file is a full icon+wordmark lockup (wide, not square) — a fixed
              // square box forces object-contain to shrink it far more than needed to satisfy
              // the width constraint. Constraining height only and letting width follow the
              // logo's own aspect ratio renders it at its natural, much larger size.
              <div className="relative h-10 sm:h-[58px] w-auto flex items-center flex-shrink-0">
                <img
                  src={navbar.logo}
                  alt={navbar.siteTitle || "Company Logo"}
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 w-16 sm:h-[84px] sm:w-[84px] flex-shrink-0">
                <svg width="100%" height="100%" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 2L38 9.5V23.5C38 33.2 31.2 39.6 22 42C12.8 39.6 6 33.2 6 23.5V9.5L22 2Z"
                    stroke="var(--color-gold, #C89A45)"
                    strokeWidth="1.75"
                    fill="none"
                  />
                  <path
                    d="M22 13C26.5 19.5 30 24.2 30 27.5C30 32.19 26.42 36 22 36C17.58 36 14 32.19 14 27.5C14 24.2 17.5 19.5 22 13Z"
                    fill="var(--color-gold, #C89A45)"
                  />
                </svg>
              </div>
            )}
          </Link>

          {/* ── Desktop Nav Links ──────────────────────── */}
          <ul className="hidden md:flex items-center gap-7">
            {(companyLinks || []).map((link: any, linkIdx: number) => {
              const active = isLinkActive(link.href);
              const linkHref = normalizeNavHref(link.href);

              // Case 1: Mega Menu
              if (link.useMegaMenu) {
                const menuServices = link.megaCategory
                  ? services.filter((s: any) => s.category === link.megaCategory)
                  : services;
                return (
                  <li key={linkIdx} className="static">
                    {/* Clickable link to the category's landing page (e.g. /artificial-lift/),
                       with hover still opening the preview dropdown below — previously this
                       was a plain <button> that only ever opened the dropdown and never
                       navigated anywhere, so link.href was silently unused. */}
                    <Link
                      href={linkHref}
                      onClick={handleLinkClick}
                      onMouseEnter={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        setActiveMegaMenu(`mega-${linkIdx}`);
                      }}
                      onMouseLeave={() => {
                        timeoutRef.current = setTimeout(() => {
                          if (!isHoveringMegaMenu) setActiveMegaMenu(null);
                        }, 150);
                      }}
                      className={`nav-link flex items-center gap-1 text-[13.5px] font-medium transition-colors duration-200 cursor-pointer
                        ${activeMegaMenu === `mega-${linkIdx}` || active
                          ? 'text-gold'
                          : 'text-white/75 hover:text-white'
                        }`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      {menuServices.length > 0 && (
                        <motion.span animate={{ rotate: activeMegaMenu === `mega-${linkIdx}` ? 180 : 0 }}>
                          <ChevronDown size={14} className="opacity-70 ml-0.5" />
                        </motion.span>
                      )}
                    </Link>

                    <AnimatePresence>
                      {activeMegaMenu === `mega-${linkIdx}` && (
                        <motion.div
                          ref={megaMenuRef}
                          initial={{ opacity: 0, y: 12, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: 8, x: "-50%" }}
                          onMouseEnter={handleMegaMenuMouseEnter}
                          onMouseLeave={handleMegaMenuMouseLeave}
                          className="absolute left-1/2 top-full mt-2 w-[920px] max-w-[95vw] max-h-[85vh] overflow-y-auto bg-dark rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] border border-border-dark p-5 md:p-6 custom-scrollbar"
                          style={{ zIndex: 1000 }}
                        >
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {menuServices.map((service: any) => {
                              const isThisHovered = hoveredService === service.title;
                              return (
                                <Link
                                  key={service.slug}
                                  href={`/${service.slug}/`}
                                  onMouseEnter={() => setHoveredService(service.title)}
                                  onMouseLeave={() => setHoveredService(null)}
                                  onClick={handleLinkClick}
                                  className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-200 border border-transparent hover:border-white/10"
                                >
                                  <div className={`h-9 w-9 min-w-[36px] rounded-lg flex items-center justify-center transition-all duration-200 mt-0.5 ${isThisHovered ? "bg-gold text-dark shadow-md shadow-gold/20" : "bg-white/10 text-white"}`}>
                                    <Icon name={service.icon} className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className={`text-[13px] font-semibold transition-colors leading-snug truncate ${isThisHovered ? "text-gold" : "text-white"}`}>
                                      {service.title}
                                    </h3>
                                    <p className="text-white/45 text-[11px] leading-tight line-clamp-1 mt-0.5 font-light">
                                      {stripHtml(service.heroDescription || service.description || "Learn more about this service")}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Megamenu Footer */}
                          <div className="mt-4 pt-3.5 border-t border-border-dark/80 flex items-center justify-between text-xs px-1">
                            <span className="text-white/40 font-light">Explore our full range of pump & oilfield supply services</span>
                            <Link
                              href={linkHref}
                              onClick={handleLinkClick}
                              className="nav-link text-gold hover:text-gold-light font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[11px]"
                            >
                              {link.megaCategory === 'artificial-lift' ? 'View All Artificial Lift Products' : 'All Services Index'} <ArrowRight size={13} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              // Case 2: Sub-links Dropdown (Sub-menu)
              if (link.subLinks && link.subLinks.length > 0) {
                return (
                  <li key={linkIdx} className="relative group">
                    <button
                      className={`nav-link flex items-center gap-1 text-[13.5px] font-medium transition-colors duration-200 cursor-pointer
                        ${active ? 'text-gold' : 'text-white/75 hover:text-white'}`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      <ChevronDown size={14} className="opacity-70 ml-0.5 transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="absolute left-0 top-full w-48 bg-dark rounded-xl shadow-2xl border border-border-dark opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0" style={{ zIndex: 1000 }}>
                      <div className="py-2">
                        {link.subLinks.map((subLink: any, sIdx: number) => (
                          <Link
                            key={sIdx}
                            href={normalizeNavHref(subLink.href)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-gold hover:bg-white/5 transition-colors"
                            onClick={handleLinkClick}
                          >
                            {subLink.icon && <Icon name={subLink.icon} className="h-4 w-4" />}
                            <span>{subLink.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              // Case 3: Normal Link
              const isExternal = link.href.startsWith('http');
              return (
                <li key={linkIdx}>
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link text-white/80 hover:text-gold text-[13.5px] font-semibold transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={linkHref}
                      onClick={handleLinkClick}
                      className={`nav-link flex items-center gap-1 text-[13.5px] font-semibold transition-colors duration-200
                        ${active
                          ? 'text-gold'
                          : 'text-white/80 hover:text-white'
                        }`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA / Mobile Trigger ───────────── */}
          <div className="flex items-center gap-4 lg:gap-6">
            <a
              href={navbar.ctaLink || "/contact-us"}
              target={navbar.ctaLink?.startsWith('http') ? "_blank" : undefined}
              rel={navbar.ctaLink?.startsWith('http') ? "noopener noreferrer" : undefined}
              className="btn-gold-pill hidden md:inline-flex"
            >
              {navbar.ctaIcon && <Icon name={navbar.ctaIcon} className="h-4 w-4" />}
              <span>{navbar.ctaText || "Request a Quote"}</span>
              <ArrowRight size={15} />
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Menu Drawer ─────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-x-0 top-[76px] z-40 bg-dark border-b border-border-dark flex flex-col px-6 py-8 md:hidden gap-6 shadow-[0_12px_32px_rgba(0,0,0,0.8)]"
            >
              <ul className="flex flex-col gap-4">
                {(companyLinks || []).map((link: any, linkIdx: number) => {
                  const active = isLinkActive(link.href);
                  const isMegaMenu = link.useMegaMenu;
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  const isExpanded = expandedMobileLink === link.label;
                  const isExternal = link.href.startsWith('http');
                  const linkHref = normalizeNavHref(link.href);

                  return (
                    <li key={linkIdx} className="flex flex-col">
                      <div className="flex items-center justify-between py-1">
                        {isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="nav-link block text-[15px] font-medium text-white/70 hover:text-gold transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={linkHref}
                            onClick={handleLinkClick}
                            className={`nav-link block text-[15px] font-medium transition-colors
                              ${active ? 'text-gold' : 'text-white/70 hover:text-white'}`}
                          >
                            {link.label}
                          </Link>
                        )}
                        {(isMegaMenu || hasSubLinks) && (
                          <button
                            onClick={() => setExpandedMobileLink(isExpanded ? null : link.label)}
                            className="p-1 text-white/50 hover:text-gold transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {(isMegaMenu || hasSubLinks) && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 flex flex-col gap-2 mt-1 mb-2 border-l border-white/10 ml-2">
                              {isMegaMenu ? (
                                (link.megaCategory ? services.filter((s: any) => s.category === link.megaCategory) : services).map((service: any) => (
                                  <Link
                                    key={service.slug}
                                    href={`/${service.slug}/`}
                                    onClick={handleLinkClick}
                                    className="nav-link block py-1 text-sm font-medium text-white/60 hover:text-gold transition-colors"
                                  >
                                    {service.title}
                                  </Link>
                                ))
                              ) : (
                                link.subLinks.map((subLink: any, sIdx: number) => (
                                  <Link
                                    key={sIdx}
                                    href={normalizeNavHref(subLink.href)}
                                    onClick={handleLinkClick}
                                    className="nav-link block py-1 text-sm font-medium text-white/60 hover:text-gold transition-colors"
                                  >
                                    {subLink.label}
                                  </Link>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <a
                href={navbar.ctaLink || "/contact-us"}
                target={navbar.ctaLink?.startsWith('http') ? "_blank" : undefined}
                rel={navbar.ctaLink?.startsWith('http') ? "noopener noreferrer" : undefined}
                onClick={handleLinkClick}
                className="btn-gold-pill justify-center w-full py-3.5"
              >
                {navbar.ctaIcon && <Icon name={navbar.ctaIcon} className="h-4 w-4" />}
                <span>{navbar.ctaText || "Request a Quote"}</span>
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;