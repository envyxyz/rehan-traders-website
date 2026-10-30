import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Icon } from "@/components/icon"
import { Container, Section } from "@/components/layout"
import { Stars } from "@/components/stars"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { breadcrumbs, reviews, reviewsPage, seo, ui } from "@/content"

export const metadata: Metadata = {
  title: seo.reviews.title,
  description: seo.reviews.description,
  alternates: { canonical: "/reviews" },
  openGraph: { title: seo.reviews.title, description: seo.reviews.description, url: "/reviews" },
}

export default function ReviewsPage() {
  return (
    <>
      <Section className="pt-28 lg:pt-36">
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.reviews }]} className="mb-8" />

          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {reviewsPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {reviewsPage.lede}
            </Text>

            <div className="mt-8 flex flex-wrap items-center gap-6 rounded-xl border border-hairline bg-panel p-6">
              <div>
                <span className="font-display text-display-lg text-ink tabular-nums">
                  {reviews.rating.toFixed(1)}
                </span>
                <Stars rating={reviews.rating} className="mt-1" />
              </div>
              <div>
                <p className="font-display text-body-md font-bold text-ink">
                  {reviewsPage.starSummary(reviews.rating, reviews.count)}
                </p>
                <p className="text-caption text-steel">
                  <time dateTime={reviews.asOf}>
                    {reviewsPage.asOfPrefix} {reviews.asOfLabel}
                  </time>
                </p>
              </div>
              <div className="max-w-full sm:ml-auto">
                <Button asChild size="lg" arrow className="h-auto min-h-13 whitespace-normal py-3 text-left">
                  <a href={reviews.url} target="_blank" rel="noopener noreferrer">
                    {reviewsPage.readAllOnGoogle(reviews.count)}
                    <span className="sr-only">, {ui.externalLink}</span>
                    <Icon icon={ArrowUpRight} size="sm" />
                  </a>
                </Button>
              </div>
            </div>

            <p className="mt-4 text-caption text-steel">
              {ui.disclaimerReviews}
            </p>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.items.map((rev) => (
              <li key={`${rev.author}-${rev.date}`}>
                <Card className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="flex size-10 items-center justify-center rounded-pill bg-concrete font-display text-title-md font-bold text-ink"
                        >
                          {rev.author.charAt(0)}
                        </span>
                        <div>
                          <p className="font-display text-body-sm font-bold text-ink">{rev.author}</p>
                          <p className="text-caption text-steel">{rev.date}</p>
                        </div>
                      </div>
                      <Stars rating={rev.rating} />
                    </div>
                    <Text tone="body" size="body-sm" className="mt-4 whitespace-pre-line">
                      {rev.text}
                    </Text>
                  </div>
                  <div className="mt-6 border-t border-hairline pt-3 text-caption text-steel">
                    {reviewsPage.googleReview}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
