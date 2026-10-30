// Lighthouse CI against the production build as production serves it: the static export plus the Worker
// (wrangler dev on :8787). Run `pnpm build`, then `pnpm lhci`. Mobile preset (the Lighthouse default), 3 runs a page
// (the median counts). No Chrome found? Set CHROME_PATH to Chrome or msedge.exe.
// The pages come from the sitemap the build wrote, so a new route is audited without touching this file.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- a CommonJS config, read by the lhci CLI
const { readFileSync } = require("node:fs")

const origin = "http://localhost:8787"
const urls = [...readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => origin + m[1])
urls.push(`${origin}/book/confirmed`) // not in the sitemap

module.exports = {
  ci: {
    collect: {
      url: urls,
      numberOfRuns: 3,
      // The site sends Cross-Origin-Opener-Policy: same-origin (public/_headers). Lighthouse loads each page from about:blank,
      // and Chrome swaps the browsing context on that navigation, so the trace loses its start (NO_NAVSTART). Real
      // visitors never navigate that way; this only lets the audit run. Without the flag the same page audits fine.
      settings: { chromeFlags: "--headless --disable-features=CrossOriginOpenerPolicy" },
      startServerCommand: "wrangler dev --port 8787 --show-interactive-dev-session=false",
      startServerReadyPattern: "Ready on",
      startServerReadyTimeout: 60000,
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: ".*",
          assertions: {
            "categories:performance": ["error", { minScore: 0.95 }],
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["error", { minScore: 0.95 }],
            "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
          },
        },
        // The confirmation page is noindex on purpose, so Lighthouse scores it 66 for "page is blocked from indexing".
        { matchingUrlPattern: "^http://localhost:8787/(?!book/confirmed)", assertions: { "categories:seo": ["error", { minScore: 0.95 }] } },
        // CLAUDE.md rule 12: the home page's own JavaScript is under 120 KB gzip. Lighthouse cannot split first-party
        // scripts out, and the GTM container (gtm.js) is about 116 KB gzip on its own, so the budget is 120 KB + 120 KB for it.
        { matchingUrlPattern: "^http://localhost:8787/$", assertions: { "resource-summary:script:size": ["error", { maxNumericValue: 245760 }] } },
      ],
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
}
