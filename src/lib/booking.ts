import type { holidays, site } from "../content"

// Type-only import, so scripts/check-booking.mjs can run this file under plain Node. Used by the
// BookingFlow (client) and worker/book.ts (server), so both agree on what a valid slot and number are.
type Hours = (typeof site)["hours"]
type Holidays = typeof holidays

// ponytail: Pakistan has had no daylight saving since 2009, so Asia/Karachi is a fixed +05:00.
const OFFSET = "+05:00"
const SLOT_MINUTES = 30

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}
const hhmm = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`

/** "YYYY-MM-DD" of `now` in the shop's time zone. */
const dateIn = (now: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now)

const addDays = (date: string, n: number) => {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

export type BookingDay = { date: string; slots: string[] }

/**
 * Open days from today over the next `count` days, each with its bookable slots as ISO strings
 * ("2026-10-30T18:30+05:00"). Every 30 minutes from opening until 30 minutes before closing; no slots
 * in a break (Friday prayers), on closed days (Sunday) or on public holidays; slots before `now` dropped.
 */
export function bookingDays(now: Date, hours: Hours, closed: Holidays, count = 7): BookingDay[] {
  const today = dateIn(now, hours.timezone)
  const days: BookingDay[] = []
  for (let i = 0; i < count; i++) {
    const date = addDays(today, i)
    const day = hours.days.find((d) => d.day === new Date(`${date}T00:00Z`).getUTCDay())!
    if (!day.open || !day.close || closed.some((h) => h.date === date)) continue
    const brk = "break" in day ? day.break : undefined
    const slots: string[] = []
    for (let t = toMinutes(day.open); t + SLOT_MINUTES <= toMinutes(day.close); t += SLOT_MINUTES) {
      if (brk && t >= toMinutes(brk.from) && t < toMinutes(brk.to)) continue
      const iso = `${date}T${hhmm(t)}${OFFSET}`
      if (new Date(iso) > now) slots.push(iso)
    }
    if (slots.length) days.push({ date, slots })
  }
  return days
}

/** A slot the shop accepts. 30 minutes of grace, so a slot picked just before it starts still goes through. */
export const isBookableSlot = (iso: string, now: Date, hours: Hours, closed: Holidays) =>
  bookingDays(new Date(now.getTime() - SLOT_MINUTES * 60_000), hours, closed, 8).some((d) => d.slots.includes(iso))

const fmt = (iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, ...opts }).format(new Date(iso))

/** "18:30" part of a slot as "6:30 PM". */
export const slotTime = (iso: string) => {
  const [h, m] = iso.slice(11, 16).split(":").map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
}

/** "Thu 30 Oct" for a day chip or a slot. */
export const slotDay = (iso: string, timeZone: string) =>
  fmt(iso.length === 10 ? `${iso}T12:00${OFFSET}` : iso, timeZone, { weekday: "short", day: "numeric", month: "short" })

/** "Thu 30 Oct, 6:30 PM": the visit line in the review, email, WhatsApp text and calendar file. */
export const slotLabel = (iso: string, timeZone: string) => `${slotDay(iso, timeZone)}, ${slotTime(iso)}`

/** Any common way of writing a Pakistani mobile (0300 1234567, +92 300 1234567, 923001234567) → "+923001234567", else null. */
export function normalizePhone(input: string) {
  const m = /^(?:\+92|0092|92|0)?(3\d{9})$/.exec(input.replace(/[\s\-().]/g, ""))
  return m ? `+92${m[1]}` : null
}

/** "+923001234567" → "0300 1234567". */
export const displayPhone = (e164: string) => `0${e164.slice(3, 6)} ${e164.slice(6)}`

// ─── Browser side: shared by the BookingFlow and the quote ticket form on /estimate ──────────────────────────────

/** sessionStorage key: the confirmation page reads the booking from here, so nothing personal goes in a URL. */
export const BOOKING_KEY = "rt-booking"

// Module-level so the React compiler sees this as an event-time read, not a render-time one.
export const now = () => Date.now()

/** 5 bookings per device per hour (localStorage), before the Sheet's own 5 per number per hour. */
export const BOOKING_LIMIT = 5
const HOUR = 3_600_000
const LIMIT_KEY = "rt-bookings"
export const recentBookings = () => {
  try {
    return (JSON.parse(localStorage.getItem(LIMIT_KEY) ?? "[]") as number[]).filter((t) => now() - t < HOUR)
  } catch {
    return []
  }
}
/** Counts one saved booking against the hourly limit. */
export const rememberBooking = () => {
  try {
    localStorage.setItem(LIMIT_KEY, JSON.stringify([...recentBookings(), now()]))
  } catch {
    // Private mode can refuse storage; the Sheet's own limit still applies.
  }
}
/** Shown when the Sheet could not be reached: "WEB-" and six characters of the time, never a job number. */
export const localRef = () => `WEB-${now().toString(36).toUpperCase().slice(-6)}`
