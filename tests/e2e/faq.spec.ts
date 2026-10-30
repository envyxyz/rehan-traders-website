import { expect, test } from "@playwright/test"

import { faq, facts } from "../../src/content"

test("faq: the page and its FAQPage JSON-LD list the same questions, with the confirmed facts", async ({ page }) => {
  await page.goto("/faq")
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
  const faqPage = ld.map((t) => JSON.parse(t)).find((d) => d["@type"] === "FAQPage")
  expect(faqPage.mainEntity.map((q: { name: string }) => q.name)).toEqual(faq.map((f) => f.q))
  const answers = faqPage.mainEntity.map((q: { acceptedAnswer: { text: string } }) => q.acceptedAnswer.text).join("\n")
  for (const fact of [facts.check, facts.warranty, facts.battery, facts.seal, facts.delivery]) expect(answers).toContain(fact)
  // The page itself shows every question.
  for (const f of faq) await expect(page.getByRole("heading", { name: f.q })).toBeVisible()
})
