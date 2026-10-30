"use client"

import * as React from "react"

import { WhatsAppIcon } from "@/components/icon"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { actions, site, states } from "@/content"

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Section className="flex min-h-svh flex-col justify-center pt-32 lg:pt-36">
      <Container className="text-center">
        <Heading as="h1" size="display-lg" rule className="mx-auto">
          {states.error.title}
        </Heading>
        <Text tone="muted" size="body-md" className="mx-auto mt-4 max-w-md">
          {states.error.lede}
        </Text>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => reset()}>
            {states.error.retry}
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
              <WhatsAppIcon />
              {states.error.whatsapp}
            </a>
          </Button>
          <Button asChild size="lg" variant="line">
            <a href={site.phone.href}>
              {states.error.call}
            </a>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
