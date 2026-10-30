import catalog from "@/data/devices.json"

// Every model as people say it: "Samsung Galaxy A54", "Redmi Note 13" (no "Redmi Redmi"), "iPhone 15" (no "Apple").
// From scripts/devices.mjs.
export const deviceName = (brand: string, model: string) =>
  brand === "Apple" || model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`.trim()

export const brands = catalog.map((b) => b.brand)

// ponytail: tablets by name ("iPad", "Galaxy Tab", "Redmi Pad", "MegaPad"); the catalog has no device type.
export const isTablet = (m: string) => /pad|tab/i.test(m)
export const tabletBrands = catalog.filter((b) => b.models.some(isTablet)).map((b) => b.brand)

/** A brand's models by display name; [] for a brand typed in that is not in the list. */
export const modelsOf = (brand: string) =>
  catalog.find((b) => b.brand.toLowerCase() === brand.trim().toLowerCase())?.models.map((m) => deviceName(brand, m)) ?? []

/** The listed brand a device name belongs to, so a device picked earlier fills both dropdowns. */
export const brandOf = (device: string) => catalog.find((b) => b.models.some((m) => deviceName(b.brand, m) === device))?.brand

/** Items holding every typed word ("s24 ultra", "fold 5"), closest first: starts with the query, then shortest. */
export function match(list: readonly string[], query: string) {
  const q = query.trim().toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  if (!words.length) return list
  const score = (m: string) => (m.toLowerCase().startsWith(q) || m.toLowerCase().includes(` ${q}`) ? 0 : 1)
  // ponytail: linear scan of a few hundred names per keystroke; index it if the list grows 10x.
  return list
    .filter((m) => words.every((w) => m.toLowerCase().includes(w)))
    .sort((a, b) => score(a) - score(b) || a.length - b.length || a.localeCompare(b, "en", { numeric: true }))
}
