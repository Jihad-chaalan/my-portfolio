"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
 * True once the intro has played in this document's JS lifetime. A module
 * variable (not sessionStorage) is exactly the "once per page load" guard:
 * it resets on a full reload, and survives SPA route changes, so returning
 * to the homepage from a detail page never replays the intro.
 */
let hasPlayed = false;

const SCRAMBLE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/* GSAP-time seconds per tick — the walk pace (tune this to speed the whole
 * stage up or down). */
const SCRAMBLE_INTERVAL = 0.08;
/* Random decoy letters per name letter. 0 = ONLY your name's letters ever
 * appear (J → I → H → A → D → C → H → A → A → L → A → N); raise it if you
 * ever want the slot-machine flicker back before each real letter. */
const SCRAMBLE_SWAPS = 0;
/* How many ticks each real letter stays on screen. */
const LETTER_HOLD = 2;
/* Palette orange (see app/globals.css --color-orange). */
const ORANGE_HEX = "#FC7D14";
/* Starting color of the primary CTA before it "inks in" (orange at 35%). */
const PRIMARY_MUTED = "rgba(252, 125, 20, 0.35)";

interface HeroIntroProps {
  /** Brand text the scramble resolves into, e.g. "JIHAD CHAALAN". */
  wordmark: string;
}

/**
 * Page-load intro for the Hero section (single gsap.timeline()).
 *
 * A full-screen forest overlay decodes the name one letter at a time —
 * a single center glyph locks on "J", then "I", and so on through
 * "JIHAD CHAALAN" — after which the overlay shrinks into the real hero
 * container's exact rect and vanishes; the real hero underneath is
 * pixel-identical at that moment, so the swap is invisible.
 * The page then reveals in staggered stages: nav + wordmark + eyebrow,
 * headline, paragraph + chips, CTAs (primary muted → full orange) and the
 * portrait springing in from bottom-left.
 *
 * The content is NOT built by the animation — the real hero exists in
 * normal flow underneath the opaque overlay. Targets are found via
 * `data-intro` attributes on existing elements (and `[data-intro='nav']`
 * on the fixed header), so content stays single-sourced in Hero/Navbar;
 * this component only orchestrates, receiving just the wordmark text.
 *
 * Guards: plays once per page load (module flag, survives SPA navigations);
 * skips entirely for prefers-reduced-motion (the overlay is also
 * `motion-reduce:hidden`); scroll is locked while the overlay is up;
 * cleanup via gsap.context.
 */
export function HeroIntro({ wordmark }: HeroIntroProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    /* The overlay is rendered as the hero's last child, so its DOM parent
     * is the rounded hero container the overlay morphs into. */
    const hero = overlay.closest<HTMLElement>("[data-hero]");
    if (!hero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* Replay guard + reduced motion: drop the overlay (imperative removal
     * is safe here — the node is only ever removed once the intro is done
     * or skipped, never mid-play, so StrictMode's effect re-run still finds
     * it attached and replays correctly). */
    if (hasPlayed || reducedMotion) {
      overlay.remove();
      return;
    }

    const letter = overlay.querySelector<HTMLElement>("[data-intro='letter']");
    const nav = document.querySelector<HTMLElement>("[data-intro='nav']");
    const eyebrow = hero.querySelector<HTMLElement>("[data-intro='eyebrow']");
    const wordmarkEl = hero.querySelector<HTMLElement>(
      "[data-intro='wordmark']",
    );
    const headline = hero.querySelector<HTMLElement>("[data-intro='headline']");
    const paragraph = hero.querySelector<HTMLElement>("[data-intro='paragraph']");
    const chips = gsap.utils.toArray<HTMLElement>(
      hero.querySelectorAll("[data-intro='chips'] > *"),
    );
    const ctas = gsap.utils.toArray<HTMLElement>(
      hero.querySelectorAll("[data-intro='ctas'] > *"),
    );
    const photo = hero.querySelector<HTMLElement>("[data-intro='photo']");
    const primaryCta = ctas[0] ?? null;

    /* Scroll stays locked while the overlay is up — otherwise scrolling
     * would move the hero's viewport-relative rect out from under the
     * shrink tween. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      /* Hide everything that fades in later (opacity/visibility + offsets
       * only — layout is untouched, so the hero's rect stays valid). */
      const fadeTargets = [
        nav,
        eyebrow,
        wordmarkEl,
        headline,
        paragraph,
        ...chips,
        ...ctas,
        photo,
      ].filter((el): el is HTMLElement => el !== null);
      gsap.set(fadeTargets, { autoAlpha: 0 });
      gsap.set(nav, { y: -10 });
      gsap.set(
        [eyebrow, wordmarkEl, headline, paragraph, ...chips].filter(
          (el): el is HTMLElement => el !== null,
        ),
        { y: 20 },
      );
      gsap.set(ctas, { y: 14 });
      /* Primary CTA starts muted, then inks in during the final stage. */
      if (primaryCta) {
        gsap.set(primaryCta, { backgroundColor: PRIMARY_MUTED });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          /* The flag is set only when the sequence actually completes —
           * NOT at effect start. React StrictMode (dev) runs effects
           * run→cleanup→run; setting it early made the second, real run
           * skip the whole intro. */
          hasPlayed = true;
          overlay.remove();
          document.body.style.overflow = previousOverflow;
        },
      });

      /* Stage 1 — one letter at a time, in name order: only your name's
       * letters ever appear — J, hold, I, hold, H … walking the full
       * "JIHAD CHAALAN", with a blank beat on the word gap. (SCRAMBLE_SWAPS
       * = 0 means no random decoy letters; raise it to restore flicker.) */
      if (letter) {
        const sequence = Array.from(wordmark.toUpperCase());
        const ticksPerChar = SCRAMBLE_SWAPS + LETTER_HOLD;
        const totalTicks = sequence.length * ticksPerChar;
        let tick = 0;
        const renderTick = () => {
          const slot = Math.min(
            Math.floor(tick / ticksPerChar),
            sequence.length - 1,
          );

          const phase = tick - slot * ticksPerChar;
          const char = sequence[slot];
          if (char === " ") {
            /* Blank beat on the word gap (nbsp keeps the line height). */
            letter.textContent = "\u00A0";
            return;
          }
          letter.textContent =
            phase < SCRAMBLE_SWAPS
              ? SCRAMBLE_ALPHABET[
                  Math.floor(Math.random() * SCRAMBLE_ALPHABET.length)
                ]
              : char;
        };
        renderTick();
        tl.to(
          { done: 0 },
          {
            done: 1,
            duration: SCRAMBLE_INTERVAL,
            repeat: totalTicks - 1,
            ease: "none",
            onRepeat: () => {
              tick = Math.min(tick + 1, totalTicks - 1);
              renderTick();
            },
          },
        );
      }

      /* Stage 2 — fade the glyph, shrink into the hero's exact rect. The
       * rect is measured when the tween starts (function-based values), so
       * late font swaps can't skew the target. */
      tl.to(
        [letter].filter((el): el is HTMLElement => el !== null),
        { autoAlpha: 0, y: 12, duration: 0.22, ease: "power1.in" },
        ">0.06",
      );
      tl.to(
        overlay,
        {
          width: () => hero.getBoundingClientRect().width,
          height: () => hero.getBoundingClientRect().height,
          top: () => hero.getBoundingClientRect().top,
          left: () => hero.getBoundingClientRect().left,
          borderRadius: () => getComputedStyle(hero).borderTopLeftRadius,
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<0.12",
      );

      /* Stage 3 — instant hand-off: the overlay now sits pixel-perfect on
       * the hero (same rect, radius, and forest fill), so vanishing it is
       * invisible. */
      tl.set(overlay, { autoAlpha: 0, pointerEvents: "none" });

      /* Stage 4 — nav + wordmark + eyebrow together (~0.2s). */
      tl.to(
        [nav, wordmarkEl, eyebrow].filter((el): el is HTMLElement => el !== null),
        { autoAlpha: 1, y: 0, duration: 0.2 },
        ">-0.02",
      );

      /* Stage 5 — headline. */
      if (headline) {
        tl.to(headline, { autoAlpha: 1, y: 0, duration: 0.35 }, ">-0.05");
      }

      /* Stage 6 — paragraph, then chips, slightly overlapping. */
      tl.to(
        [paragraph, ...chips].filter((el): el is HTMLElement => el !== null),
        { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06 },
        ">-0.1",
      );

      /* Stage 7 — CTAs (primary inks to full orange) + portrait spring. */
      tl.to(
        ctas,
        { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.05 },
        ">-0.1",
      );
      if (primaryCta) {
        tl.to(primaryCta, { backgroundColor: ORANGE_HEX, duration: 0.2 }, "<");
      }
      if (photo) {
        tl.fromTo(
          photo,
          { x: -60, y: 40, rotate: -15, autoAlpha: 0 },
          {
            x: 0,
            y: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "<",
        );
      }
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [wordmark]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className={
        "fixed left-0 top-0 z-[999] flex h-screen w-screen items-center justify-center bg-forest motion-reduce:hidden"
      }
    >
      <div className="flex flex-col items-center">
        <span
          data-intro="letter"
          className="font-brand select-none text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-canvas"
        >
          {wordmark.charAt(0)}
        </span>
      </div>
    </div>
  );
}