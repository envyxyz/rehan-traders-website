"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"

import { busyReset, busyStart, busyStop, isBusy, subscribe } from "@/lib/busy"
import { duration } from "@/lib/tokens"
import { cn } from "@/lib/utils"

const ROUTE_WAIT = 150 // ms a click may take before the line starts, so a page that is already there shows nothing
const LINE_HOLD = duration.base * 1000 // the finish (200ms) and a beat at full width, then the line goes

/**
 * A 2px red line across the top of the screen while anything is loading: a page, a request, an upload, a chunk (lib/busy.ts).
 * It creeps toward 90% (the `.top-line` animation), then runs to the end when the last thing finishes, and is removed.
 * Pages are static, so a link to one starts it only if the page has not arrived 150ms after the click.
 */
export function TopLine() {
  const line = React.useRef<HTMLDivElement>(null)
  const wait = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const routeBusy = React.useRef(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const el = line.current!
    let state: "idle" | "creep" | "done" = "idle"
    let end: ReturnType<typeof setTimeout>
    const sync = () => {
      if (isBusy()) {
        if (state === "creep") return
        clearTimeout(end)
        // Start from nothing, even in the middle of a finish: out of the page for a frame, so the animation begins again.
        el.hidden = true
        el.removeAttribute("data-done")
        el.style.transform = ""
        void el.offsetWidth
        el.hidden = false
        state = "creep"
      } else if (state === "creep") {
        // From wherever the creep got to, to full width, then away without running back.
        el.style.transform = `scaleX(${el.getBoundingClientRect().width / el.offsetWidth})`
        el.setAttribute("data-done", "")
        void el.offsetWidth
        el.style.transform = "scaleX(1)"
        state = "done"
        end = setTimeout(() => {
          el.hidden = true
          el.removeAttribute("data-done")
          el.style.transform = ""
          state = "idle"
        }, LINE_HOLD)
      }
    }
    const off = subscribe(sync)
    sync()
    return () => {
      off()
      clearTimeout(end)
    }
  }, [])

  // A new page: whatever was in flight is over.
  React.useEffect(() => {
    clearTimeout(wait.current)
    routeBusy.current = false
    busyReset()
  }, [pathname])

  // Pages and forms that load by themselves. Same-origin links with a plain click, and forms that nothing in the page handles.
  React.useEffect(() => {
    const later = () => {
      clearTimeout(wait.current)
      if (routeBusy.current) busyStop()
      routeBusy.current = false
      wait.current = setTimeout(() => {
        routeBusy.current = true
        busyStart()
      }, ROUTE_WAIT)
    }
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !(e.target instanceof Element)) return
      const a = e.target.closest("a[href]")
      // A link that opens a sheet carries data-sheet: it never leaves the page.
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-sheet")) return
      const to = new URL(a.href)
      if (to.origin === location.origin && to.pathname !== location.pathname) later()
    }
    // Bubbling, so a form that the page handles (and so prevented) has already been ruled out.
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target
      if (e.defaultPrevented || !(form instanceof HTMLFormElement) || (form.target && form.target !== "_self")) return
      if (new URL(form.action).origin === location.origin) later()
    }
    // Back to a page kept in memory: it comes back as it left, line and all.
    const onShow = (e: PageTransitionEvent) => e.persisted && busyReset()
    document.addEventListener("click", onClick, true)
    document.addEventListener("submit", onSubmit)
    addEventListener("pageshow", onShow)
    return () => {
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("submit", onSubmit)
      removeEventListener("pageshow", onShow)
      clearTimeout(wait.current)
    }
  }, [])

  return <div ref={line} hidden aria-hidden className="top-line pointer-events-none fixed inset-x-0 top-0 h-0.5 origin-left bg-signal" />
}

/** A photo that has loaded (or failed) stops pulsing its skeleton: `img[data-loaded]` in globals.css. */
export function ImgLoaded() {
  const pathname = usePathname()
  React.useEffect(() => {
    const done = (e: Event) => e.target instanceof HTMLImageElement && e.target.setAttribute("data-loaded", "")
    // load and error do not bubble; capturing at the document sees every photo, including those a later page brings.
    document.addEventListener("load", done, true)
    document.addEventListener("error", done, true)
    return () => {
      document.removeEventListener("load", done, true)
      document.removeEventListener("error", done, true)
    }
  }, [])
  // Photos that arrived before this ran, or from the cache.
  React.useEffect(() => {
    document.querySelectorAll<HTMLImageElement>("img:not([data-loaded])").forEach((img) => img.complete && img.setAttribute("data-loaded", ""))
  }, [pathname])
  return null
}

/** One line of text as a skeleton: the real line's box, with a bar half its height in it. `className` sets the type size and the width. */
export function SkeletonLine({ className }: { className: string }) {
  return (
    <span aria-hidden className={cn("flex h-lh items-center", className)}>
      <span className="skeleton h-1/2 w-full rounded-xs" />
    </span>
  )
}

// A skeleton sheet is on screen, its real sheet not yet: that sheet appears in its place without sliding in (ui/sheet.tsx).
let covering = false
export const isCovering = () => covering

/**
 * Stands in for the booking or chat sheet while its chunk downloads: the same place, size and scrim, with blocks where the
 * first view puts its text and controls. It shows only after 120ms (`.sheet-skeleton`), and the red line starts with it.
 * The frame mirrors SheetContent in ui/sheet.tsx, and it is portalled to the body like that is, out of the launcher's own layer.
 */
export function SheetSkeleton({ kind }: { kind: "booking" | "chat" }) {
  const shown = React.useRef(false)
  React.useEffect(
    () => () => {
      covering = false
      if (shown.current) busyStop()
    },
    []
  )
  const booking = kind === "booking"
  return createPortal(
    <div
      aria-hidden
      className="sheet-skeleton"
      onAnimationStart={(e) => {
        // Only its own delayed reveal, once: the pulsing blocks inside start animations too, and those bubble up here.
        if (e.target !== e.currentTarget || shown.current) return
        covering = true
        shown.current = true
        busyStart()
      }}
    >
      <div className="fixed inset-0 z-50 bg-scrim" />
      <div className={cn("fixed inset-x-2 z-50 flex flex-col overflow-hidden rounded-xl shadow-float sheet-fit sm:left-auto sm:w-md", booking ? "bg-card" : "glass")}>
        {booking ? (
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-5 pb-0 sm:p-6 sm:pb-0">
            <SkeletonLine className="w-3/5 text-title-lg" />
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <SkeletonLine className="w-2/5 text-body-md" />
                <div className="mt-3 flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="skeleton h-1 flex-1 rounded-pill" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <SkeletonLine className="w-1/2 text-title-lg" />
                <div className="flex flex-col gap-2">
                  <SkeletonLine className="w-1/4 text-caption" />
                  <span className="skeleton h-13 rounded-sm" />
                </div>
              </div>
              <div className="mt-auto py-3">
                <span className="skeleton block h-13 rounded-pill" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-6">
            <SkeletonLine className="w-1/3 text-title-lg" />
            <div>
              <SkeletonLine className="w-full text-caption" />
              <SkeletonLine className="w-2/3 text-caption" />
            </div>
            <div className="-mx-6 flex min-h-0 flex-1 flex-col border-t border-hairline">
              <div className="flex min-h-0 flex-1 flex-col px-6 py-4">
                <div className="w-5/6 rounded-lg border border-hairline bg-card px-4 py-3">
                  <SkeletonLine className="w-full text-body-md" />
                  <SkeletonLine className="w-full text-body-md" />
                  <SkeletonLine className="w-1/2 text-body-md" />
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-3 border-t border-hairline px-6 pt-4">
                <div className="flex flex-wrap gap-2">
                  {["w-36", "w-36", "w-32", "w-32"].map((w, i) => (
                    <span key={i} className={cn("skeleton h-11 rounded-pill", w)} />
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-pill border border-hairline p-1.5 pl-5">
                  <SkeletonLine className="w-1/2 text-body-md" />
                  <span className="skeleton ml-auto size-11 rounded-pill" />
                </div>
              </div>
            </div>
          </div>
        )}
        <span className="skeleton absolute top-3 right-3 size-11 rounded-pill" />
      </div>
    </div>,
    document.body
  )
}
