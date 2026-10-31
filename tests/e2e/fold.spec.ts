import { expect, test } from "@playwright/test"

import { hero } from "../../src/content"

test("hero fold: three.js waits for an interaction, then the fold closes and opens by keyboard", async ({ page }) => {
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
