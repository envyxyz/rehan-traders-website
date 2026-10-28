/**
 * All site copy. Components import from here; no user-facing strings live in components.
 * Sources: PRODUCT.md, ../growth/Documents/Business Profile.html, Adnan's answers in docs/PRD.md §11.
 * Anything marked `TODO(adnan): confirm` must be resolved before launch: grep for it.
 */

export type PriceMode = "from" | "quote"

/** One-line switch. Adnan chose "Get a quote" (PRD §11 q3). */
export const priceMode: PriceMode = "quote"

export const price = {
  from: (rs: number) => `From Rs ${rs.toLocaleString("en-PK")}`,
  quote: "Get a quote in 5 minutes",
} as const

const phoneDial = "+923058874839"

export const site = {
  name: "Rehan Traders",
  url: "https://rehanmobiletraders.com",
  entity:
    "Rehan Traders is a phone and tablet repair lab at Shop G-88, Ground Floor, Hafeez Center, Gulberg III, Lahore.",
  founded: 2009, // Adnan, PRD §11 q12
  phone: { display: "0305 8874839", dial: phoneDial, href: `tel:${phoneDial}` },
  whatsapp: {
    href: "https://wa.me/923058874839",
    /** Prefilled chat. `text` is URL-encoded by the caller. */
    withText: (text: string) => `https://wa.me/923058874839?text=${encodeURIComponent(text)}`,
  },
  email: "rehanmobiletraders@gmail.com", // Adnan, PRD §11 q8
  address: {
    // TODO(adnan): confirm this exact line (Business Profile marks it "to confirm")
    lines: ["Shop G-88, Ground Floor, Hafeez Center", "Main Boulevard, Block E1, Gulberg III"],
    short: "Shop G-88, Hafeez Center",
    city: "Lahore",
    region: "Punjab",
    postalCode: "54000",
    country: "PK",
  },
  geo: { lat: 31.5161006, lng: 74.3433894 },
  mapsUrl: "https://maps.google.com/?cid=7044160813583291979",
  /** 24h times, Asia/Karachi. 0 = Sunday. */
  hours: {
    timezone: "Asia/Karachi",
    days: [
      { day: 1, label: "Monday", open: "11:00", close: "22:00" },
      { day: 2, label: "Tuesday", open: "11:00", close: "22:00" },
      { day: 3, label: "Wednesday", open: "11:00", close: "22:00" },
      { day: 4, label: "Thursday", open: "11:00", close: "22:00" },
      { day: 5, label: "Friday", open: "11:00", close: "22:00", break: { from: "13:00", to: "14:00" } },
      { day: 6, label: "Saturday", open: "11:00", close: "22:00" },
      { day: 0, label: "Sunday", open: null, close: null },
    ],
    oneLine: "Monday to Saturday 11:00 AM to 10:00 PM, Sunday closed",
    fridayBreak: "Friday prayer break 1:00 to 2:00 PM",
    holidays: "Closed on public holidays",
  },
  status: {
    openNow: "Open now",
    closesAt: (time: string) => `closes ${time}`,
    closedNow: "Closed now",
    opensAt: (when: string) => `opens ${when}`,
    prayerBreak: "Prayer break",
  },
  payments: "All payment methods accepted", // Adnan, PRD §11 q4
  courier: true, // Adnan, PRD §11 q6: courier and out-of-city repairs
} as const

// Typed in by hand (static site, no Places API). Update rating, count and asOf together.
export const reviews = {
  rating: 4.9,
  count: 47,
  asOf: "2026-10-23",
  url: site.mapsUrl, // TODO(adnan): confirm the Google reviews link (needs listing access)
  // TODO(adnan): confirm which reviews to show; copy text, first name and date exactly from Google
  items: [] as { author: string; date: string; rating: number; text: string }[],
} as const

export const nav = {
  links: [
    { label: "Repairs", href: "/repairs" },
    { label: "Estimate", href: "/estimate" },
    { label: "Reviews", href: "/reviews" },
    { label: "Visit", href: "/visit" },
  ],
  call: `Call ${site.phone.display}`,
  menu: "Menu",
  home: `${site.name} home`,
} as const

export const actions = {
  book: "Book a visit",
  bookRepair: "Book this repair",
  whatsapp: "WhatsApp",
  whatsappLabel: `Chat on WhatsApp, ${site.phone.display}`,
  call: "Call",
  directions: "Directions",
  allRepairs: "All repairs",
  readReviews: (count: number) => `Read all ${count} on Google`,
} as const

export const hero = {
  title: "Cracked glass? Fixed at G‑88.", // ‑ is a non-breaking hyphen: "G-88" never splits
  lede: "Phone and tablet repairs at an open bench in Hafeez Center, Lahore. Touch glass, Fold and Flip, iPhone, boards.",
  proof: (rating: number, count: number) => ({ rating: rating.toFixed(1), rest: `on Google · ${count} reviews` }),
  jobCard: {
    heading: "Repair job card",
    number: "No. RT-0427",
    rows: [
      { label: "Device", value: "Galaxy Z Fold5" },
      { label: "Fault", value: "Inner screen" },
      { label: "Visit", value: "Today, 6:30 PM" },
    ],
    status: "Booked at G-88",
  },
} as const

export type Service = {
  slug: string
  title: string
  short: string
  long: string
  faults: string[]
  /** Rupees. Shown only when priceMode is "from". */
  priceFrom?: number
  image: string
  alt: string
  faq: { q: string; a: string }[]
  lead?: boolean
}

// Images arrive in Phase 2 (public/images). Prices stay unset while priceMode is "quote".
export const services: Service[] = [
  {
    slug: "touch-glass-replacement",
    title: "Touch glass replacement",
    short: "Cracked glass replaced on its own. Your original display stays.",
    long: "We separate the cracked top glass from the display under heat and vacuum, fit new glass and laminate it back. The display underneath is the one your phone came with.",
    faults: ["Cracked glass", "Scratched glass", "Touch not working"],
    image: "/images/glass-separation.jpg",
    alt: "Technician separating cracked glass from a phone display at the bench",
    faq: [],
    lead: true,
  },
  {
    slug: "galaxy-z-fold-flip",
    title: "Galaxy Z Fold and Flip",
    short: "Outer glass, inner screen and hinge for every Fold and Flip.",
    long: "Fold and Flip outer glass, inner panel and hinge repairs. We try to recover the damaged panel first and replace it only when it cannot be saved.",
    faults: ["Outer glass", "Inner screen", "Hinge", "Blank display", "Lines on screen"],
    image: "/images/fold-inner-panel.jpg",
    alt: "Galaxy Z Fold opened on the bench with its inner panel exposed",
    faq: [],
    lead: true,
  },
  {
    slug: "iphone",
    title: "iPhone repair",
    short: "Screen, back glass, Face ID, battery and charging.",
    long: "iPhone screens, back glass, Face ID, batteries, cameras and charging faults, fixed at the open bench.",
    faults: ["Screen", "Back glass", "Face ID", "Battery", "Charging", "Camera"],
    image: "/images/iphone-back-glass.jpg",
    alt: "iPhone with its back glass being replaced",
    faq: [],
  },
  {
    slug: "screen-replacement",
    title: "Screen replacement",
    short: "Lines, black, green or flickering screens replaced.",
    long: "When the display itself is damaged: lines, pink or green screens, black or blank displays and flicker.",
    faults: ["Lines on screen", "Black or blank display", "Green or white screen", "Flickering"],
    image: "/images/screen-replacement.jpg",
    alt: "Phone with its display panel removed on the bench",
    faq: [],
  },
  {
    slug: "battery-charging",
    title: "Battery and charging",
    short: "Batteries that drain fast and ports that will not charge.",
    long: "Battery replacement and charging port repair. Swollen batteries are removed and disposed of safely.",
    faults: ["Battery drains fast", "Swollen battery", "Not charging", "Loose charging port"],
    image: "/images/battery-swap.jpg",
    alt: "Phone battery being replaced at the bench",
    faq: [],
  },
  {
    slug: "water-damage-data-recovery",
    title: "Water damage and data recovery",
    short: "Wet or dead phones cleaned, repaired and your data recovered.",
    long: "Liquid-damaged and dead phones are opened, cleaned and repaired at board level, with your data recovered first where possible.",
    faults: ["Water damage", "Phone will not turn on", "Data recovery"],
    image: "/images/wet-board-cleaning.jpg",
    alt: "Phone board being cleaned after water damage",
    faq: [],
  },
  {
    slug: "board-repair",
    title: "Board repair",
    short: "Board-level faults found and fixed under the microscope.",
    long: "Motherboard faults, network and SIM faults, Face ID and no-power faults diagnosed and repaired under the microscope.",
    faults: ["No power", "No network or SIM", "Face ID", "Camera", "Vibration"],
    image: "/images/microscope-bench.jpg",
    alt: "Microscope over a phone board at the repair bench",
    faq: [],
  },
  {
    slug: "ipad-tablet",
    title: "iPad and tablets",
    short: "Tablet glass, screens, batteries and charging.",
    long: "iPad and tablet glass, screens, batteries and charging repairs. Very old, obsolete tablets are not taken in.",
    faults: ["Cracked glass", "Screen", "Battery", "Charging"],
    image: "/images/tablet-screen.jpg",
    alt: "Tablet screen being repaired at the bench",
    faq: [],
  },
]

// TODO(adnan): confirm model lists. Adnan: "all foldings, Samsung Flip and Fold, Pixel Fold" (PRD §11 q11).
export const devices = [
  { brand: "Samsung", models: ["Galaxy Z Fold", "Galaxy Z Flip", "Galaxy S series", "Galaxy A series", "Galaxy Tab"] },
  { brand: "Apple", models: ["iPhone", "iPad"] },
  { brand: "Google", models: ["Pixel", "Pixel Fold"] },
  { brand: "OnePlus", models: ["OnePlus"] },
  { brand: "Other", models: ["Other phone", "Other tablet"] },
] as const

export const faults = [
  "Cracked glass",
  "Screen not working",
  "Battery",
  "Charging",
  "Water damage",
  "Will not turn on",
  "Hinge",
  "Back glass",
  "Other",
] as const

export const process = [
  { title: "Job card at the counter", text: "Your device, fault and contact are written on a numbered job card." },
  { title: "Repaired at the open bench", text: "The work happens at the bench in the shop. Ask to watch when it is not busy." },
  { title: "Tested and sealed", text: "Every repair is tested, then sealed in a pouch until you collect it." },
  // TODO(adnan): confirm warranty terms before this step says more (PRD §11 q1)
  { title: "Warranty card", text: "You leave with a warranty card for the repair." },
] as const

export const faq = [
  {
    q: "Can you replace only the glass and keep my original display?",
    a: "Yes. Touch glass replacement is our speciality. We change the cracked glass and keep the display your phone came with.",
  },
  {
    q: "Can I watch my phone being repaired?",
    a: "Yes, on request, when the bench is not busy. During rush hours it may not be possible.",
  },
  {
    q: "Do I get my old parts back?",
    a: "Yes, if you ask and the part is safe to return. Swollen batteries are disposed of straight away for safety.",
  },
  {
    q: "Do you repair phones from outside Lahore?",
    a: "Yes. Send your phone by courier. Message us on WhatsApp first.",
  },
  {
    q: "How can I pay?",
    a: "All payment methods are accepted.",
  },
  {
    q: "When are you open?",
    a: `${site.hours.oneLine}. ${site.hours.fridayBreak}. ${site.hours.holidays}.`,
  },
  // TODO(adnan): confirm warranty length and turnaround times before adding those questions
] as const

export const visit = {
  title: "Visit G-88",
  directions: "Ground floor of Hafeez Center, Main Boulevard, Gulberg III.", // TODO(adnan): confirm walking directions to G-88
  mapAlt: "Map showing Rehan Traders at Hafeez Center, Lahore",
  today: "Today",
} as const

export const estimate = {
  title: "Not sure what's wrong?",
  label: "Describe the problem",
  placeholder: "My Fold's inner screen has a black line",
  submit: "Get an estimate",
} as const

export const cta = {
  title: "Cracked glass? Bring it to G‑88.",
} as const

export const footer = {
  groups: {
    repairs: "Repairs",
    shop: "Shop",
    visit: "Visit",
    legal: "Legal",
  },
  shopLinks: [
    { label: "About", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "FAQ", href: "/faq" },
    // Warranty page publishes only once Adnan confirms terms
  ],
  legalLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  registered: null as string | null, // TODO(adnan): confirm registered business name and NTN
  copyright: (year: number) => `© ${year} ${site.name}`,
} as const

export const legal = {
  privacyTitle: "Privacy",
  termsTitle: "Terms",
} as const

export const seo = {
  home: {
    title: "Rehan Traders · Phone and tablet repair at Hafeez Center, Lahore",
    description:
      "Touch glass replacement, Galaxy Z Fold and Flip, iPhone and board repairs at Shop G-88, Hafeez Center, Lahore. Book a visit or WhatsApp 0305 8874839.",
  },
  titleTemplate: "%s · Rehan Traders",
  notFound: { title: "Page not found", description: "This page does not exist." },
  kitchenSink: { title: "Kitchen sink" },
} as const

export const chat = {
  greeting: "Assalam o alaikum. Ask about your phone's fault, our hours or how to find G-88.",
  fallback: `Sorry, I can't answer right now. WhatsApp or call us on ${site.phone.display}.`,
  launcher: "Ask a question",
} as const

/** Labels for UI chrome and screen readers. */
export const ui = {
  close: "Close",
  search: "Search",
  noResults: "No results",
  stars: (rating: number) => `${rating} out of 5 stars`,
  externalLink: "opens in a new tab",
  toastSent: "Request sent",
} as const
