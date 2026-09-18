"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

interface ProjectDetailRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Scroll-entrance for the project detail page — the same one-shot reveal
 * language as ContactReveal: elements marked with `data-reveal` land with
 * a subtle `back.out` overshoot the first time each enters the viewport,
 * and never replay.
 *
 * Reduced motion: no movement — items fade in place instead.
 */
export function ProjectDetailReveal({
  children,
  className,
}: ProjectDetailRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    try {
      gsap.registerPlugin(ScrollTrigger);

      const items = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-reveal]"),
      );
      if (items.length === 0) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const ctx = gsap.context(() => {
        items.forEach((item) => {
          gsap.from(item, {
            y: reducedMotion ? 0 : 48,
            opacity: 0,
            duration: reducedMotion ? 0.4 : 0.9,
            ease: reducedMotion ? "power1.out" : "back.out(1.4)",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              once: true,
            },
          });
        });
      }, el);

      // Re-sync once fonts settle, so trigger positions are never stale.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => ctx.revert();
    } catch (error) {
      console.error("[ProjectDetailReveal] setup failed:", error);
    }
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
