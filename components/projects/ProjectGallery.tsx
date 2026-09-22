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
 * Collapsible prose for the mobile detail page — long paragraphs render
 * clamped to ~4 lines with a "Read more / Show less" toggle; on `sm` screens
 * and up the full text always shows and the toggle is hidden.
 *
 * Pure CSS clamp (`line-clamp-4`) + a real `<button>` with `aria-expanded`,
 * so keyboard and screen-reader users get the state. Desktop is untouched:
 * the clamp and the button are both `sm:`-gated.
 */
export function MobileClamp({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <span className="block">
      <span className={cn(!expanded && "line-clamp-4 sm:line-clamp-none")}>
        {text}
      </span>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-1 font-semibold text-orange underline-offset-2 hover:underline sm:hidden"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </span>
  );
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
      {/* Main image — "taped photo" look: white frame, slightly rotated,
        flat orange tape strips pinning the corners. Fixed 16:9 photo area
        so the page never jumps when switching. */}
      <div className="relative mx-auto w-full max-w-4xl rotate-[-0.6deg]">
        {/* Tape strips — flat translucent orange rectangles, no effects */}
        <span
          aria-hidden="true"
          className="absolute -top-3 left-10 z-10 h-6 w-24 -rotate-6 bg-orange/80"
        />
        <span
          aria-hidden="true"
          className="absolute -top-3 right-10 z-10 h-6 w-24 rotate-6 bg-orange/80"
        />
        <div className="bg-surface p-3 pb-12 shadow-[6px_8px_0_0_var(--color-forest)] sm:p-4 sm:pb-14">
          <div className="relative aspect-[16/9] overflow-hidden bg-forest">
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
          <p className="mt-3 px-1 text-center font-sub text-sm uppercase tracking-wide text-forest/70 sm:text-base">
            {active.alt}
          </p>
        </div>
      </div>

      {hasMultiple ? (
        <div
          role="group"
          aria-label={`${projectName} images`}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              className={cn(
                "relative h-16 w-28 shrink-0 overflow-hidden border-2 bg-surface p-0.5 transition-all duration-200 sm:h-20 sm:w-36",
                index === activeIndex
                  ? "rotate-0 border-orange shadow-[3px_4px_0_0_var(--color-forest)]"
                  : "-rotate-2 border-forest/15 hover:rotate-0 hover:border-forest/50",
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
          <p className="sr-only" aria-live="polite">
            Showing image {activeIndex + 1} of {images.length}
          </p>
        </div>
      ) : null}
    </figure>
  );
}
