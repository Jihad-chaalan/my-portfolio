import type { Project } from "@/types";
import { projects as staticProjects } from "@/data/projects";
import {
  getContentfulClient,
  getContentfulConfig,
} from "@/lib/contentful-client";
import { mapProject } from "@/lib/contentful-mapper";

/**
 * Data-access seam for projects.
 *
 * UI components should always read project data through this module,
 * never directly from `data/projects.ts`.
 *
 * Phase 2: when the Contentful environment variables are present, the
 * bodies below fetch from the Contentful Delivery API and map entries into
 * the normalized `Project` shape (`lib/contentful-mapper.ts`). When they
 * are absent — or Contentful is unreachable / has no published entries —
 * the local static data in `data/` is used as a fallback so the site keeps
 * working everywhere (dev, CI, preview). Only these function bodies know
 * where data comes from; no component or type changes when the source
 * changes.
 *
 * Functions are `async` so call sites (`await getAllProjects()`) match
 * either backing implementation.
 */

const CONTENT_TYPE_PROJECT = "project";

async function fetchProjectsFromContentful(): Promise<Project[] | null> {
  const client = getContentfulClient();
  if (!client) return null; // Not configured → static fallback

  try {
    const response = await client.getEntries({
      content_type: CONTENT_TYPE_PROJECT,
      include: 2,
    });

    if (response.items.length === 0) {
      // Configured but nothing published — almost certainly the "draft
      // entries" mistake. Shout about it, then fall back.
      console.warn(
        "[project-repository] Contentful is configured but returned 0 " +
          "published projects. Are the entries (and their image assets) " +
          "published in the space? Falling back to local static data.",
      );
      return null;
    }

    // Featured projects first (showcase priority), then by creation order
    // so the card sequence is stable and editor-controlled.
    const mapped = response.items.map((entry) => mapProject(entry as never));
    return mapped.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return 0;
    });
  } catch (error) {
    console.error(
      "[project-repository] Contentful fetch failed — falling back to " +
        "local static data. Error:",
      error,
    );
    return null;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const fromContentful = await fetchProjectsFromContentful();
  return fromContentful ?? staticProjects;
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

/** Diagnostics helper — reports which data source is active. */
export function getActiveDataSource(): "contentful" | "static" {
  return getContentfulConfig() ? "contentful" : "static";
}
