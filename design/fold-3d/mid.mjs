// node design/fold-3d/mid.mjs: tilt and mid-fold frames
import { chromium } from "@playwright/test"
const browser = await chromium.launch({ channel: "msedge", args: ["--enable-unsafe-swiftshader"] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
const btn = page.getByRole("button", { name: "Fold the phone" })
const box = await btn.boundingBox()
await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.15)
await page.locator("canvas[data-ready]").waitFor({ timeout: 60000 })
await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.1, { steps: 5 })
await page.waitForTimeout(1200)
await btn.screenshot({ path: "design/fold-3d/tilt.png" })
await page.mouse.move(10, 10)
await page.waitForTimeout(900)
await btn.click({ position: { x: 5, y: 5 } })
await page.mouse.move(10, 10)
for (const t of [450, 650, 850, 1100]) {
  await page.waitForTimeout(t === 450 ? 450 : 200)
  await page.locator(".fold-stage").screenshot({ path: `design/fold-3d/mid-${t}.png` })
}
await browser.close()
