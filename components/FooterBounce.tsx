"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

/** viewBox height of the curved top band. */
const BAND_H = 200;
/** Max control-point offset in viewBox units (clamped velocity). */
const MAX_DIP = 150;
/** px/s of scroll velocity → viewBox dip. */
const VELOCITY_DIVISOR = 12;

const FLAT_PATH = `M 0 0 Q 300 0 600 0 Q 900 0 1200 0 L 1200 ${BAND_H} L 0 ${BAND_H} Z`;

interface FooterBounceProps {
  /** Extra classes for the backdrop slab (positioning/size). */
  className?: string;
}

/**
 * FooterBounce — a scroll-speed-driven curved top edge for the last
 * section, after GSAP's official "Footer Bounce" demo (free plugins only:
 * gsap + ScrollTrigger — no MorphSVGPlugin).
 *
 * The backdrop slab's top edge is a single SVG path built from quadratic
 * beziers with two interior control points (endpoints pinned so the
 * corners stay square). ScrollTrigger.onUpdate reads `getVelocity()`,
 * clamps it to ±150 viewBox units, and tweens the control points toward
 * that dip. When scrolling settles, the control points tween back to
 * neutral with `elastic.out(1, 0.3)` — a visible overshoot-and-wobble
 * snap, like a stretched sheet returning to rest.
 *
 * Robustness: a gsap.ticker re-renders the `d` attribute every frame from
 * the live control values, so the curve always matches the animation
 * state even if a tween's own onUpdate timing slips.
 *
 * SSR-safe: gsap/ScrollTrigger only register inside useEffect (client
 * only). Reduced motion: no wobble at all — a flat, static slab.
 */
export function FooterBounce({ className }: FooterBounceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    // Register inside the effect: ScrollTrigger touches the DOM, so it
    // must never run during SSR.
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[FooterBounce] mount — motion ${
          reducedMotion ? "reduced (wobble disabled)" : "full wobble"
        }`,
      );
    }

    if (reducedMotion) return;

    try {
      // The two interior control points of the top edge. The path's `d` is
      // regenerated from these values on every tick of their tweens.
      const control = { y1: 0, y2: 0 };

      const render = () => {
        path.setAttribute(
          "d",
          `M 0 0 Q 300 ${control.y1.toFixed(2)} 600 0 Q 900 ${control.y2.toFixed(2)} 1200 0 L 1200 ${BAND_H} L 0 ${BAND_H} Z`,
        );
      };
      render();

      // Re-render unconditionally every frame — the curve always mirrors
      // the animated control values, even between tween onUpdate ticks.
      gsap.ticker.add(render);

      /** Snap back to flat with an elastic overshoot. */
      const settleFlat = () => {
        gsap.to(control, {
          y1: 0,
          y2: 0,
          duration: 1.4,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
        });
      };

      let settleCall: ReturnType<typeof gsap.delayedCall> | null = null;
      // Dev-only: confirm the velocity pipeline actually fires.
      let reportedPeak = 0;

      // Active only while the section is near the viewport.
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Clamp velocity (px/s) into ±150 viewBox units of dip. Direction
          // is ignored — the sheet always bends away from the content.
          const speed = Math.abs(self.getVelocity());
          const dip = gsap.utils.clamp(0, MAX_DIP, speed / VELOCITY_DIVISOR);

          // Pull the control points toward the dip (springy, not linear);
          // the two humps differ slightly for an organic wobble.
          gsap.to(control, {
            y1: dip,
            y2: dip * 0.85,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });

          // While scrolling keeps moving, keep postponing the snap-back;
          // once updates pause, the sheet settles elastically.
          settleCall?.kill();
          settleCall = gsap.delayedCall(0.25, settleFlat);

          if (process.env.NODE_ENV !== "production" && dip > reportedPeak) {
            reportedPeak = dip;
            if (reportedPeak > 12) {
              console.info(
                `[FooterBounce] velocity pipeline firing — peak dip ${reportedPeak.toFixed(0)}/150 at ${speed.toFixed(0)}px/s`,
              );
            }
          }
        },
      });

      return () => {
        // Full teardown — important under Next.js fast refresh / unmounts.
        gsap.ticker.remove(render);
        settleCall?.kill();
        st.kill();
        gsap.killTweensOf(control);
      };
    } catch (error) {
      // Never fail silently — surface setup problems in the console.
      console.error("[FooterBounce] setup failed:", error);
    }
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("absolute inset-0 bg-forest", className)}
    >
      {/* Curved top band — the path's top edge is bent by scroll speed. */}
      <svg
        className="absolute inset-x-0 top-0 h-40 w-full sm:h-48"
        viewBox={`0 0 1200 ${BAND_H}`}
        preserveAspectRatio="none"
      >
        <path ref={pathRef} d={FLAT_PATH} className="fill-forest" />
      </svg>
    </div>
  );
}