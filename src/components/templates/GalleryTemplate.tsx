"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useContent } from "../../hooks/useContent";

/** Strip HTML tags and return plain text */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

// Fallback used only if the dashboard's real portfolio list is ever empty.
const FALLBACK_IMAGE = '/images/trinity/hero.jpg';

export default function GalleryTemplate({ pageData }: { pageData?: any }) {
  const { galleryPage: globalGalleryPage, globalMetadata, portfolio: globalPortfolio, images } = useContent();

  const pageContent = pageData?.content || {};
  const galleryPage = pageContent.galleryPage || globalGalleryPage || {};
  const portfolio = pageContent.portfolio || globalPortfolio || {};
  
  // Selected projects from admin dashboard
  const selectedProjects = portfolio.projects || [];
  const assetMap = images?.portfolio || {};

  const label = stripHtml(galleryPage.header?.badge || galleryPage.label || "OUR PORTFOLIO");
  const titleLine1 = stripHtml(galleryPage.header?.titlePrefix || galleryPage.titleLine1 || "Real Results,");
  const titleLine2 = stripHtml(galleryPage.header?.titleHighlight || galleryPage.titleLine2 || "Real Stories");
  const description = stripHtml(galleryPage.header?.description || galleryPage.description || "Browse real photos from our shop and the field, and see the equipment we build and supply for Permian Basin operators.");
  const ctaBook = galleryPage.header?.ctaBook || galleryPage.ctaBook || "REQUEST A QUOTE";
  const bookingUrl = globalMetadata?.bookingUrl || "/contact-us/";

  // Helper to resolve dynamic or asset image source
  const resolveImage = (imgSrc: any) => {
    if (!imgSrc) return FALLBACK_IMAGE;
    if (typeof imgSrc === 'string' && (imgSrc.startsWith("http") || imgSrc.startsWith("/") || imgSrc.startsWith("blob:"))) {
      return imgSrc;
    }
    return assetMap[imgSrc] || imgSrc || FALLBACK_IMAGE;
  };

  return (
    <>
      <main className="bg-dark min-h-screen pt-[140px] pb-24 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-radial-dots-gold pointer-events-none" />

        <div className="site-container relative z-10">
          <div className="mb-12 md:mb-20 text-center flex flex-col items-center">
            <p className="section-label mb-4">{label}</p>
            <h1 className="display-heading text-[32px] min-[400px]:text-[44px] md:text-[64px] text-white leading-tight">
              {titleLine1} <span className="text-gold font-medium">{titleLine2}</span>
            </h1>
            <p className="text-white/60 text-[14px] md:text-[15px] max-w-2xl mx-auto mt-6 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {selectedProjects.length > 0 ? (
              // DYNAMIC PROJECTS FROM THE DASHBOARD
              selectedProjects.map((project: any, idx: number) => {
                const src = resolveImage(project.image);
                const isStaticImport = typeof src !== 'string';
                
                return (
                  <div key={project._id || idx} className="relative aspect-[4/3] w-full overflow-hidden group rounded-lg shadow-xl border border-border-dark/60 bg-dark-3">
                    {isStaticImport ? (
                      <Image 
                        src={src} 
                        alt={project.title || "Gallery image"} 
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 filter contrast-[1.02]"
                        placeholder="blur"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <img 
                        src={src} 
                        alt={project.title || "Gallery image"} 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 filter contrast-[1.02]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-left">
                        <h4 className="text-white text-sm font-bold truncate">{project.title}</h4>
                        {project.category && <p className="text-gold text-xs font-mono tracking-wider mt-0.5">{project.category}</p>}
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-5 h-5 m-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gold" />
                      <div className="absolute top-0 left-0 h-full w-[2px] bg-gold" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 text-white/40 text-sm">
                No gallery photos yet — add some from the dashboard.
              </div>
            )}
          </div>
          
          <div className="mt-20 flex justify-center">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold shadow-2xl"
            >
              {ctaBook}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}