"use client"

import * as React from "react"

import { site } from "@/content"
import { loadGtm, startGtm } from "@/lib/track"

/**
 * Google Tag Manager, loaded once the page has finished loading and the main thread is idle, so its ~100 KB never
 * competes with the page's own first paint and hydration. Events tracked before then wait in the dataLayer.
 * Only on the live site and for people: localhost, previews and automated browsers (the e2e tests) never send hits, so
 * Analytics counts real visitors.
 */
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  React.useEffect(() => {
    if (location.hostname.replace(/^www\./, "") !== new URL(site.url).hostname || navigator.webdriver) return
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
