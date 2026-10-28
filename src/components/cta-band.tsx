import Link from "next/link"

import { WhatsAppIcon } from "@/components/icon"
import { Container, Section } from "@/components/layout"
import { Reveal } from "@/components/motion"
import { Heading } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { actions, cta, site } from "@/content"

/** Ink band: one line and the two actions. */
export function CtaBand() {
  return (
    <Section>
      <Container>
        <Reveal className="rounded-xl bg-band px-6 py-12 md:px-14 md:py-16">
          <Heading className="max-w-2xl text-on-band">{cta.title}</Heading>
          <div className="mt-8 flex gap-2.5">
            <Button asChild size="lg" variant="inverse" arrow className="flex-1 sm:flex-none">
              <Link href="/book">{actions.book}</Link>
            </Button>
            <Button asChild size="lg" variant="whatsapp" className="flex-1 sm:flex-none">
              <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
                <WhatsAppIcon />
                {actions.whatsapp}
              </a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
