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
import { Card } from "@/components/ui/card"
import { actions, breadcrumbs, seo, site, ui, visit, visitPage } from "@/content"
import { storeSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.visit.title, description: seo.visit.description, path: "/visit" })

export default function VisitPage() {
  return (
    <>
      <JsonLd data={storeSchema} />
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

      <CtaBand />
    </>
  )
}
