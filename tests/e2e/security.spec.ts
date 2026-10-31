import { expect, test, type Page } from "@playwright/test"

import { visit, visitPage } from "../../src/content"
import { routes } from "./routes"

// The CSP is in public/_headers and served by wrangler dev as it is by Cloudflare. A violation shows up in the page
// as a securitypolicyviolation event and in the console. The Google Tag Manager script is a real network request
// from here, so a blocked load of it shows up too.
async function watch(page: Page) {
  const seen: string[] = []
  page.on("console", (m) => {
    // Any console error fails (CSP refusals, 404s, script errors). One exception: `upgrade-insecure-requests` makes Chrome
    // upgrade the redirect that Cloudflare's asset server answers a prefetch of /repairs/[slug] with ($ becomes %24) to
    // https://localhost, which has no TLS. On the https site the redirect stays https, so this only happens in this test.
    if (m.type() === "error" && !m.text().includes("ERR_SSL_PROTOCOL_ERROR")) seen.push(m.text())
  })
  page.on("pageerror", (e) => seen.push(String(e)))
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      ;(window as unknown as { __csp: string[] }).__csp = [...((window as unknown as { __csp?: string[] }).__csp ?? []), `${e.violatedDirective} ${e.blockedURI}`]
    })
  })
  return seen
}
const violations = (page: Page) => page.evaluate(() => (window as unknown as { __csp?: string[] }).__csp ?? [])

test("every page sends the security headers", async ({ request }) => {
  for (const path of routes) {
    const h = (await request.get(path)).headers()
    expect(h["x-content-type-options"], path).toBe("nosniff")
    expect(h["referrer-policy"], path).toBe("strict-origin-when-cross-origin")
    expect(h["cross-origin-opener-policy"], path).toBe("same-origin")
    expect(h["permissions-policy"], path).toContain("camera=()")
    const csp = h["content-security-policy"]
    for (const d of ["default-src 'self'", "base-uri 'self'", "form-action 'self'", "object-src 'none'", "frame-ancestors 'none'", "upgrade-insecure-requests"])
      expect(csp, path).toContain(d)
    expect(csp, path).not.toMatch(/'unsafe-eval'|\*(\s|;|$)/)
  }
})

for (const path of [...routes, "/no-such-page"]) {
  test(`no CSP violation or console error on ${path}`, async ({ page }) => {
    const seen = await watch(page)
    await page.goto(path)
    await expect(page.getByRole("main")).toBeVisible()
    await page.waitForTimeout(1500) // idle-time imports and the GTM tag load after hydration
    // The 404 page's own status is logged as a failed resource: expected there, an error anywhere else.
    const errors = seen.filter((m) => path !== "/no-such-page" || !m.includes("status of 404"))
    expect([...errors, ...(await violations(page))]).toEqual([])
  })
}

test("the map on /visit loads after a tap, under the CSP", async ({ page }) => {
  const seen = await watch(page)
  await page.goto("/visit")
  expect(await page.locator("iframe").count()).toBe(0) // nothing from Google until asked
  await page.getByRole("button", { name: visitPage.mapPrompt }).click()
  const frame = page.locator(`iframe[title="${visit.mapTitle}"]`)
  await expect(frame).toBeVisible()
  expect(await frame.getAttribute("src")).toBe(visit.mapEmbed)
  // Loaded, not blocked: Chrome shows an error page (chrome-error://) in the frame when frame-src or X-Frame-Options refuses it.
  await expect.poll(() => page.frames().find((f) => f.url().startsWith("https://www.google.com/maps/embed"))?.url() ?? "", { timeout: 20_000 }).toContain("google.com/maps/embed")
  await page.waitForTimeout(1500)
  expect([...seen, ...(await violations(page))]).toEqual([])
})

test("the Worker's /api answers carry nosniff and are never cached", async ({ request }) => {
  const answers = [
    await request.post("/api/book", { data: {} }),
    await request.post("/api/chat", { data: {} }),
    await request.post("/api/upload", { data: {} }),
    await request.get("/api/book"), // 405
    await request.get("/api/nope"), // 404
  ]
  expect(answers.map((a) => a.status())).toEqual([400, 400, 400, 405, 404])
  for (const a of answers) {
    expect(a.headers()["x-content-type-options"]).toBe("nosniff")
    expect(a.headers()["cache-control"]).toBe("no-store")
    expect(a.headers()["content-type"]).toContain("application/json")
  }
})
