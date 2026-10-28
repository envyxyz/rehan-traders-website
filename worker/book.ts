import { z } from "zod"

import { faults, holidays, services, site } from "../src/content"
import { displayPhone, isBookableSlot, normalizePhone, slotLabel } from "../src/lib/booking"

export type BookEnv = { BOOKING_WEBHOOK_URL?: string; BOOKING_WEBHOOK_SECRET?: string }

const MIN_FILL_MS = 3000 // people take longer than this to answer five steps; simple bots do not
const WEBHOOK_TIMEOUT_MS = 5000
const MAX_BODY = 4096

const faultNames = new Set<string>([...faults, ...services.flatMap((s) => s.faults)])
const slugs = services.map((s) => s.slug)

const Booking = z
  .object({
    kind: z.enum(["book", "quote"]),
    service: z.string().refine((s) => slugs.includes(s)).optional(),
    // Any model name: the flow offers ~4k models and lets people type one that is not listed. Same character
    // rule as the name, and no leading = + - @ so a spreadsheet never reads it as a formula.
    device: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .regex(/^(?![=+\-@])[^\p{C}<>]+$/u),
    fault: z.string().refine((f) => faultNames.has(f)),
    slot: z.string().max(32).nullable(),
    name: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .regex(/^[^\p{C}<>]+$/u),
    phone: z
      .string()
      .max(32)
      .refine((p) => normalizePhone(p) !== null),
    /** Honeypot: hidden from people, so only bots fill it. */
    website: z.literal(""),
    /** Milliseconds the form was open, measured in the browser. */
    elapsed: z.number().min(MIN_FILL_MS),
  })
  .strict()
  .refine((b) => (b.kind === "quote" ? b.slot === null && !!b.service : b.slot !== null && isBookableSlot(b.slot, new Date(), site.hours, holidays)))

const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status })

/** POST /api/book: validate, then hand the booking to the Apps Script (Sheet row, job number, email to the shop). */
export async function book(request: Request, env: BookEnv): Promise<Response> {
  if (request.method !== "POST") return fail(405, "method")
  // JSON only: a cross-site page cannot send this content type without a CORS preflight, which we never answer.
  if (!request.headers.get("content-type")?.startsWith("application/json")) return fail(415, "type")
  const raw = await request.text()
  if (raw.length > MAX_BODY) return fail(413, "size")

  let parsed
  try {
    parsed = Booking.safeParse(JSON.parse(raw))
  } catch {
    return fail(400, "invalid")
  }
  if (!parsed.success) return fail(400, "invalid")
  const b = parsed.data
  const phone = normalizePhone(b.phone)!

  const row = {
    kind: b.kind,
    service: services.find((s) => s.slug === b.service)?.title ?? "",
    device: b.device,
    fault: b.fault,
    slot: b.slot ?? "",
    visit: b.slot ? slotLabel(b.slot, site.hours.timezone) : "",
    name: b.name,
    phone: displayPhone(phone),
    whatsapp: `https://wa.me/${phone.slice(1)}`,
  }

  try {
    if (!env.BOOKING_WEBHOOK_URL || !env.BOOKING_WEBHOOK_SECRET) throw new Error("webhook not configured")
    const res = await fetch(env.BOOKING_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: env.BOOKING_WEBHOOK_SECRET, ...row }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    })
    const out = (await res.json()) as { ok?: boolean; job?: unknown; error?: unknown }
    if (!out.ok || typeof out.job !== "string" || !/^RT-\d{4,}$/.test(out.job)) throw new Error(`webhook said ${String(out.error)}`)
    return Response.json({ ok: true, job: out.job })
  } catch (err) {
    // Never lose a booking silently: the full booking goes to the Worker logs (Cloudflare dashboard, this account
    // only), and the page tells the customer to send it on WhatsApp.
    console.error("booking webhook failed", String(err), JSON.stringify(row))
    return fail(502, "webhook")
  }
}
