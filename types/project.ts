/**
 * Normalized project model.
 *
 * This type is intentionally decoupled from any specific data source.
 * Phase 1 reads projects from local static data (see `data/projects.ts`)
 * through the repository in `lib/project-repository.ts`. When Contentful
 * (or any other CMS) is introduced later, only the repository needs to
 * change — UI components should never depend on this shape changing.
 */

export interface ProjectImage {
  /** Path relative to `/public`, e.g. "/images/projects/rag-hero.svg" */
  src: string;
  alt: string;
}

export interface ProjectChallenge {
  title: string;
  body: string;
}

export interface ProjectLinks {
  demo?: string;
  github?: string;
}

export interface Project {
  /** URL-safe unique identifier, used for /projects/[slug] */
  slug: string;
  /** Display name, rendered in Bungee */
  name: string;
  /** Short label shown as a category/kicker, e.g. "AI Systems" */
  category: string;
  /** One-sentence hook shown on the project card */
  tagline: string;
  /** 2-3 sentence description shown on the project card */
  summary: string;
  /** Longer narrative overview for the detail page */
  overview: string;
  /** The problem the project addresses */
  problem: string;
  /** How the project solves the problem */
  solution: string;
  /** Architecture explanation, aimed at technical/recruiter readers */
  architecture: string;
  /** Bullet list of key features */
  keyFeatures: string[];
  /** Flat list of technologies/areas used, shown as tags */
  technologies: string[];
  /** Notable technical challenges/decisions */
  challenges: ProjectChallenge[];
  /** Qualitative outcomes/results — no invented statistics */
  outcomes: string[];
  /** Card thumbnail image */
  image: ProjectImage;
  /** Larger hero image for the detail page */
  heroImage: ProjectImage;
  /** Optional additional screenshots for the detail page */
  screenshots: ProjectImage[];
  /** External links */
  links: ProjectLinks;
  /** Whether the project should be highlighted (e.g. featured order/badge) */
  featured: boolean;
}
