"use client"

import * as React from "react"

import { site } from "@/content"
import { formatTime, openStatus } from "@/lib/hours"
import { cn } from "@/lib/utils"

/** Live open/closed line for Asia/Karachi. Computed on the client (the export is static); hidden until then. */
export function OpenStatus({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<ReturnType<typeof openStatus>>()

  React.useEffect(() => {
    const tick = () => setStatus(openStatus(new Date(), site.hours, site.status))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  // ponytail: the placeholder text reserves roughly the right width so the row does not reflow.
  const shown = status ?? { open: true, text: `${site.status.openNow} · ${site.status.closesAt(formatTime(site.hours.days[0].close))}` }
  return (
    <span className={cn("inline-flex items-center gap-1.5 transition-opacity duration-fast", !status && "opacity-0", className)}>
      <i aria-hidden className={cn("size-1.75 rounded-pill", shown.open ? "bg-open" : "bg-steel-soft")} />
      {shown.text}
    </span>
  )
}
