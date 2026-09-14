"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

/*
 * Curve geometry. The SVG is stretched over the whole section
 * (preserveAspectRatio="none"), so 1 viewBox unit of Y is exactly 1% of the
 * slab's height: the arch scales with the section on any screen size.
 */
const VB_W = 1200;
/*
 * The SVG sits HEADROOM% of the slab's height above the section and is
 * (100 + HEADROOM)% tall (see the `-top-[30%] h-[130%]` classes on it), which
 * gives the arch room to rise without being clipped. The slab's resting top
 * edge therefore sits at y = REST_Y.
 */
const HEADROOM = 30;
const REST_Y = HEADROOM;
const VB_H = 100 + HEADROOM;
/*
 * Tallest arch, as a % of the slab's height (= viewBox units). A quadratic
 * bezier reaches half of its control-point offset at the apex, so the control
 * point is pushed 2x this far up.
 */
const MAX_ARCH = 24;
/* Scroll speed (px/s) to viewBox units of arch. */
const VELOCITY_DIVISOR = 100;
/* Scroll speed below this (px/s) is ignored, so slow scrolling stays calm. */
const MIN_SPEED = 60;
/*
 * Wheel notch (deltaY) to viewBox units. The wheel is the only signal left at
 * the very bottom of the page, where scrollY cannot change any further.
 */
const WHEEL_FACTOR = 0.09;
/* Quiet time (s) after the last input before the elastic snap-back. */
const IDLE_BEFORE_SETTLE = 0.09;

/*
 * One rounded arch: both ends stay pinned on the resting edge while the centre
 * swells upward once - a single dome, never two humps, never a straight line.
 */
const buildPath = (arch: number) =>
  `M 0 ${REST_Y} Q ${VB_W * 0.5} ${(REST_Y - arch * 2).toFixed(2)} ` +
  `${VB_W} ${REST_Y} L ${VB_W} ${VB_H} L 0 ${VB_H} Z`;

/**
 * FooterBounce - the rounded wave along the top edge of the Contact
 * section's forest slab (after GSAP's "Footer Bounce" demo, free plugins
 * only).
 *
 * The slab is drawn by an SVG whose top edge is a bezier arch that swells
 * upward at the centre, so the bounce is visible against the yellow page above
 * it. While the user scrolls - in either direction, every time, never
 * once-only - the arch rises in proportion to scroll speed and springs back to
 * perfectly flat with an elastic snap the moment scrolling stops. The section
 * content is a separate layer and never moves.
 *
 * Reduced motion: no bounce - a flat, static slab.
 */
export function FooterBounce({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    gsap.registerPlugin(ScrollTrigger);

    /* The single control point of the slab's top edge. The `d` attribute is
     * rebuilt from it on every frame. */
    const control = { arch: 0 };

    const render = () => {
      /* Clamped at flat: the elastic overshoot reads as "springs up, lands
       * flat, swells a little less, flat again" instead of pressing the arch
       * below the slab's resting edge. */
      path.setAttribute("d", buildPath(Math.max(0, control.arch)));
    };
    render();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[FooterBounce] ready - single-arch bounce " +
          (reducedMotion ? "off (reduced motion)" : "on"),
      );
    }

    if (reducedMotion) return;

    let amp = 0; // live arch height, in viewBox units
    let settle: gsap.core.Tween | null = null;
    let lastY = Math.max(0, window.scrollY);
    let lastInputAt = Number.NEGATIVE_INFINITY;

    /* Active whenever any part of the slab is on screen, so the curve only
     * reacts while the user can actually see it. */
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
    });

    /* One scroll gesture: raise the arch, remember when input last arrived. */
    const bend = (amount: number) => {
      amp = Math.min(MAX_ARCH, Math.max(amp, amount));
      control.arch = amp;
      render();
      lastInputAt = gsap.ticker.time;
    };

    /* Wheel input, so the slab still ripples at the very bottom of the page
     * (where scrollY cannot change any further). */
    const onWheel = (e: WheelEvent) => {
      if (!st.isActive || settle) return;
      bend(Math.abs(e.deltaY) * WHEEL_FACTOR);
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    const tick = (time: number, deltaTimeMs: number) => {
      const dt = Math.min(deltaTimeMs, 100) / 1000;

      const y = Math.max(0, window.scrollY);
      const deltaPx = Math.abs(y - lastY);
      lastY = y;

      /* While the elastic snap-back owns the curve, leave it alone. */
      if (settle) return;

      if (st.isActive) {
        const frameSpeed = deltaPx / Math.max(dt, 1 / 120);
        const speed = Math.max(frameSpeed, Math.abs(st.getVelocity()));
        if (speed > MIN_SPEED) {
          /* Scroll speed to arch height, eased so the edge glides. */
          const target = gsap.utils.clamp(0, MAX_ARCH, speed / VELOCITY_DIVISOR);
          amp += (target - amp) * Math.min(1, dt * 16);
          control.arch = amp;
          render();
          lastInputAt = time;
          return;
        }
      }

      /* Scrolling stopped while the arch was still raised: snap it back with
       * an elastic wobble until it rests perfectly flat. */
      if (amp > 0.5 && time - lastInputAt > IDLE_BEFORE_SETTLE) {
        settle = gsap.to(control, {
          arch: 0,
          duration: 1.1,
          ease: "elastic.out(1, 0.35)",
          onUpdate: render,
          onComplete: () => {
            settle = null;
            amp = 0;
            control.arch = 0;
            render();
          },
        });
        amp = 0;
      }
    };

    gsap.ticker.add(tick);

    return () => {
      /* Full teardown - important under Next.js fast refresh / unmounts. */
      window.removeEventListener("wheel", onWheel);
      gsap.ticker.remove(tick);
      settle?.kill();
      st.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {/* The slab itself: forest below a rounded bezier arch that swells
          upward at the centre, so the bounce is visible against the yellow
          page above. The -top-[30%]/h-[130%] pair mirrors HEADROOM in the
          constants above. */}
      <svg
        className="absolute inset-x-0 -top-[30%] h-[130%] w-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
      >
        <path ref={pathRef} d={buildPath(0)} className="fill-forest" />
      </svg>
    </div>
  );
}