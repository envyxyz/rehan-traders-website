import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { BeforeAfter } from "@/components/before-after"
import { HoursTable } from "@/components/hours-table"
import { Icon } from "@/components/icon"
import { Img } from "@/components/img"
import { InteractiveMap } from "@/components/interactive-map"
import { JobCard } from "@/components/job-card"
import { Container, Section } from "@/components/layout"
import { Reveal } from "@/components/motion"
import { OpenStatus } from "@/components/open-status"
import { ReviewCarousel } from "@/components/review-carousel"
import { ServiceCard } from "@/components/service-card"
import { Stars } from "@/components/stars"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { actions, estimate, faq, home, process, reviews, services, site, ui, visit, visitPage } from "@/content"
import { reveal } from "@/lib/tokens"
import { cn } from "@/lib/utils"

const textLink = "inline-flex min-h-11 items-center gap-1.5 font-display text-button text-ink underline-offset-4 hover:underline"

/** Heading with an optional text link on the right (desktop) or below it (phones). */
function SectionHead({ title, link, className }: { title: string; link?: { href: string; label: string }; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-2", className)}>
      <Heading>{title}</Heading>
      {link && (
        <Link href={link.href} className={textLink}>
          {link.label}
          <Icon icon={ArrowRight} size="sm" />
        </Link>
      )}
    </div>
  )
}

function Repairs() {
  const leads = services.filter((s) => s.lead)
  const rest = services.filter((s) => !s.lead)
  return (
    <Section id="repairs">
      <Container>
        <SectionHead title={home.repairs.title} link={{ href: "/repairs", label: actions.allRepairs }} />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {[...leads, ...rest].map((s, i) => (
            <li key={s.slug} className={s.lead ? "lg:col-span-3" : "lg:col-span-2"}>
              <Reveal delay={(i % 3) * reveal.stagger} className="h-full">
                <ServiceCard service={s} lead={s.lead} />
              </Reveal>
            </li>
          ))}
        </ul>
        <Estimate />
      </Container>
    </Section>
  )
}

/** Under the repairs: a fault not in the list goes to /estimate, which opens the Describe tab with it prefilled and sends nothing (PRD §5.6). */
function Estimate() {
  return (
    <Reveal className="mt-4 grid gap-5 rounded-xl border border-hairline bg-card p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-5">
        <h3 className="font-display text-title-lg text-ink">{estimate.title}</h3>
        <Text tone="muted" size="body-sm" className="mt-1.5">
          {estimate.lede}
        </Text>
      </div>
      <form action="/estimate" method="get" className="flex flex-col gap-2.5 sm:flex-row lg:col-span-7">
        <Label htmlFor="estimate-q" className="sr-only">
          {estimate.label}
        </Label>
        <Input id="estimate-q" name="q" required minLength={3} maxLength={500} placeholder={estimate.placeholder} autoComplete="off" enterKeyHint="go" />
        <Button type="submit" size="lg" className="sm:shrink-0">
          {estimate.submit}
        </Button>
      </form>
    </Reveal>
  )
}

function BeforeAfterSection() {
  const c = home.beforeAfter
  const frame = "aspect-4/3 w-full"
  const sizes = "(min-width: 1024px) 640px, calc(100vw - 2rem)"
  return (
    <Section tone="panel">
      <Container className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <Heading>{c.title}</Heading>
          <Text tone="muted" className="mt-4">
            {c.caption}
          </Text>
        </Reveal>
        <figure className="lg:col-span-8">
          <BeforeAfter
            before={<Img name={c.before.image} alt={c.before.alt} sizes={sizes} className={cn(frame, "bg-hairline")} />}
            after={<Img name={c.after.image} alt={c.after.alt} sizes={sizes} className={frame} />}
          />
          <figcaption className="sr-only">{c.caption}</figcaption>
        </figure>
      </Container>
    </Section>
  )
}

function Process() {
  const c = home.process
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <Heading>{c.title}</Heading>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * reveal.stagger}>
                <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-title-md text-ink">{step.title}</h3>
                <Text tone="muted" size="body-sm" className="mt-1.5">
                  {step.text}
                </Text>
              </Reveal>
            </li>
          ))}
        </ol>
        {/* The interactive job card; the tamper seal stays on /about */}
        <Reveal className="mt-12 flex justify-center">
          <div className="relative w-full max-w-2xl rounded-xl bg-panel p-4 sm:p-8">
            <JobCard withSeal={false} />
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

function Reviews() {
  const c = home.reviews
  return (
    <Section>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Heading>{c.title}</Heading>
          <p className="mt-6 flex items-center gap-3">
            <b className="font-display text-display-lg text-ink tabular-nums">{reviews.rating.toFixed(1)}</b>
            <span>
              <Stars rating={reviews.rating} />
              <span className="mt-1 block text-body-sm text-body">{c.summary}</span>
            </span>
          </p>
          <a href={reviews.url} target="_blank" rel="noopener noreferrer" className={cn(textLink, "mt-4")}>
            {actions.readReviews}
            <span className="sr-only">, {ui.externalLink}</span>
            <Icon icon={ArrowUpRight} size="sm" />
          </a>
        </Reveal>
        <Reveal className="lg:col-span-7">
          <ReviewCarousel />
        </Reveal>
      </Container>
    </Section>
  )
}

function Visit() {
  return (
    <Section tone="panel" id="visit">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Tap to load: nothing from google.com/maps until then (PRD §8). */}
        <Reveal className="lg:col-span-6">
          <InteractiveMap>
            <Img name="storefront" alt={visitPage.mapAlt} sizes="(min-width: 1024px) 560px, calc(100vw - 2rem)" className="size-full object-cover" />
          </InteractiveMap>
        </Reveal>
        <Reveal className="lg:col-span-6 lg:pl-4">
          <Heading>{visit.title}</Heading>
          <address className="mt-5 not-italic text-body-md text-body">
            {site.address.lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <OpenStatus className="mt-4 text-body-sm text-body" />
          <HoursTable className="mt-4" />
          <Button asChild size="lg" arrow className="mt-7">
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" data-track="directions" data-track-from="visit">
              {actions.directions}
              <span className="sr-only">, {ui.externalLink}</span>
            </a>
          </Button>
          <Text size="body-sm" tone="muted" className="mt-5">
            {visit.courier}{" "}
            <Link href="/courier" className="text-ink underline underline-offset-4">
              {visit.courierLink}
            </Link>
          </Text>
        </Reveal>
      </Container>
    </Section>
  )
}

function Faq() {
  return (
    <Section tone="panel">
      <Container className="grid gap-8 lg:grid-cols-12">
        <SectionHead title={home.faq.title} link={{ href: "/faq", label: actions.allQuestions }} className="lg:col-span-4 lg:flex-col lg:items-start lg:justify-start" />
        <Reveal className="lg:col-span-8">
          <Accordion type="single" collapsible className="border-t border-hairline">
            {faq.slice(0, 5).map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </Section>
  )
}

/** PRD §5 sections 2 to 8, between the hero and the CTA band. */
export function HomeSections() {
  return (
    <>
      <Repairs />
      {home.beforeAfter.show && <BeforeAfterSection />}
      <Process />
      <Visit />
      <Reviews />
      <Faq />
    </>
  )
}
