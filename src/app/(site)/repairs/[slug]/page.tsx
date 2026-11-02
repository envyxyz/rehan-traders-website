import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BookButton } from "@/components/book-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { Img } from "@/components/img"
import { ArrowRight, repairIcons } from "@/components/icons"
import { JsonLd } from "@/components/json-ld"
import { Container, Section } from "@/components/layout"
import { Points } from "@/components/points"
import { PriceLine } from "@/components/price-line"
import { ReviewCard } from "@/components/review-card"
import { ServiceCard } from "@/components/service-card"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { actions, breadcrumbs, repairsPage, site } from "@/content"
import { reviews, services } from "@/content-large"
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

  return pageMeta({ title: service.seo.title, description: service.seo.description, path: `/repairs/${service.slug}` })
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()

  const relatedServices = services.filter((s) => service.related.includes(s.slug))
  const proof = reviews.items.filter((r) => service.proof?.includes(r.author))
  const a = repairsPage.answers
  const actionsRow = (from: string) => (
    <div className="flex flex-wrap items-center gap-3">
      <BookButton service={service.slug} size="lg" arrow>
        {actions.bookRepair}
      </BookButton>
      <Button asChild size="lg" variant="whatsapp">
        <a href={site.whatsapp.withText(repairsPage.whatsapp(service.title))} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-from={from} aria-label={actions.whatsappLabel}>
          <WhatsAppIcon />
          {actions.whatsapp}
        </a>
      </Button>
    </div>
  )

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      {service.faq.length > 0 && <JsonLd data={faqSchema(service.faq)} />}
      <Section first>
        <Container>
          <Breadcrumbs
            items={[
              { label: breadcrumbs.repairs, href: "/repairs" },
              { label: service.title },
            ]}
            className="mb-3"
          />

          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Heading as="h1" size="display-xl" rule>
                {service.title}
              </Heading>
              <Text tone="muted" size="body-md" className="mt-4 max-w-xl">
                {service.short}
              </Text>
              <PriceLine priceFrom={service.priceFrom} className="mt-6" />
              <div className="mt-8">{actionsRow("repair")}</div>
            </div>

            <div className="lg:col-span-5">
              {/* A real photo from the desk, with the repair's icon on it. */}
              <div className="relative">
                <Img name={service.image} priority sizes="(min-width: 1024px) 480px, calc(100vw - 2rem)" className="aspect-4/3 w-full rounded-xl" />
                <span aria-hidden className="absolute top-3 left-3 grid size-12 place-items-center rounded-lg bg-card">
                  <Icon icon={repairIcons[service.slug]} size="xl" className="text-signal" />
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The six questions, in the order a customer asks them, then the action. */}
      <Section tone="panel">
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Heading as="h2">{repairsPage.answersTitle}</Heading>
          </div>
          <div className="lg:col-span-7">
            <Points
              items={[
                { title: a.model, text: service.answers.model },
                {
                  title: a.what,
                  text: (
                    <>
                      {service.long}
                      <span className="mt-3 flex flex-wrap gap-2">
                        {service.faults.map((fault) => (
                          <span key={fault} className="inline-flex items-center rounded-pill border border-hairline bg-card px-3.5 py-1.5 font-display text-body-sm font-semibold text-ink">
                            {fault}
                          </span>
                        ))}
                      </span>
                    </>
                  ),
                },
                { title: a.time, text: service.answers.time },
                { title: a.price, text: a.priceText },
                { title: a.warranty, text: a.warrantyText },
                {
                  title: a.next,
                  text: (
                    <>
                      {a.nextText}{" "}
                      <Link href="/courier" className="text-ink underline underline-offset-4">
                        {a.courier}
                      </Link>
                    </>
                  ),
                },
              ]}
            />
            <div className="mt-7">{actionsRow("repair-answers")}</div>
          </div>
        </Container>
      </Section>

      {proof.length > 0 && (
        <Section>
          <Container>
            <Heading as="h2" size="display-md" className="sm:text-display-lg">
              {repairsPage.proofTitle}
            </Heading>
            <ul className="mt-8 grid gap-4 lg:grid-cols-3">
              {proof.map((r) => (
                <li key={r.author}>
                  <ReviewCard review={r} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* How it works */}
      <Section tone={proof.length > 0 ? "panel" : "paper"}>
        <Container>
          <Heading as="h2">{repairsPage.howItWorks}</Heading>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.howItWorks.map((st) => (
              <li key={st.step} className="rounded-xl border border-hairline bg-card p-6">
                <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                  {st.step}
                </span>
                <h3 className="mt-3 font-display text-title-md text-ink">{st.title}</h3>
                <Text tone="muted" className="mt-2">
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
              <Text tone="muted" className="mt-3">
                {repairsPage.bookLede}
              </Text>
            </div>
            <div className="lg:col-span-7">
              <Accordion className="border-t border-hairline">
                {service.faq.map((f) => (
                  <AccordionItem key={f.q}>
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
              <Heading as="h2" size="display-md" className="min-w-0 sm:text-display-lg">
                {repairsPage.relatedTitle}
              </Heading>
              <Link
                href="/repairs"
                className="inline-flex min-h-11 items-center gap-1.5 font-display text-button whitespace-nowrap text-ink underline-offset-4 hover:underline"
              >
                {actions.allRepairs}
                <Icon icon={ArrowRight} size="sm" />
              </Link>
            </div>

            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedServices.map((rel) => (
                <li key={rel.slug}>
                  <ServiceCard service={rel} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBand title={repairsPage.ctaTitle} />
    </>
  )
}
