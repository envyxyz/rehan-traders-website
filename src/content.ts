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
    lines: ["Shop G-88, Ground Floor", "Hafeez Center, Main Boulevard", "Block E1, Gulberg III, Lahore"],
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
    /** Footer, one phrase per line. */
    lines: ["Monday to Saturday", "11:00 AM to 10:00 PM", "Sunday closed"],
    fridayBreak: "Friday prayer break 1:00 to 2:00 PM",
    holidays: "Closed on public holidays",
  },
  status: {
    openNow: "Open now",
    closesAt: (time: string) => `closes ${time}`,
    closedNow: "Closed now",
    opensAt: (when: string) => `opens ${when}`,
    prayerBreak: "Prayer break",
    tomorrow: "tomorrow",
  },
  payments: "All payment methods accepted", // Adnan, PRD §11 q4
  courier: true, // Adnan, PRD §11 q6: courier and out-of-city repairs
} as const

// Typed in by hand (static site, no Places API). Update rating, count and asOf together.
// Read from the public listing on 28 Oct 2026 (signed out): Google shows these 5 reviews and only relative
// dates, so `date` is Google's relative date as of `asOf`. Text copied exactly (Google's trailing "…" dropped).
// `url` opens that review on Google Maps; `avatar` is the reviewer's Google profile picture, saved to public/reviews/.
const reviewUrl = (id: string, inner: string) =>
  `https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1s${id}!2m1!1s0x0:0x61c1e2f03a5bd64b!3m1!1s2@1:${inner}%7C%7C`

export const reviews = {
  rating: 4.9,
  count: 50,
  asOf: "2026-10-28",
  asOfLabel: "28 October 2026",
  url: site.mapsUrl, // TODO(adnan): confirm the Google reviews link (needs listing access)
  items: [
    {
      author: "Zunair K.",
      avatar: "/reviews/zunair-k.webp",
      date: "4 months ago",
      rating: 5,
      text: "I repaired my fold4 blank display.Good job🥰😍🥰",
      url: reviewUrl("Ci9DQUlRQUNvZENodHljRjlvT2kxSlNFMXFOREJmZHpaak1sUm9jRFZUVG10b1pHYxAB", "CAIQACodChtycF9oOi1JSE1qNDBfdzZjMlRocDVTTmtoZGc"),
    },
    {
      author: "Farwah W.",
      avatar: "/reviews/farwah-w.webp",
      date: "4 months ago",
      rating: 5,
      text: "Best Lab in the Entire Hafeez Centre for Mobile repair. Thumbs up 👍",
      url: reviewUrl("Ci9DQUlRQUNvZENodHljRjlvT210WFdHRlhNVGRQWTFVNVNVNURUbnBKZUdSbGEyYxAB", "CAIQACodChtycF9oOmtXWGFXMTdPY1U5SU5DTnpJeGRla2c"),
    },
    {
      author: "Hassnain T.",
      avatar: "/reviews/hassnain-t.webp",
      date: "5 months ago",
      rating: 5,
      text: "I recently got my phone repair. Very professional extremely happy with the services of Rehan Trader",
      url: reviewUrl("Ci9DQUlRQUNvZENodHljRjlvT21kMlRrOVpUWFY1YVU1MFJEbFlUVmwxVm5WamRGRRAB", "CAIQACodChtycF9oOmd2Tk9ZTXV5aU50RDlYTVl1VnVjdFE"),
    },
    {
      author: "Haadi O.",
      avatar: "/reviews/haadi-o.webp",
      date: "6 months ago",
      rating: 5,
      text: "Mr Rehan was very honest and helped me fixed my andriod s22 ultra which was ocean water damaged. He is expert in iphone so he recommended me to proper person and didn't charge me anything. My phone data was recovered.",
      url: reviewUrl("Ci9DQUlRQUNvZENodHljRjlvT2t4V01VVklWSHBLZEVOd1ZuWTJZa1Z1V1MwM05sRRAB", "CAIQACodChtycF9oOkxWMUVIVHpKdENwVnY2YkVuWS03NlE"),
    },
    {
      author: "Muhammad A.",
      avatar: "/reviews/muhammad-a.webp",
      date: "a year ago",
      rating: 5,
      text: "\"I had a great experience at Mobile Repairing. The staff was very friendly and helpful. They were able to answer all of my questions and help me find the right phone for my needs. I was especially impressed with the staff's politeness and professionalism. I would highly recommend mobile repairing to anyone looking for a new phone.\"",
      url: reviewUrl("ChdDSUhNMG9nS0VJQ0FnTURJNDRIbXlBRRAB", "CIHM0ogKEICAgMDI44HmyAE"),
    },
  ],
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
  label: "Main",

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
  allQuestions: "All questions",
  /** Phase 5: the button on the booking form / page opened by "Book this repair", and its success message. */
  getQuote: "Get a quote",
  quoteSent: "Ticket Created. You'll be given a quote in 5 minutes.",
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
  /** Decorative screens on the CSS fold (aria-hidden). */
  fold: { time: "11:00", date: "Tuesday, 28 October", network: "5G" },
} as const

export type Service = {
  slug: string
  title: string
  short: string
  long: string
  faults: string[]
  /** Rupees. Shown only when priceMode is "from". */
  priceFrom?: number
  /** Phase 2 image name: public/images/<image>-<width>.avif|webp */
  image: string
  alt: string
  faq: { q: string; a: string }[]
  lead?: boolean
  /** Device step shows two dropdowns (family, then model) instead of the full search. `prefix` matches src/data/devices.json names. */
  families?: { label: string; prefix: string }[]
}

// Images arrive in Phase 2 (public/images); until then cards show a placeholder surface. Prices stay unset while priceMode is "quote".
export const services: Service[] = [
  {
    slug: "touch-glass-replacement",
    title: "Touch glass replacement",
    short: "Cracked glass replaced on its own. Your original display stays.",
    long: "We separate the cracked top glass from the display under heat and vacuum, fit new glass and laminate it back. The display underneath is the one your phone came with.",
    faults: ["Cracked glass", "Scratched glass", "Touch not working"],
    image: "glass-separation",
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
    image: "fold-inner-panel",
    alt: "Galaxy Z Fold opened on the bench with its inner panel exposed",
    faq: [],
    lead: true,
    families: [
      { label: "Galaxy Z Fold", prefix: "Samsung Galaxy Z Fold" },
      { label: "Galaxy Z Flip", prefix: "Samsung Galaxy Z Flip" },
    ],
  },
  {
    slug: "iphone",
    title: "iPhone repair",
    short: "Screen, back glass, Face ID, battery and charging.",
    long: "iPhone screens, back glass, Face ID, batteries, cameras and charging faults, fixed at the open bench.",
    faults: ["Screen", "Back glass", "Face ID", "Battery", "Charging", "Camera"],
    image: "iphone-back-glass",
    alt: "iPhone with its back glass being replaced",
    faq: [],
    families: [
      { label: "iPhone", prefix: "iPhone" },
      { label: "iPad", prefix: "iPad" },
    ],
  },
  {
    slug: "screen-replacement",
    title: "Screen replacement",
    short: "Lines, black, green or flickering screens replaced.",
    long: "When the display itself is damaged: lines, pink or green screens, black or blank displays and flicker.",
    faults: ["Lines on screen", "Black or blank display", "Green or white screen", "Flickering"],
    image: "screen-replacement", // no Phase 2 job yet: shows the placeholder,
    alt: "Phone with its display panel removed on the bench",
    faq: [],
  },
  {
    slug: "battery-charging",
    title: "Battery and charging",
    short: "Batteries that drain fast and ports that will not charge.",
    long: "Battery replacement and charging port repair. Swollen batteries are removed and disposed of safely.",
    faults: ["Battery drains fast", "Swollen battery", "Not charging", "Loose charging port"],
    image: "battery-swap",
    alt: "Phone battery being replaced at the bench",
    faq: [],
  },
  {
    slug: "water-damage-data-recovery",
    title: "Water damage and data recovery",
    short: "Wet or dead phones cleaned, repaired and your data recovered.",
    long: "Liquid-damaged and dead phones are opened, cleaned and repaired at board level, with your data recovered first where possible.",
    faults: ["Water damage", "Phone will not turn on", "Data recovery"],
    image: "wet-board-cleaning",
    alt: "Phone board being cleaned after water damage",
    faq: [],
  },
  {
    slug: "board-repair",
    title: "Board repair",
    short: "Board-level faults found and fixed under the microscope.",
    long: "Motherboard faults, network and SIM faults, Face ID and no-power faults diagnosed and repaired under the microscope.",
    faults: ["No power", "No network or SIM", "Face ID", "Camera", "Vibration"],
    image: "board-microscope",
    alt: "Microscope over a phone board at the repair bench",
    faq: [],
  },
  {
    slug: "ipad-tablet",
    title: "iPad and tablets",
    short: "Tablet glass, screens, batteries and charging.",
    long: "iPad and tablet glass, screens, batteries and charging repairs. Very old, obsolete tablets are not taken in.",
    faults: ["Cracked glass", "Screen", "Battery", "Charging"],
    image: "ipad-screen",
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

// Pakistan's public holidays: no booking slots on these dates. Fixed-date holidays are certain; Eid, Ashura and
// 12 Rabi ul Awal follow the moon, so their dates are estimates. Update them when the government announces them.
// TODO(adnan): confirm the shop closes on every one of these days. Extend the list before August 2027.
export const holidays = [
  { date: "2026-11-09", name: "Iqbal Day" },
  { date: "2026-12-25", name: "Quaid-e-Azam Day" },
  { date: "2027-02-05", name: "Kashmir Solidarity Day" },
  { date: "2027-03-10", name: "Eid ul Fitr (estimate)" },
  { date: "2027-03-11", name: "Eid ul Fitr (estimate)" },
  { date: "2027-03-12", name: "Eid ul Fitr (estimate)" },
  { date: "2027-03-23", name: "Pakistan Day" },
  { date: "2027-05-01", name: "Labour Day" },
  { date: "2027-05-17", name: "Eid ul Adha (estimate)" },
  { date: "2027-05-18", name: "Eid ul Adha (estimate)" },
  { date: "2027-05-19", name: "Eid ul Adha (estimate)" },
  { date: "2027-05-28", name: "Youm-e-Takbeer" },
  { date: "2027-06-15", name: "Ashura (estimate)" },
  { date: "2027-06-16", name: "Ashura (estimate)" },
  { date: "2027-08-14", name: "Independence Day" },
  { date: "2027-08-15", name: "12 Rabi ul Awal (estimate)" },
] as const

/** What the booking flow carries to the confirmation page and the WhatsApp text. */
export type BookingSummary = {
  kind: "book" | "quote"
  /** Job number from the Sheet (RT-0001), or a local reference when the Sheet could not be reached. */
  ref: string
  saved: boolean
  device: string
  fault: string
  /** Visit line ("Thu 30 Oct, 6:30 PM") and ISO slot; null for a quote. */
  visit: string | null
  slot: string | null
  name: string
}

export const booking = {
  title: "Book a visit",
  lede: "Four quick questions. No account, no payment.",
  progress: (step: number, total: number, name: string) => `Step ${step} of ${total}: ${name}`,
  next: "Next",
  back: "Back",
  steps: {
    device: { name: "Device", title: "Which device is it?" },
    fault: { name: "Fault", title: "What's wrong with it?" },
    time: { name: "Visit", title: "When will you come in?" },
    details: { name: "Details", title: "Your name and number" },
    review: { name: "Review", title: "Check and confirm" },
  },
  device: {
    search: "Search your model, like Galaxy A54 or iPhone 13",
    brands: "Brands",
    models: "Models",
    notListed: "Not listed",
    other: ["Other phone", "Other tablet"],
    useTyped: (q: string) => `Use "${q}"`,
    family: "Device",
    model: "Model",
    choose: "Choose one",
    searchAll: "Different device? Search all models",
    pickError: "Pick your device to continue.",
  },
  fault: { label: "Fault", pickError: "Pick what's wrong to continue." },
  time: {
    days: "Day",
    slots: "Time",
    today: "Today",
    hour: "Hour",
    minute: "Minutes",
    picked: (when: string) => `You'll come in ${when}`,
    none: "No times are left in the next 7 days. Message us on WhatsApp instead.",
    pickError: "Pick a time to continue.",
    quoteInstead: "Not ready to book? Ask for a quote first.",
  },
  details: {
    name: "Your name",
    phone: "Mobile number",
    phonePlaceholder: "0300 1234567",
    phoneHint: "Only the shop sees it, to reach you about this repair.",
    nameError: "Enter your name.",
    phoneError: "Enter a Pakistani mobile number, like 0300 1234567.",
    /** Hidden from people; only bots fill it. */
    honeypot: "Leave this field empty",
  },
  review: {
    device: "Device",
    fault: "Fault",
    visit: "Visit",
    quoteVisit: "Quote first, no visit booked",
    name: "Name",
    phone: "Mobile",
    submit: "Confirm booking",
    sending: "Sending",
    error: "Something in the form was not accepted. Go back, check it and try again.",
  },
  /** Prefilled WhatsApp text: job number, device, fault, time and name. */
  whatsapp: (b: BookingSummary) =>
    [
      `Assalam o alaikum. ${b.kind === "quote" ? "Quote request" : "Booking"} No. ${b.ref}`,
      `Device: ${b.device}`,
      `Fault: ${b.fault}`,
      b.visit && `Visit: ${b.visit}`,
      `Name: ${b.name}`,
    ]
      .filter(Boolean)
      .join("\n"),
  confirmed: {
    title: "You're booked at G-88.",
    quoteTitle: actions.quoteSent,
    failedTitle: "Send it on WhatsApp to finish.",
    lede: "Show this number at the counter.",
    quoteLede: "The shop replies on WhatsApp with your quote.",
    failedLede: "We could not save your booking online. Send it on WhatsApp now so the shop has it.",
    number: "Job number",
    reference: "Reference",
    visit: "Visit",
    where: "Where",
    send: "Send on WhatsApp",
    calendar: "Add to calendar",
    missing: "There is no booking on this device yet.",
    sealAlt: "Rehan Traders tamper seal",
  },
  ics: {
    file: (ref: string) => `rehan-traders-${ref.toLowerCase()}.ics`,
    summary: `Repair visit, ${site.name}`,
    description: (ref: string) => `Job ${ref}. Questions: ${site.phone.display}.`,
  },
} as const

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
  mapTitle: "Google Map showing Rehan Traders at Hafeez Center, Lahore",
  /** "Embed a map" from the listing's Share menu: no API key, no billing. */
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.293694128489!2d74.3433854!3d31.516092600000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919050c3198a217%3A0x61c1e2f03a5bd64b!2sRehan%20Traders%20%26%20Mobile%20Repairing%20Shop!5e0!3m2!1sen!2s!4v1793211191069!5m2!1sen!2s",
  today: "Today",
  hoursTitle: "Hours",
  /** Compact hours. `days` (0 = Sunday) picks the row marked as today; the last match wins. */
  hours: [
    { label: "Monday to Saturday", value: "11 AM to 10 PM", days: [1, 2, 3, 4, 5, 6] },
    { label: "Friday prayer break", value: "1 to 2 PM", days: [5] },
    { label: "Sunday and public holidays", value: "Closed", days: [0] },
  ],
  courier: "Outside Lahore? Send it by courier.", // TODO(adnan): courier terms (PRD §12 q4)
  courierLink: "Message us on WhatsApp",
} as const

export const estimate = {
  title: "Not sure what's wrong?",
  label: "Describe the problem",
  placeholder: "My Fold's inner screen has a black line",
  submit: "Get an estimate",
} as const

/** Homepage section copy, in PRD §5 order. */
export const home = {
  repairs: { title: "What we repair" },
  beforeAfter: {
    title: "Same phone, new glass.",
    // TODO(adnan): real before-and-after pair from a finished job (PRD §12 q6). Placeholder images until then.
    caption: "Example pair, to be replaced by a real job: cracked front glass, replaced with the display kept.",
    before: { image: "placeholder-before", alt: "Placeholder: phone with shattered front glass before repair", label: "Before" },
    after: { image: "placeholder-after", alt: "Placeholder: the same phone with new front glass after repair", label: "After" },
    slider: "Before and after comparison",
    valueText: (after: number) => `${after}% after, ${100 - after}% before`,
  },
  process: {
    title: "How a repair works",
    jobCardAlt: "The Rehan Traders repair job card, with fields for the customer, device and fault",
    sealAlt: "Rehan Traders tamper seal",
  },
  reviews: {
    title: "What customers say",
    summary: (count: number) => `on Google from ${count} reviews`,
    asOf: (date: string) => `As of ${date}`,
    readOne: "Read on Google",
    show: (n: number, total: number) => `Show review ${n} of ${total}`,
    next: "Next review",
  },
  faq: { title: "Questions" },
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
  directions: "Directions on Google Maps",
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
  book: {
    title: "Book a visit",
    description: "Book a repair visit to Rehan Traders, Shop G-88, Hafeez Center, Lahore. Pick your device, the fault and a time.",
  },
  bookConfirmed: { title: "Booking confirmed", description: "Your Rehan Traders booking." },
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
  /** alt for images that only repeat nearby text (reviewer avatars next to the name). */
  decorative: "",
  toastSent: "Request sent",
} as const

// ─── Phase 6: chat assistant and repair estimator ─────────────────────────────────────────────────────────
// Kept in one block at the end so it merges cleanly with Phase 7's inner-page copy.
// The assistant's knowledge is built from the exports above (src/lib/assistant.ts); nothing here adds facts.

export const assistant = {
  title: chat.launcher,
  greeting: chat.greeting,
  /** Shown when every model is down, the turn cap is hit, or the reply breaks off. */
  fallback: chat.fallback,
  limit: "That's all this chat can take. WhatsApp or call the shop to carry on.",
  disclosure: "Answers come from this site only. For a price or anything else, the shop replies on WhatsApp.",
  input: "Your question",
  placeholder: "Type in English or Urdu",
  send: "Send",
  typing: "Typing",
  tooLong: (max: number) => `Keep it under ${max} characters.`,
  you: "You",
  shop: site.name,
  /** First quick replies, before the model suggests its own. */
  chips: ["Can you fix a Fold inner screen?", "Touch glass ki price kya hai?", "When are you open?", "Where is G-88?"],
  actions: { book: actions.book, whatsapp: actions.whatsapp, call: actions.call },
  whatsappText: "Assalam o alaikum. I have a question about a repair.",
} as const

export type EstimateFault = {
  slug: string
  label: string
  /** Service it most often needs; src/lib/assistant.ts moves it to the Fold, iPhone or tablet service by device. */
  service: string
  /** "kept": only the glass is changed. "maybe": the shop tries to save the panel first. null: no panel involved. */
  panel: "kept" | "maybe" | null
}

export const estimator = {
  seo: {
    title: "Repair estimate",
    description:
      "Not sure what's wrong with your phone or tablet? Pick the device and fault, or describe it, and see the likely repair at Rehan Traders, Hafeez Center, Lahore.",
  },
  title: "Repair estimate",
  lede: "Pick your device and the fault, or describe the problem in your own words. You'll see the likely repair and how to get a price.",
  mode: { label: "How do you want to tell us?", pick: "Pick device and fault", describe: "Describe it" },
  device: "Device",
  fault: "Fault",
  describe: estimate.label,
  describePlaceholder: estimate.placeholder,
  describeHint: "English, Roman Urdu or Urdu. Don't include your name or number.",
  submit: estimate.submit,
  working: "Reading your problem",
  pickError: "Pick your device and the fault.",
  describeError: "Describe the problem in a few words.",
  result: {
    title: "Likely repair",
    device: "Device",
    fault: "Fault",
    panel: {
      kept: "Your original display stays: only the cracked glass is replaced.",
      maybe: "The shop tries to save the damaged panel first and replaces it only when it cannot be saved.",
    },
    guess: "This is a guess from your description. The shop confirms it when they see the device.",
    unknownDevice: "Your device",
    quote: "Get a quote on WhatsApp",
    other: "That doesn't match a repair we list. Ask on WhatsApp and the shop will tell you.",
  },
  unavailable: `The estimator isn't working right now. WhatsApp or call us on ${site.phone.display}.`,
  whatsapp: (device: string, fault: string) => `Assalam o alaikum. Quote please.\nDevice: ${device}\nFault: ${fault}`,
  faults: [
    { slug: "cracked-glass", label: "Cracked glass, screen still works", service: "touch-glass-replacement", panel: "kept" },
    { slug: "touch-not-working", label: "Touch not working", service: "touch-glass-replacement", panel: "kept" },
    { slug: "screen-damaged", label: "Lines, black, green or flickering screen", service: "screen-replacement", panel: "maybe" },
    { slug: "fold-inner-screen", label: "Fold or Flip inner screen", service: "galaxy-z-fold-flip", panel: "maybe" },
    { slug: "hinge", label: "Hinge", service: "galaxy-z-fold-flip", panel: null },
    { slug: "back-glass", label: "Back glass", service: "iphone", panel: null },
    { slug: "battery", label: "Battery drains fast or is swollen", service: "battery-charging", panel: null },
    { slug: "charging", label: "Not charging", service: "battery-charging", panel: null },
    { slug: "water-damage", label: "Water damage", service: "water-damage-data-recovery", panel: null },
    { slug: "no-power", label: "Will not turn on", service: "board-repair", panel: null },
    { slug: "data-recovery", label: "Data recovery", service: "water-damage-data-recovery", panel: null },
    { slug: "network", label: "No network or SIM", service: "board-repair", panel: null },
    { slug: "face-id", label: "Face ID", service: "iphone", panel: null },
    { slug: "camera", label: "Camera", service: "board-repair", panel: null },
    { slug: "other", label: "Something else", service: "", panel: null },
  ] satisfies EstimateFault[],
} as const
