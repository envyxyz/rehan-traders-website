import type { Metadata } from "next"
import Link from "next/link"

import { BrandLogo, hasLogo } from "@/components/brand-logo"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Icon } from "@/components/icon"
import { ArrowRight } from "@/components/icons"
import { Container, Section } from "@/components/layout"
import { ServiceCard } from "@/components/service-card"
import { Heading, Linked, Text } from "@/components/typography"
import { brandPage, breadcrumbs, problems, repairsPage, seo } from "@/content"
import { brands, guides, services } from "@/content-large"
import { pageMeta } from "@/lib/page-meta"

export const metadata: Metadata = pageMeta({ title: seo.repairs.title, description: seo.repairs.description, path: "/repairs" })

// The nine brands in the order of the brand pages, Apple (the iPhone page) last.
const logoWall = [...brands.map((b) => ({ slug: b.slug, name: b.name })), { slug: "iphone", name: brandPage.apple }]

export default function RepairsIndexPage() {
  return (
    <>
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.repairs }]} className="mb-3" />
          <div className="max-w-2xl">
            <Heading as="h1" size="display-xl" rule>
              {repairsPage.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mt-4">
              <Linked link={repairsPage.link}>{repairsPage.lede}</Linked>
            </Text>
            {repairsPage.intro.map((para) => (
              <Text key={para} className="mt-4">
                {para}
              </Text>
            ))}
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <ServiceCard service={s} as="h2" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Brands as a logo wall: greyscale marks (currentColor), the name under each so the link always says where it goes. */}
      <Section id="brands" tone="panel">
        <Container>
          <Heading as="h2" size="title-lg">
            {repairsPage.brandsTitle}
          </Heading>
          <Text tone="muted" className="mt-3 max-w-2xl">
            {repairsPage.brandsLede}
          </Text>
          <ul className="mt-8 grid grid-cols-3 border-t border-l border-hairline sm:grid-cols-5 lg:grid-cols-9">
            {logoWall.map((b) => (
              <li key={b.slug} className="border-r border-b border-hairline">
                <Link
                  href={`/repairs/${b.slug}`}
                  className="group flex h-full min-h-28 flex-col items-center justify-center gap-3 px-2 py-5 text-steel transition-colors duration-base hover:bg-card hover:text-ink focus-visible:text-ink"
                >
                  <span className="flex h-8 items-center">
                    {hasLogo(b.slug) ? <BrandLogo slug={b.slug} /> : <span className="font-display text-title-md font-extrabold tracking-tight">{b.name}</span>}
                  </span>
                  <span className="text-center text-caption text-steel group-hover:text-ink">{b.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-caption text-steel">{repairsPage.brandsNote}</p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Heading as="h2" size="title-lg">
              {repairsPage.problemsTitle}
            </Heading>
            <ul className="mt-5 border-t border-hairline">
              {problems.map((p) => (
                <li key={p.problem} className="border-b border-hairline">
                  <Link href={`/repairs/${p.service}`} className="flex min-h-12 items-center justify-between gap-4 py-2.5 text-body-sm text-ink underline-offset-4 hover:underline">
                    {p.problem}
                    <Icon icon={ArrowRight} size="sm" className="shrink-0 text-steel" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <Heading as="h2" size="title-lg">
              {repairsPage.guidesTitle}
            </Heading>
            <Text tone="muted" className="mt-3">
              {repairsPage.guidesLede}
            </Text>
            <ul className="mt-5 border-t border-hairline">
              {guides.map((g) => (
                <li key={g.slug} className="border-b border-hairline">
                  <Link href={`/guides/${g.slug}`} className="flex min-h-12 items-center justify-between gap-4 py-2.5 text-body-sm text-ink underline-offset-4 hover:underline">
                    {g.title}
                    <Icon icon={ArrowRight} size="sm" className="shrink-0 text-steel" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
