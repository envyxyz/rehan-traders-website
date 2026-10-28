type Events = {
  book_start: { service?: string }
  book_step: { step: string; index: number }
  book_submit: { kind: "book" | "quote"; saved: boolean }
  whatsapp_click: { from: string }
}

type Gtag = (command: "event", name: string, params: object) => void

/**
 * Analytics event. Never pass personal data (names, numbers, free text): only step names, slugs and flags.
 * ponytail: a no-op until Phase 8 loads GA4 and defines window.gtag.
 */
export function track<E extends keyof Events>(name: E, params: Events[E]) {
  ;(window as { gtag?: Gtag }).gtag?.("event", name, params)
}
