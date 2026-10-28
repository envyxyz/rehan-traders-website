# Design direction

Approved by Ameer, 28 Oct 2026, after three hero rounds. Visual reference: `design/mock/hero.html` (open it, scroll it) and its screenshots in `design/mock/`. Tokens and rules: `DESIGN.md` (brand system + Website Overrides). This file holds the decisions behind them.

## Direction contract (homepage)

**THESIS.** The site is the shop's job card, not a repair-template landing page. It refuses the category default of a dark hero with a stock cracked phone and a wall of equal icon cards.

**OWN-WORLD.** Paper canvas, ink type and ink pill buttons, one Signal Red line or number per view. Concrete inset panels with 28px corners. Liquid glass only on floating chrome. Archivo 800 headlines, Inter body. AI-cleaned real photos of the G-88 bench. The red job number and the tamper seal are the brand's marks of care.

**STORY.** The visitor sees a fold phone open on a booked job card, reads "Cracked glass? Fixed at G-88.", finds the rating, phone and open status without scrolling, and books or WhatsApps. Lower down: cards prove what is fixed, the before/after proves the result, four steps show the job card process, live Google reviews close the doubt.

**FIRST VIEWPORT.** 100svh inset concrete panel. Left column, vertically centred: Google stars + "4.9 on Google · 47 reviews", 44px red rule, h1 (Archivo 800, about 62px desktop / 36px phone), one-line lede, Book a visit (ink pill with arrow chip) + WhatsApp (green pill), then phone (bold), "Shop G-88, Hafeez Center", open status. Right column: CSS 3D Galaxy Z Fold, closed on load showing its cover screen, opening into a V at about 0.6 s with its inner screen facing the copy, a job card (No. RT-0427, device, fault, visit, "Booked at G-88") spanning the crease, a soft floor shadow, a slow 6 s hover. Nav floats over the panel: logo left, glass pill of links + phone button right.

**FORM.** Job card journey, dealt lead (position 4 of 7 on the grounded list), with the before/after slider from position 5 folded into the homepage and the repair estimator from position 1 as `/estimate`. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Why these choices

- **Familiar skeleton (Jakob's Law).** Hero with action, services, proof, process, reviews, location, FAQ, CTA, footer. Visitors find everything where other repair sites put it.
- **Fitts's Law.** Primary actions are 52px pills near the thumb on phones (hero, sticky bottom bar). Call is one tap from the nav at all times.
- **Gestalt.** Proximity groups proof, headline and actions in one column; the fold faces the copy so the eye returns to the headline (common fate / direction); the inset panel encloses the first viewport as one figure.
- **Hick's Law.** Two buttons per view at most. Booking asks one thing per step.
- **Whitespace.** One idea per band, 88px between bands on desktop (56px on phones), content max 1120px (hero panel up to 1536px).
- **Performance.** The hero has no raster image: the fold is CSS 3D, so the h1 is the LCP element and paints immediately.

## Motion grammar

One authored moment (the fold opening), then quiet.
- Fold: closed → open over 1.4 s, `cubic-bezier(.65,0,.35,1)`, starts 0.6 s after load; idle hover ±6px over 6 s. Reduced motion: shown open, no hover.
- Copy: proof, lede, buttons and contact rise 8px and fade in, 0.7 s `cubic-bezier(.16,1,.3,1)`, 80 ms stagger. The h1 does not animate.
- Scroll reveals: each section's content fades and rises 8px once when 15% visible. No per-card choreography beyond a 60 ms stagger in grids.
- Nav: top bar → island with Motion `layout` (spring, bounce 0, ~0.35 s); hide/show on phones with translateY.
- Buttons: press scale 0.97, 100 ms, on pointer-down.
- Sheets (booking, menu, chat): spring in from their trigger's edge, leave the same way.
- Lenis: wheel smoothing (lerp ~0.1), off on touch and under reduced motion.
- Animate transform and opacity only, plus blur on glass entrances.

## Component inventory

Primitives (shadcn, restyled to tokens): Button (ink, line, whatsapp, glass; md/lg; icon-only), Badge/Chip, Card, Sheet/Drawer, Dialog, DropdownMenu, Command (device search), RadioGroup (fault and time chips), Accordion, Tooltip, Toast (sonner), Input, Label, Form messages. Scrollbars and selection themed in CSS.

Composed: Container, Section, Nav (top/island/mobile), MobileMenu, Footer, StickyBar (phones), ChatLauncher + ChatPanel, Fold3D, JobCard, TamperSeal, ServiceCard (image, title, description, price line, Book button), BeforeAfter, ProcessSteps, ReviewCard + Rating, OpenStatus, HoursTable, MapCard, CtaBand, FaqList, BookingFlow, Estimator, PriceLine.

21st.dev: pull candidates for BeforeAfter, Accordion, and the nav island; restyle to tokens, never ship their default look.

## Imagery plan

Look: shot on iPhone 15 Pro main camera, natural Smart HDR, slight grain, true colour, no gloss, no text or logos added. Real people only where the real team is in the source photo. The shop stays the same; only clean-ups.

| Shot | Source | Use |
|---|---|---|
| Microscope bench, 2K, bench clear lower-left | `growth/Photos/Edited/..._03_microscope-bench.jpg` (cleaned v1 in `design/mock/hero-clean.jpg`) | About, board repair, OG image |
| Workbench with team, decluttered | `..._02_workbench-team.jpg` | About, How a repair works |
| Microscope station | `..._06_microscope-station.jpg` | Board repair |
| Parts drawers, tidy | `..._07_parts-drawers.jpg` | About |
| Machine corner (laminator) | `..._08_machine-corner.jpg` | Touch glass |
| Storefront, touch-ups only | `..._01_storefront.jpg` | Visit |
| Close-ups (new): glass separation, Fold inner panel, iPhone back glass, battery swap, charging port, wet board cleaning, tablet screen | generated to match the bench | Service cards and pages |
| Before/after pair | placeholder generated; replace with a real job before launch | Homepage slider |

Pipeline: `scripts/images.mjs` sends source + prompt to an OpenRouter image model, writes `public/images/<name>-<width>.avif|webp` at fixed widths and a `<name>.json` sidecar with the exact prompt and source (provenance). Pages use those files with `srcset` (static export, no image optimizer).

New photos: Ameer shoots them from the shot list (plan PDF, AI examples in `design/shot-examples/`). Real shots replace generated close-ups wherever they exist; the before/after pair must be real.

## Later options

- Photoreal fold: React Three Fiber + licensed GLB, lazy-loaded after LCP, CSS fold as fallback. Adds 150 to 300 KB and about a day. Or an image-sequence fold, or a different hero. Decide after launch metrics.
