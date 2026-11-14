import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { HoursTable } from "@/components/hours-table"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { ArrowRight } from "@/components/icons"
import { Img } from "@/components/img"
import { JsonLd } from "@/components/json-ld"
import { InteractiveMap } from "@/components/interactive-map"
import { Container, Section } from "@/components/layout"
import { OpenStatus } from "@/components/open-status"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { actions, brandPage, breadcrumbs, seo, site, ui, visit, visitPage } from "@/content"
import { brands, services } from "@/content-large"
import { faqSchema, storeSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.visit.title, description: seo.visit.description, path: "/visit" })

export default function VisitPage() {
  return (
    <>
      <JsonLd data={storeSchema} />
      <JsonLd data={faqSchema(visitPage.faq)} />
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.visit }]} className="mb-3" />

          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <Heading as="h1" size="display-xl" rule>
                {visitPage.title}
              </Heading>
              <Text tone="muted" size="body-md" className="mt-4">
                {visitPage.lede}
              </Text>

              <address className="mt-8 space-y-1 not-italic font-display text-title-md font-semibold text-ink">
                {site.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>

              <OpenStatus className="mt-4 text-body-sm text-body" />

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" arrow>
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" data-track="directions" data-track-from="visit">
                    {actions.directions}
                    <span className="sr-only">, {ui.externalLink}</span>
                  </a>
                </Button>
                <Button asChild size="lg" variant="whatsapp">
                  <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={actions.whatsappLabel} data-track="whatsapp" data-track-from="visit">
                    <WhatsAppIcon />
                    {actions.whatsapp}
                  </a>
                </Button>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-title-md text-ink">{visitPage.hoursTitle}</h2>
                <HoursTable ink className="mt-4" />
                <Text tone="muted" size="body-sm" className="mt-4">
                  {visitPage.hoursNote}
                </Text>
              </div>
            </div>

            <div className="lg:col-span-6">
              {/* Tap to load map: no iframe on initial HTML */}
              <InteractiveMap>
                <Img
                  name="storefront"
                  alt={visitPage.mapAlt}
                  priority
                  sizes="(min-width: 1024px) 600px, calc(100vw - 2rem)"
                  className="size-full object-cover"
                />
              </InteractiveMap>
            </div>
          </div>
        </Container>
      </Section>

      {/* How to find G-88 in Hafeez Center */}
      <Section tone="panel">
        <Container>
          <Heading as="h2">{visitPage.directionsTitle}</Heading>
          <Text tone="muted" className="mt-3">
            {visit.directions}
          </Text>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              [visitPage.signLabel, visitPage.signValue],
              [visitPage.floorLabel, visitPage.floorValue],
              ...(visitPage.landmarksValue ? [[visitPage.landmarksLabel, visitPage.landmarksValue]] : []),
            ].map(([label, value]) => (
              <Card key={label} className="p-5">
                <span className="font-display text-caption font-bold text-steel">{label}</span>
                <Text tone="body" size="body-sm" className="mt-1">
                  {value}
                </Text>
              </Card>
            ))}
          </div>

          <Link
            href="/courier"
            className="mt-6 inline-flex min-h-11 items-center gap-1 font-display text-body-sm font-bold text-ink underline-offset-4 hover:underline"
          >
            {visitPage.courierLink}
            <Icon icon={ArrowRight} size="sm" />
          </Link>
        </Container>
      </Section>

      {/* Contact number: what people search before they walk in. */}
      <Section>
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Heading as="h2">{visitPage.contactTitle}</Heading>
          </div>
          <div className="lg:col-span-7">
            <Text size="body-md">{visitPage.contactText}</Text>
            <Text className="mt-3">{visitPage.contactSend}</Text>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={site.phone.href} data-track="call" data-track-from="visit">
                  {actions.call}
                </a>
              </Button>
              <Button asChild size="lg" variant="whatsapp">
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={actions.whatsappLabel} data-track="whatsapp" data-track-from="visit-contact">
                  <WhatsAppIcon />
                  {actions.whatsapp}
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* What the shop repairs: every repair page and every brand page, linked from the page people land on for "Hafeez Center". */}
      <Section tone="panel">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Heading as="h2">{visitPage.repairsTitle}</Heading>
            <Text tone="muted" className="mt-3">
              {visitPage.repairsText}
            </Text>
            <ul className="mt-4">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/repairs/${s.slug}`} className="flex min-h-11 items-center gap-1.5 py-2 text-body-md text-ink underline-offset-4 hover:underline">
                    {s.title}
                    <Icon icon={ArrowRight} size="sm" className="shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <Heading as="h2">{visitPage.brandsTitle}</Heading>
            <Text tone="muted" className="mt-3">
              {visitPage.brandsText}
            </Text>
            <ul className="mt-4">
              {[...brands.map((b) => ({ href: `/repairs/${b.slug}`, label: b.name })), { href: "/repairs/iphone", label: brandPage.apple }].map((b) => (
                <li key={b.href}>
                  <Link href={b.href} className="flex min-h-11 items-center gap-1.5 py-2 text-body-md text-ink underline-offset-4 hover:underline">
                    {b.label}
                    <Icon icon={ArrowRight} size="sm" className="shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading as="h2">{visitPage.photosTitle}</Heading>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {visitPage.photos.map((name) => (
              <li key={name}>
                <Img name={name} sizes="(min-width: 1024px) 380px, (min-width: 640px) 33vw, calc(100vw - 2rem)" className="aspect-4/3 w-full rounded-xl object-cover" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="panel">
        <Container className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading as="h2">{visitPage.faqTitle}</Heading>
          </div>
          <div className="lg:col-span-7">
            <Accordion className="border-t border-hairline">
              {visitPage.faq.map((f) => (
                <AccordionItem key={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
