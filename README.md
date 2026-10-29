# Rehan Traders website

Marketing site, booking and AI repair assistant for Rehan Traders, a phone and tablet repair lab at Shop G-88, Hafeez Center, Lahore. Live at [rehanmobiletraders.com](https://rehanmobiletraders.com).

## Stack

Next.js static export (App Router, React, TypeScript, Tailwind CSS v4, shadcn/ui, Motion, Lenis), served by a Cloudflare Worker on the free plan. The Worker in `worker/` handles only `/api/*`:

- `/api/book`: booking, sent to a Google Apps Script (Sheet and email). See `integrations/booking-apps-script/`.
- `/api/chat`: the chat assistant. It tries Claude Haiku via OpenRouter, then Gemini Flash, then Groq, then a fixed WhatsApp and Call reply.
- `/api/estimate`: reads a fault description for the `/estimate` page.

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
| `pnpm preview` | Build, then serve the export and the Worker as production does (:8787) |
| `pnpm test:e2e` | Playwright against `pnpm preview` |
| `node scripts/chat-evals.mjs` | Run the chat evals against a running Worker (real models) |

## Deploy

Cloudflare Workers Builds deploys `main` on every push. Secrets (`OPENROUTER_API_KEY`, `GOOGLE_AI_API_KEY`, `GOOGLE_AI_PRO_API_KEY`, `GROQ_API_KEY`, `BOOKING_WEBHOOK_URL`, `BOOKING_WEBHOOK_SECRET`) are set as Worker secrets in the Cloudflare dashboard, not in the repo.

## Docs

- `CLAUDE.md`: the hard rules (copy only in `src/content.ts`, tokens only, accessibility, performance and security).
- `PRODUCT.md` and `DESIGN.md`: product facts and design tokens.
- `docs/PRD.md`, `docs/PHASES.md`: the plan and a dated log of each phase.
