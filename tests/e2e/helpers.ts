import { expect, type Locator, type Page } from "@playwright/test"

import { booking } from "../../src/content"

/** Type into a dropdown and click its option. Typing before the page has hydrated is lost, so it is retried. */
async function pick(page: Page, scope: Page | Locator, label: string, text: string, option: string) {
  const choice = page.getByRole("option", { name: option, exact: true })
  await expect(async () => {
    await scope.getByLabel(label).fill(text)
    await expect(choice).toBeVisible({ timeout: 1000 })
  }).toPass()
  await choice.click()
}

/**
 * Brand dropdown, then model dropdown; both take typing. `scope` narrows the labels to one form, for pages where two
 * forms share them (the /estimate tabs keep both panels in the page).
 */
export async function pickDevice(page: Page, brand: string | null, model: string, option: string, scope: Page | Locator = page) {
  if (brand) await pick(page, scope, booking.device.brand, brand, brand)
  await pick(page, scope, booking.device.model, model, option)
}
