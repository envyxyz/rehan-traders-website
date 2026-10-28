import type { site } from "../content"

// Type-only import, so scripts/check-hours.mjs can run this file under plain Node.
type Hours = (typeof site)["hours"]
type StatusCopy = (typeof site)["status"]

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

/** "22:00" → "10 PM", "13:30" → "1:30 PM". */
export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** Day of the week (0 = Sunday) at `now` in `timeZone`. */
export const weekdayIn = (now: Date, timeZone: string) =>
  weekdays.indexOf(new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(now))

/** Open or closed at `now`, in the shop's time zone. Public holidays are not known here. */
export function openStatus(now: Date, hours: Hours, copy: StatusCopy) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: hours.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  const dow = weekdays.indexOf(get("weekday"))
  const mins = Number(get("hour")) * 60 + Number(get("minute"))
  const day = (d: number) => hours.days.find((x) => x.day === d % 7)!

  const today = day(dow)
  if (today.open && today.close) {
    const brk = "break" in today ? today.break : undefined
    if (brk && mins >= toMinutes(brk.from) && mins < toMinutes(brk.to))
      return { open: false, text: `${copy.prayerBreak} · ${copy.opensAt(formatTime(brk.to))}` }
    if (mins >= toMinutes(today.open) && mins < toMinutes(today.close))
      return { open: true, text: `${copy.openNow} · ${copy.closesAt(formatTime(today.close))}` }
    if (mins < toMinutes(today.open))
      return { open: false, text: `${copy.closedNow} · ${copy.opensAt(formatTime(today.open))}` }
  }
  for (let i = 1; i <= 7; i++) {
    const next = day(dow + i)
    if (next.open) {
      const when = `${i === 1 ? copy.tomorrow : next.label} ${formatTime(next.open)}`
      return { open: false, text: `${copy.closedNow} · ${copy.opensAt(when)}` }
    }
  }
  return { open: false, text: copy.closedNow }
}
