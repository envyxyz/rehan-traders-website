import { aboutPage, faq, facts, faqPage, priceMode, privacyPage, repairsPage, reviews, reviewsPage, services, site, termsPage, visitPage, visit, process as processSteps } from "@/content"

export const dynamic = "force-static"

/**
 * /llms-full.txt — complete page-level content for AI systems.
 *
 * The companion to /llms.txt (which is a summary). This file gives an AI
 * system everything it needs to answer detailed questions about Rehan Traders
 * without crawling individual pages. Every fact comes from content.ts.
 */
function hr() { return "\n---\n\n" }

const sections: string[] = [
  `# ${site.name} — Full Site Content`,
  "",
  `> This is the complete text content of ${site.url}, generated for AI systems. For a summary, see ${site.url}/llms.txt`,
  "",
  `${site.entity}`,
  `Website: ${site.url}`,
  `Phone: ${site.phone.display} (${site.phone.dial})`,
  `WhatsApp: ${site.whatsapp.href}`,
  `Email: ${site.email}`,
  `Address: ${site.address.lines.join(", ")}`,
  `Hours: ${site.hours.oneLine}. ${site.hours.fridayBreak}. ${site.hours.holidays}.`,
  `Founded: ${site.founded}`,
  `Google Maps: ${site.mapsUrl}`,
  `Payment: ${site.payments}`,
  `Courier repairs: ${site.courier ? "Accepted from outside Lahore" : "Not available"}`,
  `Warranty: ${facts.warranty}`,
  `Repair time: ${facts.turnaround} ${facts.turnaroundFold}`,
  `Checking: ${facts.check}`,

  hr(),

  // ── Repairs overview ──────────────────────────────────────────────────
  `## Repairs Overview`,
  "",
  repairsPage.lede,
  "",

  // ── Each service in full ──────────────────────────────────────────────
  ...services.flatMap((s) => [
    hr(),
    `## ${s.title}`,
    `URL: ${site.url}/repairs/${s.slug}`,
    "",
    s.long,
    "",
    `### What we fix`,
    ...s.faults.map((f) => `- ${f}`),
    "",
    `### How it works`,
    ...s.howItWorks.map((step) => `${step.step}. **${step.title}** — ${step.text}`),
    "",
    `### Questions about ${s.title.toLowerCase()}`,
    ...s.faq.map((f) => `Q: ${f.q}\nA: ${f.a}\n`),
    ...(s.related.length > 0 ? [
      `### Related repairs`,
      ...s.related.map((slug) => {
        const rel = services.find((r) => r.slug === slug)
        return rel ? `- [${rel.title}](${site.url}/repairs/${rel.slug})` : `- ${slug}`
      }),
      "",
    ] : []),
  ]),

  hr(),

  // ── How a repair works (process) ──────────────────────────────────────
  `## How a Repair Works`,
  "",
  ...processSteps.map((step, i) => `${i + 1}. **${step.title}** — ${step.text}`),

  hr(),

  // ── Prices and quotes ─────────────────────────────────────────────────
  `## Warranty`,
  "",
  facts.warranty,

  hr(),

  `## How Long a Repair Takes`,
  "",
  facts.turnaround,
  facts.turnaroundFold,

  hr(),

  `## Is Checking Free?`,
  "",
  facts.check,

  hr(),

  `## iPhone Battery and the Unknown Part Message`,
  "",
  facts.battery,

  hr(),

  `## Water-Resistance Seal After a Repair`,
  "",
  facts.seal,

  hr(),

  `## How to Get a Quote`,
  `URL: ${site.url}/estimate`,
  "",
  facts.quote,

  hr(),

  `## Prices and Quotes`,
  "",
  priceMode === "quote"
    ? "The shop does not publish fixed prices online. Customers message the shop on WhatsApp with their exact device model and fault, and the shop sends a customized quote based on part availability and fault severity."
    : "Prices marked 'From Rs' on repair pages are starting prices. Message the shop on WhatsApp for an exact quote.",

  hr(),

  // ── Visit page ────────────────────────────────────────────────────────
  `## Visit Shop G-88`,
  `URL: ${site.url}/visit`,
  "",
  visitPage.lede,
  "",
  `**Floor:** ${visitPage.floorValue}`,
  `**Shop:** ${visitPage.shopValue}`,
  `**Building:** ${visitPage.buildingValue}`,
  `**Entrance:** ${visitPage.entranceValue}`,
  `**Landmarks:** ${visitPage.landmarksValue}`,
  "",
  `### Shop hours`,
  ...visit.hours.map((h) => `- ${h.label}: ${h.value}`),
  "",
  `### ${visitPage.courierTitle}`,
  visitPage.courierLede,
  ...visitPage.courierSteps.map((step, i) => `${i + 1}. ${step.text}`),
  visitPage.courierDelivery,

  hr(),

  // ── Reviews ───────────────────────────────────────────────────────────
  `## Customer Reviews`,
  `URL: ${site.url}/reviews`,
  "",
  `${reviews.rating} stars on Google from ${reviews.count} reviews (as of ${reviews.asOfLabel}).`,
  "",
  reviewsPage.lede,
  "",
  ...reviews.items
    .filter((r) => r.weight >= 2)
    .map((r) => `> "${r.text}" — ${r.author}, ${r.rating}★, ${r.date}`),

  hr(),

  // ── About ─────────────────────────────────────────────────────────────
  `## About Rehan Traders`,
  `URL: ${site.url}/about`,
  "",
  aboutPage.lede,
  "",
  `### ${aboutPage.sinceTitle}`,
  aboutPage.sinceText,
  "",
  `### ${aboutPage.benchTitle}`,
  aboutPage.benchText,
  "",
  `### ${aboutPage.adnanTitle} — ${aboutPage.adnanRole}`,
  aboutPage.adnanText,
  "",
  `### ${aboutPage.panelTitle}`,
  aboutPage.panelText,

  hr(),

  // ── FAQ ────────────────────────────────────────────────────────────────
  `## Frequently Asked Questions`,
  `URL: ${site.url}/faq`,
  "",
  faqPage.lede,
  "",
  ...faq.map((f) => `Q: ${f.q}\nA: ${f.a}\n`),
  "### Service-specific questions",
  "",
  ...services.flatMap((s) =>
    s.faq.map((f) => `Q: ${f.q} (${s.title})\nA: ${f.a}\n`)
  ),

  hr(),

  // ── Privacy ───────────────────────────────────────────────────────────
  `## Privacy Policy`,
  `URL: ${site.url}/privacy`,
  "",
  privacyPage.lastUpdated,
  "",
  ...privacyPage.sections.map((s) => `### ${s.title}\n${s.text}\n`),

  hr(),

  // ── Terms ─────────────────────────────────────────────────────────────
  `## Terms of Service`,
  `URL: ${site.url}/terms`,
  "",
  termsPage.lastUpdated,
  "",
  ...termsPage.sections.map((s) => `### ${s.title}\n${s.text}\n`),
]

const body = sections.join("\n")

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
