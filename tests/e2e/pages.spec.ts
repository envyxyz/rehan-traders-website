import { expect, test, type Locator } from "@playwright/test"

import { actions, priceMode, states } from "../../src/content"
import { estimator, services } from "../../src/content-large"
import { pickDevice } from "./helpers"

// Launch runs in quote mode: no price, no turnaround time, anywhere in a result.
const money = /\b(rs\.?|pkr|rupees?)\s*\d|₨|\d[\d,]*\s*(rs\b|rupees?)|\$\s*\d/i
const turnaround = /\b(\d+|one|two|three|same|few)[\s-]*(minutes?|mins?|hours?|hrs?|days?|day)\b|\bsame[- ]day\b|\bwithin\s+(the\s+)?(hour|day|week)\b|\b(instant|immediately|while you wait|in no time)\b/i

test("launch is in quote mode", () => {
  expect(priceMode).toBe("quote")
})

test("estimate: every fault ends in a result with a WhatsApp quote link and no price or turnaround", async ({ page }) => {
  await page.goto("/quote")
  const form = page.locator("form:visible")
  await pickDevice(page, "Samsung Galaxy S23", form) // Start again keeps the device
  for (const f of estimator.faults) {
    await page.getByRole("radio", { name: f.label, exact: true }).click()
    await form.getByRole("button", { name: estimator.submit }).click()
    await expect(page.getByRole("heading", { name: estimator.result.title })).toBeVisible()
    const result = await page.getByRole("main").innerText()
    expect(result, f.slug).not.toMatch(money)
    expect(result, f.slug).not.toMatch(turnaround)
    const link = page.getByRole("link", { name: estimator.result.quote })
    expect(new URL((await link.getAttribute("href"))!).searchParams.get("text"), f.slug).toBe(estimator.whatsapp("Samsung Galaxy S23", f.label))
    // A matching repair offers the booking with the service picked (Apple-only faults match nothing on a Samsung).
    const book = page.getByRole("link", { name: actions.bookRepair })
    if (await book.count()) await expect(book, f.slug).toHaveAttribute("href", /^\/book\?service=[a-z-]+$/)
    // dispatchEvent, not a click: scrolled to, the button can sit under the fixed nav island, which takes the click.
    await page.getByRole("button", { name: estimator.result.again }).dispatchEvent("click")
    await expect(page.getByRole("radio", { name: f.label, exact: true })).toBeVisible()
  }
})

test("repair pages show no price in quote mode", async ({ page }) => {
  for (const s of services.slice(0, 3)) {
    await page.goto(`/repairs/${s.slug}`)
    expect(await page.getByRole("main").innerText(), s.slug).not.toMatch(money)
  }
})

test("home repairs: eight icon cards, three to a row, the last two centred, the estimate band under them", async ({ page, isMobile }) => {
  test.skip(isMobile, "the grid layout is checked at desktop width")
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  const grid = page.locator("#repairs ul")
  const cells = grid.locator(":scope > li")
  await expect(cells).toHaveCount(services.length)
  for (const cell of await cells.all()) {
    await expect(cell.locator("[data-slot=card] > [aria-hidden] svg"), "one icon in the band").toHaveCount(1)
    await expect(cell.locator("img")).toHaveCount(0)
  }
  // One action per card: the title link, which covers the card.
  const links = await cells.first().locator("a").evaluateAll((els) => els.map((el) => el.getAttribute("href")))
  expect(links).toEqual([`/repairs/${services[0].slug}`])

  const box = async (l: Locator) => (await l.boundingBox())!
  const g = await box(grid)
  expect((await box(page.locator("#repairs > div"))).width).toBe(1056) // max-w-cards, not the page width
  const rows = new Map<number, { x: number; width: number }[]>()
  for (const cell of await cells.all()) {
    const b = await box(cell)
    const top = Math.round(b.y)
    rows.set(top, [...(rows.get(top) ?? []), { x: b.x, width: b.width }])
  }
  const perRow = [...rows.values()]
  expect(perRow.map((r) => r.length)).toEqual([3, 3, 2])
  const last = perRow[2]
  const span = { left: Math.min(...last.map((c) => c.x)), right: Math.max(...last.map((c) => c.x + c.width)) }
  expect((span.left + span.right) / 2, "last row centred").toBeCloseTo(g.x + g.width / 2, 0)

  // The estimate form is a band under the grid as wide as it, not one of its cells.
  await expect(grid.locator("form")).toHaveCount(0)
  const band = await box(page.locator("#repairs form").locator("xpath=.."))
  expect(band.y).toBeGreaterThan(g.y + g.height)
  expect(band.x).toBeCloseTo(g.x, 0)
  expect(band.width).toBeCloseTo(g.width, 0)
})

test("an unknown URL returns the 404 page with a way home", async ({ page }) => {
  for (const path of ["/no-such-page", "/repairs/no-such-repair", "/book/confirmed/extra"]) {
    const res = await page.goto(path)
    expect(res?.status(), path).toBe(404)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(states.notFound.title)
    await expect(page.getByText(states.notFound.lede)).toBeVisible()
    await expect(page.getByRole("link", { name: states.notFound.repairs })).toHaveAttribute("href", "/repairs")
    await page.getByRole("link", { name: states.notFound.home }).click()
    await expect(page).toHaveURL("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  }
})

test("a 404 is not indexed", async ({ page }) => {
  await page.goto("/no-such-page")
  const robots = await page.locator('meta[name="robots"]').getAttribute("content")
  expect(robots ?? "").toContain("noindex")
})
