# Launch checklist (Phase 10)

Items earlier phases left for go-live. Tick them off in Phase 10.

## Booking (from Phase 5)

- [ ] **Rate limit `/api/*`.** One free Cloudflare rate-limiting rule: Cloudflare dashboard > the rehanmobiletraders.com zone > **Security** > **WAF** > **Rate limiting rules** > **Create rule**. Name `api`, match `URI Path starts with /api/`, counting by IP, 10 requests per 10 seconds, action **Block** for 10 seconds. (The free plan allows one rule and a 10-second period; it needs the zone on Cloudflare, so it comes after the nameserver move.) Phase 6's `/api/chat` (and the booking and upload routes) sit under the same rule; `/api/estimate` was removed on 30 Oct 2026.
- [ ] **Worker secrets.** `BOOKING_WEBHOOK_URL` and `BOOKING_WEBHOOK_SECRET` set in the Worker (`integrations/booking-apps-script/README.md`, step 7).
- [ ] **Clear the test bookings.** RT-0001 and RT-0002 (29 Oct 2026, "Test booking/quote (Claude)", 0300 0000000) are in the Sheet. Delete both rows, then in the script's Project Settings delete the `LAST_JOB` property so the first customer gets RT-0001 (or set it to match the paper job cards).
- [ ] **One real booking on the live site:** row in the Sheet, email at rehanmobiletraders@gmail.com, WhatsApp text correct. Then delete the test row and reset `LAST_JOB` again.
- [ ] **Public holidays** in `src/content.ts` confirmed with Adnan, Islamic dates updated once announced, and the list extended past August 2027.
- [ ] **Workers Logs** stay on (`observability` in `wrangler.jsonc`): a booking the Apps Script could not take is logged there in full. Say so in `/privacy`.
