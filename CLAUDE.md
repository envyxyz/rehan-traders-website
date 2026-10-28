# Rehan Traders website

Marketing site and booking for Rehan Traders, a phone and tablet repair lab at Shop G-88, Ground Floor, Hafeez Center, Lahore. Live at rehanmobiletraders.com. Private repo `rehan-traders-website`, nested (git-ignored) inside the client folder `rehan-traders/`, which holds the brand, photos and growth plan.

The client contact is **Adnan Ali**. "Rehan" is only the shop name; never address anyone as Rehan.

## Read first

| File | What it owns |
|---|---|
| `PRODUCT.md` | Product truth: users, purpose, positioning, confirmed facts, what must never be invented |
| `DESIGN.md` | Tokens and visual rules. The **Website Overrides** section at the end wins over the brand text above it |
| `docs/PRD.md` | Goals, sitemap, homepage order, features, budgets, open questions for Adnan |
| `docs/DESIGN-DIRECTION.md` | Direction contract, motion grammar, component inventory, imagery plan |
| `design/mock/hero.html` | Approved hero + nav reference (open and scroll it); screenshots beside it |
| `.impeccable/surfaces/` | The same direction contract, for the impeccable skill |

Brand assets live one level up: `../growth/Brand/` (logo SVGs, print kit, tamper seal, job card), photos in `../growth/Photos/`. Read from there; copy into `public/` only what ships.

## Stack

Next.js (App Router) · React · TypeScript strict · Tailwind CSS v4 · shadcn/ui · Motion (`motion/react`) · Lenis · lucide-react · AI SDK · Zod · Playwright · Lighthouse CI · **pnpm** · **Cloudflare Workers, free plan**: the Next.js static export (`out/`) is served as static assets, and a small Worker in `worker/` handles only `/api/*` (booking, chat, estimator). Hosting must stay free.

Check current docs with context7 before using any library API. Do not add a dependency for something a few lines or the platform already does.

## Hard rules

1. **Copy lives only in `src/content.ts`.** Components receive text via props or import it from there. No string literals for user-facing text in components (aria-labels included). Unconfirmed facts are marked `// TODO(adnan): confirm` and must be resolved before launch.
2. **Tokens only.** Colours, type, spacing, radii, shadows, durations and easings come from the tokens in `src/app/globals.css` (`@theme`). No raw hex, no arbitrary Tailwind values (`text-[17px]`, `bg-[#...]`) in components. New value needed? Add a token, then use it.
3. **Reuse before you build.** Check `src/components/ui` (shadcn primitives) and `src/components` before writing a new component. One Button, one Card, one Sheet, one Section, one Container.
4. **Theme follows the device.** `prefers-color-scheme` only, no toggle. Every component is checked in light and dark. Background is static.
5. **One Signal Red element per view.** Red is a line or a number (rule, job number, step numbers), never a fill larger than a pill.
6. **No kickers.** No uppercase eyebrow labels above headings. No gradient text. No glass on body content or glass on glass.
7. **Icons:** lucide-react, stroke 1.75, one size scale. WhatsApp uses its official glyph. No emoji as icons.
8. **Motion:** transform and opacity (plus blur on glass). One authored moment per page. Reveals once, 8px rise. The h1 never animates in. Respect `prefers-reduced-motion` and `prefers-reduced-transparency`. Lenis off on touch.
9. **Phone number** is written `0305 8874839` and dialled `tel:+923058874839`. WhatsApp: `https://wa.me/923058874839`. Take both from `content.ts`.
10. **Never invent claims:** prices, warranty, turnaround, years, counts, "original parts", "100%". Prices show through `priceMode` (`'from'` → "From Rs X", `'quote'` → "Get a quote in 5 minutes"); launch is `'quote'`. Confirmed facts and Adnan's answers: `PRODUCT.md` and `docs/PRD.md` §11.
11. **Accessibility:** WCAG 2.2 AA, 44px minimum targets, visible focus, labelled controls, keyboard-complete flows.
12. **Performance budget:** Lighthouse 95+ on all four categories (mobile) for every page; home initial JS under 120 KB gzip; no render-blocking third-party scripts; chat, slider and other heavy pieces load lazily; images are the pre-sized AVIF/WebP files from `scripts/images` with `srcset` and `sizes` (no image optimizer in a static export).
13. **Security:** secrets only in the Worker and `.env.local` (never committed, never printed, never `NEXT_PUBLIC_`). Validate every input with Zod. Rate-limit `/api/*` with a Cloudflare rule. Headers in `public/_headers`. No personal data in URLs or analytics events.
14. **SEO:** every route exports metadata (title, description, canonical, OG). JSON-LD per `docs/PRD.md` §8. No `AggregateRating` markup.
15. **Static export only.** No ISR/revalidate, middleware, server actions, `cookies()`/`headers()` or dynamic route handlers in Next. `sitemap.ts`, `robots.ts` and static OG images are fine. Anything that needs a server or a secret goes in the Worker. No Google Cloud APIs that need billing (Places, Static Maps, Maps JS).

## Commands

```bash
pnpm dev          # local dev (http://localhost:3000; kitchen sink at /dev/kitchen-sink)
pnpm build        # static export to out/ (must pass before any commit)
pnpm start        # next start (dev parity only; production is the static export)
pnpm lint         # eslint --max-warnings 0 (includes the no-raw-hex / no-arbitrary-value / no-literal-copy rules)
pnpm typecheck    # next typegen && tsc --noEmit (typegen writes the route types such as LayoutProps)
pnpm test:e2e     # (added in Phase 9) Playwright + axe
pnpm lhci         # (added in Phase 9) Lighthouse CI against the production build
pnpm preview      # (added in Phase 5) wrangler dev: the static export plus the Worker, as production runs it
```
Deploys: Cloudflare Workers Builds deploys `main` on push.
Keep this list in sync with `package.json`. The colour reference is `design/palette.html`; it mirrors `src/app/globals.css`, so change both together.

## How work happens here

- Work runs in phases, one chat per phase. The phase list and the prompt to paste for each phase are in the Artifact "Rehan Traders Website Plan" (link in `docs/PHASES.md`). Start each chat by reading this file and the files in "Read first".
- Each phase ends with: `pnpm build` + `pnpm lint` + `pnpm typecheck` passing, screenshots (desktop 1440 and mobile 390, light and dark) of what changed shown to Ameer, a short note in `docs/PHASES.md`, and one commit.
- Visual changes are confirmed by Ameer before the next phase builds on them.
- Skills: `ponytail` while building (smallest working change), `impeccable` for every UI surface (craft floor before UI edits, detector after), `apple-design` and `anthropic-skills:motion-framer` for motion, `ui-ux-pro-max` for UX checks, `design-system-audit` for drift, `seo`/`schema`/`ai-seo` for search, `security-review` before launch.
- Delegate bulk or repetitive work (image batches, research, per-page boilerplate, second-opinion reviews) to Antigravity (`agy`) per the global rules, and check what comes back.
- OpenRouter key: `OPENROUTER_API_KEY` in `.env.local`. Other env vars are listed in `.env.example`.

## Git

- `main` is the only long-lived branch. Commit at the end of each phase with a clear message (`phase 3: nav island, footer, sticky bar`).
- Never commit `.env*` (except `.env.example`), `node_modules`, `.next`, test reports, or raw unedited client photos.
