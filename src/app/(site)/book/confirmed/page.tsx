import type { Metadata } from "next"

import { Confirmation } from "@/components/confirmation"
import { Container, Section } from "@/components/layout"
import { seo } from "@/content"

export const metadata: Metadata = {
  title: seo.bookConfirmed.title,
  description: seo.bookConfirmed.description,
  alternates: { canonical: "/book/confirmed" },
  openGraph: { title: seo.bookConfirmed.title, description: seo.bookConfirmed.description, url: "/book/confirmed" },
  robots: { index: false, follow: false },
}

export default function ConfirmedPage() {
  return (
    // One screen tall, the ticket centred in it, so the footer starts below the fold.
    <Section className="flex min-h-svh flex-col justify-center pt-32 lg:pt-36">
      <Container className="w-full">
        <Confirmation />
      </Container>
    </Section>
  )
}
