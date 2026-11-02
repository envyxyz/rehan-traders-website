import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Icon } from "@/components/icon"
import { ArrowRight } from "@/components/icons"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { breadcrumbs, guidesPage, seo } from "@/content"
import { guides } from "@/content-large"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.guides.title, description: seo.guides.description, path: "/guides" })

export default function GuidesIndexPage() {
  return (
    <>
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.guides }]} className="mb-3" />
          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {guidesPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {guidesPage.lede}
            </Text>
          </div>

          {/* Each row: the question, then its short answer. Hairlines, like the FAQ. */}
          <ul className="mt-12 max-w-3xl border-t border-hairline">
            {guides.map((g) => (
              <li key={g.slug} className="border-b border-hairline">
                <Link href={`/guides/${g.slug}`} className="group flex items-start justify-between gap-6 py-6">
                  <span>
                    <h2 className="font-display text-title-lg text-ink underline-offset-4 group-hover:underline">{g.title}</h2>
                    <Text tone="muted" size="body-sm" as="span" className="mt-2 line-clamp-2 block">
                      {g.answer}
                    </Text>
                  </span>
                  <Icon icon={ArrowRight} size="sm" className="mt-1.5 shrink-0 text-ink" />
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
