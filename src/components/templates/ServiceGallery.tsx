"use client";

import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ServiceGalleryProps {
  images?: GalleryImage[];
}

/**
 * Small row/grid of real product or shop photos shown below the benefit
 * cards on a service page. Returns null when empty so short pages never
 * show an empty gallery frame.
 */
export default function ServiceGallery({ images = [] }: ServiceGalleryProps) {
  if (!images || images.length === 0) return null;

  const isRawImage = (src: string) =>
    src.startsWith("http") || src.startsWith("/uploads") || src.startsWith("/cdn-images");

  const gridClass =
    images.length === 1
      ? "grid grid-cols-1"
      : images.length === 2
      ? "grid grid-cols-2 gap-4"
      : "grid grid-cols-2 sm:grid-cols-3 gap-4";

  return (
    <div className={`${gridClass} mt-8`}>
      {images.map((img, idx) => (
        <div
          key={idx}
          className="group relative rounded-xl p-1.5 bg-warm-white/80 border border-border-light shadow-[0_1px_2px_rgba(7,27,28,0.04),0_12px_30px_-18px_rgba(7,27,28,0.16)] hover:border-gold-dark/40 hover:shadow-[0_20px_40px_-20px_rgba(200,154,69,0.4)] transition-all duration-300"
        >
          <div className="relative h-[140px] sm:h-[160px] rounded-lg overflow-hidden">
            {isRawImage(img.src) ? (
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.02]"
              />
            ) : (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.02]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {img.alt && (
              <span className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-medium leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                {img.alt}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
