import { expect, test, type Locator, type Page } from "@playwright/test"

import { actions, jobCardContent, nav, site, ui } from "../../src/content"
import { services } from "../../src/content-large"
import { routes } from "./routes"

// The nav renders twice (desktop, phone); only the visible one counts per project.
const desktop = (page: Page) => page.locator("header").first() // the desktop bar that morphs into the island; the phone header is the second
const phone = (page: Page) => page.locator("header").nth(1)
const links = nav.links.filter((l) => !["/repairs", "/guides"].includes(l.href))
const repairs = nav.links.find((l) => l.href === "/repairs")!

// The Radix menu and the phone sheet are next/dynamic chunks that load after hydration. Until then the same-looking buttons
// are inert placeholders, and a click or Enter on one is lost. The loaded triggers carry aria-haspopup; wait for it.
const repairsLoaded = async (trigger: Locator) => {
  // The menus load on the first interaction, and one before hydration goes unheard, so keep moving until it is.
  let x = 5
  await expect(async () => {
    await trigger.page().mouse.move(x++, 5)
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu", { timeout: 500 })
  }).toPass()
}
// Hydrated: the scroll listeners are on. The sheet's code follows the first tap, and the tap waits for it.
const sheetLoaded = (opener: Locator) => expect.poll(() => opener.evaluate((el) => Object.keys(el).some((k) => k.startsWith("__reactProps")))).toBe(true)

test("desktop: the top bar links go to their pages, and Repairs opens the eight repairs", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones use the menu sheet")
  await page.goto("/")
  const bar = desktop(page).locator("nav")
  await expect(bar.getByRole("link", { name: nav.call })).toHaveAttribute("href", site.phone.href)
  await repairsLoaded(bar.getByRole("button", { name: "Repairs" }))
  await bar.getByRole("button", { name: "Repairs" }).click()
  const menu = page.getByRole("menu")
  await expect(menu.getByRole("menuitem")).toHaveCount(services.length + 1)
  await page.keyboard.press("Escape")
  await expect(menu).toBeHidden()

  for (const link of links) {
    await page.goto("/")
    await bar.getByRole("link", { name: link.label, exact: true }).click()
    await expect(page).toHaveURL(link.href)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  }
})

test("desktop: a repair in the Repairs menu opens its page, by keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones use the menu sheet")
  await page.goto("/")
  const trigger = desktop(page).locator("nav").getByRole("button", { name: "Repairs" })
  await repairsLoaded(trigger)
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("menu")).toBeVisible()
  // Radix moves focus a tick after each key, so a key pressed straight after another acts on the old item: wait for the focus each time.
  await expect(page.getByRole("menuitem").first()).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("menuitem").nth(1)).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(`/repairs/${services[1].slug}`)
})

test("desktop: scrolled, the bar becomes the centred island and stays on screen; at the top it is the bar again", async ({ page, isMobile }) => {
  test.skip(isMobile, "the island is the desktop pattern")
  await page.goto("/")
  const bar = desktop(page).locator("nav")
  const box = () => desktop(page).locator(".glass").evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect)
  await repairsLoaded(bar.getByRole("button", { name: "Repairs" })) // hydrated: the scroll listener is on
  const width = await page.evaluate(() => document.documentElement.clientWidth) // the nav spans the page, not the scrollbar
  expect((await box()).right).toBeGreaterThan(width - 80)

  await page.evaluate(() => scrollTo({ top: 1500, behavior: "instant" }))
  await expect.poll(async () => Math.abs((await box()).left + (await box()).width / 2 - width / 2)).toBeLessThan(2) // settled, centred
  const island = await box()
  expect(island.width).toBeLessThan(700)
  expect(island.top).toBeGreaterThanOrEqual(0)
  // The mark sits inside the island, drawn over its glass.
  const mark = await desktop(page).getByRole("link", { name: site.name }).locator("svg").evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect)
  expect(mark.left).toBeGreaterThan(island.left)
  const onTop = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest("svg"), [mark.left + mark.width / 2, mark.top + mark.height / 2])
  expect(onTop).toBe(true)
  await bar.getByRole("link", { name: "Reviews", exact: true }).click()
  await expect(page).toHaveURL("/reviews")

  await page.goto("/")
  await repairsLoaded(bar.getByRole("button", { name: "Repairs" }))
  await page.evaluate(() => scrollTo({ top: 1500, behavior: "instant" }))
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
  await expect.poll(async () => (await box()).right).toBeGreaterThan(width - 80)
})

test("desktop: spam scrolling leaves one nav that settles; reduced motion swaps with no in-between", async ({ page, isMobile }) => {
  test.skip(isMobile, "the island is the desktop pattern")
  await page.goto("/")
  const header = desktop(page)
  await repairsLoaded(header.getByRole("button", { name: "Repairs" }))
  const width = () => header.locator(".glass").evaluate((el) => Math.round(el.getBoundingClientRect().width))
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(60)
    await page.mouse.wheel(0, -300)
    await page.waitForTimeout(60)
  }
  await expect(header.locator("nav")).toHaveCount(1)
  // Settled: two reads a moment apart agree.
  await expect
    .poll(async () => {
      const before = await width()
      await page.waitForTimeout(100)
      return (await width()) - before
    })
    .toBe(0)

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
  await page.waitForTimeout(100)
  const bar = await width()
  await page.evaluate(() => scrollTo({ top: 1500, behavior: "instant" }))
  await expect.poll(width).toBeLessThan(bar)
  const island = await width() // the first width seen after the swap is already the last
  await page.waitForTimeout(300)
  expect(await width()).toBe(island)
})

test("phone: the header is the lockup, a call button and a menu button, with no island", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  await page.goto("/")
  const header = phone(page)
  await expect(header.getByRole("link", { name: site.name })).toBeVisible()
  await expect(header.getByRole("button", { name: nav.menu })).toBeVisible()
  await expect(header.getByRole("link", { name: nav.call })).toHaveAttribute("href", site.phone.href)
  await expect(header.getByRole("link")).toHaveCount(2)
  await expect(header.getByRole("link", { name: site.name })).toContainText(`${jobCardContent.brandFirst}${jobCardContent.brandSecond}`)
  await expect(header.locator(".glass")).toHaveCount(0)
  // Transparent at the top of the page, solid paper with a hairline once scrolled.
  await sheetLoaded(header.getByRole("button", { name: nav.menu })) // hydrated: the scroll listener is on
  const solid = header.locator(":scope > span")
  const opacity = () => solid.evaluate((el) => getComputedStyle(el).opacity)
  expect(await opacity()).toBe("0")
  await page.evaluate(() => scrollTo({ top: 300, behavior: "instant" }))
  await expect.poll(opacity).toBe("1")
  expect(await solid.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)")
  expect(await solid.evaluate((el) => getComputedStyle(el).borderBottomColor)).not.toBe("rgba(0, 0, 0, 0)")
})

test("phone: the header slides away on scroll down, returns on scroll up, and shows while it holds focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  await page.goto("/")
  const header = phone(page)
  const bottom = () => header.evaluate((el) => el.getBoundingClientRect().bottom)
  await sheetLoaded(header.getByRole("button", { name: nav.menu })) // hydrated: the scroll listener is on
  await expect.poll(bottom).toBeGreaterThan(0)
  await page.evaluate(() => scrollTo({ top: 900, behavior: "instant" }))
  await expect.poll(bottom).toBeLessThanOrEqual(0)
  await page.evaluate(() => scrollTo({ top: 700, behavior: "instant" }))
  await expect.poll(bottom).toBeGreaterThan(0)
  await page.evaluate(() => scrollTo({ top: 1200, behavior: "instant" }))
  await expect.poll(bottom).toBeLessThanOrEqual(0)
  await header.getByRole("button", { name: nav.menu }).focus()
  await expect.poll(bottom).toBeGreaterThan(0)
  await page.evaluate(() => (document.activeElement as HTMLElement).blur())

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.evaluate(() => scrollTo({ top: 1800, behavior: "instant" }))
  await expect.poll(bottom).toBeGreaterThan(0) // reduced motion: it stays put
})

test("phone: the menu sheet opens, lists every page, closes on Escape and gives focus back", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  await page.goto("/")
  const opener = page.getByRole("button", { name: nav.menu })
  await sheetLoaded(opener)
  await opener.click()
  const sheet = page.getByRole("dialog", { name: nav.menu })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByRole("button", { name: repairs.label, exact: true })).toBeVisible()
  for (const link of links) await expect(sheet.getByRole("link", { name: link.label, exact: true })).toHaveAttribute("href", link.href)
  await expect(sheet.getByRole("link", { name: actions.book })).toHaveCount(0)
  await expect(sheet.getByText(site.address.short)).toBeVisible()
  await expect(sheet.getByText(site.hours.short)).toBeVisible()
  // Call and WhatsApp sit side by side under the address and hours.
  const call = sheet.getByRole("link", { name: nav.call })
  const whatsapp = sheet.getByRole("link", { name: actions.whatsappLabel })
  await expect(call).toHaveAttribute("href", site.phone.href)
  await expect(call).toHaveText(actions.call)
  await expect(whatsapp).toHaveAttribute("href", site.whatsapp.href)
  await expect(whatsapp).toHaveAttribute("target", "_blank")
  await expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer")
  const [callBox, whatsappBox] = await Promise.all([call.boundingBox(), whatsapp.boundingBox()])
  expect(callBox!.y).toBeCloseTo(whatsappBox!.y, 0)
  // The header strip (title and X) has a hairline below it.
  const strip = sheet.getByRole("heading", { name: nav.menu }).locator("xpath=..")
  expect(await strip.evaluate((el) => getComputedStyle(el).borderBottomWidth)).toBe("1px")

  // Focus stays inside the sheet while it is open.
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab")
  expect(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]"))).toBe(true)

  await page.keyboard.press("Escape")
  await expect(sheet).toBeHidden()
  await expect(opener).toBeFocused()
})

test("phone: Repairs opens the list (All repairs, then the eight repairs); Back returns with focus on Repairs", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  await page.goto("/")
  const opener = page.getByRole("button", { name: nav.menu })
  await sheetLoaded(opener)
  await opener.click()
  const sheet = page.getByRole("dialog", { name: nav.menu })
  const repairsButton = sheet.getByRole("button", { name: repairs.label, exact: true })
  const back = sheet.getByRole("button", { name: nav.back })
  const list = sheet.getByRole("list")
  const panel = back.locator("xpath=../..") // the sliding panel (Back sits in its header strip); it is inert while the main list shows
  await expect(panel).toHaveAttribute("inert", "")

  await repairsButton.click()
  await expect(back).toBeFocused()
  await expect(panel).not.toHaveAttribute("inert", "")
  await expect(sheet.locator("nav")).toHaveAttribute("inert", "")
  const items = list.getByRole("link")
  await expect(items).toHaveText([actions.allRepairs, ...services.map((s) => s.title)])
  await expect(items.first()).toHaveAttribute("href", repairs.href)
  // All repairs looks like the entries below it, and the X still closes from this panel.
  expect(await items.first().evaluate((el) => getComputedStyle(el).fontWeight)).toBe(await items.nth(1).evaluate((el) => getComputedStyle(el).fontWeight))
  await expect(sheet.getByRole("button", { name: ui.close })).toBeVisible()
  for (const [i, s] of services.entries()) await expect(items.nth(i + 1)).toHaveAttribute("href", `/repairs/${s.slug}`)

  await back.click()
  await expect(repairsButton).toBeFocused()
  await expect(panel).toHaveAttribute("inert", "")

  // The sheet always opens on the main list.
  await repairsButton.click()
  await page.keyboard.press("Escape")
  await expect(sheet).toBeHidden()
  await opener.click()
  await expect(panel).toHaveAttribute("inert", "")

  // A repair link goes to its page and closes the sheet.
  await repairsButton.click()
  await list.getByRole("link", { name: services[1].title, exact: true }).click()
  await expect(page).toHaveURL(`/repairs/${services[1].slug}`)
  await expect(sheet).toBeHidden()
})

test("phone: the menu items fade in one after another, and reduced motion drops the slide and the fade", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  const motion = (sheet: Locator) =>
    sheet.evaluate((el) => {
      const rows = [...el.querySelectorAll("nav > *")].map((row) => getComputedStyle(row))
      return {
        names: rows.map((row) => row.animationName),
        delays: rows.map((row) => parseFloat(row.animationDelay)),
        slide: parseFloat(getComputedStyle(el.querySelector("[inert]")!).transitionDuration),
      }
    })
  await page.goto("/")
  const opener = page.getByRole("button", { name: nav.menu })
  await sheetLoaded(opener)
  await opener.click()
  const sheet = page.getByRole("dialog", { name: nav.menu })
  const full = await motion(sheet)
  const rows = nav.links.length + 2 // Home, the links, Courier
  expect(full.names).toEqual(Array(rows).fill("rise"))
  expect(full.delays).toEqual([...full.delays].sort((a, b) => a - b))
  expect(new Set(full.delays).size).toBe(rows)
  expect(full.slide).toBeGreaterThan(0)

  await page.keyboard.press("Escape")
  await expect(sheet).toBeHidden()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await opener.click()
  const calm = await motion(sheet)
  expect(calm.names).toEqual(Array(rows).fill("none"))
  expect(calm.slide).toBeLessThan(0.001) // the global reduced-motion rule sets 0.00001s
})

test("phone: a menu link navigates and closes the sheet", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  for (const link of links) {
    await page.goto("/")
    await sheetLoaded(page.getByRole("button", { name: nav.menu }))
    await page.getByRole("button", { name: nav.menu }).click()
    await page.getByRole("dialog", { name: nav.menu }).getByRole("link", { name: link.label, exact: true }).click()
    await expect(page).toHaveURL(link.href)
    await expect(page.getByRole("dialog", { name: nav.menu })).toBeHidden()
  }
})

test("there is no sticky bar: no page floats a Book or WhatsApp bar over its content", async ({ page }) => {
  test.slow() // every route, and the dev server compiles each on its first visit
  for (const path of routes) {
    await page.goto(path)
    await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: "instant" }))
    // Links inside a fixed container other than the header would be a bar (the Book a visit and WhatsApp pill used to be one).
    const floating = await page.evaluate(() =>
      [...document.querySelectorAll("a")]
        .filter((a) => !a.closest("header"))
        .filter((a) => {
          for (let el: Element | null = a; el; el = el.parentElement) if (getComputedStyle(el).position === "fixed") return true
          return false
        })
        .map((a) => a.textContent?.trim())
    )
    expect(floating, path).toEqual([])
  }
})

test("the logo link goes home from any page", async ({ page, isMobile }) => {
  await page.goto("/faq")
  await (isMobile ? phone(page) : desktop(page)).getByRole("link", { name: site.name }).first().click()
  await expect(page).toHaveURL("/")
})

test("phone: a menu tap before the page is live still opens the menu", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  await page.route("**/_next/static/chunks/**", async (route) => {
    await new Promise((r) => setTimeout(r, 1500))
    await route.continue()
  })
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await page.getByRole("button", { name: nav.menu }).click()
  await expect(page.getByRole("dialog", { name: nav.menu })).toBeVisible()
})

test("the menu code is not part of the page load: it waits for the first interaction", async ({ page }) => {
  const files: string[] = []
  page.on("response", (r) => r.url().includes("/_next/static/chunks/") && files.push(r.url()))
  await page.goto("/", { waitUntil: "networkidle" })
  const before = files.length
  await page.mouse.move(40, 40)
  await expect.poll(() => files.length).toBeGreaterThan(before)
})
