// Self-check for src/lib/hours.ts. Run: node scripts/check-hours.mjs (Node 23.6+ strips the TS types).
import assert from "node:assert/strict"

import { site } from "../src/content.ts"
import { openStatus, weekdayIn } from "../src/lib/hours.ts"

// Times are UTC; Karachi is UTC+5. 2026-10-26 is a Monday.
const at = (iso) => openStatus(new Date(iso), site.hours, site.status).text

assert.equal(at("2026-10-26T05:59Z"), "Closed now · opens 11 AM") // Mon 10:59
assert.equal(at("2026-10-26T06:00Z"), "Open now · closes 10 PM") // Mon 11:00
assert.equal(at("2026-10-26T17:00Z"), "Closed now · opens tomorrow 11 AM") // Mon 22:00
assert.equal(at("2026-10-30T08:30Z"), "Prayer break · opens 2 PM") // Fri 13:30
assert.equal(at("2026-10-30T09:00Z"), "Open now · closes 10 PM") // Fri 14:00
assert.equal(at("2026-10-31T18:00Z"), "Closed now · opens Monday 11 AM") // Sat 23:00
assert.equal(at("2026-11-01T10:00Z"), "Closed now · opens tomorrow 11 AM") // Sun 15:00
assert.equal(weekdayIn(new Date("2026-10-26T20:00Z"), site.hours.timezone), 2) // Mon 20:00 UTC is Tue 01:00 in Karachi
console.log("hours ok")
