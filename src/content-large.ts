/**
 * The big blocks of copy. Same rules as content.ts, split off for slow connections: a client component that imports one
 * export of a module brings the whole module's used exports into its chunk, and content.ts is in every page's first load.
 * Only pages and lazy pieces that need these import them. content.ts must never import this file.
 */

import { actions, estimate, facts, googleRating, site, touchGlassHref, type InlineLink } from "./content"

// Typed in by hand (static site, no Places API). Update rating and asOf together.
// Review text copied on 29 Oct 2026 from the public Google reviews panel (signed out): 50 ratings then, 49 on 31 Oct, 32 with text (the other 18 are
// stars only and are left out; so is the one below 4 stars, 1 Nov 2026, Ameer's call). Text exactly as written; Ameer's own review is left out: the agency should not review its
// client. `when` is fixed, so it never goes stale: Google's relative date counted back from 29 Oct 2026 to its month, and
// "a year ago" or older as "Over a year ago" and so on, which stays true. The count is not shown on the site: it dates fast.
// Order is deliberate: the first ones answer the fears of unnecessary work, of being overcharged and of a shop nobody can
// trust, and the home page shows `featured` of them. `weight` (3 clear English naming the repair, 2 clear praise, 1 short or
// vague) picks which ones llms-full.txt quotes.
export const reviews = {
  rating: googleRating,
  count: 49,
  asOf: "2026-10-31",
  asOfLabel: "31 October 2026",
  // The listing page shows every review. The write-a-review link (https://g.page/r/CUvWWzrw4sFhEBE/review) is for
  // QR cards and WhatsApp follow-ups, not for "Read reviews".
  url: site.mapsUrl,
  /** How many of the first items the home page shows. */
  featured: 3,
  items: [
    { author: "M. Arsim Z.", rating: 5, when: "Over a year ago", weight: 3, text: "Good overall service. They only do the necessary work which needs to be done and nothing extra." },
    { author: "Adnan F.", rating: 5, when: "Apr 2026", weight: 2, text: "Hum na  Rehan traders phone repair kariya hai fold 4 blank display fix kariya both acha Kam Kya unhe bundle of thanks price be boht best market saw ache" },
    { author: "Rao S.", rating: 5, when: "Oct 2026", weight: 3, text: "Honest, fair and expert at what they do." },
    { author: "Xhah A.", rating: 5, when: "Sep 2026", weight: 2, text: "google pixel fold 9 pro display problem mai tha display problem adnan bhai ny bht sy professional tareeky sy repair kiya or mera same panel repair kiya" },
    { author: "Farooq A.", rating: 5, when: "Sep 2026", weight: 3, text: "Visited second time, more reliable, satisfactory, honest services. God bless you dear" },
    { author: "Zunair K.", rating: 5, when: "Jun 2026", weight: 3, text: "I repaired my fold4 blank display.Good job🥰😍🥰" },
    { author: "Ali R.", rating: 5, when: "Jun 2026", weight: 2, text: "men ne apna fold7 repaire kraya very pfrofesional" },
    { author: "Haadi O.", rating: 5, when: "Apr 2026", weight: 3, text: "Mr Rehan was very honest and helped me fixed my andriod s22 ultra which was ocean water damaged. He is expert in iphone so he recommended me to proper person and didn't charge me anything. My phone data was recovered." },
    { author: "Asil M.", rating: 5, when: "Over a year ago", weight: 3, text: "Highly impressed with the mobile repair service here Fast, reliable, and professional my phone feels brand new again. Definitely the go-to spot for any mobile issues.Mr Adnan is very cooperative and humble person really impressed" },
    { author: "Hassnain T.", rating: 5, when: "May 2026", weight: 3, text: "I recently got my phone repair. Very professional extremely happy with the services of Rehan Trader" },
    { author: "Faizan I.", rating: 5, when: "Oct 2026", weight: 3, text: "Very good service just repaired my 14 pro max" },
    { author: "Farwah W.", rating: 5, when: "Jun 2026", weight: 3, text: "Best Lab in the Entire Hafeez Centre for Mobile repair. Thumbs up 👍" },
    { author: "Junaid B.", rating: 5, when: "Over a year ago", weight: 3, text: "Iphone and samsung front glass specialist" },
    { author: "Salman S.", rating: 5, when: "Over a year ago", weight: 2, text: "Rehan trader is very good repairing center . He is very coprative and honest people. All employees very good trained." },
    { author: "Shoaib M.", rating: 5, when: "Sep 2026", weight: 2, text: "Very much satisfied from their customer services." },
    { author: "Aqsa I.", rating: 5, when: "Jan 2026", weight: 2, text: "Wonderful people professional and experienced polite and humble no doubt\n\nALLAH Khush Rakhe Ameen" },
    { author: "Mian Haider M.", rating: 5, when: "Over a year ago", weight: 2, text: "Highly professional and reasonable services" },
    { author: "Bilal R.", rating: 5, when: "Oct 2026", weight: 2, text: "Best repairing center in lahore" },
    { author: "Emraan K.", rating: 5, when: "May 2026", weight: 2, text: "Best repairing shop in Hafeez centre" },
    { author: "Muhammad A.", rating: 5, when: "Over a year ago", weight: 2, text: "\"I had a great experience at Mobile Repairing. The staff was very friendly and helpful. They were able to answer all of my questions and help me find the right phone for my needs. I was especially impressed with the staff's politeness and professionalism. I would highly recommend mobile repairing to anyone looking for a new phone.\"" },
    { author: "Ahmad S.", rating: 5, when: "Over a year ago", weight: 1, text: "Best service... satisfied\nMust recommend ♥️" },
    { author: "Zain C.", rating: 5, when: "Over a year ago", weight: 1, text: "Good Service\nRecommended" },
    { author: "Uzze B.", rating: 5, when: "Sep 2026", weight: 1, text: "Excellent services of repair" },
    { author: "Yasir A.", rating: 4, when: "Over 2 years ago", weight: 1, text: "Offer variety of mobile reparations." },
    { author: "Urooj F.", rating: 5, when: "Oct 2026", weight: 1, text: "Good service" },
    { author: "Golden J.", rating: 5, when: "Apr 2026", weight: 1, text: "Very nice staff" },
    { author: "Usman A.", rating: 5, when: "Over a year ago", weight: 1, text: "Very good" },
    { author: "Husnain J.", rating: 5, when: "Over 3 years ago", weight: 1, text: "Very good" },
    { author: "NAQi Z.", rating: 5, when: "Sep 2026", weight: 1, text: "Grateful" },
    { author: "Danish K.", rating: 5, when: "Over 2 years ago", weight: 1, text: "Rauf Good" },
  ],
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
  /** The first and third of a repair page's six questions; the other four are shared (repairsPage.answers). Only confirmed facts. */
  answers: { model: string; time: string }
  /** Authors of reviews in `reviews.items` about this repair, text as written. */
  proof?: string[]
  /** Search title and description: the problem, then Hafeez Center and Lahore. */
  seo: { title: string; description: string }
}

// Images arrive in Phase 2 (public/images); until then cards show a placeholder surface. Prices stay unset while priceMode is "quote".
/** Adnan, 30 Oct 2026: no time is stated beyond the ones given per repair below. */
const timeDepends = "It depends on the repair, parts availability and how rare the model is. The free check tells you how long."
const askModel = "Send your exact model on WhatsApp and the shop confirms it, or bring the phone in for the free check."

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
    answers: { model: "Yes, if the display under the cracked glass still works. Send your exact model on WhatsApp and the shop confirms it.", time: timeDepends },
    proof: ["Junaid B."],
    seo: {
      title: "Touch glass replacement, Hafeez Center Lahore",
      description: `Cracked phone glass? Rehan Traders replaces only the glass and keeps your original display. Shop G-88, Hafeez Center, Lahore. Free checking: ${site.phone.display}.`,
    },
  },
  {
    slug: "galaxy-z-fold-flip",
    title: "Foldables (Duo, Z Series, Pixel)",
    short: "Outer glass, inner screen and hinge on all foldables, including Duo, Galaxy Z Series and Pixel Fold.",
    long: "Outer glass, inner screen and hinge repairs on all foldables, including Duo, every Galaxy Z Series generation and Pixel Fold. The shop tries to save the damaged panel first and replaces it only when it cannot be saved.",
    faults: ["Outer glass", "Inner screen", "Hinge", "Blank display", "Lines on screen"],
    image: "fold-inner-panel",
    howItWorks: [
      { step: "01", title: "Hinge and display inspection", text: "We inspect hinge tension, frame alignment, and inner flexible panel condition." },
      { step: "02", title: "Panel recovery priority", text: "We try to save the original inner screen before replacing it." },
      { step: "03", title: "Bench repair", text: "Outer glass, inner panel connections, or hinge mechanisms are repaired at the open bench." },
      { step: "04", title: "Folding test and pouch", text: "We verify opening angles and touch response across the fold line before sealing." },
    ],
    faq: [
      { q: "Which foldables do you repair?", a: "All foldables, not only Galaxy Z Fold and Z Flip. That includes Duo, every Galaxy Z Series generation and Pixel Fold." },
      { q: "Can a blank inner screen be saved without full replacement?", a: "It depends on the fault. Rehan Traders checks the phone free of cost and tries to save the inner panel before replacing it. If it cannot be saved, the shop tells you plainly." },
      { q: "Do you repair stiff or stuck hinges?", a: "Yes. Rehan Traders repairs foldable hinges at the bench." },
      { q: "How long does a foldable repair take?", a: "A foldable repair can take up to a day, depending on the repair, parts availability and the model." },
      { q: "My foldable's inner screen has a line or went black (Fold ki andar wali screen kharab ho gayi). Can it be fixed?", a: "Bring it in for the free check at Rehan Traders, Shop G-88, Hafeez Center, Lahore. The shop tries to save the inner panel before replacing it, and tells you plainly what is wrong, what it will cost and how long it will take." },
      { q: "My foldable's outer glass is cracked. Do you replace it?", a: "Yes. Rehan Traders replaces the outer glass on all foldables at the bench in Hafeez Center, Lahore." },
    ],
    related: ["touch-glass-replacement", "screen-replacement", "board-repair"],
    answers: { model: "Yes. All foldables, including Duo, every Galaxy Z Series generation and Pixel Fold.", time: "Up to a day, depending on the repair, parts availability and the model. Never guaranteed." },
    proof: ["Zunair K.", "Xhah A.", "Ali R."],
    seo: {
      title: "Foldable repair, Z Fold, Z Flip, Pixel, Hafeez Center Lahore",
      description: "Inner screen black or lined, cracked outer glass or a stiff hinge? All foldables repaired, including Duo, Galaxy Z Series and Pixel Fold, at Shop G-88, Hafeez Center, Lahore. Free checking.",
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
    answers: { model: "Send your exact iPhone model on WhatsApp and the shop confirms the repair, or bring it in for the free check.", time: timeDepends },
    proof: ["Faizan I.", "Junaid B."],
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
    answers: { model: "iPhone, Samsung, Google Pixel, OnePlus and other brands. Send your exact model on WhatsApp and the shop confirms it.", time: "A normal screen change can take as little as 60 minutes, depending on parts and the model. Complex devices such as foldables can take up to a day. Never guaranteed." },
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
    answers: { model: askModel, time: timeDepends },
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
    answers: { model: askModel, time: "Anywhere from 8 hours to several days, depending on how severe the damage is. Data recovery time depends on the phone's condition." },
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
    answers: { model: askModel, time: timeDepends },
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
    answers: { model: "Mainly Apple iPads. For another tablet, ask on WhatsApp first. Very old, obsolete tablets are not taken in.", time: timeDepends },
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
  /** The first step behind "Start my repair". `unsure` books without a repair picked. */
  picker: {
    title: "What needs fixing?",
    unsure: { title: "Not sure what's wrong", short: "Tell us what it's doing and the free check finds the fault." },
  },
  lede: "A few quick questions. No account, no payment.",
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
    title: "Get a phone repair quote in Lahore",
    description:
      "Find your issue to see the likely repair, or send photos. Rehan Traders, Hafeez Center, Lahore replies with a quote on WhatsApp.",
  },
  title: "Get a Quote",
  lede: "Find your issue to see the likely repair, or describe it with photos. The shop replies on WhatsApp with a quote.",
  mode: { label: "How do you want to tell us?", pick: "Find your issue", describe: "Describe it" },
  device: "Device",
  fault: "Fault",
  submit: "See the likely repair",
  pickError: "Type your device name and pick the fault.",
  /** The Describe tab: a quote ticket. Labels and errors shared with the booking flow come from `booking`. */
  ticket: {
    message: "Describe the problem",
    placeholder: estimate.placeholder,
    hint: "Your name and number go only to the shop.",
    submit: "Send to the shop",
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
    { slug: "fold-inner-screen", label: "Foldable inner screen", service: "galaxy-z-fold-flip", panel: "maybe" },
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

export type Guide = {
  slug: string
  /** h1: the question people search, in their words */
  title: string
  seo: { title: string; description: string }
  /** 40 to 60 words that answer the h1 on their own, for answer boxes and AI assistants */
  answer: string
  sections: {
    /** h2: a searched question; Roman Urdu in brackets where people search it that way */
    h: string
    /** the first 40 to 60 words answer the h2 */
    answer: string
    list?: string[]
    /** the list is steps to follow (HowTo) */
    steps?: boolean
    table?: { head: string[]; rows: string[][] }
    /** a phrase of `answer` that links to a repair page */
    link?: InlineLink
  }[]
  faq: { q: string; a: string }[]
  /** Repair slugs this guide leads to. */
  services: string[]
  published: string
  updated: string
}

/** Researched from Google autocomplete and People also ask for Pakistan, 2 Nov 2026 (English, Roman Urdu). General advice only; anything about the shop is a confirmed fact. */
const atShop = `${site.address.short}, ${site.address.city}`
const g2 = { published: "2026-11-02", updated: "2026-11-02" }
/** Guides whose copy changed on 7 Nov 2026 (the sitemap and the page's "Updated" line read this). */
const g3 = { ...g2, updated: "2026-11-07" }

export const guides: Guide[] = [
  {
    slug: "cracked-screen-glass-or-full-screen",
    title: "Cracked phone screen: new glass or a whole new screen?",
    seo: {
      title: "Cracked phone screen: glass or full screen?",
      description: "How to tell if a cracked phone needs only new touch glass or a full screen (panel) change, what each fixes, and how to get it checked free in Lahore.",
    },
    answer:
      "If the picture under the cracks is clean, with no lines, black spots or flicker, and touch works everywhere, usually only the outer glass needs replacing and your display stays. If the screen shows lines, black patches or nothing at all, the display panel itself is damaged and the whole screen has to be changed.",
    sections: [
      {
        h: "What is the difference between touch glass and the screen (panel)?",
        answer:
          "A phone screen is layers bonded together: the outer glass you touch, and the display panel under it that makes the picture. On many phones the touch sensor is built into the panel; on some it is bonded to the glass. Touch glass replacement changes only the outer glass. A screen or panel change replaces the whole display.",
        link: { phrase: "Touch glass replacement", href: touchGlassHref },
        table: {
          head: ["What you see", "What is damaged", "What it usually needs"],
          rows: [
            ["Cracks, but a clean picture and working touch", "Outer glass", "Touch glass replacement"],
            ["Cracks and touch dead in some spots", "Glass, sometimes the panel's touch layer", "Free check decides"],
            ["Lines, black or green patches, flicker", "Display panel", "Screen (panel) change"],
            ["Black screen, but the phone rings or vibrates", "Display panel or its connection", "Screen check, then panel change if needed"],
          ],
        },
      },
      {
        h: "How do I know if only the glass is broken (sirf glass toota hai)?",
        answer:
          "Look at the picture, not the cracks. Open something plain white, then something dark. If the colors look even, there are no lines or ink-like spots, and every part of the screen responds to your finger, the panel is very likely fine and only the glass is broken.",
        list: [
          "Open a plain white page and look for dark spots, stains or colored lines.",
          "Open a dark image and look for bright lines or patches.",
          "Drag an app icon slowly across the whole screen, edges included, to find dead spots.",
          "Turn brightness up and down and watch for flicker.",
        ],
        steps: true,
      },
      {
        h: "What are the signs the panel under the glass is damaged?",
        answer:
          "Vertical or horizontal lines, a green, pink or white line, a black blot that grows, flicker, or a screen that stays black while the phone is clearly on. These mean the display panel is damaged. New glass on top will not fix any of them, so the screen has to be changed.",
      },
      {
        h: "Is it okay to keep using a phone with cracked glass?",
        answer:
          "For a short time, yes, but cracks tend to spread, sharp edges can cut a finger, and a cracked front lets in dust and moisture. If the panel is still fine, fixing the glass soon keeps it that way. A thin clear tape or screen protector over the cracks helps until you can get it repaired.",
      },
      {
        h: `Getting it checked at ${atShop}`,
        answer: `${site.name} checks your phone free of cost and tells you whether glass alone will do or the screen has to be changed, before any work starts. The shop tries to save your panel, and your money, first. Send the model and a photo on WhatsApp to ${site.phone.display} for a quote, or send it by courier from outside Lahore.`,
      },
    ],
    faq: [
      { q: "Mobile ki screen toot gayi but the display works. Can only the glass be changed?", a: "Usually, yes. If the picture is clean and touch works, only the outer glass is replaced and your original display stays. A free check confirms it." },
      { q: "Will new glass remove lines or black spots?", a: "No. Lines and black spots come from the display panel under the glass. Only a screen (panel) change fixes them." },
      { q: "Why is a glass change cheaper than a panel change?", a: "You pay for new glass and the work, not a whole new display. The exact price depends on the model, so ask for a quote on WhatsApp." },
    ],
    services: ["touch-glass-replacement", "screen-replacement"],
    ...g3,
  },
  {
    slug: "lines-on-phone-screen",
    title: "Lines on your phone screen: what they mean and how to fix them",
    seo: {
      title: "Lines on phone screen: causes and fix",
      description: "Why green, white or pink lines appear on a phone screen after a drop, water or an update, how to test if it is the panel, and what fixes it.",
    },
    answer:
      "A line that stays on the screen, shows on the startup logo and does not appear in a screenshot is a fault in the display panel or its connection, not in the software. Restarts and resets will not remove it. The fix is a screen (panel) change, after a check that the connection is not the cause.",
    sections: [
      {
        h: "Why is there a green or white line on my phone screen (screen par line aa gayi)?",
        answer:
          "Most lines come from damage inside the display panel: a drop or pressure in a pocket, liquid reaching the screen connector, or the panel wearing out. Some owners notice a line first after a software update, but a line that stays through restarts is still a hardware fault in the panel or where it connects to the board.",
      },
      {
        h: "How can I tell if the line is hardware or software?",
        answer:
          "Take a screenshot while the line is showing and open it on another phone or a computer. If the line is not in the screenshot, it is in the display hardware. A line that also shows on the startup logo, before any app runs, points the same way.",
        list: [
          "Take a screenshot while the line is on screen.",
          "Send it to another phone and look at it there.",
          "Restart the phone and watch the startup logo for the line.",
          "If the line is in the screenshot too, update the phone and check the app you saw it in.",
        ],
        steps: true,
      },
      {
        h: "Can screen lines be fixed without changing the screen?",
        answer:
          "Rarely. If the line comes from a loose or dirty screen connector, for example after water, cleaning and reseating it can bring the picture back, which the check finds out. A line from damage inside the panel itself cannot be repaired by software, a reset or new glass, so the panel is replaced.",
      },
      {
        h: "Will one line turn into more lines?",
        answer:
          "It can. Some lines stay the same for months, others spread or turn into a black patch, and there is no reliable way to predict which. If the phone also got wet or was dropped, have it checked sooner, because corrosion or a cracked panel tends to get worse.",
      },
      {
        h: `Getting a lined screen checked at ${atShop}`,
        answer: `${site.name} checks the phone free of cost, including the screen connection, and tells you what is wrong and what it will cost before any work. If the panel has to be changed, you hear the price first and decide. Send the model and a photo of the line on WhatsApp to ${site.phone.display} for a quote.`,
      },
    ],
    faq: [
      { q: "Screen par line aa gayi. Will a factory reset fix it?", a: "No. If the line shows on the startup logo or is missing from a screenshot, it is in the display hardware and a reset will not touch it." },
      { q: "Does a line mean only the glass is broken?", a: "No. Lines come from the display panel or its connection, under the glass. New glass alone will not fix a line." },
      { q: "A pink or green line appeared after my phone got wet. What should I do?", a: "Turn it off, do not charge it, and get it checked soon. Liquid at the screen connector can cause lines, and corrosion spreads with time." },
    ],
    services: ["screen-replacement"],
    ...g2,
  },
  {
    slug: "phone-fell-in-water",
    title: "Phone fell in water: what to do right now",
    seo: {
      title: "Phone fell in water: what to do now",
      description: "Phone dropped in water? Turn it off, do not charge it, skip the rice and the hair dryer. What to do now, and when to get it opened and cleaned.",
    },
    answer:
      "Take it out, turn it off and do not charge it. Wipe it dry, remove the case and SIM tray, and tap it gently with the charging port facing down. Leave it to dry in moving air. Do not use rice, a hair dryer or any heat. If it was in for more than a moment, get it opened and cleaned.",
    sections: [
      {
        h: "What should I do first (mobile pani mein gir gaya to kya karein)?",
        answer:
          "Act in the first minutes: power and water together cause the damage. Turn the phone off, keep it off the charger, and get as much water out as you can. These steps follow what Apple and Samsung advise for wet phones.",
        list: [
          "Take the phone out of the water and turn it off. Do not keep pressing buttons to test it.",
          "Do not plug in a charger or cable.",
          "Take off the case and pull out the SIM tray.",
          "Wipe it with a dry, soft cloth.",
          "Hold it with the charging port facing down and tap it gently against your hand.",
          "Leave it in a dry place with moving air, such as in front of a fan, not in the sun.",
        ],
        steps: true,
      },
      {
        h: "Should I put my wet phone in rice?",
        answer:
          "No. Apple advises against it. Rice does not pull water out from inside the phone faster than open air, and grains and starch dust can get stuck in the charging port and speaker. Leaving the phone in moving air does the same job without that risk.",
      },
      {
        h: "Can I use a hair dryer or charge it to check if it works?",
        answer:
          "No. Heat can damage the battery and the seals, and a hot air stream pushes water further in. Charging a wet phone sends current through water on the board, which can short it. Wait until it has been opened and cleaned, or at least fully dried, before you charge it.",
      },
      {
        h: "My phone fell in water but still works. Is it safe?",
        answer:
          "Not necessarily. Water or salt left inside can corrode the board over the following days, so a phone that works today can fail later. Water resistance also weakens with age and after a screen or battery repair. If it went fully under, especially in salt water, tea or a drink, have it opened and cleaned.",
      },
      {
        h: "Can photos and data be recovered from a water-damaged phone?",
        answer:
          "Often, if it is cleaned before corrosion goes too far. Whether data can be recovered, and how long it takes, depends on the damage. Turning the phone off quickly and not charging it gives the best chance.",
      },
      {
        h: `Getting a wet phone cleaned at ${atShop}`,
        answer: `${site.name} checks water-damaged phones free of cost and tells you what is wrong, what it will cost and how long it will take. Water damage repairs take anywhere from 8 hours to several days, depending on how bad it is. Call or WhatsApp ${site.phone.display}, or send the phone by courier from outside Lahore.`,
      },
    ],
    faq: [
      { q: "Phone pani mein gir gaya, ab on nahi ho raha. What should I do?", a: "Do not charge it and do not keep trying to turn it on. Bring it in for cleaning and a check; the board may still be saved." },
      { q: "My phone says liquid or moisture detected. Can I charge it?", a: "No. Unplug it and leave it with the port facing down in moving air. Apple says to wait at least 30 minutes before trying again, longer if the warning comes back." },
      { q: "Is my phone water resistant after a repair?", a: "Do not rely on it. The shop re-applies the water-resistance seal after a repair on request, but no repaired phone should be treated as waterproof." },
    ],
    services: ["water-damage-data-recovery"],
    ...g2,
  },
  {
    slug: "phone-not-charging",
    title: "Phone not charging: what to check before a repair",
    seo: {
      title: "Phone not charging? What to check first",
      description: "Phone not charging when plugged in? Check the cable, adapter and port lint first. Signs it is the charging port, battery or board, and where to get it checked.",
    },
    answer:
      "Try a different cable and wall adapter first, then restart the phone. Turn it off and look into the charging port with a light: packed pocket lint is a common cause. If it still will not charge, charges only at an angle, or says moisture is detected, the port, the battery or the board needs a check.",
    sections: [
      {
        h: "Why is my phone not charging when plugged in (mobile charge nahi ho raha)?",
        answer:
          "Most often it is the cable or adapter, lint packed into the port, or a software hang. Less often it is a worn charging port, a battery at the end of its life, or a fault on the board. Rule out the simple causes first, because they cost nothing.",
        list: [
          "Try another cable and adapter you know work.",
          "Try a different wall socket, not a laptop or car port.",
          "Restart the phone, or force restart it if it is frozen.",
          "Look into the port with a light for lint, dirt or water.",
        ],
        steps: true,
      },
      {
        h: "How do I clean lint out of the charging port safely?",
        answer:
          "Turn the phone off first. Use a wooden toothpick and gently lift lint out from the back of the port. Never use a pin, needle or anything metal, never use water or liquid, and do not dig hard at the contacts. If the lint is packed tight, a repair shop can clear it without damaging the port.",
      },
      {
        h: "What does moisture detected in the charging port mean?",
        answer:
          "The phone found liquid in the port and stopped charging to protect itself. Unplug it, hold it with the port facing down, tap it gently and leave it in moving air until the warning clears. Do not use heat or push anything into the port.",
      },
      {
        h: "Is it the cable, the port, the battery or the board?",
        answer:
          "The symptom usually points to the part. A new cable that works settles it at once. Charging only at a certain angle points to the port. A phone that charges but dies fast points to the battery. No sign of charging with any cable, once the port is clean, needs a check of the board.",
        table: {
          head: ["What happens", "Likely cause"],
          rows: [
            ["Works with another cable", "Old cable or adapter"],
            ["Plug does not go all the way in", "Lint in the port"],
            ["Charges only at an angle or when held", "Worn charging port"],
            ["Charges, but the battery drops fast or the phone shuts off", "Worn battery"],
            ["No charging with any cable, port clean", "Board or charging circuit"],
          ],
        },
      },
      {
        h: `Getting charging checked at ${atShop}`,
        answer: `${site.name} checks the phone free of cost and tells you whether it needs a port, a battery or board work, and what it will cost, before any repair. Send your model on WhatsApp to ${site.phone.display} for a quote, or send the phone by courier from outside Lahore.`,
      },
    ],
    faq: [
      { q: "Mobile charge nahi le raha but the cable works on another phone. What is wrong?", a: "Check the port for lint first. If it is clean, the port, battery or board needs a check." },
      { q: "Why does my phone charge so slowly?", a: "A low-power adapter, a worn cable, lint in the port or heavy use while charging. A worn battery can also make charging behave oddly." },
      { q: "Can a cheap charger damage my phone?", a: "A poor-quality charger or cable can charge badly and may harm the charging circuit. A certified charger from the phone's maker or a known brand is safer." },
    ],
    services: ["battery-charging"],
    ...g2,
  },
  {
    slug: "battery-draining-fast",
    title: "Phone battery draining fast: is it settings or wear?",
    seo: {
      title: "Battery draining fast? Causes and fixes",
      description: "Why a phone battery drains fast, how to check battery health on iPhone and Android, when a battery needs replacing, and what to do about a swollen battery.",
    },
    answer:
      "Sudden drain after an update, a new app or with weak signal is usually software or settings and often settles within a day or two. Drain that keeps getting worse, a phone that shuts off with charge left, or a health reading well below 80 percent means the battery is worn. A swollen one needs replacing straight away.",
    sections: [
      {
        h: "Why is my phone draining so fast all of a sudden (battery jaldi khatam ho jati hai)?",
        answer:
          "Look at what changed. After a software update the phone works in the background for a while. One app can run wild. Weak signal, high brightness, location and a hot phone all use more charge. The usage list in Settings shows which apps use the most.",
        list: [
          "Open Settings, then Battery, and see which app uses the most.",
          "Update or remove the app at the top if it looks wrong.",
          "Restart the phone.",
          "Lower the brightness and turn on power saving or Low Power Mode for a day to compare.",
        ],
        steps: true,
      },
      {
        h: "How do I check battery health on iPhone and Android?",
        answer:
          "On iPhone, go to Settings, then Battery, then Battery Health. Maximum Capacity shows how much charge it holds compared with new. Android differs by maker: some show health under Settings, Battery; on Samsung, the Samsung Members app has a check under Diagnostics.",
      },
      {
        h: "When does a battery need replacing?",
        answer:
          "Apple treats about 80 percent of its original capacity as worn. Other signs: the phone shuts off at 20 or 30 percent, it slows down, it gets hot while charging, or a full charge no longer lasts the day. A replacement fixes these; settings will not.",
      },
      {
        h: "Is a swollen phone battery dangerous?",
        answer:
          "Yes. A swollen battery can catch fire if it is pressed, punctured or charged. Signs: the screen or back lifting from the frame, a gap at the edge, or the phone rocking on a table. Stop using and charging it, and get it replaced.",
        list: [
          "Turn the phone off and unplug it.",
          "Do not press the screen or back down to close the gap.",
          "Keep it away from heat, beds and anything that burns.",
          "Do not charge it again; take it in for a replacement.",
        ],
        steps: true,
      },
      {
        h: `Getting a battery checked at ${atShop}`,
        answer: `${site.name} checks the phone free of cost and tells you whether the battery is worn, what a new one costs and how long it takes. On an iPhone you choose the replacement, and the shop explains what that means for the health reading. Send your model on WhatsApp to ${site.phone.display} for a quote.`,
      },
    ],
    faq: [
      { q: "iPhone ki battery health 79 percent hai. Should I replace it?", a: "Apple treats about 80 percent as worn. If the phone shuts off early or does not last the day, a replacement fixes it." },
      // facts.battery, with "battery" said once (this guide is measured for keyword density).
      {
        q: "Will an iPhone show Unknown Part after a battery change?",
        a: "On an iPhone, if you choose an original one, the \"Unknown Part\" message can be removed and the health reading is shown. If you choose a cheaper copy, the IC from your old original can be moved to the new one. In some very rare cases this is not possible, and the shop tells you after checking the phone.",
      },
      { q: "Can an update make the phone drain faster?", a: "For a while, yes. The phone does background work after a big update. If the drain lasts more than a few days, look at the usage list in Settings or have it checked." },
    ],
    services: ["battery-charging"],
    ...g3,
  },
  {
    slug: "phone-not-turning-on",
    title: "Phone not turning on: what to try, and when it is the board",
    seo: {
      title: "Phone not turning on? What to try first",
      description: "Phone dead or will not turn on? Charge it properly, force restart it by brand, check if only the screen is dead, and know when it needs board repair.",
    },
    answer:
      "Charge it on a wall adapter you trust for up to an hour, then force restart it with the buttons for your brand. If it rings, vibrates or shows up on a computer while the screen stays black, the phone is on and the screen is the problem. If nothing works, the battery or the board needs a check.",
    sections: [
      {
        h: "How do I force restart a phone that will not turn on (mobile on nahi ho raha)?",
        answer:
          "A force restart cuts power to a frozen phone and does not erase anything. The buttons depend on the brand. Hold them until the logo appears, then let go. If nothing happens, charge for an hour and try again.",
        list: [
          "iPhone 8 and later: press and release Volume Up, press and release Volume Down, then hold the side button until the Apple logo appears.",
          "Samsung Galaxy: hold the side button and Volume Down together for more than 7 seconds.",
          "Google Pixel: hold the power button for about 30 seconds.",
          "Other Android phones: hold the power button, or power and Volume Up, for 10 to 20 seconds; your phone maker's support page gives the exact keys.",
        ],
      },
      {
        h: "Is it the screen or the phone that is dead?",
        answer:
          "Call the phone from another number. If it rings or vibrates, plug it into a charger and listen for the charging sound, or connect it to a computer and see if it appears. Any of these with a black screen means the phone is on and the display panel or its connection is the fault.",
      },
      {
        h: "My phone died and will not turn on even when charging. Why?",
        answer:
          "A fully flat battery can take a while before the phone shows anything. Apple says to charge for up to an hour. Try another cable and adapter and check the port for lint. If there is still no charging sign, the battery, the charging port or the board needs a check.",
      },
      {
        h: "When does a dead phone need board repair?",
        answer:
          "When a known-good battery, cable and screen do not bring it back, or it died after water, a drop or a power surge, the fault is usually on the main board. Board-level repair is done under a microscope. Whether it can be saved depends on the damage, which the check finds out.",
      },
      {
        h: `Getting a dead phone checked at ${atShop}`,
        answer: `${site.name} checks dead phones free of cost at an open bench with a microscope, and tells you what is wrong, whether it can be repaired, what it will cost and how long it will take. Call or WhatsApp ${site.phone.display}, or send it by courier from outside Lahore.`,
      },
    ],
    faq: [
      { q: "Phone vibrates but the screen stays black. What is wrong?", a: "The phone is on; the display panel or its connection is the fault. A screen check tells you whether the panel needs changing." },
      { q: "Mobile on nahi ho raha. Is my data lost?", a: "Not necessarily. If the board can be repaired, the data on it usually stays. Whether it can be recovered depends on the damage." },
      { q: "Does a force restart delete anything?", a: "No. A force restart only restarts the phone. A factory reset is different and erases data." },
    ],
    services: ["board-repair", "screen-replacement"],
    ...g2,
  },
  {
    slug: "touch-not-working",
    title: "Phone touch not working: what to try, and what it needs",
    seo: {
      title: "Touch screen not working? What to try",
      description: "Touch not working or ghost touching? Restart, check the screen protector and safe mode, then learn if it needs new touch glass or a full screen change.",
    },
    answer:
      "Restart or force restart the phone, unplug any cable, then remove a cracked or thick screen protector and clean the screen. If touch works in Safe Mode, an app is to blame. If touch is still dead or presses itself after a drop, the screen hardware is damaged and needs new glass or a new screen.",
    sections: [
      {
        h: "Touch is not working (touch kaam nahi kar raha). What should I try first?",
        answer:
          "Start with the free steps. A frozen phone looks like dead touch, and a restart clears it. Water, grease or a cracked protector can also stop touch or make it press by itself.",
        list: [
          "Force restart the phone with the buttons for your brand.",
          "Unplug the charger and any accessory; some faulty chargers cause ghost touches.",
          "Dry and clean the screen with a soft cloth.",
          "Remove a cracked, lifted or thick screen protector and test again.",
        ],
        steps: true,
      },
      {
        h: "Can an app cause touch problems? How do I test in Safe Mode?",
        answer:
          "Yes, sometimes. Safe Mode starts Android with downloaded apps turned off. On most Android phones, hold the power button, then press and hold Power off until Safe mode appears. If touch works there, remove recently added apps. iPhones have no Safe Mode; update the iPhone instead.",
      },
      {
        h: "Why does my screen touch by itself (ghost touch)?",
        answer:
          "Ghost touches come from damage to the touch layer, often after a drop or pressure, from moisture on or under the glass, a cracked protector, or a faulty charger. If it stops when the charger is unplugged and the screen is dry, it was not the screen.",
      },
      {
        h: "Does dead touch need new glass or a whole new screen?",
        answer:
          "It depends on where the touch layer sits in your phone and on the panel. If the picture is clean, you can often replace just the glass and fix cracked glass with dead touch. If there are lines, black patches or flicker as well, the panel is damaged and the screen is changed.",
        link: { phrase: "replace just the glass", href: touchGlassHref },
        table: {
          head: ["What you see", "What it usually needs"],
          rows: [
            ["Clean picture, glass intact, touch odd", "Restart, protector off, Safe Mode test"],
            ["Cracked glass, clean picture, touch dead in spots", "Free check; often new touch glass"],
            ["Lines, black spots or flicker", "Screen (panel) change"],
          ],
        },
      },
      {
        h: `Getting touch checked at ${atShop}`,
        answer: `${site.name} checks the phone free of cost and tells you whether new touch glass fixes it or the screen has to be changed. The shop tries to save your panel first, and you hear the price before work starts. Send your model and a photo on WhatsApp to ${site.phone.display}.`,
      },
    ],
    faq: [
      { q: "Mobile ka touch kharab ho gaya after a fall. Can only the glass be changed?", a: "Often, if the picture is clean with no lines or black spots. The free check tells you whether glass alone will fix it." },
      { q: "Touch works in some places but not others. Why?", a: "Usually damage to the touch layer from a drop or pressure. Try removing the screen protector first; if the dead area stays, the screen needs a check." },
      { q: "Can a screen protector stop touch from working?", a: "Yes. A cracked, lifted or very thick protector can block touches or cause ghost touches. Take it off and test." },
    ],
    services: ["touch-glass-replacement", "screen-replacement"],
    ...g3,
  },
]
