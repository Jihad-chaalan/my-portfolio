"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SkillCategory } from "@/types";
import { cn } from "@/lib/cn";

/**
 * Static poses — per-card rotation, applied BY GSAP (it owns the element's
 * `transform` at runtime, so CSS rotation classes would be overridden —
 * this is the single source of truth for the tilt).
 */
const cardRotations = [1.8, -3, -1.2];

/**
 * Horizontal placement: odd cards hug the left, even cards hug the right.
 * From xl up, cards also shift outward past the container edge — safe there
 * because the centered container always leaves ≥64px margins at xl+.
 */
const cardAligns = [
  "self-start xl:-left-12",
  "self-end xl:-right-12",
  "self-start xl:-left-12",
];

/** Stacking order: each card sits on top of the previous card's corner. */
const cardLayers = ["z-10", "z-20", "z-30"];

/** Small tuck so consecutive cards overlap slightly at their corners. */
const cardTucks = ["", "-mt-10 sm:-mt-16", "-mt-10 sm:-mt-16"];

/** Simple stroke icons, colored via currentColor (theme orange). */
const cardIcons = [
  // AI — chip
  <svg
    key="ai"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className="h-12 w-12 sm:h-16 sm:w-16"
  >
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3" />
  </svg>,
  // Full-stack — code brackets
  <svg
    key="web"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-12 w-12 sm:h-16 sm:w-16"
  >
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
  </svg>,
  // DevOps — server stack
  <svg
    key="ops"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className="h-12 w-12 sm:h-16 sm:w-16"
  >
    <rect x="4" y="4" width="16" height="5" rx="1.5" />
    <rect x="4" y="11" width="16" height="5" rx="1.5" />
    <path d="M20 20h-8M7 6.5h.01M7 13.5h.01" />
  </svg>,
];

/**
 * Alternating skill cards, like the reference design: card 1 sits left with
 * text left / icon right, card 2 sits right with icon left / text right,
 * each slightly rotated and overlapping the previous card's corner.
 * GSAP ScrollTrigger scrubs a small rise (y 100 → 0) plus opacity — the
 * tilt and resting position are static CSS, never animated.
 */
export function SkillStack({ categories }: { categories: SkillCategory[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-skill-card]"),
    );
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        const tilt = cardRotations[index] ?? -1.2;
        gsap.fromTo(
          card,
          { opacity: 0, y: 100, rotation: tilt },
          {
            opacity: 1,
            y: 0,
            // Same tilt on both ends — GSAP holds it statically while only
            // opacity and y animate with scroll.
            rotation: tilt,
            ease: "power1.out",
            scrollTrigger: {
              trigger: card,
              // The band (92%→72%) stays shorter than the vertical gap
              // between consecutive card tops (~40% of the viewport), so
              // each box finishes arriving before the next one starts.
              // The box fades in AND rises ~100px into its resting spot.
              start: "top 92%",
              end: "top 72%",
              scrub: true,
            },
          },
        );
      });
    }, root);

    // Recalculate trigger positions once fonts/images finish loading —
    // late layout shifts otherwise leave a card stuck visible or hidden.
    let disposed = false;
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      disposed = true;
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="mx-auto flex w-full max-w-6xl flex-col gap-[25px] px-2 sm:px-4"
    >
      {categories.map((category, index) => (
        <article
          key={category.id}
          data-skill-card
          className={cn(
            "skill-card-shadow relative flex w-full flex-col justify-center rounded-[28px] border border-forest/10 bg-surface p-10 sm:w-[85%] sm:min-h-[340px] sm:p-16",
            cardAligns[index] ?? "self-start",
            cardLayers[index] ?? "z-10",
            index > 0 && (cardTucks[index] ?? "-mt-10"),
          )}
        >
          {/* Alternate: text+icon swap sides on every other card */}
          <div
            className={cn(
              "flex flex-col items-center gap-8 sm:gap-14",
              index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
            )}
          >
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-semibold text-forest sm:text-4xl">
                {category.title}
              </h3>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-forest/75 sm:max-w-md sm:text-lg lg:text-xl">
                {category.description}
              </p>
            </div>
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-orange/15 text-orange sm:h-32 sm:w-32">
              {cardIcons[index] ?? cardIcons[0]}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}