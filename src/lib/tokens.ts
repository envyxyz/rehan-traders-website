// JS mirrors of tokens in globals.css, for places that cannot read CSS vars (Motion, metadata).
export const duration = { press: 0.1, fast: 0.2, base: 0.35, reveal: 0.7, fold: 1.4 } as const

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const

export const spring = {
  /** Nav top bar to island (Motion `layout`). */
  layout: { type: "spring", bounce: 0, duration: 0.35 },
  /** Sheets: booking, menu, chat. */
  sheet: { type: "spring", bounce: 0, duration: 0.45 },
} as const

/** Scroll reveal: 8px rise, once, when 15% visible. */
export const reveal = { rise: 8, amount: 0.15, stagger: 0.06 } as const

/** Hero copy entrance stagger, seconds (CSS animate-rise). */
export const heroStagger = 0.08

/** Browser chrome colour (metadata cannot use CSS vars). Mirrors --paper. */
export const themeColor = { light: "#f5f5f2", dark: "#0b0b0b" } as const

/** Saved ticket image: always the light brand palette, whatever the screen theme. Mirrors the light tokens. */
export const ticketColors = { paper: "#f5f5f2", panel: "#e9e9e4", hairline: "#d9d9d4", ink: "#0e0e0e", steel: "#5e5e5a", signal: "#d7141a" } as const

/** Open Graph image colours (ImageResponse cannot read CSS variables). The card is black, so steel is the dark-screen value. */
export const ogColors = {
  paper: "#f5f5f2",
  ink: "#0e0e0e",
  steel: "#a4a49f",
  signal: "#d7141a",
} as const
