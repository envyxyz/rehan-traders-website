import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { WhatsAppIcon } from "@/components/icon"
import { Container, Section } from "@/components/layout"
import { JsonLd } from "@/components/json-ld"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { actions, breadcrumbs, faq, faqPage, seo, site } from "@/content"
import { faqSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.faq.title, description: seo.faq.description, path: "/faq" })

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faq)} />
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.faq }]} className="mb-3" />

          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {faqPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {faqPage.lede}
            </Text>
          </div>

          <div className="mt-12 max-w-3xl">
            <Accordion className="border-t border-hairline">
              {faq.map((f) => (
                <AccordionItem key={f.q}>
                  <AccordionTrigger as="h2" className="text-left font-display text-title-md font-bold text-ink">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-body-md text-body">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 rounded-xl border border-hairline bg-panel p-6 sm:p-8">
              <h2 className="font-display text-title-md text-ink">{faqPage.stillHaveQuestions}</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="whatsapp">
                  <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-from="faq">
                    <WhatsAppIcon />
                    {faqPage.askWhatsApp}
                  </a>
                </Button>
                <Button asChild variant="line">
                  <a href={site.phone.href} data-track="call" data-track-from="faq">
                    {actions.call} {site.phone.display}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
