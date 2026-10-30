import type { MetadataRoute } from "next"

import { services, site } from "@/content"

export const dynamic = "force-static"

/**
 * Sitemap with image references for Google Image Sitemaps.
 * Uses a fixed lastModified so builds don't churn the date on every deploy
 * (Google treats a changed lastmod as a recrawl signal — only bump it when
 * the page content actually changes).
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Bump this date when meaningful site content changes (copy, services, images).
  const lastModified = "2026-10-30"

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [
        `${site.url}/images/storefront-1280.webp`,
        `${site.url}/images/microscope-bench-1280.webp`,
        `${site.url}/images/logo.png`,
      ],
    },
    {
      url: `${site.url}/repairs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/estimate`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/book`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/visit`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [
        `${site.url}/images/storefront-1280.webp`,
      ],
    },
    {
      url: `${site.url}/reviews`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [
        `${site.url}/images/microscope-bench-1280.webp`,
        `${site.url}/images/workbench-team-1280.webp`,
      ],
    },
    {
      url: `${site.url}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/repairs/${s.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...serviceRoutes]
}
