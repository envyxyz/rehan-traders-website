import { expect, test, type Page } from "@playwright/test"

import { actions, booking } from "../../src/content"
import { pickDevice } from "./helpers"

// The UI tests stub /api/book so no row lands in the real Sheet. The API tests at the end hit the Worker.
const stubBook = (page: Page, status: number, body: object) =>
  page.route("/api/book", (route) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }))

const next = (page: Page) => page.getByRole("button", { name: booking.next }).click()

async function pickDeviceAndFault(page: Page, fault = "Charging") {
  await pickDevice(page, "Samsung", "z fold5", "Samsung Galaxy Z Fold5")
  await next(page)
  await page.getByRole("radio", { name: fault }).click()
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
  await page.getByRole("radio", { name: "Battery" }).click()
  await next(page)
  await next(page) // a time is always picked on the wheel

  await fillDetails(page, "  ", "0400 1234567")
  await expect(page.getByText(booking.details.nameError)).toBeVisible()
  await expect(page.getByText(booking.details.phoneError)).toBeVisible()
  await expect(page.getByLabel(booking.details.phone)).toHaveAttribute("aria-invalid", "true")

  await page.getByRole("button", { name: booking.back }).click()
  await page.getByRole("button", { name: booking.back }).click()
  await expect(page.getByRole("radio", { name: "Battery" })).toBeChecked()
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
      { ...valid, kind: "quote", service: "iphone", extra: 1 },
      { ...valid, slot: "2026-11-01T12:00+05:00" }, // a Sunday
    ])
      expect((await post(page, bad)).status(), JSON.stringify(bad)).toBe(400)
    expect((await page.request.get("/api/book")).status()).toBe(405)
  })
})
