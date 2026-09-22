import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MobileClamp, ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectDetailReveal } from "@/components/projects/ProjectDetailReveal";
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/lib/project-repository";
import { siteConfig } from "@/lib/site";

/**
 * Project detail page — `/projects/[slug]`.
 *
 * Content order follows the brief: title, small description, a
 * click-through image gallery (whatever number of images the data source
 * provides — no fixed count), then Problem, Solution, Overview (how it
 * works / details), and Technologies & Deployment.
 *
 * The project data comes from the repository (`lib/project-repository`),
 * so when Contentful is integrated in Phase 2 only the repository bodies
 * change — this page and its components are untouched.
 */

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description: project.summary,
    openGraph: {
      title: `${project.name} | ${siteConfig.name}`,
      description: project.summary,
      type: "article",
    },
  };
}

/** Shared prose-block styling for the narrative sections. */
const proseClasses = "text-base leading-relaxed text-forest/85 sm:text-lg";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  /* Gallery = all images the source provides. Hero first, then the card
     image and any additional screenshots — no fixed count. */
  const galleryImages = [
    project.heroImage,
    project.image,
    ...project.screenshots,
  ];

  return (
    <main id="main-content">
      <article>
        {/* Editorial title block */}
        <header className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-36 lg:px-8">
          {/* Breadcrumb row — the standard home for a back link: aligned
              with the content edge, directly above the title's meta row */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest/50 transition-colors duration-200 hover:text-orange"
          >
            <span aria-hidden="true" className="text-orange">←</span>
            All Projects
          </Link>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="h-0.5 w-10 bg-orange" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest/70">
              {project.category}
            </p>
          </div>
          <h1 className="mt-4 max-w-full break-words font-display text-[13vw] uppercase leading-[0.9] tracking-tight text-forest sm:mt-5 sm:text-7xl lg:text-8xl">
            {project.name}
          </h1>
          {/* Orange underline stroke � a marker swash under the title */}
          <div aria-hidden="true" className="mt-2 h-3 w-40 -rotate-1 bg-orange sm:w-64" />
          <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-lg leading-relaxed text-forest/80 sm:text-xl">
              {project.tagline}
            </p>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              {/* Hero plates — the Technologies/Skills stamped-plate style,
                  scaled up for display type. Same construction (thick border,
                  flat offset shadow, uppercase display label, tilt), mirrored
                  as a pair: orange plate / canvas plate, opposite shadows. */}
              <Link
                href={project.links.demo ?? "#"}
                target={project.links.demo ? "_blank" : undefined}
                rel={project.links.demo ? "noopener noreferrer" : undefined}
                aria-disabled={!project.links.demo}
                className={`inline-flex min-h-11 items-center justify-center rounded-md px-6 font-display text-base uppercase tracking-wide sm:text-lg ${project.links.demo ? "rotate-[2deg] border-2 border-forest bg-orange text-forest shadow-[5px_6px_0_0_var(--color-forest)] transition-all duration-200 hover:rotate-0 hover:shadow-[2px_3px_0_0_var(--color-forest)]" : "cursor-not-allowed border-2 border-forest/30 bg-canvas/60 text-forest/40 shadow-none"}`}
              >
                Live Demo
              </Link>
              {project.links.github ? (
                <Link
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 rotate-[-2deg] items-center justify-center rounded-md border-2 border-forest bg-canvas px-6 font-display text-base uppercase tracking-wide text-forest shadow-[5px_6px_0_0_var(--color-orange)] transition-all duration-200 hover:rotate-0 hover:shadow-[2px_3px_0_0_var(--color-orange)] sm:text-lg"
                >
                  GitHub
                </Link>
              ) : null}
            </div>
          </div>
        </header>

        <ProjectDetailReveal className="relative mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
          {/* The journey line — runs behind the whole story, stages hang off it */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[15px] top-0 w-1 bg-forest/10 sm:left-[35px]"
          />

          {/* ==== Taped-photo gallery (image style kept) ==== */}
          <div data-reveal id="stage-gallery" className="relative scroll-mt-28 pl-10 sm:scroll-mt-36 sm:pl-24">
            <span
              aria-hidden="true"
              className="absolute left-[9px] top-10 z-10 h-3.5 w-3.5 rotate-45 bg-orange sm:left-[27px] sm:top-14 sm:h-5 sm:w-5"
            />
            <ProjectGallery
              images={galleryImages}
              projectName={project.name}
            />
          </div>


          {/* ==== Stage 01 � The Problem (white paper card) ==== */}
          <section
            id="stage-problem" aria-labelledby="project-problem"
            data-reveal
            className="relative mt-10 pl-10 sm:mt-20 sm:pl-24"
          >
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-2 z-10 flex h-4 w-4 -rotate-45 items-center justify-center bg-orange sm:left-[27px] sm:h-5 sm:w-5"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-canvas sm:h-2 sm:w-2" />
            </span>
            <p className="font-display text-5xl leading-none text-forest/15 sm:text-8xl">01</p>
            <div className="-mt-3 max-w-3xl -rotate-[0.4deg] border border-forest/10 bg-surface p-4 shadow-[3px_4px_0_0_var(--color-forest)] sm:-mt-4 sm:p-9 sm:shadow-[5px_7px_0_0_var(--color-forest)]">
              <h2 id="project-problem" className="font-sub text-2xl uppercase text-forest sm:text-3xl">
                The Problem
              </h2>
              <p className={`mt-4 ${proseClasses}`}><MobileClamp text={project.problem} /></p>
            </div>
          </section>

          {/* ==== Stage 03 � The Solution (dark forest story beat) ==== */}
          <section
            id="stage-solution" aria-labelledby="project-solution"
            data-reveal
            className="relative mt-10 pl-10 sm:mt-20 sm:pl-24"
          >
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-2 z-10 flex h-4 w-4 -rotate-45 items-center justify-center bg-orange sm:left-[27px] sm:h-5 sm:w-5"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-canvas sm:h-2 sm:w-2" />
            </span>
            <p className="font-display text-5xl leading-none text-orange/80 sm:text-8xl">02</p>
            <div className="-mt-3 max-w-3xl -rotate-[0.4deg] rounded-2xl bg-forest p-4 shadow-[4px_5px_0_0_var(--color-orange)] sm:-mt-4 sm:p-9 sm:shadow-[6px_8px_0_0_var(--color-orange)]">
              <h2 id="project-solution" className="font-sub text-2xl uppercase text-canvas sm:text-3xl">
                The Solution
              </h2>
              <p className={`mt-4 ${proseClasses} !text-canvas/85`}><MobileClamp text={project.solution} /></p>
              {project.challenges.length > 0 ? (
                <>
                  <h3 className="mt-8 font-sub text-lg uppercase text-canvas">
                    Challenges &amp; decisions
                  </h3>
                  <ul className="mt-3 flex flex-col gap-4">
                    {project.challenges.map((challenge) => (
                      <li key={challenge.title} className="rounded-xl border border-canvas/20 bg-canvas/10 p-5">
                        <h4 className="font-semibold text-canvas">{challenge.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-canvas/75">{challenge.body}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </section>
          {/* ==== Stage 02 � Overview / how it works (white paper card) ==== */}
          <section
            id="stage-overview" aria-labelledby="project-overview"
            data-reveal
            className="relative mt-10 pl-10 sm:mt-20 sm:pl-24"
          >
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-2 z-10 flex h-4 w-4 -rotate-45 items-center justify-center bg-orange sm:left-[27px] sm:h-5 sm:w-5"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-canvas sm:h-2 sm:w-2" />
            </span>
            <p className="font-display text-4xl leading-none text-forest/15 sm:text-8xl">03</p>
            <div className="-mt-4 max-w-3xl rotate-[0.4deg] border border-forest/10 bg-surface p-5 shadow-[3px_4px_0_0_var(--color-forest)] sm:p-9 sm:shadow-[5px_7px_0_0_var(--color-forest)]">
              <h2 id="project-overview" className="font-sub text-2xl uppercase text-forest sm:text-3xl">
                Overview
              </h2>
              <p className={`mt-4 ${proseClasses}`}><MobileClamp text={project.overview} /></p>

              <h3 className="mt-8 font-sub text-lg uppercase text-forest">How it works</h3>
              <p className={`mt-3 ${proseClasses}`}><MobileClamp text={project.architecture} /></p>

              <h3 className="mt-8 font-sub text-lg uppercase text-forest">Key features</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {project.keyFeatures.map((feature) => (
                  <li key={feature} className="flex items-baseline gap-2 text-base text-forest/85 sm:text-lg">
                    <span aria-hidden="true" className="text-orange">?</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </section>


          {/* ==== Stage 04 — Technologies & Deployment (tool wall) ==== */}
          <section
            id="stage-tech" aria-labelledby="project-tech"
            data-reveal
            className="relative mt-10 pl-10 pb-20 sm:mt-20 sm:pl-24"
          >
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-2 z-10 flex h-4 w-4 -rotate-45 items-center justify-center bg-orange sm:left-[27px] sm:h-5 sm:w-5"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-canvas sm:h-2 sm:w-2" />
            </span>
            <p className="font-display text-4xl leading-none text-forest/15 sm:text-8xl">04</p>
            <div className="-mt-4 max-w-3xl rotate-[0.4deg] border border-forest/10 bg-surface p-5 shadow-[3px_4px_0_0_var(--color-forest)] sm:p-9 sm:shadow-[5px_7px_0_0_var(--color-forest)]">
              <h2 id="project-tech" className="font-sub text-2xl uppercase text-forest sm:text-3xl">
                Technologies &amp; Deployment
              </h2>
              {/* Tool wall: each tech is a stamped plate on the card —
                  alternating tilt, orange flip on hover, CSS only */}
              <ul className="mt-6 flex flex-wrap gap-3">
                {project.technologies.map((tech, i) => (
                  <li
                    key={tech}
                    className={`${i % 2 === 0 ? "-rotate-2" : "rotate-2"} rounded-md border-2 border-forest bg-canvas px-4 py-2 font-display text-sm uppercase tracking-wide text-forest shadow-[3px_3px_0_0_var(--color-orange)] transition-all duration-200 hover:rotate-0 hover:bg-orange hover:text-forest hover:shadow-[3px_3px_0_0_var(--color-forest)]`}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-base leading-relaxed text-forest/85 sm:text-lg">
                {project.outcomes.join(" ")}
              </p>
            </div>
          </section>
        </ProjectDetailReveal>
      </article>
    </main>
  );
}
