"use client"

import * as React from "react"

import { Icon } from "@/components/icon"
import { MapPin } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { visit, visitPage } from "@/content"
import { cn } from "@/lib/utils"

// Stable, so React calls it once when the map mounts, not on every render.
const focusOnMount = (map: HTMLIFrameElement | null) => map?.focus()

export function InteractiveMap({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const [active, setActive] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  if (active) {
    return (
      // Until Google's map arrives, its frame pulses in the same 4:3 and corners.
      <div className={cn("overflow-hidden rounded-xl", loaded ? "bg-band" : "skeleton", className)}>
        {/* Focus moves into the map that replaced the button, instead of dropping to the page. */}
        <iframe
          ref={focusOnMount}
          src={visit.mapEmbed}
          title={visit.mapTitle}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          className="aspect-4/3 w-full border-0 dark:map-dark"
        />
      </div>
    )
  }

  return (
    <div className={cn("relative aspect-4/3 w-full overflow-hidden rounded-xl bg-concrete", className)}>
      {children}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-scrim p-6 text-center">
        <Button
          type="button"
          size="lg"
          variant="glass"
          onClick={() => setActive(true)}
          className="h-auto min-h-13 max-w-full cursor-pointer gap-2 py-3 whitespace-normal"
        >
          <Icon icon={MapPin} />
          <span>{visitPage.mapPrompt}</span>
        </Button>
      </div>
    </div>
  )
}
