import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
      className="relative mx-2 rounded-[2.5rem] bg-forest sm:mx-4 sm:rounded-[3rem] lg:mx-6 lg:flex lg:min-h-[min(calc(100vh-1rem),60rem)] lg:flex-col"
    >
      <span
        aria-hidden="true"
        className="absolute right-8 top-1/2 hidden -translate-y-1/2 rotate-90 text-xs font-medium tracking-[0.35em] text-canvas/50 xl:block"
      >
        RAG — AGENTS — AUTOMATION
      </span>

      <section
        id="about"
        aria-labelledby="hero-title"
        className="grid gap-10 px-5 pt-22 pb-12 sm:px-10 sm:pt-26 sm:pb-16 lg:flex-1 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:px-14 lg:pt-24 lg:pb-12"
      >
        {/* Photo — fills the left column's full height on desktop; crop is
            anchored slightly above center so the face stays in frame. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] shadow-xl shadow-black/20 sm:rounded-[2rem] lg:aspect-auto lg:h-full lg:rounded-[2rem]">
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
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-canvas/75">
            Hey, I&apos;m
          </p>
          <p className="font-brand text-5xl leading-none text-canvas sm:text-6xl">
            {siteConfig.name}
          </p>
          <h1
            id="hero-title"
            className="font-display text-4xl uppercase leading-[0.95] tracking-tight text-canvas sm:text-5xl lg:text-6xl"
          >
            Full-Stack AI Engineer
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-canvas/85 lg:text-xl">
            I build AI-powered websites, applications, RAG systems, AI agents,
            and intelligent systems — taking real products from frontend to
            backend to deployment.
          </p>

          <ul
            className="flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            aria-label="What I build"
          >
            {["RAG Systems", "AI Agents", "Automation", "Full-Stack"].map((item) => (
              <li
                key={item}
                className="rounded-full border border-canvas/30 px-4 py-1.5 text-sm font-medium text-canvas"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <ButtonLink href="#projects">View Projects</ButtonLink>
            <ButtonLink href="#contact" variant="outline-light">
              Contact Me
            </ButtonLink>
            <ButtonLink
              href={siteConfig.links.bookACall}
              external
              variant="outline-light"
            >
              Book a Call
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}