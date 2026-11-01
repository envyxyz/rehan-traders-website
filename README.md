# Rehan Traders website

Marketing site, booking flow, and AI repair assistant for Rehan Traders, a phone and tablet repair lab at Shop G-88, Hafeez Center, Lahore. Live at [rehanmobiletraders.com](https://rehanmobiletraders.com).

## Status (31 Oct 2026)

Live at https://rehanmobiletraders.com. Pushing `main` deploys through Cloudflare Workers Builds.

- Phases 0 to 9: shipped. Tests, audits and known gaps are in `docs/QA.md`; Lighthouse performance remains under the 0.95 target.
- Phase 10 (go live): the site, `www` redirect, `/api/*` rate limit, Search Console sitemap and indexing requests are done. What is left needs a dashboard sign-in or Adnan: `docs/LAUNCH.md`.
- Phase 11 (after launch): `/courier` page and the problem index on `/repairs`. The rest of the menu has not started.
- Phase 12 (phone UX): sheets follow the on-screen keyboard, 44px targets, review carousel swipe, chat button and sticky bar no longer cover content, `tests/e2e/phone.spec.ts`.
- NAP and search: `docs/launch/nap.md`, `docs/launch/search-plan.md`, and the dated report in `../growth/Reports/`.

## Stack

Next.js static export (App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Motion, Lenis), served by a Cloudflare Worker on the free plan. The Worker in `worker/` handles only `/api/*`:

- `/api/book`: booking visits and quote requests, sent to Google Apps Script (Sheet and email). See `integrations/booking-apps-script/`.
- `/api/chat`: the AI chat assistant. Tries Claude Haiku via OpenRouter, then Gemini Flash, then Groq, with a graceful WhatsApp/Call fallback.
- `/api/upload`: customer repair photos (up to 3), uploaded and saved to the shop's Google Drive by Apps Script.

## SEO & AI Discoverability

- **Sitemaps**: Standard XML sitemap (`/sitemap.xml`) including Google Image Sitemap metadata (`image:image`), plus a fallback `sitemap_index.xml` for backwards compatibility.
- **AI Agent Discoverability**: Implements the [llmstxt.org](https://llmstxt.org) standard with `/llms.txt` (structured shop facts and services) and `/llms-full.txt` (full page content bundle for instant LLM grounding).
- **Social Previews**: Dynamic per-route 1200×630 OpenGraph and Twitter card image generators (`opengraph-image.tsx` and `twitter-image.tsx`) rendered at build time with brand typography, route badges, and contextual titles.
- **Crawler Access**: Configured `robots.txt` explicitly permitting Googlebot, ChatGPT (`ChatGPT-User`, `OAI-SearchBot`), Perplexity (`PerplexityBot`), Claude (`Claude-SearchBot`), Bingbot, and Applebot.
- **Interactive Components & Tracking**: Repair Job Card with a subtle tilt (mouse only) and tamper seal; delegated link tracking (`data-track`) for zero-overhead analytics.

## Run it

```bash
pnpm install
cp .env.example .env.local   # fill in the keys; never commit .env.local
pnpm dev                     # site on :3000, Worker on :8787
```

| Command | Does |
|---|---|
| `pnpm build` | Static export to `out/` with segment path fixes |
| `pnpm lint` / `pnpm typecheck` | ESLint (zero warnings) and TypeScript check |
| `pnpm preview` | Build, then serve export and Worker as production (:8787, reads `.env.local`) |
| `pnpm test:e2e` | Playwright test suite against `pnpm preview` |
| `node scripts/og.mjs` | Re-render branded OpenGraph and Twitter preview images |
| `node scripts/chat-evals.mjs` | Run the chat evals against a running Worker |

## Deploy (Cloudflare Workers, free plan)

The site is a Cloudflare Worker with static assets: the export in `out/` is served as assets (never executes Worker compute), and `worker/index.ts` runs only for `/api/*` (`wrangler.jsonc`).

1. Push the repo to GitHub.
2. Cloudflare dashboard > **Workers & Pages** > **Create** > **Import a repository** > pick `rehan-traders-website`.
3. Build settings: production branch `main`, **build command** `pnpm build`, **deploy command** `npx wrangler deploy`. Leave root directory blank.
4. **Settings > Variables and Secrets**, add as type **Secret**: `OPENROUTER_API_KEY`, `GOOGLE_AI_API_KEY`, `GOOGLE_AI_PRO_API_KEY`, `GROQ_API_KEY`, `BOOKING_WEBHOOK_URL`, `BOOKING_WEBHOOK_SECRET`.
5. **Settings > Domains & Routes** > **Add** > **Custom domain** `rehanmobiletraders.com` (and `www`).
6. Add a **rate-limiting rule** for `/api/*` (Security > WAF > Rate limiting rules).
7. Booking mail and photos come from the Apps Script: set it up with `integrations/booking-apps-script/README.md`.

`public/_headers` sets security headers and caching for `/_next/static/*`, sitemaps, and AI discovery files; `not_found_handling: "404-page"` serves `out/404.html` with a 404 status.

## Business Facts & Policies (30 Oct 2026)

- **Warranty**: Not always given. Discussed at the counter; it varies with the model, the repair and the parts chosen.
- **Turnaround**: Standard screen / panel replacement in as little as 60 minutes; complex foldable devices (Galaxy Z Fold/Flip) up to one day depending on parts availability.
- **Courier**: Nationwide courier repairs accepted. Customers submit a quote ticket on `/quote` or contact via WhatsApp/phone before dispatch.
- **Open Bench**: All diagnostics and micro-soldering repairs take place at an open bench in Shop G-88, Hafeez Center.

## Docs

- `CLAUDE.md`: Hard rules (all user copy strictly in `src/content.ts`, design tokens only, zero-warning ESLint, accessibility).
- `PRODUCT.md` and `DESIGN.md`: Product requirements, brand specifications, and design system.
- `docs/PRD.md`, `docs/PHASES.md`: Project roadmap, phase tracking, and verification notes.
