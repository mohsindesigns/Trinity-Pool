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
      ? "grid grid-cols-2 gap-3"
      : "grid grid-cols-2 sm:grid-cols-3 gap-3";

  return (
    <div className={`${gridClass} mt-8`}>
      {images.map((img, idx) => (
        <div
          key={idx}
          className="relative h-[150px] sm:h-[170px] rounded-lg overflow-hidden border border-border-light bg-warm-white shadow-sm group"
        >
          {isRawImage(img.src) ? (
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}
