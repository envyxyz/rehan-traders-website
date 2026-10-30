import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Img } from "@/components/img"
import { JsonLd } from "@/components/json-ld"
import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { Card } from "@/components/ui/card"
import { aboutPage, breadcrumbs, home, seo } from "@/content"
import { storeSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.about.title, description: seo.about.description, path: "/about" })

export default function AboutPage() {
  return (
    <>
      <JsonLd data={storeSchema} />
      <Section className="pt-28 lg:pt-36">
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.about }]} className="mb-8" />

          <div className="max-w-3xl">
            <Heading as="h1" size="display-xl" rule>
              {aboutPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              {aboutPage.lede}
            </Text>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Heading as="h2">{aboutPage.sinceTitle}</Heading>
              <Text tone="body" className="mt-4">
                {aboutPage.sinceText}
              </Text>

              <div className="mt-8 border-t border-hairline pt-8">
                <Heading as="h2">{aboutPage.panelTitle}</Heading>
                <Text tone="body" className="mt-4">
                  {aboutPage.panelText}
                </Text>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Img
                name={aboutPage.images.team}
                alt={aboutPage.images.teamAlt}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="aspect-4/3 w-full rounded-xl border border-hairline"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* The bench & Adnan at work */}
      <Section tone="panel">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="order-2 lg:order-1 lg:col-span-6">
              <Img
                name={aboutPage.images.bench}
                alt={aboutPage.images.benchAlt}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="aspect-4/3 w-full rounded-xl border border-hairline"
              />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6">
              <Heading as="h2">{aboutPage.benchTitle}</Heading>
              <Text tone="body" className="mt-4">
                {aboutPage.benchText}
              </Text>

              <div className="mt-8 border-t border-hairline pt-8">
                <Heading as="h2">{aboutPage.adnanTitle}</Heading>
                <span className="mt-1 block font-display text-caption font-semibold text-steel">
                  {aboutPage.adnanRole}
                </span>
                <Text tone="body" className="mt-3">
                  {aboutPage.adnanText}
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The job card process */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Heading as="h2">{aboutPage.processTitle}</Heading>
            <Text tone="muted" className="mt-3">
              {aboutPage.processText}
            </Text>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutPage.processSteps.map((st) => (
              <Card key={st.step} className="p-6">
                <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                  {st.step}
                </span>
                <h3 className="mt-3 font-display text-title-md text-ink">{st.title}</h3>
                <Text tone="muted" size="body-sm" className="mt-2">
                  {st.text}
                </Text>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="relative w-full max-w-md rounded-xl bg-panel p-6 sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file */}
              <img
                src="/art/job-card-960.webp"
                srcSet="/art/job-card-480.webp 480w, /art/job-card-960.webp 960w"
                sizes="(min-width: 1024px) 400px, 90vw"
                width={1360}
                height={860}
                alt={home.process.jobCardAlt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full -rotate-1 rounded-xs border border-hairline"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file */}
              <img
                src="/art/tamper-seal-240.webp"
                width={240}
                height={240}
                alt={home.process.sealAlt}
                loading="lazy"
                decoding="async"
                className="absolute -right-2 -bottom-4 size-20 rotate-6 sm:size-24"
              />
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
