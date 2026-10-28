// Builds src/data/devices.json, the device list the booking flow searches, from two public sources:
//   Android: Google Play's supported devices list (every certified Android model, updated by Google)
//   Apple:   AppleDB (appledb.dev), every iPhone and iPad with its release date
// Run `pnpm devices` to refresh it (new launches); the result is committed, so builds never need the network.
import { writeFileSync } from "node:fs"

const GOOGLE = "https://storage.googleapis.com/play_public/supported_devices.csv"
const APPLEDB = "https://api.appledb.dev/device/main.json"
const APPLE_FROM = "2015" // iPhone 6s onwards: older ones rarely come in for repair
// ponytail: brands sold in Pakistan only, so the list stays small; add a brand here when the shop sees it.
const BRANDS = {
  samsung: "Samsung",
  google: "Google",
  oneplus: "OnePlus",
  xiaomi: "Xiaomi",
  redmi: "Redmi",
  poco: "POCO",
  vivo: "vivo",
  oppo: "OPPO",
  realme: "realme",
  infinix: "Infinix",
  tecno: "TECNO",
  itel: "itel",
  huawei: "Huawei",
  honor: "HONOR",
  nokia: "Nokia",
  "hmd global": "Nokia",
  motorola: "Motorola",
  nothing: "Nothing",
  sony: "Sony",
  lenovo: "Lenovo",
}
// Model codes ("SM-A515F", "V2027", "RMX3761") are not names people know their phone by.
const isCode = (s) => /^[A-Z]{0,5}[-_]?[A-Z]*\d[A-Z0-9_-]*$/i.test(s)
// Google's list also carries TVs, Chromebooks, watches and China-only names; the shop repairs phones and tablets.
const notPhone = (s) => /[^\x20-\x7E™]|\b(TV|Chromebook|Chromebase|Watch|Stick|Projector|Laser|BRAVIA|Box|Car|Kit|Display|TechLife|Emulator|Emualtor)\b|TV\b/i.test(s)

// Current model lines only. Google's list goes back to 2010 US carrier phones ("Samsung Gem", "Motorola Backflip")
// and includes emulators; these keep roughly the last seven years. A brand without a rule keeps every name.
// ponytail: hand-kept patterns; widen one when the shop sees a model it drops.
const KEEP = {
  Samsung: /^Galaxy (S(9|[1-9]\d)|Note ?(9|[1-9]\d)|Z |A0?\d{2}|A0\d|M\d{2}|M0\d|F\d{2}|Tab (S([5-9]|1\d)|A[7-9]|A ?\d{2}|Active ?[3-9])|XCover ?[5-9])/,
  Google: /^Pixel (\d|Fold|Tablet)/,
  OnePlus: /^(OnePlus )?(\d{1,2}[RT]?|Nord|Open|Pad)/,
  Motorola: /^(motorola )?((edge|razr)( ?(\d{2}|20\d\d|plus|ultra|\+|neo|fusion|pro|\(20\d\d\)))|moto ?[ge] ?(\d{2}|\(20\d\d\)|\d (power|play|stylus|5G))|moto g ?(stylus|power|play|5G))/i,
  Huawei: /^(HUAWEI )?(P\d{2}|Mate ?(\d{2}|X|Pad)|nova|Y\d|MatePad|Pura)/i,
  HONOR: /^(HONOR )?(X\d|\d{2,3}|Magic|Pad|Play)/i,
  Sony: /^Xperia (1|5|10|Pro)/i,
  Nokia: /^Nokia ([CGX]\d{2,3}|T\d{2}|XR\d{2}|G\d{2})/,
  Lenovo: /^(Lenovo )?(Tab (P|M)\d|Legion|Yoga Tab|Tab K\d)/i,
  Xiaomi: /^(Xiaomi |Mi )?(\d{2}[T ]?|Mix|Pad|Redmi|POCO)/i,
}

const byBrand = new Map()
const add = (brand, model) => {
  const m = model.replace(/\s+/g, " ").replace(/™/g, "").trim()
  if (!m || m.length > 50 || isCode(m) || notPhone(m) || m.toLowerCase() === brand.toLowerCase()) return
  if (KEEP[brand] && !KEEP[brand].test(m.replace(new RegExp(`^${brand} `, "i"), ""))) return
  const set = byBrand.get(brand) ?? new Map()
  set.set(m.toLowerCase(), set.get(m.toLowerCase()) ?? m)
  byBrand.set(brand, set)
}

const csv = new TextDecoder("utf-16le").decode(await (await fetch(GOOGLE)).arrayBuffer())
for (const line of csv.split(/\r?\n/).slice(1)) {
  const [retail, marketing] = line.split('","').map((c) => c.replace(/^﻿?"|"$/g, ""))
  const brand = BRANDS[retail?.toLowerCase()]
  if (brand && marketing) add(brand, marketing)
}

const apple = (await (await fetch(APPLEDB)).json()).sort((a, b) => ([b.released].flat()[0] ?? "").localeCompare([a.released].flat()[0] ?? ""))
for (const d of apple) {
  const released = [d.released].flat()[0] ?? ""
  if (!/^iP(hone|ad)/.test(d.type) || released < APPLE_FROM) continue
  // "iPhone 7 (GSM)", "iPhone 18 Pro Max (US)": carrier and region variants are the same phone at the counter.
  add("Apple", d.name.replace(/ \((GSM|CDMA|Global|US|China( mainland)?|1TB|1 or 2 TB)\)| Wi-Fi( \+ Cellular)?| Cellular/g, ""))
}

const order = ["Samsung", "Apple"] // most common at the shop first, the rest A to Z
const brands = [...byBrand.keys()].sort((a, b) => {
  const i = (x) => (order.includes(x) ? order.indexOf(x) : order.length)
  return i(a) - i(b) || a.localeCompare(b)
})
const out = brands.map((brand) => ({
  brand,
  // Newest first: Apple by release date (insertion order below is sorted), the rest by number, highest first.
  models: brand === "Apple" ? [...byBrand.get(brand).values()] : [...byBrand.get(brand).values()].sort((a, b) => b.localeCompare(a, "en", { numeric: true })),
}))

writeFileSync(new URL("../src/data/devices.json", import.meta.url), JSON.stringify(out) + "\n")
console.log(out.map((b) => `${b.brand} ${b.models.length}`).join(", "))
