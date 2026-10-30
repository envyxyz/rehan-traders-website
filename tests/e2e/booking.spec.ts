import { expect, test, type Page } from "@playwright/test"
import sharp from "sharp"

import { actions, booking } from "../../src/content"
import { book, upload } from "../../worker/book"
import { pickDevice } from "./helpers"

// The UI tests stub /api/book and /api/upload, so nothing reaches the real Apps Script (no row, no email, no Drive
// file). The API tests at the end hit the Worker, but only with input it refuses before it calls the webhook.
const stubBook = (page: Page, status: number, body: object) =>
  page.route("/api/book", (route) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }))

const fault = (page: Page, name: string) => page.getByRole("button", { name, exact: true })

const next = (page: Page) => page.getByRole("button", { name: booking.next }).click()

async function pickDeviceAndFault(page: Page, faultName = "Charging") {
  await pickDevice(page, "Samsung", "z fold5", "Samsung Galaxy Z Fold5")
  await next(page)
  await fault(page, faultName).click()
  await next(page)
}

async function fillDetails(page: Page, name = "Ali Test", phone = "0300 1234567") {
  await page.getByLabel(booking.details.name).fill(name)
  await page.getByLabel(booking.details.phone).fill(phone)
  await next(page)
}

test("books a visit and hands off to WhatsApp", async ({ page }) => {
  await stubBook(page, 200, { ok: true, job: "RT-0042" })
  await page.goto("/book")
  await expect(page.getByText(booking.progress(1, 5, booking.steps.device.name))).toBeVisible()
  await pickDeviceAndFault(page)

  // The wheel starts on the first open time; roll the hour once to prove it moves.
  const hour = page.getByRole("spinbutton", { name: booking.time.hour })
  await hour.focus()
  await page.keyboard.press("ArrowDown")
  const label = (await page.getByText(booking.time.picked("")).textContent())!.replace(booking.time.picked(""), "")
  await next(page)
  await fillDetails(page)

  await expect(page.getByRole("heading", { name: booking.steps.review.title })).toBeFocused()
  await expect(page.getByText("Samsung Galaxy Z Fold5", { exact: true })).toBeVisible()
  await expect(page.getByText("0300 1234567")).toBeVisible()
  await page.getByRole("button", { name: booking.review.submit }).click()

  await expect(page).toHaveURL("/book/confirmed")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(booking.confirmed.title)
  await expect(page.getByText("RT-0042")).toBeVisible()
  const wa = new URL((await page.getByRole("link", { name: booking.confirmed.send }).getAttribute("href"))!)
  const text = wa.searchParams.get("text")!
  expect(text).toContain("Booking No. RT-0042")
  expect(text).toContain("Device: Samsung Galaxy Z Fold5")
  expect(text).toContain("Fault: Charging")
  expect(text).toContain(label)
  expect(text).toContain("Name: Ali Test")
  expect(text).not.toContain("0300") // the shop already has the number; it stays out of the link
  const ics = await page.getByRole("link", { name: booking.confirmed.calendar }).getAttribute("href")
  expect(decodeURIComponent(ics!)).toContain("UID:RT-0042@")
})

test("takes several faults, a description and a photo, and sends them", async ({ page }) => {
  await stubBook(page, 200, { ok: true, job: "RT-0044" })
  await page.route("/api/upload", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: "a".repeat(33) }) }))
  let sent: Record<string, unknown> = {}
  await page.route("/api/book", (route) => {
    sent = route.request().postDataJSON()
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, job: "RT-0044" }) })
  })
  await page.goto("/book")
  await pickDevice(page, "Apple", "13", "iPhone 13")
  await next(page)
  await fault(page, "Battery").click()
  await fault(page, "Charging").click()
  await expect(fault(page, "Battery")).toHaveAttribute("aria-pressed", "true")
  await fault(page, booking.fault.open[0]).click() // an open choice stands alone: the listed ones drop
  await expect(fault(page, "Battery")).toHaveAttribute("aria-pressed", "false")
  await page.getByLabel(booking.fault.describe).fill("- battery <20% by noon, +91 charger")
  const jpeg = await sharp({ create: { width: 8, height: 8, channels: 3, background: "#888888" } }).jpeg().toBuffer()
  await page.locator('input[type="file"]').setInputFiles({ name: "crack.jpg", mimeType: "image/jpeg", buffer: jpeg })
  await expect(page.getByRole("button", { name: booking.fault.removePhoto })).toBeVisible() // uploaded
  await next(page)
  await next(page)
  await fillDetails(page)
  await page.getByRole("button", { name: booking.review.submit }).click()
  await expect(page).toHaveURL("/book/confirmed")
  expect(sent).toMatchObject({ fault: booking.fault.open[0], problem: "- battery <20% by noon, +91 charger", photos: ["a".repeat(33)] })
})

test("asks for a quote from a repair card link", async ({ page }) => {
  await stubBook(page, 200, { ok: true, job: "RT-0043" })
  await page.goto("/book?service=galaxy-z-fold-flip")
  await pickDeviceAndFault(page, "Inner screen")
  await page.getByRole("button", { name: actions.getQuote }).click()
  await fillDetails(page)
  await expect(page.getByText(booking.review.quoteVisit)).toBeVisible()
  await page.getByRole("button", { name: actions.getQuote }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(actions.quoteSent)
  await expect(page.getByRole("link", { name: booking.confirmed.calendar })).toHaveCount(0)
})

test("shows each validation error, and Back keeps answers", async ({ page }) => {
  await page.goto("/book")
  await next(page)
  await expect(page.locator("form").getByRole("alert")).toHaveText(booking.device.pickError)
  // Picking Apple lists its models (the brand is not in their names: "iPhone 13").
  await pickDevice(page, "Apple", "13", "iPhone 13")
  await next(page)
  await next(page)
  await expect(page.locator("form").getByRole("alert")).toHaveText(booking.fault.pickError)
  await fault(page, "Battery").click()
  await next(page)
  await next(page) // a time is always picked on the wheel

  await fillDetails(page, "  ", "0400 1234567")
  await expect(page.getByText(booking.details.nameError)).toBeVisible()
  await expect(page.getByText(booking.details.phoneError)).toBeVisible()
  await expect(page.getByLabel(booking.details.phone)).toHaveAttribute("aria-invalid", "true")

  await page.getByRole("button", { name: booking.back }).click()
  await page.getByRole("button", { name: booking.back }).click()
  await expect(fault(page, "Battery")).toHaveAttribute("aria-pressed", "true")
})

test("still confirms with a local reference when the Sheet is down", async ({ page }) => {
  await stubBook(page, 502, { ok: false, error: "webhook" })
  await page.goto("/book")
  await pickDeviceAndFault(page)
  await next(page)
  await fillDetails(page)
  await page.getByRole("button", { name: booking.review.submit }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(booking.confirmed.failedTitle)
  await expect(page.getByText(/^WEB-[0-9A-Z]{6}$/)).toBeVisible()
  const wa = await page.getByRole("link", { name: booking.confirmed.send }).getAttribute("href")
  expect(decodeURIComponent(wa!)).toMatch(/Booking No\. WEB-/)
})

test("the iPhone repair fixes the brand to Apple", async ({ page }) => {
  await page.goto("/book?service=iphone")
  await expect(page.getByLabel(booking.device.brand)).toBeDisabled()
  await expect(page.getByLabel(booking.device.brand)).toHaveValue("Apple")
  await pickDevice(page, null, "15 pro", "iPhone 15 Pro")
  await next(page)
  await expect(page.getByRole("heading", { name: booking.steps.fault.title })).toBeVisible()
})

test("a Book button opens the booking sheet", async ({ page, isMobile }) => {
  test.skip(isMobile, "the hero button is the same component on phones")
  await page.goto("/")
  await page.locator("#top").getByRole("link", { name: actions.book }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("dialog").getByLabel(booking.device.brand)).toBeVisible()
  await expect(page).toHaveURL("/")
})

test("an upload cannot become a booking: the Worker's action and secret come last", async () => {
  let forwarded = ""
  const real = globalThis.fetch
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    forwarded = String(init?.body)
    return Response.json({ ok: true, id: "a".repeat(33) })
  }) as typeof fetch
  try {
    const env = { BOOKING_WEBHOOK_URL: "https://webhook.invalid/exec", BOOKING_WEBHOOK_SECRET: "worker-secret" }
    const send = (body: string) => upload(new Request("https://x/api/upload", { method: "POST", headers: { "content-type": "application/json" }, body }), env)
    const forged = await send('{"data":"AAAA","action":"book","secret":"guess","kind":"quote","device":"x"}')
    expect(forged.status).toBe(200)
    expect(JSON.parse(forwarded)).toMatchObject({ action: "upload", secret: "worker-secret" })
    forwarded = ""
    expect((await send('{"data":"AAAA"} ')).status).toBe(400) // must end with }
    expect(forwarded).toBe("")
  } finally {
    globalThis.fetch = real
  }
})

test("the Worker takes ordinary punctuation in the description and refuses control characters", async () => {
  const real = globalThis.fetch
  let forwarded: { problem?: string } = {}
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    forwarded = JSON.parse(String(init?.body))
    return Response.json({ ok: true, job: "RT-0001" })
  }) as typeof fetch
  try {
    const env = { BOOKING_WEBHOOK_URL: "https://webhook.invalid/exec", BOOKING_WEBHOOK_SECRET: "worker-secret" }
    const send = (problem: string) =>
      book(
        new Request("https://x/api/book", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ kind: "quote", service: "iphone", device: "iPhone 13", fault: "Not sure", problem, slot: null, name: "QA", phone: "0300 1234567", website: "", elapsed: 5000 }),
        }),
        env
      )
    const text = "- battery <20% = bad\n\t+91 charger, @home"
    expect((await send(text)).status).toBe(200)
    expect(forwarded.problem).toBe(text)
    expect((await send("bad\u0007bell")).status).toBe(400)

    // The quote ticket on /estimate has no service: allowed for an open fault with the customer's words, nothing else.
    const ticket = (extra: object) =>
      book(
        new Request("https://x/api/book", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ kind: "quote", device: "iPhone 13", fault: "Not mentioned here", problem: "Dead after a drop", slot: null, name: "QA", phone: "0300 1234567", website: "", elapsed: 5000, ...extra }),
        }),
        env
      )
    expect((await ticket({})).status).toBe(200)
    expect((await ticket({ problem: undefined })).status).toBe(400) // no words
    expect((await ticket({ fault: "Battery" })).status).toBe(400) // a listed fault still needs a service
  } finally {
    globalThis.fetch = real
  }
})

test.describe("POST /api/book", () => {
  const valid = { kind: "book", device: "iPhone", fault: "Battery", slot: null, name: "Bot", phone: "0300 1234567", website: "", elapsed: 5000 }
  const post = (page: Page, data: object) => page.request.post("/api/book", { data })

  test("refuses bad input, the honeypot and fast fills", async ({ page }) => {
    for (const bad of [
      valid, // a booking with no slot
      { ...valid, kind: "quote" }, // a quote with no service
      { ...valid, kind: "quote", service: "iphone", website: "spam" },
      { ...valid, kind: "quote", service: "iphone", elapsed: 800 },
      { ...valid, kind: "quote", service: "iphone", phone: "12345" },
      { ...valid, kind: "quote", service: "iphone", device: "=HYPERLINK(1)" },
      { ...valid, kind: "quote", service: "iphone", name: "<script>" },
      { ...valid, kind: "quote", service: "iphone", fault: "Not sure", problem: "bad\u0007bell" }, // control character
      { ...valid, kind: "quote", service: "iphone", extra: 1 },
      { ...valid, slot: "2026-11-01T12:00+05:00" }, // a Sunday
    ])
      expect((await post(page, bad)).status(), JSON.stringify(bad)).toBe(400)
    expect((await page.request.get("/api/book")).status()).toBe(405)
  })
})
