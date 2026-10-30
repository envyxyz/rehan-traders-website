import type { Metadata } from "next"
import { ArrowUpRight, Package } from "lucide-react"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { HoursTable } from "@/components/hours-table"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { Img } from "@/components/img"
import { JsonLd } from "@/components/json-ld"
import { InteractiveMap } from "@/components/interactive-map"
import { Container, Section } from "@/components/layout"
import { OpenStatus } from "@/components/open-status"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { actions, breadcrumbs, seo, site, ui, visit, visitPage } from "@/content"
import { storeSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: seo.visit.title,
  description: seo.visit.description,
  alternates: { canonical: "/visit" },
  openGraph: { title: seo.visit.title, description: seo.visit.description, url: "/visit" },
}

export default function VisitPage() {
  return (
    <>
      <JsonLd data={storeSchema} />
      <Section className="pt-28 lg:pt-36">
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.visit }]} className="mb-8" />

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
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                    {actions.directions}
                    <span className="sr-only">, {ui.externalLink}</span>
                    <Icon icon={ArrowUpRight} size="sm" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="whatsapp">
                  <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
                    <WhatsAppIcon />
                    {actions.whatsapp}
                  </a>
                </Button>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-title-md text-ink">{visitPage.hoursTitle}</h2>
                <HoursTable ink className="mt-4" />
              </div>
            </div>

            <div className="lg:col-span-6">
              {/* Tap to load map: no iframe on initial HTML */}
              <InteractiveMap>
                <Img
                  name="storefront"
                  alt={visitPage.mapAlt}
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
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
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Heading as="h2">{visitPage.directionsTitle}</Heading>
              <Text tone="muted" className="mt-3">
                {visit.directions}
              </Text>

              <div className="mt-8 space-y-4">
                <Card className="p-5">
                  <span className="font-display text-caption font-bold text-steel">
                    {visitPage.entranceLabel}
                  </span>
                  <Text tone="body" size="body-sm" className="mt-1">
                    {visitPage.entranceValue}
                  </Text>
                </Card>

                <Card className="p-5">
                  <span className="font-display text-caption font-bold text-steel">
                    {visitPage.floorLabel}
                  </span>
                  <Text tone="body" size="body-sm" className="mt-1">
                    {visitPage.floorValue}
                  </Text>
                </Card>

                <Card className="p-5">
                  <span className="font-display text-caption font-bold text-steel">
                    {visitPage.landmarksLabel}
                  </span>
                  <Text tone="body" size="body-sm" className="mt-1">
                    {visitPage.landmarksValue}
                  </Text>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-6">
              <figure className="overflow-hidden rounded-xl border border-hairline bg-card">
                <Img
                  name="storefront"
                  alt={visitPage.mapAlt}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="aspect-4/3 w-full"
                />
                <figcaption className="p-4 text-caption text-steel">
                  {visitPage.mapAlt}
                </figcaption>
              </figure>
            </div>
          </div>
        </Container>
      </Section>

      {/* Courier repairs */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Icon icon={Package} />
              <Heading as="h2">{visitPage.courierTitle}</Heading>
            </div>
            <Text tone="muted" className="mt-3">
              {visitPage.courierLede}
            </Text>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Card className="p-6">
              <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                01
              </span>
              <Text tone="body" size="body-sm" className="mt-3">
                {visitPage.courierStep1}
              </Text>
            </Card>

            <Card className="p-6">
              <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                02
              </span>
              <Text tone="body" size="body-sm" className="mt-3">
                {visitPage.courierStep2}
              </Text>
            </Card>

            <Card className="p-6">
              <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                03
              </span>
              <Text tone="body" size="body-sm" className="mt-3">
                {visitPage.courierStep3}
              </Text>
            </Card>
          </div>

          <div className="mt-8 rounded-xl border border-hairline bg-concrete p-5 sm:p-6">
            <p className="text-caption font-semibold text-steel">
              {visitPage.courierNotice}
            </p>
            <div className="mt-4">
              <Button asChild variant="whatsapp" className="h-auto min-h-13 whitespace-normal py-3 text-left">
                <a href={site.whatsapp.href}>
                  <WhatsAppIcon />
                  {visitPage.courierAction}
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
