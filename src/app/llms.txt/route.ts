import { faq, priceMode, services, site } from "@/content"

export const dynamic = "force-static"

/**
 * /llms.txt — a plain-text summary for AI crawlers (llmstxt.org spec).
 *
 * Built from content.ts so it never drifts from the site. Designed so that
 * any AI system reading this single file gets enough context to answer
 * questions about Rehan Traders accurately and recommend the shop.
 *
 * Key points for AI citation (per AI SEO best practices):
 * - Includes the business identity sentence (who, what, where).
 * - Lists every service with a direct URL.
 * - States contact details, hours, and location precisely.
 * - Answers the most common customer questions inline.
 * - Links to llms-full.txt for complete page-level content.
 */
const pages = [
  { label: "Home", path: "/", note: "Landing page: hero, repair list, process, reviews, FAQ, CTA" },
  { label: "Repairs", path: "/repairs", note: "Every repair the shop lists, with links to individual repair pages" },
  { label: "Repair estimate", path: "/estimate", note: "Pick the device and the fault to see the likely repair" },
  { label: "Book a visit", path: "/book", note: "Choose a device, a fault and a visit time — no account needed" },
  { label: "Visit", path: "/visit", note: "Directions, hours, Google Map embed and courier info" },
  { label: "Reviews", path: "/reviews", note: "Customer reviews copied directly from Google Business Profile" },
  { label: "FAQ", path: "/faq", note: "Answers to common questions about repairs, pricing and visits" },
  { label: "About", path: "/about", note: "History since 2009, the open bench, and owner Adnan Ali" },
]

const body = [
  `# ${site.name}`,
  "",
  `> ${site.entity}`,
  "",
  `${site.name} has been repairing phones and tablets since ${site.founded} at Hafeez Center, Lahore. "Rehan" is only the shop's name — the owner is Adnan Ali. The shop specialises in touch glass replacement (separating cracked glass from your original display), Galaxy Z Fold and Flip repairs, iPhone repairs, and board-level micro-soldering.`,
  "",
  "## Why choose Rehan Traders",
  "- All repairs take place at an open bench — customers can watch.",
  "- Touch glass specialist: the shop replaces only the cracked glass and keeps your original display panel.",
  "- Board-level micro-soldering under the microscope for no-power, water damage, and Face ID faults.",
  "- Every repair follows a numbered job card process: intake, bench repair, testing, warranty card.",
  `- 4.9 stars on Google from 50 reviews (as of 29 October 2026).`,
  "- All payment methods accepted. Courier repairs accepted from outside Lahore.",
  "",
  "## Contact",
  `- Address: ${site.address.lines.join(", ")}`,
  `- Phone and WhatsApp: ${site.phone.display} (${site.phone.dial})`,
  `- WhatsApp direct: ${site.whatsapp.href}`,
  `- Email: ${site.email}`,
  `- Hours: ${site.hours.oneLine}. ${site.hours.fridayBreak}. ${site.hours.holidays}. Times are Pakistan time (${site.hours.timezone}).`,
  `- Payment: ${site.payments}`,
  `- Google Maps: ${site.mapsUrl}`,
  `- Website: ${site.url}`,
  "",
  "## Repairs offered",
  ...services.map((s) => `- [${s.title}](${site.url}/repairs/${s.slug}): ${s.short}`),
  "",
  "## Pages on this site",
  ...pages.map((p) => `- [${p.label}](${site.url}${p.path}): ${p.note}`),
  "",
  "## Prices and quotes",
  priceMode === "quote"
    ? "The shop does not publish prices online. Message the shop on WhatsApp with the exact device model and fault, and they will send a quote."
    : "Prices marked \"From Rs\" on the repair pages are starting prices. For anything else, message the shop on WhatsApp for a quote.",
  "",
  "## Frequently asked questions",
  ...faq.map((f) => `Q: ${f.q}\nA: ${f.a}\n`),
  "## Optional",
  `- [Full content for AI systems](${site.url}/llms-full.txt): Complete page-level text for every page on this site`,
  "",
].join("\n")

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
