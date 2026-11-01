"use client"

import * as React from "react"

/** Lenis wheel smoothing for mouse users only: never on touch, never under reduced motion. */
export function SmoothScroll() {
  React.useEffect(() => {
    const ok = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
    if (!ok.matches) return
    let lenis: { destroy(): void } | undefined
    let cancelled = false
    // Loaded on demand so touch devices never download it.
    import("lenis").then(({ default: Lenis }) => {
      // While a sheet or dialog locks the page (Radix sets data-scroll-locked on body), Lenis lets wheel events
      // go native, so the sheet scrolls and the page behind it stays put.
      if (!cancelled)
        lenis = new Lenis({ autoRaf: true, lerp: 0.1, virtualScroll: () => !document.body.hasAttribute("data-scroll-locked") })
    })
    return () => {
      cancelled = true
      lenis?.destroy()
    }
  }, [])
  return null
}
