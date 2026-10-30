import type { Metadata } from "next"

import { CtaBand } from "@/components/cta-band"
import { Hero } from "@/components/hero"
import { HomeSections } from "@/components/home"
import { JsonLd } from "@/components/json-ld"
import { seo } from "@/content"
import { storeSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: { absolute: seo.home.title },
  description: seo.home.description,
  alternates: { canonical: "/" },
  openGraph: { title: seo.home.title, description: seo.home.description, url: "/" },
}

export default function Home() {
  return (
    <>
      <JsonLd data={storeSchema} />
      <Hero />
      <HomeSections />
      <CtaBand />
    </>
  )
}
