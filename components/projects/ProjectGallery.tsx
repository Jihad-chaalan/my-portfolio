"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectImage } from "@/types";
import { cn } from "@/lib/cn";

interface ProjectGalleryProps {
  /** All gallery images for the project, in display order. */
  images: ProjectImage[];
  projectName: string;
}

/**
 * Project image gallery — one large image plus a thumbnail strip.
 *
 * The number of images is whatever the data source provides (one project
 * may have three, another just one — Contentful decides later), so the
 * thumbnails and the counter render only when there is more than one
 * image. Clicking (or focusing and pressing Enter/Space on) a thumbnail
 * swaps the large image; the strip is a real button group, keyboard
 * operable, with the active thumbnail marked via aria-pressed.
 */
export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const active = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  return (
    <figure>
      {/* Main image — fixed 16:9 so the page never jumps when switching */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-forest/10 bg-forest skill-card-shadow">
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          unoptimized
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {hasMultiple ? (
        <>
          <div
            role="group"
            aria-label={`${projectName} images`}
            className="mt-4 flex flex-wrap gap-3"
          >
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                className={cn(
                  "relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-200 sm:h-20 sm:w-36",
                  index === activeIndex
                    ? "border-orange"
                    : "border-forest/15 hover:border-forest/40",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="144px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <figcaption className="mt-2 text-sm text-forest/60">
            Image {activeIndex + 1} of {images.length} — {active.alt}
          </figcaption>
        </>
      ) : (
        <figcaption className="mt-2 text-sm text-forest/60">
          {active.alt}
        </figcaption>
      )}
    </figure>
  );
}
