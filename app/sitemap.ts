import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/project-repository";
import { siteConfig } from "@/lib/site";

/** Public URLs that search engines should discover and index. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProjectSlugs();
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: `${siteConfig.url}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
