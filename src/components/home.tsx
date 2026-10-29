import Link from "next/link"
import { ArrowRight, ArrowUpRight, Star } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { BeforeAfter } from "@/components/before-after"
import { HoursTable } from "@/components/hours-table"
import { Icon } from "@/components/icon"
import { Img } from "@/components/img"
import { Container, Section } from "@/components/layout"
import { Reveal } from "@/components/motion"
import { OpenStatus } from "@/components/open-status"
import { ReviewCarousel } from "@/components/review-carousel"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { actions, estimate, faq, home, process, reviews, services, site, ui, visit, type Service } from "@/content"
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

function ServiceCard({ service, lead }: { service: Service; lead?: boolean }) {
  return (
    <Card className="h-full gap-0 overflow-hidden p-0">
      <Img
        name={service.image}
        alt={service.alt}
        sizes={lead ? "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 368px, (min-width: 768px) 50vw, 100vw"}
        className={cn("w-full", lead ? "aspect-16/10" : "aspect-4/3")}
      />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <CardTitle className={cn(lead && "text-title-lg")}>{service.title}</CardTitle>
        <CardDescription className="mb-2 line-clamp-2">{service.short}</CardDescription>
        <BookButton service={service.slug} variant="line" className="mt-auto self-start">
          {actions.bookRepair}
        </BookButton>
      </div>
    </Card>
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
      </Container>
    </Section>
  )
}

function BeforeAfterSection() {
  const c = home.beforeAfter
  const frame = "aspect-4/3 w-full"
  const sizes = "(min-width: 1024px) 640px, 100vw"
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
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Heading>{c.title}</Heading>
          <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
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
        </div>
        {/* The real job card and tamper seal from the print kit (../growth/Brand/Print). */}
        <Reveal className="relative mx-auto w-full max-w-md lg:col-span-5">
          <div className="rounded-xl bg-panel p-6 sm:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized files */}
            <img
              src="/art/job-card-960.webp"
              srcSet="/art/job-card-480.webp 480w, /art/job-card-960.webp 960w"
              sizes="(min-width: 1024px) 400px, 90vw"
              width={1360}
              height={860}
              alt={c.jobCardAlt}
              loading="lazy"
              decoding="async"
              className="h-auto w-full -rotate-2 rounded-xs border border-hairline"
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file */}
          <img
            src="/art/tamper-seal-240.webp"
            width={240}
            height={240}
            alt={c.sealAlt}
            loading="lazy"
            decoding="async"
            className="absolute -right-2 -bottom-6 size-24 rotate-6 sm:size-28"
          />
        </Reveal>
      </Container>
    </Section>
  )
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5 text-star", className)} role="img" aria-label={ui.stars(rating)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} aria-hidden className={cn("size-4 fill-current", i >= Math.round(rating) && "opacity-30")} strokeWidth={0} />
      ))}
    </span>
  )
}

function Reviews() {
  const c = home.reviews
  return (
    <Section tone="panel">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Heading>{c.title}</Heading>
          <p className="mt-6 flex items-center gap-3">
            <b className="font-display text-display-lg text-ink tabular-nums">{reviews.rating.toFixed(1)}</b>
            <span>
              <Stars rating={reviews.rating} />
              <span className="mt-1 block text-body-sm text-body">{c.summary(reviews.count)}</span>
            </span>
          </p>
          <p className="mt-2 text-caption text-steel">
            <time dateTime={reviews.asOf}>{c.asOf(reviews.asOfLabel)}</time>
          </p>
          <a href={reviews.url} target="_blank" rel="noopener noreferrer" className={cn(textLink, "mt-4")}>
            {actions.readReviews(reviews.count)}
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

function Estimate() {
  return (
    <Section>
      <Container>
        <Reveal className="grid gap-6 rounded-xl border border-hairline bg-card p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Heading size="display-md" className="lg:col-span-5">
            {estimate.title}
          </Heading>
          {/* The heading is the visible prompt; the label stays for screen readers. */}
          <form action="/estimate" method="get" className="flex flex-col gap-2.5 sm:flex-row lg:col-span-7">
            <Label htmlFor="estimate-q" className="sr-only">
              {estimate.label}
            </Label>
            <Input id="estimate-q" name="q" placeholder={estimate.placeholder} autoComplete="off" />
            <Button type="submit" size="lg" className="sm:shrink-0">
              {estimate.submit}
            </Button>
          </form>
        </Reveal>
      </Container>
    </Section>
  )
}

function Visit() {
  return (
    <Section tone="panel" id="visit">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Keyless Google embed, lazy (below the fold). Dark styling is a CSS filter on the iframe. */}
        <Reveal className="overflow-hidden rounded-xl bg-band lg:col-span-6">
          <iframe
            src={visit.mapEmbed}
            title={visit.mapTitle}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="map-dark aspect-4/3 w-full border-0"
          />
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
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
              {actions.directions}
              <span className="sr-only">, {ui.externalLink}</span>
            </a>
          </Button>
          <Text size="body-sm" tone="muted" className="mt-5">
            {visit.courier}{" "}
            <a href={site.whatsapp.href} className="text-ink underline underline-offset-4">
              {visit.courierLink}
            </a>
          </Text>
        </Reveal>
      </Container>
    </Section>
  )
}

function Faq() {
  return (
    <Section>
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
      <BeforeAfterSection />
      <Process />
      <Reviews />
      <Estimate />
      <Visit />
      <Faq />
    </>
  )
}
