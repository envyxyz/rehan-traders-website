import { expect, test, type Locator, type Page } from "@playwright/test"

import { jobCardContent } from "../../src/content"

const cardOn = (page: Page) => page.getByLabel(jobCardContent.qrAria).locator("xpath=ancestor::div[contains(@style,'preserve-3d')]")
const seal = (page: Page) => page.getByRole("img", { name: jobCardContent.sealAlt })

const tiltOf = async (card: Locator) => {
  const t = await card.evaluate((el) => (el as HTMLElement).style.transform)
  const [, rx = "0", ry = "0"] = /rotateX\((-?[\d.e-]+)deg\) rotateY\((-?[\d.e-]+)deg\)/.exec(t) ?? []
  return { rx: Number(rx), ry: Number(ry) }
}

test.describe("job card", () => {
  test("the tamper seal is on /about and not on the home page", async ({ page }) => {
    await page.goto("/")
    await expect(cardOn(page)).toHaveCount(1)
    await expect(seal(page)).toHaveCount(0)
    await page.goto("/about")
    await expect(cardOn(page)).toHaveCount(1)
    await expect(seal(page)).toHaveCount(1)
  })

  test.describe("on a phone", () => {
    test.skip(({ isMobile }) => !isMobile, "gyroscope")

    for (const path of ["/", "/about"]) {
      test(`the gyroscope tilts the card on ${path}, only while it is on screen`, async ({ page }) => {
        await page.goto(path)
        const card = cardOn(page)
        await card.scrollIntoViewIfNeeded()
        // The first event sets the resting angle; the next ones tip the phone right and its top towards you.
        const tip = () =>
          page.evaluate(() => {
            for (const [beta, gamma] of [[60, 0], [75, 15], [75, 15]]) {
              window.dispatchEvent(new DeviceOrientationEvent("deviceorientation", { beta, gamma }))
            }
          })
        // The listener is added after hydration, so keep tipping until it answers.
        await expect.poll(async () => { await tip(); return (await tiltOf(card)).ry }).toBeGreaterThan(1)
        const { rx, ry } = await tiltOf(card)
        expect(rx).toBeLessThan(-1)
        expect(Math.max(Math.abs(rx), Math.abs(ry))).toBeLessThanOrEqual(6)

        // Off screen the card is level again and the sensor is let go.
        await page.evaluate(() => scrollTo(0, 0))
        await expect.poll(async () => (await tiltOf(card)).ry).toBe(0)
        await tip()
        expect(await tiltOf(card)).toEqual({ rx: 0, ry: 0 })
      })
    }
  })
})
