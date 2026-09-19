import type { Asset } from "contentful";
import type { Project, ProjectChallenge, SkillCategory } from "@/types";

/**
 * Maps Contentful entries/assets into the normalized shapes in `types/`.
 *
 * The `Project` / `SkillCategory` types are the site's data contract (see
 * docs/ARCHITECTURE.md): they contain no Contentful-specific shapes, so
 * everything Contentful-flavored (entry fields, asset links, `//`-style
 * URLs, locale-wrapped values) is normalized HERE and nowhere else.
 *
 * Missing/empty values map to the contract's "absent" convention — notably
 * empty `demoUrl` / `githubUrl` become `null`, which is what the project
 * card's disabled "Live Demo" button keys off.
 */

/* ── Minimal shapes of what we read from the Delivery SDK ─────────────── */

interface ProjectEntryFields {
  slug?: string;
  name?: string;
  category?: string;
  tagline?: string;
  summary?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  keyFeatures?: unknown;
  technologies?: unknown;
  challenges?: unknown;
  outcomes?: unknown;
  image?: Asset | undefined;
  heroImage?: Asset | undefined;
  screenshots?: Asset[] | undefined;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

interface SkillCategoryEntryFields {
  id?: string;
  title?: string;
  description?: string;
  items?: unknown;
}

interface ProjectEntryLike {
  fields: ProjectEntryFields;
}

interface SkillCategoryEntryLike {
  fields: SkillCategoryEntryFields;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

/**
 * The SDK types asset fields loosely (string | AssetFile unions for
 * localized/linked values), so read them defensively with type guards
 * instead of trusting the declared shape.
 */
function readAssetFileUrl(asset: Asset | undefined): string | null {
  const file = asset?.fields?.file;
  if (typeof file === "string") return file;
  const url = (file as { url?: unknown } | undefined)?.url;
  return typeof url === "string" ? url : null;
}

function readAssetText(
  asset: Asset | undefined,
  key: "description" | "title",
): string | null {
  const value = asset?.fields?.[key];
  return typeof value === "string" && value.trim() ? value : null;
}

/** Contentful asset URLs are protocol-relative ("//images.ctfassets.net/…"). */
function assetSrc(asset: Asset | undefined): string {
  const url = readAssetFileUrl(asset);
  if (!url) return "";
  return url.startsWith("http") ? url : `https:${url}`;
}

/** Alt text preference: asset description, then title, then a fallback. */
function assetAlt(asset: Asset | undefined, fallback: string): string {
  return readAssetText(asset, "description") ?? readAssetText(asset, "title") ?? fallback;
}

function toImage(asset: Asset | undefined, fallbackAlt: string) {
  return { src: assetSrc(asset), alt: assetAlt(asset, fallbackAlt) };
}

/** Normalizes an optional URL: empty/undefined → `null` (no demo button). */
function toNullableUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Passes a JSON-array field through, guarding the type. The Contentful
 * JSON object fields hold arrays (of strings, or {title, body} objects) —
 * anything unexpected is logged and mapped to an empty array so a broken
 * field can never crash the page.
 */
function toStringArray(value: unknown, fieldName: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    console.error(
      `[contentful-mapper] Field "${fieldName}" should be a JSON array of strings — got:`,
      value,
    );
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function toChallenges(value: unknown): ProjectChallenge[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    console.error(
      `[contentful-mapper] Field "challenges" should be a JSON array of {title, body} — got:`,
      value,
    );
    return [];
  }
  return value
    .filter(
      (item): item is ProjectChallenge =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ProjectChallenge).title === "string" &&
        typeof (item as ProjectChallenge).body === "string",
    )
    .map(({ title, body }) => ({ title, body }));
}

/* ── Public mappers ────────────────────────────────────────────────────── */

export function mapProject(entry: ProjectEntryLike): Project {
  const fields = entry.fields;
  const name = fields.name ?? "Untitled project";

  return {
    slug: fields.slug ?? "",
    name,
    category: fields.category ?? "",
    tagline: fields.tagline ?? "",
    summary: fields.summary ?? "",
    overview: fields.overview ?? "",
    problem: fields.problem ?? "",
    solution: fields.solution ?? "",
    architecture: fields.architecture ?? "",
    keyFeatures: toStringArray(fields.keyFeatures, "keyFeatures"),
    technologies: toStringArray(fields.technologies, "technologies"),
    challenges: toChallenges(fields.challenges),
    outcomes: toStringArray(fields.outcomes, "outcomes"),
    image: toImage(fields.image, `${name} card image`),
    heroImage: toImage(fields.heroImage, `${name} hero image`),
    screenshots: (fields.screenshots ?? []).map((asset) =>
      toImage(asset, `${name} screenshot`),
    ),
    links: {
      demo: toNullableUrl(fields.demoUrl),
      github: toNullableUrl(fields.githubUrl),
    },
    featured: fields.featured ?? false,
  };
}

export function mapSkillCategory(entry: SkillCategoryEntryLike): SkillCategory {
  const fields = entry.fields;

  return {
    id: fields.id ?? "",
    title: fields.title ?? "",
    description: fields.description ?? "",
    items: toStringArray(fields.items, "items"),
  };
}
