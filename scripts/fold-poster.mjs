// The hero fold's poster: the 3D scene's first frame, shown until three.js loads (src/components/fold-3d.tsx).
// Run with the dev server up (`pnpm dev`), from the website root, after any change to the scene or the job card:
//   node scripts/fold-poster.mjs
// Writes public/art/fold-poster-<w>.avif|webp. The widths match POSTER in fold-3d.tsx; 1152 is the 576px stage at 2x.
import { chromium } from "@playwright/test"
import sharp from "sharp"

const WIDTHS = [480, 800, 1152]
const url = process.env.FOLD_URL ?? "http://localhost:3000/"

// SwiftShader gives headless Edge WebGL without a GPU.
const browser = await chromium.launch({ channel: "msedge", args: ["--enable-unsafe-swiftshader"] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: "light" })
await page.goto(url, { waitUntil: "networkidle" })
await page.keyboard.press("Shift") // any interaction loads the scene; a key keeps the pointer (and so the tilt) at rest
const canvas = page.locator("canvas[data-ready]")
await canvas.waitFor({ timeout: 60_000 })
await page.waitForTimeout(1000) // the canvas fade-in
// Only the canvas, on a transparent page.
await page.addStyleTag({
  content: "html, body, body * { background: transparent !important; } body * { visibility: hidden !important; } canvas { visibility: visible !important; }",
})
const png = await canvas.screenshot({ omitBackground: true })
await browser.close()

const { width } = await sharp(png).metadata()
for (const w of WIDTHS) {
  const img = () => sharp(png).resize({ width: Math.min(w, width) })
  await img().avif({ quality: 55, effort: 6 }).toFile(`public/art/fold-poster-${w}.avif`)
  await img().webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(`public/art/fold-poster-${w}.webp`)
}
console.log(`fold poster: ${width}px source, ${WIDTHS.join(", ")}w written to public/art/`)
