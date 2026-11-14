import Link from "next/link"

import { BookButton } from "@/components/book-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CtaBand } from "@/components/cta-band"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { ArrowRight } from "@/components/icons"
import { Img } from "@/components/img"
import { JsonLd } from "@/components/json-ld"
import { Container, Section } from "@/components/layout"
import { Points } from "@/components/points"
import { ReviewCard } from "@/components/review-card"
import { Heading, Linked, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { actions, brandPage, breadcrumbs, guidesPage, repairsPage, site } from "@/content"
import { brands, guides, reviews, services, type Brand } from "@/content-large"
import { brandServiceSchema, faqSchema, storeSchema } from "@/lib/schema"
import { cn } from "@/lib/utils"

const titled = (slug: string) => services.find((s) => s.slug === slug)

/** One page per phone brand: the brand's own faults and quirks, then the repairs that fix them. Same sections as a repair page. */
export function BrandPage({ brand }: { brand: Brand }) {
  const a = repairsPage.answers
  const repairs = brand.repairs.map(titled).filter((s) => !!s)
  const proof = reviews.items.filter((r) => brand.proof?.includes(r.author))
  const forThis = brand.guides.map((slug) => guides.find((g) => g.slug === slug)).filter((g) => !!g)
  const others = brand.others.map((slug) => brands.find((b) => b.slug === slug)).filter((b) => !!b)
  const actionsRow = (from: string) => (
    <div className="flex flex-wrap items-center gap-3">
      <BookButton size="lg" arrow>
        {actions.bookRepair}
      </BookButton>
      <Button asChild size="lg" variant="whatsapp">
        <a href={site.whatsapp.withText(brandPage.whatsapp(brand.name))} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-from={from} aria-label={actions.whatsappLabel}>
          <WhatsAppIcon />
          {actions.whatsapp}
        </a>
      </Button>
    </div>
  )

  return (
    <>
      <JsonLd data={brandServiceSchema(brand)} />
      <JsonLd data={storeSchema} />
      <JsonLd data={faqSchema(brand.faq)} />
      <Section first className="flex flex-col justify-center">
        <Container>
          <Breadcrumbs items={[{ label: breadcrumbs.repairs, href: "/repairs" }, { label: brand.name }]} className="mb-3" />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Heading as="h1" size="display-xl" rule>
                {brand.title}
              </Heading>
              <Text tone="muted" size="body-md" className="mt-4 max-w-xl">
                {brand.short}
              </Text>
              <div className="mt-8">{actionsRow("brand")}</div>
            </div>
            <div className="lg:col-span-5">
              <Img name={brand.image} priority sizes="(min-width: 1024px) 480px, calc(100vw - 2rem)" className="aspect-4/3 w-full rounded-xl" />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="panel">
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Heading as="h2">{brandPage.introTitle(brand.name)}</Heading>
            {brand.intro.map((p) => (
              <Text key={p.text} className="mt-4">
                <Linked link={p.link}>{p.text}</Linked>
              </Text>
            ))}
          </div>
          <div className="lg:col-span-7">
            <Points
              items={[
                { title: a.model, text: brand.answers.model },
                {
                  title: a.what,
                  text: (
                    <>
                      {brandPage.whatLead(brand.name)}{" "}
                      {repairs.map((s, i) => (
                        <span key={s.slug}>
                          {i > 0 && ", "}
                          <Link href={`/repairs/${s.slug}`} className="text-ink underline underline-offset-4">
                            {s.title.toLowerCase()}
                          </Link>
                        </span>
                      ))}
                      .
                    </>
                  ),
                },
                { title: a.time, text: brand.answers.time },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <article className="max-w-3xl">
            {[
              { title: brand.seriesTitle, items: brand.series },
              { title: brand.table.title, table: brand.table },
              { title: brand.differTitle, items: brand.differ },
            ].map((group, n) => (
              <section key={group.title} className={n ? "mt-14" : undefined}>
                <Heading as="h2" size="title-lg">
                  {group.title}
                </Heading>
                {group.items?.map((item) => (
                  <div key={item.h} className="mt-8">
                    <h3 className="font-display text-title-md text-ink">{item.h}</h3>
                    <Text className="mt-2">
                      <Linked link={item.link}>{item.text}</Linked>
                    </Text>
                  </div>
                ))}
                {group.table && (
                  <div role="region" aria-label={group.title} tabIndex={0} className="mt-5 overflow-x-auto rounded-xl border border-hairline">
                    <table className="w-full min-w-md text-left text-body-sm">
                      <thead className="bg-panel font-display text-ink">
                        <tr>
                          {group.table.head.map((h) => (
                            <th key={h} scope="col" className="px-4 py-3 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-body">
                        {group.table.rows.map((row) => (
                          <tr key={row.join()} className="border-t border-hairline">
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
            ))}

            <section className="mt-14">
              <Heading as="h2" size="title-lg">
                {brandPage.saysTitle}
              </Heading>
              <ul className="mt-4">
                {brand.says.map((s) => (
                  <li key={s.say}>
                    <Link href={`/repairs/${s.service}`} className="flex min-h-11 items-center gap-1.5 py-2 text-body-md text-ink underline-offset-4 hover:underline">
                      {s.say}
                      <Icon icon={ArrowRight} size="sm" className="shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </Container>
      </Section>

      {proof.length > 0 && (
        <Section tone="panel">
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

      <Section tone={proof.length > 0 ? "paper" : "panel"}>
        <Container className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading as="h2">{brandPage.faqTitle(brand.name)}</Heading>
            {brand.detailPhoto && <Img name={brand.detailPhoto} sizes="(min-width: 1024px) 380px, calc(100vw - 2rem)" className="mt-8 aspect-4/3 w-full rounded-xl" />}
            {forThis.length > 0 && (
              <>
                <h3 className="mt-8 font-display text-title-md text-ink">{guidesPage.forRepair}</h3>
                <ul className="mt-2">
                  {forThis.map((g) => (
                    <li key={g.slug}>
                      <Link href={`/guides/${g.slug}`} className="flex min-h-11 items-center gap-1.5 py-2 text-body-sm text-ink underline-offset-4 hover:underline">
                        {g.title}
                        <Icon icon={ArrowRight} size="sm" className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="lg:col-span-7">
            <Accordion className="border-t border-hairline">
              {brand.faq.map((f) => (
                <AccordionItem key={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      <Section tone={proof.length > 0 ? "panel" : "paper"}>
        <Container>
          <h2 className="font-display text-title-md text-ink">{brandPage.otherBrandsTitle}</h2>
          <ul className="mt-2 flex flex-wrap gap-x-6">
            {others.map((b) => (
              <li key={b.slug}>
                <Link href={`/repairs/${b.slug}`} className="flex min-h-11 items-center gap-1.5 py-2 text-body-sm text-ink underline-offset-4 hover:underline">
                  {b.name}
                  <Icon icon={ArrowRight} size="sm" className="shrink-0" />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/repairs/iphone" className="flex min-h-11 items-center gap-1.5 py-2 text-body-sm text-ink underline-offset-4 hover:underline">
                {brandPage.apple}
                <Icon icon={ArrowRight} size="sm" className="shrink-0" />
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <CtaBand title={repairsPage.ctaTitle} />
    </>
  )
}
