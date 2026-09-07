/**
 * Normalized skill-category model used by the Skills section.
 */

export interface SkillCategory {
  /** URL-safe unique identifier */
  id: string;
  /** Card heading, rendered in Bungee */
  title: string;
  /** Short supporting description, rendered in Manrope */
  description: string;
  /** Flat list of technologies/areas for this category */
  items: string[];
}
