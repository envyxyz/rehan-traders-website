import { expect, type Locator, type Page } from "@playwright/test"

import { booking } from "../../src/content-large"

/**
 * Type the device name. `scope` narrows the label to one form, for pages where two forms share it (the /quote tabs
 * keep both panels in the page). Typing before the page has hydrated is lost, so it is retried.
 */
export async function pickDevice(page: Page, device: string, scope: Page | Locator = page) {
  const field = scope.getByLabel(booking.device.label)
  await expect(async () => {
    await field.fill(device)
    await expect(field).toHaveValue(device)
  }).toPass()
}
