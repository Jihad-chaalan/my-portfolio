import { createClient, type ContentfulClientApi } from "contentful";

/**
 * Server-only Contentful Delivery API client.
 *
 * This module is the ONLY place in the codebase that knows Contentful
 * exists (see docs/ARCHITECTURE.md → "Contentful integration").
 * Repositories call `requireContentfulClient()` and map responses into the
 * normalized `Project` / `SkillCategory` shapes; components never see
 * Contentful types.
 *
 * Contentful is the single source of truth for projects and skills — the
 * local `data/` files were removed once the migration was verified, so
 * there is no static fallback. The client is created lazily and cached.
 */

export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment: string;
}

/** True when the environment is configured for Contentful. */
export function getContentfulConfig(): ContentfulConfig | null {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";

  if (!spaceId || !accessToken) return null;
  return { spaceId, accessToken, environment };
}

let cachedClient: ContentfulClientApi<undefined> | null = null;

/**
 * Returns a cached Delivery API client, or `null` when Contentful is not
 * configured. Use this for optional/probe behavior; data paths that cannot
 * work without Contentful should call `requireContentfulClient()` instead.
 * Must only be called from server code (RSC, route handlers, server
 * components) — importing this module in client code throws.
 */
export function getContentfulClient(): ContentfulClientApi<undefined> | null {
  if (typeof window !== "undefined") {
    throw new Error(
      "[contentful-client] This module is server-only. Data must be " +
        "fetched in Server Components / the repositories, then passed " +
        "down as props.",
    );
  }

  if (cachedClient) return cachedClient;

  const config = getContentfulConfig();
  if (!config) return null;

  cachedClient = createClient({
    space: config.spaceId,
    accessToken: config.accessToken,
    environment: config.environment,
  });

  return cachedClient;
}

/**
 * Same as `getContentfulClient()`, but throws a setup-focused error when the
 * environment isn't configured.
 *
 * The repositories use this because Contentful is now the only data source:
 * a misconfigured dev machine or deployment must fail loudly at build/render
 * time with instructions, rather than quietly rendering an empty portfolio.
 */
export function requireContentfulClient(): ContentfulClientApi<undefined> {
  const client = getContentfulClient();
  if (client) return client;

  throw new Error(
    [
      "[contentful-client] Contentful is not configured, and this site now",
      "reads every project and skill from Contentful (there is no local",
      "fallback).",
      "",
      "Set these in .env.local for local dev, and in your host's environment",
      "variables for deployments:",
      "",
      "  CONTENTFUL_SPACE_ID=<space id>",
      "  CONTENTFUL_DELIVERY_ACCESS_TOKEN=<Content Delivery API token>",
      "  CONTENTFUL_ENVIRONMENT=master",
      "",
      "See .env.example for where to find each value in Contentful.",
    ].join("\n"),
  );
}
