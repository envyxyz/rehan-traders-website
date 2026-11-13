import type { MetadataRoute } from "next"

import { site } from "@/content"
import { guides, services } from "@/content-large"

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
  // 7 Nov 2026: every page got a new title and description, and some got in-copy links.
  const lastModified = "2026-11-07"

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/`,
      lastModified,
      images: [
        `${site.url}/images/storefront-1280.webp`,
        `${site.url}/images/microscope-bench-1280.webp`,
        `${site.url}/images/logo.png`,
      ],
    },
    {
      url: `${site.url}/repairs`,
      lastModified,
    },
    {
      url: `${site.url}/quote`,
      lastModified,
    },
    {
      url: `${site.url}/book`,
      lastModified,
    },
    {
      url: `${site.url}/visit`,
      lastModified,
      images: [
        `${site.url}/images/storefront-1280.webp`,
      ],
    },
    {
      url: `${site.url}/courier`,
      lastModified,
    },
    {
      url: `${site.url}/reviews`,
      lastModified,
    },
    {
      url: `${site.url}/faq`,
      lastModified,
    },
    {
      url: `${site.url}/guides`,
      lastModified,
    },
    {
      url: `${site.url}/about`,
      lastModified,
      images: [
        `${site.url}/images/microscope-bench-1280.webp`,
        `${site.url}/images/workbench-team-1280.webp`,
      ],
    },
    {
      url: `${site.url}/privacy`,
      lastModified,
    },
    {
      url: `${site.url}/terms`,
      lastModified,
    },
  ]

  // 13 Nov 2026: every repair page got its long section and more questions.
  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/repairs/${s.slug}`,
    lastModified: "2026-11-13",
  }))

  const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: g.updated,
  }))

  return [...staticRoutes, ...serviceRoutes, ...guideRoutes]
}
