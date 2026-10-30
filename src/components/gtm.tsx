"use client"

import * as React from "react"

import { loadGtm, startGtm } from "@/lib/track"

/**
 * Google Tag Manager, loaded once the page has finished loading and the main thread is idle, so its ~100 KB never
 * competes with the page's own first paint and hydration. Events tracked before then wait in the dataLayer.
 */
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  React.useEffect(() => {
    startGtm()
    let cancelled = false
    const start = () => {
      const run = () => !cancelled && loadGtm(gtmId)
      if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 4000 })
      else setTimeout(run, 1)
    }
    if (document.readyState === "complete") start()
    else addEventListener("load", start, { once: true })
    return () => {
      cancelled = true
      removeEventListener("load", start)
    }
  }, [gtmId])
  return null
}
