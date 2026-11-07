import dynamic from "next/dynamic"
import Link from "next/link"

import { StepCard } from "@/components/courier-steps"
import { HoursTable } from "@/components/hours-table"
import { Icon } from "@/components/icon"
import { ArrowRight, ArrowUpRight } from "@/components/icons"
import { Img } from "@/components/img"
import { InteractiveMap } from "@/components/interactive-map"
import { JobCard } from "@/components/job-card"
import { Container, Section } from "@/components/layout"
import { Points } from "@/components/points"
import { Reveal } from "@/components/reveal"
import { OpenStatus } from "@/components/open-status"
import { ReviewCard } from "@/components/review-card"
import { ServiceCard } from "@/components/service-card"
import { Stars } from "@/components/stars"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { aboutPage, actions, estimate, faq, home, jobCardContent, process, site, ui, visit, visitPage } from "@/content"
import { reviews, services } from "@/content-large"
import { cn } from "@/lib/utils"

// Hidden until a real pair exists (home.beforeAfter.show), so its code stays out of the first load until then.
const BeforeAfter = dynamic(() => import("@/components/before-after").then((m) => m.BeforeAfter))

const textLink = "inline-flex min-h-11 items-center gap-1.5 font-display text-button text-ink underline-offset-4 hover:underline"

/** Heading with an optional text link on the right, on one row at any width, the two on one baseline. */
function SectionHead({ title, link, className }: { title: string; link?: { href: string; label: string }; className?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-x-4 gap-y-2 sm:gap-x-8", className)}>
      <Heading size="display-md" className="min-w-0 sm:text-display-lg">
        {title}
      </Heading>
      {link && (
        <Link href={link.href} className={cn(textLink, "whitespace-nowrap")}>
          {link.label}
          <Icon icon={ArrowRight} size="sm" />
        </Link>
      )}
    </div>
  )
}

/** Eight cards at 1152px, not the page width, so they keep room at the sides. From lg the last two sit centred under the six above. */
function Repairs() {
  return (
    <Section id="repairs">
      <Container className="max-w-cards">
        <SectionHead title={home.repairs.title} link={{ href: "/repairs", label: actions.allRepairs }} />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => (
            <li key={s.slug} className={cn("lg:col-span-2", i === services.length - 2 && "lg:col-start-2")}>
              <Reveal className="h-full">
                <ServiceCard service={s} />
              </Reveal>
            </li>
          ))}
        </ul>
        <FindYourIssue />
      </Container>
    </Section>
  )
}

/** Under the repairs: a fault not in the list goes to /quote, which opens the Describe tab with it prefilled and sends nothing (PRD §5.6). */
function FindYourIssue() {
  return (
    <Reveal className="mt-4 grid gap-5 rounded-xl border border-hairline bg-card p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-5">
        <h3 className="font-display text-title-lg text-ink">{estimate.title}</h3>
        <Text tone="muted" className="mt-1.5">
          {estimate.lede}
        </Text>
      </div>
      <form action="/quote" method="get" className="flex flex-col gap-2.5 sm:flex-row lg:col-span-7">
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
    <Section tone="panel">
      <Container>
        <div className="max-w-2xl">
          <Heading>{c.title}</Heading>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <li key={step.title}>
              <Reveal className="h-full">
                <StepCard n={i + 1} title={step.title} text={step.text} />
              </Reveal>
            </li>
          ))}
        </ol>
        {/* The interactive job card; the tamper seal stays on /about */}
        <Reveal className="mt-12 flex justify-center">
          <div className="relative w-full max-w-2xl rounded-xl bg-paper p-4 sm:p-8">
            <JobCard withSeal={false} />
            <Text size="body-sm" tone="muted" className="mt-3 text-center">
              {jobCardContent.sampleNote}
            </Text>
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
      <Container>
        <SectionHead title={c.title} link={{ href: "/reviews", label: actions.moreReviews }} />
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1">
          <p className="flex items-center gap-3">
            <b className="font-display text-display-md text-ink tabular-nums">{reviews.rating.toFixed(1)}</b>
            <span>
              <Stars rating={reviews.rating} />
              <span className="mt-1 block text-body-sm text-body">{c.summary}</span>
            </span>
          </p>
          <a href={reviews.url} target="_blank" rel="noopener noreferrer" className={textLink}>
            {actions.readReviews}
            <span className="sr-only">, {ui.externalLink}</span>
            <Icon icon={ArrowUpRight} size="sm" />
          </a>
        </div>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {reviews.items.slice(0, reviews.featured).map((r) => (
            <li key={r.author}>
              <Reveal className="h-full">
                <ReviewCard review={r} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

function Pricing() {
  const c = home.pricing
  return (
    <Section tone="panel" id="pricing">
      <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Heading>{c.title}</Heading>
        </Reveal>
        <Reveal className="lg:col-span-7">
          <Points items={c.points} />
          <Button asChild size="lg" arrow wide className="mt-7">
            <Link href="/quote">{actions.getQuote}</Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  )
}

function Bench() {
  const c = home.bench
  const sizes = "(min-width: 1024px) 300px, calc(50vw - 1.5rem)"
  return (
    <Section id="bench">
      <Container className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="order-2 grid grid-cols-2 gap-3 lg:order-1 lg:col-span-6">
          <Img name={aboutPage.images.team} alt={aboutPage.images.teamAlt} sizes={sizes} className="aspect-square w-full rounded-lg" />
          <Img name={aboutPage.images.bench} alt={aboutPage.images.benchAlt} sizes={sizes} className="aspect-square w-full rounded-lg" />
        </Reveal>
        <Reveal className="order-1 lg:order-2 lg:col-span-6">
          <Heading>{c.title}</Heading>
          <Text className="mt-4">{c.lede}</Text>
          <div className="mt-6">
            <Points items={c.points} />
          </div>
          <div className="mt-6 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- a static export has no image optimizer */}
            <img src="/images/adnan-ali-128.webp" srcSet="/images/adnan-ali-128.webp 128w, /images/adnan-ali-192.webp 192w" sizes="4rem" width={64} height={64} alt={c.owner.alt} loading="lazy" decoding="async" className="size-16 shrink-0 rounded-full object-cover" />
            <p className="min-w-0 text-body-sm text-body">
              <b className="block font-display text-body-md text-ink">
                {c.owner.name}, {c.owner.role}
              </b>
              {c.owner.text}{" "}
              <Link href="/about" className="text-ink underline underline-offset-4">
                {c.owner.more}
              </Link>
            </p>
          </div>
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
                {l}{" "}
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
    <Section>
      <Container className="grid gap-8 lg:grid-cols-12">
        <SectionHead title={home.faq.title} link={{ href: "/faq", label: actions.allQuestions }} className="lg:col-span-4 lg:flex-col lg:items-start lg:justify-start" />
        <Reveal className="lg:col-span-8">
          <Accordion className="border-t border-hairline">
            {faq.slice(0, 5).map((f) => (
              <AccordionItem key={f.q}>
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

/**
 * Between the hero and the CTA band. The order answers the customer's fears in turn: can you fix it, what will it cost, do others trust you,
 * what happens, can I see the work, where are you (docs/LOOP-9.md has the test behind it).
 */
export function HomeSections() {
  return (
    <>
      <Repairs />
      <Pricing />
      <Reviews />
      {home.beforeAfter.show && <BeforeAfterSection />}
      <Process />
      <Bench />
      <Visit />
      <Faq />
    </>
  )
}
