"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

interface ContactRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * One-shot entrance for the Contact section content: the blocks land with
 * a subtle `back.out` overshoot the first time the section scrolls into
 * view, and never replay. (The scroll-speed wave of the background slab
 * lives in FooterBounce.)
 *
 * Reduced motion: no movement — items fade in place instead.
 */
export function ContactReveal({ children, className }: ContactRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    try {
      gsap.registerPlugin(ScrollTrigger);

      const itemsHost = el.querySelector<HTMLElement>("[data-contact-items]");
      const items = itemsHost
        ? gsap.utils.toArray<HTMLElement>(Array.from(itemsHost.children))
        : [];
      if (items.length === 0) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const ctx = gsap.context(() => {
        gsap.from(items, {
          y: reducedMotion ? 0 : 40,
          opacity: 0,
          duration: reducedMotion ? 0.4 : 0.8,
          ease: reducedMotion ? "power1.out" : "back.out(1.7)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      }, el);

      // Re-sync once fonts settle, so trigger positions are never stale.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => ctx.revert();
    } catch (error) {
      // Never fail silently — surface setup problems in the console.
      console.error("[ContactReveal] setup failed:", error);
    }
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}