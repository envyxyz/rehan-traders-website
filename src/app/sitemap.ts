import type { MetadataRoute } from "next"

import { services, site } from "@/content"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${site.url}/repairs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
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
