# Search plan: Google, Maps and AI answers

Written 31 Oct 2026 (Phase 10, branch `p10-search`). Free tools only. Goal: when someone in Lahore says their phone or tablet is broken, Rehan Traders shows up in Google search, Google Maps and the AI assistants (ChatGPT, Gemini, Perplexity, Claude, Copilot, Google AI Overviews).

Ground rules for everything below:

- Facts come from `PRODUCT.md`, `src/content.ts` and the master record (`../growth/Documents/Business Profile.html`). No prices, warranty lengths, turnaround beyond Adnan's 30 Oct answer, counts, "original parts", "100%" or rating markup.
- No fake reviews, no review gating (asking only happy customers), no incentives for reviews, no keywords added to the business name.
- NAP problems and their fixes are in `docs/launch/nap.md`. This file is the growth plan.
- Nothing here promises a ranking. Google ranks local results on relevance, distance and prominence; distance from the searcher is outside our control, so the work is relevance (accurate categories, services, pages) and prominence (reviews, mentions, links).

## Where things stand (checked 31 Oct 2026)

- Google Business Profile: claimed and managed (owner replies to reviews signed "Adnan, Rehan Traders" are live; a "From the owner" post dated 24 Oct is live). 4.9 from 49 reviews (47 five-star, 1 four-star, 1 two-star). The site's `reviews.count` in `src/content.ts` says 50 as of 29 Oct; refresh it by hand with a new `asOf` when the review list is next updated. Website `rehanmobiletraders.com` is linked. Address shows `Shop G88, Hafeez Center, Block E1 Block E 1 Gulberg III, Lahore, 54660`, and Friday shows no prayer break (see nap.md, fixes 1 to 3).
- Apple Maps has an unclaimed place card ("Claim This Place") with an incomplete address.
- Bing Maps has the listing (name, phone and Mon to Sat hours right; no Friday break; no website seen).
- Facebook `rehantraders0` shows the wrong phone, "Always open" and an email nobody has identified.
- The website is live, crawlable, and allows every AI crawler in robots.txt; GPTBot and ClaudeBot user agents get HTTP 200 on `/` and `/llms.txt`.
- On 19 Oct, Maps searches from Hafeez Center put the shop 8th of 8 for "mobile repair Hafeez Center Lahore" and 5th of 8 for "mobile repairing shop Gulberg Lahore" (`.agency/raw/gmb/search-results.txt`). That is the baseline.

## Baseline: not in Google or Bing yet (checked 31 Oct 2026)

- `site:rehanmobiletraders.com` on Google returned no documents, checked by hand in a browser. Bing's `site:` query returned unrelated pages, none from this site. Nothing else in this plan can rank until action 3 below is done, so do it first.
- agy ran 8 repair queries through Google Search grounding (a broken phone in Lahore, best shop, Hafeez Center, touch glass, Fold screen, water damage, iPhone in Gulberg, "mobile ki screen toot gayi"). The site and the shop appeared in 0 of 8. A grounded summary is not a real results page, so treat the order of results as a rough guide, and re-check in a normal browser.
- Domains agy saw most: hafeez-center.com.pk, mobilemarket.pk, citysearch.pk, apexrepairinglab.com, phoneservicecentre.com, gsm.net.pk, dmarket.pk, reddit.com (r/lahore), pakwheels.com forums, carlcare.com. So the portals and citysearch.pk come first when asking to be listed. Check each page before contacting it.
- llms.txt: no AI provider has confirmed it affects citations (agy's reading of the docs). Keep it, since it costs nothing, and do not count on it. FAQ rich results are no longer shown for local businesses, so the FAQ text helps as page content and not as a rich result.

## Ranked actions (impact per hour)

| # | Action | Who | Time | Why it moves rankings |
|---|---|---|---|---|
| 1 | Fix the Google address, hours and categories (nap.md fixes 1 to 3) | Ameer, in the Business Profile | 20 min | Google's own record is the strongest local signal, and every AI engine that reads Google (Gemini, AI Overviews) repeats it |
| 2 | Turn on reviews at the counter: QR standee, NFC card, WhatsApp follow-up (section "Reviews") | Adnan, every customer | 2 min a customer | Review count, recency and the words in reviews are the main prominence signal the shop controls |
| 3 | Search Console and Bing Webmaster Tools: verify, submit the sitemap, request indexing of the 8 repair pages | Ameer | 30 min | Gets the new pages into Google and Bing fast. Bing's index feeds Copilot and ChatGPT search |
| 4 | Cloudflare: check AI Crawl Control and turn on Crawler Hints (section "Cloudflare") | Ameer | 10 min | Makes sure AI search crawlers are not blocked at the edge; Crawler Hints pings Bing (IndexNow) when pages change |
| 5 | Fix the Facebook page (nap.md fix 4) | Adnan logs in, Ameer can do it with admin access | 15 min | The only other public profile with the shop's name; it currently shows a wrong phone and "Always open" |
| 6 | Claim the Apple Maps place card (nap.md, citations) | Ameer with Adnan's documents | 30 min, then Apple's review | Siri and Apple Maps answers on every iPhone in Lahore; the card is unclaimed today |
| 7 | Business Profile services list and description (section "Business Profile") | Ameer | 30 min | Services are matched against queries like "touch glass replacement" and "Fold screen repair" |
| 8 | Weekly Google post from the poster set, with a real photo (section "Posts") | Ameer schedules, Adnan sends one real photo a week | 15 min a week | Shows the listing is active, and gives Google and AI more text about each repair |
| 9 | Real photos: 3 to 5 a week, unedited | Adnan | 5 min a week | Listings with recent photos get more taps; photos of named repairs back up the services |
| 10 | Correct or create the free citations (nap.md "Free citations") | Ameer | 1 to 2 h once | Consistent name, address and phone across directories is a trust signal for Google and for AI engines that look for agreement |
| 11 | Answer real Lahore repair questions on Reddit and Quora as the shop, openly (section "Mentions") | Ameer or Adnan | 30 min a week | Third-party mentions are what AI engines use to decide whom to recommend |
| 12 | YouTube Shorts of real repairs (section "Video") | Adnan films, Ameer edits | 1 h a week | YouTube is often cited by Google AI Overviews; the text around a video (title, description) is what gets read |
| 13 | Ask the Hafeez Center portals and Pakistani tech blogs to list or mention the shop (section "Mentions") | Ameer | 1 h once | Listicles and local guides are among the pages AI answers cite for "best repair shop in Lahore" |
| 14 | Monthly AI visibility check (section "AI check") | Ameer | 45 min a month | The only way to see whether any of this is working in ChatGPT, Gemini, Perplexity and Copilot |

## Business Profile

### Categories

Google's category list has no "tablet repair" category. Use, in this order:

1. Primary: **Mobile phone repair shop** (already set).
2. Additional: **Electronics repair shop**, **Data recovery service** (the shop recovers data from dead and water-damaged phones; PRODUCT.md and the reviews).
3. Only if Adnan confirms the shop sells them: **Cell phone accessory store**, **Cell phone store** (the master record lists "phone sale and purchase" and parts; PRODUCT.md does not, so ask first).
4. Remove **Screen repair service** if the hover text in the Business Profile describes window and door screens (that is what the category is used for in Google's list); keep it only if Google's description is about device screens. Remove **Repair service** once two specific additional categories are in: it adds nothing a specific category does not.

Check after each change that the listing is still verified. Category changes do not usually trigger re-verification; name changes can.

### Services (Edit profile > Services)

Add each confirmed service with no price (launch is quote mode). Use the short text from `src/content.ts`:

| Service | Description (copy as written) |
|---|---|
| Touch glass replacement | Cracked glass replaced on its own. Your original display stays. |
| Galaxy Z Fold and Flip repair | Outer glass, inner screen and hinge for every Galaxy Z Fold and Z Flip. |
| iPhone repair | Screen, back glass, Face ID, battery and charging. |
| Screen replacement | Lines, black, green or flickering screens replaced. |
| Battery and charging repair | Batteries that drain fast and ports that will not charge. |
| Water damage repair and data recovery | Wet or dead phones cleaned, repaired and your data recovered. |
| Motherboard repair | Board-level faults found and fixed under the microscope. |
| iPad and tablet repair | Tablet glass, screens, batteries and charging. Mainly iPads. |
| Free checking | The shop checks your device free of cost and tells you what is wrong, what it will cost and how long it will take. |

Add Google's predefined services that match (screen repair, battery replacement, charging port repair, water damage repair, data recovery) and skip any predefined service the shop has not confirmed (unlocking, software, speaker, microphone).

### Description (750 characters, no links, no promotions)

> Rehan Traders is a phone and tablet repair lab at Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Gulberg III, Lahore, repairing phones since 2009. When only the glass is cracked, the shop replaces the touch glass and keeps your original display. It repairs every Galaxy Z Fold and Z Flip generation (outer glass, inner screen and hinge), iPhones (screen, back glass, Face ID, battery, charging), screens with lines or black displays, batteries and charging ports, water-damaged phones with data recovery, motherboard faults under the microscope, and iPads. Checking is free: the shop tells you what is wrong, what it will cost and how long it will take. Call or WhatsApp 0305 8874839.

(About 700 characters. Every fact is in PRODUCT.md.)

### Hours and special hours

- Regular: Monday to Thursday and Saturday 11:00 AM to 10:00 PM. Friday as two periods: 11:00 AM to 1:00 PM and 2:00 PM to 10:00 PM. Sunday closed.
- Special hours: mark Closed on each Eid and Ashura day once the dates are announced. The site's estimates are in `src/content.ts` (`holidays`); the next ones are Eid ul Fitr around 10 to 12 Mar 2027. Do not mark national holidays closed: the shop opens whenever Hafeez Center does (Adnan, 31 Oct 2026).

### Products

Optional. The products editor is for things sold over the counter. Skip it unless Adnan confirms the shop sells accessories or phones. Do not list repairs as products with made-up prices.

### Q&A

Google discontinued the Business Profile Q&A API on 3 Nov 2025 and is replacing the Maps Q&A section with AI answers built from the profile, the website and reviews. Do not plan Q&A seeding. Check the listing on a phone: if a "Questions & answers" box still shows, answer any real question there from the FAQ. The site's FAQ (now with problem-phrased and Roman Urdu questions) is what Google's AI answers will read instead.

### Posts

One post a week. Posters are ready in `../growth/Posters/` (Touch Glass, Samsung Challenge, Microscope Repair, White Screen - Galaxy Z Fold7, White Screen - iPhone 17 Pro Max, What We Repair, Panel and Pocket, Found the Suspect). Posters go up as Updates, never as Photos. Leave out "iPhone Duo.png" (there is no such phone; PRD §12 q5).

Each post: one problem, one repair, the Hafeez Center location and the phone, a "Call" or "Learn more" button pointing to the matching repair page. Example:

> Cracked screen but the display still works? Rehan Traders replaces only the touch glass, so your original display stays. Free checking at Shop G-88, Ground Floor, Hafeez Center, Lahore. WhatsApp 0305 8874839.
> Button: Learn more, https://rehanmobiletraders.com/repairs/touch-glass-replacement

The 24 Oct post says "Skip the rice". That advice is not in PRODUCT.md; it is common guidance, but keep future posts to confirmed shop facts.

Suggested order for the first eight weeks: touch glass, Fold inner screen, water damage, iPhone back glass, charging port, battery, motherboard (dead phone), iPad.

### Photos

Real, unedited photos only (CLAUDE.md). Three to five a week, from the bench: the microscope over a board, glass separation, a Fold opened, the counter, the storefront. Add the cover photo (storefront) and logo once. The AI mockups in `../growth/Brand/Mockups/` and the AI stand-in images on the website never go on the listing.

### Reviews

The write-a-review link is `https://g.page/r/CUvWWzrw4sFhEBE/review`. The older form in `../growth/Notes/Review Link.md` (`.../CUvWWzrw4sFhEAE/review`) opens the same place (both resolve to place id `0x61c1e2f03a5bd64b`, checked 31 Oct), so the printed QR codes are fine.

How to ask (every customer, not only happy ones):

- At handover, Adnan points to the QR standee or taps the NFC review card (both in `../growth/Brand/Print/`).
- The same day, a WhatsApp message from 0305 8874839:

> Assalam o alaikum. Thank you for bringing your [device] to Rehan Traders. If you'd like to share your experience, you can leave a review here: https://g.page/r/CUvWWzrw4sFhEBE/review. We welcome your honest feedback.

- Customers may mention the phone and the repair if they want to; never write the review for them, never ask for five stars, never offer a discount for a review.
- Reply to every review within a few days, by name, mentioning the repair the reviewer named (the replies already live follow this pattern; templates in `../growth/Notes/Review Replies.md`). For a complaint: thank them, say what the shop will do, give the WhatsApp number. No customer details in replies.

Target: a steady flow rather than a burst. A sudden spike of reviews can be filtered by Google.

## Website (done in this branch)

See the final report and `git log` for the list. In short: problem-phrased FAQs on every repair page in Pakistani English with Roman Urdu phrasings, each repair page's title and description pairing the problem with Hafeez Center and Lahore, richer MobilePhoneStore JSON-LD (areaServed, Hafeez Center as the containing place, the services catalog, payment, owner), a WebSite node, Service nodes with images and channels, and llms.txt / llms-full.txt that open with the "my phone is broken in Lahore" answer and a problem-to-page map.

## Search Console and Bing Webmaster Tools

1. Google Search Console: add the Domain property `rehanmobiletraders.com` (DNS TXT record in Cloudflare). Submit `https://rehanmobiletraders.com/sitemap.xml`. Use URL Inspection > Request indexing for `/` and the 8 `/repairs/...` pages.
2. Bing Webmaster Tools (`bing.com/webmasters`): sign in, choose "Import from Google Search Console". It copies the site and sitemap. This is the fastest free way into the Bing index, which Copilot uses and ChatGPT search draws on.
3. Check both after a week: pages indexed, no errors in the sitemap report.

## Cloudflare

1. Dashboard > rehanmobiletraders.com > AI Crawl Control. Cloudflare has changed its defaults twice: from 1 Jul 2025 new domains were offered AI-crawler blocking by default, and from 15 Sep 2026 new domains get Training and Agent crawlers blocked on pages that show ads, with Search allowed (Cloudflare bots changelog, "New options to manage AI traffic"). This site shows no ads, so the new default should not bite, but check the Crawlers tab: Search crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot) and Agent crawlers (ChatGPT-User, Claude-User, Perplexity-User) should be Allow. Training crawlers (GPTBot, ClaudeBot, Google-Extended) are allowed by our robots.txt; keep them allowed unless Ameer decides otherwise, because training is how the shop's facts get into models' built-in knowledge.
2. Security > Bots: check that Bot Fight Mode is not challenging the crawlers above (on the free plan it cannot be skipped with a rule). The AI Crawl Control metrics show the status codes each crawler received.
3. Check that robots.txt does not get a "Cloudflare Managed" block prepended (today it does not).
4. Caching > Configuration > Crawler Hints: On (free plan). Cloudflare then sends IndexNow pings, which Bing and other IndexNow engines use, when pages change.

## Mentions (third-party presence)

What AI engines need before they recommend a local shop: the same name, address and phone in many independent places; recent reviews that name the repairs; and pages other than the shop's own that mention it for the problem in question. The shop has the first in progress and the second started; the third is close to zero. Work on it slowly and honestly.

- **Reddit** (r/lahore, r/pakistan, r/PakistaniTech): search weekly for "phone repair", "Hafeez", "screen", "Fold". Where someone asks for a Lahore repair recommendation, answer helpfully from a personal account that says it is Ameer from the agency or Adnan from the shop. One link at most, only when it answers the question. Never post the same text twice; never use more than one account. Note: ChatGPT reportedly cut Reddit citations sharply in Aug 2026; Google and Perplexity still retrieve Reddit, so it is one channel among several, not the plan.
  Threads agy found on 31 Oct (Reddit blocked our checks, so open each before replying; titles and dates are agy's): r/Lahore "Reasonable and trusted phone repair shops" (`reddit.com/r/Lahore/comments/1qqg1bu`), r/Lahore "Reliable shops in Hafeez Center for repair" (`.../1lpaqbp`), r/PakistaniTech "Phone repair in Lahore" (`reddit.com/r/PakistaniTech/comments/1byuvhi`), r/Lahore "phone repair" (`.../113meaa`), r/PakGamers "Any reliable shops in hafeez center that fix..." (`reddit.com/r/PakGamers/comments/16hg83e`). The recurring complaints in these threads are swapped parts, copy panels sold as original and fake "water pack" claims. The shop's real answers to those are the open bench, old parts returned on request, the free check, and re-sealing on request with no water-resistance claim; say exactly that and nothing more.
- **Quora**: answer "best mobile repair shop in Lahore / Hafeez Center" and fault-specific questions ("Galaxy Z Fold inner screen repair in Lahore") with a plain, useful answer and a disclosure line.
- **Hafeez Center portals and local directories**: `hafeez-center.com.pk`, `mobilemarket.pk`, `citysearch.pk` (found by agy, 31 Oct, not opened; check each page before contacting). Ask to be listed with the exact master-record NAP.
- **Pakistani tech sites**: PhoneWorld (`phoneworld.com.pk`, has a "Mobile market of Lahore" article), ProPakistani, iPhone in Pakistan. A pitch that offers something real (for example, a short explainer on touch glass replacement versus a full screen replacement, written from the bench) has a chance; a request for a mention does not.
- **LCCI**: see nap.md: the LCCI record for "Rehan Traders" at G-88 lists a different business line and a landline that belongs to another company in agy's search; Adnan should say whether the shop is an LCCI member before anything is changed.

## Video

The YouTube handle @RehanTraders exists with no videos and an unknown owner (joined 17 May 2023). Ask Adnan whether it is his. If not, create a Brand Account channel from `rehanmobiletraders@gmail.com` named "Rehan Traders".

Shorts that work for search: one real repair, 30 to 60 seconds, filmed at the bench. Title with the problem and place in English plus the Roman Urdu phrase, for example "Galaxy Z Fold inner screen repair, Hafeez Center Lahore | Fold ki screen kharab". Description: two plain sentences on what was done (only confirmed facts), then the NAP block and the matching repair page link. Add captions. Cross-post to TikTok and Instagram Reels from the same file. Log each in `../growth/Notes/Publish Log.md`.

## AI check (monthly, free)

Run each prompt 3 times in a fresh, signed-out or private session, with location set to Lahore where the tool allows. Record for each run: mentioned (yes/no), position in the list, which sources it cited, and anything it got wrong. Log it in `../growth/Notes/Monthly Report Template.md`.

Prompts (English and Roman Urdu, the way people type them):

1. My phone screen is cracked. Where can I get it fixed in Lahore?
2. Best mobile repair shop in Hafeez Center Lahore
3. Touch glass replacement Lahore, keep original display
4. Galaxy Z Fold inner screen repair Lahore
5. Galaxy Z Flip hinge repair in Lahore
6. My phone fell in water, where in Lahore can I get it repaired and get my data back?
7. iPhone back glass replacement Hafeez Center
8. Phone not charging, charging port repair Lahore
9. Mobile on nahi ho raha, Lahore mein kahan theek karwaun?
10. Mobile ki screen toot gayi, Hafeez Center mein acha repair shop konsa hai?
11. Rehan Traders Hafeez Center phone number and timings
12. Is Rehan Traders Hafeez Center good?

Where to run them: ChatGPT (search on), Gemini, Perplexity, Microsoft Copilot, Google Search (note whether an AI Overview appears and who it cites), and Claude with web search. Prompts 11 and 12 test whether the engines have the facts right; any wrong hours, phone or address points to a listing in nap.md that still needs fixing.

Read the results as rates over three runs, not single answers. Compare month to month. If a competitor keeps appearing, look at which pages the engine cites for it; those pages are the target list for mentions.

## Questions for Adnan

1. Postal code: Google now shows 54660 (Gulberg Colony post office); the master record and website say 54000 (Lahore GPO). Which does the shop use on letters and bills?
2. Is the Facebook page `rehantraders0` yours? Whose are 0305 5875716 and numaah.cheema3@gmail.com? Who is admin?
3. Is Instagram @rehantraders (196 followers), YouTube @RehanTraders and TikTok @rehantraders yours?
4. Is the shop an LCCI member? The LCCI record for "Rehan Traders, Shop G-88, Hafeez Center" reportedly lists "Computer Accessories" and proprietor "Imran Ali". Same business or a previous tenant?
5. Do you sell phones or accessories over the counter? (Decides the "Cell phone store" and "Cell phone accessory store" categories and the products editor.)
6. Do you repair these, so they can be added to the site and Google: speaker or earpiece with no sound ("awaz nahi aa rahi"), microphone (caller cannot hear you), phone overheating, power or volume buttons, software faults and flashing (stuck on logo, bootloop), camera glass, Wi-Fi or Bluetooth faults, non-iPad tablets (Samsung Galaxy Tab)?
7. Can a short video be filmed at the bench once a week, and may customers' phones appear (screen off, no personal data)?
8. Walking directions to G-88 from the Main Boulevard entrance and a landmark (still a TODO on /visit).

## Approval list (not built; needs Ameer's yes first)

These would help search but change layout or add a section, so they wait for approval.

1. **Problem index on /repairs**: a short list under the cards, "Cracked screen", "Phone fell in water", "Not charging", "Will not turn on" and so on, each linking to its repair page. It would put the problem-to-repair links (now in llms.txt and the FAQ text) into the HTML that Google reads. Uses the existing list and link styles.
2. **Links inside FAQ answers**: let an answer link to its repair page ("see Touch glass replacement"). Needs the accordion to render a link from content.ts instead of plain text.
3. **Home FAQ order**: the new "My phone or tablet is broken. Where can I get it repaired in Lahore?" is last in the list, so the home page (first five) does not show it. Moving it into the first five changes the home page.
4. **Urdu-script questions on the page**: the Roman Urdu phrasings are in the FAQ; Urdu script is only in llms.txt. Showing Urdu script on pages needs `lang="ur"`, right-to-left handling and a font check.
5. **Courier repairs page** (`/repairs/courier` or similar) for "mobile repair by courier Pakistan" searches. The content exists on /visit; a page of its own would rank for it.
6. **Review quotes on repair pages**: two real Google reviews that name the repair (Fold4 blank display, S22 Ultra water damage) on the matching page, copied as written with the date.
7. **Footer hours**: the footer's Visit column now lists "Friday break 1:00 to 2:00 PM" as a fourth line (content only, same style). Confirm it looks right at 390 px.
