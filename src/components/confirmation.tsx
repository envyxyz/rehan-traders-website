"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarPlus } from "lucide-react"

import { BOOKING_KEY } from "@/components/booking-flow"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { actions, booking, site, type BookingSummary } from "@/content"
import { track } from "@/lib/track"

const noSubscribe = () => () => {}
const readBooking = () => {
  try {
    return sessionStorage.getItem(BOOKING_KEY)
  } catch {
    return null
  }
}

/** iCalendar text, escaped per RFC 5545. Times in UTC; a visit is 30 minutes. */
const ics = (b: BookingSummary) => {
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`)
  const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"
  const start = new Date(b.slot!)
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rehan Traders//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@rehanmobiletraders.com`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(new Date(start.getTime() + 30 * 60_000))}`,
    `SUMMARY:${esc(booking.ics.summary)}`,
    `DESCRIPTION:${esc(booking.ics.description(b.ref))}`,
    `LOCATION:${esc(site.address.lines.join(", "))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

/** /book/confirmed. The booking comes from sessionStorage (never the URL), so the static HTML renders nothing. */
export function Confirmation() {
  const raw = React.useSyncExternalStore(noSubscribe, readBooking, () => undefined)
  const b = React.useMemo(() => (raw ? (JSON.parse(raw) as BookingSummary) : null), [raw])
  if (raw === undefined) return null

  if (!b)
    return (
      <div className="flex flex-col items-start gap-6">
        <Heading as="h1" size="display-lg">
          {booking.confirmed.missing}
        </Heading>
        <Button asChild size="lg" arrow>
          <Link href="/book">{actions.book}</Link>
        </Button>
      </div>
    )

  const c = booking.confirmed
  const title = !b.saved ? c.failedTitle : b.kind === "quote" ? c.quoteTitle : c.title
  const lede = !b.saved ? c.failedLede : b.kind === "quote" ? c.quoteLede : c.lede
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div>
        <Heading as="h1" size="display-lg">
          {title}
        </Heading>
        <Text tone="muted" className="mt-3">
          {lede}
        </Text>
      </div>

      {/* The ticket: a stub with the job number, a tear line with notches cut to the page colour, then the details and
          the WhatsApp handoff. Side by side from sm up, so the whole ticket fits on one screen. */}
      <div className="flex flex-col rounded-xl bg-panel sm:min-h-96 sm:flex-row">
        <div className="flex items-center justify-between gap-6 p-6 sm:w-64 sm:shrink-0 sm:flex-col sm:items-start sm:justify-between sm:p-8 lg:w-80">
          <div>
            <p className="text-body-sm text-steel">{b.saved ? c.number : c.reference}</p>
            <p className="mt-1 font-display text-display-lg whitespace-nowrap text-signal tabular-nums">{b.ref}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file */}
          <img src="/art/tamper-seal-240.webp" alt={c.sealAlt} width={120} height={120} className="size-16 shrink-0 sm:size-20" />
        </div>
        <div aria-hidden className="relative h-6 shrink-0 sm:h-auto sm:w-6">
          <span className="absolute top-0 -left-3 size-6 rounded-full bg-paper sm:-top-3 sm:left-0" />
          <span className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-hairline sm:inset-x-auto sm:inset-y-6 sm:left-1/2 sm:border-t-0 sm:border-l-2" />
          <span className="absolute top-0 -right-3 size-6 rounded-full bg-paper sm:top-auto sm:right-auto sm:-bottom-3 sm:left-0" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-6 pt-4 sm:p-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
            {[
              [booking.review.device, b.device],
              [booking.review.fault, b.fault],
              [c.visit, b.visit ?? booking.review.quoteVisit],
              [booking.review.name, b.name],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-body-sm text-steel">{label}</dt>
                <dd className="mt-0.5 text-body-md font-semibold break-words text-ink">{value}</dd>
              </div>
            ))}
            <div className="col-span-2 lg:col-span-4">
              <dt className="text-body-sm text-steel">{c.where}</dt>
              <dd className="mt-0.5 text-body-md text-ink">{site.address.lines.join(", ")}</dd>
            </div>
          </dl>
          <div className="mt-auto flex flex-wrap justify-end gap-2.5">
            {b.slot && (
              <Button asChild size="lg" variant="line">
                <a href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics(b))}`} download={booking.ics.file(b.ref)}>
                  <Icon icon={CalendarPlus} />
                  {c.calendar}
                </a>
              </Button>
            )}
            <Button asChild size="lg" variant="whatsapp">
              <a href={site.whatsapp.withText(booking.whatsapp(b))} onClick={() => track("whatsapp_click", { from: "book_confirmed" })}>
                <WhatsAppIcon />
                {c.send}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
