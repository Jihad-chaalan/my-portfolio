import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroIntro } from "@/components/sections/HeroIntro";
import { siteConfig } from "@/lib/site";

/**
 * Hero / #home → #about. A rounded forest-green box on the yellow canvas.
 * The floating navbar pill sits at the top of this box, so before scrolling
 * the two read as one green unit.
 *
 * Layout: photo on the left, "Hey, I'm Jihad Chaalan — Full-Stack AI
 * Engineer" + CTAs on the right (stacks on mobile).
 */
export function Hero() {
  return (
    <div
      id="home"
      data-hero
      className="relative mx-2 rounded-[2.5rem] bg-forest sm:mx-4 sm:rounded-[3rem] lg:mx-6 lg:flex lg:min-h-[min(calc(100vh-1rem),60rem)] lg:flex-col"
    >
      {/* Page-load intro (scramble → shrink into this box → staged reveal).
          Renders the fixed overlay; inert once it has played. */}
      <HeroIntro wordmark={siteConfig.name} />


      <section
        id="about"
        aria-labelledby="hero-title"
        className="grid gap-10 px-5 pt-22 pb-12 sm:px-10 sm:pt-26 sm:pb-16 lg:flex-1 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:px-14 lg:pt-24 lg:pb-12"
      >
        {/* Photo — fills the left column's full height on desktop; crop is
            anchored slightly above center so the face stays in frame. */}
        <div
          data-intro="photo"
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] shadow-xl shadow-black/20 sm:rounded-[2rem] lg:aspect-auto lg:h-full lg:rounded-[2rem]"
        >
          <Image
            src={siteConfig.portrait.src}
            alt={siteConfig.portrait.alt}
            fill
            unoptimized
            priority
            className="object-cover object-[50%_15%]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:justify-center lg:text-left">
          <p data-intro="eyebrow" className="text-sm font-semibold uppercase tracking-[0.18em] text-canvas/75">
            Hey, I&apos;m
          </p>
          <p data-intro="wordmark" className="font-brand text-5xl leading-none text-canvas sm:text-6xl">
            {siteConfig.name}
          </p>
          <h1
            id="hero-title"
            data-intro="headline"
            className="font-display text-4xl uppercase leading-[0.95] tracking-tight text-canvas sm:text-5xl lg:text-6xl"
          >
            Full-Stack AI Engineer
          </h1>
          <p data-intro="paragraph" className="max-w-2xl text-lg leading-relaxed text-canvas/85 lg:text-xl">
Building AI systems — agents, RAG pipelines, and chatbots — automating business workflows and turning real problems into shipped products.
          </p>

          <ul
            data-intro="chips"
            className="flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            aria-label="What I build"
          >
            {["AI Agents", "Automation", "RAG Systems", "Web Development"].map((item) => (
              <li
                key={item}
                className="rounded-full border border-canvas/30 px-4 py-1.5 text-sm font-medium text-canvas"
              >
                {item}
              </li>
            ))}
          </ul>

          <div
            data-intro="ctas"
            className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 lg:justify-start"
          >
            {/* Hero CTAs as "hang tags" — cousins of the skill stamps: same
                thick border, flat offset shadow and display type, but shaped
                like punched tags (hole + notch) leaning on the dark slab.
                Hover straightens the tag and lifts it off the page. */}
            <ButtonLink
              href="#projects"
              className="relative rotate-[3deg] rounded-md border-2 border-forest bg-orange px-6 pl-7 font-display text-base uppercase tracking-wide text-forest shadow-[6px_7px_0_0_rgba(0,0,0,0.35)] transition-all duration-200 hover:rotate-0 hover:shadow-[3px_4px_0_0_rgba(0,0,0,0.35)] sm:text-lg"
            >
              {/* Punched hole */}
              <span
                aria-hidden="true"
                className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-forest"
              />
              View My Work
              <span
                aria-hidden="true"
                className="ml-1.5 inline-block text-[0.85em] leading-none"
              >
                ↓
              </span>
            </ButtonLink>
            <ButtonLink
              href="#contact"
              className="relative -rotate-[3deg] rounded-md border-2 border-forest bg-orange px-6 pl-7 font-display text-base uppercase tracking-wide text-forest shadow-[6px_7px_0_0_rgba(0,0,0,0.35)] transition-all duration-200 hover:rotate-0 hover:shadow-[3px_4px_0_0_rgba(0,0,0,0.35)] sm:text-lg"
            >
              <span
                aria-hidden="true"
                className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-forest"
              />
              Contact Me
              <span
                aria-hidden="true"
                className="ml-1.5 inline-block text-[0.85em] leading-none"
              >
                ↓
              </span>
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}