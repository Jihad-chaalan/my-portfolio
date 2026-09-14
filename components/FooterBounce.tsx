"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

/**
 * FooterBounce — a simple wave on the Contact section's forest background.
 * When the section scrolls into view, the slab briefly compresses, then
 * springs back with an elastic ease — like jelly settling. Plays once.
 * The content is never affected (it lives on a separate layer).
 *
 * Reduced motion: no wave — a flat, static slab.
 */
export function FooterBounce({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let wave: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      let fired = false;
      // Guard against load-time artifacts (e.g. the browser restoring the
      // previous scroll position): the wave can only fire after the page
      // has been up for a moment, i.e. in response to real user scrolling.
      const mountedAt = performance.now();

      /**
       * The wave fires on the user's FIRST real scroll movement while the
       * Contact section is on screen — never on load/refresh (position
       * alone is not enough; the trigger needs actual scrolling motion).
       */
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (fired) return;
          if (performance.now() - mountedAt < 800) return;
          if (Math.abs(self.getVelocity()) < 120) return; // idle — no wave
          fired = true;
          self.kill();
          wave = gsap
            .timeline()
            .to(el, {
              scaleY: 0.93,
              duration: 0.35,
              ease: "power2.out",
              transformOrigin: "center bottom",
            })
            .to(el, {
              scaleY: 1,
              duration: 1.2,
              ease: "elastic.out(1, 0.4)",
            });
        },
      });
    }, el);

    return () => {
      wave?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("absolute inset-0 bg-forest", className)}
    />
  );
}