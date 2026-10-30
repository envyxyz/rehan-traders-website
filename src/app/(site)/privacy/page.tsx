import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { breadcrumbs, privacyPage, seo } from "@/content"

export const metadata: Metadata = {
  title: seo.privacy.title,
  description: seo.privacy.description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: seo.privacy.title, description: seo.privacy.description, url: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <>
      <Section className="pt-28 lg:pt-36">
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.privacy }]} className="mb-8" />

          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {privacyPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {privacyPage.lede}
            </Text>
            <p className="mt-2 text-caption text-steel">
              {privacyPage.lastUpdated}
            </p>
          </div>

          <div className="mt-12 max-w-3xl space-y-10">
            {privacyPage.sections.map((sec) => (
              <div key={sec.title} className="border-t border-hairline pt-8">
                <h2 className="font-display text-title-lg text-ink">{sec.title}</h2>
                <Text tone="body" className="mt-3">
                  {sec.text}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
