"use client"

import * as React from "react"

import type { Fold } from "@/components/fold-scene"
import { hero } from "@/content"
import { askTilt, onTilt } from "@/lib/tilt"
import { cn } from "@/lib/utils"

// three.js loads on the first interaction of any kind, never with the page (Lighthouse never interacts).
const WAKE = ["pointermove", "pointerdown", "touchstart", "keydown", "wheel", "scroll"] as const
// The poster is the scene's first frame (scripts/fold-poster.mjs), so the canvas fades in over it without a jump.
const POSTER = [480, 800, 1152]
const srcSet = (ext: string) => POSTER.map((w) => `/art/fold-poster-${w}.${ext} ${w}w`).join(", ")
const SIZES = "(min-width: 64rem) min(36rem, 70svh), (min-width: 30rem) 22rem, 18.5rem"

/** The hero's Galaxy Z Fold in 3D. Tap or click folds it shut (with a snap) and opens it again. */
export function Fold3D() {
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const fold = React.useRef<Fold | null>(null)
  const audio = React.useRef<AudioContext | null>(null)
  const pending = React.useRef(false)
  const load = React.useRef(() => {})
  const [ready, setReady] = React.useState(false)
  const [closed, setClosed] = React.useState(false)

  const toggle = React.useCallback(() => {
    const next = fold.current?.toggle(audio.current)
    if (next != null) setClosed(next)
  }, [])

  React.useEffect(() => {
    let alive = true
    let off = () => {}
    let seen: IntersectionObserver | undefined
    const start = () => {
      load.current = () => {} // once
      WAKE.forEach((e) => removeEventListener(e, start))
      // No WebGL: the poster stays and three.js never loads (its renderer logs an error before it throws).
      if (!document.createElement("canvas").getContext("webgl2")) return
      import("@/components/fold-scene")
        .then(({ createFold }) => createFold(canvas.current!))
        .then((f) => {
          if (!alive) return f.dispose()
          fold.current = f
          // The gyroscope runs only while the fold is on screen.
          seen = new IntersectionObserver((entries) => {
            off()
            off = entries.at(-1)!.isIntersecting ? onTilt((t) => f.tilt(t.x, t.y)) : () => {}
          })
          seen.observe(canvas.current!)
          setReady(true)
          if (pending.current) toggle()
        })
        .catch(() => {}) // no WebGL: the poster stays
    }
    load.current = start
    // Weak or data-saving phones keep the poster (the same picture); three.js loads there only if the fold is tapped.
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
    const weak = nav.connection?.saveData || (nav.deviceMemory ?? 8) < 4 || navigator.hardwareConcurrency < 4
    if (!weak) WAKE.forEach((e) => addEventListener(e, start, { passive: true }))
    return () => {
      alive = false
      WAKE.forEach((e) => removeEventListener(e, start))
      seen?.disconnect()
      off()
      fold.current?.dispose()
      fold.current = null
      void audio.current?.close()
      audio.current = null
    }
  }, [toggle])

  return (
    <button
      type="button"
      aria-label={closed ? hero.fold.open : hero.fold.close}
      className="fold-stage cursor-pointer rounded-xl not-focus-visible:outline-none"
      onClick={() => {
        askTilt()
        // Made inside the tap, so the browser lets it play the snap. No audio is fine: the fold still works.
        try {
          audio.current ??= new AudioContext()
          void audio.current.resume()
        } catch {}
        if (fold.current) toggle()
        else {
          pending.current = true
          load.current() // a click that came with no pointer or key event first (assistive tech, scripts)
        }
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return
        const r = e.currentTarget.getBoundingClientRect()
        fold.current?.tilt(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1)
      }}
      onPointerLeave={() => fold.current?.tilt(0, 0)}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
        <img
          src="/art/fold-poster-800.webp"
          srcSet={srcSet("webp")}
          sizes={SIZES}
          width={1152}
          height={1152}
          // eslint-disable-next-line no-restricted-syntax -- decorative: the button carries the label
          alt=""
          decoding="async"
          className={cn("absolute inset-0 size-full", ready && "opacity-0 transition-opacity delay-(--duration-base)")}
        />
      </picture>
      <canvas ref={canvas} data-ready={ready || undefined} className={cn("absolute inset-0 size-full opacity-0 transition-opacity duration-base ease-out", ready && "opacity-100")} />
    </button>
  )
}
