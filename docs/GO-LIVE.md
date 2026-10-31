# Phase 10 runbook: go live (31 Oct 2026)

One ordered list. Do the steps top to bottom; each says where to click, what to enter and what success looks like. `docs/LAUNCH.md` is the tick-box checklist that points back here by step number. Research notes, sources and the SEO audit are in `docs/launch/`.

How the steps were checked: labels and limits were read from the official docs (developers.cloudflare.com, support.hostinger.com, support.google.com, bing.com/webmasters) on 31 Oct 2026. Dashboards move; if a label differs, search the linked help page. Anything not confirmed in the docs is marked **unverified**.

## State on 31 Oct 2026 (probed from outside, nothing changed)

| Item | State |
|---|---|
| Nameservers | Already Cloudflare (`carol.ns.cloudflare.com`, `greg.ns.cloudflare.com`). Hostinger step is done. |
| DNSSEC | On: a DS record (key tag 2371, algorithm 13, digest type 2) is at the registry and Cloudflare publishes the DNSKEY. Done. |
| Apex and www | Both serve the Worker (HTTP 200). `www` does **not** redirect yet: it returns the same page with a canonical to the apex. Step 6 fixes that. |
| HTTPS | `http://` redirects to `https://` (301). HSTS is live: `max-age=15552000; includeSubDomains` (6 months, no preload). Brotli and HTTP/3 are on. |
| Rocket Loader | No Rocket Loader script is injected in the HTML. Still switch it off explicitly (step 7). |
| Mail DNS | MX `mx1`/`mx2.hostinger.com` (5, 10), SPF `v=spf1 include:_spf.mail.hostinger.com ~all`, DKIM `hostingermail-a._domainkey` CNAME and DMARC `v=DMARC1; p=quarantine; adkim=r; aspf=r` all resolve. DMARC has no `rua` yet (step 5). |
| Search Console | A `google-site-verification=` TXT already exists on the apex. Whether the property is verified is not visible from outside; step 9 checks. |
| Worker | `rehan-traders-website` exists, 20 deployments, latest 30 Oct 2026 21:00 UTC. All deployments list `Source: Unknown (deployment)`, i.e. they were made with the CLI, so **whether Workers Builds is connected to GitHub is not visible from wrangler**; step 1 checks it in the dashboard. |
| Worker secrets | Set: `BOOKING_WEBHOOK_SECRET`, `BOOKING_WEBHOOK_URL`, `GOOGLE_AI_API_KEY`, `GOOGLE_AI_PRO_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `OPENROUTER_API_KEY_FREE`. |
| Live `/api/*` | `GET /api/chat` returns 405 and an unknown `/api/x` returns 404, both JSON from the Worker. There is no health endpoint (step 11). |

## 0. Before anything else (laptop)

1. In the main checkout, on `phase9`: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e` all pass, and `grep -rli "5 minutes" out --include=*.html` prints nothing.
2. Commit Phase 9. Merge `phase9` into `main` (`main` is 9 commits behind).
3. **Do not push yet** if Workers Builds is connected (step 1 tells you): a push to `main` deploys to production. Push once step 1 is verified.
4. `grep -n "TODO(adnan" src/content.ts` lists what is still unconfirmed (7 hits on 31 Oct: sameAs/Facebook, walking directions, entrance and landmarks, registered name/NTN, before-and-after photos). Decide per item: confirm, or leave the text neutral. None blocks DNS or search setup.

## 1. Cloudflare Workers Builds: GitHub to the Worker

The Worker exists and holds all secrets, so this step verifies and, if needed, connects. It never creates a second Worker.

**Check what is connected**
1. dash.cloudflare.com > **Workers & Pages** > `rehan-traders-website` > **Settings** > **Build**.
2. If **Git repository** shows `envyxyz/rehan-traders-website`, it is connected: open the **Deployments** tab and look for entries that name a commit. Go to "Check the settings" below.
3. If it shows **Connect** (nothing connected): click **Connect** > **GitHub** > authorise the Cloudflare Workers and Pages GitHub app for `envyxyz` > choose `rehan-traders-website`. Do **not** use Create application > Import a repository: that makes a new Worker. The Worker `name` in `wrangler.jsonc` (`rehan-traders-website`) must equal the dashboard Worker name or the build fails.

**Check the settings** (Settings > Build; docs: workers/ci-cd/builds/configuration)

| Field | Value |
|---|---|
| Git branch (production) | `main` |
| Build command | `pnpm build` |
| Deploy command | `npx wrangler deploy` (the default; Workers Builds uses the wrangler version in `package.json`, 4.154.0) |
| Root directory | empty (repo root) |
| Non-production branch builds | off while Free build minutes matter (3,000 min a month, 1 build at a time, 20 min timeout on Free). If left on, the Preview command default is `npx wrangler preview`. |
| API token | leave the generated one |

**Build image: Node and pnpm** (docs: workers/ci-cd/builds/build-image)
- Preinstalled Node: 22.23.4 and 24.22.1, default **24.22.1**. Your laptop runs Node 26; the build will not. The repo has no `.nvmrc`, so the build uses 24. To pin it, add a build variable `NODE_VERSION` = `24.22.1` (below).
- pnpm: the image default is 9.10.0, but it is chosen through Corepack in this order: top-level `packageManager` in `package.json`, then `devEngines.packageManager`, then `PNPM_VERSION`, then the default. This repo has `"packageManager": "pnpm@11.9.0"`, so **pnpm 11.9.0 is selected with no extra variable**. The docs do not name pnpm 11 specifically; the first build is the test. If it fails at "Corepack"/"packageManager", set build variable `PNPM_VERSION` = `11.9.0` and look at the log.
- `pnpm-workspace.yaml` already lists `allowBuilds` (esbuild, sharp, workerd), which pnpm 11 needs for install scripts.

**Build variables and secrets** (Settings > Build > **Build variables and secrets** > Add; build time only, never visible to the Worker)
- `NODE_VERSION` = `24.22.1` (optional pin).
- `NEXT_PUBLIC_SITE_URL`: **not needed.** Nothing in `src/`, `scripts/` or `next.config.ts` reads it; the site URL is hard-coded in `src/content.ts`. It only appears in `.env.example`. Leave it out (decision for Ameer: delete the line from `.env.example`).

**Runtime secrets** (Settings > **Variables and Secrets**; these are separate from the build variables above)
- Already set (7, listed in the table at the top). Used by the code: `BOOKING_WEBHOOK_URL`, `BOOKING_WEBHOOK_SECRET`, `OPENROUTER_API_KEY`, `GOOGLE_AI_PRO_API_KEY`, `GOOGLE_AI_API_KEY`, `GROQ_API_KEY`.
- `OPENROUTER_API_KEY_FREE` is **not read by anything in `worker/` or `src/`**. Leave it or remove it with `npx wrangler secret delete OPENROUTER_API_KEY_FREE` (decision for Ameer).
- `AI_FORCE_FAIL` is a test switch in `worker/chat.ts` (forces provider fallbacks). It must **not** exist in production. Check it is not in the list.
- `wrangler deploy` never deletes secrets (docs: wrangler configuration, "Source of truth"). Plain-text dashboard variables would be overwritten unless `keep_vars` is set; there are none, so nothing is at risk.
- Verify without printing values: `npx wrangler secret list` shows names and types only.

**CLI alternative** (only if a secret is missing; each command creates and deploys a new version immediately)
- One secret: `npx wrangler secret put NAME` and paste the value at the prompt, or pipe it in.
- Many at once: `npx wrangler secret bulk secrets.json` (up to 100; the file is either `{"NAME": "value", ...}` JSON or `NAME=value` lines; a `null` value deletes a key on wrangler 4.97 or later). Build it from `.env.local` without printing it. In PowerShell from the repo root:
  ```
  $names = 'BOOKING_WEBHOOK_URL','BOOKING_WEBHOOK_SECRET','OPENROUTER_API_KEY','GOOGLE_AI_PRO_API_KEY','GOOGLE_AI_API_KEY','GROQ_API_KEY'
  $o = [ordered]@{}
  Get-Content .env.local | ForEach-Object { if ($_ -match '^\s*([A-Z0-9_]+)=(.*)$' -and $names -contains $Matches[1] -and $Matches[2]) { $o[$Matches[1]] = $Matches[2].Trim('"') } }
  $o | ConvertTo-Json | Set-Content $env:TEMP\rt-secrets.json
  npx wrangler secret bulk $env:TEMP\rt-secrets.json
  Remove-Item $env:TEMP\rt-secrets.json
  ```
  Nothing is echoed; the temp file is deleted straight after. (An earlier research note claimed a `{"secrets": {"X": {"type": ...}}}` shape; that is the Workers API format, not this command's. The docs show the flat shape above.)

**Success:** push to `main` (step 0.3) and the **Deployments** tab shows a build from that commit going green; `curl -I https://rehanmobiletraders.com/` still returns 200, and a test booking on the live site (LAUNCH.md) works.

**Confirm the workers.dev URL:** Settings > **Domains & Routes** lists `rehan-traders-website.<your-subdomain>.workers.dev`, with an Enable/Disable toggle. A successful `npx wrangler deploy` also prints it. The custom domain is what customers use; switching the workers.dev route off afterwards avoids a second public copy of the site (decision for Ameer; the canonical tags already point at the apex).

## 2. Zone on the Free plan, DNS review

Already done (nameservers are on Cloudflare). Keep for the record and re-check:
1. dash.cloudflare.com > **Domains** > `rehanmobiletraders.com` > status **Active**. (Onboarding was: **Domains** > **Onboard a domain** > enter the apex > **Continue** > plan **Free** > review the scanned records > copy the two assigned nameservers > update the registrar > wait for the "Active" email, up to 24 h.)
2. **DNS** > **Records**: confirm these exist and are **DNS only** (grey cloud): MX `@` `mx1.hostinger.com` priority 5 and `mx2.hostinger.com` priority 10; TXT `@` `v=spf1 include:_spf.mail.hostinger.com ~all` (only one SPF record); CNAME `hostingermail-a`, `-b`, `-c` `._domainkey` pointing at `hostingermail-a/b/c.dkim.mail.hostinger.com`; TXT `_dmarc`; any `autodiscover`, `autoconfig`, `mail`, `smtp`, `imap` records the scan imported. The apex and `www` rows show type **Worker** (created by the Custom Domains), proxied.
3. Hostinger's own record list is in support.hostinger.com article 8671319; it does not mention Cloudflare, but the records are plain DNS and work from any provider. Cloudflare's scan can miss records, so compare against that list once.

**Success:** `nslookup -type=MX rehanmobiletraders.com 1.1.1.1` returns the two Hostinger hosts, and a mail sent to and from the shop's mailbox works.

## 3. Hostinger hPanel: DNSSEC and nameservers

Done already; the clicks, if it ever has to be repeated:
- **DNSSEC off** (needed only when moving away from Cloudflare, or if a DS was ever added): hPanel > **Domains** > the domain > **Manage** > **DNS / Nameservers** > **DNSSEC** tab > delete the record (leave the fields empty). Hostinger notes the DNSSEC tab exists only for a domain registered at Hostinger that points at another provider's nameservers; on Hostinger's own parking nameservers DNSSEC is not supported, so it was never on before the move.
- **Nameservers**: hPanel > **DNS** (left sidebar) > the domain, or **Domains** > **Manage** > **DNS / Nameservers** > **Change Nameservers** > **Change nameservers** (not the Hostinger default) > enter the two Cloudflare names (`carol.ns.cloudflare.com`, `greg.ns.cloudflare.com`; always copy the pair from the Cloudflare zone Overview) > **Save**. Hostinger says up to 24 h, usually a few hours. After this the Hostinger DNS zone editor is no longer used; every DNS change is made in Cloudflare.
- Never use Cloudflare's DNS-only proxy toggle or pause Cloudflare while HSTS is on (Cloudflare HSTS warning).

## 4. Custom Domains on the Worker

Done already (apex and `www` both answer). To re-check: Workers & Pages > `rehan-traders-website` > **Settings** > **Domains & Routes**: `rehanmobiletraders.com` and `www.rehanmobiletraders.com` listed as **Custom Domain**. To add one: **Add** > **Custom Domain** > type the hostname > **Add Custom Domain**. Requirements: the zone is Active, and no A/AAAA/CNAME record already exists on that hostname (delete the old Hostinger `A @ 2.57.91.91` and `CNAME www` first). Cloudflare issues the certificate itself.

**Success:** `https://rehanmobiletraders.com/` returns 200 with `server: cloudflare`; `GET /api/chat` returns 405 JSON (the Worker is answering).

## 5. Email DNS: DMARC

Cloudflare > **DNS** > **Records** > edit the TXT `_dmarc` > set Content to
`v=DMARC1; p=quarantine; rua=mailto:businessenvymail@gmail.com; adkim=r; aspf=r`
Relaxed (`r`) alignment because Hostinger sends with its own return-path domain. Live today is the same without `rua`, so no reports arrive. Safer variant: `p=none` for two weeks, read the reports, then `quarantine` (Hostinger's own template uses `p=none`). Decision for Ameer: which address receives reports.

**Success:** `nslookup -type=TXT _dmarc.rehanmobiletraders.com 1.1.1.1` shows the new value; mail to a Gmail address still lands in the inbox (check "Show original": SPF, DKIM, DMARC all PASS).

## 6. www redirects to the apex

Why: today `https://www.rehanmobiletraders.com/` returns 200 with the page. Cloudflare's docs say a Worker Custom Domain matches the hostname exactly, so `www` needs its own redirect; Single Redirects run at the edge before the Worker, and need the hostname to be proxied (it is, because the Custom Domain created a proxied record).

1. dash.cloudflare.com > the zone > **Rules** > **Overview** > **Create rule** > **Redirect Rule**.
2. **Rule name**: `www to apex`.
3. **When incoming requests match**: choose **Wildcard pattern**.
   - **Request URL**: `http*://www.rehanmobiletraders.com/*`
   - **Target URL**: `https://rehanmobiletraders.com/${2}`
   - **Status code**: `301`
   - **Preserve query string**: on.
   (`${1}` is the `http`/`https` match, `${2}` the path. Using both schemes avoids a double hop. If you prefer an expression: **Custom filter expression** `http.host eq "www.rehanmobiletraders.com"` with a dynamic target `concat("https://rehanmobiletraders.com", http.request.uri.path)` also works.)
4. **Deploy**.

**Success:** `curl -sI "https://www.rehanmobiletraders.com/repairs?x=1"` returns `301` with `location: https://rehanmobiletraders.com/repairs?x=1`; `http://www...` also lands on the apex in one hop.

If the redirect does not fire (rule order or Custom Domain interplay is not spelled out in the docs): delete the `www` Custom Domain, delete its leftover record, add **AAAA** `www` `100::` **Proxied** (Cloudflare's documented placeholder for hostnames that only redirect), keep the rule. A Custom Domain is not recommended for a redirect-only hostname.

## 7. Zone security and speed settings

All in the zone, Free plan.
1. **SSL/TLS** > **Overview**: encryption mode **Full (strict)** (if the page offers Automatic SSL/TLS, pick the custom option and set Full (strict)). The docs do not say what the mode does for a hostname served by a Worker with no origin; it does no harm and keeps any future proxied record safe.
2. **SSL/TLS** > **Edge Certificates**: **Always Use HTTPS** on; **Automatic HTTPS Rewrites** on; **Minimum TLS Version** 1.2; **TLS 1.3** on. **HTTP Strict Transport Security (HSTS)**: already live with 6 months and include subdomains. Edit via **Enable HSTS** > **I understand** > **Next**: Max Age 6 months, Apply to subdomains on, Preload **off**, No-Sniff on. Subdomains with only HTTP (none today; Hostinger webmail is the one to test) would become unreachable.
3. **Speed** > **Settings** > **Content Optimization**: **Rocket Loader** off. (The docs do not state its default for new zones; the live HTML contains none, but set it explicitly. A strict CSP and Rocket Loader do not mix.)
4. Brotli and HTTP/3 are on (confirmed live: `content-encoding: br`, `alt-svc: h3`). **Early Hints** on (Speed > Settings > Optimization).
5. **Security** > **Settings**: Security Level Medium, Browser Integrity Check on; Bot Fight Mode on (verified bots pass).
6. **AI Crawl Control**: managed robots.txt **off** and "Block AI bots" **off**. Live `robots.txt` is the site's own file (confirmed 31 Oct), so this holds; recheck after any dashboard change. Allowed: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, Claude-SearchBot, Claude-User, ClaudeBot, Google-Extended, Applebot.

## 8. Rate limit on /api/*

Free plan limits (docs: waf/rate-limiting-rules): **1 rule**, counting period **10 s**, mitigation timeout **10 s**, characteristics **IP** only, counts requests, expression fields are path and Verified Bot only, no custom block response, no throttling.

1. Zone > **Security** > **Security rules** > **Create rule** > **Rate limiting rules**.
2. **Rule name**: `api`.
3. **Field / Operator / Value**: **URI Path** | **starts with** | `/api/`.
4. **With the same characteristics**: **IP**.
5. **When rate exceeds**: **20** requests per **10 seconds**. (The two earlier docs disagreed: 10 vs 20. Use 20: a booking sends the form plus up to 3 photo uploads in a burst, and chat streams several calls; 20 still stops a script.)
6. **Then take action**: **Block**; **Duration**: **10 seconds**.
7. **Deploy**.

**Success:** from a terminal, `for i in $(seq 1 40); do curl -s -o /dev/null -w "%{http_code} " https://rehanmobiletraders.com/api/nope; done` prints 404s and then 429s (Block returns 429 by default). Wait 10 s and it recovers. Do it from your own IP only.

## 9. Search Console and Bing

Do after step 6, so the clean apex is what is submitted.

**Google Search Console** (docs: support.google.com/webmasters/answer/9008080, 183668, 7451001)
1. search.google.com/search-console > property selector > **Add property** > **Domain** > `rehanmobiletraders.com` > **Continue**. If a `google-site-verification` TXT is already in DNS (it is) and the property is already listed as verified, skip to 4.
2. In the dialog set **Select record type** to **TXT**, copy the string. Cloudflare > **DNS** > **Records** > **Add record**: Type `TXT`, Name `@`, Content the string, TTL Auto > **Save**. Keep the record forever; removing it loses ownership.
3. Back in Search Console click **Verify**. Google says it can take a day or two; retry later.
4. **Indexing** > **Sitemaps** > **Add a new sitemap** > `sitemap.xml` > **Submit**. Status **Success**, 18 URLs discovered (the 18 canonical routes; `/book/confirmed` and `/dev/*` are not in it on purpose).
5. Top search box (**Inspect any URL in "rehanmobiletraders.com"**): `https://rehanmobiletraders.com/` > **Test live URL** > check "Page can be indexed" and the user-declared canonical > **Request indexing**. Repeat for `/repairs/touch-glass-replacement`, `/visit`, `/book`. There is a daily quota; sitemaps handle the rest.
6. Rich results: search.google.com/test/rich-results on `/`, one `/repairs/...` page and `/faq`.

**Bing Webmaster Tools** (bing.com/webmasters/help/add-and-verify-site-e62a13b5)
1. bing.com/webmasters > sign in > **Add a site** > **Import your sites from GSC** > **Continue** > sign in with the Google account > **Allow** > select `rehanmobiletraders.com` > **Import**.
2. **Sitemaps**: confirm `sitemap.xml` came across; if not, **Submit sitemap**.

**IndexNow via Cloudflare Crawler Hints**
1. Zone > **Caching** > **Configuration** > **Crawler Hints** > on (Free plan, site-wide).
2. It reports a cache `MISS` as "content probably changed" to IndexNow engines. The docs do not say whether that fires for Workers static assets, so check Bing Webmaster Tools > **IndexNow** a week after a deploy. Only if it stays empty add a key file to `public/` (a code change; not now).

**Success:** Search Console shows the property verified and the sitemap "Success"; Bing lists the site as verified with the sitemap.

## 10. GA4, GTM, linking

The site loads one tag, GTM container `GTM-TBXL7JMX`, once the page is idle. Events wait in the dataLayer until then. (Docs: support.google.com/analytics/answer/9304153, 9539598, 7667196, 10737381; support.google.com/tagmanager/answer/13438166, 9442095.)

1. **GA4 property**: analytics.google.com > **Admin** > **Create** > **Property**. Name `Rehan Traders`; reporting time zone **Pakistan**; currency **Pakistani Rupee (PKR)** > **Next** > business details > **Create**.
2. **Web data stream**: choose **Web**; URL `https://rehanmobiletraders.com`; stream name `Rehan Traders web`; leave Enhanced measurement on > **Create stream**. Copy the **Measurement ID** (`G-...`; later: Admin > Data streams > the stream).
3. **Settings**: Admin > **Data collection and modification** > **Data retention** > event data retention **14 months** > **Save**. On the stream > **Redact data** > email on.
4. **GTM**: tagmanager.google.com > `GTM-TBXL7JMX`:
   1. **Tags** > **New** > **Tag Configuration** > **Google tag**; **Tag ID** = the `G-...` ID; trigger **Initialization - All Pages**.
   2. **Variables** > **User-defined** > **New** > **Data Layer Variable**, one each for `from`, `service`, `step`, `index`, `kind`, `saved`, `action`, `path`, `fault`.
   3. **Triggers** > **New** > **Custom Event**; event name `book_start|book_step|book_submit|whatsapp_click|call_click|directions_click|chat_open|chat_handoff|estimate_complete|price_view`; tick **Use regex matching**.
   4. **Tags** > **New** > **Google Analytics: GA4 Event**; Measurement ID the same; event name `{{Event}}`; parameters from the variables in 4.2; the trigger from 4.3.
   5. **Submit** > **Publish and Create Version** > name `GA4 + events` > **Publish**.
5. **DebugView**: GTM **Preview** with the live URL, then GA4 Admin > **DebugView**. Tap WhatsApp, the phone number, Directions, start and submit one test booking. Expect `whatsapp_click`, `call_click`, `directions_click` (only a `from` slug), `book_start`, `book_step`, `book_submit`. No names, numbers or message text in any parameter.
6. **Key events**: GA4 Admin > **Key events** > **New key event**: `book_submit`, `whatsapp_click`, `call_click`, `directions_click`.
7. **Link Search Console**: needs Editor on the GA4 property and a verified owner on the Search Console property (do step 9 first). Admin > **Product links** > **Search Console links** > **Link** > choose the account > **Confirm** > **Next** > select the web stream > **Next** > **Submit**. Then Reports > **Library** > **Search Console** collection > the three dots > **Publish** (the collection is unpublished by default).

**Success:** DebugView shows the events live; the Search Console link reads created; Realtime shows your own visit.

## 11. Uptime monitor

**Recommended: UptimeRobot Free** (uptimerobot.com/pricing: 50 monitors, 5-minute interval, one status page, "good for personal and commercial projects"; reconfirm on the pricing page when you sign up). Better Stack's free plan is described as "free for personal projects" and is not the pick.

1. Sign in > **My Settings** > **Alert Contacts** > add an **E-mail** contact (Adnan's and Ameer's); click the activation link in the email.
2. **+ New monitor** (the button is labelled "+ Add New Monitor" in some versions) > type **HTTP(s)** > name `Rehan Traders site` > URL `https://rehanmobiletraders.com/` > interval **5 minutes** > tick the alert contacts > **Create monitor**.
3. Optional second monitor, type **Keyword**: same URL, keyword `Rehan Traders`, alert when keyword does **not** exist. Catches a 200 page that is actually an error page.

**The API:** the Worker has no health or GET endpoint without side effects. `/api/book`, `/api/chat` and `/api/upload` answer GET with 405, and any other `/api/*` path with 404. UptimeRobot treats 4xx as down and, as far as the research found, only the paid plan accepts custom status codes, so it cannot watch these. **Monitor `/` only, and say so to the client.** `/` is served from static assets and does not run the Worker, so a green `/` does not prove the booking path works.
Decision for Ameer: add `GET /api/health` to `worker/index.ts` (about three lines: return `{ok:true}` with 200, no secrets, no fetches). Then add it as a second HTTP monitor. Needs the owner of `worker/` to do it.

## 12. Google Business Profile

business.google.com > the listing > **Edit profile** > **Business information** > **Contact** > **Website** > pencil icon:
`https://rehanmobiletraders.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` > **Save**. If an **Appointment link** field is offered (labels differ by listing): `https://rehanmobiletraders.com/book?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
- Google's help pages have no rule against UTM tags in this field (**unverified** in an official statement; third-party guides all use them). Do not use a shortener or redirect, which can drop the tags. Only the main Website field shows in the "clicks to website" report.
- Name, address and phone must match the site: `Rehan Traders`, Shop G-88, Ground Floor, Hafeez Center, Gulberg III, Lahore, `0305 8874839`. Add the Friday prayer break (1:00 to 2:00 PM) to the hours. Decide the listing name (open point 2 in the Business Profile notes).
- Facebook page `rehantraders0` shows a different phone and "Always open": fix it first, then add it to `site.sameAs` in `content.ts` (TODO(adnan)).

**Success:** the Website link opens the live home page; a click from the listing arrives in GA4 with source `google`, medium `organic`, campaign `gbp`.

## 13. Reminders (Google Calendar)

Create two recurring events in the shop-admin calendar (Ameer's, with Adnan invited if he wants them). Calendar: **Create** > **Event**, then:

**Event 1**
- Title: `Rehan Traders: weekly site check`
- When: Monday, 10:00 AM to 10:30 AM, time zone Pakistan Standard Time (the time zone link beside the time)
- Repeat: **Does not repeat** dropdown > **Custom** > Repeat every **1 week** on **M** > Ends **Never** > **Done**
- Description:
  ```
  1. Search Console: Performance (last 7 days vs previous), Indexing > Pages (any new "not indexed"), Sitemaps (Success), Enhancements.
  2. Lighthouse: PageSpeed Insights mobile for / , /repairs, /book. Scores 95+ in all four categories; note any drop.
  3. UptimeRobot: any downtime this week.
  4. GA4: Reports > Key events (book_submit, whatsapp_click, call_click).
  5. Cloudflare > Security > Events: anything blocked on /api/*.
  Write one line in docs/PHASES.md only if something changed.
  ```
- Notification: **30 minutes** before. **Save**.

**Event 2**
- Title: `Rehan Traders: refresh Google reviews in content.ts`
- When: first Monday of the month, 11:00 AM to 11:30 AM, Pakistan Standard Time
- Repeat: Custom > Repeat every **1 month** > **Monthly on the first Monday** > Ends **Never**
- Description:
  ```
  Open the Google Maps listing signed out. In src/content.ts (reviews block): update rating, count and asOf together; add or replace review texts exactly as written; do not round or invent. pnpm build + pnpm lint, commit, push main. Check /reviews and llms.txt show the new count and date. (Also mention the new count to Adnan.)
  ```
- Notification: **1 day** before and at start. **Save**.

I cannot create these from here (no Calendar connector in this session); say the word and they can be added with the Google Workspace skill.
