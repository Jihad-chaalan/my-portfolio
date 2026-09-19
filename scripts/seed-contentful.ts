/**
 * One-off Contentful seed script — pushes the current `data/projects.ts`
 * and `data/skills.ts` content into the user's Contentful space.
 *
 *  - Idempotent: re-running updates existing entries (matched by
 *    `project.slug` / `skillCategory.id`) instead of duplicating them.
 *  - Uploads the placeholder images from `public/images/projects/` as
 *    Contentful assets and links them (`image`, `heroImage`; screenshots
 *    start empty). Assets are matched by title, so re-runs reuse them.
 *  - Publishes every created/updated entry and asset, so the Delivery API
 *    (and therefore the site) sees them immediately.
 *  - Never deletes anything.
 *
 * Requirements: a **Content management token** (Settings → API keys →
 * Content management tokens → "Generate personal token") in `.env.local`
 * as `CONTENTFUL_MANAGEMENT_TOKEN`, plus `CONTENTFUL_SPACE_ID` and
 * `CONTENTFUL_ENVIRONMENT` (delivery values already there).
 *
 * Run with:  npm run seed:contentful
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "contentful-management";
import type { Project } from "../types/project";
import type { SkillCategory } from "../types/skill";
import { projects } from "../data/projects";
import { skillCategories } from "../data/skills";

/* ── Env (read .env.local directly — tsx doesn't auto-load it) ─────────── */

function readEnvFile(name: string): Record<string, string> {
  const filePath = path.join(process.cwd(), name);
  if (!fs.existsSync(filePath)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) out[match[1]] = match[2].trim();
  }
  return out;
}

const envFile = { ...readEnvFile(".env.local"), ...readEnvFile(".env") };

const SPACE_ID = envFile.CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = envFile.CONTENTFUL_ENVIRONMENT || "master";
const MANAGEMENT_TOKEN = envFile.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error(
    [
      "",
      "✗ Missing Contentful management credentials.",
      "",
      "  1. In Contentful: Settings → API keys → Content management tokens",
      '     → "Generate personal token" (name it e.g. "portfolio-seed").',
      "  2. Copy the token into .env.local as:",
      "",
      "     CONTENTFUL_MANAGEMENT_TOKEN=<paste-token-here>",
      "",
      "  3. Re-run:  npm run seed:contentful",
      "",
      "  (The Content **delivery** token cannot create content — only a",
      "   management token can. Keep it out of git; .env.local is ignored.)",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

/* ── Contentful setup ──────────────────────────────────────────────────── */

/* `createClient` returns the **plain** client in contentful-management v12 —
   the fluent `getSpace()/getEnvironment()` client now lives behind a
   deprecated `{ type: 'legacy' }` flag. The plain client takes the space and
   environment ids as parameters on every call instead, hence `BASE`. */
const client = createClient({ accessToken: MANAGEMENT_TOKEN });

/** Space + environment pair that every plain-client call needs. */
const BASE = { spaceId: SPACE_ID, environmentId: ENVIRONMENT_ID } as const;

/** Plain-SDK asset link shape for entry fields. */
function assetLink(assetId: string) {
  return { sys: { type: "Link" as const, linkType: "Asset", id: assetId } };
}

/** The space's default locale code (e.g. `en-US`) — every field value is
    written under this key. */
async function getDefaultLocale(): Promise<string> {
  const locales = await client.locale.getMany(BASE);
  return locales.items.find((locale) => locale.default)?.code ?? "en-US";
}

/**
 * The Contentful Management API can return two items for the same entry id —
 * the draft and the published version. The highest `sys.version` is the
 * current one, which is what updates must be based on.
 */
function pickLatestVersion<T extends { sys: { version: number } }>(
  items: T[],
): T | undefined {
  return items.reduce<T | undefined>(
    (newest, item) =>
      !newest || item.sys.version > newest.sys.version ? item : newest,
    undefined,
  );
}

/**
 * Finds a published-or-draft asset by exact title, else uploads a new one
 * from disk, processes it, and publishes it. Returns the asset id.
 */
async function ensureAsset(
  locale: string,
  opts: { title: string; description: string; fileName: string; filePath: string },
): Promise<string> {
  const existing = await client.asset.getMany({
    ...BASE,
    query: { "fields.title": opts.title },
  });
  const found = existing.items.find(
    (asset) => asset.fields.title?.[locale] === opts.title,
  );
  if (found) {
    console.log(`   ↺ asset reused: ${opts.title}`);
    return found.sys.id;
  }

  /* `createFromFiles` uploads the binary and creates the asset in one step —
     the plain-client equivalent of the old `createAsset` + `process`. */
  const created = await client.asset.createFromFiles(BASE, {
    fields: {
      title: { [locale]: opts.title },
      description: { [locale]: opts.description },
      file: {
        [locale]: {
          fileName: opts.fileName,
          contentType: opts.fileName.endsWith(".svg")
            ? "image/svg+xml"
            : "image/png",
          // A Node Buffer is streamed to the upload endpoint at runtime; the
          // SDK's type only advertises `string | ArrayBuffer | Stream`.
          file: fs.readFileSync(opts.filePath) as unknown as ArrayBuffer,
        },
      },
    },
  });

  const processed = await client.asset.processForAllLocales(BASE, created);
  // Only after processing does the asset carry its final `file.url`, so
  // re-fetch before publishing.
  const final = await client.asset.get({ ...BASE, assetId: processed.sys.id });
  await client.asset.publish({ ...BASE, assetId: final.sys.id }, final);
  console.log(`   ↑ asset uploaded: ${opts.title}`);
  return final.sys.id;
}

/** Creates or updates (matched by a unique field) and publishes an entry. */
async function upsertEntry(
  contentType: string,
  matchField: "slug" | "id",
  matchValue: string,
  fields: Record<string, unknown>,
  label: string,
): Promise<void> {
  const query =
    matchField === "slug"
      ? { content_type: contentType, "fields.slug": matchValue }
      : { content_type: contentType, "fields.id": matchValue };

  const existing = await client.entry.getMany({ ...BASE, query });
  const current = pickLatestVersion(existing.items);

  let entryId: string;
  if (current) {
    const updated = await client.entry.update(
      { ...BASE, entryId: current.sys.id },
      { ...current, fields },
    );
    entryId = updated.sys.id;
    console.log(`   ↺ entry updated: ${label}`);
  } else {
    const created = await client.entry.create(
      { ...BASE, contentTypeId: contentType },
      { fields },
    );
    entryId = created.sys.id;
    console.log(`   + entry created: ${label}`);
  }

  // Re-fetch so publishing is based on the version the API just handed back.
  const latest = await client.entry.get({ ...BASE, entryId });
  if (
    latest.sys.publishedVersion === undefined ||
    latest.sys.publishedVersion !== latest.sys.version
  ) {
    await client.entry.publish({ ...BASE, entryId: latest.sys.id }, latest);
    console.log(`   ✓ entry published: ${label}`);
  } else {
    console.log(`   ✓ entry already published: ${label}`);
  }
}


/* ── Field builders ────────────────────────────────────────────────────── */

function projectFields(
  project: Project,
  locale: string,
  cardAssetId: string,
  heroAssetId: string,
): Record<string, unknown> {
  const f: Record<string, Record<string, unknown>> = {};
  const set = (key: string, value: unknown) => {
    f[key] = { [locale]: value };
  };

  set("slug", project.slug);
  set("name", project.name);
  set("category", project.category);
  set("tagline", project.tagline);
  set("summary", project.summary);
  set("overview", project.overview);
  set("problem", project.problem);
  set("solution", project.solution);
  set("architecture", project.architecture);
  set("keyFeatures", project.keyFeatures);
  set("technologies", project.technologies);
  set("challenges", project.challenges);
  set("outcomes", project.outcomes);
  set("image", assetLink(cardAssetId));
  set("heroImage", assetLink(heroAssetId));
  set("screenshots", []);
  // Optional URL fields: skip entirely when null (the mapper maps absence
  // to `null`, which renders the disabled "Live Demo" button).
  if (project.links.demo) set("demoUrl", project.links.demo);
  if (project.links.github) set("githubUrl", project.links.github);
  set("featured", project.featured);
  return f;
}

function skillCategoryFields(
  category: SkillCategory,
  locale: string,
): Record<string, unknown> {
  const f: Record<string, Record<string, unknown>> = {};
  f["id"] = { [locale]: category.id };
  f["title"] = { [locale]: category.title };
  f["description"] = { [locale]: category.description };
  f["items"] = { [locale]: category.items };
  return f;
}

/* ── Main ──────────────────────────────────────────────────────────────── */

async function main() {
  const locale = await getDefaultLocale();
  console.log(
    `\n→ Seeding space ${SPACE_ID} [env: ${ENVIRONMENT_ID}] (locale: ${locale})\n`,
  );

  /* Projects */
  for (const project of projects) {
    console.log(`\n■ ${project.name} (${project.slug})`);

    const cardAssetId = await ensureAsset(locale, {
      title: `${project.name} — card image`,
      description: project.image.alt,
      fileName: path.basename(project.image.src),
      filePath: path.join(process.cwd(), "public", project.image.src),
    });

    const heroAssetId = await ensureAsset(locale, {
      title: `${project.name} — hero image`,
      description: project.heroImage.alt,
      fileName: path.basename(project.heroImage.src),
      filePath: path.join(process.cwd(), "public", project.heroImage.src),
    });

    await upsertEntry(
      "project",
      "slug",
      project.slug,
      projectFields(project, locale, cardAssetId, heroAssetId),
      project.name,
    );
  }

  /* Skill categories */
  for (const category of skillCategories) {
    console.log(`\n■ ${category.title} (${category.id})`);
    await upsertEntry(
      "skillCategory",
      "id",
      category.id,
      skillCategoryFields(category, locale),
      category.title,
    );
  }

  console.log(
    [
      "",
      "✓ Seed complete.",
      `  projects: ${projects.length}, skill categories: ${skillCategories.length}.`,
      "  Everything is published — the site can read it via the Delivery API.",
      "  Re-run any time; existing entries are updated, not duplicated.",
      "",
    ].join("\n"),
  );
}

main().catch((error) => {
  console.error("\n✗ Seed failed:", error);
  process.exit(1);
});

