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
import { actions, breadcrumbs, problems, repairsPage, seo, services } from "@/content"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.repairs.title, description: seo.repairs.description, path: "/repairs" })

export default function RepairsIndexPage() {
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

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.slug}>
                <Card className="flex h-full flex-col overflow-hidden p-0">
                  <Img
                    name={s.image}
                    alt={s.alt}
                    priority={i === 0}
                    sizes="(min-width: 1440px) 437px, (min-width: 1024px) calc(33.33vw - 2.67rem), (min-width: 768px) calc(50vw - 2.25rem), calc(100vw - 2rem)"
                    className="w-full aspect-4/3"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <CardTitle as="h2" className="text-title-md">{s.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{s.short}</CardDescription>
                    <PriceLine priceFrom={s.priceFrom} className="mt-4" />

                    <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/repairs/${s.slug}`}
                        aria-label={repairsPage.viewDetailsOf(s.title)}
                        className="inline-flex min-h-11 items-center gap-1 font-display text-body-sm font-bold text-ink underline-offset-4 hover:underline"
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

          <h2 className="mt-16 font-display text-title-md text-ink">{repairsPage.problemsTitle}</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-1 md:grid-cols-2">
            {problems.map((p) => (
              <li key={p.problem}>
                <Link
                  href={`/repairs/${p.service}`}
                  className="flex min-h-11 items-center py-2 text-body-sm text-ink underline-offset-4 hover:underline"
                >
                  {p.problem}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
