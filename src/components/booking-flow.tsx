"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

import { Icon } from "@/components/icon"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TimeWheel } from "@/components/time-wheel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { actions, booking, faults, holidays, priceMode, services, site, type BookingSummary } from "@/content"
import catalog from "@/data/devices.json"
import { bookingDays, displayPhone, normalizePhone, slotDay, slotLabel, type BookingDay } from "@/lib/booking"
import { track } from "@/lib/track"
import { cn } from "@/lib/utils"

const STEPS = ["device", "fault", "time", "details", "review"] as const
type Step = (typeof STEPS)[number]

/** sessionStorage key: the confirmation page reads the booking from here, so nothing personal goes in a URL. */
export const BOOKING_KEY = "rt-booking"

type Draft = {
  device: string | null
  fault: string | null
  day: string | null
  slot: string | null
  kind: "book" | "quote"
  name: string
  phone: string
}

const tz = site.hours.timezone
// Module-level so the React compiler sees these as event-time reads, not render-time ones.
const now = () => Date.now()
/** Shown when the Sheet could not be reached: "WEB-" and six characters of the time, never a job number. */
const localRef = () => `WEB-${now().toString(36).toUpperCase().slice(-6)}`

// Every model as people say it: "Samsung Galaxy A54", "Redmi Note 13" (no "Redmi Redmi"), "iPhone 15" (no "Apple").
// From scripts/devices.mjs.
const models = catalog.flatMap((b) => b.models.map((m) => (b.brand === "Apple" || m.toLowerCase().startsWith(b.brand.toLowerCase()) ? m : `${b.brand} ${m}`)))

/** Models holding every typed word ("s24 ultra", "iphone 13"), closest first: name starts with the query, then shortest. */
function findModels(query: string) {
  const q = query.trim().toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const score = (m: string) => (m.toLowerCase().startsWith(q) || m.toLowerCase().includes(` ${q}`) ? 0 : 1)
  // ponytail: linear scan of ~4k names per keystroke is well under a millisecond; index it if the list grows 10x.
  return models
    .filter((m) => words.every((w) => m.toLowerCase().includes(w)))
    .sort((a, b) => score(a) - score(b) || a.length - b.length || a.localeCompare(b, "en", { numeric: true }))
    .slice(0, 40)
}

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
  const faultChoices: readonly string[] = svc?.faults ?? faults
  const allowQuote = priceMode === "quote" && !!svc

  const [step, setStep] = React.useState<Step>("device")
  const [draft, setDraft] = React.useState<Draft>({
    device: device ?? null,
    fault: null,
    day: null,
    slot: null,
    kind: "book",
    name: "",
    phone: "",
  })
  const [query, setQuery] = React.useState("")
  const [family, setFamily] = React.useState<string>("")
  const [searchAll, setSearchAll] = React.useState(!svc?.families)
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
  const nameOk = draft.name.trim().length > 0

  function next() {
    if (step === "device") return draft.device ? go("fault") : setError(booking.device.pickError)
    if (step === "fault") {
      if (!draft.fault) return setError(booking.fault.pickError)
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
    setSending(true)
    const body = {
      kind: draft.kind,
      ...(svc && { service: svc.slug }),
      device: draft.device,
      fault: draft.fault,
      slot: draft.kind === "quote" ? null : draft.slot,
      name: draft.name.trim(),
      phone: draft.phone,
      website: honeypot.current?.value ?? "",
      elapsed: now() - started.current,
    }
    let job: string | null = null
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.status === 400) {
        setSending(false)
        return setError(booking.review.error)
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
      fault: draft.fault!,
      visit: draft.kind === "quote" ? null : slotLabel(draft.slot!, tz),
      slot: draft.kind === "quote" ? null : draft.slot,
      name: draft.name.trim(),
    }
    track("book_submit", { kind: summary.kind, saved: summary.saved })
    try {
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
  const found = findModels(query)

  const deviceItem = (name: string, label = name) => (
    <CommandItem key={name} value={`pick:${name}`} onSelect={() => set({ device: name })} aria-checked={draft.device === name}>
      <span className="flex-1">{label}</span>
      {draft.device === name && <Icon icon={Check} />}
    </CommandItem>
  )

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        next()
      }}
      className="flex flex-col gap-5"
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

        {step === "device" && !searchAll && svc?.families && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${ids}-family`}>{booking.device.family}</Label>
              <Select
                value={family}
                onValueChange={(f) => {
                  setFamily(f)
                  set({ device: null })
                }}
              >
                <SelectTrigger id={`${ids}-family`}>
                  <SelectValue placeholder={booking.device.choose} />
                </SelectTrigger>
                <SelectContent>
                  {svc.families.map((f) => (
                    <SelectItem key={f.prefix} value={f.prefix}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {family && (
              <div className="flex animate-rise flex-col gap-2 motion-reduce:animate-none">
                <Label htmlFor={`${ids}-model`}>{booking.device.model}</Label>
                <Select value={draft.device ?? ""} onValueChange={(device) => set({ device })}>
                  <SelectTrigger id={`${ids}-model`}>
                    <SelectValue placeholder={booking.device.choose} />
                  </SelectTrigger>
                  <SelectContent>
                    {models
                      .filter((m) => m.startsWith(family))
                      .map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="button" variant="line" still className="self-start" onClick={() => setSearchAll(true)}>
              {booking.device.searchAll}
            </Button>
          </div>
        )}

        {step === "device" && searchAll && (
          <Command label={copy.name} shouldFilter={false} className="bg-paper">
            <CommandInput placeholder={booking.device.search} aria-label={booking.device.search} value={query} onValueChange={setQuery} />
            <CommandList>
              {query.trim() ? (
                found.length > 0 && <CommandGroup heading={booking.device.models}>{found.map((m) => deviceItem(m))}</CommandGroup>
              ) : (
                <>
                  {draft.device && deviceItem(draft.device)}
                  <CommandGroup heading={booking.device.brands}>
                    {catalog.map((b) => (
                      <CommandItem key={b.brand} value={b.brand} onSelect={() => setQuery(`${b.brand} `)}>
                        {b.brand}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
              <CommandGroup heading={booking.device.notListed}>
                {query.trim() &&
                  !found.some((m) => m.toLowerCase() === query.trim().toLowerCase()) &&
                  deviceItem(query.trim().slice(0, 60), booking.device.useTyped(query.trim().slice(0, 60)))}
                {booking.device.other.map((o) => deviceItem(o))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}

        {step === "fault" && (
          <RadioGroup aria-label={booking.fault.label} value={draft.fault ?? ""} onValueChange={(fault) => set({ fault })}>
            {faultChoices.map((f) => (
              <RadioGroupItem key={f} value={f}>
                {f}
              </RadioGroupItem>
            ))}
          </RadioGroup>
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
                className="flex-nowrap gap-1.5"
              >
                {days.map((d) => {
                  const [weekday, day, month] = dayParts(d.date)
                  return (
                    <RadioGroupItem
                      key={d.date}
                      value={d.date}
                      aria-label={slotDay(d.date, tz)}
                      className="h-auto min-w-0 flex-1 flex-col gap-1 rounded-md px-1 py-2.5 tabular-nums"
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

        {step === "time" && allowQuote && (
          <div className="flex flex-col items-start gap-2 border-t border-hairline pt-4">
            <Text size="body-sm" tone="muted">
              {booking.time.quoteInstead}
            </Text>
            <Button
              type="button"
              variant="line"
              still
              onClick={() => {
                set({ kind: "quote" })
                go("details")
              }}
            >
              {actions.getQuote}
            </Button>
          </div>
        )}

        {step === "details" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${ids}-name`}>{booking.details.name}</Label>
              <Input
                id={`${ids}-name`}
                autoComplete="name"
                maxLength={60}
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                aria-invalid={detailsError && !nameOk}
                aria-describedby={detailsError && !nameOk ? `${ids}-name-error` : undefined}
              />
              {detailsError && !nameOk && (
                <p id={`${ids}-name-error`} className="text-body-sm text-error">
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
                maxLength={20}
                placeholder={booking.details.phonePlaceholder}
                value={draft.phone}
                onChange={(e) => set({ phone: e.target.value })}
                aria-invalid={detailsError && !phone}
                aria-describedby={`${ids}-phone-hint${detailsError && !phone ? ` ${ids}-phone-error` : ""}`}
              />
              {detailsError && !phone && (
                <p id={`${ids}-phone-error`} className="text-body-sm text-error">
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
              [booking.review.fault, draft.fault],
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
          <p role="alert" className="text-body-sm text-error">
            {error}
          </p>
        )}
      </div>

      {/* Honeypot: off-screen and out of the tab order, so only bots fill it. */}
      <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only" aria-label={booking.details.honeypot} />

      <div className="sticky bottom-0 -mx-1 flex gap-2.5 bg-card px-1 py-3">
        {index > 0 && (
          <Button type="button" variant="line" size="lg" still onClick={back} disabled={sending}>
            {booking.back}
          </Button>
        )}
        <Button type="submit" size="lg" arrow still className="flex-1 justify-between" disabled={sending}>
          {step !== "review" ? booking.next : sending ? booking.review.sending : draft.kind === "quote" ? actions.getQuote : booking.review.submit}
        </Button>
      </div>
    </form>
  )
}
