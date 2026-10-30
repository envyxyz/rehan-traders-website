# Rehan Traders website

Marketing site, booking and AI repair assistant for Rehan Traders, a phone and tablet repair lab at Shop G-88, Hafeez Center, Lahore. Live at [rehanmobiletraders.com](https://rehanmobiletraders.com).

## Stack

Next.js static export (App Router, React, TypeScript, Tailwind CSS v4, shadcn/ui, Motion, Lenis), served by a Cloudflare Worker on the free plan. The Worker in `worker/` handles only `/api/*`:

- `/api/book`: booking, sent to a Google Apps Script (Sheet and email). See `integrations/booking-apps-script/`.
- `/api/chat`: the chat assistant. It tries Claude Haiku via OpenRouter, then Gemini Flash, then Groq, then a fixed WhatsApp and Call reply.
- `/api/estimate`: reads a fault description for the `/estimate` page.
- `/api/upload`: one booking photo, saved to the shop's Drive folder by the Apps Script.

## Run it

```bash
pnpm install
cp .env.example .env.local   # fill in the keys; never commit .env.local
pnpm dev                     # site on :3000, Worker on :8787
```

| Command | Does |
|---|---|
| `pnpm build` | Static export to `out/` |
| `pnpm lint` / `pnpm typecheck` | ESLint (zero warnings) and TypeScript |
| `pnpm preview` | Build, then serve the export and the Worker as production does (:8787, reads `.env.local`) |
| `pnpm test:e2e` | Playwright against `pnpm preview` |
| `node scripts/chat-evals.mjs` | Run the chat evals against a running Worker (real models) |

## Deploy (Cloudflare Workers, free plan)

The site is a Worker with static assets: the export in `out/` is served as assets (never runs the Worker), and `worker/index.ts` runs only for `/api/*` (`wrangler.jsonc`). The bundled Worker is about 2.2 MB, 400 KB gzipped, against the 3 MB free-plan limit (`npx wrangler deploy --dry-run --outdir <dir>` after `pnpm build` prints it).

1. Push the repo to GitHub (it is private).
2. Cloudflare dashboard > **Workers & Pages** > **Create** > **Import a repository** > pick `rehan-traders-website`.
3. Build settings: production branch `main`, **build command** `pnpm build`, **deploy command** `npx wrangler deploy`. Leave the root directory blank. (`pnpm build` runs `next build` and then `scripts/fix-segments.mjs`, which only matters for builds made on Windows.)
4. **Settings > Variables and Secrets**, add these as type **Secret** (names only; values come from `.env.local`, never from the repo): `OPENROUTER_API_KEY`, `GOOGLE_AI_API_KEY`, `GOOGLE_AI_PRO_API_KEY`, `GROQ_API_KEY`, `BOOKING_WEBHOOK_URL`, `BOOKING_WEBHOOK_SECRET`. `OPENROUTER_API_KEY_FREE` and `NEXT_PUBLIC_*` are not used by the Worker.
5. **Settings > Domains & Routes** > **Add** > **Custom domain** `rehanmobiletraders.com` (and `www`). The domain's nameservers must be on Cloudflare first (copy any MX records before moving them from Hostinger).
6. Add a **rate-limiting rule** for `/api/*` (Security > WAF > Rate limiting rules). Without it anyone can spend the AI quota.
7. Booking mail and photos come from the Apps Script: set it up with `integrations/booking-apps-script/README.md`, and redeploy it as a new version whenever `Code.gs` changes.

`public/_headers` sets the security headers and caching of `/_next/static/*`; `not_found_handling: "404-page"` serves `out/404.html` with a 404 status. Check both locally with `pnpm preview` (`curl -I http://localhost:8787/`, `/nope`).

Preview deploys for branches need the same secrets under the build's **Variables and Secrets**.

## Known gaps

- Unconfirmed facts are marked `// TODO(adnan): confirm` in `src/content.ts` (warranty, turnaround, courier terms, registered name, Adnan's title). None of them may go live as fact.
- The device picker list, booking sheet and chat were checked at 1440x786, 390x664, 390x844 and 360x740; below about 600 px of height (320x568) the booking sheet still scrolls inside itself, with the Back and Next bar kept in view.
- Lighthouse: see the latest dated note in `docs/PHASES.md`. The home page's remaining cost is hydration and the 3D fold.
- The Apps Script change to the hourly limit is not live until `Code.gs` is pasted and redeployed.
- `/api/*` has no Vercel or other host; the site only works with the Cloudflare Worker (or `pnpm preview`).

## Docs

- `CLAUDE.md`: the hard rules (copy only in `src/content.ts`, tokens only, accessibility, performance and security).
- `PRODUCT.md` and `DESIGN.md`: product facts and design tokens.
- `docs/PRD.md`, `docs/PHASES.md`: the plan and a dated log of each phase.
