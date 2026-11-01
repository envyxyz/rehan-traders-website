import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { breadcrumbs, seo, termsPage } from "@/content"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.terms.title, description: seo.terms.description, path: "/terms" })

export default function TermsPage() {
  return (
    <>
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.terms }]} className="mb-3" />

          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {termsPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {termsPage.lede}
            </Text>
            <p className="mt-2 text-caption text-steel">
              {termsPage.lastUpdated}
            </p>
          </div>

          <div className="mt-12 max-w-3xl space-y-10">
            {termsPage.sections.map((sec) => (
              <div key={sec.title} className="border-t border-hairline pt-8">
                <h2 className="font-display text-title-lg text-ink">{sec.title}</h2>
                <Text tone="body" className="mt-3">
                  {sec.text}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>    </>
  )
}
