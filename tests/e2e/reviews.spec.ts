import { expect, test } from "@playwright/test"

import { reviewsPage } from "../../src/content"
import { reviews } from "../../src/content-large"

test("reviews: every review is in the page, one is shown, arrow keys step and the others are inert", async ({ page }) => {
  await page.goto("/reviews")
  const region = page.getByRole("region", { name: reviewsPage.carouselLabel })
  await expect(region).toHaveAttribute("aria-roledescription", reviewsPage.carouselRole)
  // Crawlers read all of them: every figure is in the HTML, in the listed order.
  const figures = region.locator("figure")
  await expect(figures).toHaveCount(reviews.items.length)
  await expect(figures.first().locator("blockquote")).toHaveText(reviews.items[0].text.trim())
  // Only the one on show can be reached.
  await expect(figures.nth(0)).not.toHaveAttribute("inert", /.*/)
  await expect(figures.nth(1)).toHaveAttribute("inert", "")
  await expect(figures.nth(1)).toHaveAttribute("aria-hidden", "true")

  await region.focus()
  await expect(page.getByText(reviewsPage.counter(1, reviews.items.length))).toBeVisible()
  await page.keyboard.press("ArrowRight")
  await expect(page.getByText(reviewsPage.counter(2, reviews.items.length))).toBeVisible()
  await expect(figures.nth(1)).not.toHaveAttribute("inert", /.*/)
  await expect(figures.nth(0)).toHaveAttribute("inert", "")
  await page.keyboard.press("ArrowLeft")
  await expect(page.getByText(reviewsPage.counter(1, reviews.items.length))).toBeVisible()
  await page.getByRole("button", { name: reviewsPage.prev }).click()
  await expect(page.getByText(reviewsPage.counter(reviews.items.length, reviews.items.length))).toBeVisible()
})
