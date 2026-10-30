# Go-live plan: domain, Cloudflare, search (30 Oct 2026)

Two tracks. **A** is code in this repo (done by an agent, one commit). **B** is dashboard work in Cloudflare, Hostinger, Google and Bing (done by Ameer or Claude in Chrome, in this order, because most of it needs the zone to be Active first).

## A. Code

### A1. Remove "Get a quote in 5 minutes" everywhere (it came back after Phase 4 removed it)
- `src/content.ts`: delete `price.quote`. `actions.quoteSent` → "Ticket created. We'll send your quote on WhatsApp." FAQ "How can I get a quote for my screen?" answer → "Message us on WhatsApp with your exact model and we'll send you a quote." `bookLede` → "Book a visit to Shop G-88 or ask for a quote on WhatsApp."
- `src/components/price-line.tsx`: render nothing unless `priceMode === "from"` and a price exists. Remove the `PriceLine` use from `service-card.tsx`, `/repairs` and `/repairs/[slug]` while `priceMode` is `'quote'` (keep the component so the one-line switch still works).
- `src/lib/assistant.ts`: the chat must never say "5 minutes" or promise a turnaround; it says to ask for a quote on WhatsApp.
- `src/components/estimator.tsx`: the result shows no "5 minutes" line in quote mode.
- Regression guard: an e2e test that loads `/`, `/repairs`, one `/repairs/[slug]`, `/estimate`, `/book` and asserts no "5 minutes" text, so it can't come back silently.
- Docs: `CLAUDE.md` rule 10, `PRODUCT.md`, `docs/PRD.md` §5/§11 now say `'quote'` mode shows no price line.

### A2. Search and AI crawlers
- `robots.ts`: already allows `*` and links the sitemap. Keep it; add nothing that blocks AI bots.
- `sitemap.ts`: already lists every indexable route. Check `/estimate` and every service slug are in it and `/book/confirmed`, `/dev/*` are not.
- **`/llms.txt`** (new): a static route (`src/app/llms.txt/route.ts`, `dynamic = "force-static"`) built from `content.ts`: entity sentence, address, phone, WhatsApp, hours, the repair list with links, key pages, the "no published prices, quotes on WhatsApp" note. No invented facts.
- **JSON-LD** (`src/lib/schema.ts`): add `sameAs` from a new `site.sameAs` list in `content.ts` holding only confirmed profiles: the Google Maps place URL for now. Facebook `rehantraders0` shows a different phone (0305 5875716) and "Always open", so it waits: `// TODO(adnan): confirm` and fix the page first. Add `logo`. Also render `storeSchema` on `/visit` and `/about`.
- **Metadata**: every route has a unique title and description, canonical and OG. Add any missing entry (check `/estimate`).
- `public/_headers`: remove `Strict-Transport-Security`; the Cloudflare zone owns HSTS (B4) so there is one source.

### A3. Finish
`pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e` pass. Check `out/robots.txt`, `out/sitemap.xml`, `out/llms.txt`, JSON-LD in `out/index.html`. Screenshots of `/repairs` desktop 1440 and mobile 390, light and dark. Note in `docs/PHASES.md`. One commit, **not pushed** (push deploys to production).

## B. Dashboards (in order)

### B1. Hostinger (registrar), now
1. DNSSEC **off**.
2. Nameservers: replace `aurora.dns-parking.com` and `nebula.dns-parking.com` with `carol.ns.cloudflare.com` and `greg.ns.cloudflare.com`.
3. Cloudflare: click "I updated my nameservers". Wait for **Active** (minutes to 24 h).

### B2. DNS and custom domain (after Active)
1. Delete A `@ 2.57.91.91` and CNAME `www`.
2. Workers & Pages → `rehan-traders-website` → Settings → Domains & Routes → add `rehanmobiletraders.com` and `www.rehanmobiletraders.com` as Custom Domains.
3. MX, SPF, DMARC and the five Hostinger mail CNAMEs stay **DNS only**.

### B3. Email (DMARC)
Change `_dmarc` TXT to `v=DMARC1; p=quarantine; rua=mailto:businessenvymail@gmail.com; adkim=r; aspf=r`.
Relaxed (`r`) instead of strict (`s`): Hostinger sends with its own return-path domain, so strict SPF alignment can push the shop's own mail to spam. Safer still: `p=none` for two weeks, read the reports, then `quarantine`.

### B4. SSL/TLS
Full (strict). Always Use HTTPS, Automatic HTTPS Rewrites, TLS 1.3 on, minimum TLS 1.2. HSTS: max-age 6 months, include subdomains on, preload off, no-sniff on. (Include subdomains is fine only while every subdomain, including Hostinger mail/webmail, serves HTTPS.)

### B5. DNSSEC
Cloudflare → DNS → Settings → Enable DNSSEC, then paste the DS record into Hostinger.

### B6. AI Crawl Control and bots
- Allow: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, Claude-SearchBot, Claude-User, ClaudeBot, Google-Extended, Applebot.
- "Block AI bots" off. Managed robots.txt **off**, so the site's own `robots.txt` is served.

### B7. Security
Security Level Medium, Browser Integrity Check on, Bot Fight Mode on (verified bots pass). The free plan runs the Cloudflare **Free** Managed Ruleset automatically; the full Managed Ruleset needs Pro.
Add the rate-limiting rule CLAUDE.md rule 13 requires: Security → WAF → Rate limiting rules → URI path starts with `/api/`, 20 requests per 10 seconds per IP, block 10 seconds (the one rule the free plan allows).

### B8. Speed
Brotli (on by default), HTTP/3, Early Hints on.

### B9. Search engines (after the commit is pushed and the domain serves the new build)
1. Google Search Console: add a **Domain** property, put its TXT record in Cloudflare DNS, verify, submit `https://rehanmobiletraders.com/sitemap.xml`, request indexing of `/`.
2. Bing Webmaster Tools: import from Search Console, submit the sitemap.
3. Google Business Profile: website field → `https://rehanmobiletraders.com`; name, address, phone identical to the site (`Rehan Traders`, Shop G-88, Ground Floor, Hafeez Center, Gulberg III, Lahore, `0305 8874839`).
4. Facebook page: fix the phone to `0305 8874839` and the hours, then add it to `site.sameAs`.
