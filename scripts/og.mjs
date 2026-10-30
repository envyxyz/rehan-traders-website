// Renders the link-preview images with the installed Edge (same approach as scripts/palette.mjs):
//   src/app/opengraph-image.png  1200x630  (also copied to twitter-image.png)
//   src/app/apple-icon.png       180x180
// Needs network once, for the Google Sans Flex latin subset (inlined so the render is self-contained).
// Run:  node scripts/og.mjs     Text mirrors site.name, the brand descriptor and site.address.short in src/content.ts.
import { copyFile, readFile, stat, writeFile } from "node:fs/promises"
import { chromium } from "@playwright/test"

const root = new URL("../src/app/", import.meta.url)
const paper = "#F5F5F2"
const ink = "#0E0E0E"
const steel = "#5C5C58"

// The mark from src/app/icon.svg: strip its dark-mode <style> and the .p / .a hooks, keep the light colours.
const svg = (await readFile(new URL("icon.svg", root), "utf8"))
  .replace(/<title>.*?<\/title>/, "")
  .replace(/<style>[\s\S]*?<\/style>/, "")
  .replace(/ class="[^"]*"/g, "")
  .replace("<svg ", '<svg width="100%" height="100%" ')

const css = await (
  await fetch("https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,400..800&display=swap", {
    headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36" },
  })
).text()
const latin = css.match(/\/\* latin \*\/\s*(@font-face\s*{[^}]*})/)?.[1]
if (!latin) throw new Error("Latin Google Sans Flex face not found")
const woff = Buffer.from(await (await fetch(latin.match(/url\(([^)]+)\)/)[1])).arrayBuffer())
const face = latin.replace(/url\([^)]+\)/, `url(data:font/woff2;base64,${woff.toString("base64")})`)

const page = (w, h, body, extra = "") => `<!doctype html><meta charset="utf-8"><style>
${face}
html,body{margin:0;width:${w}px;height:${h}px;background:${paper};color:${ink};font-family:"Google Sans Flex",Arial,sans-serif;font-optical-sizing:auto}
${extra}
</style>${body}`

const og = page(
  1200,
  630,
  `<div class="mark">${svg}</div>
   <div class="text">
     <div class="name">Rehan Traders</div>
     <div class="desc">Mobile &amp; Tab Repair Lab</div>
   </div>
   <div class="where">Shop G-88, Hafeez Center, Lahore</div>`,
  `.mark{position:absolute;left:69px;top:40px;width:176px;height:176px}
   .text{position:absolute;left:96px;top:262px}
   .name{font-size:132px;font-weight:800;letter-spacing:-0.035em;line-height:1}
   .desc{margin-top:20px;font-size:52px;font-weight:500;letter-spacing:-0.01em;line-height:1.1}
   .where{position:absolute;left:96px;bottom:64px;font-size:36px;font-weight:500;color:${steel}}`
)
const apple = page(180, 180, `<div class="mark">${svg}</div>`, `.mark{position:absolute;inset:34px}`)

const browser = await chromium.launch({ channel: "msedge" })
const shot = async (html, w, h, file) => {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  await p.setContent(html)
  await p.evaluate(() => document.fonts.ready)
  await writeFile(new URL(file, root), await p.screenshot({ type: "png" }))
  await p.close()
}
await shot(og, 1200, 630, "opengraph-image.png")
await shot(apple, 180, 180, "apple-icon.png")
await browser.close()
await copyFile(new URL("opengraph-image.png", root), new URL("twitter-image.png", root))
const kb = (await stat(new URL("opengraph-image.png", root))).size / 1024
console.log(`opengraph-image.png and twitter-image.png written (${kb.toFixed(0)} KB), apple-icon.png written`)
if (kb > 300) throw new Error("OG image is over 300 KB; WhatsApp drops it")
