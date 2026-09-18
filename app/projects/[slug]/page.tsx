import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
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
    <main id="main-content" className="pt-28">
      <article className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Title + small description ─────────────────────────────── */}
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest/70">
            {project.category}
          </p>
          <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-forest sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-forest/75">
            {project.tagline}
          </p>
        </header>

        {/* ── Image gallery (variable count, click to switch) ───────── */}
        <div className="mt-10">
          <ProjectGallery images={galleryImages} projectName={project.name} />
        </div>

        {/* ── Problem ───────────────────────────────────────────────── */}
        <section
          aria-labelledby="project-problem"
          className="mt-14 border-l-4 border-orange pl-5"
        >
          <h2
            id="project-problem"
            className="font-sub text-2xl uppercase text-forest sm:text-3xl"
          >
            The Problem
          </h2>
          <p className={`mt-4 ${proseClasses}`}>{project.problem}</p>
        </section>

        {/* ── Overview / how it works ───────────────────────────────── */}
        <section aria-labelledby="project-overview" className="mt-12">
          <h2
            id="project-overview"
            className="font-sub text-2xl uppercase text-forest sm:text-3xl"
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
          className="mt-12 border-l-4 border-orange pl-5"
        >
          <h2
            id="project-solution"
            className="font-sub text-2xl uppercase text-forest sm:text-3xl"
          >
            The Solution
          </h2>
          <p className={`mt-4 ${proseClasses}`}>{project.solution}</p>

          {project.challenges.length > 0 ? (
            <>
              <h3 className="mt-6 font-sub text-xl uppercase text-forest">
                Challenges & decisions
              </h3>
              <ul className="mt-3 flex flex-col gap-4">
                {project.challenges.map((challenge) => (
                  <li
                    key={challenge.title}
                    className="rounded-xl border border-forest/10 bg-surface p-5 skill-card-shadow"
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

        {/* ── Technologies & deployment ─────────────────────────────── */}
        <section aria-labelledby="project-tech" className="mt-12 pb-20">
          <h2
            id="project-tech"
            className="font-sub text-2xl uppercase text-forest sm:text-3xl"
          >
            Technologies & Deployment
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-forest/25 px-4 py-1.5 text-sm font-medium text-forest"
              >
                {tech}
              </li>
            ))}
          </ul>
          <p className={`mt-5 max-w-3xl ${proseClasses}`}>
            {project.outcomes.join(" ")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={project.links.demo} external variant="secondary">
              Live Demo
            </ButtonLink>
            {project.links.github ? (
              <ButtonLink
                href={project.links.github}
                external
                variant="secondary"
              >
                GitHub
              </ButtonLink>
            ) : null}
            <ButtonLink href="/" variant="secondary">
              ← Back to Projects
            </ButtonLink>
          </div>
        </section>
      </article>
    </main>
  );
}
