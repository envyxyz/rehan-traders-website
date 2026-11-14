import { aboutPage, site } from "../content"
import { services, type Brand, type Guide, type Service } from "../content-large"

// Structured data per PRD §8. No AggregateRating: stars come from the Google Business Profile, not this site.
// No priceRange, warranty or turnaround: none is confirmed for publishing.

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const storeId = `${site.url}/#store`
const lahore = { "@type": "City", name: site.address.city, sameAs: "https://www.wikidata.org/wiki/Q11739" }
const serviceUrl = (s: Service) => `${site.url}/repairs/${s.slug}`

/** One entry per open stretch, so Friday's prayer break splits Friday in two. */
const openingHours = site.hours.days.flatMap((d) => {
  if (!d.open || !d.close) return []
  const stretch = (opens: string, closes: string) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayNames[d.day], opens, closes })
  return "break" in d ? [stretch(d.open, d.break.from), stretch(d.break.to, d.close)] : [stretch(d.open, d.close)]
})

const address = {
  "@type": "PostalAddress",
  streetAddress: site.address.lines.join(", ").replace(`, ${site.address.city}`, ""),
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
}

export const storeSchema = {
  "@context": "https://schema.org",
  "@type": "MobilePhoneStore",
  "@id": storeId,
  name: site.name,
  alternateName: site.googleName,
  slogan: site.descriptor,
  url: site.url,
  description: site.entity,
  telephone: site.phone.dial,
  email: site.email,
  foundingDate: site.opened,
  image: `${site.url}/images/storefront-og.jpg`,
  logo: `${site.url}${site.logo}`,
  sameAs: site.sameAs,
  address,
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.mapsUrl,
  // The building, so "Hafeez Center" questions resolve to this shop's entity.
  containedInPlace: { "@type": "ShoppingCenter", name: "Hafeez Center", address: { "@type": "PostalAddress", streetAddress: "Main Boulevard, Block E1, Gulberg III", addressLocality: site.address.city, addressCountry: site.address.country } },
  areaServed: lahore,
  openingHoursSpecification: openingHours,
  paymentAccepted: "Cash, Credit Card, Debit Card, JazzCash, EasyPaisa, Bank Transfer",
  currenciesAccepted: "PKR",
  employee: { "@type": "Person", name: aboutPage.adnanTitle, jobTitle: aboutPage.adnanRole },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Phone and tablet repairs",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", "@id": `${serviceUrl(s)}#service`, name: s.title, url: serviceUrl(s) },
    })),
  },
}

/** Home page only: the site name Google shows, tied to the store. */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  alternateName: site.googleName,
  url: site.url,
  inLanguage: "en-PK",
  publisher: { "@id": storeId },
}

export const serviceSchema = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${serviceUrl(s)}#service`,
  name: s.title,
  serviceType: s.title,
  description: s.intro,
  url: serviceUrl(s),
  image: `${site.url}/images/${s.image}-og.jpg`,
  // Short reference; the full store node is output beside it on every repair page.
  provider: { "@type": "MobilePhoneStore", "@id": storeId, name: site.name, url: site.url, telephone: site.phone.dial, address },
  areaServed: lahore,
  availableChannel: { "@type": "ServiceChannel", serviceLocation: { "@id": storeId }, servicePhone: { "@type": "ContactPoint", telephone: site.phone.dial }, serviceUrl: serviceUrl(s) },
})

/** A brand page is a Service by the shop, about repairing that brand's phones in Lahore. */
export const brandServiceSchema = (b: Brand) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${site.url}/repairs/${b.slug}#service`,
  name: b.title,
  serviceType: `${b.name} phone repair`,
  description: `${b.short} ${b.intro[0].text}`,
  url: `${site.url}/repairs/${b.slug}`,
  image: `${site.url}/images/${b.image}-og.jpg`,
  provider: { "@type": "MobilePhoneStore", "@id": storeId, name: site.name, url: site.url, telephone: site.phone.dial, address },
  areaServed: lahore,
  availableChannel: { "@type": "ServiceChannel", serviceLocation: { "@id": storeId }, servicePhone: { "@type": "ContactPoint", telephone: site.phone.dial }, serviceUrl: `${site.url}/repairs/${b.slug}` },
})

export const faqSchema = (items: readonly { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
})

const guideUrl = (g: Guide) => `${site.url}/guides/${g.slug}`

/** A guide is an Article by the shop; it is about the repairs it links to. */
export const articleSchema = (g: Guide) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${guideUrl(g)}#article`,
  headline: g.title,
  description: g.seo.description,
  url: guideUrl(g),
  mainEntityOfPage: guideUrl(g),
  // The guide's infographic (scripts/figures.mjs), then the photo of the first repair it leads to (the generated share image has a hashed name).
  image: [
    ...(g.figure ? [{ "@type": "ImageObject", url: `${site.url}/guides/figures/${g.slug}.png`, name: g.figure.title, caption: g.figure.caption }] : []), // a guide without a drawing has no PNG
    `${site.url}/images/${services.find((s) => s.slug === g.services[0])?.image ?? "storefront"}-og.jpg`,
  ],
  inLanguage: "en-PK",
  datePublished: g.published,
  dateModified: g.updated,
  author: { "@type": "Organization", "@id": storeId, name: site.name, url: site.url },
  publisher: { "@type": "Organization", "@id": storeId, name: site.name, logo: { "@type": "ImageObject", url: `${site.url}${site.logo}` } },
  about: g.services.map((slug) => ({ "@id": `${site.url}/repairs/${slug}#service` })),
})
