import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Container, Section } from "@/components/layout"
import { ServiceCard } from "@/components/service-card"
import { Heading, Text } from "@/components/typography"
import { breadcrumbs, problems, repairsPage, seo } from "@/content"
import { services } from "@/content-large"
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
              {repairsPage.lede}
            </Text>
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
