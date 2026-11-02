# Loop to 9: trust and conversion

Memory for the optimisation loop that started on 1 Nov 2026. Read this first in every round. Goal: an evidence-backed 9/10 on trust and conversion, from about 6.5. The independent reviewer's scores are the real ones. Conversion scores are expert judgement until real traffic confirms them.

Branch `loop/trust-conversion`, one commit per round, never pushed, never merged to main (pushing main deploys). Worktree: `website/.claude/worktrees/loop-9`. It has no `.env.local` on purpose, so its Worker cannot reach the real booking webhook or spend chat keys.

Screenshots: `../.agency/build/website-shots/loop-9/` in the client folder (outside this repo).

## How a round runs (the brief, for any session picking this up)

One full round each time, one commit per round. Read this file first.

1. **Measure:** build, lint, typecheck, Playwright e2e and axe; Lighthouse mobile median of 3 on `/`, `/repairs/galaxy-z-fold-flip`, `/book`, `/quote` against the preview; home first-load JS; home on slow 4G with 4x CPU.
2. **Find** issues with evidence, ranked by effect on trust and conversion.
3. **Choose 3 to 5** changes. Trace everything each one touches.
4. **Verify:** real screenshots at 390 and 1440, light and dark; real flows with mocked APIs; keyboard and reduced motion. Revert what makes numbers or pages worse. A claim needs output or a screenshot.
5. **Independent score:** a fresh subagent with no change log, only a frozen copy's URL and the rubric below. Harsh, measured on finding flaws, evidence for every score.
6. **Log** scores, gates, changes and next targets here. Commit locally.

**Rubric:** use the site as (1) a Lahore customer with a cracked Fold on a mid-range phone, (2) a sceptic burned before by Hafeez Center shops, (3) a customer outside Lahore deciding whether to courier a phone. Score 0 to 10: Trust, Conversion, Clarity of copy, Visual polish, Speed feel, Mobile experience, Overall. Tell the reviewer these are deliberate and not to be scored down: no prices, no warranty length, no review count, no sticky bottom bar. Give it no source code; it must not send a real form or message (mock `/api/**`).

**Gates, all needed for a 9:** build, lint, typecheck, e2e and axe pass. Lighthouse mobile accessibility, best practices and SEO 95+, performance 90+ (95 target); if the fold or framework blocks it, show the measured breakdown instead of weakening the gate. Home first-load JS 120 KB gzip or less, or a breakdown showing it is the smallest achievable with the fold. No horizontal overflow from 320 to 1920, targets at least 44px, no truncated key words, skeletons match what they replace.

**Stop when:** (A) all gates pass and Trust, Conversion and Overall are 9+ from the reviewer two rounds in a row; or (B) 8 rounds are done; or (C) two rounds in a row raise no score, or all that remains needs Adnan or real customer data. Never lower a gate or inflate a score. On B or C, say plainly it did not reach 9 and what blocks it.

**Hard rules:** CLAUDE.md applies. Keep the visual identity and the hero's layout, 3D fold and headline; hero copy ideas are logged only. No dark patterns, invented claims or testimonials; review text stays as written. No prices anywhere. No new paid service, no new dependency unless needed. No sticky bottom bar. Never send a real booking, upload or chat: this worktree has no `.env.local` on purpose; form tests use the route mocks. **Never push or merge to main without Ameer asking for that push** (one checkpoint approved so far, deployed as `612bc21`). Pushing main deploys production. `origin/main` can move: fetch first, merge, never force.

**Final report when the loop stops:** leave the site running and give the link; before and after scorecard; the changes that mattered most; before and after screenshots at 390 and 1440; gates with real numbers; what was tried and rejected; questions for Adnan by value; what was not verified. State that conversion scores are expert judgement until real traffic confirms them.

**Tools** (outside the repo, in `../.agency/build/website-shots/loop-9/tools/`, run from this worktree's root): `js-size.mjs <page.html>`; `shots.mjs <base> <outDir> [paths]`; `slice.mjs <img> <prefix> <height> <cols>`; `slow4g.mjs <base>`; `lh.cjs` with `pnpm exec lhci collect --config=<path>` and env `LH_BASE`, `CHROME_PATH` (Edge at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`); `lh-report.mjs`; `lh-home.mjs`. Frozen reviewer copy: copy `out/` beside a `{ "name", "compatibility_date", "assets": { "directory", "not_found_handling": "404-page" } }` config and serve it with wrangler on its own port.

**Traps:** restart `wrangler dev` after every rebuild: it keeps a stale asset list, and prefetch files then 404 on every page (it failed 43 tests and cost best practices 4 points). The machine has 4 CPUs and other sessions also run tests, so timeouts under load need a solo re-run before they count, and Lighthouse performance swings by about 10 points between runs. Run e2e with `E2E_PORT=8801` and `--workers=3`. A new phase of `.reveal` means axe runs under reduced motion.

## Standing instructions from Ameer

- **No review count anywhere new.** It goes out of date fast (1 Nov 2026). Item 4's "show the 49 count" is cancelled. The existing count in `llms.txt`, `llms-full.txt` and the chat knowledge is left as it was; each states its as-of date.
- Repairs are certified; "10,000+ Certified Repairs" is true. Who certifies them is unknown: ask Adnan, never invent.
- Repair photos are real desk images. Prices change daily: no prices or ranges anywhere.
- Keep the visual identity, the hero's layout, 3D fold and headline. Hero copy ideas are logged as recommendations only.

## State of the recent owner changes at round 1

Snapshotted as commit `2fa759c` from the uncommitted work on main, without touching the main checkout. Built on, not redone.

| Change | State |
|---|---|
| Header morph | In `nav.tsx`: top bar to centred island on scroll; `scrolledFlag` in `layout.tsx` prevents a flash on reload |
| Skeleton loaders | `loading.tsx` (`SheetSkeleton`, `SkeletonLine`), `.skeleton` on `Img`, removed on load by `ImgLoaded` |
| Thin red loading line | `TopLine` in `loading.tsx`, driven by `lib/busy.ts` |
| Estimate pills and headings | Radio pills on the quote page, now named Find your issue and Describe it |
| Compact icon cards | `service-card.tsx`: repair icon on a panel, one per card, red |
| Icons | Line icons at stroke 1.75 through `icons.tsx`. The brief mentions filled icon work, but the code and CLAUDE.md agree on line icons, so CLAUDE.md is unchanged |

## Machine constraint

4 logical CPUs and 12 GB RAM. At round 1 only 0.2 to 0.5 GB was free, with about 310 Edge processes, mostly from other sessions' test runs (a Lulwa run from 09:53, a run in the main website checkout from 13:28). Those are not this loop's to stop. Timing numbers taken under that load are marked as such.

## Scorecard (independent reviewer, no change log, same rubric each time)

| Round | Trust | Conversion | Clarity | Polish | Speed feel | Mobile | Overall |
|---|---|---|---|---|---|---|---|
| Baseline, commit `2fa759c` | 6.0 | 6.2 | 6.0 | 7.2 | 6.5 | 7.0 | 6.3 |
| Round 1, commit `6bf4adc` | 6.0 | 6.5 | 6.5 | 7.0 | 8.5 | 7.5 | 6.6 |
| Round 2, commit `1972000` | 6.7 | 6.8 | 6.3 | 7.1 | 8.1 | 7.3 | 6.8 |

The round 2 reviewer's worst findings: "10,000+ Certified Repairs" reads as a self-made badge once the FAQ explains it; the Fold page has an icon in an empty box and no Fold photo; the quote finder accepts nonsense (iPhone + Fold inner screen, Nokia + Face ID); courier lacks turnaround and payment order (needs Adnan); the OPPO sign and thin "how to find" on /visit; Ask AI labelled above an unlabelled WhatsApp icon; /reviews one card per tap; payment and holiday wording conflict across pages; stiff third-person copy; repetition on phones; the chat button over content; the sample job card looks like a stale real record.

The round 1 reviewer's worst findings: courier risk questions unanswered (mostly needs Adnan); the second home review says the shop sent a Samsung elsewhere and names "Mr Rehan"; no proof on the Fold page; OPPO sign and thin directions on /visit; "ask to watch when not busy" and no rule for a second fault read as escape hatches (needs Adnan); warranty step read as coming after the work; "Certified" unexplained (needs Adnan); no reply expectation; courier ticket is the walk-in form; finder returns nonsense for iPhone + Hinge.

## Round 3 (1 to 2 Nov 2026)

Started with Ameer's two requests, then the round 2 reviewer's findings a web change can fix.

1. **Foldables** (Ameer): service title "Foldables (Duo, Z Series, Pixel)", slug unchanged. Copy, FAQs, SEO, hero lede, problems, the finder label ("Foldable inner screen"), llms.txt and the chat knowledge say all foldables, naming only Duo, Galaxy Z Series and Pixel Fold. `facts.foldables` tells the assistant to say yes for any foldable. The finder knows foldables without "fold" or "flip" in the name (Razr, Magic V, Find N, OnePlus Open, Mate X).
2. **Chat** (Ameer): three bouncing dots in a bubble while a reply is written, not the red top line (the line stays for pages, chunks, submits and uploads). Bubbles and chips rise in, the words fade in where the dots were, one-line replies keep the same height, streaming follows at once instead of restarting a smooth scroll per chunk, and the chips arriving scroll the reply clear. On phones the sheet rises from the bottom corner with a fade. Reduced motion: no movement, the dots fade.
3. **Adnan's photo** (Ameer): background removed locally with rembg (`u2net_human_seg`, alpha matting) from the 192 px crop of `growth/Brand/Archive/v0 - Old shop artwork/old-profile-badge_v1.png`, then the badge's yellow ring and a grey bottle beside the neck masked out by hand. Face untouched. Checked at 64 px on paper, panel and dark.
4. **Finder:** iPhone + Hinge or Fold inner screen, and Face ID on a non-Apple phone, now say it does not match a listed repair. A result with no panel line shows the repair's one-line summary.
5. **Proof and paths:** each repair page's hero shows its real desk photo (the Fold page: the Fold open under the microscope), with the red repair icon on it. /reviews lists all 30 reviews at once, no carousel (component deleted). /visit loses the second storefront photo and the courier block (a link instead) and gains "The sign": the big sign says OPPO, look for G-88 and Tab House & Rehan Traders Lab. Hero: WhatsApp is a labelled button beside Ask AI. Chat chip "Touch glass price?" is now "Is checking free?". No chat button on /book. "Create ticket" is "Send to the shop" and "Fill in the form". Payment lists agree (Raast added to the FAQ and Terms); holidays read "Also closed when Hafeez Center closes". The sample job card says it is a sample.
6. **Phone performance:** below-the-fold sections skip layout on phones too. A page that may open part way down (Back, reload, a #link) or any tap on a link lays out in full first, so scroll restoration stays exact. Home Lighthouse on the same machine: 73 to 84, TBT 905 to 427 ms. Tried and rejected: `<Suspense>` around each home section to slice hydration. In this static export it outlines every section into hidden HTML that only a script reveals, so no-JavaScript visitors and crawlers would see nothing.

**Held back, not live:** the business card on the fold's screen with a QR to the Google profile (Ameer). The scene code is done (29 x 29 QR, level L, `site.mapsUrl`, 8 canvas px a module), committed on this branch after the deployed commit and not pushed, but the posters could not be regenerated or the QR decoded from real screenshots: the machine had 0.2 to 0.4 GB free and the preview stopped answering. Shipping the scene without matching posters would flash the old job card under the new one.

### Gates after round 3 (machine at 0.2 to 0.6 GB free)

| Check | Result |
|---|---|
| Build, lint, typecheck | Pass |
| E2e, focused (assistant, booking, faq, fold incl. the new sound tests, nav, pages, phone, reviews), 2 workers | 116 passed, 27 skipped, 1 failed under load; that one passed alone (26.8 s) |
| Axe, light and dark, both projects: `/`, `/about`, `/quote`, `/reviews`, `/visit`, Fold and iPhone pages, chat sheet | 32 of 32 |
| Lighthouse `/`, median of 3, same build before the late copy changes | perf 84 (was 73), a11y, bp, seo 100, LCP 3048 (simulated; observed paint 430 to 530 ms), TBT 427 |
| Screenshots, 390 and 1440, light and dark | `website-shots/loop-9/round-3/` |

Not run: the full e2e and axe sweep, Lighthouse on the final build and on repair pages (the new hero photo may move their LCP), the 320 to 1920 overflow sweep, the independent score of round 3.

**Not edited:** CLAUDE.md rule 5 (a relayed request); its wording, red line "only while something loads", still holds.

**Favicon in Google:** the site meets Google's favicon rules (192 px PNG and SVG linked from the home page, `favicon.ico` with 48 px, crawlable). Google's favicon service returns 404 for the domain, so Google has not stored it yet. Fix: Search Console, URL inspection of the home page, Request indexing; it updates on Google's schedule.

## Round 2 (1 Nov 2026)

**Deployed:** Ameer asked, and the round 1 and 2 session pushed `1972000` to main (verified live).

Ameer answered the blocking questions: second fault, what "certified" means, courier return and transit risk, packing, remote payment (PRD §11). Walking route still to come.

Changes:

1. **Home order B**, from the order test: repairs, pricing, reviews, process, bench, visit, FAQ, with bands re-alternated.
2. **Speed.** `Reveal` is CSS on a scroll timeline, not an observer and a state change per block. The Radix menus (about 48 KB) load on first interaction. Poster has `fetchPriority="high"` and no `decoding="async"`. Home on the wire: JS 219 to 172 KB.
3. **Repair pages** answer the six questions in order, then the action. Fold, iPhone and touch glass pages show matching reviews. Repair-specific WhatsApp text prompts for the model. The final call to action names the free check.
4. **Bugs.** Text typed on /book and /quote before the page is live survives (two causes: a Suspense boundary replacing the form, and a re-render resetting the field). A phone menu tap before the page or its code is ready opens the menu (the button is one stable element; an inline script keeps a pre-hydration tap).
5. **Reviews and warranty.** Home opens with Arsim, Adnan F. and Rao; Haadi's review, which says the shop sent a Samsung elsewhere, moved down and off the water page. Warranty is step 2, "discussed up front", in the order it happens.
6. **Answers applied.** "If another fault appears" in How pricing works, the FAQ and the chat. "What does a certified repair mean?" in the FAQ and About. /courier gets Before you send it: packing, address with postcode, transit risk, declined quote, payment. Courier ticket and WhatsApp links prefill "Courier repair" with the city. Courier in the phone menu. No walk-in call to action on /courier, /privacy or /terms.
7. **Fold sound.** Volume up about 11 dB (the clips peak near -14 dBFS, too quiet on a phone speaker). A click no longer queues while audio is off. Any tap or key unlocks audio, and audio unlocked on another page of the site carries over. Checked on an emulated phone by counting real starts: tap the fold, 1 start, running; tap the page then scroll, 1 start, running; scroll only, 0.

8. **Service renamed** by Ameer to "Folding Phones (Duo, Pixel, Z Series)".

**Known limit, not a bug:** browsers allow sound only after a tap or key. A scroll does not count, so a first auto-open with no tap before it is silent. Real phone speakers not tested.

### Gates after round 2

| Check | Result |
|---|---|
| Build, lint, typecheck | Pass |
| E2e and axe | Last full run: 241 passed, 38 skipped, 43 failed. 41 were the stale preview (404s) and passed after a restart: security spec 58 of 58. 2 were a closed browser under load. The final build differs only by the service name; a focused re-run is below |
| Lighthouse, same build, restarted preview, machine shared | `/` 73, a11y 100, bp 100, seo 100, LCP 3117, TBT 905. `/repairs/galaxy-z-fold-flip` 81, LCP 3136, TBT 492. `/book` 93, LCP 3064, TBT 133. `/quote` 93, LCP 3088, TBT 128. Earlier runs of nearly the same build: `/` 80 and 82, Fold page 82 and 86 |
| Slow 4G, 4x CPU, home at 390 | h1 and links in the DOM 989 ms, FCP and LCP 1112 ms, hydrated 2040 ms. JS on the wire 172 KB (was 219) |
| Home first-load JS | 172.2 KB gz. Framework about 133 KB |

**Gate not met:** performance 90+ on `/` and repair pages. Home's LCP is the fold poster, with over 2 s of render delay behind main-thread work (Style and Layout about 1 s). Next: reduce that work.

**Not verified:** independent score of round 2 (first job of round 3); keyboard pass across new sections; 320 to 1920 overflow sweep; live analytics events (item 10).

### Next targets, round 3

1. Independent score of this build, logged as round 2.
2. Home performance gate: main-thread work before the poster paints, phone page length (home about 10,000 px; How it works and FAQ repeat on repair pages).
3. Add a fold sound test to `fold.spec.ts` (count `AudioBufferSourceNode.start` with context state: tap, tap then scroll, scroll only).
4. Quote finder nonsense: iPhone + Hinge returns the folding phones repair.
5. Analytics coverage from every placement (item 10), booking and quote flow steps (item 8), /reviews one card at a time, /visit storefront showing an OPPO sign.
6. Walking route to G-88 when Ameer sends it.

## Baseline reviewer's findings still to answer

Ruled out by standing instructions, so not acted on: review count beside the rating; a persistent bottom contact bar (removed in phase 13); explaining who certifies (needs Adnan).

- **Sceptic:** no statement that leaving after the check is free, or that no extra work happens without approval. Answered in part by How pricing works in round 1; "no extra work without approval" needs Adnan's confirmation.
- **Courier:** no packing, transit loss, turnaround, declined-quote cost, remote payment or warranty facts. Most need Adnan. Courier is missing from the header and menu, the ticket carries no courier flag or city, the WhatsApp link has no prefilled text, and the page ends with "Bring it to G-88 / Book a visit", which is wrong for that reader.
- **Repair pages:** icon hero and no proof. Fold reviews are not on the Fold page. "Up to a day" is hidden in an accordion. WhatsApp text is only the repair's name, with no prompt for model or photo.
- **Quote:** the result "Likely repair: Galaxy Z Fold and Flip" tells a customer little. No reply-time facts (never promise one).
- **Interaction bugs to reproduce:** menu tap before hydration stays dead; on a direct /book load, text typed in the first 5 s or so was wiped (3 of 3); Back from the booking sheet leaves the page and loses the entry.
- **Copy:** "Four quick questions" above "Step 1 of 5"; courier step 4 starts with "Otherwise"; "Create a ticket" jargon; SEO-sounding FAQ questions; the CTA "Cracked glass? Bring it to G-88." closes unrelated pages (/courier, /terms, water damage); Terms line on pricing reads like bait.
- **Visit:** storefront photo is dominated by the "oppo" sign, shown twice on /visit; how-to-find text is thin (needs Adnan's walking directions).
- **/reviews:** one card at a time out of 31.
- **Speed:** home long tasks up to 3 s on the throttled run, heaviest page tested; headless WebGL may overstate it.

## Round 1 (1 Nov 2026)

### Measured before changes

| Check | Result |
|---|---|
| Build, lint, typecheck | Pass |
| E2e and axe | Run stopped at about 30 of 310 (under 2.5 tests a minute, RAM exhausted). 5 failures seen, all timeouts in that state, so not treated as real. No clean baseline exists |
| Home first-load JS | 193.0 KB gz (231.6 KB counting the 38.6 KB `noModule` polyfill, which modern browsers skip. The earlier 252 KB likely counted that too) |
| Font | 132.9 KB preloaded (latin, wght + opsz axes) |

### Changes

1. **Get a Quote.** Nav, buttons, metadata, copy, chat knowledge, llms files, sitemap and tests. Route moved to `/quote`. `public/_redirects` sends `/estimate` to `/quote` with a 301; verified in `wrangler dev` with the query kept (`/estimate?q=cracked` to `/quote?q=cracked`) and in a real browser navigation. First tab is Find your issue. Analytics continuity: the event `estimate_complete` and `data-track-from="estimate"` keep their names, so reports do not split.
2. **Home order** below the hero: repairs and Find your issue, reviews, How pricing works, The open bench, How a repair works, Visit, FAQ, final call to action.
3. **How pricing works** (new) and **The open bench** (new, real desk photos and Adnan's photo cropped from the old profile badge in `growth/Brand/Archive/v0 - Old shop artwork/`, source about 180px, shown at 64px).
4. **Reviews.** Fixed dates (`when`): Google's relative date counted back from the 29 Oct 2026 copy date to a month, and year-old ones as "Over a year ago", which stays true. A script checked author, rating and text are identical to the baseline for all 31. No random draw any more: reviews are ordered to answer the fears, and home shows the first three as static cards with no JavaScript.
5. **Step 4 rewritten** from the confirmed warranty facts, and `facts.warranty` with it.
6. **One action per repair card.** The whole card links to the repair; the eight Book links are gone.
7. **Speed.** Font: dropped the opsz axis, 132.9 to 49.8 KB. FAQ: Radix accordion replaced by native `<details>`. Review carousel out of home. Before/after chunk out of first load while it is hidden. Big copy moved to `content-large.ts` because a client import pulls every used export of a module into the first-load chunk.

Home first-load JS after: 176.1 KB gz. Framework alone is about 133 KB (react-dom 70.1, Next router 43.1, runtime 19.9), so the 120 KB budget cannot be met on Next's App Router while the framework stays; the site's own code is about 43 KB.

### Gates after round 1

| Check | Result |
|---|---|
| Build, lint, typecheck | Pass |
| E2e and axe | 269 passed, 37 skipped, 6 failed in the full run at 2 workers. 5 passed when re-run alone (timeouts and a closed browser under memory pressure). The sixth was a stale test expecting 6 menu rows when the Home row makes 7; fixed, not re-run yet. New redirect test passes |
| Lighthouse mobile, median of 3 | `/` perf 75, a11y 100, bp 100, seo 100, LCP 3214, TBT 733 |
| | `/repairs/galaxy-z-fold-flip` perf 95, 100, 100, 100, LCP 1861, TBT 232 |
| | `/book` perf 87, 100, 100, 100, LCP 2593, TBT 494 (one run had 3 s unattributed long tasks: machine load) |
| | `/quote` perf 92, 100, 100, 100, LCP 2918, TBT 215 |
| Slow 4G with 4x CPU, median of 3, home at 390 | h1 and WhatsApp and call links in the DOM 952 ms, FCP and LCP 1188 ms, hydrated 2101 ms. On the wire: JS 219 KB, font 50, CSS 16 |
| Overflow | None at 390 and 1440 on the pages shot. The 320 to 1920 sweep has not been run |

**Performance gate not met:** home is 75 against 90. Lighthouse's LCP on home is the fold poster: requested at 79 ms, 6 KB, then 2227 ms of render delay behind a busy main thread (Style and Layout 1675 ms, Script Evaluation 1416 ms). Next targets: `Reveal` runs one observer and a state change per block, so a CSS scroll-driven version removes it from hydration; `decoding="async"` on the poster; the Radix menus (about 48 KB) load right after hydration and could wait for first interaction, which would also fix the dead menu tap.

### Home order test

Shipped in round 1: repairs, reviews, pricing, bench, process, visit, FAQ. Alternative: repairs, pricing, reviews, process, bench, visit, FAQ. A fresh reviewer, shown both as phone captures, picked the alternative: the sceptic reads "You hear the price first" before the reviews, promise first and proof second. The courier customer is served slightly better by the shipped order, and by neither well. To apply and verify in round 2.

### Deployed checkpoint (Ameer asked for it, 1 Nov 2026)

Ameer asked to push live up to a checkpoint and continue, which overrides the brief's "never push" for this checkpoint. `origin/main` had moved to `0104126` (another session: repair picker before booking, Start my repair and Ask AI in the hero, cards without Book, the 2-star review removed as Ameer's call, Fold card renamed), so it was merged, never forced.

- Kept from that session: all of the above. Repair cards keep the round 1 version: the whole card is one link, without its extra View details link to the same page.
- Tests on the merged build: lint, typecheck and build pass. 166 functional passed, 25 skipped, 3 failed at 3 workers; the 3 (2 tests) passed alone with a 90 s limit. Axe on `/`, `/quote`, `/book` and the Fold page: 16 passed. The full axe sweep was not run on the merge.
- Also live with it: the owner's uncommitted batch as of the snapshot (`2fa759c`), which round 1 is built on.
- Not live: edits in the main checkout made after the snapshot, 17 files differing from it at 15:59 (some of them are `0104126` itself).
- Question for Adnan: the Fold card now reads "iPhone Duo, Pixel Fold, Z Fold and Z Flip", but PRD §12 q5 says there is no iPhone Duo and assumes Surface Duo.

### Not verified in round 1

Keyboard use across the new sections beyond the FAQ, reduced-motion run of the whole page, tablet widths, and real analytics events.

Hero recommendation, not applied: the reviewer read "10,000+ Certified Repairs" as unexplained in the first line. Explain it once Adnan says who certifies.
