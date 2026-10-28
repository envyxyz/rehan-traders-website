import type { NextConfig } from "next"

// Cloudflare free plan: production is a static export (out/), served by the Worker in worker/ (Phases 5 and 6).
// No ISR, middleware, server actions or dynamic route handlers.
const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  images: { unoptimized: true }, // Phase 2 pre-sizes AVIF/WebP
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
