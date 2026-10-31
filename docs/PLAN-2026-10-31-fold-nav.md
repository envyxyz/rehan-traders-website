# Plan, 31 Oct 2026: 3D fold, phone header, no sticky bar

Ameer's request, in one place. Smallest change that does each job; no new abstractions.

## 1. Hero fold in three.js (`src/components/fold-3d.tsx`)

- Replace the CSS fold with a three.js Galaxy Z Fold6 (Navy, as the reference photo): two halves with rounded bodies, metal frame, hinge, matte textured back, vertical triple camera with flash, cover screen, punch holes. Real proportions (open 132.6 x 153.5 x 5.6 mm, closed 68.1 x 153.5 x 12.1 mm).
- Lighting from three's `RoomEnvironment` (no HDR download). Renderer alpha, DPR capped at 2, renders only while on screen.
- Inner screen: a canvas texture drawn at runtime from `jobCardContent` (same layout as `JobCard`: ink column with the mark, paper side with name, QR, phone, fields), with the status bar from `hero.fold`. Copy stays in `content.ts`.
- Click (or Enter/Space, it is a `<button>` labelled from `hero.fold.close`/`open`): inner screen fades, halves fold shut, a short snap plays (Web Audio, synthesised, no file), then the cover screen wakes with the RT mark glowing very slowly. Click again: cover goes dark, phone opens, inner screen fades back in.
- Desktop: tilts towards the mouse while it is over the fold, like the job card. Phone: tilts with the gyroscope (`src/lib/tilt.ts`; iOS asks on the first tap).
- Reduced motion: no tilt, no gyroscope, state changes without the long animation.
- Performance: three.js (about 150 KB gzip) is never in the first load. The hero shows a pre-rendered poster image of the same scene (made by a Playwright script from the real canvas) until the first pointer move, touch, scroll or key press; then three loads and the canvas fades in over the poster. No WebGL: the poster stays. Old `.fold-*` CSS and unused `hero.jobCard` copy are removed.

## 2. Phone header and menu (below `lg`; desktop unchanged)

- Normal header: the RT mark top left (home link), a three-line menu button top right. No island, no call button. Transparent at the top of the page, solid with a hairline once scrolled. Hides on scroll down and returns on scroll up by sliding on the y axis.
- Menu: sheet slides in from the right, then the items fade in one after another. Repairs is a button with a `>` chevron that opens a sub-list (Back, All repairs, then the eight repairs). Call and WhatsApp (and Book a visit) sit at the bottom of the sheet.

## 3. No sticky bar

- Delete `StickyBar` (Book a visit and WhatsApp pill) from every page. The chat button no longer moves for it.

## 4. Job card

- Home: no tamper seal (the RT stamp). `/about` keeps it.
- Phones: tilts with the gyroscope, same feel as the mouse tilt on desktop.

## How the work is split

| Agent | Model | Job |
|---|---|---|
| Fold | Opus (fork) | Section 1, poster script, hero wiring, old CSS removal |
| Nav | Sonnet | Sections 2 and 3, nav and phone e2e tests |
| Job card | Sonnet | Section 4 |
| Antigravity manager | Sonnet, drives `agy` | Fold6 design reference for the fold agent; second-opinion review of the diff at the end |
| Baseline | Sonnet, own worktree | Lighthouse on `main` before any change, for comparison |
| QA | Sonnet | Build, lint, typecheck, e2e, axe, Lighthouse against the baseline, screenshots (1440 and 390, light and dark) |

Rules for every agent: `CLAUDE.md` hard rules (copy in `content.ts`, tokens only, one red per view, 44 px targets, reduced motion). One shared dev server on :3000; agents do not run `pnpm build` or `pnpm dev` (QA does the build). Typecheck with `pnpm exec tsc --noEmit`, lint with `pnpm lint`.

## Done when

- `pnpm build`, `pnpm lint`, `pnpm typecheck` pass; e2e and axe pass.
- Lighthouse on home, `/about`, `/repairs`, `/visit`: no category lower than the baseline, home script budget unchanged (three.js is not in the first load).
- Screenshots shown to Ameer; a note in `docs/PHASES.md`; one commit after Ameer approves.
