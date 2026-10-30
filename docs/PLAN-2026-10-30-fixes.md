# Fix plan, 30 Oct 2026

Ameer's review of the live site (rehanmobiletraders.com). Read `CLAUDE.md`, `PRODUCT.md` and `DESIGN.md` (Website Overrides) first; every hard rule there still applies (copy only in `src/content.ts`, tokens only, one Signal Red element per view, no kickers, no new dependency if a few lines do it, static export only).

## New confirmed facts (from Ameer, 30 Oct 2026)

Use these exact meanings. Do not add numbers, durations or promises beyond them.

- **Warranty.** Warranties depend on the type of repair. They are discussed right after the job is confirmed or after the fault is diagnosed. Rehan Traders gives generous warranties. (No length, no "lifetime", no "100%".)
- **Turnaround.** Depends on the type of repair, parts availability, and how rare and complex the model is. A normal panel (screen) change can be done in as little as 60 minutes; complex devices such as Galaxy Z Folds can take up to a day. (Say "as little as" / "up to"; never "guaranteed", never apply 60 minutes to anything but a normal panel change.)
- **Courier repairs (outside Lahore).** Available. Create a ticket on the site or call 0305 8874839. Send photos of the phone on WhatsApp. If possible the shop gives a quote over the phone; otherwise the shop receives the phone, inspects and quotes it, repairs it once the customer agrees, and sends it back. (No courier company, cost or who-pays claims: those are still unconfirmed.)

Record these in `PRODUCT.md` (confirmed facts; remove them from the "never invent" list) and `docs/PRD.md` §11/§12 (mark warranty q1, turnaround q2 and courier q4 answered as above, 30 Oct 2026). Remove the matching `TODO(adnan)` comments in `content.ts` (lines near 542, 571, 589, 715) once the copy uses the facts.

## Tasks

### 1. Background breaks when the desktop browser is zoomed out
Reproduce with Playwright at viewports 1920×1080, 2560×1440 and 3840×2160 (a zoomed-out 1440 screen) on `/`, `/estimate`, `/reviews`, `/visit`, light and dark. The hero inset panel (`src/components/hero.tsx`, `bg-panel` on the inner div, grid capped at `max-w-panel`) and any section backgrounds must fill the viewport edge to edge at every width while the content stays capped and centred. Find the actual cause (a capped wrapper, `min-h-svh`, a body background sized in px, the nav island, etc.) and fix it at the source; no per-breakpoint hacks.

### 2. `/estimate`: card jumps between tabs, button placement
`src/components/estimator.tsx` and `src/app/(site)/estimate/page.tsx`.
- The right-hand card gets a fixed width (token-based, e.g. a `max-w-*` container token; add one in `@theme` if needed) and a fixed height that fits the taller of the two tabs, so switching tabs never moves the page. Simplest robust way: render both tab panels in one CSS grid cell (`col-start-1 row-start-1`), the inactive one `invisible` + `inert`, so the card is always as tall as the tallest panel. Same idea already used in `review-carousel.tsx`.
- The pick-path result shows **inside the card in place of the form** (with a "Start again" / back control), not appended below it, so the card height stays put. Keep the existing result content (likely repair, device, fault, panel line, WhatsApp quote, Book this repair).
- Submit buttons sit at the bottom right of the card, right-aligned (`self-end` / `justify-end`), on mobile full width is fine.

### 3. Double-clicking "Get an estimate" crashes the page
Reproduce first (Playwright against `pnpm dev`; read the console error, the prod build only shows `src/app/error.tsx`). Try the pick path and the describe path, single and double clicks, and clicking again after a result shows. Fix the root cause, not just the symptom. Then guard every submit on this page: disable the button and ignore re-entry while a request is in flight (a ref, not only state).

### 4. Replace the AI "Describe it" path with a quote ticket form
The AI estimate is inaccurate. The "Describe it" tab becomes a form that creates a real ticket through the existing booking pipeline. Reuse, do not rebuild:
- Fields: name, mobile number, brand + model (`DevicePicker`), message (textarea, max 500), up to 3 photos (`PhotoPicker`, which uploads each photo to `/api/upload` as soon as it is picked). Same validation and helpers as `booking-flow.tsx` (`normalizePhone`, honeypot field `website`, `elapsed` timer, local rate limit `rt-bookings`, wait until every photo has an id before sending).
- Submit POSTs to `/api/book` with `kind: "quote"`, `slot: null`, `fault: "Not mentioned here"` (from `booking.fault.open`), `problem: <message>`, `photos: [ids]`, no `service`. In `worker/book.ts` the last `.refine` currently requires `service` for a quote: allow a quote without a service when the fault is an open fault and `problem` is present. Keep everything else in the schema as strict as it is.
- The Apps Script already emails `rehanmobiletraders@gmail.com` with the photos attached, adds the Sheet row and returns the job number (`integrations/booking-apps-script/Code.gs`; empty `service` is already filtered out of the email). Do not change Code.gs unless you must; if you do, say so clearly, because Ameer has to redeploy it.
- On success, store the `BookingSummary` in sessionStorage (`BOOKING_KEY`) exactly as `booking-flow.tsx` does (include `problem`) and `router.push("/book/confirmed")`. On `/book/confirmed`, when the booking is saved, **download the ticket image automatically once** on arrival on desktop (`pointer: fine`); keep the Save ticket button for phones (iOS needs the tap gesture). The "Send on WhatsApp" button already carries the ticket text to the shop's WhatsApp; make sure its text includes the problem. Network/Worker failure falls through to the existing local `WEB-` reference + WhatsApp handoff.
- Copy for the tab, labels, hint ("Your name and number go only to the shop"), errors and the page lede go in `content.ts` (`estimator`). The lede no longer says the site guesses the repair: pick a device and fault to see the likely repair, or send the problem with photos and the shop replies with a quote on WhatsApp.
- The homepage "Describe the problem" box (`src/components/home.tsx` ~line 62–72) still goes to `/estimate?q=…`: it now opens the Describe tab with the message prefilled, and sends nothing on its own.
- Delete the AI estimate: `worker/estimate.ts`, its route in `worker/index.ts`, `estimateSystem`/`faultSlugs` in `src/lib/assistant.ts` if nothing else uses them, `fetchEstimate` and the `unavailable`/`working` states in the estimator, the related copy, and the `/api/estimate` stubs in `tests/e2e/assistant.spec.ts` (replace with a test for the new form: fill, stub `/api/book`, land on `/book/confirmed`). Grep for anything else that references them (`scripts/`, `docs/`, llms routes).

### 5. `/reviews`: centred carousel instead of a long grid
- Look at 21st.dev (the `mcp__plugin_21st_21st__search` tool, query like "minimal testimonial carousel") for one minimal, centred testimonial carousel idea. Take only the idea; implement it by extending the existing `src/components/review-carousel.tsx` (one carousel in the codebase), with Motion only if it is already used there, no new dependency, project tokens only.
- The page: heading, lede, rating summary and the Google button centred; below it one centred carousel (max width around a reading column) showing one review at a time with prev/next arrows, dots or a counter, keyboard arrows, swipe on touch, no autoplay on this page (or paused by default), reduced motion respected.
- Every review's text stays in the static HTML (crawlers and LLMs must still read all of them), which the stacked-grid approach already gives. Card height must not jump between reviews.
- On the reviews page show all reviews in their listed order (no random draw); the home page keeps its current random 10.

### 6–8, 11, 12. Content: warranty, turnaround, courier, written for search engines and LLMs
- **Courier section on `/visit`** (`visitPage.courier*` in content.ts and its component): rewrite with the courier facts above as clear numbered steps: 1 create a ticket on the site (link to `/estimate`, Describe tab) or call 0305 8874839; 2 send photos of the phone on WhatsApp; 3 if possible we quote over the phone; 4 otherwise you send the phone, we inspect and quote, repair once you agree, and send it back. Remove the "to be confirmed" notice and the small icon beside the heading. Actions: WhatsApp (official glyph), Call, Create a ticket. Fix the layout: no empty space or orphan panel under it (see the screenshot area below the section). Update the homepage visit line `courier` text too.
- **FAQ** (`faq` in content.ts, rendered on `/faq` with FAQPage JSON-LD; check `src/lib/schema.ts`): add or rewrite questions as people actually ask them, each answer a self-contained 1–3 sentence statement that names Rehan Traders and Hafeez Center, Lahore where natural, so an LLM can quote it alone:
  - "Do you give a warranty on repairs?" (warranty fact)
  - "How long does a phone repair take?" (turnaround fact)
  - "How long does a Galaxy Z Fold repair take?" (up to a day, depends on parts and model)
  - "Can I send my phone by courier from outside Lahore?" (courier fact, steps in one paragraph)
  - "How do I get a quote?" (WhatsApp photos, or the ticket form on /estimate, or visit)
- **Process step** "Warranty card" (~line 543): keep the card, add that the warranty depends on the repair and is agreed when the job is confirmed.
- **Service pages**: where a service is a normal screen/panel change, it may say "as little as 60 minutes, depending on parts and model"; the Fold/Flip page may say "up to a day". Nothing else gets a time.
- **Chat assistant** knowledge (`chatSystem` in `src/lib/assistant.ts`): add the three facts so it can answer, keeping "never invent prices".
- **`/llms.txt` and `/llms-full.txt`** routes: add the warranty, turnaround and courier facts and the quote-ticket path, in plain declarative sentences. Keep them generated from content.ts.
- **Write for citation**: on pages you touch, prefer question-shaped headings and direct first-sentence answers; full entity name "Rehan Traders, Shop G-88, Ground Floor, Hafeez Center, Lahore" once per page; no marketing filler. You may load the `ai-seo` skill for guidance. Keep JSON-LD valid (no AggregateRating).
- `tests/e2e/no-quote-promise.spec.ts` bans "5 minutes" quote promises; the 60-minute repair fact must not trip it (it should not; confirm).

### 9. Home: no phone in the hero, no review count
- Hero (`src/components/hero.tsx` ~line 57–61): remove the phone number from the info row under the buttons (keep the address and open status).
- Remove only the review **count** on the home page: hero proof line becomes "4.9 on Google" (`hero.proof`), and the "What customers say" section summary and "Read all 50 reviews" link drop the number (`home.reviews.summary`, `actions.readReviews`). The `/reviews` page may keep its count. Check nothing else on `/` prints the count.

### 13. Link previews (WhatsApp, X/Twitter, Discord)
- There is no Open Graph image today. Make one 1200×630 PNG in the brand (paper `#F5F5F2` or ink background per DESIGN.md, the R mark from `../growth/Brand/` or `src/app/icon.svg`, "Rehan Traders", descriptor "Mobile & Tab Repair Lab", "Shop G-88, Hafeez Center, Lahore"; at most one Signal Red element; no badges, gradients or tiny text). Render it with a small script (e.g. `scripts/og.mjs` using Playwright and the installed Edge, same approach as `scripts/palette.mjs`) and commit the PNG as `src/app/opengraph-image.png` and `src/app/twitter-image.png` with matching `.alt.txt` files. Keep it under 300 KB (WhatsApp drops larger images). Show Ameer the PNG.
- Add `src/app/apple-icon.png` (180×180, the mark on paper) so shares and home-screen icons have a raster icon.
- Root metadata (`src/app/layout.tsx`): `openGraph` defaults (`siteName: "Rehan Traders"`, `type: "website"`, `locale: "en_PK"`), `twitter: { card: "summary_large_image" }`, and keep the descriptions as the share text. Pages that set their own `openGraph` replace the parent object in Next.js, so add a small helper (e.g. `pageMeta()` in `src/lib/`) that every route uses to merge siteName/type/locale with its own title, description and url; check one built HTML file in `out/` shows `og:image`, `og:site_name`, `twitter:card` and `twitter:image` on every route.
- Titles/descriptions in `seo` (content.ts): keep them plain and specific; the home description no longer needs the phone if it reads better without it, but keep "Hafeez Center, Lahore".

## Done means

1. `pnpm build`, `pnpm lint`, `pnpm typecheck` pass. Run `pnpm test:e2e` and report results honestly (fix failures caused by these changes).
2. Screenshots at 1440 and 390, light and dark, of: home hero, home reviews section, `/estimate` (both tabs, the pick result, the form with an error), `/book/confirmed` after a quote, `/reviews`, `/visit` courier section, `/faq`, plus 2560-wide `/` for the zoom fix, and the OG image. Save them under `docs/screens/2026-10-30-fixes/`.
3. A short note appended to `docs/PHASES.md`.
4. Do **not** commit or push (push deploys to production). Ameer reviews first.
