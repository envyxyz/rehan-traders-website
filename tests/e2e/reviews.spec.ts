import { expect, test } from "@playwright/test"

import { reviews } from "../../src/content-large"

test("reviews: every review shows at once, in the listed order, with no carousel", async ({ page }) => {
  await page.goto("/reviews")
  const figures = page.getByRole("main").locator("figure")
  await expect(figures).toHaveCount(reviews.items.length)
  await expect(figures.first().locator("blockquote")).toHaveText(reviews.items[0].text.trim())
  await expect(figures.last()).toBeVisible()
})
