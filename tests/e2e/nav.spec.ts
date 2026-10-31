import { expect, test, type Locator, type Page } from "@playwright/test"

import { actions, nav, services, site } from "../../src/content"

// The nav renders twice (desktop bar and island, phone header); only the visible one counts per project.
const desktop = (page: Page) => page.locator("header").first() // the desktop bar and island; the phone header is the second
const phone = (page: Page) => page.locator("header").nth(1)
const stickyBar = (page: Page) => page.locator("div.glass.fixed", { has: page.getByRole("link", { name: actions.book }) })
const links = nav.links.filter((l) => l.href !== "/repairs")

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
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(`/repairs/${services[0].slug}`)
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

test("phone: the menu sheet opens, lists every page, closes on Escape and gives focus back", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses the top bar")
  await page.goto("/")
  const opener = page.getByRole("button", { name: nav.menu })
  await sheetLoaded(opener)
  await opener.click()
  const sheet = page.getByRole("dialog", { name: nav.menu })
  await expect(sheet).toBeVisible()
  for (const link of nav.links) await expect(sheet.getByRole("link", { name: link.label, exact: true })).toBeVisible()
  for (const s of services) await expect(sheet.getByRole("link", { name: s.title, exact: true })).toHaveAttribute("href", `/repairs/${s.slug}`)
  await expect(sheet.getByRole("link", { name: actions.book })).toHaveAttribute("href", "/book")
  await expect(sheet.getByRole("link", { name: actions.whatsappLabel })).toHaveAttribute("href", site.whatsapp.href)

  // Focus stays inside the sheet while it is open.
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab")
  expect(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]"))).toBe(true)

  await page.keyboard.press("Escape")
  await expect(sheet).toBeHidden()
  await expect(opener).toBeFocused()
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

test("phone: the sticky bar appears after the hero, is out of the tab order until then, and Book opens the sheet", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the sticky bar is for phones")
  await page.goto("/")
  const bar = stickyBar(page)
  await expect(bar).toHaveAttribute("inert", "")
  await page.evaluate(() => scrollTo(0, innerHeight * 1.2))
  await expect(bar).not.toHaveAttribute("inert", "")
  await expect(bar.getByRole("link", { name: actions.whatsappLabel })).toHaveAttribute("href", site.whatsapp.href)
  await bar.getByRole("link", { name: actions.book }).click()
  await expect(page.getByRole("dialog").getByLabel("Device")).toBeVisible()
  await page.evaluate(() => scrollTo(0, 0))
})

test("desktop: the sticky bar never shows", async ({ page, isMobile }) => {
  test.skip(isMobile, "checks the desktop width")
  await page.goto("/")
  await page.evaluate(() => scrollTo(0, innerHeight * 1.5))
  await expect(stickyBar(page)).toBeHidden()
})

test("the logo link goes home from any page", async ({ page, isMobile }) => {
  await page.goto("/faq")
  await (isMobile ? phone(page) : desktop(page)).getByRole("link", { name: nav.home }).first().click()
  await expect(page).toHaveURL("/")
})
