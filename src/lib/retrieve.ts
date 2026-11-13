import { guides, services } from "../content-large"

// The chat's retrieval, used only by the Worker (worker/chat.ts). Kept out of assistant.ts, which the pages also load:
// building the index there would cost every visitor the guides' text and the work of indexing it.

/** One retrievable piece of the site's long pages: a guide section or a repair page section, with the page it is on. */
export type Passage = { href: string; page: string; title: string; text: string }

/** The guides and the repair pages' long sections, cut into passages. Too long for every prompt, so each question gets its best few. */
export const passages: Passage[] = [
  ...guides.flatMap((g) => {
    const at = { href: `/guides/${g.slug}`, page: g.title }
    return [
      { ...at, title: g.title, text: g.answer },
      ...g.sections.map((s) => ({ ...at, title: s.h, text: [s.answer, ...(s.list ?? []), ...(s.table?.rows.map((r) => r.join(": ")) ?? [])].join(" ") })),
      ...g.faq.map((f) => ({ ...at, title: f.q, text: f.a })),
    ]
  }),
  ...services.flatMap((s) => {
    const at = { href: `/repairs/${s.slug}`, page: s.title }
    return [
      { ...at, title: s.title, text: `${s.intro} ${s.answers.model} ${s.answers.time}` },
      ...s.detail.map((d) => ({ ...at, title: d.h, text: [...d.p, ...(d.list ?? [])].join(" ") })),
      ...s.faq.map((f) => ({ ...at, title: f.q, text: f.a })),
    ]
  }),
]

// Words that carry no topic, in English and Roman Urdu.
const STOP = new Set(
  "a an the is are was were be been it its this that these those i my me you your we our they to of in on at for with from by and or but if so as do does did can could will would should have has had no yes time timing timings hours open opening price cost rate kitne kitna what why how when where which who there here then than too very just also about into out up down over after before again more most some any each only own same phone phones mobile hai hain ho hota hoti tha thi ka ki ke ko se par pe mein main mera meri mere aap ap tum hum yeh ye woh wo kya kyun kyu kaise kese kab kahan kar karo karein karna raha rahi rahe gaya gayi gaye wala wali bhi to ab aur ya ek please sir bhai فون موبائل میں گیا گئی ہے ہیں ہو رہا رہی کیا کا کی کے کو سے پر میرا میری".split(" ")
)

// What people type, mapped to the words the pages use. Roman Urdu, Urdu script and common English variants.
const ALIAS: Record<string, string> = {
  pani: "water", paani: "water", wet: "water", bheeg: "water", bheg: "water", liquid: "water", "پانی": "water",
  gir: "fell", gira: "fell", giri: "fell", dropped: "fell", drop: "fell", "گر": "fell", "گرا": "fell",
  nahi: "not", nahin: "not", nai: "not", na: "not", "نہیں": "not", cant: "not", wont: "not", doesnt: "not", isnt: "not",
  kaam: "working", work: "working", works: "working", chal: "working", "کام": "working",
  toot: "cracked", toota: "cracked", tooti: "cracked", tuta: "cracked", tuti: "cracked", broken: "cracked", crack: "cracked", cracks: "cracked", "ٹوٹ": "cracked",
  sheesha: "glass", shisha: "glass", "شیشہ": "glass",
  screen: "screen", display: "screen", lcd: "screen", panel: "panel", "اسکرین": "screen", "سکرین": "screen",
  line: "lines", lines: "lines", lakeer: "lines", "لائن": "lines",
  charge: "charging", charging: "charging", charger: "charging", "چارج": "charging", "چارجنگ": "charging",
  battery: "battery", "بیٹری": "battery", drain: "draining", drains: "draining", jaldi: "fast", khatam: "draining",
  garam: "hot", heat: "hot", heating: "hot", swollen: "swollen", phool: "swollen", phooli: "swollen",
  band: "dead", off: "dead", dead: "dead", "بند": "dead", on: "turning", chalu: "turning", "آن": "turning",
  touch: "touch", "ٹچ": "touch", ghost: "ghost",
  data: "data", photos: "data", tasveer: "data", tasveerein: "data",
  board: "board", motherboard: "board", ic: "board",
  rice: "rice", chawal: "rice", dryer: "dryer",
}

/**
 * Lowercase topic words, with what people type mapped onto the pages' words, plus each pair of neighbours in either order:
 * "charge nahi" and "not charging" are both the pair charging+not, which is rare enough to find its page where the two
 * words alone are too common to.
 */
export function terms(text: string) {
  const words = (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).map((w) => ALIAS[w] ?? w).filter((w) => w.length > 1 && !STOP.has(w))
  const pairs = words.slice(1).flatMap((w, i) => (w === words[i] ? [] : [[words[i], w].sort().join("+")]))
  return [...words, ...pairs]
}

// BM25, worked out once: the index is small (a few hundred passages), so no vector store and no extra request.
const K1 = 1.4
const B = 0.6
const TITLE_WEIGHT = 2 // a passage's heading counts double
const GUIDE_BOOST = 1.25 // a guide says what to do; a repair page says what the shop does. The chat is asked the first more often
const index = passages.map((p) => {
  const tf = new Map<string, number>()
  for (const t of terms(p.title)) tf.set(t, (tf.get(t) ?? 0) + TITLE_WEIGHT)
  for (const t of terms(p.text)) tf.set(t, (tf.get(t) ?? 0) + 1)
  return { tf, length: [...tf.values()].reduce((a, n) => a + n, 0) }
})
const mean = index.reduce((a, d) => a + d.length, 0) / index.length
const idf = new Map<string, number>()
for (const d of index) for (const t of d.tf.keys()) idf.set(t, (idf.get(t) ?? 0) + 1)
for (const [t, n] of idf) idf.set(t, Math.log(1 + (index.length - n + 0.5) / (n + 0.5)))

/** Below this the best passage is a chance match (one common word), and the question gets no passages. Set from scripts/retrieve-check.mjs. */
export const MIN_SCORE = 8
/** The page link under a reply needs a surer match than the passages do. */
export const PAGE_SCORE = 12

/** The best passages for a question, best first, at most `k` and at most two from one page. Empty when nothing on the site is about it. */
export function retrieve(query: string, k = 3) {
  const q = [...new Set(terms(query))]
  const scored = index
    .map((d, i) => {
      let score = 0
      for (const t of q) {
        const f = d.tf.get(t)
        if (f) score += (idf.get(t)! * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / mean))
      }
      return { passage: passages[i], score: passages[i].href.startsWith("/guides/") ? score * GUIDE_BOOST : score }
    })
    .filter((r) => r.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
  const perPage = new Map<string, number>()
  return scored
    .filter((r) => {
      const n = perPage.get(r.passage.href) ?? 0
      perPage.set(r.passage.href, n + 1)
      return n < 2
    })
    .slice(0, k)
}

/** The passages as a system block for one question, or null. Goes after the cached block, so the cache still hits. */
export function related(query: string) {
  const found = retrieve(query)
  if (!found.length) return null
  return {
    text: `RELATED PAGES (parts of this website that match the customer's question; treat them as part of KNOWLEDGE)\n${found.map((r) => `## ${r.passage.title} (${r.passage.page})\n${r.passage.text}`).join("\n\n")}`,
    /** The page to offer under the reply, when the match is sure. */
    page: found[0].score >= PAGE_SCORE ? found[0].passage : null,
  }
}
