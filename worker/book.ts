import { z } from "zod"

import { site } from "../src/content"
import { booking, faults, holidays, services } from "../src/content-large"
import { displayPhone, isBookableSlot, normalizePhone, slotLabel } from "../src/lib/booking"

export type BookEnv = { BOOKING_WEBHOOK_URL?: string; BOOKING_WEBHOOK_SECRET?: string }

const MIN_FILL_MS = 3000 // people take longer than this to answer five steps; simple bots do not
// The Apps Script takes 4 s for a plain booking and longer with photos (Drive lookups, attachments, the email).
const WEBHOOK_TIMEOUT_MS = 25000
const MAX_BODY = 4096
const MAX_PHOTO = 2_000_000 // base64 chars; the browser sends ~300 KB JPEGs (src/lib/upload.ts)
const UPLOAD_TIMEOUT_MS = 20000
const openFaults: readonly string[] = booking.fault.open

const faultNames = new Set<string>([...faults, ...services.flatMap((s) => s.faults), ...openFaults])
/** A Drive file id, as the Apps Script returns it for an uploaded photo. */
const driveId = z.string().regex(/^[\w-]{20,80}$/)
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
    // One or more faults joined with ", ", or one open fault alone (src/components/booking-flow.tsx).
    fault: z
      .string()
      .max(400)
      .refine((f) => {
        const picked = f.split(", ")
        return picked.every((p) => faultNames.has(p)) && new Set(picked).size === picked.length && (picked.length === 1 || !picked.some((p) => openFaults.includes(p)))
      }),
    /** The customer's words, with "Not sure" or "Not mentioned here". Any text, line breaks and tabs included; the Apps Script neutralises formulas and escapes HTML. */
    problem: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .regex(/^(?:[^\p{Cc}]|[\n\t])+$/u)
      .optional(),
    photos: z.array(driveId).max(3).optional(),
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
  .refine((b) => !openFaults.includes(b.fault) || !!b.problem)
  // A quote has no slot. It names a service, or (the ticket form on /quote) is an open fault with the customer's words.
  .refine((b) =>
    b.kind === "quote" ? b.slot === null && (!!b.service || (openFaults.includes(b.fault) && !!b.problem)) : b.slot !== null && isBookableSlot(b.slot, new Date(), site.hours, holidays)
  )

const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status })

/** POST /api/book: validate, then hand the booking to the Apps Script (Sheet row, job number, email to the shop). */
export async function book(request: Request, env: BookEnv): Promise<Response> {
  if (request.method !== "POST") return fail(405, "method")
  // JSON only: a cross-site page cannot send this content type without a CORS preflight, which we never answer.
  if (!request.headers.get("content-type")?.startsWith("application/json")) return fail(415, "type")
  // Refuse an oversized body by its declared length (bytes; up to 3 per character in UTF-8) before reading it.
  if (Number(request.headers.get("content-length")) > MAX_BODY * 3) return fail(413, "size")
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
    problem: b.problem ?? "",
    photos: b.photos ?? [],
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
    const out = (await res.json()) as { ok?: boolean; job?: unknown; error?: unknown; emailSent?: boolean; emailError?: unknown }
    if (out.ok && out.emailSent === false) console.error("booking saved but email failed", String(out.job), String(out.emailError))
    // 5 bookings per mobile number per hour, counted in the Sheet.
    if (out.error === "limit") return fail(429, "limit")
    if (!out.ok || typeof out.job !== "string" || !/^RT-\d{4,}$/.test(out.job)) throw new Error(`webhook said ${String(out.error)}`)
    return Response.json({ ok: true, job: out.job })
  } catch (err) {
    // Never lose a booking silently: the full booking goes to the Worker logs (Cloudflare dashboard, this account
    // only), and the page tells the customer to send it on WhatsApp.
    console.error("booking webhook failed", String(err), JSON.stringify(row))
    return fail(502, "webhook")
  }
}

/**
 * POST /api/upload: one booking photo, {"data": "<base64 JPEG>"} from src/lib/upload.ts. The Worker only checks
 * the type and size and adds the secret, without parsing the body (10 ms CPU on the free plan); the Apps Script
 * decodes it, checks it is a JPEG and saves it to the shop's Drive folder, returning the file id.
 */
export async function upload(request: Request, env: BookEnv): Promise<Response> {
  if (request.method !== "POST") return fail(405, "method")
  if (!request.headers.get("content-type")?.startsWith("application/json")) return fail(415, "type")
  if (Number(request.headers.get("content-length") ?? 0) > MAX_PHOTO) return fail(413, "size")
  const raw = await request.text()
  if (raw.length > MAX_PHOTO || !raw.startsWith('{"data":"') || !raw.endsWith("}")) return fail(400, "invalid")
  if (!env.BOOKING_WEBHOOK_URL || !env.BOOKING_WEBHOOK_SECRET) return fail(502, "webhook")
  try {
    const res = await fetch(env.BOOKING_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      // The secret and action go after the client's own fields, so they win (the last duplicate key does) and
      // the photo is never parsed here.
      body: `${raw.slice(0, -1)},"secret":${JSON.stringify(env.BOOKING_WEBHOOK_SECRET)},"action":"upload"}`,
      signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
    })
    const out = (await res.json()) as { ok?: boolean; id?: unknown; error?: unknown }
    if (!out.ok || !driveId.safeParse(out.id).success) throw new Error(`webhook said ${String(out.error)}`)
    return Response.json({ ok: true, id: out.id })
  } catch (err) {
    console.error("photo upload failed", String(err))
    return fail(502, "webhook")
  }
}
