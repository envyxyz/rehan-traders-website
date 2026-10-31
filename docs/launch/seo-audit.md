# SEO audit: Phase 9 build (31 Oct 2026)

Read-only. Build: `phase9` at `ccc37d5`, built in its own worktree (`.claude/worktrees/p10-prep`) and served with `wrangler dev --port 8790`. Method: fetched `robots.txt`, `sitemap.xml`, `llms.txt`, all 18 sitemap URLs plus `/book/confirmed`, `/dev/kitchen-sink` and a 404, and extracted title, description, canonical, robots, headings, Open Graph, JSON-LD and images. All internal links, images and sitemap image URLs were requested (172 URLs). JSON-LD was read from the static HTML, which is reliable here because Next.js renders it server-side (a static export has no client-injected schema). The live site on rehanmobiletraders.com was probed for the redirect, header and robots findings. Rich Results Test and PageSpeed Insights were not run (they need a browser session); both are in the runbook. Nothing in `src/` was changed.

## Summary

The on-page work is in good shape: every page has a unique title, a description, a self-referencing absolute canonical, Open Graph and Twitter tags, exactly one H1, no skipped heading levels, and alt text on all 12 images on the home page and on every other page. All 172 internal URLs return 200. `robots.txt` allows everything except `/api/`, `/dev/` and `/book/confirmed` and points at the sitemap. The sitemap lists exactly the 18 indexable routes. Schema is valid in shape: `MobilePhoneStore` on `/`, `/visit`, `/about`; `Service`, `FAQPage`, `BreadcrumbList` on each repair page; `FAQPage` on `/faq`; no `AggregateRating`, per the rule. `llms.txt` and `llms-full.txt` exist and are linked from `<head>`.

Nothing blocks indexing. Two things to fix before asking Google to index: the `www` host and the production `/dev/` route.

Severity: **High** blocks or damages indexing or trust; **Medium** worth fixing before or soon after launch; **Low** polish.

## Findings, ranked

### 1. Medium, before launch: `www` serves a full copy of the site (live)
`https://www.rehanmobiletraders.com/` returns 200 with the home page, not a redirect. The canonical points at the apex, which limits the damage, but both hosts get crawled, and links and GBP clicks can land on either.
- Fix: Cloudflare Single Redirect `www` to apex, 301. Exact values in `docs/GO-LIVE.md` step 6.
- File: Cloudflare dashboard (no repo file).

### 2. Medium, before launch: `/dev/kitchen-sink` is deployed to production (live, HTTP 200)
The internal component page ships in `out/dev/` and is reachable. It carries `noindex`, but `robots.txt` also has `Disallow: /dev/`, and a crawler that may not fetch the page never sees the `noindex`. A disallowed URL that someone links to can still appear in results without a snippet. It also exposes the design system and uses the home page title and description.
- Fix: keep `/dev/*` out of the production export (delete `out/dev` at the end of the build, or only generate the route when `NODE_ENV` is not production). Then remove `Disallow: /dev/` or leave it; either is fine once the route is gone. Re-check e2e tests that load it.
- Files: `scripts/fix-segments.mjs` (add `rmSync("out/dev", { recursive: true, force: true })`) or `src/app/dev/kitchen-sink/page.tsx`; `src/app/robots.ts` only if the rule is dropped.

### 3. Low: no `/favicon.ico` and no web manifest
`<head>` has `icon.svg` and `apple-icon.png` only; `/favicon.ico` and `/manifest.webmanifest` return 404. Browsers and crawlers that request `/favicon.ico` by convention get a 404 page, and Google's favicon guidance asks for a square icon in multiples of 48 px (whether it accepts the SVG alone was not confirmed here).
- Fix: add a 48 px (or 96 px) `src/app/favicon.ico`; the manifest is optional.
- File: `src/app/` (new `favicon.ico`).

### 4. Low: trailing-slash and `.html` URLs redirect with 307
`/repairs/`, `/repairs.html` and `/index.html` answer 307 (temporary) to the clean URL, on the live site too. Canonicals already name the clean URL and the sitemap uses it, so there is no duplicate-content issue, but 301 is the signal to prefer.
- Fix: test `"html_handling": "drop-trailing-slash"` under `assets` in `wrangler.jsonc` and check the status it returns; skip if it stays 307.
- File: `wrangler.jsonc`.

### 5. Low: meta descriptions on five pages are short
`/privacy` 95, `/terms` 90, `/book` 111, `/reviews` 123, `/faq` 134 characters; the others run 133 to 160. Short is allowed, but `/book`, `/reviews` and `/faq` can carry the local terms (Lahore, Hafeez Center, repair) at no cost.
- File: `src/content.ts` (page metadata entries).

### 6. Low: generic titles on `/book`, `/estimate`, `/reviews`
"Book a visit · Rehan Traders" (28 characters), "Repair estimate · Rehan Traders" (31), "Customer reviews · Rehan Traders" (32) leave room for "Lahore" and a service word, e.g. "Book a phone repair visit in Lahore · Rehan Traders". The service and home pages already do this.
- File: `src/content.ts`.

### 7. Low: the home H1 uses a non-breaking hyphen (U+2011) in "G‑88"
Deliberate (it keeps "G-88" from splitting), but a search for "G-88" with a normal hyphen does not match the heading text exactly. The title, description and body text use the ASCII form elsewhere.
- Fix options: keep, or use `G-88` with `white-space: nowrap` on a span.
- File: `src/content.ts` lines 191 and 699 (hero titles).

### 8. Low: every sitemap `lastmod` is the same date (2026-10-30); `changefreq` and `priority` are present
Google ignores `changefreq` and `priority` and discounts a `lastmod` that does not track real edits. Harmless. Make `lastmod` the date each page's content last changed, or drop the three fields.
- File: `src/app/sitemap.ts`.

### 9. Low (owner decision): "how long it will take" appears in public copy
`src/content.ts` lines 102, 588 and 807 (and so `llms.txt`, the home description and `/about`) say the shop tells the customer "what it will cost and how long it will take". It promises no figure, so it does not break the "never promise how fast" rule, but it is the nearest line to it. Keep, or reword to "what is wrong, whether it can be fixed and what it will cost".
- File: `src/content.ts`.

### 10. Low: structured data extras (optional)
- `MobilePhoneStore` is a valid `LocalBusiness` subtype with address, phone, geo, opening hours (Friday split) and `hasMap`. `sameAs` holds one Google Maps URL; the Facebook page waits for Adnan's fix (TODO in `content.ts` line 48).
- A `WebSite` node (name and url, no SearchAction) on `/` is optional.
- `foundingDate: 2009` matches PRODUCT.md ("repairing phones since 2009"); confirm it is Adnan's own statement before launch.
- File: `src/lib/schema.ts`.

### 11. Info: review numbers go stale
`/reviews`, the review text in `llms.txt` and the home page show "4.9 from 50 ratings" copied on 29 Oct 2026 (PRODUCT.md still says 47, dated 23 Oct: update that line). The monthly calendar reminder in the runbook covers the refresh.
- Files: `PRODUCT.md`, `src/content.ts` lines 110 to 117.

### 12. Info: other checks that passed
- `robots.txt` allows Googlebot, Bingbot, Applebot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot by name; GPTBot, ClaudeBot and Google-Extended fall under `User-agent: *` (allowed). Cloudflare "Block AI bots" and managed robots.txt must stay off (live `robots.txt` is the site's own file today).
- Canonical for the home page is `https://rehanmobiletraders.com` (no slash) while the sitemap has `https://rehanmobiletraders.com/`: identical for a root URL.
- `<html lang="en">`, `og:locale en_PK`, viewport and theme-color present. No hreflang needed (one language).
- `/book/confirmed` is `noindex, nofollow` and out of the sitemap. The 404 page returns 404 with `noindex`.
- HTML cache header `public, max-age=0, must-revalidate`; Brotli and HTTP/3 on live. Hashed assets are immutable.
- Not covered here: Core Web Vitals field data (none until the site has traffic), backlinks, keyword gaps, GBP completeness (see the runbook step 12).
