import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BookButton } from "@/components/book-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { GuideFigure } from "@/components/figures"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { ArrowRight } from "@/components/icons"
import { JsonLd } from "@/components/json-ld"
import { Container, Section } from "@/components/layout"
import { ServiceCard } from "@/components/service-card"
import { Heading, Linked, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { actions, breadcrumbs, guidesPage, repairsPage, site } from "@/content"
import { guides, services } from "@/content-large"
import { articleSchema, faqSchema, howToSchema } from "@/lib/schema"
import { pageMeta } from "@/lib/page-meta"
import { cn } from "@/lib/utils"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = guides.find((g) => g.slug === slug)
  if (!guide) return {}
  return pageMeta({
    title: guide.seo.title,
    description: guide.seo.description,
    path: `/guides/${guide.slug}`,
    extra: { openGraph: { title: guide.seo.title, description: guide.seo.description, url: `/guides/${guide.slug}`, type: "article", publishedTime: guide.published, modifiedTime: guide.updated } },
  })
}

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" })

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = guides.find((g) => g.slug === slug)
  if (!guide) notFound()

  const repairs = services.filter((s) => guide.services.includes(s.slug))
  const howTo = howToSchema(guide)

  return (
    <>
      <JsonLd data={articleSchema(guide)} />
      <JsonLd data={faqSchema(guide.faq)} />
      {howTo && <JsonLd data={howTo} />}
      <Section first>
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.guides, href: "/guides" }, { label: guide.title }]} className="mb-3" />

          <div className="grid gap-12 lg:grid-cols-12">
          <article className="max-w-3xl min-w-0 lg:col-span-7">
            <Heading as="h1" size="display-xl" rule>
              {guide.title}
            </Heading>
            {/* The whole answer first: what answer boxes and AI assistants quote. */}
            <Text size="body-md" tone="ink" className="mt-5 max-w-2xl">
              {guide.answer}
            </Text>
            <Text size="caption" tone="muted" className="mt-4">
              {guidesPage.updated} <time dateTime={guide.updated}>{date(guide.updated)}</time> · {guidesPage.by}
            </Text>
            <GuideFigure guide={guide} />

            {guide.sections.map((s) => {
              const List = s.steps ? "ol" : "ul"
              return (
                <section key={s.h} className="mt-12">
                  <Heading as="h2" size="title-lg">
                    {s.h}
                  </Heading>
                  <Text className="mt-3">
                    <Linked link={s.link}>{s.answer}</Linked>
                  </Text>
                  {s.list && (
                    <List className={cn("mt-4 space-y-2 pl-5 text-body-md text-body marker:text-steel", s.steps ? "list-decimal" : "list-disc")}>
                      {s.list.map((item) => (
                        <li key={item} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </List>
                  )}
                  {s.table && (
                    <div role="region" aria-label={s.h} tabIndex={0} className="mt-5 overflow-x-auto rounded-xl border border-hairline">
                      <table className="w-full min-w-md text-left text-body-sm">
                        <thead className="bg-panel font-display text-ink">
                          <tr>
                            {s.table.head.map((h) => (
                              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-body">
                          {s.table.rows.map((row) => (
                            <tr key={row.join()} className="border-t border-hairline">
                              {/* Every cell is data: a row-header cell leaves its column's header with no data cells. */}
                              {row.map((cell, i) => (
                                <td key={i} className={cn("px-4 py-3 align-top", i === 0 && "font-semibold text-ink")}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )
            })}
          </article>

          {/* Desktop only: the way to the bench stays beside the answer. Phones get the same at the end of the page. */}
          <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div className="sticky top-28 rounded-xl border border-hairline bg-card p-6">
              <h2 className="font-display text-title-lg text-ink">{repairsPage.bookHeading}</h2>
              <Text tone="muted" size="body-sm" className="mt-2">
                {repairsPage.bookLede}
              </Text>
              <div className="mt-5 flex flex-col gap-3">
                <BookButton service={repairs[0]?.slug} arrow className="btn-wide-full w-full justify-between pl-2">
                  {actions.bookRepair}
                </BookButton>
                <Button asChild variant="whatsapp" className="w-full">
                  <a href={site.whatsapp.withText(repairsPage.whatsapp(repairs[0]?.title ?? guide.title))} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-from="guide" aria-label={actions.whatsappLabel}>
                    <WhatsAppIcon />
                    {actions.whatsapp}
                  </a>
                </Button>
              </div>
            </div>
          </aside>
          </div>
        </Container>
      </Section>

      <Section tone="panel">
        <Container className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading as="h2">{guidesPage.faqTitle}</Heading>
          </div>
          <div className="lg:col-span-7">
            <Accordion className="border-t border-hairline">
              {guide.faq.map((f) => (
                <AccordionItem key={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      {/* Guide to repair: the same cards and "All" link as a repair page's related repairs. */}
      <Section>
        <Container>
          <div className="flex items-end justify-between gap-4">
            <Heading as="h2" size="display-md" className="min-w-0 sm:text-display-lg">
              {guidesPage.repairTitle}
            </Heading>
            <Link href="/guides" className="inline-flex min-h-11 items-center gap-1.5 font-display text-button whitespace-nowrap text-ink underline-offset-4 hover:underline">
              {guidesPage.all}
              <Icon icon={ArrowRight} size="sm" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {repairs.map((r) => (
              <li key={r.slug}>
                <ServiceCard service={r} />
              </li>
            ))}
          </ul>
          {/* Guide to guide: every guide is one click from every other, in the server HTML (the nav's menu is not). */}
          <h2 className="mt-14 font-display text-title-lg text-ink">{guidesPage.more}</h2>
          <ul className="mt-2 grid gap-x-10 md:grid-cols-2">
            {guides
              .filter((g) => g.slug !== guide.slug)
              .map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="flex min-h-11 items-center gap-1.5 py-2 text-body-sm text-ink underline-offset-4 hover:underline">
                    {g.title}
                    <Icon icon={ArrowRight} size="sm" className="shrink-0" />
                  </Link>
                </li>
              ))}
          </ul>
        </Container>
      </Section>

      <CtaBand title={repairsPage.ctaTitle} />
    </>
  )
}
