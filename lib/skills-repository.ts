import type { SkillCategory } from "@/types";
import { requireContentfulClient } from "@/lib/contentful-client";
import { mapSkillCategory } from "@/lib/contentful-mapper";

/**
 * Data-access seam for skill categories. See `lib/project-repository.ts` for
 * the rationale — UI reads through here, and Contentful (the `skillCategory`
 * content type) is the single source of truth. The local `data/skills.ts`
 * file was deleted with the rest of the static data, so missing
 * configuration, a failed request, or an empty space throws with an
 * actionable message rather than rendering an empty skills section.
 */

const CONTENT_TYPE_SKILL_CATEGORY = "skillCategory";

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const client = requireContentfulClient();

  let entries;
  try {
    entries = await client.getEntries({
      content_type: CONTENT_TYPE_SKILL_CATEGORY,
    });
  } catch (error) {
    throw new Error(
      `[skills-repository] Failed to fetch "${CONTENT_TYPE_SKILL_CATEGORY}" ` +
        `entries from Contentful: ${
          error instanceof Error ? error.message : String(error)
        }`,
    );
  }

  if (entries.items.length === 0) {
    throw new Error(
      `[skills-repository] Contentful returned 0 published ` +
        `"${CONTENT_TYPE_SKILL_CATEGORY}" entries. Create and publish the ` +
        `skill category entries in the space — draft entries are invisible ` +
        `to the Delivery API.`,
    );
  }

  return entries.items.map((entry) => mapSkillCategory(entry as never));
}
