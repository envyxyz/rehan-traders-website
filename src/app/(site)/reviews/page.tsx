import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Container, Section } from "@/components/layout"
import { ReviewCard } from "@/components/review-card"
import { Stars } from "@/components/stars"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { breadcrumbs, reviewsPage, seo, ui } from "@/content"
import { reviews } from "@/content-large"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.reviews.title, description: seo.reviews.description, path: "/reviews" })

export default function ReviewsPage() {
  return (
    <>
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.reviews }]} className="mb-3" />

          <Heading as="h1" size="display-xl" rule>
            {reviewsPage.title}
          </Heading>
          <Text tone="muted" size="body-md" className="mt-4 max-w-xl">
            {reviewsPage.lede}
          </Text>

          <p className="mt-8 flex items-center gap-3">
            <b className="font-display text-display-lg text-ink tabular-nums">{reviews.rating.toFixed(1)}</b>
            <span>
              <Stars rating={reviews.rating} />
              <span className="mt-1 block font-display text-body-md font-bold text-ink">
                {reviewsPage.starSummary(reviews.rating)}
              </span>
            </span>
          </p>
          <Button asChild size="lg" arrow className="mt-8">
            <a href={reviews.url} target="_blank" rel="noopener noreferrer">
              {reviewsPage.readAllOnGoogle}
              <span className="sr-only">, {ui.externalLink}</span>
            </a>
          </Button>

          {/* All of them at once, no script: a sceptic reads on, or stops, at their own pace. */}
          <ul className="mt-12 columns-1 gap-4 md:columns-2 xl:columns-3">
            {reviews.items.map((r) => (
              <li key={r.author} className="mb-4 break-inside-avoid">
                <ReviewCard review={r} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
