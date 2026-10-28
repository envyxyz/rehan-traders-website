# Rehan Traders website: PRD

Status: approved direction, 28 Oct 2026. Owner: Ameer. Client contact: Adnan Ali.
Product truth lives in `PRODUCT.md`; visual rules in `DESIGN.md`; the hero/nav reference build in `design/mock/`. Research in `docs/research/`.

## 1. Goal

Turn people with a broken phone or tablet in Lahore into visits to Shop G-88, Hafeez Center. The four conversions, in order of value: **booked visit**, **WhatsApp chat**, **call**, **directions tap**. Every page answers "can you fix my phone, roughly how much, can I trust you" before anything else.

Targets for 90 days after launch:
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO (mobile, every page).
- Core Web Vitals green: LCP under 2.0 s, INP under 200 ms, CLS under 0.05 on a mid-range Android over 4G.
- Page 1 for "touch glass replacement Lahore", "Samsung Fold repair Lahore", "mobile repair Hafeez Center".
- Conversion rate (any of the four actions per session) tracked in GA4 from day one.

## 2. Users and situations

- **Cracked screen, today.** Searches "touch glass change price", lands on mobile, wants a price range and to know if the original display is kept. Converts by WhatsApp or booking.
- **Foldable owner.** Galaxy Z Fold/Flip with a dead inner screen or stiff hinge. Expensive device, high anxiety about fake parts. Needs proof of specialism.
- **Dead or wet phone.** Cares about data first. Needs reassurance and a fast walk-in.
- **Comparer in Hafeez Center.** Already in the building, opens Maps, compares shops by rating and photos. Needs "Shop G-88, ground floor" and open status instantly.

## 3. What the research says (summary)

Full reports: `docs/research/competitors-agy.md`, `docs/research/local-seo-agy.md`. Treat their numbers and unverified claims as unconfirmed.

- Every leading repair site uses the same skeleton: device/fault picker in the hero, services grid, trust signals, reviews, location. Users expect it (Jakob's Law). We keep the skeleton and execute it better.
- Price before contact wins (uBreakiFix, iSmash, Apple estimator). Lahore shops hide prices behind WhatsApp. Panel prices move daily, so Adnan chose "Get a quote" at launch; "From Rs X" stays behind a one-line switch.
- Ask for the phone number last, after the customer has picked device, fault and time. 3 to 4 fields total. No accounts, no IMEI.
- Sticky mobile action bar (Book + WhatsApp) and prefilled WhatsApp links are standard in Lahore and work.
- The local fear is part-swapping and data theft. Answer it plainly (job card, sealed device, warranty card), only with claims Adnan confirms.
- Dedicated pages for touch glass and Fold/Flip face thin competition in Lahore.
- `AggregateRating` markup on our own site is self-serving and ignored by Google. Stars come from the Google Business Profile.
- FAQ rich results are limited to government and health sites since 2023; FAQ schema stays for AI search, not for stars.

Inspiration: `docs/research/inspiration/` (TekhFixers repair template, a dental clinic with an inset hero panel and bento services, Oralyn with floating cards on a rounded photo). Dribbble's repair category is mostly template noise; its one strong reference is a minimal, single-device, "precision" layout.

## 4. Sitemap

Launch (indexable unless noted):

```
/                                   Home
/repairs                            All repairs (index of the 8 below)
/repairs/touch-glass-replacement    Glass only, original display kept
/repairs/screen-replacement         Full panel: lines, black or green screen
/repairs/galaxy-z-fold-flip         Fold and Flip: outer glass, inner panel, hinge
/repairs/iphone                     iPhone: screen, back glass, Face ID, battery
/repairs/battery-charging           Battery and charging port
/repairs/water-damage-data-recovery Liquid damage, dead phones, data recovery
/repairs/board-repair               Board-level (microscope) repair
/repairs/ipad-tablet                iPad and tablets
/estimate                           AI repair estimator
/book                               Booking flow (also opens as a sheet anywhere)
/book/confirmed                     Confirmation with job number (noindex)
/reviews                            Google rating and reviews, link to Google
/visit                              Hafeez Center: map, hours, how to find G-88
/faq                                Questions (feeds the chat assistant too)
/about                              The bench, the team, the job card process
/warranty                           Warranty terms (publish only once Adnan confirms)
/privacy  /terms                    Legal (booking data, chat data)
/sitemap.xml  /robots.txt  /llms.txt
404
```

Later (phase 11): device pages (`/repairs/galaxy-z-fold/fold5`), cost guides, mail-in repairs page, repair status tracker.

**Navigation.** Top: logo; Repairs (dropdown of the 8), Estimate, Reviews, Visit; phone button. Scrolled: centred glass island (mark, links, round call button). Phones: logo, call icon, menu; hides on scroll down, returns on scroll up.
**Footer.** Repairs (8 links) · Shop (About, Reviews, FAQ, Warranty) · Visit (address, hours, phone, WhatsApp, directions) · Legal. Registered name/NTN once known.

## 5. Homepage, top to bottom

1. **Hero (100svh, inset panel).** Google proof row, red rule, h1 "Cracked glass? Fixed at G-88.", one-line lede, **Book a visit** (primary) + **WhatsApp**, then phone, address and live open status. Right: CSS 3D Galaxy Z Fold, closed on load, opens into a V with a job card (No. RT-0427) on its inner screen.
2. **Repairs.** Cards with image, title, two-line description, price line ("Get a quote in 5 minutes" at launch) and a **Book this repair** button. Lead with touch glass and Fold/Flip (larger cards), then iPhone, screen, battery/charging, water/data, board, tablets. "All repairs" link.
3. **Before and after.** Drag slider: the same phone cracked and fixed, caption naming device and fault.
4. **How a repair works.** Four steps that mirror the shop's real kit: 1 job card at the counter, 2 repaired at the open bench, 3 tested and sealed in the pouch, 4 warranty card. Step numbers in Signal Red.
5. **Reviews.** Rating and count with an "as of" date, 5 hand-picked Google reviews (author, date, stars, text), "Read all on Google".
6. **Not sure what's wrong?** One input: "Describe the problem" sends to `/estimate`.
7. **Visit.** Storefront photo, address with "Ground floor", hours with today highlighted, open status, Directions button (Google Maps link), "Outside Lahore? Send it by courier" line.
8. **FAQ.** Five top questions, link to `/faq`.
9. **CTA band (ink).** "Cracked glass? Bring it to G-88." Book + WhatsApp.
10. **Footer.**

Floating: on phones a glass bottom bar (Book a visit · WhatsApp · chat icon) appears after the hero. On desktop a glass "Ask a question" launcher bottom right.

## 6. Features

### 6.1 Booking (Slot + WhatsApp handoff)
- Steps: device (searchable picker: brand, then model) → fault (chips) → visit time (next 7 days, Mon to Sat, 11:00 to 21:30 in 30-min slots, no Friday 13:00 to 14:00 slots, public holidays from a list in content.ts, Asia/Karachi, past slots hidden) → name + phone (Pakistani mobile, validated) → confirm.
- Submit: the Worker's `/api/book` validates with Zod, honeypot + time-trap; posts to a Google Apps Script web app that appends to a Google Sheet, assigns the next sequential job number (RT-0001…), emails the shop, and returns the number.
- Confirmation: job number in Signal Red, tamper seal, visit time, address, "Add to calendar" (.ics), and **Send on WhatsApp** opening `wa.me/923058874839` with a prefilled message (job number, device, fault, time, name).
- Failure: if the Sheet call fails, still show a confirmation with a local reference and push the WhatsApp handoff harder. Never lose the booking silently.
- No capacity limits at launch. Add slot capacity only if double-booking happens.

### 6.2 AI chat assistant
- Answers only from the site's own content (`src/content.ts`: services, prices mode, FAQ, hours, address, process). Never invents prices, warranty, turnaround or claims.
- Language: replies in the language the customer writes in (English, Roman Urdu or Urdu script).
- Hands off to booking, WhatsApp or a call when the customer is ready or the question is out of scope.
- Models, in order: Claude Haiku via OpenRouter (prompt caching on the knowledge block) → Gemini Flash via Google AI Studio → a fixed reply with WhatsApp and call buttons. Timeout per provider, streaming, max tokens and max turns per session capped.
- Runs in the Cloudflare Worker (`/api/chat`) with the AI SDK. The widget is lazy-loaded on first interaction or idle, never in the initial bundle.
- Rate limited per IP (Cloudflare rate-limiting rule on `/api/*`); no logs of message content beyond what the providers keep; disclosed in `/privacy`.

### 6.3 AI repair estimator (`/estimate`)
- Two paths on one page: pick device + fault, or type the problem in your own words. The AI maps free text to a fault category and device using the same knowledge, then shows the likely repair, whether the original panel may be saved, the price line from `content.ts` (in quote mode: **Get a quote on WhatsApp** with the device and fault prefilled; never a number it made up), and **Book this repair**.
- Same provider chain and limits as the chat.

### 6.4 Google reviews
- Google Cloud billing is not available, so no Places API. Rating, count and 5 real reviews (author first name and initial, date, stars, text) are copied from the Google Business Profile into `content.ts` with an `asOf` date, refreshed by hand monthly.
- Every review links to the Google listing ("Read all on Google"). No `AggregateRating` JSON-LD.
- Later, free: the Google Business Profile API (needs an access request, no billing) can automate this.

### 6.5 Prices
- `content.ts` holds `priceMode: 'from' | 'quote'` and a `priceFrom` per service. `from` shows "From Rs X"; `quote` shows "Get a quote in 5 minutes" everywhere (cards, service pages, estimator, chat knowledge). Launch in `quote` (Adnan). Switching is a one-line change.

### 6.6 Signature details
- Red job number: fold screen, booking confirmation, WhatsApp message.
- Tamper seal: once, on the booking confirmation.

## 7. Content model

All copy in `src/content.ts`, typed, no copy in components. Sections: `site` (name, phone display/dial, WhatsApp, email, address lines, geo, hours, maps URL), `priceMode`, `nav`, `hero`, `services[]` (slug, title, short, long, faults, priceFrom, image, alt, faq), `devices` (brands → models), `faults`, `process[]`, `reviews` (rating, count, asOf, url, items[]), `payments`, `holidays[]`, `faq[]`, `visit`, `cta`, `footer`, `legal`, `seo` (per route title/description), `chat` (greeting, canned fallback). Placeholders are allowed now; mark each with `// TODO(adnan): confirm` so they can be grepped before launch.

## 8. Non-functional

- **Performance budget (home, mobile):** initial JS under 120 KB gzip; fonts self-hosted with `next/font`, Latin subset, 2 families; hero has no raster image (CSS fold) so LCP is the h1; images pre-sized AVIF/WebP from the image script with `srcset`/`sizes` (static export has no image optimizer); no map on the homepage, and on `/visit` a Google Maps embed (Share → Embed a map, no key) loads only when tapped; GA4 loads after hydration; chat, Lenis on touch, and the before/after slider load lazily.
- **Accessibility:** WCAG 2.2 AA, 44px targets, visible focus, keyboard-complete booking and chat, reduced motion and reduced transparency honoured, form errors inline and specific.
- **SEO:** per-route metadata, canonical URLs, OG images, JSON-LD (`MobilePhoneStore` with address, geo, hours, phone; `Service` per repair page; `FAQPage`; `BreadcrumbList`), `sitemap.ts`, `robots.ts`, `llms.txt`, one entity sentence ("Rehan Traders is a phone and tablet repair lab at Shop G-88, Ground Floor, Hafeez Center, Gulberg III, Lahore") repeated in footer, about and schema. NAP identical to the Google Business Profile.
- **Security:** security headers in `public/_headers` (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`); secrets only in the Worker; Zod on every input; one Cloudflare rate-limiting rule on `/api/*`; prompt-injection rules in the system prompt; no PII in URLs or analytics.
- **Analytics (GA4 events):** `book_start`, `book_step`, `book_submit`, `whatsapp_click`, `call_click`, `directions_click`, `chat_open`, `chat_handoff`, `estimate_complete`, `price_view`. Search Console and Bing Webmaster verified.

## 9. Stack

Next.js (App Router, `output: 'export'`) · React · TypeScript strict · Tailwind CSS v4 (`@theme` tokens) · shadcn/ui (restyled to the tokens) · Motion (`motion/react`, LazyMotion) · Lenis · lucide-react · AI SDK (OpenRouter + Google providers) · Zod · Playwright + axe · Lighthouse CI · pnpm · Cloudflare Workers (free plan).

**Hosting (decided 28 Oct 2026, must be free):** Cloudflare Workers free plan, which allows commercial use. The Next.js static export (`out/`) is served as static assets: free and unlimited, and they never run the Worker. A small Worker in `worker/` handles only `/api/book`, `/api/chat` and `/api/estimate`: 100,000 requests a day and 10 ms CPU each (waiting on OpenRouter or Apps Script does not count). So: no ISR, middleware, server actions or dynamic route handlers in Next. Deploys from GitHub through Workers Builds. The domain stays registered at Hostinger; at go-live its nameservers move to Cloudflare (copy any MX/email records first).

## 10. Out of scope at launch

Accounts, payments, online parts shop, repair status tracking, multi-language site, blog, device-specific landing pages, photoreal 3D fold (planned as a phase-11 swap).

## 11. Answers from Adnan (28 Oct 2026)

These are confirmed and can go on the site:
- **Prices:** none shown. "Get a quote" everywhere (`priceMode: 'quote'`).
- **Payment:** all methods accepted (content.ts lists cash, card, JazzCash, EasyPaisa, bank transfer).
- **Watching the repair, removed parts:** both on request when the bench is not busy. Removed parts go back to the customer when safe; swollen batteries are disposed of safely straight away.
- **Courier / out-of-city repairs:** yes.
- **Hours:** Mon to Sat 11 AM to 10 PM, Friday prayer break 1 to 2 PM, closed Sundays and public holidays.
- **Booking email:** rehanmobiletraders@gmail.com.
- **Photos:** team faces allowed, names not needed. Owner is Adnan (his photo: the old profile picture in `../growth/Brand/`).
- **Coverage:** every Galaxy Z Fold and Z Flip generation, Pixel Fold, Surface Duo; iPhones (panels, back glass); water damage; tablets except very old, obsolete models. The shop tries to save the damaged panel first.
- **Founded:** 2009.

## 12. Still open

Nothing below goes on the site until answered.
1. Warranty: length and what it covers.
2. Typical turnaround per repair (glass, screen, battery, port, Fold inner screen).
3. Registered business name and NTN (footer and schema).
4. Courier terms: which courier, who pays each way, how to pack.
5. "iPhone Duo" in the answer: there is no such phone. Assumed Microsoft Surface Duo; confirm.
6. Real before-and-after photos of a finished job (customer permission), plus the shot list in the plan PDF.
