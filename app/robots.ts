import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/** Search-engine crawling rules for this public portfolio. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
