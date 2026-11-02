import { expect, type Page, test } from "@playwright/test"

import { hero } from "../../src/content"

test("phone: the fold starts shut and opens by itself once it is scrolled into view", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop starts open")
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  const fold = page.locator("button.fold-stage")
  await expect(fold).toHaveAttribute("aria-label", hero.fold.open)
  expect(await fold.locator("img").evaluate((img: HTMLImageElement) => img.currentSrc)).toContain("fold-poster-closed")
  await page.evaluate(() => scrollBy(0, 10)) // any interaction loads the scene
  await expect(page.locator("canvas[data-ready]")).toBeAttached({ timeout: 30_000 })
  await fold.scrollIntoViewIfNeeded()
  await expect(fold).toHaveAttribute("aria-label", hero.fold.close, { timeout: 10_000 })
})

test.describe("phone: fold sound", () => {
  // Each snap that really starts, with the audio context's state at that moment.
  const starts = (page: Page) => page.evaluate(() => (window as unknown as { starts: string[] }).starts)
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, "the snap on opening by itself is a phone behaviour")
    await page.addInitScript(() => {
      const w = window as unknown as { starts: string[] }
      w.starts = []
      const start = AudioBufferSourceNode.prototype.start
      AudioBufferSourceNode.prototype.start = function (...a) {
        w.starts.push(this.context.state)
        return start.apply(this, a)
      }
    })
    await page.goto("/")
    await page.waitForLoadState("networkidle")
  })

  test("a tap on the fold snaps once, with audio running", async ({ page }) => {
    await page.locator("button.fold-stage").tap()
    await expect.poll(() => starts(page), { timeout: 30_000 }).toEqual(["running"])
  })

  test("a tap anywhere, then a scroll: the opening in view snaps once", async ({ page }) => {
    await page.locator("h1").tap()
    await page.evaluate(() => document.querySelector("button.fold-stage")!.scrollIntoView({ block: "center" }))
    await expect.poll(() => starts(page), { timeout: 30_000 }).toEqual(["running"])
  })

  test("a scroll with no tap opens the fold in silence", async ({ page }) => {
    const fold = page.locator("button.fold-stage")
    await page.evaluate(() => document.querySelector("button.fold-stage")!.scrollIntoView({ block: "center" }))
    await expect(fold).toHaveAttribute("aria-label", hero.fold.close, { timeout: 30_000 })
    expect(await starts(page)).toEqual([])
  })
})

test("hero fold: three.js waits for an interaction, then the fold closes and opens by keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones start shut (the test above)")
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  // A page load alone (what Lighthouse sees) shows the poster and never loads the scene.
  const canvas = page.locator("canvas[data-ready]")
  await expect(canvas).toHaveCount(0)
  await expect(page.locator(".fold-stage img")).toBeVisible()

  await page.getByRole("button", { name: hero.fold.close }).focus()
  await page.keyboard.press("Shift")
  await expect(canvas).toBeAttached({ timeout: 30_000 })

  await page.keyboard.press("Enter")
  const open = page.getByRole("button", { name: hero.fold.open })
  await expect(open).toBeFocused()
  // Presses while the fold is still running are ignored; once it has settled, Enter opens it again.
  await expect(async () => {
    await page.keyboard.press("Enter")
    await expect(page.getByRole("button", { name: hero.fold.close })).toBeFocused({ timeout: 500 })
  }).toPass({ timeout: 10_000 })
})
