import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Icon } from "@/components/icon"
import { Img } from "@/components/img"
import { Container, Section } from "@/components/layout"
import { PriceLine } from "@/components/price-line"
import { Heading, Text } from "@/components/typography"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { actions, breadcrumbs, repairsPage, seo, services } from "@/content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: seo.repairs.title,
  description: seo.repairs.description,
  alternates: { canonical: "/repairs" },
  openGraph: { title: seo.repairs.title, description: seo.repairs.description, url: "/repairs" },
}

export default function RepairsIndexPage() {
  const leads = services.filter((s) => s.lead)
  const rest = services.filter((s) => !s.lead)

  return (
    <>
      <Section className="pt-28 lg:pt-36">
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.repairs }]} className="mb-8" />
          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {repairsPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {repairsPage.lede}
            </Text>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            {[...leads, ...rest].map((s, i) => (
              <li key={s.slug} className={cn(s.lead ? "lg:col-span-3" : "lg:col-span-2")}>
                <Card className="flex h-full flex-col overflow-hidden p-0">
                  <Img
                    name={s.image}
                    alt={s.alt}
                    priority={i === 0}
                    sizes={s.lead ? "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 368px, (min-width: 768px) 50vw, 100vw"}
                    className={cn("w-full", s.lead ? "aspect-16/10" : "aspect-4/3")}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <CardTitle as="h2" className={cn(s.lead ? "text-title-lg" : "text-title-md")}>{s.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{s.short}</CardDescription>
                    <PriceLine priceFrom={s.priceFrom} className="mt-4" />

                    <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/repairs/${s.slug}`}
                        className="inline-flex items-center gap-1 font-display text-body-sm font-bold text-ink underline-offset-4 hover:underline"
                      >
                        {repairsPage.viewDetails}
                        <Icon icon={ArrowRight} size="sm" />
                      </Link>
                      <BookButton service={s.slug} variant="line">
                        {actions.bookRepair}
                      </BookButton>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
