import { expect, type Page } from "@playwright/test"

import { booking } from "../../src/content"

/** Type into a dropdown and click its option. Typing before the page has hydrated is lost, so it is retried. */
async function pick(page: Page, label: string, text: string, option: string) {
  const choice = page.getByRole("option", { name: option, exact: true })
  await expect(async () => {
    await page.getByLabel(label).fill(text)
    await expect(choice).toBeVisible({ timeout: 1000 })
  }).toPass()
  await choice.click()
}

/** Brand dropdown, then model dropdown; both take typing. */
export async function pickDevice(page: Page, brand: string | null, model: string, option: string) {
  if (brand) await pick(page, booking.device.brand, brand, brand)
  await pick(page, booking.device.model, model, option)
}
