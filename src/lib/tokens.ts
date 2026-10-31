// JS mirrors of tokens in globals.css, for places that cannot read CSS vars (scripts, metadata).
export const duration = { press: 0.1, fast: 0.2, base: 0.35, reveal: 0.7 } as const

/** Scroll reveal: 8px rise, once, when 15% visible. */
export const reveal = { rise: 8, amount: 0.15, stagger: 0.06 } as const

/** Hero copy entrance stagger, seconds (CSS animate-rise). */
export const heroStagger = 0.08

/** Phone menu: items fade in (CSS animate-rise) from `start` seconds, once the sheet or the Repairs list has slid in, `step` apart. */
export const menuStagger = { start: 0.25, step: 0.05 } as const

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
