"use client"

import * as React from "react"
import { LazyMotion, MotionConfig, useReducedMotion } from "motion/react"
import * as m from "motion/react-m"

import { duration, ease, reveal } from "@/lib/tokens"

// Wait for an idle moment so the features chunk never competes with first paint and hydration.
const idle = () => new Promise<void>((done) => ("requestIdleCallback" in window ? requestIdleCallback(() => done()) : setTimeout(done, 200)))
const loadFeatures = () => idle().then(() => import("@/lib/motion-features")).then((mod) => mod.default)

/** LazyMotion keeps the motion bundle out of the first load; `m.*` components only. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}

/** Fade + 8px rise, once, at 15% visible. Off under reduced motion. Never wrap the h1. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: reveal.rise }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: reveal.amount }}
      transition={{ duration: duration.reveal, ease: ease.out, delay }}
    >
      {children}
    </m.div>
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
