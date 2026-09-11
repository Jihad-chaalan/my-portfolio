import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

/**
 * Project card — the centerpiece element. Shows the project image,
 * Bungee name, a tight hook (tagline), a few key features, the tech
 * stack, and actions. Images are referenced from project data so they
 * can be swapped for real screenshots without touching this component.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;

  return (
    <article className="skill-card-shadow group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-surface transition-colors duration-200 hover:border-orange">
      <Link
        href={href}
        aria-label={`View details for ${project.name}`}
        className="relative block aspect-[16/9] max-h-[42svh] overflow-hidden bg-forest"
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-canvas">
          {project.category}
        </span>
      </Link>

      <div className="flex flex-col gap-4 p-6 sm:p-7">
        <h3 className="font-sub text-2xl leading-tight text-forest sm:text-3xl">
          <Link
            href={href}
            className="transition-colors duration-200 hover:text-orange"
          >
            {project.name}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-forest/75">
          {project.tagline}
        </p>

        <ul className="flex flex-col gap-1.5 text-sm text-forest/80" aria-label={`${project.name} key features`}>
          {project.keyFeatures.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-baseline gap-2">
              <span aria-hidden="true" className="text-orange">
                →
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap gap-2" aria-label={`${project.name} technologies`}>
          {project.technologies.slice(0, 6).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-forest/25 px-3 py-1 text-xs font-medium text-forest"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
          <ButtonLink href={href}>View Details</ButtonLink>
          {project.links.demo ? (
            <ButtonLink href={project.links.demo} external variant="secondary">
              Live Demo
            </ButtonLink>
          ) : null}
          {project.links.github ? (
            <ButtonLink href={project.links.github} external variant="secondary">
              GitHub
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}