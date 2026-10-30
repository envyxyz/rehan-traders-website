import type { Metadata } from "next"
import { Suspense } from "react"

import { Estimator, EstimatorFromUrl } from "@/components/estimator"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { Card } from "@/components/ui/card"
import { estimator } from "@/content"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: estimator.seo.title, description: estimator.seo.description, path: "/estimate" })

export default function EstimatePage() {
  return (
    <Section className="pt-28 lg:pt-32">
      <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <Heading as="h1" size="display-xl" rule>
            {estimator.title}
          </Heading>
          <Text tone="muted" className="mt-4 max-w-120">
            {estimator.lede}
          </Text>
        </div>
        <Card className="w-full max-w-estimate min-w-0 p-5 sm:p-7 lg:justify-self-end">
          {/* The static HTML has the picker; the client reads ?q= from the homepage box and opens the Describe tab with it. */}
          <Suspense fallback={<Estimator />}>
            <EstimatorFromUrl />
          </Suspense>
        </Card>
      </Container>
    </Section>
  )
}
