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
  /** Smaller second photo beside the steps: public/images/<detail>-<width>.avif|webp */
  detailPhoto?: string
  faq: { q: string; a: string }[]
  howItWorks: { step: string; title: string; text: string }[]
  /** Replaces "How it works" as the h2 above the steps. */
  howItWorksTitle?: string
  related: string[]
  /** The first and third of a repair page's six questions; the other four are shared (repairsPage.answers). Only confirmed facts. */
  answers: { model: string; time: string }
  /** Authors of reviews in `reviews.items` about this repair, text as written. */
  proof?: string[]
  /** Search title and description: the problem, then Hafeez Center and Lahore. */
  seo: { title: string; description: string }
  /** 40 to 60 words that answer "can it be fixed here, and how" on their own: opens the long section, and the Service schema's description. */
  intro: string
  /** The long section: what is repaired, the signs, what to do first, how the bench decides. Each h2 a searched question; `link` puts a phrase of one paragraph on another page. */
  detail: { h: string; p: string[]; list?: string[]; link?: InlineLink }[]
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
    long: "Rehan Traders first checks that the display under the cracked glass still works. If it does, this is a mobile glass replacement: the cracked glass is separated from the display under heat and vacuum and new glass is laminated on. You keep the display your phone came with and pay for new glass, not a whole new screen.",
    faults: ["Cracked glass", "Scratched glass", "Touch not working"],
    image: "glass-separation",
    detailPhoto: "touch-glass-laminate",
    howItWorksTitle: "How mobile glass replacement works",
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
      { q: "Will my photos and data be deleted if the glass is changed (data delete hoga)?", a: "A glass change works on the outer screen only and does not touch the phone's storage, so your photos, chats and apps stay where they are. Back up anyway if touch still works: it costs nothing and protects you if the phone was damaged in other ways." },
      { q: "Can the glass on a curved or edge screen be replaced (curved screen ka glass)?", a: "On many curved-screen phones, yes, as long as the curved panel under the glass still works. It depends on the model, so send the exact model and a photo of the screen on WhatsApp and Rehan Traders confirms it." },
      { q: "Does the fingerprint sensor under the screen still work after new glass?", a: "If the sensor itself was not damaged in the fall, a glass change does not replace it, and the bench tests touch and the phone's functions before sealing it. If something was already faulty, the shop tells you after the check." },
    ],
    related: ["screen-replacement", "galaxy-z-fold-flip", "iphone"],
    answers: { model: "Yes, if the display under the cracked glass still works. Send your exact model on WhatsApp and the shop confirms it.", time: timeDepends },
    proof: ["Junaid B."],
    seo: {
      title: "Mobile glass replacement in Lahore",
      description: "Mobile glass replacement at Hafeez Center, Lahore: only the cracked glass is changed and your original display stays. Free checking.",
    },
    intro: "If the glass on your phone is cracked but the picture under it is still clear, Rehan Traders can usually fix it at Hafeez Center, Lahore with a touch glass replacement. The cracked outer glass is separated under heat and vacuum and new glass is laminated on, so the display your phone came with stays.",
    detail: [
      { h: "Which phones can get a touch glass replacement (kin mobiles ka glass change hota hai)?", p: ["Glass replacement is for phones whose outer glass is cracked or deeply scratched while the display panel under it still works. That covers iPhones and Android phones, the outer glass on foldables such as Duo, Galaxy Z Series and Pixel Fold, and many iPads. Send your exact model on WhatsApp and the shop confirms whether glass alone can be changed on it.", "The point of the repair is to save your panel. As long as the display under the glass has not leaked, gone black or started showing lines, changing only the top glass brings the phone back without paying for a whole new screen."] },
      { h: "How do I know only the glass is broken (sirf glass toota hai)?", p: ["Look at the picture, not the cracks. A phone screen is layers bonded together: the glass you touch and the display panel that makes the picture. When only the glass breaks, the phone shows these signs. Our guide on cracked screen glass or full screen walks through the same check in more detail."], list: ["Cracks or a spiderweb pattern on top, but every icon is clear underneath.", "Even brightness, with no dark ink-like patches or bleeding.", "No vertical or horizontal lines, and no pink, green or white line.", "Touch works across the screen, or stutters only right under a heavy crack.", "No flicker, and the screen does not go blank or white when pressed gently."], link: { phrase: "cracked screen glass or full screen", href: "/guides/cracked-screen-glass-or-full-screen" } },
      { h: "What should I do before bringing in a cracked phone?", p: ["If touch still works, back up your photos, contacts and chats first. Put a strip of clear packing tape over the cracks. It holds loose pieces in place so they do not fall out, cut a finger or press into the panel underneath.", "Do not press on the cracks: sharp edges can puncture the display below and turn a glass job into a screen change. Keep the phone away from water, because a cracked front lets moisture in. Do not try glue, liquid adhesive or a blade on loose pieces."] },
      { h: "How is the glass replaced at the bench (glass kaise badla jata hai)?", p: ["The bench first checks the display under the glass for black spots, colored lines and dead pixels. If the panel passes, the phone goes to glass separation: controlled heat and vacuum loosen the bond between the cracked glass and the display, and the broken glass is lifted off.", "The old bonding layer is cleaned off your original panel, new glass is aligned and laminated on, and touch is tested in every corner and across the keyboard area. Then the phone is sealed in a pouch with its job card for collection. You can watch the work at the bench on request when it is not busy."] },
      { h: "Glass, screen protector or panel: what actually broke?", p: ["People often mix up three layers. A screen protector is the thin sheet you stuck on yourself and can peel off. The touch glass is bonded at the factory and is what you swipe on. The display panel under it makes the picture and the colors.", "If only the glass broke, the phone still works normally apart from the cracks. If the panel broke, you see ink-like black spots that spread, colored lines or a blank screen, and new glass will not fix that. Then the phone needs a screen replacement instead."] },
    ],
  },
  {
    slug: "galaxy-z-fold-flip",
    title: "Foldables (Duo, Z Series, Pixel)",
    short: "Outer glass, inner screen and hinge on all foldables, including Duo, Galaxy Z Series and Pixel Fold.",
    long: "Outer glass, inner screen and hinge repairs on all foldables, including Duo, every Galaxy Z Series generation and Pixel Fold. The shop tries to save the damaged panel first and replaces it only when it cannot be saved.",
    faults: ["Outer glass", "Inner screen", "Hinge", "Blank display", "Lines on screen"],
    image: "fold-inner-panel",
    detailPhoto: "fold-hinge",
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
      { q: "Why will my fold phone not open flat (poora seedha kyun nahi khulta)?", a: "Usually dirt or lint in the hinge, or a bent frame after a drop. Rehan Traders checks hinge tension and frame alignment at the bench in Hafeez Center and tells you what it needs. Do not force it open meanwhile." },
      { q: "Can a bad hinge damage the inner screen (kharab hinge se screen kharab)?", a: "Yes. A hinge that is stiff or out of line presses unevenly on the flexible panel each time you open or close the phone, which can cause spots or lines at the crease. Getting the hinge looked at early protects the screen." },
      { q: "Will changing the outer glass touch my inner screen?", a: "No. The cover screen and the inner screen are separate parts. The outer glass is worked on by itself, and the inner screen is checked at the start so you know its condition before any work begins." },
    ],
    related: ["touch-glass-replacement", "screen-replacement", "board-repair"],
    answers: { model: "Yes. All foldables, including Duo, every Galaxy Z Series generation and Pixel Fold.", time: "Up to a day, depending on the repair, parts availability and the model. Never guaranteed." },
    proof: ["Zunair K.", "Xhah A.", "Ali R."],
    seo: {
      title: "Z Fold and Flip screen repair, Lahore",
      description: "Z Fold and Z Flip screen repair at Hafeez Center, Lahore: inner screen, outer glass and hinge on every foldable. Free checking first.",
    },
    intro: "Yes, foldables are repaired at Rehan Traders, Shop G-88, Hafeez Center, Lahore: Galaxy Z Fold and Z Flip screen repair, outer glass, inner screens and stiff or loose hinges, on Duo, every Galaxy Z Series generation, Pixel Fold and other foldables. The free check comes first, and the shop tries to save your inner panel before replacing it.",
    detail: [
      { h: "What is repaired on a foldable (fold phone mein kya theek hota hai)?", p: ["A foldable has two displays and a hinge, and each can fail on its own. Rehan Traders works on all three: the outer cover screen and its glass, the flexible inner screen, and the hinge that joins the two halves.", "The shop's first aim is to keep the panel you have. When only the outer glass is cracked and the picture is clean, only the glass is changed. When the inner screen blanks out or shows lines, the bench checks whether the fault is in the panel or its connection before deciding it needs a new one."], list: ["Cracked outer glass on the cover screen", "Inner screen with lines, a black patch or no picture", "Blank inner display while the phone still rings", "Stiff, loose or crunchy hinge", "Touch dead along the fold line"] },
      { h: "Signs your fold screen or hinge is failing (fold screen kharab hone ki nishaniyan)", p: ["Most foldable faults start after a drop, pressure in a pocket or grit getting into the spine. Catching them early matters, because a hinge that has started to bind keeps pressing on the inner panel every time you open the phone."], list: ["Black ink-like spots spreading from the crease", "A pink, green or white line across the inner screen", "The hinge resists, clicks or will not open flat", "Touch stops working along the crease or on one half", "The inner screen stays dark while calls and notifications still come in", "The outer glass is cracked while the inner screen is fine"] },
      { h: "What to do before bringing your foldable in", p: ["If the screen still responds, back up your data. On Galaxy phones you can also turn on Maintenance Mode in settings, which keeps your own files locked while the phone is handed over.", "Do not force a hinge that feels stiff or gritty: the extra pressure can tear the flexible panel from behind. Do not press a fingernail into the crease or peel the factory film on the inner screen. Carry the phone closed and padded."] },
      { h: "How the shop checks and repairs a foldable", p: ["The free check at Shop G-88 looks at hinge tension, frame alignment and the condition of the flexible panel. You hear at the counter whether the panel can be saved, what the repair involves, what it costs and how long it will take. A foldable repair can take up to a day, depending on the repair, parts and the model.", "If the outer display works, only its cracked glass is separated and replaced. Hinge and inner screen work is done at the open bench. Before the phone is sealed in its pouch, it is opened and closed through its full range and touch is tested across the fold line."] },
      { h: "Outer glass or inner panel: which one is damaged?", p: ["The cover screen on the outside is built like a normal phone screen, with rigid glass over a display. If that glass cracks and the picture and touch are fine, it is a glass job, the same idea as a touch glass replacement on a normal phone.", "The inner screen is a thin flexible panel that bends thousands of times. Black blotches, colored lines or dead strips on it mean the panel or its connection is damaged, which is a different and larger repair."], link: { phrase: "touch glass replacement", href: "/repairs/touch-glass-replacement" } },
    ],
  },
  {
    slug: "iphone",
    title: "iPhone repair",
    short: "Screen, back glass, Face ID, battery and charging.",
    long: "iPhone screens, back glass, Face ID, batteries, cameras and charging faults, fixed at the open bench.",
    faults: ["Screen", "Back glass", "Face ID", "Battery", "Charging", "Camera"],
    image: "iphone-back-glass",
    detailPhoto: "iphone-housing-swap", // real job photo, 14 Nov 2026
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
      { q: "Why is my iPhone camera shaking or showing black (camera mein vibration)?", a: "A drop can damage the camera's stabiliser or loosen its cable, which makes the picture shake or go black. Rehan Traders checks the camera at the bench in Hafeez Center and tells you whether it needs the cable seated again or a camera part." },
      { q: "My iPhone battery has swollen (battery phool gayi). Is it dangerous?", a: "A swollen battery can catch fire, so stop charging it and do not press on it. At the bench it is removed carefully and disposed of straight away. A swollen battery is not handed back." },
      { q: "Face ID stopped working after the screen broke. Can it be fixed?", a: "Often the fault is in the Face ID parts at the top of the screen, which can be hurt in the same fall. The free check at Shop G-88 tests Face ID before any screen work, so you know what is wrong and what the repair involves." },
    ],
    related: ["touch-glass-replacement", "battery-charging", "board-repair"],
    answers: { model: "Send your exact iPhone model on WhatsApp and the shop confirms the repair, or bring it in for the free check.", time: timeDepends },
    proof: ["Faizan I.", "Junaid B."],
    seo: {
      title: "iPhone repair in Lahore, Hafeez Center",
      description: "iPhone repair at Hafeez Center, Lahore: screen, back glass, Face ID, battery and charging. Free checking. WhatsApp 0305 8874839.",
    },
    intro: "Rehan Traders does iPhone repair in Lahore at Shop G-88, Ground Floor, Hafeez Center: cracked screens, back glass, batteries, charging, cameras and Face ID. Every iPhone gets a free check first, and you hear what is wrong, whether it can be fixed, the price and the time before any work starts.",
    detail: [
      { h: "What is repaired on an iPhone (iPhone mein kya kya repair hota hai)?", p: ["The open bench works on the front glass and display, cracked back glass, batteries, the charging port, cameras and Face ID. Deeper faults on the logic board, such as a dead phone or charging that stops at the board, go under the microscope for board-level repair.", "If only the front glass is cracked and the display still gives a clean picture, the glass can be changed on its own and your iPhone keeps its display. If the display is damaged, the screen is replaced."], link: { phrase: "board-level repair", href: "/repairs/board-repair" } },
      { h: "Which repair does my iPhone need?", p: ["The same symptom can have different causes, so the check matters. A phone that will not charge may have a blocked port, a worn battery or a fault on the board. These are the signs that point to each repair."], list: ["Shattered front glass, but colors and touch are normal: glass replacement.", "Lines, black patches or no picture: screen replacement.", "Face ID unavailable after a drop or liquid: Face ID check.", "Battery health warning, sudden shutdowns or a jumping percentage: battery.", "Cable charges only at an angle or not at all: charging port or board.", "Camera shows black, shakes or will not focus: camera check.", "Cracked back glass with loose pieces near the camera: back glass."] },
      { h: "Before you bring your iPhone in", p: ["Back up to iCloud or a computer if the screen still works. If the phone has been in water, do not charge it or switch it on: current through wet circuits causes board damage. Do not press on cracked glass, and never use a pin or needle in the charging port.", "If the battery has swollen and the screen is lifting, stop charging it, do not press it back down and do not heat it. Bring it in as it is."] },
      { h: "How an iPhone is checked and repaired at the bench", p: ["Every iPhone goes on a numbered job card. The check tests the display, Face ID, battery health and cameras so faults already there are written down before work starts. A cracked front glass with a good display goes to heat and vacuum separation; power and charging faults are traced with a multimeter and schematics under the microscope.", "After the repair, touch and sensors are tested again. The water-resistance seal is re-applied on request, but no repaired phone should be treated as water resistant. The iPhone is then sealed in a pouch for collection."] },
      { h: "iPhone not charging: port, battery or board?", p: ["Lint packed into the port and worn pins are common, but not the only cause. The battery can be at fault, and so can the charging circuit on the logic board, which a cheap car charger or a power surge can damage. In that case even a new port will not help.", "At the bench, the multimeter and schematics show whether power gets through the port to the charging chips. If the port passes power but the board does not take it, the repair is micro-soldering on the board, not a new connector."], link: { phrase: "Lint packed into the port", href: "/guides/phone-not-charging" } },
      { h: "Face ID and Touch ID: which iPhone has which?", p: ["iPhones from the X onward unlock with Face ID, and the iPhone 8 and the SE keep Touch ID. Face ID relies on a small set of sensors at the top of the screen, so a drop or water can stop it working while the rest of the phone looks fine.", "The check at Shop G-88 tests Face ID along with the display, battery health and cameras, and tells you whether the fault is one sensor, a cable or the board."] },
      { h: "Back glass: both faces are glass from the iPhone 8", p: ["From the iPhone 8 the back is glass too, so one fall can crack both faces. Cracked back glass does not always mean damage inside. The repair is bench work: the broken glass comes off, the frame is cleaned and new glass is fitted."] },
      { h: "Lightning or USB-C: the iPhone 15 changed the port", p: ["The iPhone 15 moved from the Lightning port to USB-C. On either port, a phone that will not charge may only have lint packed into it, and that is cleaned first. If the pins are broken the port is replaced; if the port is fine, the battery or the board is next."], link: { phrase: "the battery or the board", href: "/repairs/battery-charging" } },
      { h: "Other Apple devices: iPads", p: ["For tablets, Rehan Traders mainly repairs Apple iPads: cracked glass, screens, batteries and charging. An iPad gets the same free check as an iPhone, and the iPad repair page has the details."], link: { phrase: "iPad repair page", href: "/repairs/ipad-tablet" } },
    ],
  },
  {
    slug: "screen-replacement",
    title: "Screen replacement",
    short: "Lines, black, green or flickering screens replaced.",
    long: "When the display itself is damaged, with lines, a pink or green screen, a black or blank display or flicker, the screen is replaced. If only the glass is cracked, touch glass replacement keeps your original display instead.",
    faults: ["Lines on screen", "Black or blank display", "Green or white screen", "Flickering"],
    image: "screen-replacement", // no Phase 2 job yet: shows the placeholder,
    detailPhoto: "screen-test",
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
      { q: "Can I keep using a phone with lines or a spreading black spot?", a: "For a short time, but these faults usually grow, and a panel that goes fully black can stop you reaching your data. Back up first, then bring it in for the free check at Shop G-88." },
      { q: "Are there different screen options for my phone?", a: "For many models, yes, and the part you choose affects the price and any warranty. Rehan Traders explains the options for your model at the check or on WhatsApp before any work starts, and you decide." },
      { q: "My phone fell and the screen is black, but it still rings (screen black, phone chal raha hai). What is wrong?", a: "Usually the display panel or its connection has failed while the rest of the phone works. The free check tells you which one it is before anything is replaced." },
    ],
    related: ["touch-glass-replacement", "galaxy-z-fold-flip", "water-damage-data-recovery"],
    answers: { model: "iPhone, Samsung, Google Pixel, OnePlus and other brands. Send your exact model on WhatsApp and the shop confirms it.", time: "A normal screen change can take as little as 60 minutes, depending on parts and the model. Complex devices such as foldables can take up to a day. Never guaranteed." },
    seo: {
      title: "Phone screen replacement in Lahore",
      description: "Phone screen replacement at Hafeez Center, Lahore for lines, black, green or flickering displays. Free checking first: 0305 8874839.",
    },
    intro: "For phone screen replacement in Lahore, bring the phone to Rehan Traders, Shop G-88, Ground Floor, Hafeez Center. If your display shows lines, black patches, a green or white screen or flicker, the free check confirms whether the fault is in the screen or the board, and the screen is replaced only when the panel cannot be saved.",
    detail: [
      { h: "Which phones and display faults are covered (mobile display change)?", p: ["This repair is for a damaged display panel, the part under the glass that makes the picture. Rehan Traders replaces screens on iPhone, Samsung, Google Pixel, OnePlus and other Android phones, inner and outer screens on foldables, and screens on iPads.", "OLED, AMOLED and LCD panels all fail in similar ways: the picture breaks up, goes black or flickers. When the panel itself has failed, new glass on top will not help and the whole display has to be changed."] },
      { h: "Signs the screen itself is damaged (screen kharab hone ki nishaniyan)", p: ["Cracked glass alone does not mean the panel is gone. These are the faults that come from the panel, and they stay the same whatever app is open. Our guide on lines on a phone screen explains what each kind of line usually means."], list: ["Green, pink or white lines that do not go away", "Black ink-like patches that spread", "A black screen while calls still ring", "Flicker or a flashing backlight", "Dead touch areas or the phone tapping by itself", "Colored bars across the picture"], link: { phrase: "lines on a phone screen", href: "/guides/lines-on-phone-screen" } },
      { h: "What to do before bringing in a damaged screen", p: ["If touch still works, back up your photos, contacts and chats now: a failing panel can go fully black at any time. Switch the phone off if the screen flashes hard or the phone gets warm.", "Do not press on spreading spots or lines, do not pry the edges with a blade, and keep the phone away from water."] },
      { h: "How a screen replacement is done and tested", p: ["The free check comes first: the bench confirms whether the fault is the display panel or the board's output to it, before any part is ordered or fitted. Once the panel is confirmed as the fault, the damaged screen is taken off and the new one is fitted and connected.", "Before the phone is sealed in its pouch, brightness, touch across the whole screen and color balance are checked. A normal screen change can take as little as 60 minutes, depending on parts and the model."] },
      { h: "Can lines on the screen come from the motherboard (board ka fault)?", p: ["Yes. A loose display connector, a damaged display power circuit or a fault on the board can produce lines or a black screen even when the panel is fine. That is why the panel and the board are checked first: a new screen does not fix a board fault, and you should not pay for one.", "If the board is the problem, the job moves to motherboard repair under the microscope. If only the outer glass is cracked and the picture is clean, it is a touch glass replacement, and your original display stays."], link: { phrase: "motherboard repair", href: "/repairs/board-repair" } },
    ],
  },
  {
    slug: "battery-charging",
    title: "Battery and charging",
    short: "Batteries that drain fast and ports that will not charge.",
    long: "Battery replacement and charging port repair. Swollen batteries are removed and disposed of safely.",
    faults: ["Battery drains fast", "Swollen battery", "Not charging", "Loose charging port"],
    image: "battery-swap",
    detailPhoto: "battery-bench", // real shop photo
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
      { q: "Why does my phone get hot while charging (charging pe phone garam)?", a: "A little warmth is normal. Real heat usually means a worn cell, a damaged port pin or a fault in the charging circuit. The free check at Hafeez Center finds which one before anything is changed." },
      { q: "Can pocket lint stop a phone from charging (charging jack mein kachra)?", a: "Yes. Lint packs into the bottom of USB-C and Lightning ports until the cable cannot seat fully. Cleaning it out often brings charging back without any new part." },
      { q: "Can a damaged charger or cable harm my phone (kharab charger se nuksan)?", a: "It can. A frayed cable or an unstable adapter can bend port pins and stress the charging circuit. Replace damaged cables, and use a sound charger after a repair." },
    ],
    related: ["iphone", "board-repair", "ipad-tablet"],
    answers: { model: askModel, time: timeDepends },
    seo: {
      title: "Battery and charging repair, Lahore",
      description: "Phone battery and charging port repair at Hafeez Center, Lahore: fast drain, swollen battery, not charging. Free checking first.",
    },
    intro: "Battery and charging repair is done at Rehan Traders, Shop G-88, Hafeez Center, Lahore, for phones that drain fast, swell, shut down or will not charge. The free check finds whether it is the battery, the charging port or the board, then the port is cleaned or replaced, or the battery is changed.",
    detail: [
      { h: "What battery and charging faults are repaired (mobile battery aur charging repair)?", p: ["The bench replaces worn and swollen batteries and repairs or replaces charging ports, USB-C, Lightning and older micro-USB. A port packed with lint is cleaned first; if its pins are broken, the port or its charging flex is replaced.", "When the fault sits deeper, on the power chips of the motherboard, it goes to board-level repair. On an iPhone, choosing an original battery means battery health shows and the \"Unknown Part\" message can be removed."], link: { phrase: "board-level repair", href: "/repairs/board-repair" } },
      { h: "Signs of a dying battery or a bad charging port (battery kharab hone ki nishani)", p: ["Cells wear out with charge cycles and heat, and ports wear out with cable strain and pocket lint. Both give warnings before the phone stops altogether."], list: ["The percentage drops from around a third to empty very quickly", "The phone shuts down during calls, games or the camera", "The cable has to be held at an angle to charge", "The cable sits loose and slips out of the port", "No charging icon at all when plugged in", "The screen or back cover is lifting because the battery has swollen"] },
      { h: "What to do before bringing the phone in", p: ["First try another charger and cable: a faulty adapter or cable is the cheapest fix. If charging is still unreliable, bring your usual cable so the bench can see how it fits in the port. Our guides on a phone not charging and a battery draining fast cover more things to try at home.", "If it is swelling or getting hot, unplug the charger, switch the phone off and never press, poke or puncture it. Do not dig in the port with a needle, safety pin or clip: metal can short the contacts and bend the pins."], link: { phrase: "a phone not charging", href: "/guides/phone-not-charging" } },
      { h: "How battery and charging faults are found and fixed", p: ["Testing starts with the power draw: the bench measures current draw, charging rate and battery wear, which shows where the fault is. A clogged port is cleaned; broken pins or a worn cell mean a replacement part.", "After the new part is fitted, the phone is charged and watched for stable voltage and temperature. Swollen batteries are disposed of safely straight away, and the phone is sealed in a pouch."] },
      { h: "Port, battery or motherboard: which one is it (charging port kharab hai ya battery)?", p: ["A phone that will not take a charge may only have lint stopping the cable from seating, or bent pins inside the port. A phone that charges normally but dies within a couple of hours usually has a worn cell.", "A failing charging chip on the board can look like either: it can get hot, refuse cables or drain a new battery overnight. That is why the free check measures before anything is replaced, so you do not pay for a part you did not need."] },
    ],
  },
  {
    slug: "water-damage-data-recovery",
    title: "Water damage and data recovery",
    short: "Wet or dead phones cleaned, repaired and your data recovered.",
    long: "Liquid-damaged and dead phones are opened, cleaned and repaired at board level, with your data recovered first where possible.",
    faults: ["Water damage", "Phone will not turn on", "Data recovery"],
    image: "wet-board-cleaning",
    detailPhoto: "ultrasonic-clean", // agy image of the bench (15 Nov 2026); swap for a real job photo when Adnan sends one
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
      { q: "My phone fell in tea, juice or salt water (chai ya namkeen pani). Is that worse?", a: "Usually, yes. Sugar and salt speed up corrosion on the board more than clean water does. Switch the phone off and bring it in quickly so the residue can be cleaned off before it does more damage." },
      { q: "Will my phone be waterproof again after the repair (dobara waterproof hoga)?", a: "No. Rehan Traders re-applies the water-resistance seal on request, but a phone that has been opened should never be treated as water resistant. Keep it away from water after the repair." },
      { q: "My phone worked after getting wet but died days later. Can it still be fixed?", a: "Often, yes. Water left inside keeps corroding the board, which is why phones fail days later. The board can still be cleaned and repaired, though sooner is better. The free check tells you what can be saved." },
    ],
    related: ["board-repair", "screen-replacement", "battery-charging"],
    answers: { model: askModel, time: "Anywhere from 8 hours to several days, depending on how severe the damage is. Data recovery time depends on the phone's condition." },
    seo: {
      title: "Water damaged phone repair, Lahore",
      description: "Phone fell in water? Turn it off, do not charge it, and bring it to Hafeez Center, Lahore for cleaning, repair and data recovery.",
    },
    intro: "For water damage phone repair in Lahore, bring the phone to Rehan Traders, Shop G-88, Ground Floor, Hafeez Center, switched off and not charged. The phone is opened, the battery disconnected, the board cleaned of corrosion and repaired under the microscope, with your data recovered first where possible.",
    detail: [
      { h: "What can be repaired after water damage (pani wale phone mein kya theek hota hai)?", p: ["This covers phones and tablets that got wet from rain, a spill, a sink or a pool. The bench works on dead phones that will not turn on, boards with corrosion and mineral deposits, shorted power lines, and screens or ports that stopped working after liquid got in.", "When a phone will not start, getting your photos, contacts and documents back is the first priority, before the phone itself."], list: ["Phone dead after getting wet", "Corrosion and deposits on the board", "Short circuits that stop it starting or charging", "Display, speaker or microphone faults after liquid", "Data recovery from a dead phone"] },
      { h: "Signs water got inside (phone mein pani jane ki nishaniyan)", p: ["Water can sit under the metal shields on the board and corrode it slowly, even if the phone worked at first. Days later it can start to fail. Watch for these signs."], list: ["The phone will not turn on, or keeps restarting", "Fog or droplets inside the camera lens", "Flicker, lines or a black screen", "The phone gets warm while switched off", "Muffled speaker or a microphone that stopped working", "A liquid detected warning in the charging port"] },
      { h: "Phone fell in water: what to do and what not to do (pani mein gir jaye to kya karein)?", p: ["Switch it off straight away and do not connect a charger or power bank: current through a wet board causes short circuits that burn tracks on the board. Dry the outside, take out the SIM tray and the case, and bring it in as soon as you can. The full first-aid steps are in our guide on a phone that fell in water.", "Skip the rice, the hair dryer and the oven. Rice adds dust and does not reach under the shields, and heat can push water deeper or damage the battery. Shaking the phone spreads the water around."], list: ["Switch the phone off", "Do not charge it", "Remove the SIM tray and case", "No rice, hair dryer, oven or shaking"], link: { phrase: "a phone that fell in water", href: "/guides/phone-fell-in-water" } },
      { h: "How a wet phone is cleaned and repaired at the bench", p: ["The phone is opened as soon as it comes in and the battery is disconnected to stop any further short circuits. The board is taken out so corrosion and deposits can be cleaned from under the shields and around the parts.", "Then the board goes under the microscope. Power lines are tested with a multimeter against the schematics, and burnt parts or damaged tracks are repaired by micro-soldering. The board is checked for short circuits before the phone is put back together. Depending on how severe the damage is, this takes anywhere from 8 hours to several days."] },
      { h: "Data recovery or a working phone again?", p: ["Data recovery means getting a damaged board working long enough to copy your photos and files off. With heavy corrosion inside the board, the phone may not be reliable for daily use afterwards, but your data can still be saved.", "A full repair aims to give you a working phone as well. That is more likely when the phone was switched off quickly and the corrosion has not spread far. The free check tells you which of the two is realistic for your phone."] },
    ],
  },
  {
    slug: "board-repair",
    title: "Motherboard repair",
    short: "Board-level faults found and fixed under the microscope.",
    long: "Motherboard faults, network and SIM faults, Face ID and no-power faults diagnosed and repaired under the microscope.",
    faults: ["No power", "No network or SIM", "Face ID", "Camera", "Vibration"],
    image: "board-microscope",
    detailPhoto: "microscope-mat", // real shop photo
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
      { q: "Will a motherboard repair delete my data (data delete hoga)?", a: "Micro-soldering replaces the failed part, such as a power chip or capacitor, and leaves the storage chip alone. Unless the storage itself is damaged, your photos and files are still there after the repair." },
      { q: "What makes a phone's motherboard short (board short kyun hota hai)?", a: "Common causes are a drop that cracks solder joints, a power surge from a poor charger, and moisture getting inside. Any of these can make a part on a power line short, and the phone then stops powering on." },
      { q: "Is it worth repairing the board instead of buying a new phone?", a: "Often, because only one part has failed and your data stays on the phone. The free check tells you what is wrong, whether it can be fixed and what it will cost, so you can decide before any work starts." },
    ],
    related: ["water-damage-data-recovery", "iphone", "battery-charging"],
    answers: { model: askModel, time: timeDepends },
    seo: {
      title: "Motherboard repair in Lahore",
      description: "Motherboard repair at Hafeez Center, Lahore: dead phone, no network or SIM, Face ID or camera faults, fixed under the microscope.",
    },
    intro: "Motherboard repair in Lahore is done at Rehan Traders, Shop G-88, Ground Floor, Hafeez Center. A phone that is dead, has no network or SIM, or has Face ID, camera or vibration faults is checked free under the microscope, and the one failed chip or circuit is repaired instead of replacing the whole board.",
    detail: [
      { h: "What motherboard faults are repaired (mobile board repair)?", p: ["Board-level repair fixes the damaged part on the phone's motherboard, such as one chip or a small capacitor, instead of swapping the whole board. The bench handles phones with no power, shorted power lines, failed charging circuits, lost network signal, SIM not detected, and camera, vibration and Face ID faults.", "This work is done on iPhones, Android phones and foldables. When a drop or a power surge burns a part, the board is checked to see whether micro-soldering can bring it back."] },
      { h: "Signs of a motherboard fault (mobile board shorting)", p: ["Board faults often look like a bad battery or screen, but a new battery or screen does not fix them. These signs point to the board. If your phone shows the first one, our guide on a phone not turning on lists what to try first."], list: ["The phone will not turn on and does not respond to charging", "It gets hot near the top or middle even when idle", "No service or searching, with a SIM that works in another phone", "Face ID, the sensors or a camera stop working", "It restarts again and again at the logo"], link: { phrase: "a phone not turning on", href: "/guides/phone-not-turning-on" } },
      { h: "Before bringing in a dead phone", p: ["Try a forced restart with the buttons and another charger and cable, to rule out the simple things. If the phone has been wet, keep it switched off and unplugged and bring it in as it is.", "Do not keep charging a dead phone that gets hot: current through a shorted line can damage the parts next to it. Do not open the phone at home. A knife or screwdriver can puncture the battery or scratch the board."] },
      { h: "How a board fault is found and repaired under the microscope", p: ["The board is examined under the microscope for burnt chips, corroded tracks and cracked solder joints. Power lines and short circuits are traced with digital multimeters and the phone's schematics, which shows whether a power chip, a capacitor or a signal line has failed.", "The failed part is removed and replaced by micro-soldering. Then network, power and the other circuits are tested in full before the phone is sealed in its pouch. You can watch the board work under the microscope on request when the bench is not busy."] },
      { h: "Battery, charging port or motherboard: how to tell", p: ["A worn battery usually gets worse slowly: the percentage falls faster and the phone shuts down under load. A worn port feels loose or charges only at an angle. A phone that takes no power at all, with a good cable and charger, often has a fault on the board.", "When a power chip fails or a capacitor shorts, the phone blocks the incoming current to protect itself. Measuring at the bench separates a dead battery, a damaged charging flex and a shorted board, so only the part that failed is replaced."], link: { phrase: "A worn battery", href: "/repairs/battery-charging" } },
    ],
  },
  {
    slug: "ipad-tablet",
    title: "iPad and tablet repair",
    short: "Tablet glass, screens, batteries and charging.",
    long: "Mainly iPad repairs: glass, screens, batteries and charging. Very old, obsolete tablets are not taken in.",
    faults: ["Cracked glass", "Screen", "Battery", "Charging"],
    image: "ipad-screen",
    detailPhoto: "ipad-digitizer", // agy image of the bench (15 Nov 2026); swap for a real job photo when Adnan sends one
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
      { q: "Why is my iPad screen lifting from the frame (screen utha hua hai)?", a: "Usually the battery inside has swollen and is pushing the screen out. Stop charging it, do not press the screen back down, and bring it in so the battery can be removed safely and replaced." },
      { q: "My iPad is not charging (iPad charging nahi kar raha). Is it the port?", a: "If the cable is loose or works only at an angle, the port is the likely cause. If the cable sits firmly and nothing happens, the battery or the iPad's charging circuit may be at fault. The free check tells you which." },
      { q: "Does a cracked iPad screen get worse if I keep using it?", a: "Cracks spread with use and pressure, and loose glass can cut a finger or damage the display under it. Tape over the cracks and get it checked before a glass job turns into a screen change." },
    ],
    related: ["touch-glass-replacement", "screen-replacement", "battery-charging"],
    answers: { model: "Mainly Apple iPads. For another tablet, ask on WhatsApp first. Very old, obsolete tablets are not taken in.", time: timeDepends },
    seo: {
      title: "iPad repair in Lahore, Hafeez Center",
      description: "iPad repair at Hafeez Center, Lahore: cracked glass, broken screen, battery and charging faults. Free checking. WhatsApp 0305 8874839.",
    },
    intro: "Rehan Traders does iPad repair in Lahore at Shop G-88, Ground Floor, Hafeez Center: cracked glass, broken screens, worn or swollen batteries and charging ports. Checking is free and comes first. For another tablet brand, ask on WhatsApp before you come. From outside Lahore, you can send it by courier.",
    detail: [
      { h: "Which tablets and faults are repaired (iPad repair Hafeez Center)?", p: ["The shop mainly repairs Apple iPads, including the iPad, iPad Air, iPad mini and iPad Pro lines. For an Android or other tablet, send the model on WhatsApp first and the shop tells you whether it can be done. Very old, obsolete tablets are not taken in.", "The bench replaces cracked glass and damaged screens, changes worn and swollen batteries, and repairs Lightning and USB-C charging ports."], list: ["Cracked front glass", "Damaged display with lines or black patches", "Weak or swollen battery", "Loose Lightning or USB-C port"] },
      { h: "Signs your iPad needs a repair (tablet ki touch kaam nahi kar rahi)", p: ["Tablets usually warn you before they fail completely. Cracked glass can still take touch, while a damaged panel shows lines or blank patches. A worn battery shuts the iPad down early, and a swollen one pushes the screen outward."], list: ["Cracked glass with a clear picture underneath", "Black spots, colored lines or blank areas", "Touch dead in some areas, or phantom taps", "Battery drains fast or the iPad shuts down", "The screen is lifting away from the frame", "The cable has to be held at an angle to charge"] },
      { h: "Before you bring your iPad in", p: ["If the screen still works, back up to iCloud or a computer. Put clear tape over shattered glass so pieces do not fall out or cut you. Switch the iPad off if it gets hot or the screen is lifting.", "Do not try to pry the screen off at home. iPad screens are glued to the case, and a knife or screwdriver can puncture the battery or tear the cables inside. If the iPad got wet, do not charge it."] },
      { h: "How an iPad is repaired at the bench", p: ["The free check looks first at whether only the outer glass is cracked or the display under it is damaged too, and tests charging and the battery. You hear what it needs before any work begins.", "When the display is fine, the cracked glass is separated at the bench. For a battery change the screen is lifted with care to reach the battery without straining the cables. Touch is tested across the whole screen, then the iPad is cleaned and sealed in a pouch."] },
      { h: "Can only the iPad glass be replaced?", p: ["It depends on the model. On some iPads the glass sits over a separate display, and if the picture is clean, without lines, dark patches or flicker, the glass can be changed on its own. On others the glass and display are one bonded unit and the whole screen is replaced. It works the same way as a touch glass replacement on a phone.", "If the display under the glass is cracked, leaking or black, the screen has to be replaced on any model. The free check tells you which your iPad needs."], link: { phrase: "touch glass replacement", href: "/repairs/touch-glass-replacement" } },
    ],
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
    description: "Get a phone repair quote in Lahore: pick your fault or send photos, and Rehan Traders, Hafeez Center replies with a quote on WhatsApp.",
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

export type PhonePart = "glass" | "panel" | "battery" | "board" | "port"

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
  /** The infographic: a numbered drawing (components/figures) and its key. Every line restates this guide's own text. */
  figure?: { title: string; caption: string; items: { label: string; text: string }[] }
  /** The part the 3D phone highlights for this guide. */
  part?: PhonePart
  /** Repair slugs this guide leads to. */
  services: string[]
  published: string
  updated: string
}

/** Researched from Google autocomplete and People also ask for Pakistan, 2 Nov 2026 (English, Roman Urdu). General advice only; anything about the shop is a confirmed fact. */
const atShop = `${site.address.short}, ${site.address.city}`
const g2 = { published: "2026-11-02", updated: "2026-11-13" } // 13 Nov: the infographic and 3D phone

export const guides: Guide[] = [
  {
    slug: "cracked-screen-glass-or-full-screen",
    title: "Cracked phone screen: new glass or a whole new screen?",
    seo: {
      title: "Cracked phone screen: glass or full screen?",
      description: "Does a cracked phone need only new touch glass or a full screen change? How to tell, what each fixes, and how to get it checked free.",
    },
    answer:
      "If the picture under the cracks is clean, with no lines, black spots or flicker, and touch works everywhere, usually only the outer glass needs replacing and your display stays. If the screen shows lines, black patches or nothing at all, the display panel itself is damaged and the whole screen has to be changed.",
    sections: [
      {
        h: "What is the difference between touch glass and the screen (panel)?",
        answer:
          "A phone screen is layers bonded together: the outer glass you touch, and the display panel under it that makes the picture. On many phones the touch sensor is built into the panel; on some it is bonded to the glass. Mobile glass replacement changes only the outer glass. A screen or panel change replaces the whole display.",
        link: { phrase: "Mobile glass replacement", href: touchGlassHref },
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
    figure: {
      title: "Cracked phone screen: which layer is damaged",
      caption: "The layers of a phone screen. Cracks in the outer glass with a clean picture need new glass only; lines, black patches or flicker come from the display panel under it.",
      items: [
        { label: "Outer glass", text: "Cracks, but a clean picture and working touch: touch glass replacement." },
        { label: "Display panel", text: "Lines, black or green patches, flicker: screen (panel) change." },
        { label: "Panel or its connection", text: "Black screen, but the phone rings or vibrates: screen check, then a panel change if needed." },
      ],
    },
    part: "glass",
    services: ["touch-glass-replacement", "screen-replacement"],
    ...g2,
  },
  {
    slug: "lines-on-phone-screen",
    title: "Lines on your phone screen: what they mean and how to fix them",
    seo: {
      title: "Lines on phone screen: causes and fix",
      description: "Why green, white or pink lines appear on a phone screen after a drop, water or an update, how to test the panel, and what fixes it.",
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
        h: "What do green, pink, white and yellow lines mean?",
        answer:
          "The colour tells you little about the cause. Green, pink, white and yellow lines all come from the display panel or its connection, and a pink line is not a milder fault than a green one. What matters is whether the line stays through a restart, spreads, or shows on the startup logo.",
      },
      {
        h: "Lines appeared after I dropped the phone (gir jane ke baad line aa gayi). Is it the glass?",
        answer:
          "Probably the panel, even when the glass looks fine. A drop can crack the display layer under uncracked glass or loosen the connector behind it. New glass will not remove a line, and the free check looks at the panel and its connection before anything is replaced.",
      },
      {
        h: "Lines appeared after a software update. Did the update cause it?",
        answer:
          "An update does not physically damage a panel, but a restart can make a weakened panel show its fault, so it feels as if the update caused it. The screenshot test settles it: if the line is missing from a screenshot, it is in the hardware.",
      },
      {
        h: "Will a force restart or a factory reset remove the lines?",
        answer:
          "No. A force restart only restarts the phone, and a factory reset erases your data without touching the display hardware. Back up what you can before the check if the phone still works.",
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
      { q: "Screen par white line aa gayi hai, kya karun?", a: "Take a screenshot while it shows. If the line is not in the screenshot, it is in the display hardware, and the panel needs a check. Send the model and a photo on WhatsApp for a quote." },
      { q: "Phone gir gaya aur screen par yellow line aa gayi. Is the glass the problem?", a: "A line after a drop usually means the panel or its connection, even with uncracked glass. The free check confirms it." },
    ],
    figure: {
      title: "Line on a phone screen: hardware or software?",
      caption: "The screenshot test. A line that is missing from a screenshot, or shows on the startup logo, is in the display hardware.",
      items: [
        { label: "Take a screenshot", text: "Capture the screen while the line is showing, and open it on another phone." },
        { label: "Line not in the screenshot", text: "The fault is in the display panel or its connection. A reset will not remove it." },
        { label: "Line in the screenshot too", text: "Update the phone and check the app you saw it in." },
      ],
    },
    part: "panel",
    services: ["screen-replacement"],
    ...g2,
    updated: "2026-11-15", // 15 Nov: questions people search (line colours, after a drop, after an update)
  },
  {
    slug: "phone-fell-in-water",
    title: "Phone fell in water: what to do right now",
    seo: {
      title: "Phone fell in water: what to do now",
      description: "Phone fell in water? Turn it off, do not charge it, skip the rice and the hair dryer. What to do now, and when to get it opened.",
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
    figure: {
      title: "Phone fell in water: what to do, in order",
      caption: "First steps for a wet phone: off, no charger, case and SIM tray out, port facing down, moving air. No rice, no hair dryer.",
      items: [
        { label: "Turn it off", text: "Take the phone out of the water and turn it off. Do not keep pressing buttons to test it." },
        { label: "No charger", text: "Do not plug in a charger or cable." },
        { label: "Case off, SIM tray out", text: "Take off the case and pull out the SIM tray, then wipe the phone with a dry, soft cloth." },
        { label: "Port facing down", text: "Hold it with the charging port facing down and tap it gently against your hand." },
        { label: "Moving air", text: "Leave it in a dry place with moving air, such as in front of a fan, not in the sun." },
      ],
    },
    part: "board",
    services: ["water-damage-data-recovery"],
    ...g2,
  },
  {
    slug: "phone-not-charging",
    title: "Phone not charging: what to check before a repair",
    seo: {
      title: "Phone not charging? What to check first",
      description: "Phone not charging? Check the cable, adapter and port lint first. Signs it is the charging port, battery or board, and what to do next.",
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
    figure: {
      title: "Phone not charging: where the fault can be",
      caption: "From the wall to the board: what each symptom points to when a phone will not charge.",
      items: [
        { label: "Cable or adapter", text: "Works with another cable: old cable or adapter." },
        { label: "Lint in the port", text: "Plug does not go all the way in: lint in the port." },
        { label: "Charging port", text: "Charges only at an angle or when held: worn charging port." },
        { label: "Battery", text: "Charges, but the battery drops fast or the phone shuts off: worn battery." },
        { label: "Board", text: "No charging with any cable, port clean: board or charging circuit." },
      ],
    },
    part: "port",
    services: ["battery-charging"],
    ...g2,
  },
  {
    slug: "battery-draining-fast",
    title: "Phone battery draining fast: is it settings or wear?",
    seo: {
      title: "Battery draining fast? Causes and fixes",
      description: "Why a phone battery drains fast, how to check battery health on iPhone and Android, and when a swollen or worn battery needs replacing.",
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
    figure: {
      title: "Battery draining fast: settings, wear or swelling",
      caption: "Three kinds of battery trouble: drain from software or settings, a worn battery, and a swollen battery that must be replaced.",
      items: [
        { label: "Sudden drain", text: "After an update, a new app or with weak signal: usually software or settings, and it often settles within a day or two." },
        { label: "Worn battery", text: "Drain that keeps getting worse, or a phone that shuts off with charge left. Apple treats about 80 percent of original capacity as worn." },
        { label: "Swollen battery", text: "The screen or back lifting from the frame, or a gap at the edge. Stop using and charging it, and get it replaced." },
      ],
    },
    part: "battery",
    services: ["battery-charging"],
    ...g2,
  },
  {
    slug: "phone-not-turning-on",
    title: "Phone not turning on: what to try, and when it is the board",
    seo: {
      title: "Phone not turning on? What to try first",
      description: "Phone dead or will not turn on? Charge it properly, force restart it by brand, check if only the screen is dead, or if it is the board.",
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
        h: "My phone will not turn on after a drop (gir jane ke baad on nahi ho raha). What now?",
        answer:
          "Do not keep pressing the power button or plugging and unplugging chargers. Charge it for an hour on a known-good adapter, then try the force restart for your brand. If the phone vibrates, rings or shows up on a computer, it is on and the screen is the fault. If nothing works, the battery or the board took the hit.",
      },
      {
        h: "My phone will not turn on after an update (update ke baad on nahi ho raha)?",
        answer:
          "If the logo appears and the phone restarts again and again, it is powered, and the fault points to software or storage more than to a dead battery. Do not factory reset it before you have asked about your data, because a reset erases it. If there is no logo at all, treat it as a power fault and have it checked.",
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
      { q: "Phone gir gaya, ab on nahi ho raha. Can the data be saved?", a: "Often, if the board can be repaired. Do not keep trying to start it. The free check at Shop G-88 tells you what the damage is and whether your data can be recovered." },
      { q: "Phone update ke baad logo par atka hua hai. Should I reset it?", a: "Not yet. A reset erases the data. Bring it in for the free check first." },
    ],
    figure: {
      title: "Phone not turning on: what to check, in order",
      caption: "Four checks for a dead phone: charge, force restart, a call to see if only the screen is dead, then the battery or the board.",
      items: [
        { label: "Charge it", text: "Use a wall adapter you trust for up to an hour." },
        { label: "Force restart", text: "Hold the buttons for your brand until the logo appears. It does not erase anything." },
        { label: "Call the phone", text: "If it rings or vibrates while the screen stays black, the phone is on and the screen is the problem." },
        { label: "Battery or board", text: "If nothing works, the battery, the charging port or the board needs a check." },
      ],
    },
    part: "board",
    services: ["board-repair", "screen-replacement"],
    ...g2,
    updated: "2026-11-15", // 15 Nov: questions people search (line colours, after a drop, after an update)
  },
  {
    slug: "touch-not-working",
    title: "Phone touch not working: what to try, and what it needs",
    seo: {
      title: "Touch screen not working? What to try",
      description: "Touch not working or ghost touching? Restart, check the protector and safe mode, then see if it needs new touch glass or a full screen.",
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
    figure: {
      title: "Touch not working: protector, glass or panel",
      caption: "The layers a touch passes through, and what each sign usually needs: the protector off, new touch glass, or a screen change.",
      items: [
        { label: "Screen protector", text: "A cracked, lifted or very thick protector can block touches or cause ghost touches. Take it off and test." },
        { label: "Glass and touch layer", text: "Cracked glass, clean picture, touch dead in spots: free check; often new touch glass." },
        { label: "Display panel", text: "Lines, black spots or flicker: screen (panel) change." },
      ],
    },
    part: "glass",
    services: ["touch-glass-replacement", "screen-replacement"],
    ...g2,
  },
  {
    slug: "what-decides-phone-repair-price-lahore",
    title: "What decides a phone repair price in Lahore?",
    seo: {
      title: "What decides a phone repair price in Lahore",
      description: "Why one phone repair costs more than another in Lahore: the model, glass or screen, part quality and parts supply.",
    },
    answer:
      "Five things decide it: the model, what is actually damaged (glass, display or board), the quality of part you choose, whether that part is easy to get this week, and how much bench time the job takes. Nobody can quote honestly without knowing the model and seeing the fault.",
    sections: [
      {
        h: "What makes one phone repair cost more than another?",
        answer:
          "The phone and the fault, together. A cracked glass on a common model, a failed display on a foldable and a dead board after water are three different jobs with different parts, different risk and different hours at the bench. The table shows what moves the price and why.",
        table: {
          head: ["What changes", "Why it moves the price"],
          rows: [
            ["The model", "Rare, new or curved-display phones have fewer parts in the market and take more care to open."],
            ["The damaged layer", "Glass only, the whole display, or a board fault: each needs different parts and a different amount of work."],
            ["Part quality", "Parts come in more than one quality. A better part costs more, and warranty depends on what you choose."],
            ["Parts supply", "Wholesale part prices change daily, so the same repair can cost a different amount next week."],
            ["Bench time", "Separating glass, micro-soldering a chip and re-seating a hinge take different hours."],
          ],
        },
      },
      {
        h: "Why does glass-only cost less than a new screen (glass change ya panel change)?",
        answer:
          "With glass-only repair, the display your phone came with stays and only the cracked top layer is replaced, so you pay for new glass and the work to separate and laminate it. A panel change buys a whole new display. It only works when the picture under the cracks is clean.",
        link: { phrase: "glass-only repair", href: touchGlassHref },
      },
      {
        h: "Does the quality of the part change the price?",
        answer:
          "Yes, and the choice is yours. Parts for the same phone are sold in different qualities, and a cheaper one costs less and may come with different warranty terms. Ask which quality you are being quoted before you agree, and what it means for warranty on that repair.",
      },
      {
        h: "Why does the price change from week to week (rate roz badal jata hai)?",
        answer:
          "Because the parts do. Prices in the mobile parts market move daily, so a number printed on a website can be wrong by the time you read it. That is why Rehan Traders does not publish prices online and quotes each phone when it is checked.",
      },
      {
        h: "Why can't a shop quote a real price without seeing the phone?",
        answer:
          "Two phones of the same model can need different repairs. One has a cracked glass over a healthy display; the other has a damaged panel behind a cracked glass, and a drop can also hurt the board. A price given without checking is a guess, and the real figure can land above or below it.",
        list: [
          "Give the exact model, not just the brand.",
          "Say what you see: lines, black patches, no touch, no charging.",
          "Send a photo of the screen or the damage.",
          "Expect to hear a firm price only after a check.",
        ],
      },
      {
        h: "How do I get a price I can trust?",
        answer: `Get it checked. At ${atShop}, the check is free: the shop tells you what the fault is, whether it can be repaired, what it will cost and how long it will take, and you decide before any work starts. If you can't visit, send the model and photos on WhatsApp.`,
      },
    ],
    faq: [
      { q: "Mobile screen change ka kitna kharcha aata hai?", a: "It depends on the model and on whether only the glass or the whole display has to change, and parts prices move daily, so no honest number fits every phone. Send your model and a photo on WhatsApp to 0305 8874839 for a quote, or bring it in for the free check." },
      { q: "Why doesn't Rehan Traders list prices on the website?", a: "Parts prices change daily and every phone differs, so a listed price would be wrong for many customers. You get the price after the free check, before work starts." },
      { q: "Is checking my phone really free?", a: facts.check },
      { q: "Will the price change after I agree?", a: "You hear the price before work starts, and you decide whether to go ahead." },
      { q: "Does a cheaper part mean a worse repair?", a: "Not always, but it can mean different warranty terms and a different finish. Ask what quality is being quoted, and ask what that means for warranty on your repair." },
    ],
    services: ["touch-glass-replacement", "screen-replacement"],
    published: "2026-11-15",
    updated: "2026-11-15",
  },
]

/**
 * One page per phone brand the shop repairs (Ameer, 15 Nov 2026; PRODUCT.md): /repairs/<slug>. Apple is the iPhone repair page and
 * foldables are the foldables page, so neither is here. Brand-level claims only: no model is said to be repaired, no price, no
 * warranty length, no "original parts". Each page needs 600+ words of its own and under 30% text shared with another brand page
 * (.agency/build/brand-pages/overlap.py). `says` are Roman Urdu phrasings people use; each links to the repair that answers it.
 */
export type Brand = {
  slug: string
  /** As written in running text. */
  name: string
  /** The h1 and the Service name. */
  title: string
  short: string
  image: string
  detailPhoto?: string
  intro: { text: string; link?: InlineLink }[]
  seriesTitle: string
  series: { h: string; text: string; link?: InlineLink }[]
  /** Which repair for which sign: a table in the brand's own terms. */
  table: { title: string; head: string[]; rows: string[][] }
  differTitle: string
  differ: { h: string; text: string; link?: InlineLink }[]
  says: { say: string; service: string }[]
  answers: { model: string; time: string }
  faq: { q: string; a: string }[]
  /** Repair page slugs, at least three. */
  repairs: string[]
  /** Guide slugs. */
  guides: string[]
  /** Brand slugs linked at the foot. */
  others: string[]
  /** Authors of reviews in `reviews.items` that name this brand, text as written. */
  proof?: string[]
  seo: { title: string; description: string }
}

export const brands: Brand[] = [
  {
    slug: "samsung",
    name: "Samsung",
    title: "Samsung repair in Lahore",
    short: "Galaxy S, A and M screens, glass, charging and water damage, checked free at Hafeez Center.",
    image: "machine-corner",
    detailPhoto: "microscope-bench",
    intro: [
      { text: "Galaxy phones reach Hafeez Center in every shape: the A series most people carry, the S series flagships, and older Note phones whose owners refuse to retire them. Rehan Traders, Shop G-88, repairs Samsung phones at an open bench and starts with a free check of what is actually broken." },
      { text: "The check matters more on a Galaxy than on most phones, because the display is AMOLED and the damage under a crack is not always the crack. A clean picture usually means the glass can be replaced on its own. Lines or dark patches mean the panel. Foldable Galaxy Z Fold and Z Flip phones are covered on the foldables page.", link: { phrase: "foldables page", href: "/repairs/galaxy-z-fold-flip" } },
    ],
    seriesTitle: "What goes wrong on Galaxy phones",
    series: [
      {
        h: "S and S Ultra: curved edges and coloured lines",
        text: "The Ultra models from the S20 to the S23 have glass that curves over the sides. It looks good, and it chips at the corners when the phone lands on them. A crack along a curved edge can sit on top of a healthy picture, so the check looks at the picture before anyone says new screen. A green, pink or white vertical line that stays through restarts is different: that is the panel, and new glass cannot remove it.",
        link: { phrase: "new glass cannot remove it", href: "/guides/lines-on-phone-screen" },
      },
      {
        h: "A series: the everyday faults",
        text: "The A series phones in Lahore pockets fail in ordinary ways: glass cracked by a fall, a charging port that wobbles, a battery that no longer lasts the day. If the phone throws up a moisture warning in the charging port and keeps refusing to charge after it has dried, the port or the small board under it needs a look.",
        link: { phrase: "charging port", href: "/repairs/battery-charging" },
      },
      {
        h: "Water, and the photos inside",
        text: "A Galaxy S22 Ultra that went into water and came back with its data is described in one of the shop's Google reviews. Water damage is board work, and the first job is getting the battery out of the circuit before corrosion spreads.",
        link: { phrase: "Water damage", href: "/repairs/water-damage-data-recovery" },
      },
    ],
    table: {
      title: "Which repair does your Galaxy need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["Cracked glass, clean picture, touch fine", "Glass only; the Galaxy keeps its display"],
        ["A green, pink or white line that stays", "A new panel; glass cannot remove a line"],
        ["Crack at the curved edge of an Ultra", "Free check first; an edge crack does not always reach the picture"],
        ["Moisture warning that stays after drying", "The charging port, or the board under it, needs a look"],
        ["Wet Galaxy that will not start", "Water damage repair, with your data tried first"],
      ],
    },
    differTitle: "What is different about repairing a Galaxy",
    differ: [
      { h: "Glass only, when the panel is fine", text: "Touch glass replacement keeps the display your Galaxy came with and changes only the cracked top layer. It suits a phone whose picture and touch still work everywhere. Curved glass takes more care to separate than flat glass, so the shop confirms your exact model before it promises glass-only." },
      { h: "The fingerprint reader decides which screen fits", text: "Galaxy S flagships read fingerprints with an ultrasonic sensor under the display, while some A models such as the A52 and A54 use an optical one. A replacement screen has to suit the reader your model carries, or unlocking can stop working. Ask about it before you agree to a screen change." },
      { h: "Your data before the bench", text: "Samsung's Maintenance mode hides your personal data while the phone is out of your hands. You turn it on yourself in Settings; it is worth doing for any phone you hand to a repairer." },
    ],
    says: [
      { say: "Samsung ka panel change karwana hai", service: "screen-replacement" },
      { say: "Samsung ki screen tuti hui hai, sirf glass change ho sakta hai?", service: "touch-glass-replacement" },
      { say: "Samsung charge nahi ho raha", service: "battery-charging" },
      { say: "Samsung pani mein gir gaya", service: "water-damage-data-recovery" },
    ],
    answers: {
      model: "Send your exact Galaxy model on WhatsApp and the shop confirms it, or bring the phone for the free check. Samsung foldables have their own page.",
      time: "A normal Galaxy screen change can take as little as 60 minutes, depending on parts and the model. Water damage and board work take longer, and the check tells you how long.",
    },
    faq: [
      { q: "Samsung ki screen par green line aa gayi. Can it be fixed?", a: "A green, pink or white line that stays through a restart comes from the display panel, not from the glass, so new glass will not remove it. The free check at Shop G-88 confirms the panel is the cause, and the panel is replaced." },
      { q: "Can only the glass of my Galaxy be replaced?", a: "Yes, when the picture and touch are still good under the cracks. Only the top glass is changed, and the display your Galaxy came with stays. On curved models the shop confirms your exact model first." },
      { q: "My Galaxy says moisture was detected and will not charge. What now?", a: "Let the phone dry, with no charger connected, then try again. If the warning stays, bring it in: the charging port or the board under it may need cleaning or replacing." },
      { q: "Will my Galaxy fingerprint reader work after a new screen?", a: "That depends on the screen fitted and on which reader your Galaxy has, ultrasonic or optical. Ask before you agree, and the shop tells you what to expect for your phone." },
      { q: "Do you repair Galaxy Z Fold and Z Flip?", a: "Yes, as with every other foldable: inner screen, outer glass and hinge are all bench jobs, and the foldables page explains how they go." },
    ],
    repairs: ["touch-glass-replacement", "screen-replacement", "battery-charging", "water-damage-data-recovery"],
    guides: ["cracked-screen-glass-or-full-screen", "lines-on-phone-screen"],
    others: ["google-pixel", "oneplus", "xiaomi"],
    proof: ["Junaid B.", "Haadi O."],
    seo: {
      title: "Samsung repair in Lahore, Hafeez Center",
      description: "Samsung repair in Lahore at Hafeez Center: Galaxy glass, screens, charging and water damage. Free checking first. 0305 8874839.",
    },
  },
  {
    slug: "google-pixel",
    name: "Google Pixel",
    title: "Google Pixel repair in Lahore",
    short: "Pixel screens, camera glass, batteries and charging, checked free at Hafeez Center.",
    image: "microscope-station",
    detailPhoto: "parts-drawers",
    intro: [
      { text: "Pixel owners in Lahore tend to be people who chose the phone on purpose, and they want to know what a repair does to the camera, the fingerprint reader and the screen. Rehan Traders, Shop G-88, Hafeez Center, repairs Pixel phones at an open bench and answers those questions after a free check. One of the shop's Google reviews comes from a Pixel Fold owner whose inner display was repaired." },
      { text: "Pixel Fold and Pixel 9 Pro Fold are foldables, and they are handled on the foldables page. The rest of this page is about the slab Pixels: the 6, 7, 8 and 9 families and the a models.", link: { phrase: "foldables page", href: "/repairs/galaxy-z-fold-flip" } },
    ],
    seriesTitle: "Known Pixel faults",
    series: [
      {
        h: "Pixel 8: vertical lines and flicker",
        text: "Google's own help page for the Pixel 8 says a limited number of phones may show vertical lines and flickering on the display, and it runs an Extended Repair Program for them. If your Pixel 8 shows a line, check Google's page first. Outside that program, or on any other Pixel, a line that stays through a restart is a panel fault.",
        link: { phrase: "panel fault", href: "/repairs/screen-replacement" },
      },
      {
        h: "Pixel 7 and 7 Pro: camera glass",
        text: "Owners of the Pixel 7 family reported the glass over the camera bar cracking with no drop to explain it, which 9to5Google reported in January 2023. A cracked camera cover lets dust onto the lens, and it can cut a finger, so it is worth having looked at.",
      },
      {
        h: "Any Pixel: charging and battery",
        text: "Batteries lose capacity with age, and a phone that drains fast or shuts down at 30 percent is asking for a new one. A port that no longer holds the cable is the other common reason a Pixel stops charging; the check starts with cleaning it before anything is replaced.",
        link: { phrase: "new one", href: "/repairs/battery-charging" },
      },
    ],
    table: {
      title: "Which repair does your Pixel need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["A line or flicker on a Pixel 8", "Check Google's Extended Repair Program page, then the panel"],
        ["Cracked glass over a clean picture", "Glass only; your original display stays"],
        ["Cracked camera cover", "Free check; the shop says what the job involves before work starts"],
        ["Drains fast or shuts down early", "Battery check, then the charging port"],
        ["Pixel Fold screen or hinge fault", "Foldable repair: outer glass, inner screen or hinge"],
      ],
    },
    differTitle: "What is different about repairing a Pixel",
    differ: [
      { h: "Send the exact model first", text: "Phones from different brands open differently, and the shop works from the exact model in front of it. Send the model before you come and the shop can tell you what the job involves." },
      { h: "Fingerprint calibration after a screen change", text: "Newer Pixels read your fingerprint through the display, so a replacement screen has to suit the reader, and a calibration step may be needed afterwards. Ask what will happen to the reader before you agree." },
      { h: "Part quality is your choice", text: "Parts for any phone come in more than one quality, and you choose. Ask which one you are being quoted, and what it means for warranty, which the shop discusses once the fault is diagnosed." },
    ],
    says: [
      { say: "Google Pixel ki screen tuti hui hai", service: "touch-glass-replacement" },
      { say: "Pixel ka panel change karwana hai", service: "screen-replacement" },
      { say: "Pixel ki battery jaldi khatam ho jati hai", service: "battery-charging" },
      { say: "Pixel on nahi ho raha", service: "board-repair" },
    ],
    answers: {
      model: "Send your exact Pixel model on WhatsApp and the shop confirms it, or bring the phone for the free check. Pixel Fold and Pixel 9 Pro Fold are handled as foldables.",
      time: "A normal Pixel screen change can take as little as 60 minutes, depending on parts and the model. Foldables and board work take longer; the check tells you how long.",
    },
    faq: [
      { q: "Pixel 8 par vertical line aa gayi hai. Is it covered by Google?", a: "Google runs an Extended Repair Program for a limited number of Pixel 8 phones with display lines and flicker. Check its help page for your phone. If it does not apply, the shop checks the panel free of cost." },
      { q: "Can only the cracked glass of a Pixel be replaced?", a: "When the picture is clean and touch works everywhere, yes: the cracked layer is swapped and your original Pixel display stays. Lines or dark patches mean the panel itself is replaced." },
      { q: "My Pixel's camera glass cracked by itself. Can it be fixed?", a: "Bring it in for the free check. The shop tells you what the repair involves and what it will cost before any work starts." },
      { q: "Will the fingerprint reader still work after a new Pixel screen?", a: "Newer Pixels read the fingerprint through the display, so the screen fitted matters and a calibration step may follow. Raise it before you agree to the repair." },
      { q: "Do you repair Pixel Fold and Pixel 9 Pro Fold?", a: "Yes. They go through the same bench as any foldable: outer glass, inner display and hinge. The foldables page has the details." },
    ],
    repairs: ["touch-glass-replacement", "screen-replacement", "battery-charging", "galaxy-z-fold-flip"],
    guides: ["lines-on-phone-screen", "phone-not-charging"],
    others: ["samsung", "oneplus", "oppo"],
    proof: ["Xhah A."],
    seo: {
      title: "Google Pixel repair in Lahore, Hafeez Center",
      description: "Google Pixel repair in Lahore at Hafeez Center: screens, camera glass, battery and charging. Free checking. WhatsApp 0305 8874839.",
    },
  },
  {
    slug: "oneplus",
    name: "OnePlus",
    title: "OnePlus repair in Lahore",
    short: "OnePlus screens, glass, charging and board faults, checked free at Hafeez Center.",
    image: "parts-drawers",
    detailPhoto: "microscope-station",
    intro: [
      { text: "OnePlus owners tend to know their phones well, and they ask sharper questions than most: will the alert slider survive, will the charging stay fast, will the screen keep its colours. Rehan Traders, Shop G-88, Hafeez Center, repairs OnePlus phones at an open bench, and it answers those questions after a free check rather than before one." },
      { text: "Most OnePlus faults fall into three bins: the display, the charging, and the board. This page takes them in that order." },
    ],
    seriesTitle: "Where OnePlus phones fail",
    series: [
      {
        h: "The green line",
        text: "A green line across a OnePlus screen is a familiar sight on AMOLED phones, and it is a panel fault. New glass cannot remove it, and a restart or reset will not either. The free check confirms that the panel is the cause, and the panel is what gets replaced.",
        link: { phrase: "panel fault", href: "/repairs/screen-replacement" },
      },
      {
        h: "Charging that is no longer fast",
        text: "Warp Charge and SUPERVOOC reach full speed only with the matching charger and cable. A OnePlus that has slowed down is often the cable first and the port second. The check tests with a known-good cable, then looks at the port and the board under it.",
        link: { phrase: "port", href: "/repairs/battery-charging" },
      },
      {
        h: "Dead, restarting or stuck",
        text: "A phone that will not start, or restarts again and again, may have a power fault on the board rather than a software problem. Board work is done under a microscope. Whether the phone can be saved depends on the damage, and the free check tells you plainly.",
        link: { phrase: "Board work", href: "/repairs/board-repair" },
      },
    ],
    table: {
      title: "Which repair does your OnePlus need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["A green line across the screen", "A new panel"],
        ["Slow charging with the right charger", "The cable first, then the port, then the board"],
        ["Alert slider loose or stuck", "Mention it when you book; the free check looks at it"],
        ["Cracked curved glass over a clean picture", "Possibly glass only; confirm your model first"],
        ["Dead, or restarting by itself", "Board check under the microscope"],
      ],
    },
    differTitle: "What is different about repairing a OnePlus",
    differ: [
      { h: "The alert slider", text: "Most OnePlus flagships carry a physical alert slider on the frame, and the cheaper Nord CE and N phones do not. It is a small part to disturb during a repair, so tell the shop if yours feels loose or sticky." },
      { h: "Part quality is your choice", text: "Parts for a OnePlus come in more than one quality, and you choose. Ask which one you are being quoted, and what it means for warranty, which the shop discusses once the fault is diagnosed." },
      { h: "Glass only on a curved screen", text: "Several OnePlus models have a curved display, and curved glass is harder to separate cleanly than flat glass. The shop confirms your exact model before it promises a glass-only repair." },
    ],
    says: [
      { say: "OnePlus ki screen mein green line aa gayi", service: "screen-replacement" },
      { say: "OnePlus ka touch kaam nahi kar raha", service: "touch-glass-replacement" },
      { say: "OnePlus ka charger fast charge nahi kar raha", service: "battery-charging" },
      { say: "OnePlus restart ho raha hai", service: "board-repair" },
    ],
    answers: {
      model: "Send your exact OnePlus model on WhatsApp and the shop confirms it, or bring the phone for the free check.",
      time: "A normal screen change can take as little as 60 minutes, depending on parts and the model. Board work takes longer; the check tells you how long.",
    },
    faq: [
      { q: "OnePlus par green line aa gayi. Can it be fixed?", a: "A green line is a panel fault, so the panel is replaced; glass alone will not remove it. The shop checks the phone free of cost and tells you the repair and what it will cost before any work." },
      { q: "Will my OnePlus charge fast again after a repair?", a: "Fast charging needs the right charger, cable and port working together. The check tests each, and the shop tells you which one is holding yours back." },
      { q: "Can the alert slider be repaired?", a: "Tell the shop when you book. A loose or stuck slider is looked at during the free check, and the shop says what it involves." },
      { q: "Can glass alone be replaced on a curved OnePlus screen?", a: "Sometimes. If the picture and touch are fine the glass can be changed by itself, but curved models need your exact model confirmed before the shop promises it." },
      { q: "My OnePlus is dead and restarts by itself. Can it be saved?", a: "Often a board fault, and board faults are worked on under a microscope. The check is free, and the shop tells you whether it can be repaired." },
    ],
    repairs: ["screen-replacement", "touch-glass-replacement", "battery-charging", "board-repair"],
    guides: ["phone-not-charging", "phone-not-turning-on"],
    others: ["oppo", "vivo", "xiaomi"],
    seo: {
      title: "OnePlus repair in Lahore, Hafeez Center",
      description: "OnePlus repair in Lahore at Hafeez Center: screens, glass, charging and board faults. Free checking first. WhatsApp 0305 8874839.",
    },
  },
  {
    slug: "oppo",
    name: "Oppo",
    title: "Oppo repair in Lahore",
    short: "Oppo A, F, Reno and Find screens, glass, charging and board faults at Hafeez Center.",
    image: "microscope-bench",
    detailPhoto: "machine-corner",
    intro: [
      { text: "If you are looking for Shop G-88, look for the Oppo sign. The big sign on the front of the shop says OPPO, and G-88 is at its left edge. It is only a coincidence of the building, but it means Oppo owners already know where to stand." },
      { text: "Rehan Traders repairs Oppo phones at an open bench: the A and F series that sell in volume, the Reno phones with curved screens, and the Find N flip phones, which are foldables and have their own page.", link: { phrase: "have their own page", href: "/repairs/galaxy-z-fold-flip" } },
    ],
    seriesTitle: "What fails on Oppo phones",
    series: [
      {
        h: "Reno: curved screens",
        text: "Several Reno models have a display that curves at the edges. They photograph well and crack at the corners. A crack on a curved edge does not always mean a dead panel, so the check looks at the picture and the touch before it says glass-only or new screen.",
        link: { phrase: "glass-only", href: "/repairs/touch-glass-replacement" },
      },
      {
        h: "A and F: glass, ports and batteries",
        text: "These are the Oppo phones with the longest working lives, so their faults come from age as much as from drops: a loose charging port, a battery that drains by evening, glass cracked years ago and still being used. All three are ordinary bench jobs.",
        link: { phrase: "loose charging port", href: "/repairs/battery-charging" },
      },
      {
        h: "Slow VOOC",
        text: "VOOC and SuperVOOC charge at full speed only with the matching Oppo charger and cable. If your Oppo has started charging slowly, try the original cable first. If it still crawls, the port or the board under it is the suspect.",
      },
    ],
    table: {
      title: "Which repair does your Oppo need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["A crack at the corner of a Reno", "Free check; glass only if the picture is clean"],
        ["Lines or dark patches", "A new panel"],
        ["Slow charging with the Oppo charger", "Cable, then port, then board"],
        ["Fingerprint fails after a screen change", "The screen fitted may not suit the reader; ask the shop"],
        ["Dead after a drop", "Board check"],
      ],
    },
    differTitle: "What is different about repairing an Oppo",
    differ: [
      { h: "The charger is part of the system", text: "A fast-charge Oppo expects a matching charger, cable and port. Replacing only one of them can leave the phone charging slowly, which is why the check tests all three." },
      { h: "Several Oppo phones read your fingerprint through the screen", text: "On those models a replacement display has to suit the reader behind it, or unlocking can stop working. Ask about it before you agree to a screen change." },
      { h: "Find N Flip", text: "Oppo's Find N2 Flip and N3 Flip are foldable phones. They are repaired like every other foldable: outer glass, inner screen and hinge." },
    ],
    says: [
      { say: "Oppo ka panel change karwana hai", service: "screen-replacement" },
      { say: "Oppo ka sirf upar wala glass toota hai", service: "touch-glass-replacement" },
      { say: "Oppo ka charging jack kharab ho gaya", service: "battery-charging" },
      { say: "Oppo mobile on nahi ho raha", service: "board-repair" },
    ],
    answers: {
      model: "Send your exact Oppo model on WhatsApp and the shop confirms it, or bring the phone for the free check.",
      time: "A normal Oppo screen change can take as little as 60 minutes, depending on parts and the model. Board work takes longer; the check tells you how long.",
    },
    faq: [
      { q: "Oppo ki screen toot gayi. Can only the glass be changed?", a: "Often, yes. A crack in an Oppo's glass does not always reach the display under it. The free check looks at the picture and the touch; glass alone is replaced when the panel is healthy, and lines or dark patches mean a new panel." },
      { q: "Why is my Oppo charging slowly?", a: "VOOC and SuperVOOC work only as a set: Oppo charger, Oppo cable and a healthy port. The check starts with the cable and charger, then moves to the port and the board." },
      { q: "Where exactly is Shop G-88 for Oppo repair?", a: "Ground floor of Hafeez Center, Main Boulevard, Gulberg III. The big sign says OPPO: look for G-88 at its left edge and for Tab House & Rehan Traders Lab along the bottom." },
      { q: "Will my Oppo unlock with a fingerprint after a screen change?", a: "On Oppo models that read the fingerprint through the screen, the replacement display has to suit that reader. Ask first, and the shop says what to expect for your phone." },
      { q: "Do you repair the Oppo Find N Flip?", a: "Yes. The N2 Flip and N3 Flip are foldables, and foldables are repaired here from the outer glass to the hinge." },
    ],
    repairs: ["touch-glass-replacement", "screen-replacement", "battery-charging", "board-repair"],
    guides: ["cracked-screen-glass-or-full-screen", "phone-not-charging"],
    others: ["vivo", "oneplus", "infinix"],
    seo: {
      title: "Oppo repair in Lahore, Hafeez Center",
      description: "Oppo repair in Lahore at Hafeez Center, under the OPPO sign: glass, screens, charging and board faults. Free checking. 0305 8874839.",
    },
  },
  {
    slug: "vivo",
    name: "Vivo",
    title: "Vivo repair in Lahore",
    short: "Vivo Y, V and X screens, glass, charging and board faults at Hafeez Center.",
    image: "workbench-team",
    detailPhoto: "machine-corner",
    intro: [
      { text: "Vivo sells two kinds of phone in Lahore: the Y series that people buy by the dozen for a family, and the V and X phones that people buy for the camera and the finish. They break differently, so Rehan Traders, Shop G-88, Hafeez Center, reads the phone before it reads the price list." },
      { text: "Every Vivo repair starts with a free check at an open bench. The shop tells you what the fault is, whether it can be repaired, what it will cost and how long it will take." },
    ],
    seriesTitle: "Where Vivo phones fail",
    series: [
      {
        h: "V series: curved glass at the corners",
        text: "The V27, V29 and V30 families have curved AMOLED screens. Curved glass breaks at its edges first, and the damage often sits above a display that still works. The check looks at the picture and the touch, and glass-only is offered when the panel is healthy.",
        link: { phrase: "glass-only", href: "/repairs/touch-glass-replacement" },
      },
      {
        h: "Y series: ports and batteries",
        text: "Y phones do hard daily work with budget parts. The usual faults on a phone of that kind are a charging port that loosens, a battery that fades, and glass that cracks in a pocket or a school bag. These are quick bench jobs, and the free check says which of them yours needs.",
        link: { phrase: "charging port", href: "/repairs/battery-charging" },
      },
      {
        h: "X series: camera hardware",
        text: "The X phones are bought for their cameras, and a hard drop can disturb what sits behind the lens: a picture that will not focus, or a lens that rattles. Send your exact model and the check tells you what yours needs.",
      },
    ],
    table: {
      title: "Which repair does your Vivo need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["A crack at a curved V-series corner", "Glass only if the display under it works"],
        ["A wobbly Y-series charging port", "Cleaned first; replaced if the pins are broken"],
        ["Slow FlashCharge", "The matching charger and cable first, then the port"],
        ["Colour-changing back cracked", "Back glass repair; confirm your model"],
        ["Black screen but the phone vibrates", "The panel or its connection"],
      ],
    },
    differTitle: "What is different about repairing a Vivo",
    differ: [
      { h: "FlashCharge needs the matching charger", text: "Vivo's FlashCharge reaches its quoted speed only with the matching Vivo charger and cable. A slow Vivo is often a cable problem before it is a port problem, and the check tries both." },
      { h: "The colour-changing back", text: "Some V phones, such as the V27, have a colour-changing glass back. Back glass is glued on, so it is a job for a heated bench and patience, and the shop confirms your exact model before it promises it." },
      { h: "Curved glass is harder than flat", text: "On a curved V phone the shop confirms your exact model before it promises a glass-only repair." },
    ],
    says: [
      { say: "Vivo ki screen tuti hui hai", service: "touch-glass-replacement" },
      { say: "Vivo ka panel change", service: "screen-replacement" },
      { say: "Vivo ka charging port kharab hai", service: "battery-charging" },
      { say: "Vivo on nahi ho raha", service: "board-repair" },
    ],
    answers: {
      model: "Send your exact Vivo model on WhatsApp and the shop confirms it, or bring the phone for the free check.",
      time: "A normal Vivo screen change can take as little as 60 minutes, depending on parts and the model. Board work takes longer; the check tells you how long.",
    },
    faq: [
      { q: "Vivo V series ki screen kone se toot gayi. Is the display dead?", a: "Not necessarily. A crack at a curved corner can sit on a healthy display. The free check looks at the picture and the touch, and glass alone is replaced when the panel is fine." },
      { q: "Why does my Vivo charge slowly?", a: "FlashCharge needs a Vivo charger and cable that match. The check swaps in known-good ones first, then looks at the port and the board." },
      { q: "Can the colour-changing back of a Vivo V be repaired?", a: "Tell the shop your exact model when you book, and the free check says what the back-glass repair involves." },
      { q: "My Vivo is dead and does not charge. Can it be saved?", a: "The free check at the bench tells you whether it is the battery, the port or the board, and what each repair costs." },
      { q: "Do you replace a Vivo battery?", a: "Yes. Batteries and charging ports are bench jobs, and a battery that has swollen is taken out and disposed of safely straight away." },
    ],
    repairs: ["touch-glass-replacement", "screen-replacement", "battery-charging", "board-repair"],
    guides: ["cracked-screen-glass-or-full-screen", "battery-draining-fast"],
    others: ["oppo", "oneplus", "infinix"],
    seo: {
      title: "Vivo repair in Lahore, Hafeez Center",
      description: "Vivo repair in Lahore at Hafeez Center: Y, V and X screens, glass, battery and charging. Free checking first. WhatsApp 0305 8874839.",
    },
  },
  {
    slug: "infinix",
    name: "Infinix",
    title: "Infinix repair in Lahore",
    short: "Infinix Hot, Note, Zero and Smart screens, charging and board faults at Hafeez Center.",
    image: "microscope-bench",
    detailPhoto: "parts-drawers",
    intro: [
      { text: "Infinix makes four lines you meet in Lahore: Hot, Note, Zero and Smart. All of them sit under Transsion Holdings, the same company that owns Tecno and itel, and the brand's official after-sales network in Pakistan is Carlcare. Rehan Traders is an independent bench in Hafeez Center, which suits the owner who wants a repair today and a second opinion on what it needs." },
      { text: "Every Infinix repair starts with a free check of the phone. You hear the fault and the price before any work, and you decide." },
    ],
    seriesTitle: "What breaks on Infinix phones",
    series: [
      {
        h: "Hot and Smart: the working phones",
        text: "These are the budget phones people use hardest. The faults that follow are cracked glass, a charging port that loses grip on the cable, and a battery that drops from half to nothing. Each is a short bench job once the check has said which one it is.",
        link: { phrase: "battery that drops", href: "/guides/battery-draining-fast" },
      },
      {
        h: "Note: bigger screens, faster charging",
        text: "Note phones carry larger displays and quicker charging, so the display and the charging parts do more of the work. A line across the screen means the panel; a Note that charges slower than it used to means the cable, the port or the board, in that order.",
        link: { phrase: "the panel", href: "/repairs/screen-replacement" },
      },
      {
        h: "Zero: the flagships",
        text: "The Zero line is where Infinix puts its curved displays and its fastest charging. Curved glass breaks at the edge, and a fast-charge phone needs parts that match its charger. The shop confirms your exact model before quoting.",
      },
    ],
    table: {
      title: "Which repair does your Infinix need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["Hot or Smart with cracked glass", "Glass only if the panel works; otherwise the screen"],
        ["A Note that charges slower than before", "Cable, then port, then board"],
        ["A Zero with a cracked curved edge", "Free check; the shop confirms your model before quoting"],
        ["Stuck on the logo or restarting", "Software, storage or board; the check separates them"],
        ["Battery that falls from half to nothing", "Battery replacement"],
      ],
    },
    differTitle: "What is different about repairing an Infinix",
    differ: [
      { h: "Official service is a separate thing", text: "Carlcare is Infinix's own service network. If your phone is under warranty, start there. If it is not, or you want a free check from the person who will work on the phone, the bench at G-88 is the other route." },
      { h: "All-Round FastCharge needs the matching charger", text: "Infinix's fast charging is branded All-Round FastCharge. It runs at full speed only with the matching charger and cable, so a slow phone is often a cable fault." },
      { h: "XOS", text: "Infinix phones run XOS. A phone that restarts or sticks on the logo can be a software fault, a storage fault or a board fault; the free check separates them." },
    ],
    says: [
      { say: "Infinix ki screen tuti hui hai", service: "touch-glass-replacement" },
      { say: "Infinix ka panel kitne ka hai", service: "screen-replacement" },
      { say: "Infinix charging nahi ho raha", service: "battery-charging" },
      { say: "Infinix baar baar restart ho raha hai", service: "board-repair" },
    ],
    answers: {
      model: "Send your exact Infinix model on WhatsApp and the shop confirms it, or bring the phone for the free check.",
      time: "A normal Infinix screen change can take as little as 60 minutes, depending on parts and the model. Board work takes longer; the check tells you how long.",
    },
    faq: [
      { q: "Infinix ka panel change karwana hai. Do you repair Infinix screens?", a: "Yes. The shop checks the phone free of cost, tells you whether glass alone or the whole screen is needed, and quotes before it starts." },
      { q: "Is Infinix warranty affected if I repair elsewhere?", a: "Warranty terms are the brand's, not the shop's. If your phone is under warranty, ask Carlcare first. If it is not, the free check tells you what the repair involves." },
      { q: "Why does my Infinix charge slowly now?", a: "All-Round FastCharge runs at full speed only with the matching charger and cable. The shop tries known-good ones first, then the port and the board." },
      { q: "My Infinix keeps restarting on the logo. What is wrong?", a: "It could be software, storage or the board. Bring it in for the free check, and the shop tells you which and what it will cost." },
      { q: "Can only the cracked glass of my Infinix be replaced?", a: "Yes, when the panel under the crack still works. An Infinix with lines, black patches or dead touch zones needs the whole screen replaced instead." },
    ],
    repairs: ["touch-glass-replacement", "screen-replacement", "battery-charging", "board-repair"],
    guides: ["battery-draining-fast", "phone-not-turning-on"],
    others: ["tecno", "vivo", "xiaomi"],
    seo: {
      title: "Infinix repair in Lahore, Hafeez Center",
      description: "Infinix repair in Lahore at Hafeez Center: Hot, Note, Zero and Smart screens, charging and boards. Free checking first. 0305 8874839.",
    },
  },
  {
    slug: "xiaomi",
    name: "Xiaomi, Redmi and Poco",
    title: "Xiaomi, Redmi and Mi repair in Lahore",
    short: "Xiaomi, Redmi, Redmi Note, Poco and Mi screens, charging and board faults at Hafeez Center.",
    image: "workbench-team",
    detailPhoto: "microscope-station",
    intro: [
      { text: "Xiaomi sells phones under the Xiaomi, Redmi and Poco names, and the old Mi name still turns up on phones people bought a few years ago. They are one company, one family of parts and one bench at Shop G-88, Hafeez Center, which is why Redmi, Redmi Note, Poco and Mi owners share this page." },
      { text: "Every Xiaomi repair starts with a free check. The shop tells you what is broken, whether it can be repaired, what it will cost and how long it will take." },
    ],
    seriesTitle: "What fails on Xiaomi phones",
    series: [
      {
        h: "Redmi Note: the volume phones",
        text: "Redmi Note phones are the ones most people in Lahore mean when they say Redmi. The Note 13 Pro and Pro+ carry AMOLED screens with a fingerprint reader behind them, which makes a cracked screen more than a glass question. A clean picture means glass-only; lines or dark patches mean a new panel.",
        link: { phrase: "glass-only", href: "/repairs/touch-glass-replacement" },
      },
      {
        h: "Redmi and Redmi A: the budget lines",
        text: "These are phones that get dropped, charged overnight and used for years. Cracked glass, a tired battery and a loose charging port are the usual reasons they come in, and each is a short bench job.",
        link: { phrase: "tired battery", href: "/repairs/battery-charging" },
      },
      {
        h: "Poco: performance phones that run hot",
        text: "Poco phones are bought for speed, and speed means heat. Heat shortens battery life and can shorten the life of charging parts. A Poco that gets warm, drains quickly or charges slowly belongs on the bench for a battery and port check.",
      },
    ],
    table: {
      title: "Which repair does your Xiaomi, Redmi or Poco need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["Redmi Note with clean picture under the cracks", "Glass only"],
        ["Coloured lines or ink-like patches", "A new panel"],
        ["A Poco that runs warm and drains fast", "Battery and charging port check"],
        ["Stuck on the MIUI or HyperOS logo", "Software or hardware; the check tells which"],
        ["Charges slowly", "Cable, then port, then board"],
      ],
    },
    differTitle: "What is different about repairing a Xiaomi",
    differ: [
      { h: "MIUI, then HyperOS", text: "Older Xiaomi phones run MIUI and newer ones run HyperOS. A phone stuck on its logo after an update may be a software fault, but a phone that does not show a logo at all is a hardware matter. The free check tells you which." },
      { h: "HyperCharge and the matching charger", text: "Xiaomi's fastest charging, HyperCharge, reaches 120W on some phones and needs the matching charger. A phone that charges slowly is often the cable before it is the phone." },
      { h: "One page for Mi, Redmi and Poco", text: "These are lines of one maker, not separate brands, and a repair is judged by the phone in front of the bench rather than by the name on the box. Send your exact model and the shop confirms it." },
    ],
    says: [
      { say: "Redmi ka panel change karwana hai", service: "screen-replacement" },
      { say: "Redmi ki screen tuti hui hai", service: "touch-glass-replacement" },
      { say: "Xiaomi phone charge nahi ho raha", service: "battery-charging" },
      { say: "Poco phone dead ho gaya", service: "board-repair" },
    ],
    answers: {
      model: "Send your exact Xiaomi, Redmi, Poco or Mi model on WhatsApp and the shop confirms it, or bring the phone for the free check.",
      time: "A normal Xiaomi screen change can take as little as 60 minutes, depending on parts and the model. Board work takes longer; the check tells you how long.",
    },
    faq: [
      { q: "Redmi Note ki screen tuti hui hai. Do I need a new screen?", a: "Not always. Look at the picture first: if it is clean and touch works edge to edge, new glass on the original display is enough. Coloured lines or ink-like patches mean a new panel." },
      { q: "Do you repair Mi phones, or only Redmi?", a: "Both, along with Xiaomi and Poco. They are lines of one maker, and the shop checks the phone in front of it." },
      { q: "Will my fingerprint reader still work after a screen change?", a: "On models with the reader behind the screen, the display fitted decides it. Ask before you agree." },
      { q: "Why does my Xiaomi charge slowly?", a: "Fast charging needs the matching charger and cable. The shop tries known-good ones, then looks at the port and the board." },
      { q: "My Poco got hot and died. Can it be saved?", a: "Possibly. Heat can damage the battery or a board part. The free check says which, and the shop tells you plainly whether it can be repaired." },
    ],
    repairs: ["touch-glass-replacement", "screen-replacement", "battery-charging", "board-repair"],
    guides: ["cracked-screen-glass-or-full-screen", "phone-not-charging"],
    others: ["infinix", "oppo", "vivo"],
    seo: {
      title: "Xiaomi, Redmi and Mi repair in Lahore",
      description: "Xiaomi, Redmi, Poco and Mi repair in Lahore at Hafeez Center: screens, glass, charging and boards. Free checking. 0305 8874839.",
    },
  },
  {
    slug: "tecno",
    name: "Tecno",
    title: "Tecno repair in Lahore",
    short: "Tecno Spark, Camon, Pova and Phantom screens, charging and board faults at Hafeez Center.",
    image: "parts-drawers",
    detailPhoto: "microscope-bench",
    intro: [
      { text: "Tecno sells four lines in Pakistan: Spark, Camon, Pova and Phantom. Spark phones are the everyday ones, Camon the camera phones, Pova the big-battery ones and Phantom the premium line, which includes the Phantom V Fold and V Flip foldables. Rehan Traders, Shop G-88, Hafeez Center, repairs all of them at an open bench." },
      { text: "Like Infinix and itel, Tecno belongs to Transsion Holdings, and its official service network in Pakistan is Carlcare. If your phone is under warranty, start there; if it is not, or you would rather talk to the person who will work on it, bring it to G-88 for a free check." },
    ],
    seriesTitle: "What breaks on Tecno phones",
    series: [
      {
        h: "Spark: glass and ports",
        text: "Spark phones take the knocks of daily use: cracked glass, a charging port that loses grip on the cable, a battery that fades after a year or two. Touch glass replacement keeps the display when the picture is clean, and a port is cleaned before it is replaced.",
        link: { phrase: "Touch glass replacement", href: "/repairs/touch-glass-replacement" },
      },
      {
        h: "Camon: camera island and display",
        text: "Camon phones put the camera up front, and a hard drop can crack the lens cover or knock the camera out of focus. If the display shows a coloured line afterwards, that is a panel fault, not a glass one.",
        link: { phrase: "panel fault", href: "/repairs/screen-replacement" },
      },
      {
        h: "Pova: big batteries",
        text: "Several Pova phones carry batteries of around 6000 mAh. A bigger battery lasts longer and takes longer to swell, but when it does, the phone's back can lift. A swollen battery is removed and disposed of safely, straight away.",
        link: { phrase: "swollen battery", href: "/repairs/battery-charging" },
      },
      {
        h: "Phantom: foldables",
        text: "Phantom V Fold and Phantom V Flip are foldable phones. They are repaired like every other foldable: outer glass, inner screen and hinge. Read the foldables page for how those repairs go.",
        link: { phrase: "foldables page", href: "/repairs/galaxy-z-fold-flip" },
      },
    ],
    table: {
      title: "Which repair does your Tecno need?",
      head: ["What you see", "What it usually needs"],
      rows: [
        ["A Spark with cracked glass", "Glass only if the display is healthy"],
        ["A Camon with a cracked camera cover or a coloured line", "The camera cover or the panel; the check says which"],
        ["A Pova whose back is lifting", "A swollen battery: stop charging, then replace it"],
        ["Phantom V Fold or Flip screen or hinge", "Foldable repair"],
        ["Stuck on the HiOS logo", "Software, storage or board; the check separates them"],
      ],
    },
    differTitle: "What is different about repairing a Tecno",
    differ: [
      { h: "HiOS", text: "Tecno phones run HiOS. A phone that sticks on the logo or restarts by itself can be a software fault, a storage fault or a board fault, and the free check separates them before anything is replaced." },
      { h: "Fast charging parts have to match", text: "A Tecno that charges slowly is the cable first, then the port, then the board. Replacing the wrong one costs money and fixes nothing." },
      { h: "Warranty first", text: "If your Tecno is still under warranty, take it to Carlcare. Rehan Traders discusses warranty on its own repairs once the fault is diagnosed." },
    ],
    says: [
      { say: "Tecno ki screen tuti hui hai", service: "touch-glass-replacement" },
      { say: "Tecno ka panel kitne ka hai", service: "screen-replacement" },
      { say: "Tecno charge nahi ho raha", service: "battery-charging" },
      { say: "Tecno on nahi ho raha", service: "board-repair" },
    ],
    answers: {
      model: "Send your exact Tecno model on WhatsApp and the shop confirms it, or bring the phone for the free check. Phantom foldables are handled as foldables.",
      time: "A normal Tecno screen change can take as little as 60 minutes, depending on parts and the model. Foldables and board work take longer; the check tells you how long.",
    },
    faq: [
      { q: "Tecno Spark ki screen tuti hui hai. Can only the glass be changed?", a: "A cracked Spark often has a healthy display under the glass. If so, only the glass is changed and your display stays; lines or dark patches change the answer." },
      { q: "Tecno ka charging port loose ho gaya. Can it be fixed?", a: "A port packed with lint is cleaned first. If its pins are broken, the port is replaced. The free check tells you which." },
      { q: "My Tecno Pova battery has swollen. What should I do?", a: "Stop charging it and bring it to Shop G-88. A swollen battery is replaced, and the old one is removed and disposed of safely straight away." },
      { q: "Do you repair the Tecno Phantom V Fold and Flip?", a: "Yes. Phantom V Fold and Flip owners get the same foldable repair as anyone else: outer glass, inner screen and hinge." },
      { q: "Should I go to Carlcare or to a shop in Hafeez Center?", a: "Under warranty, Carlcare. Out of warranty, or when you want a free check from the person who will work on the phone, bring it to G-88." },
    ],
    repairs: ["touch-glass-replacement", "screen-replacement", "battery-charging", "galaxy-z-fold-flip"],
    guides: ["phone-not-charging", "battery-draining-fast"],
    others: ["infinix", "xiaomi", "samsung"],
    seo: {
      title: "Tecno repair in Lahore, Hafeez Center",
      description: "Tecno repair in Lahore at Hafeez Center: Spark, Camon, Pova and Phantom screens, charging and batteries. Free checking. 0305 8874839.",
    },
  },
]
