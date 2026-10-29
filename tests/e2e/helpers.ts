import { type Page } from "@playwright/test"

import { booking } from "../../src/content"

/** Brand dropdown, then model dropdown; both take typing. */
export async function pickDevice(page: Page, brand: string | null, model: string, option: string) {
  if (brand) {
    await page.getByLabel(booking.device.brand).fill(brand)
    await page.getByRole("option", { name: brand, exact: true }).click()
  }
  await page.getByLabel(booking.device.model).fill(model)
  await page.getByRole("option", { name: option, exact: true }).click()
}
