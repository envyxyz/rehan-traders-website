import { expect, test, type Locator, type Page } from "@playwright/test"

import { actions, jobCardContent, nav, services, site, ui } from "../../src/content"
import { routes } from "./routes"

// The nav renders twice (desktop bar and island, phone header); only the visible one counts per project.
const desktop = (page: Page) => page.locator("header").first() // the desktop bar and island; the phone header is the second
const phone = (page: Page) => page.locator("header").nth(1)
const links = nav.links.filter((l) => l.href !== "/repairs")
const repairs = nav.links.find((l) => l.href === "/repairs")!

// The Radix menu and the phone sheet are next/dynamic chunks that load after hydration. Until then the same-looking buttons
// are inert placeholders, and a click or Enter on one is lost. The loaded triggers carry aria-haspopup; wait for it.
const repairsLoaded = (trigger: Locator) => expect(trigger).toHaveAttribute("aria-haspopup", "menu")
const sheetLoaded = (opener: Locator) => expect(opener).toHaveAttribute("aria-haspopup", "dialog")

test("desktop: the top bar links go to their pages, and Repairs opens the eight repairs", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones use the menu sheet")
  await page.goto("/")
  const bar = desktop(page).locator(":scope > div nav")
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
  const trigger = desktop(page).locator(":scope > div nav").getByRole("button", { name: "Repairs" })
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

test("desktop: scrolling swaps the top bar for the island, and the hidden one leaves the tab order", async ({ page, isMobile }) => {
  test.skip(isMobile, "the island is the desktop pattern")
  await page.goto("/")
  const [bar, island] = [desktop(page).locator(":scope > div"), desktop(page).locator(":scope > nav")]
  await expect(island).toHaveAttribute("inert", "")
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2))
  await expect(bar).toHaveAttribute("inert", "")
  await expect(island).not.toHaveAttribute("inert", "")
  await island.getByRole("link", { name: "Reviews", exact: true }).click()
  await expect(page).toHaveURL("/reviews")
})

test("phone: the header is the lockup, a call button and a menu button, with no island", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  await page.goto("/")
  const header = phone(page)
  await expect(header.getByRole("link", { name: nav.home })).toBeVisible()
  await expect(header.getByRole("button", { name: nav.menu })).toBeVisible()
  await expect(header.getByRole("link", { name: nav.call })).toHaveAttribute("href", site.phone.href)
  await expect(header.getByRole("link")).toHaveCount(2)
  await expect(header.getByRole("link", { name: nav.home })).toContainText(`${jobCardContent.brandFirst}${jobCardContent.brandSecond}`)
  await expect(header.locator(".glass")).toHaveCount(0)
  // Transparent at the top of the page, solid paper with a hairline once scrolled.
  const background = () => header.evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(await background()).toBe("rgba(0, 0, 0, 0)")
  await page.evaluate(() => scrollTo({ top: 300, behavior: "instant" }))
  await expect.poll(background).not.toBe("rgba(0, 0, 0, 0)")
  expect(await header.evaluate((el) => getComputedStyle(el).borderBottomColor)).not.toBe("rgba(0, 0, 0, 0)")
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
  expect(full.names).toEqual(nav.links.map(() => "rise"))
  expect(full.delays).toEqual([...full.delays].sort((a, b) => a - b))
  expect(new Set(full.delays).size).toBe(nav.links.length)
  expect(full.slide).toBeGreaterThan(0)

  await page.keyboard.press("Escape")
  await expect(sheet).toBeHidden()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await opener.click()
  const calm = await motion(sheet)
  expect(calm.names).toEqual(nav.links.map(() => "none"))
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
  await (isMobile ? phone(page) : desktop(page)).getByRole("link", { name: nav.home }).first().click()
  await expect(page).toHaveURL("/")
})
