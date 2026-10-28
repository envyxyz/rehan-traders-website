---
version: alpha
name: Rehan Traders
description: A black-and-white, precise interface for Rehan Traders, a mobile and tablet repair lab at Shop G-88, Hafeez Center, Lahore. The system sits on an off-white paper canvas with ink-black type and ink-black actions; the only colour is Signal Red, used the way the logo uses it, as one sharp line. Archivo sets the headlines and numbers, Inter the body. Real photos of the open repair bench do the selling. The register is a careful lab technician who shows the work, not a loud corridor flyer.

colors:
  primary: "#0E0E0E"
  primary-active: "#2B2B2B"
  on-primary: "#F5F5F2"
  accent: "#D7141A"
  accent-active: "#B01015"
  ink: "#0E0E0E"
  body: "#1B1B1B"
  muted: "#6E6E6A"
  muted-soft: "#9A9A96"
  canvas: "#F5F5F2"
  surface-card: "#FFFFFF"
  surface-soft: "#E3E3DF"
  hairline: "#D9D9D4"
  surface-dark: "#0E0E0E"
  surface-dark-elevated: "#1B1B1B"
  on-dark: "#F5F5F2"
  on-dark-soft: "#B9B9B5"
  whatsapp: "#25D366"
  success: "#2E7D4F"
  warning: "#B7791F"
  error: "#9E1B1B"

typography:
  display-xl:
    fontFamily: "Archivo, sans-serif"
    fontSize: 64px
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: -1.8px
  display-lg:
    fontFamily: "Archivo, sans-serif"
    fontSize: 44px
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: -1.1px
  display-md:
    fontFamily: "Archivo, sans-serif"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.5px
  title-lg:
    fontFamily: "Archivo, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.2px
  title-md:
    fontFamily: "Archivo, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "Archivo, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 2.4px
  button:
    fontFamily: "Archivo, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  nav-link:
    fontFamily: "Archivo, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  xl: 28px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 88px

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 72px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 14px 24px
    height: 52px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 14px 24px
    height: 52px
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 14px 24px
    height: 52px
  floating-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 60px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: 88px
  service-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 28px
  brand-chip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  process-step:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 28px
  trust-strip:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  review-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 28px
  before-after-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: 12px
  repair-form:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
    height: 52px
  text-input-focused:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  hours-table:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  map-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 0px
  badge-pill:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface-card}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  cta-band:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.xl}"
    padding: 56px
  footer:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark-soft}"
    typography: "{typography.body-sm}"
    padding: 56px
---

## Overview

Rehan Traders sits in a corridor of Hafeez Center full of shouting flyers, green and blue brand boards and hand-taped price slips. The interface does the opposite: it looks like a clean lab bench. The base is a **paper canvas** (`{colors.canvas}` — #F5F5F2) with **ink** type (`{colors.ink}` — #0E0E0E) and **graphite** body text (`{colors.body}` — #1B1B1B). Actions are ink-black too (`{colors.primary}` — #0E0E0E). Nothing on the page competes with the photos of the work.

The one colour is **Signal Red** (`{colors.accent}` — #D7141A), the red of the T in the logo, carried over from the old badge. In the UI it behaves like the T: a single sharp line. A 4px rule above a section title, the job number, the "New" badge, the active tab underline. It is never a button fill, never a background larger than a pill, and never more than one red element in view.

The site is English (the brand is English-only); prices, phone numbers and times use Western digits. Archivo sets every headline, button, number and nav label, the same family as the wordmark. Inter sets body text and forms. Proof comes from real photos of the bench, the microscope and finished phones, never stock imagery.

**Key Characteristics:**
- Paper canvas, ink type, ink buttons. Pure white is reserved for cards (`{colors.surface-card}`), so cards lift off the page without shadows.
- Black `{component.button-primary}` for "Get a repair quote" and a green `{component.button-whatsapp}` beside it in the hero. WhatsApp is the shop's real channel.
- Red appears once per view, as a line or a number.
- Archivo 800 headlines with tight negative tracking, set short; Inter body at 16px.
- Rounded but not soft: 12px buttons, 18px cards, 28px for the repair form, CTA band and large photos, matching the brand guide and board.
- Ink bands (`{colors.surface-dark}`) for the trust strip, CTA and footer give the rhythm: paper, white cards, ink band, paper, ink CTA, ink footer.

## Colors

### Brand & Accent
- **Ink** (`{colors.primary}` — #0E0E0E): Primary buttons, links, active tabs, focus rings, the logo mark.
- **Ink Active** (`{colors.primary-active}` — #2B2B2B): Pressed state of primary buttons. On black, pressed goes one step lighter, not darker.
- **Paper on Ink** (`{colors.on-primary}` — #F5F5F2): Text and icons on ink buttons.
- **Signal Red** (`{colors.accent}` — #D7141A): The T. Section rules, job numbers, badges, the active tab underline, the logo's T. Never a fill larger than a pill.
- **Signal Red Active** (`{colors.accent-active}` — #B01015): Pressed state for the rare red control.
- **WhatsApp Green** (`{colors.whatsapp}` — #25D366): A functional colour for WhatsApp buttons only, not a brand colour.

### Surface
- **Paper** (`{colors.canvas}` — #F5F5F2): The page floor everywhere.
- **Card White** (`{colors.surface-card}` — #FFFFFF): Service cards, reviews, the repair form, the hours table.
- **Concrete** (`{colors.surface-soft}` — #E3E3DF): Brand chips, table headers, quiet bands.
- **Hairline** (`{colors.hairline}` — #D9D9D4): 1px borders on cards and inputs.
- **Ink Surface** (`{colors.surface-dark}` — #0E0E0E): Trust strip, CTA band, footer, night photo bands.
- **Graphite Elevated** (`{colors.surface-dark-elevated}` — #1B1B1B): Cards placed inside ink bands.

### Text
- **Ink** (`{colors.ink}` — #0E0E0E): Headlines and key text.
- **Graphite** (`{colors.body}` — #1B1B1B): Running text.
- **Steel** (`{colors.muted}` — #6E6E6A): Secondary text, captions, input labels.
- **Steel Soft** (`{colors.muted-soft}` — #9A9A96): Placeholders, fine print.
- **Paper on Ink** (`{colors.on-dark}` — #F5F5F2) and **Soft on Ink** (`{colors.on-dark-soft}` — #B9B9B5): Text on ink bands.

### Semantic
- **Success** (`{colors.success}` — #2E7D4F): Request sent, repair ready.
- **Warning** (`{colors.warning}` — #B7791F): Holiday or Friday-prayer notices.
- **Error** (`{colors.error}` — #9E1B1B): Form validation. Deliberately darker than Signal Red so an error never reads as decoration.

## Typography

### Font Family
**Archivo** (Google Fonts, weights 500 to 800) sets headlines, buttons, nav labels, prices, job numbers and the wordmark. **Inter** (400 to 600) sets body text and form fields. Fallbacks: `Archivo, Arial, sans-serif` and `Inter, -apple-system, Segoe UI, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 800 | 0.98 | -1.8px | Hero headline, two short lines |
| `{typography.display-lg}` | 44px | 800 | 1.04 | -1.1px | Section heads, CTA band |
| `{typography.display-md}` | 30px | 700 | 1.15 | -0.5px | Sub-sections, prices if the shop publishes them |
| `{typography.title-lg}` | 22px | 700 | 1.3 | -0.2px | Process steps, card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Service card titles |
| `{typography.body-md}` | 16px | 400 | 1.6 | 0 | Running text |
| `{typography.body-sm}` | 14px | 400 | 1.6 | 0 | Footer, table rows |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Chips, labels |
| `{typography.caption-uppercase}` | 12px | 700 | 1.4 | 2.4px | Section kickers ("TOUCH GLASS"), badges |
| `{typography.button}` | 16px | 700 | 1 | 0 | Buttons |
| `{typography.nav-link}` | 15px | 600 | 1.4 | 0 | Top navigation |

### Principles
Headlines are heavy, short and plain: "Touch glass, replaced." not "We are the best touch glass experts in Lahore!". Exclamation marks are not used. The phone number is always written `0305 8874839`, spaced, and dialled as `tel:+923058874839`. Device names keep their real spelling: iPhone, Galaxy Z Fold, Galaxy Z Flip.

## Layout

### Spacing System
- **Base unit:** 4px. Tokens: `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section}` 88.
- **Section padding:** `{spacing.section}` between bands on desktop, 56px on mobile.
- **Card padding:** 28px for service, process and review cards; `{spacing.xl}` for the repair form.

### Grid & Container
- Max content width 1120px, 12 columns, 24px gutters, 16px side gutters on phones.
- Services: 3-up desktop, 2-up tablet, 1-up phone. Process steps: 4-up, stacking on phones.
- Hero: 7/5 split, the headline and two CTAs on the left and a real photo of the bench on the right.

### Whitespace Philosophy
The lab look comes from space and alignment, like the bench in the interior concept: one idea per band, generous padding, everything on the grid, no more than two buttons in view.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | Paper canvas, no border | Page, hero |
| Card | `{colors.surface-card}` with a 1px `{colors.hairline}` border, no shadow | Services, reviews, forms |
| Band | `{colors.surface-dark}` full-width | Trust strip, CTA, footer |
| Floating | `0 10px 30px -12px rgba(14,14,14,0.45)` | Only `{component.floating-whatsapp}` |

### Decorative Depth
- The brand pattern (the mark repeated in a grid, white on ink, a few red Ts) may sit at 6 to 8% opacity in the CTA band and footer. Never behind body text.
- The supergraphic (oversized cropped marks, tone-on-tone black with one white mark) can fill one decorative tile per page.
- Subtle film grain is allowed on large photo bands only, matching the brand board.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Tiny tags, the job-number chip |
| `{rounded.sm}` | 8px | Inputs |
| `{rounded.md}` | 12px | Buttons |
| `{rounded.lg}` | 18px | Cards, tables, map |
| `{rounded.xl}` | 28px | Repair form, CTA band, large photos |
| `{rounded.pill}` | 9999px | Chips, badges |

The logo's top corners are drawn with a phone's corner radius (44 on a 256 grid, about 17% of its width). Cards and photos use `{rounded.lg}` and `{rounded.xl}` so the UI carries the same softened-device corner without copying the mark.
| `{rounded.full}` | 50% | Floating WhatsApp button, avatars |

### Photography & Illustrations
- Use real photos: the bench under the microscope, hands on an opened phone, a cracked screen next to the replaced one, the shopfront. Shoot level, in good light, customers' faces and screens with personal data out of frame.
- The AI shopfront and interior concepts in the brand guide are for client review only. Don't use them on the live site or on Google Business Profile, which needs real photos.
- No stock photos, no cracked-screen clip-art, no gear and spanner icons.

## Components

### Navigation
**`top-nav`** — 72px paper bar: the horizontal logo on the left; links (Repairs, Fold & Flip, Tablets, Reviews, Visit) in `{typography.nav-link}`; a compact `{component.button-whatsapp}` on the right. On phones it collapses to the logo, a WhatsApp icon and a menu.

### Buttons
**`button-primary`** — Ink, paper text, 52px tall, `{rounded.md}`. The label is a verb: "Get a repair quote". Pressed: `{component.button-primary-active}`.

**`button-secondary`** — White with a hairline border and ink text, for "Call 0305 8874839".

**`button-whatsapp`** — WhatsApp green with the WhatsApp glyph and ink text, opening `https://wa.me/923058874839` with a prefilled message naming the device and fault.

**`floating-whatsapp`** — A 60px circle fixed to the bottom right corner on phones only, with the one floating shadow.

### Cards & Containers
**`hero-band`** — Paper canvas: a two-line headline in `{typography.display-xl}` with a red 4px rule above it, one supporting line, the primary and WhatsApp buttons, a row of `{component.brand-chip}` items, and a real bench photo at `{rounded.xl}`.

**`service-card`** — White card, a thin ink line icon, the service in `{typography.title-md}`, two lines on what is checked or replaced, and a text link. Lead with touch glass replacement, Galaxy Z Fold and Flip repair, iPhone repair; then screens, batteries and charging, water damage and board repair, tablets.

**`brand-chip`** — Concrete pills: iPhone, Samsung, Galaxy Z Fold, Galaxy Z Flip, iPad, Samsung Tab, OnePlus, Pixel. Only brands the shop confirms.

**`process-step`** — Four white cards that show the handover kit: 1 job card and intake check, 2 repair at the open bench, 3 tested and sealed in the pouch, 4 warranty card. The step number is in `{colors.accent}`.

**`trust-strip`** — An ink band of three to four facts in `{colors.on-dark}`: the live Google rating and review count (pulled or updated, never typed once and left), opening hours, the shop address, the warranty terms once Adnan confirms them. Never show invented numbers.

**`review-card`** — A real Google review: first name, date and stars, with a link to the listing.

**`before-after-card`** — Two real photos side by side, with a caption naming the device and the fault.

**`repair-form`** — Name, phone, device model, fault (select plus free text) and preferred visit time on a white panel at `{rounded.xl}`. It submits to WhatsApp or a working endpoint; the form must have a real destination.

**`hours-table`** — Monday to Saturday 11:00 AM to 10:00 PM, Sunday closed; today's row marked with a 4px red bar on the left.

**`map-card`** — An embedded map of the verified shop pin (Shop G-88, Hafeez Center), with a "Directions" link.

### Inputs & Forms
**`text-input`** — Paper fill, hairline border, 52px tall, `{rounded.sm}`, the label above in `{colors.muted}`. Focused (`{component.text-input-focused}`): white fill, a 2px ink border and a 3px ink ring at 12% opacity.

### Badges
**`badge-pill`** — Signal Red pill with white `{typography.caption-uppercase}`, used for "New" on a service. One per view at most.

### CTA / Footer
**`cta-band`** — An ink band at `{rounded.xl}` with a short line in `{typography.display-lg}` ("Cracked glass? Bring it to G-88.") and the WhatsApp and call buttons. The pattern may sit at 6% opacity.

**`footer`** — Ink: the logo, address, hours, phone, links, and the registered business name and NTN once known. Social icons only for profiles the shop controls.

## Do's and Don'ts

### Do
- Lead with real photos of the real bench and shop.
- Keep `{colors.primary}` ink for actions and `{colors.accent}` red for one line or number per view.
- Write the phone as `0305 8874839` everywhere.
- Use Archivo for every number: prices, times, job numbers.
- Keep layouts on the grid with generous space.

### Don't
- Don't use pure white as the page background; paper is the brand.
- Don't fill buttons or bands with red; red is the T, not a theme colour.
- Don't show ratings, review counts, years in business, "100% trusted", "best price" or "original parts" unless they are real, current and provable.
- Don't use stock photos, gradients, neon or clip-art.
- Don't put the logo on busy photos without a solid panel behind it.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Phone | < 768px | Single column; hero photo below the headline; `{component.floating-whatsapp}` appears; services 1-up; reviews scroll sideways |
| Tablet | 768–1024px | Services 2-up; nav links collapse to a menu |
| Desktop | 1024–1440px | Full nav; 3-up services; 7/5 hero |
| Wide | > 1440px | Content capped at 1120px |

### Touch Targets
Buttons and inputs are 52px tall and the floating WhatsApp button 60px. Phone links are tappable (`tel:+923058874839`).

### Collapsing Strategy
Bands keep their order on phones: hero, services, process, trust strip, before and after, reviews, hours and map, CTA, footer. Grids reduce columns rather than shrinking cards.

## Iteration Guide
1. Use tokens only; no raw hex in components.
2. One primary action per band; WhatsApp is always reachable on phones.
3. One red element per view. If a second one appears, make it ink.
4. New components reuse `{rounded.lg}` cards on `{colors.surface-card}` with a hairline border.
5. When unsure, add space before adding anything else.
6. Document default and pressed states only; no hover specs.

## Known Gaps
- No real before-and-after photos yet; ask the bench to photograph jobs with the customer's permission.
- Warranty length, turnaround times and prices are not confirmed, so the trust strip and service cards leave them out until Adnan confirms them.
- Registered business name and NTN are unknown; the footer shows them once confirmed.
- The shop's Urdu voice for social posts is not designed yet; the brand is English-only for now.
- Icon set not chosen; use one line-icon family (e.g. Lucide) in ink at a 1.75px stroke.

## Website Overrides (28 Oct 2026)

Copied from `../growth/Brand/DESIGN.md` (the brand's source of truth). These overrides were approved by Ameer for the website and win over anything above. Phase 1 folds them into the token front matter.

- **Theme follows the device.** Light uses the tokens above. Dark mode: page `#0B0B0B`, panel `#151514`, card `#1E1E1D`, ink text `#F5F5F2`, body `#E6E6E2`, muted `#A4A49F`, hairline `#2E2E2C`; primary buttons invert to paper fill with ink text; Signal Red lightens to `#FF4A4F` only where it sits on a dark screen. No manual toggle.
- **Hero is an inset panel.** The hero is a rounded (`28px`) concrete panel inset `12px` from the viewport, 100svh tall, copy left and a floating CSS 3D Galaxy Z Fold right that opens from closed into a V (inner screen facing the copy) about 0.6 s after load. Reference: `design/mock/hero.html` and its screenshots. This replaces "Hero: 7/5 split with a real bench photo".
- **Buttons are pills.** Primary, WhatsApp and secondary buttons use `rounded.pill`, 52px tall in the hero, 44px elsewhere. The primary button may carry a round arrow chip on its right. Cards keep `18px`.
- **Liquid glass is a material.** Floating chrome only: the nav island, the mobile bottom bar, the chat launcher and sheets over photos. `backdrop-filter: blur(2rem) saturate(160%)`, a light-catching 1px top rim, soft depth. Solid fallback under `prefers-reduced-transparency`. Never glass on glass, never glass on body content.
- **Nav.** Top of page: logo and name left, a glass pill of links plus the phone button right. After 80px of scroll it gathers into one centred glass island: mark only, links, and the phone button as a round call icon. On phones it also hides on scroll down and returns on scroll up.
- **No kickers.** Section titles stand alone; no uppercase eyebrow labels above headings. Uppercase small caps remain for form labels and the job card only. Section numbers only where the sequence is information (the four repair steps).
- **Imagery.** Real shop photos, AI-cleaned (decluttered, same layout and people) plus matching AI close-ups, shot-on-iPhone look, are allowed on the website. Google Business Profile keeps unaltered real photos only. This replaces "AI concepts are for client review only" for the website.
- **Motion.** Content reveals on scroll (opacity + 8px rise, once). Wheel scrolling is smoothed with Lenis; touch keeps native scrolling; `prefers-reduced-motion` turns smoothing and reveals off. The h1 never animates in (it is the LCP element).
- **Signature details.** The red job number (`No. RT-0427` style) on the fold screen, the booking confirmation and the WhatsApp message; the tamper seal once, on the booking confirmation.
- **Icons.** Lucide, one stroke width (1.75), ink. WhatsApp uses its official glyph.
- **Typeface (28 Oct 2026).** The website sets everything in **Google Sans Flex** (Google Fonts, OFL), one variable file with the optical-size axis: weights 700–800 for headlines, prices and job numbers, 600–700 for buttons and nav, 400–500 for body and forms. Fallback `Arial, sans-serif`. This replaces Archivo and Inter on the website only; the logo wordmark and print kit keep Archivo.
