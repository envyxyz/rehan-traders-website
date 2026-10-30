# Launch checklist (Phase 10)

Items earlier phases left for go-live. Tick them off in Phase 10.

## Booking (from Phase 5)

- [ ] **Rate limit `/api/*`.** One free Cloudflare rate-limiting rule: Cloudflare dashboard > the rehanmobiletraders.com zone > **Security** > **WAF** > **Rate limiting rules** > **Create rule**. Name `api`, match `URI Path starts with /api/`, counting by IP, 10 requests per 10 seconds, action **Block** for 10 seconds. (The free plan allows one rule and a 10-second period; it needs the zone on Cloudflare, so it comes after the nameserver move.) Phase 6's `/api/chat` (and the booking and upload routes) sit under the same rule; `/api/estimate` was removed on 30 Oct 2026.
- [ ] **Worker secrets.** `BOOKING_WEBHOOK_URL` and `BOOKING_WEBHOOK_SECRET` set in the Worker (`integrations/booking-apps-script/README.md`, step 7).
- [ ] **Clear the test bookings.** RT-0001 and RT-0002 (29 Oct 2026, "Test booking/quote (Claude)", 0300 0000000) are in the Sheet. Delete both rows, then in the script's Project Settings delete the `LAST_JOB` property so the first customer gets RT-0001 (or set it to match the paper job cards).
- [ ] **One real booking on the live site:** row in the Sheet, email at rehanmobiletraders@gmail.com, WhatsApp text correct. Then delete the test row and reset `LAST_JOB` again.
- [ ] **Public holidays** in `src/content.ts` confirmed with Adnan, Islamic dates updated once announced, and the list extended past August 2027.
- [ ] **Workers Logs** stay on (`observability` in `wrangler.jsonc`): a booking the Apps Script could not take is logged there in full. Say so in `/privacy`.

## Search and listings (from Phase 8)

Do these after the site is live on rehanmobiletraders.com with nameservers on Cloudflare. Menu paths were checked against each tool's docs on 31 Oct 2026; dashboards move, so search the help page if a label differs.

- [ ] **Google Search Console, Domain property.** search.google.com/search-console > property selector > **Add property** > **Domain** > `rehanmobiletraders.com`. Copy the `google-site-verification=…` TXT value. Cloudflare > the zone > **DNS** > **Records** > **Add record**: Type `TXT`, Name `@`, Content the value, TTL Auto. Back in Search Console, **Verify**.
- [ ] **Sitemap.** Search Console > **Indexing** > **Sitemaps** > `sitemap.xml` > **Submit**. Status should read Success. `/book/confirmed` and `/dev/*` are not in it on purpose.
- [ ] **URL inspection.** Inspect `https://rehanmobiletraders.com/` and `https://rehanmobiletraders.com/repairs/touch-glass-replacement`: **Test live URL**, check "Page can be indexed" and the Google-selected canonical, then **Request indexing**.
- [ ] **Rich results.** search.google.com/test/rich-results (needs a signed-in Google account) on the home page (LocalBusiness: MobilePhoneStore), one repair page (Service, FAQ, Breadcrumbs) and `/faq`. No errors. There is no AggregateRating or Review markup, by rule. Search Console > **Enhancements** fills in over the following weeks.
- [ ] **Bing Webmaster Tools.** bing.com/webmasters > sign in > **Import your sites from GSC** > allow > pick the property > **Import**. This brings the sitemap too; confirm it under **Sitemaps**.
- [ ] **IndexNow.** Cloudflare > the zone > **Caching** > **Configuration** > **Crawler Hints** > On. Free, no key file. It pings Bing and other IndexNow engines when content changes. Not verified: whether it fires for Workers static assets; check Bing's **IndexNow** report a week after a deploy, and only then consider a key file in `public/`.
- [ ] **Google Business Profile website link.** business.google.com > the listing > **Edit profile** > **Contact** > **Website**: `https://rehanmobiletraders.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`. The tag lets analytics separate listing visits from search; the canonical tag keeps the clean URL indexed. If the profile offers an **Appointment link**, use `https://rehanmobiletraders.com/book?utm_source=google&utm_medium=organic&utm_campaign=gbp`. While there: add the Friday prayer break (1:00 to 2:00 PM) to the hours, and decide the listing name (open point 2 in the Business Profile).
- [ ] **GA4 inside the Google Tag Manager container.** The site loads one tag: GTM container `GTM-TBXL7JMX` (root layout, via `@next/third-parties`). Nothing else is needed in code. In tagmanager.google.com > the container:
  1. **Tags** > **New** > **Google tag**, Tag ID = the GA4 measurement ID (`G-…`, from analytics.google.com > **Admin** > **Data streams** > the web stream), trigger **Initialization - All Pages**.
  2. **Variables** > **User-defined** > **New** > **Data Layer Variable** for each of `from`, `service`, `step`, `index`, `kind`, `saved`, `action`, `path`, `fault`.
  3. **Triggers** > **New** > **Custom Event**, event name `book_start|book_step|book_submit|whatsapp_click|call_click|directions_click|chat_open|chat_handoff|estimate_complete|price_view`, tick **Use regex matching**.
  4. **Tags** > **New** > **Google Analytics: GA4 Event**, measurement ID as above, event name `{{Event}}`, event parameters from the variables in step 2, trigger from step 3.
  5. **Submit** > **Publish**.
- [ ] **GA4 property settings.** analytics.google.com > **Admin**: time zone Pakistan, currency PKR; **Data retention** > 14 months; **Data streams** > the stream > **Redact data** > email on.
- [ ] **DebugView.** Open GTM > **Preview** with the live site (or the Google Analytics Debugger extension), open the live site, then GA4 **Admin** > **DebugView**. Tap a WhatsApp button, the phone number, Directions, start and submit a test booking. Expect `whatsapp_click`, `call_click`, `directions_click` (each with only a `from` slug), `book_start`, `book_step`, `book_submit`. No names, numbers or messages in any parameter.
- [ ] **Key events.** GA4 **Admin** > **Key events** > **New key event**: `book_submit`, `whatsapp_click`, `call_click`, `directions_click`.
- [ ] **Lighthouse SEO.** Chrome DevTools > **Lighthouse** > Mobile > SEO on `/`, one repair page and `/visit`. Target 100.
