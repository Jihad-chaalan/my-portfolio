import type { Project } from "@/types";
import { projects } from "@/data/projects";

/**
 * Data-access seam for projects.
 *
 * UI components should always read project data through this module,
 * never directly from `data/projects.ts`. Phase 1 implements this
 * repository against local static data. When Contentful (or another
 * CMS) is introduced, only the function bodies below need to change —
 * the return types stay the same normalized `Project` shape, so no
 * UI component needs to be rewritten.
 *
 * Functions are `async` on purpose, even though the local implementation
 * is synchronous, so call sites already match the shape a future
 * network-backed repository will need.
 */

export async function getAllProjects(): Promise<Project[]> {
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return projects.find((project) => project.slug === slug);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return projects.map((project) => project.slug);
}
