"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { ProjectImage } from "@/types";
import { cn } from "@/lib/cn";

interface ProjectAccordionProps {
  id: string;
  title: string;
  number: string;
  children: ReactNode;
  dark?: boolean;
}

/** Collapsible project-story card used to keep long mobile pages compact. */
export function ProjectAccordion({
  id,
  title,
  number,
  children,
  dark = false,
}: ProjectAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section id={id} className="relative mt-10 pl-10 sm:mt-20 sm:pl-24">
      <span
        aria-hidden="true"
        className="absolute left-[9px] top-2 z-10 flex h-3.5 w-3.5 -rotate-45 items-center justify-center bg-orange sm:left-[27px] sm:h-5 sm:w-5"
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 bg-canvas sm:h-2 sm:w-2" />
      </span>
      <p className={cn(
        "font-display text-4xl leading-none sm:text-8xl",
        dark ? "text-orange/80" : "text-forest/15",
      )}>
        {number}
      </p>
      <div className={cn(
        "-mt-3 max-w-3xl border p-4 shadow-[3px_4px_0_0_var(--color-forest)] sm:-mt-4 sm:p-9 sm:shadow-[5px_7px_0_0_var(--color-forest)]",
        dark
          ? "-rotate-[0.4deg] rounded-2xl border-forest bg-forest shadow-[4px_5px_0_0_var(--color-orange)] sm:shadow-[6px_8px_0_0_var(--color-orange)]"
          : "rotate-[0.4deg] border-forest/10 bg-surface",
      )}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`${id}-content`}
          className={cn(
            "flex w-full items-center justify-between gap-4 text-left",
            dark ? "text-canvas" : "text-forest",
          )}
        >
          <span className="font-sub text-2xl uppercase sm:text-3xl">{title}</span>
          <span aria-hidden="true" className="shrink-0 text-2xl leading-none">
            {open ? "−" : "+"}
          </span>
        </button>
        <div
          id={`${id}-content`}
          hidden={!open}
          className={cn("pt-4", dark && "text-canvas/85")}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export function ProjectTechList({ technologies }: { technologies: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleTechnologies = expanded ? technologies : technologies.slice(0, 4);
  const hasMore = technologies.length > 4;

  return (
    <>
      <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5">
        {visibleTechnologies.map((tech, i) => {
          const stickerStyles = [
            "-rotate-3 bg-orange",
            "rotate-2 bg-canvas",
            "-rotate-1 bg-surface",
            "rotate-3 bg-orange",
            "-rotate-2 bg-canvas",
          ];

          return (
            <li
              key={tech}
              className={`${stickerStyles[i % stickerStyles.length]} rounded-md border-2 border-forest px-3 py-2 font-display text-xs uppercase tracking-wide text-forest shadow-[3px_3px_0_0_var(--color-forest)] transition-transform duration-200 hover:rotate-0 hover:scale-105 sm:px-4 sm:py-2.5 sm:text-sm`}
            >
              {tech}
            </li>
          );
        })}
      </ul>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="mt-5 rounded-md border-2 border-forest bg-canvas px-4 py-2 font-display text-xs uppercase tracking-wide text-forest shadow-[3px_3px_0_0_var(--color-orange)] transition-all hover:bg-orange hover:shadow-[2px_2px_0_0_var(--color-forest)]"
        >
          {expanded ? "Show fewer technologies" : `View all technologies (${technologies.length})`}
        </button>
      ) : null}
    </>
  );
}

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
        <div className="bg-surface p-2 pb-9 shadow-[4px_5px_0_0_var(--color-forest)] sm:p-4 sm:pb-14 sm:shadow-[6px_8px_0_0_var(--color-forest)]">
          <div className="relative aspect-[16/8] overflow-hidden bg-forest sm:aspect-[16/9]">
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
          className="-mx-1 mt-6 flex snap-x snap-mandatory justify-start gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:mt-8 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              className={cn(
                "relative h-16 w-28 shrink-0 snap-start overflow-hidden border-2 bg-surface p-0.5 transition-all duration-200 sm:h-20 sm:w-36",
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
