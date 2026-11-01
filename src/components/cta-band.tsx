import { BookButton } from "@/components/book-button"
import { WhatsAppIcon } from "@/components/icon"
import { Container, Section } from "@/components/layout"
import { Reveal } from "@/components/reveal"
import { Heading } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { actions, cta, site } from "@/content"

/** Ink band: one line and the two actions. */
export function CtaBand({ title = cta.title }: { title?: string }) {
  return (
    <Section>
      <Container>
        <Reveal className="flex flex-col gap-8 rounded-xl bg-band px-6 py-12 md:px-14 md:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <Heading className="text-on-band">{title}</Heading>
          <div className="grid gap-3 sm:flex sm:flex-wrap lg:shrink-0">
            <BookButton size="lg" variant="inverse" arrow wide>
              {actions.start}
            </BookButton>
            <Button asChild size="lg" variant="whatsapp">
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={actions.whatsappLabel} data-track="whatsapp" data-track-from="cta">
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
