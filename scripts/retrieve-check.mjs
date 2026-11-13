// Checks the chat's retrieval (src/lib/retrieve.ts) with no model and no key: each question must bring back its page,
// and questions the long pages do not cover must bring back nothing. Run after changing guides, repair pages or the scoring.
//
//   node scripts/retrieve-check.mjs [-v]
import { mkdtempSync } from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

// esbuild is wrangler's own dependency: bundle the TypeScript module once, then import it.
const require = createRequire(import.meta.url)
const { build } = createRequire(require.resolve("wrangler"))("esbuild")
const out = join(mkdtempSync(join(tmpdir(), "retrieve-")), "retrieve.mjs")
await build({ entryPoints: ["src/lib/retrieve.ts"], bundle: true, format: "esm", outfile: out, logLevel: "error" })
const { retrieve, related, passages, PAGE_SCORE } = await import(pathToFileURL(out).href)

// [question, the page its best passage must be on, or null for no passages at all]
const cases = [
  ["my phone fell in water what should I do", "/guides/phone-fell-in-water"],
  ["mobile pani mein gir gaya kya karun", "/guides/phone-fell-in-water"],
  ["should I put it in rice", "/guides/phone-fell-in-water"],
  ["فون پانی میں گر گیا", "/guides/phone-fell-in-water"],
  ["green line on my screen after update", "/guides/lines-on-phone-screen"],
  ["screen par line aa gayi hai", "/guides/lines-on-phone-screen"],
  ["phone charge nahi ho raha", "/guides/phone-not-charging"],
  ["moisture detected in charging port", "/guides/phone-not-charging"],
  ["battery jaldi khatam ho jati hai", "/guides/battery-draining-fast"],
  ["is a swollen battery dangerous", "/guides/battery-draining-fast"],
  ["mobile on nahi ho raha", "/guides/phone-not-turning-on"],
  ["how to force restart samsung", "/guides/phone-not-turning-on"],
  ["touch kaam nahi kar raha", "/guides/touch-not-working"],
  ["ghost touch by itself", "/guides/touch-not-working"],
  ["sirf glass toota hai display theek hai", "/guides/cracked-screen-glass-or-full-screen"],
  ["what time do you open", null],
  ["screen replacement price kitne ka hai", "/repairs/screen-replacement"],
  ["do you repair z fold 5 inner screen", "/repairs/galaxy-z-fold-flip"],
  ["where is the shop", null],
  ["write me a poem about cats", null],
  ["hello", null],
  ["what is the capital of France", null],
]
const verbose = process.argv.includes("-v")
let failed = 0
for (const [q, want] of cases) {
  const found = retrieve(q)
  const got = found[0]?.passage.href ?? null
  const ok = got === want
  if (!ok) failed++
  if (!ok || verbose) console.log(ok ? "ok  " : "FAIL", JSON.stringify(q), "->", got, found.map((r) => r.score.toFixed(1)).join(" "), ok ? "" : `(want ${want})`)
}
const withPage = cases.filter(([q]) => related(q)?.page).length
console.log(`${cases.length - failed}/${cases.length} passed, ${passages.length} passages, ${withPage} questions get a page link (score >= ${PAGE_SCORE})`)
process.exit(failed ? 1 : 0)
