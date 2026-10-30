export type Events = {
  book_start: { service?: string }
  book_step: { step: string; index: number }
  book_submit: { kind: "book" | "quote"; saved: boolean }
  whatsapp_click: { from: string }
  call_click: { from: string }
  directions_click: { from: string }
  chat_open: Record<string, never>
  chat_handoff: { action: "book" | "whatsapp" | "call" }
  estimate_complete: { path: "pick"; fault: string; service: string | null }
  price_view: { service?: string; priceFrom?: number }
}

type Gtag = (command: "event", name: string, params: object) => void

let lastTrack: { name: string; params: string; time: number } | null = null

/**
 * Analytics event. Never pass personal data (names, numbers, free text): only step names, slugs and flags.
 * ponytail: a no-op until Phase 8 loads GA4 and defines window.gtag.
 * Debounced within 100ms to avoid double-firing where link-tracker and inline handlers overlap.
 */
export function track<E extends keyof Events>(name: E, params: Events[E]) {
  if (typeof window === "undefined") return

  const now = Date.now()
  const serialized = JSON.stringify(params)
  if (lastTrack && lastTrack.name === name && lastTrack.params === serialized && now - lastTrack.time < 100) {
    return
  }
  lastTrack = { name, params: serialized, time: now }

  ;(window as { gtag?: Gtag }).gtag?.("event", name, params)
}
