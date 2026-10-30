"use client"

import * as React from "react"
import { LazyMotion, MotionConfig } from "motion/react"

import { reveal } from "@/lib/tokens"
import { cn } from "@/lib/utils"

// Wait for an idle moment so the features chunk never competes with first paint and hydration.
const idle = () => new Promise<void>((done) => ("requestIdleCallback" in window ? requestIdleCallback(() => done()) : setTimeout(done, 200)))
const loadFeatures = () => idle().then(() => import("@/lib/motion-features")).then((mod) => mod.default)

/** LazyMotion keeps the motion bundle out of the first load; `m.*` components only (the nav island). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}

/**
 * Fade + 8px rise, once, at 15% visible: the `rise` keyframes (globals.css) started by an IntersectionObserver, so
 * it needs no Motion code and nothing runs per frame. Hidden until it is seen; always shown under reduced motion.
 * Never wrap the h1.
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
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && (setSeen(true), io.disconnect()), { threshold: reveal.amount })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={cn(seen ? "animate-rise" : "opacity-0", "motion-reduce:animate-none motion-reduce:opacity-100", className)}
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
