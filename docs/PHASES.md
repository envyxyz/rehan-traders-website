# Phases

Plan and copy-ready prompts per phase: https://claude.ai/artifact/3J3dAkumQ1ZvSG9zDyqWoF (private to Ameer).

Order: 1 Foundation (+ 2 Imagery in parallel) → 3 Chrome and hero → 4 Homepage → 5 Booking (+ 6 AI in parallel, merge 5 first) → 7 Inner pages → 8 SEO → 9 Tests → 10 Go live → 11 After launch.

Each phase appends a dated entry below: what shipped, what is left, decisions made.

## Log

### 2026-10-28 · Phase 0: research and planning
- Shipped: competitor and Lahore SEO research (`docs/research/`), PRD with sitemap (`docs/PRD.md`), design direction and contract (`docs/DESIGN-DIRECTION.md`, `.impeccable/surfaces/`), `PRODUCT.md`, `DESIGN.md` with Website Overrides, approved hero and nav mock (`design/mock/`), repo rules (`CLAUDE.md`), private repo.
- Decided: Next.js on Vercel; booking = slot + Sheet + WhatsApp handoff; AI = Claude Haiku via OpenRouter → Gemini → fixed reply; reviews via Places API daily; `priceMode` switch; English site, chat mirrors the customer's language; hero v3 (inset panel + CSS 3D Galaxy Z Fold opening into a V); nav island; liquid glass on floating chrome only; signatures = red job number + tamper seal; scroll reveals + Lenis.
- Left / blocked: OpenRouter key in `.env.local`; 21st.dev MCP authorisation; Google Cloud key (Places + Static Maps); AI Studio key; Apps Script deploy access; hosting plan (Vercel Hobby is non-commercial); registrar DNS access; Adnan's 12 open questions (`docs/PRD.md` §11).

### 2026-10-28 · Phase 0 update: hosting, Google billing, Adnan's answers
- Decided: hosting is Cloudflare Workers free plan (static export + a small Worker for `/api/*`); Vercel dropped. No Google Cloud billing, so no Places API or Static Maps: reviews are typed into `content.ts` with an as-of date, and `/visit` gets a tap-to-load Google Maps embed. Domain stays at Hostinger; nameservers move to Cloudflare at go-live. `priceMode` launches as `'quote'`. Adnan's answers recorded in `docs/PRD.md` §11.
- Shipped: shot list with AI example photos (`design/shot-examples/`, plan PDF). Plan Artifact prompts updated for the above. Phase 1 (running) told to build for static export.
- Left: warranty, turnaround, registered name/NTN, courier terms, "iPhone Duo" check (`docs/PRD.md` §12); real photos from the shot list.
