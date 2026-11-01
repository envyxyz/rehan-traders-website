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
} as const

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
    "Rehan Traders discusses warranty at the counter. Whether a repair carries one, and its terms, depends on the model, the type of repair and the quality of parts you choose.",
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
  quote: `Send photos of the phone and its model on WhatsApp to ${site.phone.display}, or create a ticket with photos on the Repair estimate page of this website. You can also visit Rehan Traders at Shop G-88, Ground Floor, Hafeez Center, Lahore. The shop replies with a quote; prices are not published online.`,
} as const

// Typed in by hand (static site, no Places API). Update rating, count and asOf together.
// Review text copied on 29 Oct 2026 from the public Google reviews panel (signed out): 50 ratings then, 49 on 31 Oct, 32 with text (the other 18 are
// stars only and are left out). Text exactly as written; `date` is Google's relative date as of `asOf`. Ameer's own
// review is left out: the agency should not review its client. `weight` (3 clear English naming the repair, 2 clear
// praise, 1 short or vague) makes the clearest ones come up most often in the random 10 shown per visit.
export const reviews = {
  rating: 4.9,
  count: 49,
  asOf: "2026-10-31",
  asOfLabel: "31 October 2026",
  // The listing page shows every review. The write-a-review link (https://g.page/r/CUvWWzrw4sFhEBE/review) is for
  // QR cards and WhatsApp follow-ups, not for "Read reviews".
  url: site.mapsUrl,
  /** Reviews shown per visit, drawn at random (weighted) from `items`. */
  show: 10,
  items: [
    { author: "Haadi O.", rating: 5, date: "6 months ago", weight: 3, text: "Mr Rehan was very honest and helped me fixed my andriod s22 ultra which was ocean water damaged. He is expert in iphone so he recommended me to proper person and didn't charge me anything. My phone data was recovered." },
    { author: "Asil M.", rating: 5, date: "a year ago", weight: 3, text: "Highly impressed with the mobile repair service here Fast, reliable, and professional my phone feels brand new again. Definitely the go-to spot for any mobile issues.Mr Adnan is very cooperative and humble person really impressed" },
    { author: "Hassnain T.", rating: 5, date: "5 months ago", weight: 3, text: "I recently got my phone repair. Very professional extremely happy with the services of Rehan Trader" },
    { author: "Zunair K.", rating: 5, date: "4 months ago", weight: 3, text: "I repaired my fold4 blank display.Good job🥰😍🥰" },
    { author: "Faizan I.", rating: 5, date: "6 days ago", weight: 3, text: "Very good service just repaired my 14 pro max" },
    { author: "M. Arsim Z.", rating: 5, date: "a year ago", weight: 3, text: "Good overall service. They only do the necessary work which needs to be done and nothing extra." },
    { author: "Farooq A.", rating: 5, date: "a month ago", weight: 3, text: "Visited second time, more reliable, satisfactory, honest services. God bless you dear" },
    { author: "Rao S.", rating: 5, date: "2 days ago", weight: 3, text: "Honest, fair and expert at what they do." },
    { author: "Farwah W.", rating: 5, date: "4 months ago", weight: 3, text: "Best Lab in the Entire Hafeez Centre for Mobile repair. Thumbs up 👍" },
    { author: "Junaid B.", rating: 5, date: "a year ago", weight: 3, text: "Iphone and samsung front glass specialist" },
    { author: "Salman S.", rating: 5, date: "a year ago", weight: 2, text: "Rehan trader is very good repairing center . He is very coprative and honest people. All employees very good trained." },
    { author: "Shoaib M.", rating: 5, date: "a month ago", weight: 2, text: "Very much satisfied from their customer services." },
    { author: "Aqsa I.", rating: 5, date: "9 months ago", weight: 2, text: "Wonderful people professional and experienced polite and humble no doubt\n\nALLAH Khush Rakhe Ameen" },
    { author: "Mian Haider M.", rating: 5, date: "a year ago", weight: 2, text: "Highly professional and reasonable services" },
    { author: "Bilal R.", rating: 5, date: "a week ago", weight: 2, text: "Best repairing center in lahore" },
    { author: "Emraan K.", rating: 5, date: "5 months ago", weight: 2, text: "Best repairing shop in Hafeez centre" },
    { author: "Muhammad A.", rating: 5, date: "a year ago", weight: 2, text: "\"I had a great experience at Mobile Repairing. The staff was very friendly and helpful. They were able to answer all of my questions and help me find the right phone for my needs. I was especially impressed with the staff's politeness and professionalism. I would highly recommend mobile repairing to anyone looking for a new phone.\"" },
    { author: "Xhah A.", rating: 5, date: "a month ago", weight: 2, text: "google pixel fold 9 pro display problem mai tha display problem adnan bhai ny bht sy professional tareeky sy repair kiya or mera same panel repair kiya" },
    { author: "Ali R.", rating: 5, date: "4 months ago", weight: 2, text: "men ne apna fold7 repaire kraya very pfrofesional" },
    { author: "Adnan F.", rating: 5, date: "6 months ago", weight: 2, text: "Hum na  Rehan traders phone repair kariya hai fold 4 blank display fix kariya both acha Kam Kya unhe bundle of thanks price be boht best market saw ache" },
    { author: "Ahmad S.", rating: 5, date: "a year ago", weight: 1, text: "Best service... satisfied\nMust recommend ♥️" },
    { author: "Zain C.", rating: 5, date: "a year ago", weight: 1, text: "Good Service\nRecommended" },
    { author: "Uzze B.", rating: 5, date: "a month ago", weight: 1, text: "Excellent services of repair" },
    { author: "Yasir A.", rating: 4, date: "2 years ago", weight: 1, text: "Offer variety of mobile reparations." },
    { author: "Urooj F.", rating: 5, date: "2 weeks ago", weight: 1, text: "Good service" },
    { author: "Golden J.", rating: 5, date: "6 months ago", weight: 1, text: "Very nice staff" },
    { author: "Usman A.", rating: 5, date: "a year ago", weight: 1, text: "Very good" },
    { author: "Husnain J.", rating: 5, date: "3 years ago", weight: 1, text: "Very good" },
    { author: "NAQi Z.", rating: 5, date: "a month ago", weight: 1, text: "Grateful" },
    { author: "Danish K.", rating: 5, date: "2 years ago", weight: 1, text: "Rauf Good" },
    { author: "Muhammad U.", rating: 2, date: "6 months ago", weight: 1, text: "Average" },
  ],
} as const

export const nav = {
  links: [
    { label: "Repairs", href: "/repairs" },
    { label: "Estimate", href: "/estimate" },
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
  /** On repair cards, repair pages and the estimate result: names the free check at the counter, the first step of every repair. */
  bookRepair: "Book a free check",
  whatsapp: "WhatsApp",
  // Starts with the visible "WhatsApp" (WCAG 2.5.3 label in name).
  whatsappLabel: `WhatsApp, chat on ${site.phone.display}`,
  call: "Call",
  directions: "Directions",
  allRepairs: "All repairs",
  readReviews: "Read all reviews on Google",
  allQuestions: "All questions",
  /** Phase 5: the button on the booking form / page opened by "Book a free check", and its success message. */
  getQuote: "Get a quote",
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
  faq: { q: string; a: string }[]
  howItWorks: { step: string; title: string; text: string }[]
  related: string[]
  /** Search title and description: the problem, then Hafeez Center and Lahore. */
  seo: { title: string; description: string }
}

// Images arrive in Phase 2 (public/images); until then cards show a placeholder surface. Prices stay unset while priceMode is "quote".
export const services: Service[] = [
  {
    slug: "touch-glass-replacement",
    title: "Touch glass replacement",
    short: "Cracked glass replaced on its own. Your original display stays.",
    long: "Rehan Traders first checks that the display under the cracked glass still works. If it does, the glass is separated from the display under heat and vacuum and new glass is laminated on. You keep the display your phone came with and pay for new glass, not a whole new screen.",
    faults: ["Cracked glass", "Scratched glass", "Touch not working"],
    image: "glass-separation",
    howItWorks: [
      { step: "01", title: "Free check", text: "We check the display under the glass for black spots or colored lines." },
      { step: "02", title: "Glass separation", text: "Under heat and vacuum, the cracked outer glass is separated from the display." },
      { step: "03", title: "Lamination", text: "A fresh glass layer is aligned and laminated to your original display panel." },
      { step: "04", title: "Testing and pouch", text: "Touch is tested across the whole screen, then the phone is sealed in a pouch." },
    ],
    faq: [
      { q: "Will my original display be kept?", a: "Yes. Touch glass replacement keeps the display your phone came with. Only the cracked outer glass is changed." },
      { q: "What if the screen has black spots or colored lines?", a: "Lines or dark patches mean the panel under the glass is damaged, and the phone needs a screen replacement instead. The free check at Rehan Traders tells you which one your phone needs." },
      { q: "Can I watch the glass replacement at the bench?", a: "Yes, on request, when the bench is not busy." },
      { q: "My phone screen is cracked (mobile ki screen toot gayi). Can only the glass be changed?", a: "Yes, if the display under the cracked glass still works. Rehan Traders, Shop G-88, Hafeez Center, Lahore checks it free of cost, separates the cracked glass under heat and vacuum and laminates new glass on, so your original display stays. If the screen shows lines or dark patches, it needs a screen replacement instead." },
      { q: "Touch is not working after a fall (touch kaam nahi kar raha). What does my phone need?", a: "The free check at Rehan Traders, Hafeez Center, Lahore tells you whether new touch glass fixes it or whether the screen itself has to be replaced, and what it will cost." },
      { q: "How much does touch glass replacement cost in Lahore?", a: `It depends on the model, so prices are not published online. Send the model and a photo of the screen on WhatsApp to ${site.phone.display} and Rehan Traders replies with a quote, or bring the phone to Shop G-88, Hafeez Center, where checking is free.` },
    ],
    related: ["screen-replacement", "galaxy-z-fold-flip", "iphone"],
    seo: {
      title: "Touch glass replacement, Hafeez Center Lahore",
      description: `Cracked phone glass? Rehan Traders replaces only the glass and keeps your original display. Shop G-88, Hafeez Center, Lahore. Free checking: ${site.phone.display}.`,
    },
  },
  {
    slug: "galaxy-z-fold-flip",
    title: "Galaxy Z Fold and Flip",
    short: "Outer glass, inner screen and hinge for every Galaxy Z Fold and Z Flip.",
    long: "Outer glass, inner screen and hinge repairs for every Galaxy Z Fold and Z Flip, plus Pixel Fold and Surface Duo. The shop tries to save the damaged panel first and replaces it only when it cannot be saved.",
    faults: ["Outer glass", "Inner screen", "Hinge", "Blank display", "Lines on screen"],
    image: "fold-inner-panel",
    howItWorks: [
      { step: "01", title: "Hinge and display inspection", text: "We inspect hinge tension, frame alignment, and inner flexible panel condition." },
      { step: "02", title: "Panel recovery priority", text: "We try to save the original inner screen before replacing it." },
      { step: "03", title: "Bench repair", text: "Outer glass, inner panel connections, or hinge mechanisms are repaired at the open bench." },
      { step: "04", title: "Folding test and pouch", text: "We verify opening angles and touch response across the fold line before sealing." },
    ],
    faq: [
      { q: "Which Fold and Flip models do you repair?", a: "We repair every Samsung Galaxy Z Fold and Galaxy Z Flip generation, Pixel Fold, and Surface Duo." },
      { q: "Can a blank inner screen be saved without full replacement?", a: "It depends on the fault. Rehan Traders checks the phone free of cost and tries to save the inner panel before replacing it. If it cannot be saved, the shop tells you plainly." },
      { q: "Do you repair stiff or stuck hinges?", a: "Yes. Rehan Traders repairs Galaxy Z Fold and Z Flip hinges at the bench." },
      { q: "How long does a Galaxy Z Fold repair take?", a: "A Galaxy Z Fold repair can take up to a day, depending on the repair, parts availability and the model." },
      { q: "My Galaxy Z Fold inner screen has a line or went black (Fold ki andar wali screen kharab ho gayi). Can it be fixed?", a: "Bring it in for the free check at Rehan Traders, Shop G-88, Hafeez Center, Lahore. The shop tries to save the inner panel before replacing it, and tells you plainly what is wrong, what it will cost and how long it will take." },
      { q: "My Galaxy Z Flip or Z Fold outer glass is cracked. Do you replace it?", a: "Yes. Rehan Traders replaces the outer glass on every Galaxy Z Fold and Z Flip generation at the bench in Hafeez Center, Lahore." },
    ],
    related: ["touch-glass-replacement", "screen-replacement", "board-repair"],
    seo: {
      title: "Galaxy Z Fold and Flip repair, Hafeez Center Lahore",
      description: "Fold inner screen black or lined, cracked outer glass or a stiff hinge? Every Galaxy Z Fold and Z Flip repaired at Shop G-88, Hafeez Center, Lahore. Free checking.",
    },
  },
  {
    slug: "iphone",
    title: "iPhone repair",
    short: "Screen, back glass, Face ID, battery and charging.",
    long: "iPhone screens, back glass, Face ID, batteries, cameras and charging faults, fixed at the open bench.",
    faults: ["Screen", "Back glass", "Face ID", "Battery", "Charging", "Camera"],
    image: "iphone-back-glass",
    howItWorks: [
      { step: "01", title: "Diagnostic check", text: "We test Face ID, display, battery health, and cameras on the job card." },
      { step: "02", title: "Bench repair", text: "Screens, back glass, battery swaps, or board faults are worked on at the bench." },
      { step: "03", title: "Function check", text: "Touch and sensors are checked after the repair." },
      { step: "04", title: "Testing and sealing", text: "Every repaired iPhone is tested and placed in a protective pouch for collection." },
    ],
    faq: [
      { q: "Can you replace cracked iPhone back glass?", a: "Yes. We remove the broken back glass and install new glass at the bench." },
      { q: "Do you fix Face ID faults?", a: "Yes. Face ID sensors and dot projector faults are diagnosed under the microscope." },
      { q: "Can I get my old parts back?", a: "Yes, on request, provided the part is safe to return. Swollen batteries are disposed of immediately." },
      { q: "Will my iPhone show \"Unknown Part\" after a battery change?", a: facts.battery },
      { q: "My iPhone screen is broken. Do you repair iPhone screens in Lahore?", a: "Yes. At Shop G-88, Hafeez Center, Lahore, Rehan Traders checks the iPhone free of cost. If only the glass is cracked and the display works, the glass is replaced on its own and the display stays. If the display is damaged, the screen is replaced." },
      { q: "My iPhone back glass is cracked (back glass toot gaya). Can it be replaced?", a: "Yes. Rehan Traders removes the broken back glass and fits new glass at the bench in Hafeez Center, Lahore." },
    ],
    related: ["touch-glass-replacement", "battery-charging", "board-repair"],
    seo: {
      title: "iPhone repair, Hafeez Center Lahore",
      description: `Broken iPhone screen, cracked back glass, Face ID, battery or charging fault? Repaired at Shop G-88, Hafeez Center, Lahore. Free checking. WhatsApp ${site.phone.display}.`,
    },
  },
  {
    slug: "screen-replacement",
    title: "Screen replacement",
    short: "Lines, black, green or flickering screens replaced.",
    long: "When the display itself is damaged, with lines, a pink or green screen, a black or blank display or flicker, the screen is replaced. If only the glass is cracked, touch glass replacement keeps your original display instead.",
    faults: ["Lines on screen", "Black or blank display", "Green or white screen", "Flickering"],
    image: "screen-replacement", // no Phase 2 job yet: shows the placeholder,
    howItWorks: [
      { step: "01", title: "Panel assessment", text: "We confirm whether the fault is in the display panel or motherboard output." },
      { step: "02", title: "Screen removal", text: "The damaged screen is taken off at the bench." },
      { step: "03", title: "New screen fitted", text: "The new screen is fitted and connected." },
      { step: "04", title: "Display testing and pouch", text: "Brightness, touch response, and color balance are checked before sealing." },
    ],
    faq: [
      { q: "When do I need a full screen replacement instead of touch glass?", a: "Full replacement is required when the screen has colored lines, black bleed, green tint, or no picture." },
      { q: "Do you repair both iPhone and Android displays?", a: "Yes. We replace screens on iPhone, Samsung, Google Pixel, OnePlus, and other brands." },
      { q: "How can I get a quote for my screen?", a: `Send your exact model and a photo of the screen on WhatsApp to ${site.phone.display}, and the shop replies with a quote. Checking at the shop is free.` },
      { q: "How long does a screen replacement take?", a: "A normal screen change at Rehan Traders can take as little as 60 minutes, depending on parts and the model." },
      { q: "My phone screen has lines or went black (screen pe lines aa gayi, screen black ho gayi). What do I need?", a: "Lines, a green or pink tint, flicker or a black screen usually mean the display itself is damaged, and it needs a screen replacement. The free check at Rehan Traders, Shop G-88, Hafeez Center, Lahore confirms whether the fault is in the screen or the motherboard before anything is replaced." },
    ],
    related: ["touch-glass-replacement", "galaxy-z-fold-flip", "water-damage-data-recovery"],
    seo: {
      title: "Phone screen replacement, Hafeez Center Lahore",
      description: "Lines on the screen, a black, green or flickering display? Rehan Traders replaces phone screens at Shop G-88, Hafeez Center, Lahore. Free checking first.",
    },
  },
  {
    slug: "battery-charging",
    title: "Battery and charging",
    short: "Batteries that drain fast and ports that will not charge.",
    long: "Battery replacement and charging port repair. Swollen batteries are removed and disposed of safely.",
    faults: ["Battery drains fast", "Swollen battery", "Not charging", "Loose charging port"],
    image: "battery-swap",
    howItWorks: [
      { step: "01", title: "Power testing", text: "We measure current draw, charging rate, and battery degradation at the bench." },
      { step: "02", title: "Component repair", text: "Degraded batteries or damaged charging flex boards are replaced." },
      { step: "03", title: "Thermal and voltage check", text: "The device is charged and monitored for stable voltage and temperature." },
      { step: "04", title: "Safe disposal and pouch", text: "Swollen batteries are disposed of safely straight away, and the phone is sealed in a pouch." },
    ],
    faq: [
      { q: "What do you do with swollen batteries?", a: "Swollen batteries are removed carefully and disposed of straight away for safety." },
      { q: "Can a loose charging port be repaired without replacement?", a: "We clean compacted lint and dust first. If the pins are broken, we replace the port." },
      { q: "Can I take my old battery home?", a: "Yes, on request, as long as the battery is not swollen or leaking." },
      { q: "Will my iPhone show \"Unknown Part\" after a battery change?", a: facts.battery },
      { q: "My phone is not charging (charging nahi ho rahi). Can you fix it?", a: "Yes. At Rehan Traders, Hafeez Center, Lahore, a charging port packed with lint is cleaned first; if its pins are broken, the port is replaced. If the fault is the battery or the board, the free check tells you." },
      { q: "My battery drains fast or has swollen (battery jaldi khatam ho jati hai, battery phool gayi). What should I do?", a: "Stop charging a swollen battery and bring the phone to Shop G-88, Hafeez Center, Lahore. Rehan Traders replaces the battery, and a swollen battery is removed and disposed of safely straight away." },
    ],
    related: ["iphone", "board-repair", "ipad-tablet"],
    seo: {
      title: "Battery and charging repair, Hafeez Center Lahore",
      description: `Phone not charging, battery draining fast or swollen? Battery and charging port repair at Shop G-88, Hafeez Center, Lahore. Free checking: ${site.phone.display}.`,
    },
  },
  {
    slug: "water-damage-data-recovery",
    title: "Water damage and data recovery",
    short: "Wet or dead phones cleaned, repaired and your data recovered.",
    long: "Liquid-damaged and dead phones are opened, cleaned and repaired at board level, with your data recovered first where possible.",
    faults: ["Water damage", "Phone will not turn on", "Data recovery"],
    image: "wet-board-cleaning",
    howItWorks: [
      { step: "01", title: "Immediate intake", text: "The phone is opened immediately and the battery disconnected to halt short circuits." },
      { step: "02", title: "Corrosion cleaning", text: "Mineral deposits and liquid corrosion are cleaned from the board." },
      { step: "03", title: "Data recovery priority", text: "Power rails are restored under the microscope to recover photos and files first." },
      { step: "04", title: "Board testing", text: "Circuits are checked for short circuits before final assembly." },
    ],
    faq: [
      { q: "My phone fell in water (phone pani mein gir gaya). What should I do?", a: "Turn it off straight away and do not connect a charger. Bring it to Shop G-88, Hafeez Center, as soon as you can." },
      { q: "My phone is dead after water damage. Can my photos and data be recovered?", a: "It depends on the damage. Rehan Traders checks the board first and tries to get your data back. The free check tells you what can be saved." },
      { q: "How long does a water damage repair take?", a: "It depends on how severe the damage is: anywhere from 8 hours to several days. Data recovery time also depends on the phone's condition." }, // Adnan, 31 Oct 2026
    ],
    related: ["board-repair", "screen-replacement", "battery-charging"],
    seo: {
      title: "Water damaged phone repair, Hafeez Center Lahore",
      description: "Phone fell in water or will not turn on? Turn it off, do not charge it, and bring it to Shop G-88, Hafeez Center, Lahore for cleaning, repair and data recovery.",
    },
  },
  {
    slug: "board-repair",
    title: "Motherboard repair",
    short: "Board-level faults found and fixed under the microscope.",
    long: "Motherboard faults, network and SIM faults, Face ID and no-power faults diagnosed and repaired under the microscope.",
    faults: ["No power", "No network or SIM", "Face ID", "Camera", "Vibration"],
    image: "board-microscope",
    howItWorks: [
      { step: "01", title: "Microscope inspection", text: "The logic board is examined under the microscope for burnt chips and damaged lines." },
      { step: "02", title: "Circuit diagnostics", text: "Power lines and short circuits are traced with digital multimeters and schematics." },
      { step: "03", title: "Micro-soldering", text: "Damaged chips, small capacitors and power ICs are replaced by micro-soldering." },
      { step: "04", title: "Full diagnostic test", text: "Network, power management, and logic lines are verified before sealing." },
    ],
    faq: [
      { q: "What is board-level repair?", a: "Board-level repair fixes the damaged part on the phone's motherboard, such as one chip, instead of replacing the whole board." },
      { q: "My phone is dead and will not turn on (mobile on nahi ho raha). Can you fix it?", a: "Rehan Traders checks it free of cost first. A phone that will not turn on often has a short circuit or a failed power chip, which can be found under the microscope and replaced. If it cannot be fixed, the shop tells you plainly." },
      { q: "Can I watch the board repair under the microscope?", a: "Yes, on request, when the bench is not busy." },
      { q: "My phone shows no signal or does not detect the SIM (SIM nahi chal rahi). Can it be repaired?", a: "Network and SIM faults are diagnosed at board level under the microscope at Rehan Traders, Shop G-88, Hafeez Center, Lahore. The free check tells you what is wrong, whether it can be fixed and what it will cost." },
      { q: "My phone camera or Face ID stopped working. Do you repair it?", a: "Yes. Rehan Traders checks camera and Face ID faults free of cost at Hafeez Center, Lahore and repairs them at the bench." },
    ],
    related: ["water-damage-data-recovery", "iphone", "battery-charging"],
    seo: {
      title: "Motherboard repair, Hafeez Center Lahore",
      description: "Phone dead, no network or SIM, Face ID or camera fault? Board-level repair under the microscope at Shop G-88, Hafeez Center, Lahore. Free checking first.",
    },
  },
  {
    slug: "ipad-tablet",
    title: "iPad and tablet repair",
    short: "Tablet glass, screens, batteries and charging.",
    long: "Mainly iPad repairs: glass, screens, batteries and charging. Very old, obsolete tablets are not taken in.",
    faults: ["Cracked glass", "Screen", "Battery", "Charging"],
    image: "ipad-screen",
    howItWorks: [
      { step: "01", title: "Tablet inspection", text: "We check whether only the glass is cracked or the display under it is damaged too." },
      { step: "02", title: "Bench repair", text: "Glass separation, display replacement, or battery service is performed at the bench." },
      { step: "03", title: "Touch digitizer testing", text: "Touch is tested across the whole screen." },
      { step: "04", title: "Cleaning and pouch", text: "The tablet is cleaned, inspected, and sealed in a protective pouch." },
    ],
    faq: [
      { q: "Which tablet brands do you repair?", a: "Rehan Traders mainly repairs Apple iPads. For another tablet, ask on WhatsApp first. Very old, obsolete tablets are not accepted." },
      { q: "Can you fix tablet charging ports?", a: "Yes. We repair loose USB-C and Lightning charging ports on tablets." },
      { q: "Can you replace only the glass on an iPad?", a: "It depends on the model. Rehan Traders checks your iPad free of cost and tells you whether the glass can be replaced on its own." },
      { q: "My iPad screen is broken (iPad ki screen toot gayi). Do you repair iPads in Lahore?", a: "Yes. Rehan Traders mainly repairs Apple iPads at Shop G-88, Hafeez Center, Lahore: cracked glass, screens, batteries and charging. Checking is free." },
    ],
    related: ["touch-glass-replacement", "screen-replacement", "battery-charging"],
    seo: {
      title: "iPad repair, Hafeez Center Lahore",
      description: `Cracked iPad glass, broken screen, battery or charging fault? Mainly iPad repairs at Shop G-88, Hafeez Center, Lahore. Free checking. WhatsApp ${site.phone.display}.`,
    },
  },
]

export const faults = [
  "Cracked glass",
  "Screen not working",
  "Battery",
  "Charging",
  "Water damage",
  "Will not turn on",
  "Hinge",
  "Back glass",
] as const

// Days Hafeez Center closes: no booking slots on these dates. The shop opens whenever Hafeez Center does (Adnan,
// 31 Oct 2026), so national days stay open. Eid and Ashura follow the moon: these dates are estimates, update them
// when the government announces them. Extend the list before May 2028.
export const holidays = [
  { date: "2027-03-10", name: "Eid ul Fitr (estimate)" },
  { date: "2027-03-11", name: "Eid ul Fitr (estimate)" },
  { date: "2027-03-12", name: "Eid ul Fitr (estimate)" },
  { date: "2027-05-17", name: "Eid ul Adha (estimate)" },
  { date: "2027-05-18", name: "Eid ul Adha (estimate)" },
  { date: "2027-05-19", name: "Eid ul Adha (estimate)" },
  { date: "2027-06-15", name: "Ashura (estimate)" },
  { date: "2027-06-16", name: "Ashura (estimate)" },
  { date: "2028-02-27", name: "Eid ul Fitr (estimate)" },
  { date: "2028-02-28", name: "Eid ul Fitr (estimate)" },
  { date: "2028-02-29", name: "Eid ul Fitr (estimate)" },
  { date: "2028-05-05", name: "Eid ul Adha (estimate)" },
  { date: "2028-05-06", name: "Eid ul Adha (estimate)" },
  { date: "2028-05-07", name: "Eid ul Adha (estimate)" },
  { date: "2028-06-03", name: "Ashura (estimate)" },
  { date: "2028-06-04", name: "Ashura (estimate)" },
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
  /** The customer's own words, with "Not sure" or "Not mentioned here". */
  problem?: string
}

/** The faults that are not a fault: "Not sure", and the one the ticket form sends ("Not mentioned here"). */
const openFaults = ["Not sure", "Not mentioned here"] as const

/**
 * Whether a ticket or WhatsApp text shows its Fault line. When the customer's own words are there with an open
 * fault, "Fault: Not mentioned here" says nothing and the Problem line says it all. The Worker and the Sheet still
 * get the open fault.
 */
export const showsFault = (b: Pick<BookingSummary, "fault" | "problem">) => !(b.problem && (openFaults as readonly string[]).includes(b.fault))

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
    label: "Device name",
    placeholder: "Samsung Galaxy Z Fold8 Ultra",
    pickError: "Type your device name to continue.",
  },
  fault: {
    label: "Fault",
    pickError: "Pick what's wrong to continue.",
    /** Always offered after the service's faults; both open the description and photos. */
    open: openFaults,
    describe: "Describe the problem",
    describePlaceholder: "What happened, and what does it do now?",
    describeError: "Describe the problem to continue.",
    problemError: "The description has a character we cannot send. Retype it as plain text.",
    photos: "Photos, up to 3 (optional)",
    addPhoto: "Add a photo",
    removePhoto: "Remove photo",
    photoAlt: "Your photo of the problem",
    uploading: "Uploading photo",
    wait: "Wait for the photos to finish uploading.",
    uploadError: "A photo did not upload. Try adding it again.",
  },
  time: {
    days: "Day",
    slots: "Time",
    today: "Today",
    hour: "Hour",
    minute: "Minutes",
    picked: (when: string) => `You'll come in ${when}`,
    none: "No times are left in the next 7 days. Message us on WhatsApp instead.",
    pickError: "Pick a time to continue.",
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
    problem: "Problem",
    photos: "Photos",
    photoCount: (n: number) => `${n} attached`,
    submit: "Confirm booking",
    sending: "Sending",
    error: "Something in the form was not accepted. Go back, check it and try again.",
    limit: "That is 5 bookings in the last hour. Try again later, or message the shop on WhatsApp.",
  },
  /** Prefilled WhatsApp text: job number, device, fault (or the problem), time and name. */
  whatsapp: (b: BookingSummary) =>
    [
      `Assalam o alaikum. ${b.kind === "quote" ? "Quote request" : "Booking"} No. ${b.ref}`,
      `Device: ${b.device}`,
      showsFault(b) && `Fault: ${b.fault}`,
      b.problem && `Problem: ${b.problem}`,
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
    save: "Save ticket",
    /** The ticket image, saved to the phone when the booking is made. */
    image: {
      file: (ref: string) => `rehan-traders-${ref.toLowerCase()}.png`,
      footer: "Show this ticket at the counter.",
    },
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
  { title: "Free check at the counter", text: "The shop tells you what is wrong, what it will cost and how long it will take. If you go ahead, your device goes on a numbered job card." },
  { title: "Repaired at the open bench", text: "The work happens at the bench in the shop. Ask to watch when it is not busy." },
  { title: "Tested and sealed", text: "Every repair is tested, then sealed in a pouch until you collect it." },
  { title: "Warranty at the counter", text: "Any warranty is discussed at the counter. It varies with the model and the type of repair." },
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
    a: `Send photos of the device and its model on WhatsApp to ${site.phone.display}, or send the problem with photos through the form on the Estimate page, and Rehan Traders replies with a quote. You can also bring the device to Shop G-88, Ground Floor, Hafeez Center, Lahore.`,
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
  title: "Not sure what's wrong?",
  label: "Describe the problem",
  lede: "Describe it, add photos if you like, and the shop replies on WhatsApp with a quote.",
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
    description: `Customer reviews for Rehan Traders, the phone repair shop at G-88, Hafeez Center, Lahore: ${reviews.rating.toFixed(1)} on Google. Reviews copied from Google as written.`,
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
  formHref: "/estimate?tab=describe",
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
    title: "Phone repair estimate in Lahore",
    description:
      "Pick your device and the fault to see the likely repair, or send photos. Rehan Traders, Hafeez Center, Lahore replies with a quote on WhatsApp.",
  },
  title: "Repair estimate",
  lede: "Pick a device and fault to see the likely repair, or send the problem with photos and the shop replies with a quote on WhatsApp.",
  mode: { label: "How do you want to tell us?", pick: "Pick the fault", describe: "Describe it" },
  device: "Device",
  fault: "Fault",
  submit: "See the likely repair",
  pickError: "Type your device name and pick the fault.",
  /** The Describe tab: a quote ticket. Labels and errors shared with the booking flow come from `booking`. */
  ticket: {
    message: "Describe the problem",
    placeholder: estimate.placeholder,
    hint: "Your name and number go only to the shop.",
    submit: "Create ticket",
  },
  result: {
    title: "Likely repair",
    device: "Device",
    fault: "Fault",
    panel: {
      kept: "Your original display stays: only the cracked glass is replaced.",
      maybe: "The shop tries to save the damaged panel first and replaces it only when it cannot be saved.",
    },
    quote: "Get a quote on WhatsApp",
    other: "That doesn't match a repair we list. Ask on WhatsApp and the shop will tell you.",
    again: "Start again",
  },
  whatsapp: (device: string, fault: string) => `Assalam o alaikum. Quote please.\nDevice: ${device}\nFault: ${fault}`,
  faults: [
    { slug: "cracked-glass", label: "Cracked glass, screen still works", service: "touch-glass-replacement", panel: "kept" },
    { slug: "touch-not-working", label: "Touch not working", service: "touch-glass-replacement", panel: "kept" },
    { slug: "screen-damaged", label: "Lines, black or green screen", service: "screen-replacement", panel: "maybe" },
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
