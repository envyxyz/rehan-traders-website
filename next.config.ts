import type { NextConfig } from "next"

// Cloudflare free plan: production is a static export (out/), served by the Worker in worker/ (Phases 5 and 6).
// No ISR, middleware, server actions or dynamic route handlers.
const dev = process.env.NODE_ENV !== "production"

const nextConfig: NextConfig = {
  output: dev ? undefined : "export",
  // Dev only: `pnpm dev` runs `wrangler dev` beside Next, and /api/* goes to the Worker on :8787.
  ...(dev && {
    rewrites: async () => [{ source: "/api/:path*", destination: "http://localhost:8787/api/:path*" }],
  }),
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
