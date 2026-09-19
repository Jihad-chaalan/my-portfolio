import { createClient, type ContentfulClientApi } from "contentful";

/**
 * Server-only Contentful Delivery API client.
 *
 * This module is the ONLY place in the codebase that knows Contentful
 * exists (see docs/ARCHITECTURE.md → "Future Contentful integration
 * strategy"). Repositories call `getContentfulClient()` and map responses
 * into the normalized `Project` / `SkillCategory` shapes; components never
 * see Contentful types.
 *
 * The client is created lazily and cached. When the required environment
 * variables are missing, `getContentfulClient()` returns `null` and the
 * repositories fall back to the local static data in `data/` — so `next
 * dev` and CI keep working without credentials.
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
 * configured. Must only be called from server code (RSC, route handlers,
 * server components) — importing this module in client code throws.
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
