import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CourierSteps } from "@/components/courier-steps"
import { CtaBand } from "@/components/cta-band"
import { JsonLd } from "@/components/json-ld"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { breadcrumbs, courierPage, seo } from "@/content"
import { faqSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.courier.title, description: seo.courier.description, path: "/courier" })

export default function CourierPage() {
  return (
    <>
      <JsonLd data={faqSchema(courierPage.faq)} />
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.courier }]} className="mb-3" />

          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {courierPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {courierPage.lede}
            </Text>
          </div>

          <h2 className="mt-12 font-display text-title-md text-ink">{courierPage.stepsTitle}</h2>
          <CourierSteps from="courier" />
        </Container>
      </Section>

      <Section tone="panel">
        <Container>
          <Heading as="h2">{courierPage.faqTitle}</Heading>
          <Accordion className="mt-8 max-w-3xl border-t border-hairline">
            {courierPage.faq.map((f) => (
              <AccordionItem key={f.q}>
                <AccordionTrigger as="h3" className="text-left font-display text-title-md font-bold text-ink">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-body-md text-body">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
