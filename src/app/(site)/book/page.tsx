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
    <Section first className="flex flex-col">
      <Container className="flex flex-1 flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <Heading as="h1" size="display-xl" rule>
            {booking.title}
          </Heading>
          <Text tone="muted" className="mt-4 max-w-120">
            {booking.lede}
          </Text>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-caption text-steel max-lg:hidden">
            <Button asChild variant="whatsapp">
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={actions.whatsappLabel} data-track="whatsapp" data-track-from="book">
                <WhatsAppIcon />
                {actions.whatsapp}
              </a>
            </Button>
            <a href={site.phone.href} className="font-display text-body-sm font-bold text-ink no-underline" data-track="call" data-track-from="book">
              {site.phone.display}
            </a>
            <span className="text-signal-active">{site.address.short}</span>
            <OpenStatus />
          </div>
        </div>
        <Card className="min-w-0 p-5 max-md:flex-1 sm:p-7">
          {/* The static HTML has the plain flow; the client reads ?service= and narrows it. */}
          <Suspense fallback={<BookingFlow />}>
            <BookFromUrl />
          </Suspense>
        </Card>
      </Container>
    </Section>
  )
}
