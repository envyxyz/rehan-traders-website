# QA, Phase 9 (31 Oct 2026)

What was tested, what the scores are, what was found, and what is still open. Written for Ameer and for whoever works on the site next. Format follows `docs/QA-2026-10-30.md`.

Build under test: branch `phase9`, the merge of the e2e suite, Lighthouse CI setup, CSP and nav fix (`e39768a`) plus the test fixes in `ccc37d5`. The round 2 design and image work (`phase9-round2`) is not in these numbers; it is merged and re-measured separately.

## What was tested

### Gates

| Check | Result |
|---|---|
| `pnpm build` | pass (static export, 22 pages plus the OG images) |
| `pnpm lint` | pass, 0 warnings |
| `pnpm typecheck` | pass |
| `pnpm test:e2e` | **0 failed**: desktop 128 passed, 5 skipped; mobile 118 passed, 16 skipped (267 tests in all) |

The skips are by design: tests that only make sense on one form factor (the phone menu sheet on desktop, the top bar and Repairs menu on a phone), and the Worker-handler tests (`chat-worker.spec.ts`, parts of `booking.spec.ts`), which run once, on desktop, because they do not use a browser.

The e2e suite runs on the installed Microsoft Edge, in two projects: `desktop` (Desktop Edge) and `mobile` (Pixel 7 emulation), against `wrangler dev` on :8787 serving the static export plus the Worker, as production does. Timezone is fixed to Asia/Karachi. `E2E_PORT` runs it on another port.

### E2E coverage by area (`tests/e2e/`)

| File | What it covers |
|---|---|
| `nav.spec.ts` | Desktop bar links; Repairs menu lists the eight repairs, opens by click and by keyboard, closes on Escape; the island replaces the bar on scroll and the hidden one leaves the tab order; phone menu sheet lists every page, traps focus, closes on Escape and returns focus; a menu link navigates and closes the sheet; sticky bar timing and tab order; logo goes home. |
| `booking.spec.ts` | Full booking, several faults plus description plus photo, quote from a repair card, each validation error and Back keeping answers; Worker down, network failure, 400, 429, hourly limit (5 saved), double click sends one request; the upload endpoint cannot be turned into a booking; ordinary punctuation accepted, control characters refused; honeypot, fast-fill and bad-input refusal in the Worker. |
| `assistant.spec.ts` | Chat stream with chips and inline links (never buttons), reply parsing, closing mid-reply does not break the next message, fallbacks when the Worker or network fails, the Worker's fixed reply with contact buttons; the chat is not in the home first load; `/api/chat` refuses bad input before any model is called; the estimator (pick a fault, Describe tab sends a quote ticket, Worker-down fallback, card does not move between tabs). |
| `chat-worker.spec.ts` | The chat fallback chain in Node, with `fetch` stubbed: OpenRouter first, then each Gemini key and model pair in order on quota errors, then Groq, then the fixed reply; no keys at all calls nobody; an empty reply and a reply that breaks off mid-way count as failures; a provider that never starts answering is skipped after 8 seconds; `AI_FORCE_FAIL` can break one provider on purpose to test the chain live. |
| `axe.spec.ts` | See axe scope below. |
| `security.spec.ts` | Security headers and CSP on every route; no CSP violation or console error on every route; the map loads after a tap under the CSP; `/api` answers carry nosniff and are not cached. |
| `pages.spec.ts`, `no-quote-promise.spec.ts` | Launch is in quote mode; every fault ends in a WhatsApp quote with no price or turnaround; the 404 page and its noindex; "5 minutes" can never come back on `/`, `/repairs`, a service page, `/estimate`, `/book`, the chat prompt or `/llms.txt`. |
| `faq.spec.ts`, `reviews.spec.ts` | FAQ page and its FAQPage JSON-LD list the same questions; the reviews carousel has every review in the HTML, shows one, arrow keys step, the rest are inert. |

The dynamic nav menus (`next/dynamic`, `nav-menus`) are covered: the tests wait for the loaded trigger (`aria-haspopup`) and then exercise the menus (click, keyboard, Escape, link navigation, focus return). The axe sheet scans also open them.

### Axe scope

`@axe-core/playwright`, tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, zero violations required. Light and dark, desktop and phone: every route in the sitemap (10 pages and 8 service pages), `/book/confirmed` with a stored ticket, the 404, and the open overlays on the home page (chat sheet, phone menu sheet, booking sheet). Before the scan the page waits for fonts, 400 ms, and any finite animation to finish.

### CSP and headers

`public/_headers` is served by `wrangler dev` as Cloudflare serves it. The tests assert on every route: `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin`, a Permissions-Policy that denies camera and the rest, and a CSP with `default-src 'self'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`, no `unsafe-eval` and no bare `*`. Each route is then loaded with a `securitypolicyviolation` listener and a console-error listener; any violation or console error fails. The CSP keeps `unsafe-inline` for scripts and styles because a static export has no per-request nonce and Next's inline payload scripts change every build (comment in `public/_headers`). HSTS is set by the Cloudflare zone, not the file.

### Lighthouse CI

`lighthouserc.cjs`: mobile preset, 3 runs per page, the median counts; the page list comes from `out/sitemap.xml` plus `/book/confirmed`; it starts `wrangler dev` on :8787 itself (stop `pnpm preview` first); `CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"`. Thresholds, never lowered: performance, accessibility and best practices at least 0.95 on every page, SEO at least 0.95 except the noindex `/book/confirmed`, LCP at most 2.5 s, and a script budget on the home page. Chrome runs with `--disable-features=CrossOriginOpenerPolicy`, because the site's COOP `same-origin` makes Chrome swap the browsing context when Lighthouse navigates from `about:blank`, and the trace loses its start (`NO_NAVSTART`). Real visitors never navigate that way. This means **PageSpeed Insights has to be checked on production**.

## Scores per route

Lighthouse 12.6.1 (the version `@lhci/cli` 0.15 bundles), mobile preset with Lighthouse's default throttling (4x CPU slowdown, simulated slow 4G), Chrome stable, 31 Oct 2026. Median of 3 runs by performance score (2 runs for the one service page). Machine: Windows 10, 4 cores, other Node, Edge and Playwright work running on the same machine during parts of the run, so performance and TBT are pessimistic and move by about 10 points between runs. The server is `wrangler dev`, which does not compress responses: Lighthouse sees about 400 KB of script transfer per page, but the **script KB column is the gzip size** (level 6) of the first-party files the page loaded, taken from `out/`, plus the Google Tag Manager script (measured transfer) after the plus sign. It counts every script file the page fetched in the run, including chunks that load lazily after hydration (nav menus, and so on), so it is higher than the "initial JS" figure in the Phase 9 commit message (198 KB for the home page).

| Route | Perf | A11y | BP | SEO | LCP | TBT | CLS | Script KB (first party + GTM) |
|---|---|---|---|---|---|---|---|---|
| / | 61 | 100 | 96 | 100 | 5.9 s | 701 ms | 0.010 | 275 + 116 |
| /repairs | 76 | 100 | 96 | 100 | 4.8 s | 306 ms | 0.000 | 275 + 116 |
| /repairs/touch-glass-replacement (2 runs) | 85 | 100 | 100 | 100 | 3.4 s | 304 ms | 0.000 | 275 + 116 |
| /estimate | 86 | 100 | 100 | 100 | 3.2 s | 304 ms | 0.000 | 284 + 116 |
| /book | 86 | 100 | 96 | 100 | 3.3 s | 301 ms | 0.000 | 285 + 116 |
| /visit | 84 | 100 | 100 | 100 | 3.5 s | 326 ms | 0.000 | 269 + 116 |
| /reviews | 78 | 100 | 100 | 100 | 4.1 s | 346 ms | 0.000 | 269 + 116 |
| /faq | 77 | 100 | 100 | 100 | 3.9 s | 454 ms | 0.000 | 275 + 116 |
| /about | 76 | 100 | 100 | 100 | 4.6 s | 337 ms | 0.028 | 269 + 116 |
| /privacy | 85 | 100 | 100 | 100 | 3.3 s | 346 ms | 0.000 | 267 + 116 |
| /terms | 87 | 100 | 100 | 100 | 3.2 s | 279 ms | 0.000 | 267 + 116 |

Not measured in this run: the other seven service pages (`galaxy-z-fold-flip`, `iphone`, `screen-replacement`, `battery-charging`, `water-damage-data-recovery`, `board-repair`, `ipad-tablet`) and `/book/confirmed`. The Lighthouse process hung twice on `/repairs/touch-glass-replacement` (run 3 of the first pass, run 1 of the retry; the server answered curl in 0.4 s at the time), and the run was stopped to save time. The service pages share one template, and the Phase 8 pass measured all 18 routes at 100 / 100 / 100 for accessibility, best practices and SEO. A full `pnpm lhci` on production-like hosting in Phase 10 should cover them.

Reading the table:

- Accessibility 100 and SEO 100 everywhere measured. The axe suite agrees (zero violations).
- Best practices 96 on `/`, `/repairs`, `/book` is one audit, `errors-in-console`, and it is a local artefact: `upgrade-insecure-requests` in the CSP makes Chrome upgrade the redirect that the asset server returns for a prefetch of `/repairs/[slug]` (the `$` in the route file name becomes `%24`) to `https://localhost`, which has no TLS (`ERR_SSL_PROTOCOL_ERROR`). The e2e CSP test ignores exactly this error for the same reason. On the https site the redirect stays https. To be confirmed on production.
- Performance is under 0.95 and LCP is over 2.5 s on every route. See the first known gap. The Lighthouse thresholds were not lowered, so `pnpm lhci` fails its assertions on purpose until this is resolved or the budget is changed by Ameer.

## Security results

- **Dependencies (`pnpm audit`)**: production dependencies, `pnpm audit --prod`: no known vulnerabilities. Full audit: 9 findings (5 high, 2 moderate, 2 low), all in dev-only tooling: `@lhci/cli` (tmp, extract-zip, basic-ftp, zod, uuid, minimatch through puppeteer and Lighthouse), `eslint` (minimatch) and `shadcn` (deepmerge, low). None ships to the site or the Worker. The earlier note of "1 low (deepmerge through shadcn)" was before `@lhci/cli` was added. **The deepmerge override did not happen**: there is no `overrides` entry in `package.json` or `pnpm-workspace.yaml`, and `pnpm why deepmerge` still shows 4.3.1 (patched in 4.3.2). It only runs when the shadcn CLI is used. Fix later by adding an override to 4.3.2 or newer, or bumping shadcn.
- **Secret scan**: pattern scan (OpenRouter, OpenAI-style, Google API, Groq, AWS, GitHub, Slack, private key blocks, Apps Script deployment ids) over the tracked working tree, over `out/`, and over the full history (63 commits reachable from any branch at scan time): no matches. `.env.example` is the only env file ever committed. `.env.local` is git-ignored by design and holds the real keys.
- **Security review** (`/security-review` on the Phase 9 branch): nothing found.
- **squirrelscan** (`audit-website`): nothing material.
- API hardening already in the tree: oversized bodies refused before reading, Zod validation on every input, honeypot and fast-fill checks, the upload endpoint cannot become a booking, `/api` responses carry nosniff and are never cached.

## Merge check

The merge of `phase9-audits` into `phase9` built, linted and typechecked. Two real problems showed up, neither in `src/` or `worker/`:

1. `pnpm lint` ran for over 20 minutes and `tsc` scanned extra files because both picked up the git-ignored `.claude/worktrees/` copies of the project. Fixed: `.claude/**` added to the ESLint ignores and `.claude` to the `tsconfig.json` excludes. Lint now takes 18 s.
2. Two test flakes, both test-side:
   - `nav.spec.ts` "a repair in the Repairs menu opens its page, by keyboard" failed once: the test pressed Enter on the placeholder Repairs button before the `next/dynamic` menu chunk had loaded. The nav, phone-menu and Repairs tests now wait for the loaded trigger (`aria-haspopup`) first. The real-user version of this is the first known nav gap below.
   - `axe.spec.ts` "booking sheet" (dark) failed `color-contrast` on the nav behind the sheet in about one run in four, because the overlay was still fading in. The scan now waits for finite animations to end (looping ones are ignored, otherwise it never settles). 16 of 16 repeats pass.

## Known gaps

1. **Performance below 0.95 and LCP above 2.5 s on every route.** Cause: about 200 KB of first-party JavaScript (React plus Next is about 113 KB of it on their own), the 134 KB variable font, and hydration TBT. The 120 KB home JavaScript budget is not reachable on this stack. Ameer decided to document the gap, not hide it; the thresholds in `lighthouserc.cjs` stay at 0.95 and 2.5 s. It is measured again on production (real compression, real CDN) in Phase 10.
2. **The Cloudflare `/api/*` rate-limit rule needs the zone**, so it waits for Phase 10. `/api/chat` has no in-Worker limit either, so until then the rule is the only protection against someone running up the AI providers.
3. **The booking fallback logs full bookings to Workers Logs, by design**, so a booking is not lost when the Sheet is down. That is personal data in logs; set the retention in Phase 10.
4. **Apps Script hardening needs a redeploy**: timing-safe secret compare and the formula-injection regex in `integrations/booking-apps-script/Code.gs` are in the repo but not live until Ameer pastes and redeploys the script. The `recentForPhone` sort fix is in the same state.
5. **Nav focus in the first ~300 ms.** The Repairs trigger and the phone menu button are inert placeholders until their chunk loads after hydration. A keyboard user who presses Enter in that window gets nothing (this is what made the keyboard test flaky until it waited for the loaded trigger).
6. **`/about` CLS 0.028** from the font swap. Under the 0.1 limit.
7. **COOP is disabled in Lighthouse CI's Chrome flags** (see above). PageSpeed Insights must be checked on production.
8. **Console error on the local server** (`ERR_SSL_PROTOCOL_ERROR` from the `/repairs/[slug]` prefetch redirect under `upgrade-insecure-requests`) costs 4 points of best practices locally. Confirm it does not happen on production.
9. **No active nav state** (`aria-current`). Adding it is a design change, so it was not done.
10. **Transient duplicate `<main>` during hydration.** It was seen while the root `loading.tsx` existed, which wrapped every page in a Suspense boundary in the static export. `loading.tsx` was deleted in `42c7e58` ("first paint without the loading boundary"), and every exported page has exactly one `<main>` in its HTML (checked on `/`, `/repairs`, `/faq`). The runtime state during hydration was not re-probed after the deletion, so treat it as probably fixed, not proven.
11. **Not approved by Ameer, left as is:** the job card input focus outline; the red invalid border on the booking device field; replacing Motion with CSS; trimming the font.
12. **Lighthouse could not complete `/repairs/touch-glass-replacement` reliably** on this machine (two hangs), and eight routes are missing from the table above. Likely the machine (heavy load, other agents running), not the page, but not proven.
13. **`TODO(adnan)` still open in `src/content.ts`:** walking directions, entrance and landmarks (`visitPage.directions`, `entranceValue`, `landmarksValue`); a real before/after pair from a finished job; registered business name and NTN; the Facebook page (`rehantraders0`) once its phone and hours are fixed. Resolve before launch.

## Notes added at hand-off

- `/dev/kitchen-sink` no longer ships in `out/` (`scripts/fix-segments.mjs` removes it from the export).
- `GET /api/health` was added for the uptime monitor.
- The 96 best-practices score locally comes from `upgrade-insecure-requests` on `http://localhost` (gap 8).

## Design and skill audits (round 2)

Merged build (`phase9-round2` included), 31 Oct 2026: build, lint and typecheck pass. Full e2e: 268 tests ran; the only 2 failures were 30-second test timeouts in axe, on a machine with about 1 GB of free memory and stale test servers. Re-run alone at the same 30-second limit, both passed (`axe /repairs` mobile light, `axe booking sheet` desktop dark). That re-run timed out once on `axe booking sheet` mobile dark, which then passed with a 180-second limit. No axe violations in any run. Lighthouse was not re-run on the merged build: the table above is from before `phase9-round2`, and 8 routes in it are unmeasured.
