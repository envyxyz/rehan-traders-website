/**
 * All site copy. Components import from here; no user-facing strings live in components.
 * Sources: PRODUCT.md, ../growth/Documents/Business Profile.html, Adnan's answers in docs/PRD.md §11.
 * Anything marked `TODO(adnan): confirm` must be resolved before launch: grep for it.
 * The repair pages, reviews, booking and quote copy live in content-large.ts, so they are not in every page's first load.
 */

export type PriceMode = "from" | "quote"

/** One-line switch. Adnan chose "Get a quote" (PRD §11 q3). */
export const priceMode: PriceMode = "quote"

export const price = {
  from: (rs: number) => `From Rs ${rs.toLocaleString("en-PK")}`,
} as const

/** Copied from the Google listing, with reviews.asOf in content-large.ts. */
export const googleRating = 4.9

const phoneDial = "+923058874839"

export const site = {
  name: "Rehan Traders",
  /** Brand descriptor from the logo lockup (../growth/Brand/DESIGN.md). */
  descriptor: "Mobile & Tab Repair Lab",
  /** The name on the Google listing (Adnan, 31 Oct 2026). Schema alternateName, so search ties the two together. */
  googleName: "Rehan Traders & Mobile Repairing Shop",
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
    // Adnan confirmed the address, 31 Oct 2026
    lines: ["Shop G-88, Ground Floor", "Hafeez Center, Main Boulevard", "Block E1, Gulberg III, Lahore"],
    short: "Shop G-88, Hafeez Center",
    city: "Lahore",
    region: "Punjab",
    postalCode: "54660",
    country: "PK",
  },
  geo: { lat: 31.5161006, lng: 74.3433894 },
  mapsUrl: "https://maps.google.com/?cid=7044160813583291979",
  /**
   * Confirmed profiles only, for JSON-LD sameAs. The Google Maps place page for now.
   * TODO(adnan): confirm. The Facebook page (rehantraders0) joins this list once its phone and hours are fixed
   * (it shows 0305 5875716 and "Always open"); it is left out until then.
   */
  sameAs: ["https://maps.google.com/?cid=7044160813583291979", "https://www.instagram.com/rehantraders.lab/"], // Instagram: as listed on the verified Business Profile
  /** Square brand avatar, public/images/logo.png. */
  logo: "/images/logo.png",
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
    short: "Mon - Sat: 11:00 AM to 10:00 PM",
    /** Footer, one phrase per line. */
    lines: ["Monday to Saturday", "11:00 AM to 10:00 PM", "Friday break 1:00 to 2:00 PM", "Sunday closed"],
    fridayBreak: "Friday prayer break 1:00 to 2:00 PM",
    // Adnan, 31 Oct 2026: the shop opens whenever Hafeez Center does, so it closes only when the building closes.
    holidays: "Closed only when Hafeez Center closes, such as Eid and Ashura",
  },
  payments: "All payment methods accepted", // Adnan, PRD §11 q4
  courier: true, // Adnan, PRD §11 q6: courier and out-of-city repairs
} as const

/** How a courier repair travels (Adnan, 30 Oct 2026). The customer chooses; the customer pays. */
const delivery = "Send it however suits you: inside Lahore, inDrive, Yango or any other ride service; nationwide, TCS. You pay for delivery."

/**
 * Warranty, turnaround and courier, as Adnan answered on 30 Oct 2026 (PRD §11). One sentence each, written to be quoted
 * alone, and reused by the FAQ, the visit page, llms.txt and the chat assistant. No warranty length, no "guaranteed", no
 * general "original parts" claim (the battery line is only about what the customer chooses). The 60 minutes belongs to a
 * normal panel (screen) change only.
 */
export const facts = {
  warranty:
    "Rehan Traders discusses warranty once the fault is diagnosed or the job is confirmed. Whether a repair carries one, and its terms, depend on the repair, the model and the quality of parts you choose.",
  turnaround:
    "Repair time at Rehan Traders, Hafeez Center, Lahore depends on the type of repair, parts availability, and how rare and complex the model is. A normal screen (panel) change can take as little as 60 minutes.",
  turnaroundFold:
    "Complex devices such as Galaxy Z Folds can take up to a day.",
  courier: `Rehan Traders repairs phones sent by courier from outside Lahore. Create a ticket on this website or call ${site.phone.display}, and send photos of the phone on WhatsApp. If possible the shop quotes over the phone. Otherwise you send the phone, the shop inspects it and quotes, repairs it once you agree, and sends it back. ${delivery}`,
  check:
    "Rehan Traders checks your device free of cost at Shop G-88, Hafeez Center, Lahore. The shop tells you what the issue is, whether it can be repaired, what it will cost and how long it will take.",
  delivery,
  battery:
    "On an iPhone, if you choose an original battery, the \"Unknown Part\" message can be removed and battery health is shown. If you choose a cheaper copy battery, the IC from your old original battery can be moved to the new one. In some very rare cases this is not possible, and the shop tells you after checking the phone.",
  seal: "Rehan Traders re-applies the water-resistance seal after a repair on request.",
  quote: `Send photos of the phone and its model on WhatsApp to ${site.phone.display}, or create a ticket with photos on the Get a Quote page of this website. You can also visit Rehan Traders at Shop G-88, Ground Floor, Hafeez Center, Lahore. The shop replies with a quote; prices are not published online.`,
} as const

export const nav = {
  links: [
    { label: "Repairs", href: "/repairs" },
    { label: "Get a Quote", href: "/quote" },
    { label: "Reviews", href: "/reviews" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/visit" },
  ],
  call: `Call ${site.phone.display}`,
  menu: "Menu",
  /** Phones: back from the Repairs list to the menu. */
  back: "Back",
  home: `${site.name} home`,
  /** Phones: the menu's first row. */
  homeLink: "Home",
  label: "Main",

} as const

export const actions = {
  book: "Book a visit",
  /** The main call to action: opens the repair picker, then the booking. */
  start: "Start my repair",
  askAi: "Ask AI",
  /** On repair cards, repair pages and the estimate result: names the free check at the counter, the first step of every repair. */
  bookRepair: "Book a free check",
  whatsapp: "WhatsApp",
  // Starts with the visible "WhatsApp" (WCAG 2.5.3 label in name).
  whatsappLabel: `WhatsApp, chat on ${site.phone.display}`,
  call: "Call",
  directions: "Directions",
  allRepairs: "All repairs",
  readReviews: "Read all reviews on Google",
  moreReviews: "More reviews",
  allQuestions: "All questions",
  /** The nav, the How pricing works section, and the button on the booking form opened by "Book a free check", with its success message. */
  getQuote: "Get a Quote",
  quoteSent: "Ticket created. We'll send your quote on WhatsApp.",
} as const

export const hero = {
  title: "Cracked glass? Fixed at G‑88.", // ‑ is a non-breaking hyphen: "G-88" never splits
  /** Tablet and up only: a phone starts the lede at "Rehan Traders checks". */
  ledeLead: "A reliable repair in a confusing market. ",
  lede: "Rehan Traders checks your phone free of cost and tries to save your panel, and your money, first. Touch glass, Galaxy Z Fold and Flip, iPhone and board repairs in Hafeez Center, Lahore.",
  // Confirmed by Ameer, 1 Nov 2026.
  track: "10,000+ Certified Repairs",
  proof: (rating: number) => ({ before: `Rated ${rating.toFixed(1)} on`, link: "Google Maps" }),
  /** The 3D fold: status bar on its screen, and the label of the button that folds and opens it. */
  fold: { time: "11:00", network: "5G", close: "Fold the phone", open: "Open the phone" },
} as const

export const jobCardContent = {
  brandFirst: "Rehan",
  brandSecond: "Traders",
  qrAria: `${site.name} QR Code`,
  phone: site.phone.display,
  fields: {
    jobNo: { label: "Job no.", aria: "Job number", initial: "RT-2849" },
    date: { label: "Date", aria: "Date", initial: "12-11-2024" },
    device: { label: "Device", aria: "Device model", initial: "iPhone 13 Pro Max" },
    warranty: { label: "Warranty to", aria: "Warranty to", initial: "As agreed" },
  },
  sealAlt: "Rehan Traders tamper seal",
} as const

export const process = [
  { title: "Free check at the counter", text: "The shop tells you what is wrong, what it will cost and how long it will take. If you go ahead, your device goes on a numbered job card." },
  { title: "Repaired at the open bench", text: "The work happens at the bench in the shop. Ask to watch when it is not busy." },
  { title: "Tested and sealed", text: "Every repair is tested, then sealed in a pouch until you collect it." },
  // PRD §11 and Adnan, 31 Oct 2026: not every repair carries one. Never a length.
  { title: "Warranty, explained before you collect", text: "Once the fault is diagnosed or the job is confirmed, the shop tells you plainly whether the repair carries a warranty and on what terms. It depends on the repair, the model and the quality of parts you choose." },
] as const

export const faq = [
  {
    q: "Can you replace only the broken glass and keep my original display?",
    a: "Yes, when the display still works. Rehan Traders separates the cracked glass from the display under heat and vacuum and laminates new glass onto the display your phone came with. Lines, dark patches or no picture mean the panel itself is damaged and needs a screen replacement.",
  },
  {
    q: "Is checking my phone free?",
    a: `Yes. ${facts.check}`,
  },
  {
    q: "Do you give a warranty on repairs?",
    a: `It depends on the repair. ${facts.warranty}`,
  },
  {
    q: "How long does a phone repair take at Rehan Traders?",
    a: `${facts.turnaround} ${facts.turnaroundFold}`,
  },
  {
    q: "How long does a Galaxy Z Fold repair take?",
    a: "A Galaxy Z Fold repair at Rehan Traders, Hafeez Center, Lahore can take up to a day, depending on parts availability and how complex the model is.",
  },
  {
    q: "How do I get a price for my repair?",
    a: `Send photos of the device and its model on WhatsApp to ${site.phone.display}, or send the problem with photos through the form on the Get a Quote page, and Rehan Traders replies with a quote. You can also bring the device to Shop G-88, Ground Floor, Hafeez Center, Lahore.`,
  },
  {
    q: "Can I send my phone by courier from outside Lahore?",
    a: `Yes. Create a ticket on the website or call ${site.phone.display}, then send photos of the phone on WhatsApp. If possible, Rehan Traders quotes over the phone; otherwise you send the phone to Shop G-88, Hafeez Center, Lahore, where it is inspected and quoted, repaired once you agree, and sent back. ${facts.delivery}`,
  },
  {
    q: "Will my iPhone show \"Unknown Part\" after a battery change?",
    a: facts.battery,
  },
  {
    q: "Do you re-seal the phone after a repair?",
    a: `Yes, on request. ${facts.seal}`,
  },
  {
    q: "Can I watch my phone being repaired?",
    a: "Yes. Repairs happen at the open bench at Rehan Traders, Hafeez Center, Lahore, and you can ask to watch when the bench is not busy. You can also ask for your old parts back, except swollen batteries, which are disposed of straight away for safety.",
  },
  {
    q: "How can I pay?",
    a: "Rehan Traders accepts all payment methods: cash, card, JazzCash, EasyPaisa and bank transfer.",
  },
  {
    q: "Where is Rehan Traders and when is it open?",
    a: `Rehan Traders is at ${site.address.lines.join(", ")} ${site.address.postalCode}, Pakistan. It is open ${site.hours.oneLine}. ${site.hours.fridayBreak}. ${site.hours.holidays}.`,
  },
  {
    q: "My phone or tablet is broken. Where can I get it repaired in Lahore?",
    a: `Rehan Traders repairs phones and tablets at Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Gulberg III, Lahore: cracked glass, broken screens, Galaxy Z Fold and Flip, iPhone, iPad, batteries and charging, water damage and motherboard faults. Checking is free. Call or WhatsApp ${site.phone.display}, or walk in ${site.hours.oneLine}.`,
  },
] as const

/**
 * Broken-phone problems as people type them, in Pakistani English and Roman Urdu (plus Urdu script for llms.txt),
 * each mapped to the confirmed repair page that fixes it. Used by llms.txt and llms-full.txt. Only confirmed repairs:
 * speaker, microphone, overheating, buttons and software faults wait for Adnan (docs/launch/search-plan.md).
 */
export const problems = [
  { problem: "Cracked phone glass, display still works", says: ["mobile ki screen toot gayi", "sirf ooper wala glass toota hai", "touch glass change karwana hai"], urdu: "موبائل کی سکرین ٹوٹ گئی", service: "touch-glass-replacement" },
  { problem: "Touch not working", says: ["touch kaam nahi kar raha"], urdu: "ٹچ کام نہیں کر رہا", service: "touch-glass-replacement" },
  { problem: "Lines on the screen, black, green, pink or flickering display", says: ["screen pe lines aa gayi", "screen black ho gayi", "panel change karwana hai"], urdu: "سکرین پر لائنیں آ گئیں", service: "screen-replacement" },
  { problem: "Galaxy Z Fold or Z Flip inner screen, outer glass or hinge", says: ["Fold ki andar wali screen kharab ho gayi", "hinge tight ho gaya"], urdu: "فولڈ کی اندر والی سکرین خراب ہو گئی", service: "galaxy-z-fold-flip" },
  { problem: "Phone fell in water or got wet", says: ["phone pani mein gir gaya", "mobile geela ho gaya"], urdu: "فون پانی میں گر گیا", service: "water-damage-data-recovery" },
  { problem: "Photos and data needed from a dead or water-damaged phone", says: ["data wapas chahiye", "photos recover karni hain"], urdu: "ڈیٹا واپس چاہیے", service: "water-damage-data-recovery" },
  { problem: "Phone not charging or loose charging port", says: ["charging nahi ho rahi", "charger nahi lag raha"], urdu: "چارجنگ نہیں ہو رہی", service: "battery-charging" },
  { problem: "Battery drains fast or has swollen", says: ["battery jaldi khatam ho jati hai", "battery phool gayi"], urdu: "بیٹری جلدی ختم ہو جاتی ہے", service: "battery-charging" },
  { problem: "Phone dead, will not turn on", says: ["mobile on nahi ho raha", "set dead ho gaya"], urdu: "موبائل آن نہیں ہو رہا", service: "board-repair" },
  { problem: "No signal, no network or SIM not detected", says: ["SIM nahi chal rahi", "signal nahi aa rahe"], urdu: "سم نہیں چل رہی", service: "board-repair" },
  { problem: "Camera not working", says: ["camera kaam nahi kar raha"], urdu: "کیمرہ کام نہیں کر رہا", service: "board-repair" },
  { problem: "iPhone Face ID not working", says: ["Face ID kaam nahi kar raha"], urdu: "فیس آئی ڈی کام نہیں کر رہی", service: "iphone" },
  { problem: "iPhone back glass cracked", says: ["back glass toot gaya"], urdu: "بیک گلاس ٹوٹ گیا", service: "iphone" },
  { problem: "iPad glass or screen broken, iPad battery or charging", says: ["iPad ki screen toot gayi"], urdu: "آئی پیڈ کی سکرین ٹوٹ گئی", service: "ipad-tablet" },
] as const

export const visit = {
  title: "Visit Shop G-88",
  directions: "Ground Floor, Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore.", // TODO(adnan): confirm walking directions to G-88
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
    { label: "Sunday, Eid and Ashura", value: "Closed", days: [0] },
  ],
  courier: "Outside Lahore? We repair phones sent by courier.",
  courierLink: "See the four steps", // links to /courier
} as const

export const estimate = {
  title: "Find your issue",
  label: "Describe the problem",
  lede: "Describe it in your own words, add photos if you like, and the shop replies on WhatsApp with a quote.",
  placeholder: "My Fold's inner screen has a black line",
  submit: "Continue",
} as const

/** Homepage section copy, in PRD §5 order. */
export const home = {
  repairs: { title: "What we repair" },
  beforeAfter: {
    // TODO(adnan): real before-and-after pair from a finished job (PRD §12 q6). Hidden until then; set true with the real images.
    show: false as boolean,
    title: "Same phone, new glass.",
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
    summary: "on Google",
  },
  pricing: {
    title: "How pricing works",
    points: [
      { title: "Parts prices change daily", text: "A price list online would be wrong by tomorrow, so your repair is priced on the day." },
      { title: "The check is free", text: "The shop tells you what is wrong, whether it can be repaired, what it will cost and how long it will take." },
      { title: "You hear the price first", text: "No work starts until you know the cost." },
      { title: "You decide", text: "Go ahead, or take your phone back. The check costs nothing either way." },
    ],
  },
  bench: {
    title: "The open bench",
    lede: "Your phone is repaired at the open bench in Shop G-88, which has a microscope for board work.",
    points: [
      { title: "Watch it happen", text: "Ask to watch when the bench is not busy." },
      { title: "Get your old parts back", text: "Ask for them if you want them. Swollen batteries are the exception: the shop disposes of them safely straight away." },
      { title: "Numbered and sealed", text: "Your device goes on a numbered job card. The finished repair is tested and sealed in a pouch." },
    ],
    owner: {
      name: "Adnan Ali",
      role: "Owner",
      text: "Rehan Traders has repaired phones since 2009.",
      alt: "Adnan Ali, owner of Rehan Traders",
      more: "About the shop",
    },
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
    { label: "Send by courier", href: "/courier" },
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

export const breadcrumbs = {
  home: "Home",
  repairs: "Repairs",
  reviews: "Reviews",
  visit: "Visit",
  faq: "Questions",
  courier: "Courier",
  about: "About",
  privacy: "Privacy",
  terms: "Terms",
  label: "Breadcrumbs",
} as const

export const repairsPage = {
  title: "Repairs",
  lede: "Phone and tablet repairs at Shop G-88, Hafeez Center, Lahore. Every repair starts with a free check, and when only the glass is cracked, only the glass is replaced.",
  problemsTitle: "What's wrong with your phone?",
  whatWeFix: "What we fix",
  howItWorks: "How it works",
  faqTitle: "Questions about this repair",
  relatedTitle: "Related repairs",
  bookHeading: "Need this repair?",
  bookLede: "Book a visit to Shop G-88 or ask for a quote on WhatsApp.",
  allRepairsLede: "Select a repair below to see what we fix, how the repair works, and book your visit.",
  priceTitle: "Price",
} as const

export const reviewsPage = {
  title: "Customer reviews",
  lede: "Reviews that customers of Rehan Traders, Shop G-88, Hafeez Center, left on Google.",
  viewOnGoogle: "View on Google Maps",
  readAllOnGoogle: "Read reviews on Google Maps",
  googleReview: "Google review",
  carouselLabel: "Customer reviews, use the left and right arrow keys to move between them",
  carouselRole: "carousel",
  prev: "Previous review",
  next: "Next review",
  counter: (n: number, total: number) => `${n} of ${total}`,
  starSummary: (rating: number) => `${rating.toFixed(1)} out of 5 stars on Google`,
} as const

export const visitPage = {
  title: "Visit Shop G-88",
  lede: "Rehan Traders is at Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore 54660, Pakistan.",
  directionsTitle: "How to find Shop G-88",
  floorLabel: "Floor",
  floorValue: "Ground Floor",
  shopLabel: "Shop number",
  shopValue: "Shop G-88",
  buildingLabel: "Building",
  buildingValue: "Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore",
  entranceLabel: "Entrance",
  entranceValue: "Shop G-88 is on the ground floor of Hafeez Center, Main Boulevard.", // TODO(adnan): confirm the entrance and walking route
  landmarksLabel: "Landmarks",
  landmarksValue: null as string | null, // TODO(adnan): confirm exact walking landmarks and entrance gate. Hidden while null.
  hoursTitle: "Shop hours",
  mapPrompt: "Tap to load interactive Google Map",
  mapLoading: "Loading map…",
  mapAlt: "Rehan Traders storefront at Hafeez Center",
  courierTitle: "Can I send my phone by courier from outside Lahore?",
  courierLede: "Yes. Rehan Traders repairs phones sent by courier from outside Lahore. It takes four steps.",
  courierSteps: [
    { title: "Create a ticket", text: `Create a ticket on this website, or call ${site.phone.display}.` },
    { title: "Send photos", text: "Send photos of the phone on WhatsApp." },
    { title: "Quote by phone", text: "If possible, we give you a quote over the phone." },
    { title: "Inspect, repair, return", text: "Otherwise you send the phone, we inspect it and quote, repair it once you agree, and send it back." },
  ],
  courierDelivery: delivery,
  courierActions: { ticket: "Create a ticket", whatsapp: "Send photos on WhatsApp", call: `Call ${site.phone.display}` },
  courierMore: "How courier repairs work",
} as const

/** The /courier page. Steps, delivery line and actions are the ones /visit#courier shows (Adnan, 30 Oct 2026). */
export const courierPage = {
  title: "Send your phone by courier",
  lede: "Live outside Lahore? Rehan Traders, Shop G-88, Hafeez Center, Lahore repairs phones sent by courier from anywhere in Pakistan. It takes four steps.",
  stepsTitle: "The four steps",
  faqTitle: "Courier questions",
  faq: [
    {
      q: "Can I send my phone by courier from outside Lahore?",
      a: `Yes. Create a ticket on the website or call ${site.phone.display}, then send photos of the phone on WhatsApp. If possible, Rehan Traders quotes over the phone; otherwise you send the phone to Shop G-88, Hafeez Center, Lahore, where it is inspected and quoted, repaired once you agree, and sent back.`,
    },
    {
      q: "How do I send the phone to Rehan Traders?",
      a: facts.delivery,
    },
    {
      q: "Do I agree to the price before the repair?",
      a: "Yes. If a quote over the phone is not possible, Rehan Traders inspects the phone, gives you a quote, and repairs it once you agree.",
    },
    {
      q: "How do I start a courier repair?",
      a: `Create a ticket on this website or call ${site.phone.display}, and send photos of the phone on WhatsApp.`,
    },
  ],
} as const

export const faqPage = {
  title: "Frequently asked questions",
  lede: "Plain answers about repairs, quotes, warranty, repair time and visiting Shop G-88, Hafeez Center.",
  generalTitle: "General questions",
  serviceTitle: "Service questions",
  stillHaveQuestions: "Have a question not answered here?",
  askWhatsApp: "Ask on WhatsApp",
} as const

export const aboutPage = {
  title: "About Rehan Traders",
  lede: `${site.entity} Hafeez Center is Lahore's phone market, and getting a reliable repair there can be confusing. The shop's aim is to make repairing easy.`,
  sinceTitle: "Since 2009",
  sinceText: "Rehan Traders has repaired phones since 2009. Every job starts with a free check: the shop tells you plainly what is wrong, whether it can be fixed, what it will cost and how long it will take. Then you decide.",
  benchTitle: "The open repair bench",
  benchText: "Repairs happen at the open bench in Shop G-88, which has a microscope for board work. Ask to watch when the bench is not busy, and ask for your old parts back if you want them. Swollen batteries are the exception: the shop disposes of them straight away.",
  adnanTitle: "Adnan Ali",
  adnanRole: "Owner", // Adnan, PRD §11; his title as a technician is not confirmed
  adnanText: "The shop is run by its owner, Adnan Ali. Saving the customer's damaged panel is the shop's main priority.",
  panelTitle: "We try to save your panel, and your money, first",
  panelText: "When the glass is cracked but the display still works, the shop separates the cracked glass under heat and vacuum and replaces the glass alone. The display your phone came with stays, and you pay for glass rather than a new screen. When the panel itself is damaged, the shop tells you that plainly too.",
  processTitle: "The job card process",
  processText: "Every repair follows the same four steps.",
  processSteps: [
    { step: "01", title: "Job card intake", text: "Your device and fault are recorded on a numbered job card at the counter." },
    { step: "02", title: "Open bench repair", text: "Work happens at the open bench in the shop." },
    { step: "03", title: "Testing and sealing", text: "The repair is tested, then sealed in a protective pouch." },
    { step: "04", title: "Handover", text: "You collect your sealed phone with the completed job card." },
  ],
  images: {
    bench: "microscope-bench",
    benchAlt: "Technician working at the microscope repair bench in Shop G-88",
    team: "workbench-team",
    teamAlt: "Rehan Traders repair workbench in Hafeez Center",
  },
} as const

export const privacyPage = {
  title: "Privacy policy",
  lede: "Plain English explanation of what information we collect and how we handle it.",
  lastUpdated: "Last updated: 29 October 2026",
  sections: [
    {
      title: "Booking information",
      text: "When you book a visit or request a quote, we collect your name, Pakistani mobile number, device model, and reported fault. You can optionally attach photos of the broken device.",
    },
    {
      title: "How your data is used",
      text: "Your contact details are used solely to create your repair job card, provide a price quote, and coordinate your visit. We do not sell, rent, or share personal information with third-party advertisers.",
    },
    {
      title: "AI chat data",
      // The providers' own terms decide whether they keep or train on what they receive, so this text promises nothing about that.
      text: "When you use the chat assistant, your message is sent to AI providers (Anthropic through OpenRouter, Google AI Studio and Groq) to write a reply. This site does not store these messages. Do not type your name, number or other private details into them.",
    },
    {
      title: "Data storage and security",
      // Access: Adnan, 31 Oct 2026
      text: "A booking is saved in the shop's Google Sheet and emailed to the shop, and any photos you attach are saved in the shop's Google Drive. Only Adnan Ali and the shop's technical team can open them. The shop uses them to manage repair job numbers (RT-####).",
    },
    {
      title: "Contact regarding your data",
      text: "You can request to view or delete your contact records by emailing rehanmobiletraders@gmail.com or calling 0305 8874839.",
    },
  ],
} as const

export const termsPage = {
  title: "Terms of service",
  lede: "Plain English terms covering repair bookings, estimates, bench services, and collection.",
  lastUpdated: "Last updated: 29 October 2026",
  sections: [
    {
      title: "Estimates and bench inspection",
      text: "Online estimates and quotes are initial assessments based on customer descriptions. Final repair feasibility and pricing depend on physical inspection of the device at the bench.",
    },
    {
      title: "Data backup and customer responsibility",
      text: "Customers are advised to back up all personal data before handing over any device. While we take care and offer data recovery, preexisting hardware damage or liquid corrosion can affect data integrity.",
    },
    {
      title: "Replaced parts and safe disposal",
      text: "Replaced parts can be returned to the customer on request when safe. Swollen, punctured, or hazardous batteries are disposed of immediately for safety reasons and cannot be returned.",
    },
    {
      title: "Accepted payment methods",
      text: "Payment is due upon completion of the repair. We accept cash, direct bank transfer, debit and credit cards, JazzCash, and EasyPaisa.",
    },
    {
      title: "Device collection with job card",
      text: "Repaired devices are returned upon presentation of the numbered job card issued at intake. Customers should collect completed devices promptly upon notification.",
    },
  ],
} as const

export const states = {
  error: {
    title: "Something went wrong",
    lede: "This page did not load. Try again, or contact the shop directly.",
    retry: "Try again",
    whatsapp: "Message on WhatsApp",
    call: "Call 0305 8874839",
  },
  loading: {
    text: "Loading…",
  },
  notFound: {
    title: "Page not found",
    code: "404",
    lede: "This page does not exist or has moved.",
    home: "Back to home",
    repairs: "View all repairs",
  },
} as const

export const seo = {
  home: {
    title: "Rehan Traders · Mobile repair at Hafeez Center, Lahore",
    description:
      "Phone and tablet repair at Shop G-88, Hafeez Center, Lahore. Free checking, touch glass replacement with your display kept, Galaxy Z Fold and Flip, iPhone.",
  },
  titleTemplate: "%s · Rehan Traders",
  /** Alt text for the share image; keep in step with src/app/opengraph-image.alt.txt. */
  shareImageAlt: "Rehan Traders, Mobile & Tab Repair Lab, Shop G-88, Hafeez Center, Lahore",
  book: {
    title: "Book a phone repair visit in Lahore",
    description: "Book a phone or tablet repair visit to Rehan Traders, Shop G-88, Hafeez Center, Lahore. Pick your device, the fault and a time. No account needed.",
  },
  bookConfirmed: { title: "Booking confirmed", description: "Your Rehan Traders booking." },
  repairs: {
    title: "Phone and tablet repair, Hafeez Center Lahore",
    description: "Cracked glass, broken screens, Galaxy Z Fold and Flip, iPhone, iPad, batteries, charging, water damage and motherboard repair at Shop G-88, Hafeez Center, Lahore.",
  },
  reviews: {
    title: "Phone repair reviews, Hafeez Center Lahore",
    description: `Customer reviews for Rehan Traders, the phone repair shop at G-88, Hafeez Center, Lahore: ${googleRating.toFixed(1)} on Google. Reviews copied from Google as written.`,
  },
  visit: {
    title: "Visit Shop G-88, Hafeez Center, Lahore",
    description: "Rehan Traders, Shop G-88, Ground Floor, Hafeez Center, Main Boulevard, Block E1, Gulberg III, Lahore. Monday to Saturday 11 AM to 10 PM, Friday break 1 to 2 PM.",
  },
  courier: {
    title: "Phone repair by courier, from outside Lahore",
    description: "Send your phone by courier for repair from anywhere in Pakistan. Rehan Traders, Shop G-88, Hafeez Center, Lahore inspects it, quotes, repairs it once you agree and sends it back.",
  },
  faq: {
    title: "Phone repair questions, Hafeez Center Lahore",
    description: "Phone repair questions answered plainly: free checking, warranty, repair time, quotes and courier repairs at Rehan Traders, Shop G-88, Hafeez Center, Lahore.",
  },
  about: {
    title: "About the shop at Hafeez Center, Lahore",
    description: "Rehan Traders, Shop G-88, Hafeez Center, has repaired phones since 2009. Run by Adnan Ali, the shop tries to save your panel, and your money, first.",
  },
  privacy: {
    title: "Privacy policy for phone repair bookings",
    description: "Privacy policy for Rehan Traders, Hafeez Center, Lahore. How phone repair booking, estimate and chat information is handled, in plain English.",
  },
  terms: {
    title: "Terms of service for phone repairs",
    description: "Terms of service for phone and tablet repair bookings, estimates, bench services and collection at Rehan Traders, Hafeez Center, Lahore.",
  },
  /** Service pages use each service's own `seo` (problem, Hafeez Center, Lahore). */
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
  skipToContent: "Skip to content",
  search: "Search",
  noResults: "No results",
  stars: (rating: number) => `${rating} out of 5 stars`,
  externalLink: "opens in a new tab",
  /** alt for images that only repeat nearby text (reviewer avatars next to the name). */
  decorative: "",
  toastSent: "Request sent",
  breadcrumbHome: "Home",
  breadcrumbRepairs: "Repairs",
  breadcrumbLabel: "Breadcrumbs",
  loading: "Loading content",
  retry: "Try again",
  backHome: "Back to home",
  viewAllRepairs: "View all repairs",
  mapPin: "Location pin",
  step: "Step",
  backToRepairs: "Back to all repairs",
  tapToLoadMap: "Tap to load interactive map",
  disclaimerReviews: "Reviews are copied directly from our public Google Business Profile without edits.",
} as const

// ─── Phase 6: chat assistant and repair estimator ─────────────────────────────────────────────────────────
// Kept in one block at the end so it merges cleanly with Phase 7's inner-page copy.
// The assistant's knowledge is built from the exports above (src/lib/assistant.ts); nothing here adds facts.

export const assistant = {
  title: chat.launcher,
  greeting: chat.greeting,
  /** Shown when every model is down, the turn cap is hit, or the reply breaks off. */
  fallback: chat.fallback,
  limit: "That's all this chat can take. Message the shop on WhatsApp or call to continue.",
  disclosure: "Answers come from this site only. For a price or anything else, the shop replies on WhatsApp.",
  input: "Your question",
  placeholder: "Type in English or Urdu",
  send: "Send",
  typing: "Typing",
  tooLong: (max: number) => `Keep it under ${max} characters.`,
  you: "You",
  shop: site.name,
  /** First quick replies, before the model suggests its own. */
  chips: ["Fold inner screen?", "Touch glass price?", "Opening hours?", "Where is G-88?"],
  actions: { book: actions.book, whatsapp: actions.whatsapp, call: actions.call },
  whatsappText: "Assalam o alaikum. I have a question about a repair.",
  /** The "custom form" link inside a reply: the Describe it tab (name, number, device, message, photos). */
  formHref: "/quote?tab=describe",
} as const

