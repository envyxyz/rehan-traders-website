import type { MetadataRoute } from "next"

import { site } from "@/content"

export const dynamic = "force-static"

/**
 * robots.txt — one permissive wildcard rule plus explicit AI-crawler groups.
 *
 * Strategy (per AgentReady AR-FIND-01):
 * - A single `*` rule allows every bot by default, including search APIs
 *   (Exa, Tavily, Brave Search) that run their own crawlers.
 * - Named AI-search and user-triggered bots are listed explicitly so they
 *   see `Allow: /` even if they inherit-override logic ignores the wildcard.
 * - Training-only crawlers (GPTBot, ClaudeBot, Google-Extended) are allowed
 *   here because the business benefits from appearing in AI-generated answers
 *   and has no licensing objection.  Re-evaluate if that changes.
 * - /book/confirmed, /api/, and /dev/ are disallowed for everyone.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/book/confirmed", "/api/", "/dev/"]

  return {
    rules: [
      // Wildcard: catches every bot including unnamed crawlers and search APIs
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // Google bots (Search, AI Overviews, Gemini)
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      // ChatGPT browsing and search
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow,
      },
      // Perplexity
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow,
      },
      // Claude search
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow,
      },
      // Bing / Copilot
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
      // Apple
      {
        userAgent: "Applebot",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
