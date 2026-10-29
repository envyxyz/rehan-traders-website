import type { Metadata } from "next"
import { Suspense } from "react"

import { Estimator, EstimatorFromUrl } from "@/components/estimator"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { Card } from "@/components/ui/card"
import { estimator } from "@/content"

export const metadata: Metadata = {
  title: estimator.seo.title,
  description: estimator.seo.description,
  alternates: { canonical: "/estimate" },
  openGraph: { title: estimator.seo.title, description: estimator.seo.description, url: "/estimate" },
}

export default function EstimatePage() {
  return (
    <Section className="pt-28 lg:pt-40">
      <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <Heading as="h1" size="display-xl" rule>
            {estimator.title}
          </Heading>
          <Text tone="muted" className="mt-4 max-w-120">
            {estimator.lede}
          </Text>
        </div>
        <Card className="min-w-0 p-5 sm:p-7">
          {/* The static HTML has the picker; the client reads ?q= from the homepage box and runs it. */}
          <Suspense fallback={<Estimator />}>
            <EstimatorFromUrl />
          </Suspense>
        </Card>
      </Container>
    </Section>
  )
}
