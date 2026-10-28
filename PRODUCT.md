# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript, Tailwind CSS v4, shadcn/ui, Motion (Framer Motion) for subtle animation, 21st.dev components where they fit. Hosted on Vercel at rehanmobiletraders.com. Chosen by Ameer on 28 Oct 2026 over a Vite SPA (weak SEO) and Astro (harder shadcn/21st wiring).

## Users

People in Lahore with a broken or failing phone or tablet: cracked glass, dead battery, charging fault, water damage, a Galaxy Z Fold/Flip screen or hinge problem, a phone that will not boot. They arrive mostly on a phone, from Google search ("mobile repair near me", "touch glass replacement Lahore"), Google Maps, or a WhatsApp link. They are anxious about cost, about losing their data, and about being cheated with fake parts. They want to know three things fast: can you fix my model, roughly how much, and can I trust you. They read English but often write in Roman Urdu or Urdu.

## Product Purpose

Turn a visitor with a broken device into a booked visit, a WhatsApp chat, a call or a directions tap for Shop G-88, Hafeez Center. Success is one of those four actions, measured in analytics.

## Positioning

- Touch glass replacement that keeps the original display (the shop's own title: "Touch Glass Specialist").
- Samsung Galaxy Z Fold and Z Flip repair: outer glass, inner panel, hinge.
- Board-level repair at an open bench with a microscope, inside Hafeez Center, Lahore's phone market.
- 4.9 on Google from 47 reviews (23 Oct 2026). Always pulled live, never typed in.

## Operating Context

- Walk-in shop: Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore 54000. Coordinates 31.5161006, 74.3433894.
- Hours: Monday to Saturday 11:00 AM to 10:00 PM, Sunday closed.
- Phone and WhatsApp: 0305 8874839 (dial +923058874839). WhatsApp is the shop's real channel.
- Contact person: Adnan Ali. The shop is called Rehan Traders; nobody called Rehan is the client.

## Capabilities and Constraints

- Booking: device, fault, visit time, name and phone. Saved and emailed to the shop, then WhatsApp opens with a prefilled message.
- AI chat assistant: answers from the site's own content only. Primary model Claude Haiku via OpenRouter, fallback Gemini via Google AI Studio, final fallback a fixed reply with WhatsApp and call links. Replies in the language the customer writes in (English, Roman Urdu or Urdu script).
- Google reviews and rating via Places API, refreshed daily.
- Prices: one switch in content.ts between "From Rs X" (placeholders now) and "Get a quote in 5 minutes". Panel prices move fast; the switch must stay one line.
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
- Google: 4.9 from 47 reviews. Reviews mention a Galaxy S22 Ultra water-damage fix with data recovered and a Galaxy Z Fold4 blank display fix.
- Service list: `../growth/Documents/Business Profile.html` section 02.
- Not confirmed, never invent: prices, warranty length, turnaround times, year founded, number of repairs, registered name/NTN, original-parts claims.

## Product Principles

1. Answer "can you fix it, how much, can I trust you" before anything else.
2. Every page has one obvious next step, and WhatsApp is always one tap away on a phone.
3. Proof over claims: real photos, live reviews, named devices and faults.
4. Familiar beats clever: a repair site's expected structure, executed better than the corridor's flyers.
5. Fast on a mid-range Android on 4G.

## Accessibility & Inclusion

WCAG 2.2 AA. Touch targets at least 44px. Works on low-end Android and slow mobile data. Readable for customers whose first language is Urdu: short sentences, plain words.
