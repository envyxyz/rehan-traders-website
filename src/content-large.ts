/**
 * The big blocks of copy. Same rules as content.ts, split off for slow connections: a client component that imports one
 * export of a module brings the whole module's used exports into its chunk, and content.ts is in every page's first load.
 * Only pages and lazy pieces that need these import them. content.ts must never import this file.
 */

import { actions, estimate, facts, googleRating, site } from "./content"

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
    title: "Folding Phones (Duo, Pixel, Z Series)",
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
    answers: { model: "Yes. Every Galaxy Z Fold and Z Flip generation, plus Pixel Fold and Surface Duo.", time: "Up to a day, depending on the repair, parts availability and the model. Never guaranteed." },
    proof: ["Zunair K.", "Xhah A.", "Ali R."],
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
    answers: { model: "iPhone, Samsung, Google Pixel, OnePlus and other brands. Send your exact model on WhatsApp and the shop confirms it.", time: "A normal screen change can take as little as 60 minutes, depending on parts and the model. Complex devices such as Galaxy Z Folds can take up to a day. Never guaranteed." },
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
