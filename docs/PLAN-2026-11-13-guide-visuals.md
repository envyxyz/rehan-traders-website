# Guide visuals: infographics and a 3D phone (plan, 13 Nov 2026)

Goal: more search traffic and longer visits on the seven guides, without breaking the Lighthouse 95 budget or the no-invented-facts rule.

## What ranks and what does not

- Google indexes images and the text around them. It does not rank a page for having WebGL. So the **infographic carries the SEO** and the **3D model is for engagement**, loaded only when asked for.
- Every visual is built from facts already in the guide (`guides` in `src/content-large.ts`). No new claims, numbers or parts lists.

## 1. Infographics (one per guide)

- Inline SVG in the server HTML, drawn with tokens (ink, paper, hairline, one Signal Red line), Archivo labels. No JS, no layout shift (fixed aspect box).
- `<figure>` with a `<figcaption>`; the SVG has `<title>` and `<desc>`. Labels come from `content-large.ts` (a `figure` field per guide).
- A PNG of the same drawing (1200 wide) in `public/guides/` for Google Images, used as the Article schema `image` and the guide's OG image.
- Subjects, from each guide's own table or steps:

| Guide | Infographic |
|---|---|
| cracked-screen-glass-or-full-screen | Screen layers: outer glass, display panel; which damage sits in which layer |
| lines-on-phone-screen | What you see to what is damaged (the guide's table as a diagram) |
| phone-fell-in-water | Do and do not, in order (the guide's steps) |
| phone-not-charging | Check order: cable, charger, port, battery, board |
| battery-draining-fast | Settings or wear: the two paths |
| phone-not-turning-on | What to try, then when it is the board |
| touch-not-working | Glass, touch layer or panel: which sign points where |

## 2. One 3D phone, seven highlights

- One procedural three.js model (boxes and rounded shapes, no downloaded asset, no textures): glass, display panel, frame, battery, board, charging port. It opens into layers; each guide highlights its part (`part` field per guide).
- Lives under the infographic as "See it in 3D": a static poster (rendered PNG) and a button. three.js loads on tap only, through the same loader as `fold-3d.tsx`. Reduced motion: no auto-rotate. No WebGL: the poster stays.
- Budget: 0 KB added to first load; LCP and CLS unchanged; Lighthouse mobile 95+ on a guide before and after.

## 3. Who does what

| Step | Model |
|---|---|
| This plan; the base 3D model (`src/components/phone-scene.ts`, parts and open/close) | Fable |
| Refine the model (proportions, materials, highlight states), QA every label and caption against `PRODUCT.md` and the guide text | Opus |
| The seven SVG infographics, one subagent per guide, from a spec with the labels fixed | Sonnet subagents |
| Research: what the top 5 results show for each guide's query (image types, alt text), draft alt text and captions, second-opinion review of the finished pages | agy, in the background |

## 4. Order

1. agy research jobs (7, parallel) while Fable builds the base model.
2. Fable: base model plus one infographic (cracked screen) as the pattern. **Ameer approves a screenshot before the other six.**
3. Sonnet: the other six infographics. Opus: model refinement and content QA.
4. Schema `image`, OG images, sitemap image entries, `llms.txt` unchanged.
5. Checks: typecheck, lint, build, axe on all guides (light and dark), Lighthouse on two guides, `snapshot.mjs` and `diff.mjs` against today's live snapshot, banned-claims grep.
6. One commit, push, confirm live; then Search Console "Request indexing" for the seven guides (Ameer).
