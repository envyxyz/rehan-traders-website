// Self-check for src/lib/booking.ts. Run: node scripts/check-booking.mjs (Node 23.6+ strips the TS types).
import assert from "node:assert/strict"

import { site } from "../src/content.ts"
import { holidays } from "../src/content-large.ts"
import { bookingDays, displayPhone, isBookableSlot, normalizePhone, slotLabel } from "../src/lib/booking.ts"

const tz = site.hours.timezone
// Times are UTC; Karachi is UTC+5. 2026-10-26 is a Monday.
const days = bookingDays(new Date("2026-10-26T03:00Z"), site.hours, holidays) // Mon 08:00
assert.deepEqual(days.map((d) => d.date), ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31"]) // no Sunday
const mon = days[0].slots
assert.equal(mon[0], "2026-10-26T11:00+05:00")
assert.equal(mon.at(-1), "2026-10-26T21:30+05:00")
assert.equal(mon.length, 22)
const fri = days[4].slots
assert.ok(!fri.includes("2026-10-30T13:00+05:00") && !fri.includes("2026-10-30T13:30+05:00")) // prayer break
assert.ok(fri.includes("2026-10-30T12:30+05:00") && fri.includes("2026-10-30T14:00+05:00"))
assert.equal(fri.length, 20)

// Past slots hidden: Monday 18:10 leaves 18:30 onwards.
assert.equal(bookingDays(new Date("2026-10-26T13:10Z"), site.hours, holidays)[0].slots[0], "2026-10-26T18:30+05:00")
// After closing, today drops out.
assert.equal(bookingDays(new Date("2026-10-26T17:00Z"), site.hours, holidays)[0].date, "2026-10-27")
// Public holiday: Iqbal Day, Monday 9 Nov 2026.
assert.ok(!bookingDays(new Date("2026-11-08T03:00Z"), site.hours, holidays).some((d) => d.date === "2026-11-09"))

// The Worker's check: 30 minutes of grace, nothing on a Sunday, in the break or off the 30-minute grid.
const now = new Date("2026-10-26T13:10Z") // Mon 18:10
assert.ok(isBookableSlot("2026-10-26T18:00+05:00", now, site.hours, holidays))
assert.ok(!isBookableSlot("2026-10-26T17:30+05:00", now, site.hours, holidays))
assert.ok(!isBookableSlot("2026-11-01T12:00+05:00", now, site.hours, holidays))
assert.ok(!isBookableSlot("2026-10-30T13:30+05:00", now, site.hours, holidays))
assert.ok(!isBookableSlot("2026-10-27T12:15+05:00", now, site.hours, holidays))

assert.equal(slotLabel("2026-10-30T18:30+05:00", tz), "Fri 30 Oct, 6:30 PM")
assert.equal(slotLabel("2026-10-30T11:00+05:00", tz), "Fri 30 Oct, 11:00 AM")

for (const ok of ["0300 1234567", "03001234567", "+92 300 1234567", "923001234567", "0092-300-1234567", "(0300) 123-4567"])
  assert.equal(normalizePhone(ok), "+923001234567", ok)
for (const bad of ["", "0300 123456", "0400 1234567", "042 35761234", "+1 300 1234567", "03001234567x"])
  assert.equal(normalizePhone(bad), null, bad)
assert.equal(displayPhone("+923001234567"), "0300 1234567")
console.log("booking ok")
