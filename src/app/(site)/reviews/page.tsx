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
      <Section className="flex min-h-svh flex-col justify-center pt-24 pb-12 lg:pt-32 lg:pb-16">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <Breadcrumbs items={[{ label: breadcrumbs.reviews }]} className="mb-6 flex justify-center" />

            <Heading as="h1" size="display-xl" rule centered>
              {reviewsPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {reviewsPage.lede}
            </Text>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <b className="font-display text-display-lg text-ink tabular-nums">{reviews.rating.toFixed(1)}</b>
                <div className="text-left">
                  <Stars rating={reviews.rating} />
                  <span className="mt-1 block font-display text-body-md font-bold text-ink">
                    {reviewsPage.starSummary(reviews.rating)}
                  </span>
                </div>
              </div>
              <Button asChild size="lg" arrow className="mt-2">
                <a href={reviews.url} target="_blank" rel="noopener noreferrer">
                  {reviewsPage.readAllOnGoogle}
                  <span className="sr-only">, {ui.externalLink}</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-2xl">
            <ReviewCarousel variant="all" />
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
