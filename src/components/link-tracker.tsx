"use client"

import * as React from "react"

import { track } from "@/lib/track"

/**
 * Delegated document click listener for links with `data-track` attributes.
 * Allows server components to fire analytics without client conversion or inline onClick handlers.
 * Links that already call track() in onClick must not also carry data-track, or one tap logs twice.
 */
export function LinkTracker() {
  React.useEffect(() => {
    const handleAction = (e: MouseEvent) => {
      // Ignore right clicks
      if (e.button === 2) return

      const target = e.target as HTMLElement | null
      if (!target) return

      const anchor = target.closest("a[data-track]") as HTMLAnchorElement | null
      if (!anchor) return

      const trackType = anchor.getAttribute("data-track")
      const from = anchor.getAttribute("data-track-from") || "unknown"

      if (trackType === "whatsapp") {
        track("whatsapp_click", { from })
      } else if (trackType === "call") {
        track("call_click", { from })
      } else if (trackType === "directions") {
        track("directions_click", { from })
      }
    }

    document.addEventListener("click", handleAction)
    document.addEventListener("auxclick", handleAction)
    return () => {
      document.removeEventListener("click", handleAction)
      document.removeEventListener("auxclick", handleAction)
    }
  }, [])

  return null
}
