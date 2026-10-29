import catalog from "@/data/devices.json"

// Every model as people say it: "Samsung Galaxy A54", "Redmi Note 13" (no "Redmi Redmi"), "iPhone 15" (no "Apple").
// From scripts/devices.mjs.
export const models = catalog.flatMap((b) => b.models.map((m) => (b.brand === "Apple" || m.toLowerCase().startsWith(b.brand.toLowerCase()) ? m : `${b.brand} ${m}`)))

/** Models holding every typed word ("s24 ultra", "iphone 13"), closest first: name starts with the query, then shortest. */
export function findModels(query: string) {
  const q = query.trim().toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const score = (m: string) => (m.toLowerCase().startsWith(q) || m.toLowerCase().includes(` ${q}`) ? 0 : 1)
  // ponytail: linear scan of ~4k names per keystroke is well under a millisecond; index it if the list grows 10x.
  return models
    .filter((m) => words.every((w) => m.toLowerCase().includes(w)))
    .sort((a, b) => score(a) - score(b) || a.length - b.length || a.localeCompare(b, "en", { numeric: true }))
    .slice(0, 40)
}
