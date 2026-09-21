import type { Project } from "@/types";
import { requireContentfulClient } from "@/lib/contentful-client";
import { mapProject } from "@/lib/contentful-mapper";

/**
 * Data-access seam for projects.
 *
 * UI components always read project content through this module — never from
 * Contentful directly. The `project` content type in Contentful is the single
 * source of truth: the local `data/projects.ts` file was deleted once the
 * migration was verified, so there is no static fallback. Missing
 * configuration, a failed request, or an empty space throws with an
 * actionable message instead of rendering an empty portfolio.
 *
 * Functions are `async` because the backing store is a network API; call
 * sites use `await getAllProjects()`.
 */

const CONTENT_TYPE_PROJECT = "project";

async function fetchProjects(): Promise<Project[]> {
  const client = requireContentfulClient();

  let entries;
  try {
    entries = await client.getEntries({
      content_type: CONTENT_TYPE_PROJECT,
      include: 2,
    });
  } catch (error) {
    throw new Error(
      `[project-repository] Failed to fetch "${CONTENT_TYPE_PROJECT}" ` +
        `entries from Contentful: ${
          error instanceof Error ? error.message : String(error)
        }`,
    );
  }

  if (entries.items.length === 0) {
    throw new Error(
      `[project-repository] Contentful returned 0 published ` +
        `"${CONTENT_TYPE_PROJECT}" entries. Create and publish the project ` +
        `entries (and their image assets) in the space — draft entries are ` +
        `invisible to the Delivery API.`,
    );
  }

  const mapped = entries.items.map((entry) => mapProject(entry as never));

  // Featured projects first (showcase priority); the relative order of the
  // remaining cards is whatever the space returns, so it stays editor-controlled.
  return mapped.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return 0;
  });
}

export async function getAllProjects(): Promise<Project[]> {
  return fetchProjects();
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((project) => project.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getAllProjects();
  return all.find((project) => project.slug === slug);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const all = await getAllProjects();
  return all.map((project) => project.slug).filter(Boolean);
}
