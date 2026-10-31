// node shot.mjs <outdir> [width height scheme closed]
import { chromium } from "@playwright/test"
const [out = "design/fold-3d", w = "1440", h = "900", scheme = "light", closed = ""] = process.argv.slice(2)
const browser = await chromium.launch({ channel: "msedge", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] })
const page = await browser.newPage({ viewport: { width: +w, height: +h }, colorScheme: scheme, deviceScaleFactor: 1 })
const logs = []
page.on("console", (m) => logs.push(m.type() + ": " + m.text()))
page.on("pageerror", (e) => logs.push("pageerror: " + e.message))
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
await page.screenshot({ path: `${out}/poster-${w}-${scheme}.png` })
await page.keyboard.press("Shift")
await page.locator("canvas[data-ready]").waitFor({ timeout: 60000 })
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/open-${w}-${scheme}.png` })
if (closed) {
  await page.getByRole("button", { name: "Fold the phone" }).click()
  await page.waitForTimeout(3000)
  await page.screenshot({ path: `${out}/closed-${w}-${scheme}.png` })
}
console.log(logs.filter((l) => !l.includes("[HMR]") && !l.includes("Download the React")).join("\n"))
await browser.close()
