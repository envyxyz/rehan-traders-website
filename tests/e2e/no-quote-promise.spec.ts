import { expect, test } from "@playwright/test"

import { services } from "../../src/content-large"
import { chatSystem } from "../../src/lib/assistant"

// The shop does not promise a quote time ("5 minutes"). This keeps the line from coming back.
const promise = /\b(5|five)\s+minutes?\b/i
const paths = ["/", "/repairs", `/repairs/${services[0].slug}`, "/quote", "/book"]

for (const path of paths) {
  test(`${path} makes no "5 minutes" quote promise`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator("main")).toBeVisible()
    expect(await page.locator("body").innerText()).not.toMatch(promise)
  })
}

test("the chat prompt and llms.txt make no quote-time promise", async ({ request }) => {
  expect(chatSystem).not.toMatch(promise)
  const res = await request.get("/llms.txt")
  expect(res.ok()).toBe(true)
  expect(res.headers()["content-type"]).toContain("text/plain")
  expect(await res.text()).not.toMatch(promise)
})
