import { expect, test } from "@playwright/test"

// Google's favicon rules (developers.google.com/search/docs/appearance/favicon-in-search): a square icon in a multiple
// of 48px, linked from the home page with rel="icon", at a stable URL, crawlable by Googlebot and Googlebot-Image.
// Same links on every page, so whichever page Google crawls first finds them.

const pngSize = (b: Buffer) => [b.readUInt32BE(16), b.readUInt32BE(20)]

test.describe("favicon", () => {
  test.skip(({ isMobile }) => isMobile, "markup and files, one project is enough")

  for (const path of ["/", "/repairs/screen-replacement", "/guides/phone-fell-in-water"]) {
    test(`${path} links square PNG icons in multiples of 48px, an SVG, the apple icon and the manifest`, async ({ page, request }) => {
      await page.goto(path)
      const icons = await page.locator('head link[rel="icon"]').evaluateAll((ls) => ls.map((l) => ({ href: l.getAttribute("href")!, sizes: l.getAttribute("sizes"), type: l.getAttribute("type") })))
      const pngs = icons.filter((i) => i.type === "image/png")
      expect(pngs.map((i) => i.sizes)).toEqual(expect.arrayContaining(["48x48", "96x96", "192x192"]))
      expect(icons.some((i) => i.type === "image/svg+xml")).toBe(true)

      for (const icon of pngs) {
        expect(icon.href, "root path, no query string").toMatch(/^\/[\w-]+\.png$/)
        const res = await request.get(icon.href)
        expect(res.status(), icon.href).toBe(200)
        expect(res.headers()["content-type"]).toContain("image/png")
        const [w, h] = pngSize(await res.body())
        expect(`${w}x${h}`, icon.href).toBe(icon.sizes)
        expect(w % 48, `${icon.href} is a multiple of 48px`).toBe(0)
      }

      const apple = page.locator('head link[rel="apple-touch-icon"]')
      expect(await apple.getAttribute("href")).toBe("/apple-icon.png")
      expect(pngSize(await (await request.get("/apple-icon.png")).body())).toEqual([180, 180])

      const manifest = await page.locator('head link[rel="manifest"]').getAttribute("href")
      expect(manifest).toBeTruthy()
      const m = await (await request.get(manifest!)).json()
      for (const i of m.icons) expect((await request.get(i.src)).status(), i.src).toBe(200)
    })
  }

  test("/favicon.ico holds 16, 32 and 48px", async ({ request }) => {
    const res = await request.get("/favicon.ico")
    expect(res.status()).toBe(200)
    const b = await res.body()
    const sizes = Array.from({ length: b.readUInt16LE(4) }, (_, i) => b[6 + 16 * i] || 256)
    expect(sizes).toEqual(expect.arrayContaining([16, 32, 48]))
  })

  test("robots.txt does not block the icons", async ({ request }) => {
    const disallow = (await (await request.get("/robots.txt")).text())
      .split("\n")
      .filter((l) => /^disallow:/i.test(l))
      .map((l) => l.split(":")[1].trim())
      .filter(Boolean)
    for (const p of ["/favicon.ico", "/icon-48.png", "/icon-96.png", "/icon-192.png", "/icon-512.png", "/icon.svg", "/apple-icon.png", "/manifest.webmanifest"]) {
      expect(disallow.some((d) => p.startsWith(d)), p).toBe(false)
    }
  })
})
