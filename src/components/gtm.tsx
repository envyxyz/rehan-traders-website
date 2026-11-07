"use client"

import * as React from "react"

import { site } from "@/content"
import { loadGtm, startGtm } from "@/lib/track"

// Any of these means a person is there (scroll covers wheel and keyboard scrolling).
const FIRST_INPUT = ["pointerdown", "keydown", "touchstart", "scroll"] as const
// Visitors who only read are counted this long after the page has loaded.
const READ_ONLY_WAIT = 6000

/**
 * Google Tag Manager, loaded at the first tap, key or scroll, or 6 s after the page has loaded, whichever comes first, and then
 * when the main thread is idle. gtm.js (~120 KB) pulls in the GA4 tag (~190 KB), and PageSpeed loads a page without touching it, so
 * waiting keeps all of that out of the measured load; people scroll or tap within seconds, so nothing is missed. Events tracked
 * before then wait in the dataLayer. Only on the live site and for people: localhost, previews and automated browsers (the e2e
 * tests) never send hits, so Analytics counts real visitors.
 */
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  React.useEffect(() => {
    if (location.hostname.replace(/^www\./, "") !== new URL(site.url).hostname || navigator.webdriver) return
    startGtm()
    let cancelled = false
    let wait: ReturnType<typeof setTimeout>
    const arm = () => {
      wait = setTimeout(start, READ_ONLY_WAIT)
    }
    const off = () => {
      clearTimeout(wait)
      removeEventListener("load", arm)
      FIRST_INPUT.forEach((e) => removeEventListener(e, start))
    }
    const start = () => {
      off()
      const run = () => !cancelled && loadGtm(gtmId)
      if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 4000 })
      else setTimeout(run, 1)
    }
    FIRST_INPUT.forEach((e) => addEventListener(e, start, { passive: true }))
    if (document.readyState === "complete") arm()
    else addEventListener("load", arm, { once: true })
    return () => {
      cancelled = true
      off()
    }
  }, [gtmId])
  return null
}
