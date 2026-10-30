import { site, type Service } from "../content"

// Structured data per PRD §8. No AggregateRating: stars come from the Google Business Profile, not this site.

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const storeId = `${site.url}/#store`

/** One entry per open stretch, so Friday's prayer break splits Friday in two. */
const openingHours = site.hours.days.flatMap((d) => {
  if (!d.open || !d.close) return []
  const stretch = (opens: string, closes: string) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayNames[d.day], opens, closes })
  return "break" in d ? [stretch(d.open, d.break.from), stretch(d.break.to, d.close)] : [stretch(d.open, d.close)]
})

export const storeSchema = {
  "@context": "https://schema.org",
  "@type": "MobilePhoneStore",
  "@id": storeId,
  name: site.name,
  url: site.url,
  description: site.entity,
  telephone: site.phone.dial,
  email: site.email,
  foundingDate: String(site.founded),
  image: `${site.url}/images/storefront-og.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.lines.join(", ").replace(`, ${site.address.city}`, ""),
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.mapsUrl,
  openingHoursSpecification: openingHours,
}

export const serviceSchema = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.title,
  serviceType: s.title,
  description: s.long,
  url: `${site.url}/repairs/${s.slug}`,
  // Named here too: the full store node is only on the home page.
  provider: { "@type": "MobilePhoneStore", "@id": storeId, name: site.name, url: site.url },
  areaServed: site.address.city,
})

export const faqSchema = (items: readonly { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
})
