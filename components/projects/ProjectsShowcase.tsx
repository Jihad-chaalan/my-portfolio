"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";

/**
 * Pinned one-at-a-time showcase for the Projects section.
 *
 * Layout: a full-viewport sticky row — fixed left column (highlighted
 * "Projects" title + intro) and a track of project cards. Vertical page
 * cards are spaced 0.8 viewports apart with gentle 0.6-viewport slides:
 * each card waits off-screen right, glides into the stage spot —
 * horizontally centered in the area
 * right of the title column — while the previous card yields in place
 * (small drift + fade, never crossing the title column), so exactly one
 * card is visible at a time.
 *
 * Progressive enhancement: the CSS default (h-[400vh] + sticky) pins the
 * row even without JS; the card choreography is GSAP-scrubbed, i.e. driven
 * 1:1 by user scrolling — not autonomous animation.
 */
export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    try {
      gsap.registerPlugin(ScrollTrigger);

      // The sticky full-viewport row that pins while its content scrolls.
      const stage = track.closest<HTMLElement>("[data-projects-stage]");
      if (!stage) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
      if (cards.length === 0) return;

      // One card per scroll segment; each segment is one viewport tall.
      const seg = () => window.innerHeight;

      /** Centering offset currently applied to the track (kept in sync by
       * centerTrack so off-screen math can account for it). */
      let trackOffset = 0;

      /**
       * The stage spot is horizontally centered in the area RIGHT of the
       * fixed title column — not centered on the whole section (which
       * would slide cards under the title). The track carries this single
       * static offset; per-card tweens then translate each card onto the
       * same spot, which is card 1's natural position.
       */
      const centerTrack = () => {
        const row = track.parentElement;
        const leftCol = track.previousElementSibling;
        if (!(row instanceof HTMLElement) || !(leftCol instanceof HTMLElement)) {
          return;
        }
        const rowStyle = getComputedStyle(row);
        const padRight = parseFloat(rowStyle.paddingRight) || 0;
        const gap = parseFloat(rowStyle.columnGap) || 0;
        // Region: from the track's natural start to the row's content edge.
        const regionLeft = leftCol.offsetLeft + leftCol.offsetWidth + gap;
        const regionWidth = row.offsetWidth - padRight - regionLeft;
        const cardWidth = cards[0]?.offsetWidth ?? 0;
        trackOffset = Math.max(0, (regionWidth - cardWidth) / 2);
        gsap.set(track, { x: trackOffset });
      };

      /**
       * x that lands a card exactly on the stage spot (card 1's natural
       * position): cards later in the track need a bigger negative shift
       * to travel back to the same spot.
       */
      const stageX = (card: HTMLElement) =>
        (cards[0]?.offsetLeft ?? 0) - card.offsetLeft;

      /** x that puts a card's left edge just past the right viewport edge. */
      const offscreenX = (card: HTMLElement) =>
        window.innerWidth - trackOffset - card.offsetLeft;

      // JS owns horizontal movement from now on: kill the native scroller
      // FIRST (and undo any offset it already applied).
      stage.style.overflowX = "hidden";
      stage.scrollLeft = 0;

      // Wrapper height: pinned stage (100vh) + the pin scroll distance
      // (first entrance at 0.2, then one entrance every 0.8 viewports —
      // gentle 0.6-viewport slides — plus a hold before unpinning).
      const setHeight = () => {
        wrap.style.height = `${(1.3 + (cards.length - 2) * 0.8 + 1) * seg()}px`;
      };
      setHeight();

      // Recompute geometry on every ScrollTrigger refresh (resize, font
      // load, image load…): both the centered spot and the wrapper height,
      // so trigger spans can never drift out of sync with the viewport.
      const onRefreshInit = () => {
        centerTrack();
        setHeight();
      };

      const ctx = gsap.context(() => {
        centerTrack();
        ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

        // Each card gets ONE timeline that owns its whole lifecycle —
        // entrance, hold, then yield — because separate scrubbed tweens on
        // the same element record start values from each other's
        // pre-entrance state and misrender (the "ghost card" bug).
        //
        // Card 1 — fades in while the section approaches and finishes
        // exactly as the pin engages, then yields with a gentle crossfade
        // as card 2 enters (pinned 0.2). Trigger span: from "top 80%" (0.8
        // segments before the pin) to 0.7 segments into the pin = 1.5
        // segments of scroll, so child durations/positions map 1:1 to
        // segments (total duration 1.5).
        const firstCard = cards[0];
        if (firstCard) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: wrap,
                start: "top 80%",
                end: () => `top+=${0.7 * seg()} top`,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              firstCard,
              { opacity: 0, y: 80 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" },
            )
            .to(
              firstCard,
              {
                x: -40,
                opacity: 0,
                duration: 0.5,
                ease: "none",
              },
              // Drift begins when card 2's slide-in begins (0.8 seg to the
              // pin + 0.2 seg of pinning).
              1.0,
            );
        }

        // Cards 2+ — wait off-screen right, then glide onto the centered
        // stage spot with a long, gentle slide. Entrances start at pinned
        // 0.2 (almost immediately after the pin) and repeat every 0.8
        // segments: span is 1.3 segments — slide-in [0, 0.6], drift
        // [0.8, 1.3] — so transitions feel smooth, never rushed.
        cards.slice(1).forEach((card, i) => {
          const tl = gsap
            .timeline({
              scrollTrigger: {
                trigger: wrap,
                start: () => `top+=${(0.2 + i * 0.8) * seg()} top`,
                end: () => `top+=${(0.2 + i * 0.8 + 1.3) * seg()} top`,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              card,
              { x: () => offscreenX(card) },
              { x: () => stageX(card), duration: 0.6, ease: "power2.out" },
            );

          // The last card never yields — it stays visible through unpin.
          if (i < cards.length - 2) {
            tl.to(
              card,
              {
                // Drift relative to the card's own settled spot, never
                // sliding across the fixed title/text column.
                x: () => stageX(card) - 40,
                opacity: 0,
                duration: 0.5,
                ease: "none",
              },
              0.8,
            );
          }
        });
      }, wrap);

      if (process.env.NODE_ENV !== "production") {
        // Diagnostic for local testing: seeing this log proves the freshest
        // code is running (and that setup did not fail silently). When this
        // log is missing in dev, the browser is running stale code.
        console.info(
          `[ProjectsShowcase] ready — ${cards.length} cards, stage spot offset ${Math.round(trackOffset)}px`,
        );
      }

      // Re-measure once fonts/images settle, so offsets are never stale.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      void document.fonts?.ready.then(refresh);

      return () => {
        window.removeEventListener("load", refresh);
        ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
        ctx.revert();
        stage.style.overflowX = "";
        stage.scrollLeft = 0;
        wrap.style.height = "";
      };
    } catch (error) {
      // Never fail silently — surface setup problems in the console.
      console.error("[ProjectsShowcase] setup failed:", error);
    }
  }, []);

  return (
    <div ref={wrapRef} data-projects-wrap className="h-[300vh]">
      <div
        data-projects-stage
        className="sticky top-0 flex h-svh flex-col justify-center overflow-x-auto overflow-y-hidden"
      >
        <div className="flex items-center gap-10 pl-4 pr-[10vw] sm:pl-8 lg:gap-16 lg:pl-24">
          {/* Fixed left column — title + intro, never moves while pinned */}
          <div className="w-[min(80vw,360px)] shrink-0">
            <SectionHeading
              headingId="projects-heading"
              eyebrow="Selected work"
              title="Projects"
              align="left"
              highlight
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-forest/75 sm:text-base">
              Real systems built end-to-end — architecture, interfaces, and
              deployment. Keep scrolling to walk through them.
            </p>
          </div>

          {/* Horizontal track of project cards */}
          <div ref={trackRef} className="flex items-stretch gap-8 lg:gap-12">
            {projects.map((project) => (
              <div
                key={project.slug}
                data-project-card
                className="w-[min(85vw,600px)] shrink-0 xl:w-[min(85vw,720px)]"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}