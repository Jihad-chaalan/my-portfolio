import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
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
 * provides — no fixed count), then Problem, Overview (how it works /
 * details), Solution, and Technologies & Deployment.
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
        {/* ── Hero: full-bleed forest slab, canvas display type ─────── */}
        <header className="relative bg-forest">
          {/* Flat orange edge — color blocking, not a gradient (DESIGN.md) */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-orange" />
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-32 sm:px-6 sm:pt-36 lg:px-8">
            <p
              data-reveal
              className="text-sm font-semibold uppercase tracking-[0.18em] text-canvas/70"
            >
              {project.category}
            </p>
            <h1
              data-reveal
              className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight text-canvas sm:text-6xl lg:text-7xl"
            >
              {project.name}
            </h1>
            <p
              data-reveal
              className="mt-6 max-w-3xl text-lg leading-relaxed text-canvas/80 sm:text-xl"
            >
              {project.tagline}
            </p>
            <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={project.links.demo} external variant="highlight">
                Live Demo
              </ButtonLink>
              {project.links.github ? (
                <ButtonLink
                  href={project.links.github}
                  external
                  variant="outline-light"
                >
                  GitHub
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </header>

        <ProjectDetailReveal className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* ── Image gallery (variable count, click to switch) ───────── */}
          <div data-reveal className="-mt-6 pt-10">
            <ProjectGallery
              images={galleryImages}
              projectName={project.name}
            />
          </div>

          {/* ── Problem ───────────────────────────────────────────────── */}
          <section
            aria-labelledby="project-problem"
            data-reveal
            className="mt-16 rounded-2xl border border-forest/10 bg-surface p-6 skill-card-shadow sm:p-10"
          >
            <p
              aria-hidden="true"
              className="font-display text-5xl leading-none text-orange"
            >
              01
            </p>
            <h2
              id="project-problem"
              className="mt-3 font-sub text-2xl uppercase text-forest sm:text-3xl"
            >
              The Problem
            </h2>
            <p className={`mt-4 ${proseClasses}`}>{project.problem}</p>
          </section>

          {/* ── Overview / how it works ───────────────────────────────── */}
          <section
            aria-labelledby="project-overview"
            data-reveal
            className="mt-8 rounded-2xl border border-forest/10 bg-surface p-6 skill-card-shadow sm:p-10"
          >
            <p
              aria-hidden="true"
              className="font-display text-5xl leading-none text-orange"
            >
              02
            </p>
            <h2
              id="project-overview"
              className="mt-3 font-sub text-2xl uppercase text-forest sm:text-3xl"
            >
              Overview
            </h2>
            <p className={`mt-4 ${proseClasses}`}>{project.overview}</p>

            <h3 className="mt-8 font-sub text-xl uppercase text-forest">
              How it works
            </h3>
            <p className={`mt-3 ${proseClasses}`}>{project.architecture}</p>

            <h3 className="mt-8 font-sub text-xl uppercase text-forest">
              Key features
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {project.keyFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-baseline gap-2 text-base text-forest/85 sm:text-lg"
                >
                  <span aria-hidden="true" className="text-orange">
                    →
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>



          {/* ── Solution ──────────────────────────────────────────────── */}
          <section
            aria-labelledby="project-solution"
            data-reveal
            className="mt-8 rounded-2xl border border-forest/10 bg-surface p-6 skill-card-shadow sm:p-10"
          >
            <p
              aria-hidden="true"
              className="font-display text-5xl leading-none text-orange"
            >
              03
            </p>
            <h2
              id="project-solution"
              className="mt-3 font-sub text-2xl uppercase text-forest sm:text-3xl"
            >
              The Solution
            </h2>
            <p className={`mt-4 ${proseClasses}`}>{project.solution}</p>
            {project.challenges.length > 0 ? (
              <>
                <h3 className="mt-8 font-sub text-xl uppercase text-forest">
                  Challenges & decisions
                </h3>
                <ul className="mt-3 flex flex-col gap-4">
                  {project.challenges.map((challenge) => (
                    <li
                      key={challenge.title}
                      className="rounded-xl border border-forest/10 bg-canvas p-5"
                    >
                      <h4 className="font-semibold text-forest">
                        {challenge.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-forest/75">
                        {challenge.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>
        </ProjectDetailReveal>

        {/* ── Technologies & deployment: full-bleed forest band ─────── */}
        <section
          aria-labelledby="project-tech"
          className="relative mt-16 bg-forest"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-orange"
          />
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <h2
              id="project-tech"
              className="font-sub text-2xl uppercase text-canvas sm:text-3xl"
            >
              Technologies & Deployment
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-canvas/30 px-4 py-1.5 text-sm font-medium text-canvas"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-canvas/80 sm:text-lg">
              {project.outcomes.join(" ")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href={project.links.demo} external variant="highlight">
                Live Demo
              </ButtonLink>
              {project.links.github ? (
                <ButtonLink
                  href={project.links.github}
                  external
                  variant="outline-light"
                >
                  GitHub
                </ButtonLink>
              ) : null}
              <ButtonLink href="/" variant="outline-light">
                ← Back to Projects
              </ButtonLink>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
