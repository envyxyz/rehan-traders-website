"use client"

import * as React from "react"
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react"
import * as m from "motion/react-m"

import { duration, ease, reveal } from "@/lib/tokens"

/** LazyMotion keeps the motion bundle small; `m.*` components only. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
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
      if (!cancelled) lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
    })
    return () => {
      cancelled = true
      lenis?.destroy()
    }
  }, [])
  return null
}
