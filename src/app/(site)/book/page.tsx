import type { Metadata } from "next"
import { Suspense } from "react"

import { BookFromUrl } from "@/components/book-from-url"
import { BookingFlow } from "@/components/booking-flow"
import { WhatsAppIcon } from "@/components/icon"
import { Container, Section } from "@/components/layout"
import { OpenStatus } from "@/components/open-status"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { actions, booking, seo, site } from "@/content"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.book.title, description: seo.book.description, path: "/book" })

export default function BookPage() {
  return (
    <Section className="pt-28 lg:pt-40">
      <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <Heading as="h1" size="display-xl" rule>
            {booking.title}
          </Heading>
          <Text tone="muted" className="mt-4 max-w-120">
            {booking.lede}
          </Text>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-caption text-steel max-lg:hidden">
            <Button asChild variant="whatsapp">
              <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
                <WhatsAppIcon />
                {actions.whatsapp}
              </a>
            </Button>
            <a href={site.phone.href} className="font-display text-body-sm font-bold text-ink no-underline">
              {site.phone.display}
            </a>
            <span>{site.address.short}</span>
            <OpenStatus />
          </div>
        </div>
        <Card className="min-w-0 p-5 sm:p-7">
          {/* The static HTML has the plain flow; the client reads ?service= and narrows it. */}
          <Suspense fallback={<BookingFlow />}>
            <BookFromUrl />
          </Suspense>
        </Card>
      </Container>
    </Section>
  )
}
