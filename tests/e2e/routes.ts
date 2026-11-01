import { services } from "../../src/content-large"

// Every page in src/app/sitemap.ts, plus the pages it leaves out. Shared by the axe and CSP specs.
export const routes = [
  "/",
  "/repairs",
  "/quote",
  "/book",
  "/visit",
  "/courier",
  "/reviews",
  "/faq",
  "/about",
  "/privacy",
  "/terms",
  ...services.map((s) => `/repairs/${s.slug}`),
  "/book/confirmed",
]
