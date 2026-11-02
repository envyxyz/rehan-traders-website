import type { MetadataRoute } from "next"

import { seo, site } from "@/content"
import { themeColor } from "@/lib/tokens"

export const dynamic = "force-static"

// Same files as the icons list in layout.tsx, at stable root paths. Google's favicon rules also read this.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: seo.home.description,
    start_url: "/",
    display: "browser",
    background_color: themeColor.light,
    theme_color: themeColor.light,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }
}
