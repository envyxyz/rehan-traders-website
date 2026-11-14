import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Container, Section } from "@/components/layout"
import { ServiceCard } from "@/components/service-card"
import { Heading, Linked, Text } from "@/components/typography"
import { brandPage, breadcrumbs, problems, repairsPage, seo } from "@/content"
import { brands, guides, services } from "@/content-large"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.repairs.title, description: seo.repairs.description, path: "/repairs" })

export default function RepairsIndexPage() {
  return (
    <>
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.repairs }]} className="mb-3" />
          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {repairsPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              <Linked link={repairsPage.link}>{repairsPage.lede}</Linked>
            </Text>
            {repairsPage.intro.map((para) => (
              <Text key={para} className="mt-4">
                {para}
              </Text>
            ))}
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <ServiceCard service={s} as="h2" />
              </li>
            ))}
          </ul>

          <h2 className="mt-16 font-display text-title-md text-ink">{repairsPage.problemsTitle}</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-1 md:grid-cols-2">
            {problems.map((p) => {
              const guide = guides.find((g) => g.services.includes(p.service))
              return (
                <li key={p.problem} className="flex flex-wrap items-center justify-between gap-x-4">
                  <Link href={`/repairs/${p.service}`} className="flex min-h-11 items-center py-2 text-body-sm text-ink underline-offset-4 hover:underline">
                    {p.problem}
                  </Link>
                  {guide && (
                    <Link href={`/guides/${guide.slug}`} className="flex min-h-11 items-center py-2 text-body-sm text-steel underline-offset-4 hover:text-ink hover:underline">
                      {repairsPage.guideFor}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          <h2 className="mt-16 font-display text-title-md text-ink">{repairsPage.brandsTitle}</h2>
          <Text tone="muted" className="mt-3 max-w-2xl">
            {repairsPage.brandsLede}
          </Text>
          <ul className="mt-4 flex flex-wrap gap-x-8">
            {[...brands.map((b) => ({ href: `/repairs/${b.slug}`, label: b.name })), { href: "/repairs/iphone", label: brandPage.apple }].map((b) => (
              <li key={b.href}>
                <Link href={b.href} className="flex min-h-11 items-center py-2 text-body-md text-ink underline-offset-4 hover:underline">
                  {b.label}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-16 font-display text-title-md text-ink">{repairsPage.guidesTitle}</h2>
          <Text tone="muted" className="mt-3 max-w-2xl">
            {repairsPage.guidesLede}
          </Text>
          <ul className="mt-4 grid gap-x-8 gap-y-1 md:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="flex min-h-11 items-center py-2 text-body-sm text-ink underline-offset-4 hover:underline">
                  {g.title}
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
