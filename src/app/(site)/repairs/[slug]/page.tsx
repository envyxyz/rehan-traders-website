import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { JsonLd } from "@/components/json-ld"
import { Img } from "@/components/img"
import { Container, Section } from "@/components/layout"
import { PriceLine } from "@/components/price-line"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { actions, breadcrumbs, repairsPage, seo, services, site } from "@/content"
import { faqSchema, serviceSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)
  if (!service) return {}

  const meta = seo.service(service.title, service.short)
  return pageMeta({ title: meta.title, description: meta.description, path: `/repairs/${service.slug}` })
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()

  const relatedServices = services.filter((s) => service.related.includes(s.slug))

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      {service.faq.length > 0 && <JsonLd data={faqSchema(service.faq)} />}
      <Section className="pt-28 lg:pt-36">
        <Container>
          <Breadcrumbs
            items={[
              { label: breadcrumbs.repairs, href: "/repairs" },
              { label: service.title },
            ]}
            className="mb-8"
          />

          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Heading as="h1" size="display-xl" rule>
                {service.title}
              </Heading>
              <Text tone="muted" size="body-md" className="mt-4 max-w-xl">
                {service.short}
              </Text>
              <PriceLine priceFrom={service.priceFrom} className="mt-6" />

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <BookButton service={service.slug} size="lg" arrow>
                  {actions.bookRepair}
                </BookButton>
                <Button asChild size="lg" variant="whatsapp">
                  <a
                    href={site.whatsapp.withText(service.title)}
                    data-track="whatsapp"
                    data-track-from="repair"
                    aria-label={actions.whatsappLabel}
                  >
                    <WhatsAppIcon />
                    {actions.whatsapp}
                  </a>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Img
                name={service.image}
                alt={service.alt}
                sizes="(min-width: 1024px) 480px, calc(100vw - 2rem)"
                className="aspect-4/3 w-full rounded-xl border border-hairline"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* What we fix */}
      <Section tone="panel">
        <Container>
          <div className="max-w-2xl">
            <Heading as="h2">{repairsPage.whatWeFix}</Heading>
            <Text tone="muted" className="mt-3">
              {service.long}
            </Text>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {service.faults.map((fault) => (
              <span
                key={fault}
                className="inline-flex items-center rounded-pill border border-hairline bg-card px-4 py-2 font-display text-body-sm font-semibold text-ink"
              >
                {fault}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section>
        <Container>
          <Heading as="h2">{repairsPage.howItWorks}</Heading>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.howItWorks.map((st) => (
              <li key={st.step} className="rounded-xl border border-hairline bg-card p-6">
                <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                  {st.step}
                </span>
                <h3 className="mt-3 font-display text-title-md text-ink">{st.title}</h3>
                <Text tone="muted" size="body-sm" className="mt-2">
                  {st.text}
                </Text>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* FAQ */}
      {service.faq.length > 0 && (
        <Section tone="panel">
          <Container className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading as="h2">{repairsPage.faqTitle}</Heading>
              <Text tone="muted" size="body-sm" className="mt-3">
                {repairsPage.bookLede}
              </Text>
            </div>
            <div className="lg:col-span-7">
              <Accordion type="single" collapsible className="border-t border-hairline">
                {service.faq.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Container>
        </Section>
      )}

      {/* Related repairs */}
      {relatedServices.length > 0 && (
        <Section>
          <Container>
            <div className="flex items-end justify-between gap-4">
              <Heading as="h2">{repairsPage.relatedTitle}</Heading>
              <Link
                href="/repairs"
                className="inline-flex min-h-11 items-center gap-1.5 font-display text-button text-ink underline-offset-4 hover:underline"
              >
                {actions.allRepairs}
                <Icon icon={ArrowRight} size="sm" />
              </Link>
            </div>

            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedServices.map((rel) => (
                <li key={rel.slug}>
                  <Card className="flex h-full flex-col justify-between overflow-hidden p-0">
                    <Img
                      name={rel.image}
                      alt={rel.alt}
                      sizes="(min-width: 1440px) 437px, (min-width: 1024px) calc(33.33vw - 2.67rem), (min-width: 768px) calc(33.33vw - 2rem), calc(100vw - 2rem)"
                      className="aspect-16/10 w-full"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <CardTitle className="text-title-md">{rel.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">{rel.short}</CardDescription>
                      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                        <Link
                          href={`/repairs/${rel.slug}`}
                          aria-label={repairsPage.viewDetailsOf(rel.title)}
                          className="inline-flex min-h-11 items-center font-display text-body-sm font-bold text-ink underline-offset-4 hover:underline"
                        >
                          {repairsPage.viewDetails}
                        </Link>
                        <BookButton service={rel.slug} variant="line">
                          {actions.bookRepair}
                        </BookButton>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBand />
    </>
  )
}
