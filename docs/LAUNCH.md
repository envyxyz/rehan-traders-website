# Launch checklist (Phase 10)

Tick-box list only. The how-to (clicks, values, success checks) is in `docs/GO-LIVE.md`; the step numbers below point there. SEO audit of the Phase 9 build: `docs/launch/seo-audit.md`. State probed on 31 Oct 2026 is in the table at the top of GO-LIVE.md.

## Already true on 31 Oct 2026 (re-check, do not redo)

- [x] Nameservers on Cloudflare, DNSSEC on, apex and www answer from the Worker, HTTP to HTTPS 301, HSTS 6 months (GO-LIVE steps 2 to 4).
- [x] All runtime secrets set in the Worker (GO-LIVE step 1).

## Code and repo

- [ ] `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e` pass; `grep -rli "5 minutes" out --include=*.html` prints nothing; Phase 9 committed and merged to `main` (GO-LIVE 0).
- [ ] Fix the SEO audit items marked "before launch" in `docs/launch/seo-audit.md`.
- [ ] `grep -n "TODO(adnan" src/content.ts` reviewed: each one confirmed or left neutral (GO-LIVE 0.4).
- [ ] **Public holidays** in `src/content.ts` confirmed with Adnan, Islamic dates updated once announced, list extended past August 2027.
- [ ] `NEXT_PUBLIC_SITE_URL` removed from `.env.example` (nothing reads it); decide on `OPENROUTER_API_KEY_FREE` (unused by the code) (GO-LIVE 1).

## Cloudflare and DNS

- [ ] Workers Builds connected to `envyxyz/rehan-traders-website`, production branch `main`, build `pnpm build`, deploy `npx wrangler deploy`; first build from a push is green (GO-LIVE 1).
- [ ] `AI_FORCE_FAIL` absent from the Worker; `npx wrangler secret list` shows the six used names.
- [ ] workers.dev route: decide on or off (GO-LIVE 1).
- [ ] DMARC has `rua` (GO-LIVE 5).
- [ ] `www` 301s to the apex with the path and query kept (GO-LIVE 6).
- [ ] SSL Full (strict), Always Use HTTPS, Rocket Loader off, AI Crawl Control as in step 7 (GO-LIVE 7).
- [ ] **Rate limit `/api/*`**: one rule, URI Path starts with `/api/`, IP, 20 per 10 s, Block 10 s; tested (GO-LIVE 8). Phase 6's chat, the booking and the upload routes all sit under it.

## Booking

- [ ] **Clear the test bookings.** RT-0001 and RT-0002 (29 Oct 2026, "Test booking/quote (Claude)", 0300 0000000) are in the Sheet. Delete both rows, then in the Apps Script Project Settings delete the `LAST_JOB` property so the first customer gets RT-0001 (or set it to match the paper job cards).
- [ ] **One real booking on the live site:** row in the Sheet, email at rehanmobiletraders@gmail.com, WhatsApp text correct. Then delete the test row and reset `LAST_JOB` again.
- [ ] **Workers Logs** stay on (`observability` in `wrangler.jsonc`): a booking the Apps Script could not take is logged there in full. `/privacy` says so.

## Search and listings

- [ ] Search Console Domain property verified; `sitemap.xml` submitted (Success); `/`, a repair page, `/visit`, `/book` inspected and indexing requested (GO-LIVE 9).
- [ ] Rich results test clean on `/`, one repair page and `/faq`. No AggregateRating or Review markup, by rule.
- [ ] Bing imported from Search Console; sitemap present. Crawler Hints on; Bing IndexNow report checked a week after a deploy (GO-LIVE 9).
- [ ] GBP website link `https://rehanmobiletraders.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`, appointment link if offered, Friday prayer break in the hours, listing name decided (GO-LIVE 12).
- [ ] Facebook page phone and hours fixed, then added to `site.sameAs` (GO-LIVE 12).

## Analytics

- [ ] GA4 property (Pakistan, PKR, 14 months, redact email) and web stream; Google tag and event tags published in `GTM-TBXL7JMX` (GO-LIVE 10).
- [ ] DebugView shows `whatsapp_click`, `call_click`, `directions_click`, `book_start`, `book_step`, `book_submit`, with no personal data in any parameter.
- [ ] Key events set; Search Console linked to GA4 and its report collection published.

## After launch

- [ ] Uptime monitor on `/` (UptimeRobot Free); decision on `GET /api/health` (GO-LIVE 11).
- [ ] Calendar events created: weekly site check, monthly review refresh (GO-LIVE 13).
- [ ] Lighthouse SEO and the other three categories 95+ on `/`, one repair page and `/visit` (PageSpeed Insights, mobile).
- [ ] Note in `docs/PHASES.md` and one commit.
