import { booking, site, type BookingSummary } from "../content"
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
  const rows: [string, string][] = [
    [booking.review.device, b.device],
    [booking.review.fault, b.fault],
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
  const ay = tear + 80 + 260
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
