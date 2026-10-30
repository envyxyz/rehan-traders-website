import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Container, Section } from "@/components/layout"
import { ReviewCarousel } from "@/components/review-carousel"
import { Stars } from "@/components/stars"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { breadcrumbs, reviews, reviewsPage, seo, ui } from "@/content"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.reviews.title, description: seo.reviews.description, path: "/reviews" })

export default function ReviewsPage() {
  return (
    <>
      <Section className="pt-28 lg:pt-36">
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.reviews }]} className="mb-8" />

          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <Heading as="h1" size="display-xl" rule centered>
              {reviewsPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {reviewsPage.lede}
            </Text>

            <div className="mt-8 flex flex-col items-center gap-5">
              <div>
                <span className="font-display text-display-lg text-ink tabular-nums">
                  {reviews.rating.toFixed(1)}
                </span>
                <Stars rating={reviews.rating} className="mt-1 justify-center" />
              </div>
              <div>
                <p className="font-display text-body-md font-bold text-ink">
                  {reviewsPage.starSummary(reviews.rating)}
                </p>
                <p className="text-caption text-steel">
                  <time dateTime={reviews.asOf}>
                    {reviewsPage.asOfPrefix} {reviews.asOfLabel}
                  </time>
                </p>
              </div>
              <Button asChild size="lg" arrow>
                <a href={reviews.url} target="_blank" rel="noopener noreferrer">
                  {reviewsPage.readAllOnGoogle}
                  <span className="sr-only">, {ui.externalLink}</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <ReviewCarousel variant="all" />
            <p className="mt-6 text-center text-caption text-steel">{ui.disclaimerReviews}</p>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
