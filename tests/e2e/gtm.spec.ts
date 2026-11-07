import { expect, test, type Page } from "@playwright/test"

// components/gtm.tsx loads gtm.js at the first tap, key or scroll, or 6 s after the page has loaded. It only runs on the live
// host and for people, so the live host is served from the local build and the automation flag is hidden. No hit leaves the machine.

const live = "https://rehanmobiletraders.com"

async function open(page: Page, baseURL: string) {
  const loaded: string[] = []
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }))
  await page.route(`${live}/**`, async (route) => route.fulfill({ response: await route.fetch({ url: route.request().url().replace(live, baseURL) }) }))
  await page.route("https://www.googletagmanager.com/**", (route) => {
    loaded.push(route.request().url())
    return route.fulfill({ contentType: "text/javascript", body: "" })
  })
  await page.goto(`${live}/`)
  return loaded
}

test.describe("GTM", () => {
  test.afterEach(({ page }) => page.unrouteAll({ behavior: "ignoreErrors" })) // requests still on their way when the test ends
  const firstInput: Record<string, (page: Page) => Promise<unknown>> = {
    scroll: (page) => page.evaluate(() => scrollTo(0, 300)),
    key: (page) => page.keyboard.press("Tab"),
    tap: (page) => page.mouse.click(5, 5),
  }
  for (const [name, input] of Object.entries(firstInput)) {
    test(`waits for the first ${name}, with the page view already queued`, async ({ page, baseURL }) => {
      const loaded = await open(page, baseURL!)
      await page.waitForTimeout(1500)
      expect(loaded, "nothing before an input").toEqual([])
      expect(await page.evaluate(() => (window as unknown as { dataLayer: { event?: string }[] }).dataLayer.some((e) => e.event === "gtm.js"))).toBe(true)
      await input(page)
      await expect.poll(() => loaded.length, { timeout: 6000 }).toBe(1)
      expect(loaded[0]).toContain("gtm.js?id=GTM-")
    })
  }

  test("loads 6 s after the page has loaded when nobody touches it", async ({ page, baseURL }) => {
    test.setTimeout(30_000)
    const loaded = await open(page, baseURL!)
    await page.waitForTimeout(3000)
    expect(loaded).toEqual([])
    await expect.poll(() => loaded.length, { timeout: 9000 }).toBe(1)
  })
})
