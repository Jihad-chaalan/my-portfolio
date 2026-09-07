import type { SkillCategory } from "@/types";
import { skillCategories } from "@/data/skills";

/**
 * Data-access seam for skill categories. See `lib/project-repository.ts`
 * for the rationale — UI reads through here, not from `data/skills.ts`.
 */
export async function getSkillCategories(): Promise<SkillCategory[]> {
  return skillCategories;
}
