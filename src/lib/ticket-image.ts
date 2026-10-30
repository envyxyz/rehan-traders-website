import { booking, showsFault, site, type BookingSummary } from "../content"
import { ticketColors as C } from "./tokens"

const SIZE = 1080
const PAD = 72

/** Largest size up to `max` at which `text` fits `width`; below `min` it is cut with an ellipsis. */
function fit(ctx: CanvasRenderingContext2D, text: string, weight: number, max: number, min: number, width: number, family: string) {
  for (let px = max; px >= min; px -= 2) {
    ctx.font = `${weight} ${px}px ${family}`
    if (ctx.measureText(text).width <= width) return text
  }
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}…`).width > width) t = t.slice(0, -1)
  return `${t}…`
}

/** `text` as lines of at most `width`, broken at spaces (or anywhere in a long word); the last line is cut with an ellipsis when it runs out of lines. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number, maxLines: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ")
  const lines: string[] = []
  let line = ""
  for (let word of words) {
    while (ctx.measureText(word).width > width) {
      // A word wider than the line: split it where it fits.
      let cut = word.length - 1
      while (cut > 1 && ctx.measureText(word.slice(0, cut)).width > width) cut--
      if (line) lines.push(line)
      lines.push(word.slice(0, cut))
      line = ""
      word = word.slice(cut)
    }
    const next = line ? `${line} ${word}` : word
    if (!line || ctx.measureText(next).width <= width) line = next
    else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  if (lines.length <= maxLines) return lines
  const kept = lines.slice(0, maxLines)
  let last = kept[maxLines - 1]
  while (last.length > 1 && ctx.measureText(`${last}…`).width > width) last = last.slice(0, -1)
  kept[maxLines - 1] = `${last}…`
  return kept
}

/**
 * The confirmation ticket as a 1080×1080 PNG, for the customer's gallery: shop name, job number in Signal Red,
 * a tear line, then device, fault, visit, name, address and phone. Drawn on a canvas in the page's own font.
 */
export async function ticketImage(b: BookingSummary): Promise<Blob> {
  const family = getComputedStyle(document.body).fontFamily
  await Promise.all([document.fonts.load(`800 120px ${family}`), document.fonts.load(`500 30px ${family}`)])

  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = SIZE
  const ctx = canvas.getContext("2d")!
  const c = booking.confirmed
  const inner = SIZE - PAD * 2 - 64 // text width inside the ticket

  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Header: shop name left, phone right.
  ctx.textBaseline = "alphabetic"
  ctx.fillStyle = C.ink
  ctx.font = `800 44px ${family}`
  ctx.fillText(site.name, PAD, PAD + 40)
  ctx.font = `600 30px ${family}`
  ctx.textAlign = "right"
  ctx.fillText(site.phone.display, SIZE - PAD, PAD + 38)
  ctx.textAlign = "left"

  // Ticket body.
  const top = PAD + 92
  const bottom = SIZE - PAD - 70
  ctx.fillStyle = C.panel
  ctx.beginPath()
  ctx.roundRect(PAD, top, SIZE - PAD * 2, bottom - top, 40)
  ctx.fill()

  const x = PAD + 32
  ctx.fillStyle = C.steel
  ctx.font = `500 30px ${family}`
  ctx.fillText(b.saved ? c.number : c.reference, x, top + 70)
  ctx.fillStyle = C.signal
  ctx.fillText(fit(ctx, b.ref, 800, 150, 80, inner, family), x, top + 210)

  // Tear line with notches cut to the paper colour.
  const tear = top + 270
  ctx.strokeStyle = C.hairline
  ctx.lineWidth = 3
  ctx.setLineDash([14, 12])
  ctx.beginPath()
  ctx.moveTo(PAD + 40, tear)
  ctx.lineTo(SIZE - PAD - 40, tear)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = C.paper
  for (const cx of [PAD, SIZE - PAD]) {
    ctx.beginPath()
    ctx.arc(cx, tear, 22, 0, Math.PI * 2)
    ctx.fill()
  }

  // Details: two columns, label over value, then the address across.
  const half = (inner - 32) / 2
  // A quote with the customer's words drops the Fault ("Not mentioned here") and the visit ("no visit booked") to
  // make room for the problem itself.
  const asked = b.kind === "quote" && !!b.problem
  const rows: [string, string][] = asked
    ? [
        [booking.review.device, b.device],
        [booking.review.name, b.name],
      ]
    : [
        [booking.review.device, b.device],
        ...(showsFault(b) ? [[booking.review.fault, b.fault] as [string, string]] : []),
        [c.visit, b.visit ?? booking.review.quoteVisit],
        [booking.review.name, b.name],
      ]
  rows.forEach(([label, value], i) => {
    const lx = x + (i % 2) * (half + 32)
    const ly = tear + 80 + Math.floor(i / 2) * 130
    ctx.fillStyle = C.steel
    ctx.font = `500 28px ${family}`
    ctx.fillText(label, lx, ly)
    ctx.fillStyle = C.ink
    ctx.fillText(fit(ctx, value, 700, 40, 26, half, family), lx, ly + 50)
  })
  let ay = tear + 80 + Math.ceil(rows.length / 2) * 130
  if (asked) {
    ctx.fillStyle = C.steel
    ctx.font = `500 28px ${family}`
    ctx.fillText(booking.review.problem, x, ay)
    ctx.fillStyle = C.ink
    ctx.font = `500 30px ${family}`
    const lines = wrap(ctx, b.problem!, inner, 3)
    lines.forEach((l, i) => ctx.fillText(l, x, ay + 46 + i * 42))
    ay += 46 + (lines.length - 1) * 42 + 62
  }
  ctx.fillStyle = C.steel
  ctx.font = `500 28px ${family}`
  ctx.fillText(c.where, x, ay)
  ctx.fillStyle = C.ink
  ctx.font = `500 32px ${family}`
  // Address on up to two lines, broken at a comma.
  const parts = site.address.lines.join(", ").split(", ")
  let first = parts.length
  while (first > 1 && ctx.measureText(parts.slice(0, first).join(", ")).width > inner) first--
  ctx.fillText(parts.slice(0, first).join(", ") + (first < parts.length ? "," : ""), x, ay + 46)
  if (first < parts.length) ctx.fillText(fit(ctx, parts.slice(first).join(", "), 500, 32, 22, inner, family), x, ay + 90)

  // Footer line under the ticket.
  ctx.fillStyle = C.steel
  ctx.font = `500 30px ${family}`
  ctx.fillText(c.image.footer, PAD, SIZE - PAD - 8)
  ctx.textAlign = "right"
  ctx.fillText(site.url.replace("https://", ""), SIZE - PAD, SIZE - PAD - 8)

  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob"))), "image/png"))
}
