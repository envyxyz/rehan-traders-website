import { faq, priceMode, services, site } from "@/content"

export const dynamic = "force-static"

// llms.txt (llmstxt.org): a plain-text summary for AI crawlers, built from content.ts so it never drifts from the site.
const pages = [
  { label: "Repairs", path: "/repairs", note: "Every repair the shop lists" },
  { label: "Repair estimate", path: "/estimate", note: "Pick the device and the fault to see the likely repair" },
  { label: "Book a visit", path: "/book", note: "Choose a device, a fault and a visit time" },
  { label: "Visit", path: "/visit", note: "Directions, hours and the shop front" },
  { label: "Reviews", path: "/reviews", note: "Customer reviews from Google" },
  { label: "FAQ", path: "/faq", note: "Answers to common questions" },
  { label: "About", path: "/about", note: "The shop and the people behind it" },
]

const body = [
  `# ${site.name}`,
  "",
  `> ${site.entity}`,
  "",
  `${site.name} has been repairing phones since ${site.founded}. "Rehan" is only the shop's name.`,
  "",
  "## Contact",
  `- Address: ${site.address.lines.join(", ")}`,
  `- Phone and WhatsApp: ${site.phone.display} (${site.phone.dial})`,
  `- WhatsApp: ${site.whatsapp.href}`,
  `- Email: ${site.email}`,
  `- Hours: ${site.hours.oneLine}. ${site.hours.fridayBreak}. ${site.hours.holidays}. Times are Pakistan time (${site.hours.timezone}).`,
  `- Payment: ${site.payments}`,
  `- Google Maps: ${site.mapsUrl}`,
  "",
  "## Repairs",
  ...services.map((s) => `- [${s.title}](${site.url}/repairs/${s.slug}): ${s.short}`),
  "",
  "## Pages",
  ...pages.map((p) => `- [${p.label}](${site.url}${p.path}): ${p.note}`),
  "",
  "## Prices and quotes",
  priceMode === "quote"
    ? "The shop does not publish prices. Message the shop on WhatsApp with the exact device model and it will send a quote."
    : "Prices marked \"From Rs\" on the repair pages are starting prices. For anything else, message the shop on WhatsApp for a quote.",
  "",
  "## Questions",
  ...faq.map((f) => `- ${f.q} ${f.a}`),
  "",
].join("\n")

export function GET() {
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
