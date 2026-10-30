import { sendGTMEvent } from "@next/third-parties/google"

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

/**
 * Analytics event. Never pass personal data (names, numbers, free text): only step names, slugs and flags.
 * Pushed to the GTM dataLayer as a custom event; a GA4 event tag in the container sends it on (docs/LAUNCH.md).
 */
export function track<E extends keyof Events>(name: E, params: Events[E]) {
  sendGTMEvent({ event: name, ...params })
}
