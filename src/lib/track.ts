export type Events = {
  book_start: { service?: string }
  book_step: { step: string; index: number }
  book_submit: { kind: "book" | "quote"; saved: boolean }
  whatsapp_click: { from: string }
  call_click: { from: string }
  directions_click: { from: string }
  chat_open: Record<string, never>
  chat_handoff: { action: "form" | "whatsapp" | "call" }
  estimate_complete: { path: "pick"; fault: string; service: string | null }
  price_view: { service?: string; priceFrom?: number }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** GTM reads this queue when it loads, so events pushed before that are still sent. */
const dataLayer = () => (window.dataLayer ??= [])

/**
 * Analytics event. Never pass personal data (names, numbers, free text): only step names, slugs and flags.
 * Pushed to the GTM dataLayer as a custom event; a GA4 event tag in the container sends it on (docs/LAUNCH.md).
 */
export function track<E extends keyof Events>(name: E, params: Events[E]) {
  dataLayer().push({ event: name, ...params })
}

/**
 * GTM's own snippet in two halves, minus the inline script. startGtm queues the page-view event at hydration, so it
 * comes before any tracked click; loadGtm adds gtm.js later, and gtm.js reads the queue in order.
 */
export function startGtm() {
  if (!dataLayer().some((e) => e.event === "gtm.js")) dataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" })
}

export function loadGtm(id: string) {
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`
  document.head.append(script)
}
