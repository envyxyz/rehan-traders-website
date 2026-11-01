"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { DeviceField } from "@/components/device-field"
import { Icon } from "@/components/icon"
import { ArrowRight } from "@/components/icons"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { PhotoPicker, type Photo } from "@/components/photo-picker"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem, TogglePill } from "@/components/ui/radio-group"
import { TimeWheel } from "@/components/time-wheel"
import { actions, priceMode, site } from "@/content"
import { booking, faults, holidays, services, type BookingSummary } from "@/content-large"
import {
  BOOKING_KEY,
  BOOKING_LIMIT,
  bookingDays,
  displayPhone,
  localRef,
  normalizePhone,
  now,
  recentBookings,
  rememberBooking,
  slotDay,
  slotLabel,
  type BookingDay,
} from "@/lib/booking"
import { busyStart, busyStop } from "@/lib/busy"
import { track } from "@/lib/track"
import { cn, nextField } from "@/lib/utils"

const STEPS = ["device", "fault", "time", "details", "review"] as const
type Step = (typeof STEPS)[number]

type Draft = {
  device: string | null
  /** Any number of faults, or exactly one of the open ones ("Not sure", "Not mentioned here"). */
  faults: string[]
  day: string | null
  slot: string | null
  kind: "book" | "quote"
  name: string
  phone: string
  problem: string
}

const tz = site.hours.timezone

const openFaults: readonly string[] = booking.fault.open
/** Tap a fault pill: on or off. An open choice ("Not sure") stands alone; picking a listed fault drops it. */
const toggleFault = (picked: string[], f: string) =>
  picked.includes(f) ? picked.filter((x) => x !== f) : openFaults.includes(f) ? [f] : [...picked.filter((x) => !openFaults.includes(x)), f]

/** Day tile parts: ["Today" or "Thu", "30", "Oct"]. */
const dayParts = (date: string) => {
  const [weekday, day, month] = slotDay(date, tz).split(" ")
  const today = date === new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date())
  return [today ? booking.time.today : weekday, day, month]
}

/**
 * One question per step: device, fault, visit time, name and number, review. Used by /book and by the
 * BookingSheet behind every Book button. `service` (a slug) narrows the fault chips and, while prices are
 * in quote mode, offers "Get a quote" instead of a visit time.
 */
export function BookingFlow({ service, device, onDone }: { service?: string; device?: string; onDone?: () => void }) {
  const router = useRouter()
  const svc = services.find((s) => s.slug === service)
  const faultChoices: readonly string[] = [...(svc?.faults ?? faults), ...booking.fault.open]
  const allowQuote = priceMode === "quote" && !!svc

  const [step, setStep] = React.useState<Step>("device")
  const [draft, setDraft] = React.useState<Draft>({
    device: device ?? null,
    faults: [],
    day: null,
    slot: null,
    kind: "book",
    name: "",
    phone: "",
    problem: "",
  })
  const [photos, setPhotos] = React.useState<Photo[]>([])
  // The previews are object URLs: free the rest when the flow closes (the picker frees each one it removes).
  const shown = React.useRef(photos)
  React.useEffect(() => {
    shown.current = photos
  }, [photos])
  React.useEffect(() => () => shown.current.forEach((p) => URL.revokeObjectURL(p.preview)), [])
  const [days, setDays] = React.useState<BookingDay[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [sending, setSending] = React.useState(false)
  const started = React.useRef(0)
  const honeypot = React.useRef<HTMLInputElement>(null)
  const heading = React.useRef<HTMLHeadingElement>(null)
  const firstRender = React.useRef(true)
  const ids = React.useId()

  React.useEffect(() => {
    started.current = now()
    track("book_start", { service })
  }, [service])

  // Each new step: tell analytics, and move focus to its question so keyboard and screen reader users follow.
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
    track("book_step", { step, index: STEPS.indexOf(step) })
  }, [step])

  const set = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setError(null)
  }
  const go = (to: Step) => {
    setError(null)
    setStep(to)
  }

  const phone = normalizePhone(draft.phone)
  // "Not sure" and "Not mentioned here" open the description and photos; only then are they sent.
  const fault =draft.faults.join(", ") // one field everywhere after this step: Sheet, email, ticket
  const openFault = openFaults.includes(fault)
  const problem = openFault ? draft.problem.trim() : ""
  const photoIds = openFault ? photos.flatMap((p) => (p.id ? [p.id] : [])) : []
  const nameOk = draft.name.trim().length > 0

  function next() {
    if (step === "device") return draft.device ? go("fault") : setError(booking.device.pickError)
    if (step === "fault") {
      if (!fault) return setError(booking.fault.pickError)
      if (openFault && !problem) return setError(booking.fault.describeError)
      if (/[^\P{Cc}\n\t]/u.test(problem)) return setError(booking.fault.problemError) // the Worker refuses control characters
      if (openFault && photos.some((p) => !p.id)) return setError(booking.fault.wait)
      // Slots are worked out when the step opens, so past times never show.
      const open = bookingDays(new Date(), site.hours, holidays)
      setDays(open)
      const day = open.some((d) => d.date === draft.day) ? draft.day : (open[0]?.date ?? null)
      // The wheel always shows a time, so a time is always picked: the earlier one, else the day's first.
      const slot = open.some((d) => d.slots.includes(draft.slot ?? "")) ? draft.slot : (open.find((d) => d.date === day)?.slots[0] ?? null)
      set({ day, slot })
      return go("time")
    }
    if (step === "time") {
      if (!draft.slot) return setError(booking.time.pickError)
      set({ kind: "book" })
      return go("details")
    }
    if (step === "details") return nameOk && phone ? go("review") : setError("details")
    if (step === "review") void submit()
  }

  function back() {
    if (step === "details" && draft.kind === "quote") return go("time")
    go(STEPS[Math.max(0, STEPS.indexOf(step) - 1)])
  }

  async function submit() {
    if (recentBookings().length >= BOOKING_LIMIT) return setError(booking.review.limit)
    setSending(true)
    const body = {
      kind: draft.kind,
      ...(svc && { service: svc.slug }),
      device: draft.device,
      fault,
      ...(problem && { problem }),
      ...(photoIds.length && { photos: photoIds }),
      slot: draft.kind === "quote" ? null : draft.slot,
      name: draft.name.trim(),
      phone: draft.phone,
      website: honeypot.current?.value ?? "",
      elapsed: now() - started.current,
    }
    let job: string | null = null
    busyStart() // the red line runs until the confirmation page replaces this one
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.status === 400 || res.status === 429) {
        busyStop()
        setSending(false)
        return setError(res.status === 429 ? booking.review.limit : booking.review.error)
      }
      const out = (await res.json()) as { ok?: boolean; job?: string }
      if (out.ok && out.job) job = out.job
    } catch {
      // Network down or the Worker unreachable: fall through to the WhatsApp handoff with a local reference.
    }
    const summary: BookingSummary = {
      kind: draft.kind,
      ref: job ?? localRef(),
      saved: !!job,
      device: draft.device!,
      fault,
      visit: draft.kind === "quote" ? null : slotLabel(draft.slot!, tz),
      slot: draft.kind === "quote" ? null : draft.slot,
      name: draft.name.trim(),
      ...(problem && { problem }),
    }
    track("book_submit", { kind: summary.kind, saved: summary.saved })
    try {
      if (job) rememberBooking()
      sessionStorage.setItem(BOOKING_KEY, JSON.stringify(summary))
    } catch {
      // Private mode can refuse storage; the confirmation page then shows its fallback.
    }
    onDone?.()
    router.push("/book/confirmed")
  }

  const index = STEPS.indexOf(step)
  const copy = booking.steps[step]
  const slots = days.find((d) => d.date === draft.day)?.slots ?? []
  const detailsError = error === "details"

  return (
    <form
      noValidate
      onKeyDown={nextField}
      onSubmit={(e) => {
        e.preventDefault()
        next()
      }}
      className="flex flex-1 flex-col gap-4"
    >
      {/* Where you are, in the lede's place under the sheet title, then the bars. */}
      <div>
        <p className="text-body-md text-steel">{booking.progress(index + 1, STEPS.length, copy.name)}</p>
        <div aria-hidden className="mt-3 flex gap-1">
          {STEPS.map((s, i) => (
            <span key={s} className={cn("h-1 flex-1 rounded-pill", i <= index ? "bg-ink" : "bg-hairline")} />
          ))}
        </div>
      </div>

      <div key={step} className="flex animate-rise flex-col gap-4 motion-reduce:animate-none">
        <h2 ref={heading} tabIndex={-1} className="font-display text-title-lg text-ink outline-none">
          {copy.title}
        </h2>

        {step === "device" && (
          <DeviceField value={draft.device} onChange={(device) => set({ device })} describedBy={error ? `${ids}-error` : undefined} />
        )}

        {step === "fault" && (
          <div role="group" aria-label={booking.fault.label} className="flex flex-wrap gap-2">
            {faultChoices.map((f) => (
              <TogglePill
                key={f}
                pressed={draft.faults.includes(f)}
                onClick={() => {
                  setError(null)
                  setDraft((d) => ({ ...d, faults: toggleFault(d.faults, f) }))
                }}
              >
                {f}
              </TogglePill>
            ))}
          </div>
        )}

        {step === "fault" && openFault && (
          <div className="flex animate-rise flex-col gap-4 motion-reduce:animate-none">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${ids}-problem`}>{booking.fault.describe}</Label>
              <Textarea
                id={`${ids}-problem`}
                maxLength={500}
                className="min-h-20"
                placeholder={booking.fault.describePlaceholder}
                value={draft.problem}
                onChange={(e) => set({ problem: e.target.value })}
                aria-invalid={error === booking.fault.describeError}
                aria-describedby={error === booking.fault.describeError ? `${ids}-error` : undefined}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-body-sm font-medium text-ink">{booking.fault.photos}</p>
              <PhotoPicker photos={photos} onChange={setPhotos} onError={setError} />
            </div>
          </div>
        )}

        {step === "time" &&
          (days.length === 0 ? (
            <Text>{booking.time.none}</Text>
          ) : (
            <>
              <RadioGroup
                aria-label={booking.time.days}
                value={draft.day ?? ""}
                onValueChange={(day) => {
                  // Same time on the new day when it is open then, else that day's first time.
                  const daySlots = days.find((d) => d.date === day)?.slots ?? []
                  const same = daySlots.find((s) => s.slice(11) === draft.slot?.slice(11))
                  set({ day, slot: same ?? daySlots[0] ?? null })
                }}
                className="snap-x flex-nowrap gap-1.5 overflow-x-auto"
              >
                {days.map((d) => {
                  const [weekday, day, month] = dayParts(d.date)
                  return (
                    <RadioGroupItem
                      key={d.date}
                      value={d.date}
                      aria-label={slotDay(d.date, tz)}
                      className="h-auto min-w-11 flex-1 snap-start flex-col gap-1 rounded-md px-1 py-2.5 tabular-nums"
                    >
                      <span className="text-caption opacity-70">{weekday}</span>
                      <span className="text-title-lg">{day}</span>
                      <span className="text-caption opacity-70">{month}</span>
                    </RadioGroupItem>
                  )
                })}
              </RadioGroup>
              {draft.slot && slots.includes(draft.slot) && (
                <>
                  <TimeWheel slots={slots} value={draft.slot} onChange={(slot) => set({ slot })} />
                  <p aria-live="polite" className="text-center text-body-md font-semibold text-ink">
                    {booking.time.picked(slotLabel(draft.slot, tz))}
                  </p>
                </>
              )}
            </>
          ))}

        {step === "details" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${ids}-name`}>{booking.details.name}</Label>
              <Input
                id={`${ids}-name`}
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
                maxLength={60}
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                aria-invalid={detailsError && !nameOk}
                aria-describedby={detailsError && !nameOk ? `${ids}-name-error` : undefined}
              />
              {detailsError && !nameOk && (
                <p id={`${ids}-name-error`} role="alert" className="text-body-sm text-error">
                  {booking.details.nameError}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${ids}-phone`}>{booking.details.phone}</Label>
              <Input
                id={`${ids}-phone`}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="next"
                maxLength={20}
                placeholder={booking.details.phonePlaceholder}
                value={draft.phone}
                onChange={(e) => set({ phone: e.target.value })}
                aria-invalid={detailsError && !phone}
                aria-describedby={`${ids}-phone-hint${detailsError && !phone ? ` ${ids}-phone-error` : ""}`}
              />
              {detailsError && !phone && (
                <p id={`${ids}-phone-error`} role="alert" className="text-body-sm text-error">
                  {booking.details.phoneError}
                </p>
              )}
              <p id={`${ids}-phone-hint`} className="text-caption text-steel">
                {booking.details.phoneHint}
              </p>
            </div>
          </div>
        )}

        {step === "review" && (
          <dl className="divide-y divide-hairline rounded-lg border border-hairline">
            {[
              [booking.review.device, draft.device],
              [booking.review.fault, fault],
              ...(problem ? [[booking.review.problem, problem]] : []),
              ...(photoIds.length ? [[booking.review.photos, booking.review.photoCount(photoIds.length)]] : []),
              [booking.review.visit, draft.kind === "quote" ? booking.review.quoteVisit : slotLabel(draft.slot!, tz)],
              [booking.review.name, draft.name.trim()],
              [booking.review.phone, phone && displayPhone(phone)],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 px-4 py-3">
                <dt className="w-20 shrink-0 text-body-sm text-steel">{label}</dt>
                <dd className="min-w-0 text-body-md font-semibold break-words text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {error && !detailsError && (
          <p id={`${ids}-error`} role="alert" className="text-body-sm text-error">
            {error}
          </p>
        )}
      </div>

      {/* Honeypot: off-screen and out of the tab order, so only bots fill it. */}
      <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only" aria-label={booking.details.honeypot} />

      {/* Docked at the foot of the sheet only; on /book the buttons follow the form. */}
      <div className={cn("-mx-1 mt-auto flex flex-wrap gap-2.5 bg-card px-1 py-3", onDone && "sticky bottom-0")}>
        {index > 0 && (
          <Button type="button" variant="line" size="lg" still onClick={back} disabled={sending}>
            {booking.back}
          </Button>
        )}
        {step === "time" && allowQuote && (
          <Button
            type="button"
            variant="line"
            size="lg"
            still
            onClick={() => {
              set({ kind: "quote" })
              go("details")
            }}
          >
            {actions.getQuote}
          </Button>
        )}
        <Button type="submit" variant="outline" size="lg" still className="min-w-32 flex-1 justify-between" disabled={sending}>
          {step !== "review" ? booking.next : sending ? booking.review.sending : draft.kind === "quote" ? actions.getQuote : booking.review.submit}
          <Icon icon={ArrowRight} />
        </Button>
      </div>
    </form>
  )
}
