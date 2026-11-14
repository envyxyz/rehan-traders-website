// After `pnpm build`: a guide dated in the future must not be in out/, the sitemap or llms files.
// Reads slug and published date from src/content-large.ts. GUIDES_AS_OF overrides today, as in the build.
import { existsSync, readFileSync } from "node:fs"

const src = readFileSync("src/content-large.ts", "utf8")
const start = src.indexOf("const allGuides")
const groups = Object.fromEntries([...src.matchAll(/const (g\d+) = \{ published: "([\d-]+)"/g)].map((m) => [m[1], m[2]]))
const guides = [...src.slice(start).matchAll(/^    slug: "([^"]+)"[\s\S]*?(?:published: "([\d-]+)"|\.\.\.(g\d+))/gm)].map((m) => ({ slug: m[1], date: m[2] ?? groups[m[3]] }))
const today = process.env.GUIDES_AS_OF ?? new Date(Date.now() + 5 * 3600_000).toISOString().slice(0, 10)
const read = (f) => (existsSync(f) ? readFileSync(f, "utf8") : "")
const sitemap = read("out/sitemap.xml"), llms = read("out/llms.txt"), full = read("out/llms-full.txt"), index = read("out/guides/index.html")
const bad = []
for (const g of guides) {
  if (!g.date) { bad.push(`${g.slug}: no published date found`); continue }
  const live = g.date <= today
  const where = { page: existsSync(`out/guides/${g.slug}/index.html`), sitemap: sitemap.includes(`/guides/${g.slug}`), llms: llms.includes(`/guides/${g.slug}`), full: full.includes(`/guides/${g.slug}`), list: index.includes(`/guides/${g.slug}`) }
  for (const [k, v] of Object.entries(where)) if (v !== live) bad.push(`${g.slug} (${g.date}, today ${today}): ${k} is ${v ? "present" : "missing"}`)
}
if (bad.length || !guides.length) { console.error(bad.join("\n") || "no guides found"); process.exit(1) }
console.log(`schedule ok: ${guides.length} guides, ${guides.filter((g) => g.date <= today).length} live on ${today}`)
