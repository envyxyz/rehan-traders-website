import { expect, test } from "@playwright/test"

import { actions, assistant, nav, ui } from "../../src/content"
import { booking } from "../../src/content-large"
import { routes } from "./routes"

// Phase 12. Phone only: the widths the shop's customers actually have.
test.describe("phone", () => {
  test.skip(({ isMobile }) => !isMobile, "phone layout")

  for (const width of [360, 430]) {
    test(`no sideways scroll on any route at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      for (const path of routes) {
        await page.goto(path)
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), path).toBeLessThanOrEqual(0)
      }
    })
  }

  test("controls are 44px on the pages with the most of them", async ({ page }) => {
    for (const path of ["/", "/repairs", "/about", "/repairs/iphone"]) {
      await page.goto(path)
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("a[href], button, input, textarea")]
          .filter((el) => {
            const box = el.getBoundingClientRect()
            const inSentence = getComputedStyle(el).display === "inline"
            return box.width > 1 && !inSentence && !el.closest("[inert], [aria-hidden=true]") && !el.matches(".sr-only") && (box.height < 43.5 || box.width < 43.5)
          })
          .map((el) => (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40))
      )
      expect(small, path).toEqual([])
    }
  })

  test("the menu's close button, Call and WhatsApp stay on screen on a short phone", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 })
    await page.goto("/")
    await expect(page.getByRole("button", { name: nav.menu })).toHaveAttribute("aria-haspopup", "dialog")
    await page.getByRole("button", { name: nav.menu }).click()
    const sheet = page.getByRole("dialog")
    await expect(sheet).toBeVisible()
    await sheet.locator("nav").evaluate((el) => el.parentElement?.scrollTo(0, 9999))
    await expect(sheet.getByRole("button", { name: ui.close })).toBeInViewport()
    await expect(sheet.getByRole("link", { name: nav.call })).toBeInViewport()
    await expect(sheet.getByRole("link", { name: actions.whatsappLabel })).toBeInViewport()
  })

  test("every repair in the Repairs list is reachable on a short phone", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 560 })
    await page.goto("/")
    await expect(page.getByRole("button", { name: nav.menu })).toHaveAttribute("aria-haspopup", "dialog")
    await page.getByRole("button", { name: nav.menu }).click()
    const sheet = page.getByRole("dialog")
    await sheet.getByRole("button", { name: "Repairs", exact: true }).click()
    await expect(sheet.getByRole("button", { name: nav.back })).toBeInViewport()
    await sheet.getByRole("list").getByRole("link").last().scrollIntoViewIfNeeded()
    await expect(sheet.getByRole("list").getByRole("link").last()).toBeInViewport()
  })

  test("the keyboard's next key moves from name to number", async ({ page }) => {
    await page.goto("/quote?tab=describe")
    const name = page.getByLabel(booking.details.name)
    await name.fill("Ali")
    await name.press("Enter")
    await expect(page.getByLabel(booking.details.phone)).toBeFocused()
  })

  test("floating chrome steps aside while a field has focus", async ({ page }) => {
    await page.goto("/quote?tab=describe")
    await expect(page.getByRole("button", { name: assistant.title })).toBeVisible()
    await page.getByLabel(booking.details.name).focus()
    await expect(page.getByRole("button", { name: assistant.title })).toBeHidden()
  })

  test("Back returns to the same place on the home page", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => scrollTo(0, 5000))
    const heading = page.getByRole("heading", { level: 2 }).nth(2)
    const before = await heading.evaluate((el) => el.getBoundingClientRect().top)
    await page.locator("footer a[href='/about']").first().evaluate((a: HTMLElement) => a.click())
    await page.waitForURL("**/about")
    await page.goBack()
    await expect.poll(() => heading.evaluate((el, was) => Math.abs(el.getBoundingClientRect().top - was), before)).toBeLessThan(40)
  })
})
