"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { BookButton } from "@/components/book-button"
import { DevicePicker } from "@/components/device-picker"
import { WhatsAppIcon } from "@/components/icon"
import { PhotoPicker, type Photo } from "@/components/photo-picker"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { actions, booking, estimator, priceMode, site, type BookingSummary } from "@/content"
import { MAX_INPUT, repairFor } from "@/lib/assistant"
import { BOOKING_KEY, BOOKING_LIMIT, localRef, normalizePhone, now, recentBookings, rememberBooking } from "@/lib/booking"
import { track } from "@/lib/track"
import { cn } from "@/lib/utils"

type Mode = "pick" | "describe"
type Result = { device: string; faultSlug: string }

/** /estimate?q=… (the homepage box) or ?tab=describe (the courier steps): opens the Describe tab, with the message prefilled. */
export function EstimatorFromUrl() {
  const params = useSearchParams()
  const q = params.get("q")?.slice(0, MAX_INPUT) ?? ""
  const describe = !!q || params.get("tab") === "describe"
  return <Estimator key={`${describe}|${q}`} q={q} describe={describe} />
}

/**
 * One card, two tabs. Pick device + fault shows the likely repair in place of the form; Describe it is a quote ticket
 * that goes through the booking pipeline. Every panel sits in the same grid cell, so the card is as tall as the
 * tallest one and switching tabs or showing a result never moves the page.
 */
export function Estimator({ q = "", describe = false }: { q?: string; describe?: boolean }) {
  const [mode, setMode] = React.useState<Mode>(describe ? "describe" : "pick")
  const [result, setResult] = React.useState<Result | null>(null)
  const tabs = React.useRef<HTMLDivElement>(null)

  function again() {
    setResult(null)
    // The button that held focus is gone: hand focus back to the tabs.
    requestAnimationFrame(() => tabs.current?.querySelector<HTMLElement>("[role=radio][aria-checked=true]")?.focus())
  }

  return (
    <div className="flex flex-col gap-5">
      <div ref={tabs}>
        <RadioGroup
          aria-label={estimator.mode.label}
          value={mode}
          onValueChange={(m) => {
            setMode(m as Mode)
            setResult(null)
          }}
        >
          <RadioGroupItem value="pick">{estimator.mode.pick}</RadioGroupItem>
          <RadioGroupItem value="describe">{estimator.mode.describe}</RadioGroupItem>
        </RadioGroup>
      </div>

      <div className="grid">
        <Panel active={mode === "pick" && !result}>
          <PickForm shown={!!result} onResult={setResult} />
        </Panel>
        <Panel active={mode === "describe"}>
          <TicketForm q={q} />
        </Panel>
        {result && (
          <Panel active>
            <Outcome result={result} onAgain={again} />
          </Panel>
        )}
      </div>
    </div>
  )
}

/**
 * From `lg` up every panel shares one grid cell; the inactive ones stay laid out (so the card keeps its height) but
 * unseen and unreachable. Below `lg` the card is one column, so only the active panel is laid out, at its own height.
 */
function Panel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div inert={!active} className={cn("col-start-1 row-start-1 flex min-w-0 flex-col", !active && "max-lg:hidden lg:invisible")}>
      {children}
    </div>
  )
}

/** The error sits in the submit row, beside the button (above it on a phone), so it takes no height of its own and never grows the card. */
function SubmitRow({ error, errorId, children }: { error?: string | null; errorId: string; children: React.ReactNode }) {
  return (
    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
      <p id={errorId} role="alert" className="min-w-0 text-body-sm text-error sm:flex-1">
        {error}
      </p>
      {children}
    </div>
  )
}

function PickForm({ shown, onResult }: { shown: boolean; onResult: (r: Result) => void }) {
  const [device, setDevice] = React.useState<string | null>(null)
  const [fault, setFault] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const ids = React.useId()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (shown) return // a result is already up: a repeat click does nothing
    if (!device || !fault) return setError(estimator.pickError)
    track("estimate_complete", { path: "pick", fault, service: repairFor(fault, device).service?.slug ?? null })
    onResult({ device, faultSlug: fault })
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-1 flex-col gap-5">
      <DevicePicker
        value={device}
        invalid={!!error && !device}
        describedBy={error && !device ? `${ids}-error` : undefined}
        onChange={(d) => {
          setDevice(d)
          setError(null)
        }}
      />
      <div className="flex flex-col gap-2">
        <Label id={`${ids}-fault`}>{estimator.fault}</Label>
        <RadioGroup
          aria-labelledby={`${ids}-fault`}
          aria-invalid={!!error && !fault}
          aria-describedby={error && !fault ? `${ids}-error` : undefined}
          value={fault}
          onValueChange={(f) => {
            setFault(f)
            setError(null)
          }}
        >
          {estimator.faults.map((f) => (
            <RadioGroupItem key={f.slug} value={f.slug}>
              {f.label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      <SubmitRow error={error} errorId={`${ids}-error`}>
        <Button type="submit" size="lg" arrow className="w-full justify-between sm:w-auto">
          {estimator.submit}
        </Button>
      </SubmitRow>
    </form>
  )
}

const openFault = booking.fault.open[1] // "Not mentioned here": the message carries the problem

/**
 * The quote ticket: name, number, device, message and up to 3 photos, sent to /api/book as a quote with no service.
 * The shop gets the email with the photos and the Sheet row, and replies on WhatsApp. Same checks and helpers as
 * the BookingFlow; the Worker still has the last word.
 */
function TicketForm({ q }: { q: string }) {
  const router = useRouter()
  const [device, setDevice] = React.useState<string | null>(null)
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [message, setMessage] = React.useState(q)
  const [photos, setPhotos] = React.useState<Photo[]>([])
  const [error, setError] = React.useState<{ field: "device" | "name" | "phone" | "message" | "form"; text: string } | null>(null)
  const [sending, setSending] = React.useState(false)
  const busy = React.useRef(false) // the real guard: state lags a render behind a double click
  const started = React.useRef(0)
  const honeypot = React.useRef<HTMLInputElement>(null)
  const ids = React.useId()

  React.useEffect(() => {
    started.current = now()
  }, [])
  // The previews are object URLs: free the rest when the form goes (the picker frees each one it removes).
  const shown = React.useRef(photos)
  React.useEffect(() => {
    shown.current = photos
  }, [photos])
  React.useEffect(() => () => shown.current.forEach((p) => URL.revokeObjectURL(p.preview)), [])

  const fail = (field: NonNullable<typeof error>["field"], text: string) => setError({ field, text })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy.current) return
    const number = normalizePhone(phone)
    const problem = message.trim()
    if (!device) return fail("device", booking.device.pickError)
    if (!name.trim()) return fail("name", booking.details.nameError)
    if (!number) return fail("phone", booking.details.phoneError)
    if (!problem) return fail("message", booking.fault.describeError)
    if (/[^\P{Cc}\n\t]/u.test(problem)) return fail("message", booking.fault.problemError) // the Worker refuses control characters
    if (photos.some((p) => !p.id)) return fail("form", booking.fault.wait)
    if (recentBookings().length >= BOOKING_LIMIT) return fail("form", booking.review.limit)

    busy.current = true
    setSending(true)
    setError(null)
    const photoIds = photos.flatMap((p) => (p.id ? [p.id] : []))
    let job: string | null = null
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "quote",
          device,
          fault: openFault,
          problem,
          ...(photoIds.length && { photos: photoIds }),
          slot: null,
          name: name.trim(),
          phone,
          website: honeypot.current?.value ?? "",
          elapsed: now() - started.current,
        }),
      })
      if (res.status === 400 || res.status === 429) {
        busy.current = false
        setSending(false)
        return fail("form", res.status === 429 ? booking.review.limit : booking.review.error)
      }
      const out = (await res.json()) as { ok?: boolean; job?: string }
      if (out.ok && out.job) job = out.job
    } catch {
      // Network down or the Worker unreachable: fall through to the WhatsApp handoff with a local reference.
    }
    const summary: BookingSummary = {
      kind: "quote",
      ref: job ?? localRef(),
      saved: !!job,
      device,
      fault: openFault,
      visit: null,
      slot: null,
      name: name.trim(),
      problem,
    }
    track("book_submit", { kind: "quote", saved: summary.saved })
    try {
      if (job) rememberBooking()
      sessionStorage.setItem(BOOKING_KEY, JSON.stringify(summary))
    } catch {
      // Private mode can refuse storage; the confirmation page then shows its fallback.
    }
    router.push("/book/confirmed") // the form stays locked until the page changes
  }

  const invalid = (f: string) => error?.field === f
  /** The field whose error is showing points at the message (an id on the one error line). */
  const describe = (f: string) => (invalid(f) ? `${ids}-error` : undefined)
  const t = estimator.ticket
  return (
    <form noValidate onSubmit={submit} className="flex flex-1 flex-col gap-4">
      <DevicePicker
        value={device}
        invalid={invalid("device")}
        describedBy={describe("device")}
        onChange={(d) => {
          setDevice(d)
          setError(null)
        }}
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${ids}-message`}>{t.message}</Label>
        <Textarea
          id={`${ids}-message`}
          dir="auto"
          rows={2}
          className="min-h-20"
          maxLength={MAX_INPUT}
          placeholder={t.placeholder}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            setError(null)
          }}
          aria-invalid={invalid("message")}
          aria-describedby={describe("message")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-caption text-steel">{booking.fault.photos}</p>
        <PhotoPicker photos={photos} onChange={setPhotos} onError={(text) => (text ? fail("form", text) : setError(null))} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${ids}-name`}>{booking.details.name}</Label>
          <Input
            id={`${ids}-name`}
            autoComplete="name"
            maxLength={60}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError(null)
            }}
            aria-invalid={invalid("name")}
            aria-describedby={describe("name")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${ids}-phone`}>{booking.details.phone}</Label>
          <Input
            id={`${ids}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder={booking.details.phonePlaceholder}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setError(null)
            }}
            aria-invalid={invalid("phone")}
            aria-describedby={describe("phone")}
          />
        </div>
      </div>
      <p className="-mt-2 text-caption text-steel">{t.hint}</p>
      {/* Honeypot: off-screen and out of the tab order, so only bots fill it. */}
      <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only" aria-label={booking.details.honeypot} />
      <SubmitRow error={error?.text} errorId={`${ids}-error`}>
        <Button type="submit" size="lg" arrow className="w-full justify-between sm:w-auto" disabled={sending}>
          {sending ? booking.review.sending : t.submit}
        </Button>
      </SubmitRow>
    </form>
  )
}

function Outcome({ result, onAgain }: { result: Result; onAgain: () => void }) {
  const { fault, service, price } = repairFor(result.faultSlug, result.device)
  const quote = site.whatsapp.withText(estimator.whatsapp(result.device, fault.label))
  const heading = React.useRef<HTMLHeadingElement>(null)
  // The form is gone: move focus to what replaced it.
  React.useEffect(() => {
    heading.current?.focus()
  }, [])
  // The buttons sit where the submit button was, so the second click of a double click would land on one of them.
  // They wake up a moment after the result shows.
  const [armed, setArmed] = React.useState(false)
  React.useEffect(() => {
    const t = setTimeout(() => setArmed(true), 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <section className="flex flex-1 flex-col gap-4 max-lg:flex-none">
      <h2 ref={heading} tabIndex={-1} className="text-body-sm text-steel outline-none">
        {estimator.result.title}
      </h2>
      {service ? (
        <>
          <p className="-mt-2 font-display text-title-lg text-ink">{service.title}</p>
          <dl className="divide-y divide-hairline rounded-lg border border-hairline">
            {[
              [estimator.result.device, result.device],
              [estimator.result.fault, fault.label],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 px-4 py-3">
                <dt className="w-16 shrink-0 text-body-sm text-steel">{label}</dt>
                <dd className="min-w-0 text-body-md font-semibold break-words text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {fault.panel && <Text>{estimator.result.panel[fault.panel]}</Text>}
          {price && <p className="font-display text-title-md tabular-nums text-ink">{price}</p>}
        </>
      ) : (
        <Text>{estimator.result.other}</Text>
      )}
      <div inert={!armed} className="flex flex-wrap justify-end gap-2.5 lg:mt-auto">
        <Button type="button" size="lg" variant="line" onClick={onAgain}>
          {estimator.result.again}
        </Button>
        {(priceMode === "quote" || !service) && (
          <Button asChild size="lg" variant="whatsapp">
            <a href={quote}>
              <WhatsAppIcon />
              {estimator.result.quote}
            </a>
          </Button>
        )}
        {service && (
          <BookButton size="lg" variant={priceMode === "quote" ? "line" : "ink"} service={service.slug} device={result.device}>
            {actions.bookRepair}
          </BookButton>
        )}
      </div>
    </section>
  )
}
