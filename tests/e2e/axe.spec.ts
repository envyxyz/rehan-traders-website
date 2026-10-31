import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

import { actions, assistant, nav } from "../../src/content"
import { routes } from "./routes"

// Zero violations, WCAG 2.2 AA, light and dark, on every page in the sitemap plus /book/confirmed and the 404, on both
// projects (desktop Edge and Pixel 7). The overlays (chat, booking sheet, phone menu) are scanned open on the home page.
const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]

async function scan(page: Page) {
  // Let the images and fonts settle, and any reveal animation finish, so contrast is read on the final colours.
  await page.waitForLoadState("load")
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  // Looping animations are left alone. A sheet's overlay fades in over the page behind it; scanning mid-fade reads the page's contrast through a half-opaque overlay.
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getComputedTiming().iterations === Infinity))
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze()
  expect(
    violations.map((v) => `${v.id} (${v.impact}): ${v.help}\n${v.nodes.map((n) => `  ${n.target.join(" ")}`).join("\n")}`),
    "axe violations"
  ).toEqual([])
}

for (const scheme of ["light", "dark"] as const) {
  test.describe(scheme, () => {
    test.use({ colorScheme: scheme })

    for (const path of routes) {
      test(`axe ${path}`, async ({ page }) => {
        await page.goto(path)
        await expect(page.getByRole("main")).toBeVisible()
        await scan(page)
      })
    }

    test("axe 404", async ({ page }) => {
      const res = await page.goto("/no-such-page")
      expect(res?.status()).toBe(404)
      await scan(page)
    })

    test("axe confirmed ticket", async ({ page }) => {
      await page.addInitScript(() =>
        sessionStorage.setItem(
          "rt-booking",
          JSON.stringify({ kind: "book", ref: "RT-0042", saved: true, device: "iPhone 13", fault: "Battery", visit: "Mon 2 Nov, 6:30 PM", slot: "2026-11-02T18:30:00+05:00", name: "Ali Test" })
        )
      )
      await page.goto("/book/confirmed")
      await expect(page.getByText("RT-0042")).toBeVisible()
      await scan(page)
    })

    test("axe chat sheet", async ({ page }) => {
      await page.goto("/")
      await page.getByRole("button", { name: assistant.title }).click()
      await expect(page.getByRole("dialog", { name: assistant.title })).toBeVisible()
      await scan(page)
    })

    test("axe phone menu sheet", async ({ page, isMobile }) => {
      test.skip(!isMobile, "the menu sheet is the phone nav")
      await page.goto("/")
      // The sheet is a next/dynamic chunk; until it loads the button is an inert placeholder and a click is lost.
      await expect(page.getByRole("button", { name: nav.menu })).toHaveAttribute("aria-haspopup", "dialog")
      await page.getByRole("button", { name: nav.menu }).click()
      await expect(page.getByRole("dialog", { name: nav.menu })).toBeVisible()
      await scan(page)
    })

    test("axe booking sheet", async ({ page }) => {
      await page.goto("/")
      await page.locator("#top").getByRole("link", { name: actions.book }).first().click()
      await expect(page.getByRole("dialog")).toBeVisible()
      await scan(page)
    })
  })
}
