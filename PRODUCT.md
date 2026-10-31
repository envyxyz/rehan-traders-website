# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript, Tailwind CSS v4, shadcn/ui, Motion (Framer Motion) for subtle animation, 21st.dev components where they fit. Static export hosted free on Cloudflare Workers at rehanmobiletraders.com, with a small Worker for booking and chat. Chosen by Ameer on 28 Oct 2026 over a Vite SPA (weak SEO) and Astro (harder shadcn/21st wiring). Hosting must be free (Vercel Hobby is non-commercial); Google Cloud billing is not available.

## Users

People in Lahore with a broken or failing phone or tablet: cracked glass, dead battery, charging fault, water damage, a Galaxy Z Fold/Flip screen or hinge problem, a phone that will not boot. They arrive mostly on a phone, from Google search ("mobile repair near me", "touch glass replacement Lahore"), Google Maps, or a WhatsApp link. They are anxious about cost, about losing their data, and about being cheated with fake parts. They want to know three things fast: can you fix my model, roughly how much, and can I trust you. They read English but often write in Roman Urdu or Urdu.

## Product Purpose

Turn a visitor with a broken device into a booked visit, a WhatsApp chat, a call or a directions tap for Shop G-88, Hafeez Center. Success is one of those four actions, measured in analytics.

## Positioning

- Touch glass replacement that keeps the original display (the shop's own title: "Touch Glass Specialist").
- Saves the damaged panel first where it can (Adnan: "our main priority").
- Foldables: every Galaxy Z Fold and Z Flip generation, Pixel Fold, Surface Duo. Outer glass, inner panel, hinge.
- Board-level repair at an open bench with a microscope, inside Hafeez Center, Lahore's phone market.
- Repairing phones since 2009.
- 10,000+ certified repairs (confirmed by Ameer, 1 Nov 2026).
- 4.9 on Google from 49 reviews (31 Oct 2026). Copied from the Google listing into content.ts with its date, refreshed by hand; never rounded up or guessed.

## Operating Context

- Walk-in shop: Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore 54660. Coordinates 31.5161006, 74.3433894.
- Hours: Monday to Saturday 11:00 AM to 10:00 PM, Friday prayer break 1:00 to 2:00 PM, closed Sundays and whenever Hafeez Center closes (Eid and Ashura; national days stay open). Adnan, 31 Oct 2026: the shop opens when Hafeez Center does.
- Courier repairs from outside Lahore: yes. Create a ticket on the site or call 0305 8874839, send photos of the phone on WhatsApp. If possible the shop quotes over the phone; otherwise the shop receives the phone, inspects and quotes it, repairs it once the customer agrees, and sends it back (Adnan, 30 Oct 2026). Delivery is the customer's choice and the customer pays: inside Lahore inDrive, Yango or any other ride service, nationwide TCS (Adnan, 30 Oct 2026). Packing guidance is not confirmed.
- Warranty: not always given; discussed at the counter, and it varies with the model and the type of repair (Adnan, 31 Oct 2026). Depends on the quality of parts the customer chooses too. No length, no "lifetime", no "100%", no promise that a warranty card is always given.
- Checking: free. The shop checks the device free of cost and tells you what the issue is, whether it can be repaired, what it will cost and how long it will take (Adnan, 30 Oct 2026).
- iPhone batteries: if the customer chooses an original battery, the "Unknown Part" message can be removed and battery health shown. If the customer chooses a cheaper copy battery, the IC from the old original battery can be moved to the new one; in some very rare cases that is not possible and the shop says so after checking the phone. Batteries only: not screens, not True Tone, and no general "original parts" claim (Adnan, 30 Oct 2026).
- Water-resistance seal: re-applied after a repair on request. Never claim the phone is water resistant afterwards (Adnan, 30 Oct 2026).
- Risk during touch-glass separation: not published, by choice (Ameer, 30 Oct 2026). No page, FAQ, chat answer or llms file answers it.
- Turnaround: depends on the type of repair, parts availability, and how rare and complex the model is. A normal panel (screen) change can take as little as 60 minutes; complex devices such as Galaxy Z Folds can take up to a day. Say "as little as" and "up to"; the 60 minutes belongs to a normal panel change only (Adnan, 30 Oct 2026).
- Water damage: anywhere from 8 hours to several days, depending on how severe it is. Data recovery time depends on the situation (Adnan, 31 Oct 2026).
- Hinges: the shop repairs Galaxy Z Fold and Z Flip hinges (Adnan, 31 Oct 2026).
- Tablets: mainly iPads (Adnan, 31 Oct 2026).
- Address: Shop G-88 line confirmed by Adnan, 31 Oct 2026. The Google listing is named "Rehan Traders & Mobile Repairing Shop"; the website and brand use "Rehan Traders" (schema alternateName carries the listing name).
- Payment: all methods (cash, card, JazzCash, EasyPaisa, bank transfer).
- Customers can watch the repair and take back removed parts, on request, when the bench is not busy. Swollen batteries are disposed of safely straight away.
- Booking emails go to rehanmobiletraders@gmail.com.
- Phone and WhatsApp: 0305 8874839 (dial +923058874839). WhatsApp is the shop's real channel.
- Contact person: Adnan Ali. The shop is called Rehan Traders; nobody called Rehan is the client.

## Capabilities and Constraints

- Booking: device, fault, visit time, name and phone. Saved and emailed to the shop, then WhatsApp opens with a prefilled message.
- Quote ticket: the Describe tab on /estimate sends name, number, device, message and up to 3 photos through the booking pipeline as a quote request; the shop replies on WhatsApp.
- AI chat assistant: answers from the site's own content only. Primary model Claude Haiku via OpenRouter, fallback Gemini via Google AI Studio, final fallback a fixed reply with WhatsApp and call links. Replies in the language the customer writes in (English, Roman Urdu or Urdu script).
- Google reviews and rating: 5 real reviews copied into content.ts with an as-of date, linking to the Google listing (no Places API: no billing).
- Prices: launch in quote mode (Adnan): no price line is shown and quotes are given on WhatsApp. Never promise how fast a quote comes. One switch in content.ts flips to "From Rs X" later; panel prices move fast, so the switch must stay one line.
- All copy lives in `src/content.ts`. No copy in components.
- Theme follows the device (prefers-color-scheme). Static background. Subtle motion only, reduced-motion respected.
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO, mobile.
- English site.

## Brand Commitments

- Brand system: `../growth/Brand/DESIGN.md` (paper canvas, ink type and actions, Signal Red #D7141A as one line per view, Archivo headlines, Inter body). Dark mode is an approved extension of it.
- Logo files: `../growth/Brand/` (Device R mark, wordmark, white versions).
- Voice: plain, short, no exclamation marks. Phone always written `0305 8874839`. Device names spelled right: iPhone, Galaxy Z Fold, Galaxy Z Flip.
- Imagery: real shop photos, AI-cleaned (decluttered, same layout, same people), plus AI close-ups that match them. They must look shot on an iPhone. Decided by Ameer on 28 Oct 2026; the shop will be made to match the cleaned photos. Google Business Profile keeps unaltered real photos only.
- Consistent line icons, one family, one stroke width.

## Evidence on Hand

- Real photos: `../growth/Photos/Originals/` (12, 20 Oct 2026) and retouched set `../growth/Photos/Edited/`.
- Google: 4.9 from 49 reviews. Reviews mention a Galaxy S22 Ultra water-damage fix with data recovered and a Galaxy Z Fold4 blank display fix.
- Service list: `../growth/Documents/Business Profile.html` section 02.
- Adnan's answers of 28 Oct 2026: `docs/PRD.md` §11.
- Not confirmed, never invent: prices, warranty length in days or months or its terms, any turnaround beyond the 30 Oct 2026 answer, number of repairs, registered name/NTN, courier packing guidance, general original-parts claims, anything on the risk of touch-glass separation.

## Product Principles

1. Answer "can you fix it, how much, can I trust you" before anything else.
2. Every page has one obvious next step, and WhatsApp is always one tap away on a phone.
3. Proof over claims: real photos, live reviews, named devices and faults.
4. Familiar beats clever: a repair site's expected structure, executed better than the corridor's flyers.
5. Fast on a mid-range Android on 4G.

## Accessibility & Inclusion

WCAG 2.2 AA. Touch targets at least 44px. Works on low-end Android and slow mobile data. Readable for customers whose first language is Urdu: short sentences, plain words.
