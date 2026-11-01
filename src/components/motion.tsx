"use client"

import * as React from "react"

import { reveal } from "@/lib/tokens"
import { cn } from "@/lib/utils"

/**
 * Fade + 8px rise, once, at 15% visible: the `rise` keyframes (globals.css) started by an IntersectionObserver, so
 * it needs no Motion code and nothing runs per frame. The static HTML shows it, so a slow connection never leaves the
 * page blank. Once the page is live, the observer's first report decides: in view already, it stays as it is; below
 * the fold it hides and rises when it is reached. Always shown under reduced motion. Never wrap the h1.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [state, setState] = React.useState<"shown" | "hidden" | "rise">("shown")
  React.useEffect(() => {
    let first = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false
          if (entry.isIntersecting) return io.disconnect() // any part in view when the page came alive: leave it be
          setState("hidden")
        } else if (entry.intersectionRatio >= reveal.amount) {
          setState("rise")
          io.disconnect()
        }
      },
      { threshold: [0, reveal.amount] }
    )
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={cn(state === "hidden" && "opacity-0", state === "rise" && "animate-rise", "motion-reduce:animate-none motion-reduce:opacity-100", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

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
