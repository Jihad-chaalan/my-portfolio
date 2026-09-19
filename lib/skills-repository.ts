import type { SkillCategory } from "@/types";
import { skillCategories as staticCategories } from "@/data/skills";
import { getContentfulClient } from "@/lib/contentful-client";
import { mapSkillCategory } from "@/lib/contentful-mapper";

/**
 * Data-access seam for skill categories. See `lib/project-repository.ts`
 * for the rationale — UI reads through here, not from `data/skills.ts`.
 *
 * Phase 2: fetches from Contentful when configured, with the same
 * fallback-to-static behavior as the project repository (missing env vars,
 * fetch errors, or zero published entries → local `data/skills.ts`).
 */

const CONTENT_TYPE_SKILL_CATEGORY = "skillCategory";

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const client = getContentfulClient();
  if (!client) return staticCategories; // Not configured → static fallback

  try {
    const response = await client.getEntries({
      content_type: CONTENT_TYPE_SKILL_CATEGORY,
    });

    if (response.items.length === 0) {
      console.warn(
        "[skills-repository] Contentful is configured but returned 0 " +
          "published skill categories. Are the entries published in the " +
          "space? Falling back to local static data.",
      );
      return staticCategories;
    }

    return response.items.map((entry) => mapSkillCategory(entry as never));
  } catch (error) {
    console.error(
      "[skills-repository] Contentful fetch failed — falling back to " +
        "local static data. Error:",
      error,
    );
    return staticCategories;
  }
}
