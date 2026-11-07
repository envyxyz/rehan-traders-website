"use client"

import * as React from "react"

import type { Fold } from "@/components/fold-scene"
import { hero } from "@/content"
import { busyStart, busyStop } from "@/lib/busy"
import { askTilt, onTilt } from "@/lib/tilt"
import { cn } from "@/lib/utils"

// three.js loads on the first interaction of any kind, never with the page (Lighthouse never interacts).
const WAKE = ["pointermove", "pointerdown", "touchstart", "keydown", "wheel", "scroll"] as const
const WAKE_PAUSE = 200 // ms with no interaction before the scene builds
// The poster is the scene's first frame (scripts/fold-poster.mjs), so the canvas fades in over it without a jump.
const POSTER = [480, 800, 1152]
const srcSet = (ext: string, state: "" | "closed" = "") => POSTER.map((w) => `/art/fold-poster${state && `-${state}`}-${w}.${ext} ${w}w`).join(", ")
const SIZES = "(min-width: 64rem) min(36rem, 70svh), (min-width: 30rem) 22rem, 18.5rem"
// Phones: the fold starts shut (its own poster), and opens with its snap the first time most of it is on screen.
const PHONE = "(width < 48rem)"
const OPEN_IN_VIEW = 0.6
const noSubscribe = () => () => {}

/**
 * The hero's Galaxy Z Fold in 3D. Tap or click folds it shut (with a snap) and opens it again. On phones it starts shut
 * and opens itself once scrolled into view. Browsers allow sound only after a tap, so the phone's touch unlocks the audio
 * early; if the visitor has not touched yet, that first opening is silent.
 */
export function Fold3D() {
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const fold = React.useRef<Fold | null>(null)
  const audio = React.useRef<AudioContext | null>(null)
  const pending = React.useRef(false)
  const noScene = React.useRef(false)
  const load = React.useRef(() => {})
  const poster = React.useRef<HTMLImageElement>(null)
  const [ready, setReady] = React.useState(false)
  const [posterIn, setPosterIn] = React.useState(false)
  // Shut until toggled: on phones it starts that way.
  const phone = React.useSyncExternalStore(noSubscribe, () => matchMedia(PHONE).matches, () => false)
  const [toggled, setClosed] = React.useState<boolean | null>(null)
  const closed = toggled ?? phone

  const toggle = React.useCallback(() => {
    const next = fold.current?.toggle(audio.current)
    if (next != null) setClosed(next)
  }, [])

  // The poster may have loaded before this ran.
  React.useEffect(() => {
    if (poster.current?.complete) setPosterIn(true)
  }, [])

  React.useEffect(() => {
    let alive = true
    let off = () => {}
    let seen: IntersectionObserver | undefined
    let opener: IntersectionObserver | undefined
    const shut = matchMedia(PHONE).matches
    // Any tap makes the audio playable, so the opening in view can snap. A scroll does not count: browsers allow sound only after
    // a tap or a key, so a first opening with no tap before it is silent. Kept until the browser lets it run.
    const UNLOCK = ["touchend", "pointerup", "click", "keydown"] as const
    const stopUnlock = () => UNLOCK.forEach((e) => removeEventListener(e, unlock, true))
    const unlock = () => {
      try {
        audio.current ??= new AudioContext()
        void audio.current.resume().then(() => audio.current?.state === "running" && stopUnlock())
      } catch {}
    }
    if (shut) {
      UNLOCK.forEach((e) => addEventListener(e, unlock, { capture: true, passive: true }))
      // Tapped on another page of the site already: this page may play straight away.
      if ((navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive) unlock()
    }
    let pause: ReturnType<typeof setTimeout>
    // Building the scene blocks the page, so it waits for the first pause: a first scroll keeps its smooth nav and frames.
    const wake = () => {
      clearTimeout(pause)
      pause = setTimeout(start, WAKE_PAUSE)
    }
    const start = () => {
      load.current = () => {} // once
      clearTimeout(pause)
      WAKE.forEach((e) => removeEventListener(e, wake))
      // No WebGL: the poster stays and three.js never loads (its renderer logs an error before it throws).
      if (!document.createElement("canvas").getContext("webgl2")) return void (noScene.current = true)
      import("@/components/fold-scene")
        .then(({ createFold }) => createFold(canvas.current!, { closed: shut }))
        .then((f) => {
          if (!alive) return f.dispose()
          fold.current = f
          // The gyroscope runs only while the fold is on screen.
          seen = new IntersectionObserver((entries) => {
            off()
            off = entries.at(-1)!.isIntersecting ? onTilt((t) => f.tilt(t.x, t.y)) : () => {}
          })
          seen.observe(canvas.current!)
          if (shut)
            opener = new IntersectionObserver(
              ([entry]) => {
                if (!entry.isIntersecting) return
                opener!.disconnect()
                if (f.isClosed()) toggle()
              },
              { threshold: OPEN_IN_VIEW }
            )
          setReady(true)
          if (pending.current) {
            busyStop()
            toggle()
          }
          opener?.observe(canvas.current!) // after a waiting tap, which may have opened it already
        })
        .catch(() => {
          noScene.current = true // no WebGL: the poster stays
          if (pending.current) busyStop()
        })
    }
    load.current = start
    // Weak or data-saving phones keep the poster (the same picture); three.js loads there only if the fold is tapped.
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
    const weak = nav.connection?.saveData || (nav.deviceMemory ?? 8) < 4 || navigator.hardwareConcurrency < 4
    if (!weak) WAKE.forEach((e) => addEventListener(e, wake, { passive: true }))
    return () => {
      alive = false
      if (pending.current && !fold.current) busyStop()
      clearTimeout(pause)
      WAKE.forEach((e) => removeEventListener(e, wake))
      stopUnlock()
      seen?.disconnect()
      opener?.disconnect()
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
        else if (!pending.current && !noScene.current) {
          // The tap waits for three.js: the red line shows it is coming.
          pending.current = true
          busyStart()
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
      {/* The phone's shape pulses until the poster has loaded over it; gone for good once it has. */}
      {!posterIn && !ready && <span aria-hidden className="skeleton fold-skeleton" />}
      <picture>
        <source media={PHONE} type="image/avif" srcSet={srcSet("avif", "closed")} sizes={SIZES} />
        <source media={PHONE} type="image/webp" srcSet={srcSet("webp", "closed")} sizes={SIZES} />
        <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
        <img
          ref={poster}
          onLoad={() => setPosterIn(true)}
          src="/art/fold-poster-800.webp"
          srcSet={srcSet("webp")}
          sizes={SIZES}
          width={1152}
          height={1152}
          alt={hero.fold.alt}
          fetchPriority="high"
          className={cn("absolute inset-0 size-full", ready && "opacity-0 transition-opacity delay-(--duration-base)")}
        />
      </picture>
      <canvas ref={canvas} data-ready={ready || undefined} className={cn("absolute inset-0 size-full opacity-0 transition-opacity duration-base ease-out", ready && "opacity-100")} />
    </button>
  )
}
