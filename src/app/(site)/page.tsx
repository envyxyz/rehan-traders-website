import type { Metadata } from "next"

import { CtaBand } from "@/components/cta-band"
import { Hero } from "@/components/hero"
import { HomeSections } from "@/components/home"
import { JsonLd } from "@/components/json-ld"
import { seo } from "@/content"
import { storeSchema, websiteSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.home.title, description: seo.home.description, path: "/", absolute: true })

export default function Home() {
  return (
    <>
      <JsonLd data={storeSchema} />
      <JsonLd data={websiteSchema} />
      <Hero />
      <HomeSections />
      <CtaBand />
    </>
  )
}
