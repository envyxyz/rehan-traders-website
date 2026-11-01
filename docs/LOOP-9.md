# Loop to 9: trust and conversion

Memory for the optimisation loop that started on 1 Nov 2026. Read this first in every round. Goal: an evidence-backed 9/10 on trust and conversion, from about 6.5. The independent reviewer's scores are the real ones. Conversion scores are expert judgement until real traffic confirms them.

Branch `loop/trust-conversion`, one commit per round, never pushed, never merged to main (pushing main deploys). Worktree: `website/.claude/worktrees/loop-9`. It has no `.env.local` on purpose, so its Worker cannot reach the real booking webhook or spend chat keys.

Screenshots: `../.agency/build/website-shots/loop-9/` in the client folder (outside this repo).

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
