// Guide infographics as PNG files, for Google Images, the Article schema and the share image: a screenshot of each guide's
// figure (the drawing and its key, without the 3D button) from the running preview, light theme, 2x.
//
//   pnpm preview   (or: pnpm build, then wrangler dev --port 8787)
//   node scripts/figures.mjs [base]
//
// Writes public/guides/figures/<slug>.png. Run again after changing a drawing or its key, then rebuild.
import { mkdirSync, readdirSync } from "node:fs"
import { chromium } from "@playwright/test"

const base = process.argv[2] ?? "http://localhost:8787"
const dir = "public/guides/figures"
mkdirSync(dir, { recursive: true })
const slugs = readdirSync("src/components/figures").map((f) => f.replace(/\.tsx$/, "")).filter((f) => !["index", "marker"].includes(f))
const browser = await chromium.launch({ channel: "msedge" })
const page = await (await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2, colorScheme: "light" })).newPage()
for (const slug of slugs) {
  await page.goto(`${base}/guides/${slug}`)
  await page.addStyleTag({ content: "[data-no-shot]{display:none!important}" })
  await document_fonts(page)
  await page.locator("[data-figure]").screenshot({ path: `${dir}/${slug}.png` })
  console.log(`${dir}/${slug}.png`)
}
await browser.close()

function document_fonts(p) {
  return p.evaluate(() => document.fonts.ready.then(() => undefined))
}
