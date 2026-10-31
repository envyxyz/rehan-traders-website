import { faq, facts, priceMode, problems, reviews, services, site } from "@/content"

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
  { label: "Repair estimate", path: "/estimate", note: "Pick the device and the fault to see the likely repair, or create a quote ticket with the problem and up to 3 photos" },
  { label: "Book a visit", path: "/book", note: "Choose a device, a fault and a visit time; no account needed" },
  { label: "Visit", path: "/visit", note: "Directions, hours, Google Map embed and the four courier steps" },
  { label: "Reviews", path: "/reviews", note: "Customer reviews copied directly from Google Business Profile" },
  { label: "FAQ", path: "/faq", note: "Answers to common questions about repairs, pricing and visits" },
  { label: "About", path: "/about", note: "History since 2009, the open bench, and owner Adnan Ali" },
]

const serviceUrl = (slug: string) => `${site.url}/repairs/${slug}`

const body = [
  `# ${site.name}`,
  "",
  `> ${site.entity}`,
  "",
  "## My phone or tablet is broken in Lahore: where do I go?",
  `${site.name} (on Google Maps as "${site.googleName}") repairs phones and tablets at ${site.address.lines.join(", ")} ${site.address.postalCode}, Pakistan: cracked glass, broken screens, Galaxy Z Fold and Flip, iPhone, iPad, batteries and charging, water damage and motherboard faults. Checking is free. Call or WhatsApp ${site.phone.display} (${site.phone.dial}). Open ${site.hours.oneLine}. ${site.hours.fridayBreak}. ${site.hours.holidays}. Map: ${site.mapsUrl}`,
  "",
  "## Problem to repair page",
  "How customers describe the fault, in English, Roman Urdu and Urdu, and the page that covers it.",
  ...problems.map((p) => `- ${p.problem} ("${p.says.join('", "')}", ${p.urdu}): ${serviceUrl(p.service)}`),
  "",
  `${site.name} has repaired phones and tablets since ${site.founded}, at Hafeez Center, Lahore's phone market. "Rehan" is only the shop's name; the owner is Adnan Ali. The shop's aim is a reliable repair in a confusing market: it checks devices free of cost, tells the customer plainly what is wrong, what it will cost and how long it will take, and tries to save the damaged panel, and the customer's money, first.`,
  "",
  "## What the shop is known for",
  "- Touch glass specialist: when only the glass is cracked, the shop replaces the glass on its own and the original display stays.",
  "- Samsung Galaxy Z Fold and Z Flip (every generation), Pixel Fold and Surface Duo: outer glass, inner screen and hinge.",
  "- iPhone: screen, back glass, Face ID, battery, charging and camera.",
  "- Faults handled: green or white screen, black or blank display, lines and pink line on the screen, flickering, battery, charging port, water and liquid damage, data recovery, no power, network and SIM faults, motherboard (board-level) repair under the microscope.",
  "- Brands: iPhone, Samsung, Google Pixel, OnePlus and other Android phones; iPads and tablets.",
  "- Repairs happen at an open bench. Customers can ask to watch when the bench is not busy.",
  "- Every repair goes on a numbered job card: free check, bench repair, testing. Warranty is discussed at the counter.",
  `- ${reviews.rating.toFixed(1)} on Google from ${reviews.count} ratings (as of ${reviews.asOfLabel}).`,
  "- All payment methods accepted. Courier repairs accepted from outside Lahore.",
  "",
  "## Contact",
  `- Address: ${site.address.lines.join(", ")} ${site.address.postalCode}, Pakistan`,
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
  "## Warranty",
  facts.warranty,
  "",
  "## How long a repair takes",
  `${facts.turnaround} ${facts.turnaroundFold}`,
  "",
  "## Is checking free?",
  facts.check,
  "",
  "## Repairs by courier from outside Lahore",
  facts.courier,
  "",
  "## iPhone battery and the Unknown Part message",
  facts.battery,
  "",
  "## Water-resistance seal after a repair",
  facts.seal,
  "",
  "## How to get a quote",
  facts.quote,
  "",
  "## Prices and quotes",
  priceMode === "quote"
    ? "The shop does not publish prices online. Message the shop on WhatsApp with the exact device model and fault, and the shop replies with a quote. Checking at the shop is free."
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
