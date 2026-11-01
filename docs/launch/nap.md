# NAP audit: name, address, phone, hours

Latest check: `../growth/Reports/2026-10-31 NAP Report/NAP Report.md`, which supersedes this table where they differ (mobilemarket.pk is classifieds, hafeez-center.com.pk has no shop directory, BusinessList.pk is paid, Instagram is @rehantraders.lab).

Checked 31 Oct 2026 (Phase 10, branch `p10-search`). Sources: headless browser visits to each listing (logged out, Lahore location), agy Google searches, and the earlier checks in `../.agency/raw/` (19 and 23 Oct). Screens and page text are in the session scratchpad, not in the repo.

## Canonical NAP (copy exactly)

The master record is `../growth/Documents/Business Profile.html`, section 00. These values match it and `src/content.ts`, plus the facts Adnan confirmed on 30 and 31 Oct (PRODUCT.md).

```
Rehan Traders
Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore 54660, Pakistan
0305 8874839   (international +92 305 8874839, WhatsApp https://wa.me/923058874839)
https://rehanmobiletraders.com
Monday to Saturday 11:00 AM to 10:00 PM. Friday prayer break 1:00 to 2:00 PM. Sunday closed.
Closed only when Hafeez Center closes, such as Eid and Ashura.
```

For address forms: line 1 `Shop G-88, Ground Floor, Hafeez Center`, line 2 `Main Boulevard, Block E1, Gulberg III`, city `Lahore`, province `Punjab`, postal code `54660`, plus code `G88V+C9 Lahore`, coordinates `31.5161006, 74.3433894`.

Name rules:
- "Rehan Traders" everywhere we control. The Google listing keeps "Rehan Traders & Mobile Repairing Shop" until the new sign is up (`../growth/Notes/Brand Name and Signs.md`); the site's JSON-LD carries it as `alternateName`, so the two are tied together. Do not add more keywords to any listing name.
- Hours on platforms with split hours: Friday as two periods, 11:00 AM to 1:00 PM and 2:00 PM to 10:00 PM.
- Category wording: "Mobile phone repair shop" (Google), "Mobile Phone Repair" or nearest elsewhere.
- Only 0305 8874839 goes on listings. Other numbers seen (0305 5875716 on Facebook, 0300 4058072 on the door sticker, 042 37240621 on LCCI) are not used until Adnan says whose they are.

## Listings found

Status: **matches**, **wrong** (something shown is incorrect), **missing** (a field is blank or the listing does not exist), **unverified** (seen only in a search snippet or blocked; open it by hand before acting).

| # | Where | URL | Name shown | Address shown | Phone shown | Hours shown | Website | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Google Business Profile / Maps | https://maps.google.com/?cid=7044160813583291979 | Rehan Traders & Mobile Repairing Shop | Shop G88, Hafeez Center, Block E1 Block E 1 Gulberg III, Lahore, 54660, Pakistan | +92 305 8874839 | Mon to Sat 11 AM to 10 PM, Sun closed; Friday shown as 11 AM to 10 PM with no break; no special hours | rehanmobiletraders.com | **wrong**: address form (G88, "Block E1 Block E 1", no Ground Floor, no Main Boulevard, 54660), Friday break missing. Name accepted for now. Phone and site match. 4.9 from 49 reviews |
| 2 | Facebook page | https://www.facebook.com/rehantraders0/ | Rehan trader | Lahore Hafeez center, Lahore, Pakistan | 0305 5875716 (WhatsApp +92 305 5875716) | Always open | none | **wrong**: name, phone, hours; address incomplete; website missing; email numaah.cheema3@gmail.com unknown; 374 followers; last visible post 1 May 2022 |
| 3 | Apple Maps | https://maps.apple.com/place?place-id=I9DA0DCFDCE5841F1 | Rehan Traders & Mobile Repairing Shop | Main Boulevard Gulberg, Gulberg, Pakistan | +92 305 8874839 | 11:00 AM to 10:00 PM | none | **wrong**: address incomplete (no shop, building or Lahore), no website, no Friday break. Unclaimed ("Claim This Place"). Category "Mobile Phone Repair Service" |
| 4 | Bing Maps | https://www.bing.com/maps?q=Rehan+Traders+%26+Mobile+Repairing+Shop+Lahore | Rehan Traders & Mobile Repairing Shop | not shown on the card | +92 305 8874839 | Mon to Sat 11 am to 10 pm, Sun closed; no Friday break | not shown | **wrong**: Friday break; website missing. Data comes from a data partner (TomTom map); not claimed in Bing Places as far as we know |
| 5 | Website | https://rehanmobiletraders.com | Rehan Traders | canonical form, 54000 | 0305 8874839 | canonical, with Friday break and closures | itself | **matches** (after this branch: footer now shows the Friday break; holiday wording says the shop closes only when Hafeez Center does) |
| 6 | Instagram @rehantraders | https://www.instagram.com/rehantraders/ | Rehan Traders | none | none | none | none | **missing / unverified owner**: 196 followers, 320 following; owner not confirmed |
| 7 | Instagram @rehantraders0 | https://www.instagram.com/rehantraders0/ | "Profile isn't available" (19 Oct) | | | | | **missing** |
| 8 | TikTok @rehantraders | https://www.tiktok.com/@rehantraders | rehan traders | none | none | none | none | **missing / unverified owner**: 0 followers, no bio, no videos |
| 9 | YouTube @RehanTraders | https://www.youtube.com/@RehanTraders | Rehan Traders | none | none | none | none | **missing / unverified owner**: no content, joined 17 May 2023 |
| 10 | Yandex Maps | (19 Oct check, `.agency/raw/social/findings.md`) | Rehan Traders & Mobile Repairing Shop (agy snippet) | "Service Road, Block E-1, Gulberg III, Lahore" (agy snippet) | +92 3058 87 48 39 | not seen | not seen | **unverified**: phone matched on 19 Oct; the address in agy's snippet is wrong if real. The 31 Oct browser check landed on the wrong city map |
| 11 | Cybo | cybo.com (blocked by a bot check; agy snippet only) | "New Al-Rehman Traders" (agy snippet) | Shop No. G-88, Hafeez Center, Block E-1, Gulberg III, Lahore, 54000 | 0305 8874839 | not seen | rehanmobiletraders.com (agy snippet) | **unverified, probably wrong name**: open it in a normal browser |
| 12 | LCCI member directory | lcci.com.pk (blocked; 19 Oct check and agy snippet) | REHAN TRADERS | Shop No. G-88, Hafeez Center, Main Boulevard, Gulberg-III, Lahore | +9-242-37240621 (19 Oct) | | | **unverified, likely a different record**: agy's snippet gives the business line "Computer Accessories" and proprietor "Imran Ali", and ties 042 37240621 to another company (Logicman (Pvt) Ltd). Ask Adnan before touching it |
| 13 | Door sticker on the shop | photo, 20 Oct | Rehan Traders, Touch Glass Specialist | | 0300-4058072, 0305-8874839 | | | **wrong**: second number. agy found 0300-4058072 tied to a furniture showroom in old records (snippet, unverified) |
| 14 | Shop signboard | photo, 20 Oct | TAB HOUSE & REHAN TRADERS LAB, G-88 | | | | | **wrong name form**, shared board; replacing it is in `Brand Name and Signs.md` |
| 15 | Waze | waze.com live map | not found in the web map search | | | | | **missing** (Waze in Pakistan mostly reads Google; nothing to do unless it shows wrong data in the app) |
| 16 | Foursquare | foursquare.com | login wall | | | | | **unverified** |
| 17 | Yellow Pages PK, OLX, BusinessList.pk, Lookup.pk, Hamariweb | | not found in agy's searches | | | | | **missing** |

Other businesses called "Rehan Traders" in Lahore (bookstore, stone supplier, paper store, building supply) show up on Google and Bing next to this shop. They are not duplicates; leave them alone. Keeping "Hafeez Center" and "Mobile Repairing" visible in our listings is what separates us.

## Ranked fix list

| # | Fix | Steps | Who |
|---|---|---|---|
| 1 | Google address line | Business Profile > Edit profile > Location > Address. Line 1 `Shop G-88, Ground Floor, Hafeez Center`, line 2 `Main Boulevard, Block E1, Gulberg III`, city `Lahore`, postal code per fix 2. Keep the pin where it is (it is right). Save; edits can take up to 3 days and may ask for a check | Ameer (has access) |
| 2 | Decide the postal code | Google now shows 54660 (Pakistan Post's code for Gulberg Colony, per the Zameen postal code list); the master record, the website and the 19 Oct Google listing used 54000 (Lahore GPO). Ask Adnan what is on his bills. If 54660: change `postalCode` in `src/content.ts` (one line, flows to the site, JSON-LD and llms files) and the master record, then use 54660 everywhere. If 54000: set Google back to 54000 in fix 1 | Adnan answers, Ameer applies |
| 3 | Google Friday break and holiday closures | Edit profile > Hours > Friday > Add hours: 11:00 AM to 1:00 PM and 2:00 PM to 10:00 PM. Special hours: add Closed for each Eid and Ashura date as soon as it is announced (next: Eid ul Fitr, around 10 to 12 Mar 2027) | Ameer |
| 4 | Facebook page | Adnan logs in (or adds Ameer as admin under Settings > Page access). Edit Page info: name `Rehan Traders` (Facebook allows a page name change once Meta approves it), category `Mobile phone repair shop`, address `Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore`, phone `0305 8874839`, WhatsApp `+92 305 8874839`, website `https://rehanmobiletraders.com`, email `rehanmobiletraders@gmail.com`, hours as canonical (Friday as two periods). If nobody knows the login, ask Meta for page access with proof of the business; do not make a second page until that fails | Adnan (owner login) |
| 5 | Door sticker | Reprint with 0305 8874839 only (the print kit in `../growth/Brand/Print/` already uses it) | Adnan |
| 6 | Apple Maps | Claim the card (see "Free citations" below). Set address, website, Friday hours | Ameer, with Adnan's documents |
| 7 | Bing | Claim through Bing Places (below), which also fixes the Friday break and adds the website | Ameer |
| 8 | Cybo | Open the listing in a normal browser. If it says "New Al-Rehman Traders" with our phone, use Cybo's "Edit" or "Claim" link to set the canonical NAP | Ameer |
| 9 | LCCI | Ask Adnan whether the shop is an LCCI member. If yes, ask LCCI to update the record to the canonical NAP and 0305 8874839. If the record belongs to an earlier G-88 business, leave it | Adnan |
| 10 | Yandex | Open yandex.com/maps, search "Rehan Traders" with the map on Lahore. If the address says "Service Road", use "Suggest a change" (no login needed) | Ameer |
| 11 | Instagram, TikTok, YouTube handles | Adnan says which are his. For each that is his: bio line `Mobile & Tab Repair Lab · Shop G-88, Hafeez Center, Lahore · 0305 8874839`, link to the website. Once the Facebook page is fixed and the handles are confirmed, add them to `site.sameAs` in `src/content.ts` | Adnan answers, Ameer edits |
| 12 | Master record | Update `../growth/Documents/Business Profile.html` (section 00): address status Confirmed (Adnan, 31 Oct), Website `https://rehanmobiletraders.com`, Friday prayer break 1:00 to 2:00 PM, holidays "Closed only when Hafeez Center closes, such as Eid and Ashura", review link `https://g.page/r/CUvWWzrw4sFhEBE/review`. (This agent could not write outside the website repo.) Then fill in `../growth/Notes/Citations.md` as listings are fixed | Ameer |

## Free citations worth creating or claiming

In order of value for Lahore customers and for AI engines.

1. **Bing Places for Business** (bingplaces.com). Sign in with the shop Google account (`rehanmobiletraders@gmail.com`), choose "Import from Google Business Profile", pick the listing, review the fields, finish. Imported listings that are verified on Google usually skip Bing's own verification. If Pakistan is not offered in the country list (Bing's coverage for Pakistan could not be confirmed from an official page), stop: Bing Maps already shows the shop from its data partner, and Bing Webmaster Tools (search-plan.md) still gets the website into Bing.
2. **Apple Business Connect** (businessconnect.apple.com). Sign in with an Apple Account (create one on the shop Gmail), Locations > Add, search "Rehan Traders & Mobile Repairing Shop", pick the existing card (place id `I9DA0DCFDCE5841F1`), claim it. Enter the canonical NAP, category Mobile Phone Repair, website, hours with the Friday split. Apple verifies by phone call to 0305 8874839 or by documents (utility bill or shop lease); Adnan has to answer or supply them. Apple's country list for Business Connect could not be confirmed; if Pakistan is refused, use "Report an issue" in Apple Maps on an iPhone to fix the address and website instead.
3. **Facebook page** (fix 4). It is a citation and the second-most-seen profile.
4. **WhatsApp Business profile** on 0305 8874839, if the shop uses the WhatsApp Business app: business name `Rehan Traders`, category, address, hours, website, email. Adnan's phone.
5. **Hafeez Center directories**: `hafeez-center.com.pk` and `mobilemarket.pk` list Hafeez Center shops by number (agy found them on 31 Oct; check each page before contacting). Ask to be added with the canonical NAP.
6. **Cybo** (claim or correct, fix 8) and **Yandex** (fix 10): correct what exists rather than create new.
7. **BusinessList.pk**: has a free "Get Listed" option and an "Update info" button on listings (agy snippet; check that the free tier still exists before signing up; skip any paid plan).
8. **Foursquare** (foursquare.com/add-place or the Swarm app): add the place with the canonical NAP. Some map apps license Foursquare data.

Skip: paid listing plans, "submit to 100 directories" services, and any directory that wants a different name or a landline we cannot answer. Each new listing goes in `../growth/Notes/Citations.md` with its URL and the date it was checked.
