"use client"

import * as React from "react"

import { Icon } from "@/components/icon"
import { ChevronsLeftRight } from "@/components/icons"
import { home } from "@/content"

const copy = home.beforeAfter
const tag = "absolute top-3 rounded-pill bg-card px-3 py-1.5 text-caption text-ink"

/**
 * Drag or arrow-key comparison. A native range input over the photos gives the slider role,
 * aria values, keyboard and pointer for free; the visible handle only follows it.
 * Images arrive as server-rendered nodes (they need the build-time file check).
 */
export function BeforeAfter({ before, after }: { before: React.ReactNode; after: React.ReactNode }) {
  const [pos, setPos] = React.useState(50)
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
      {after}
      <div className="clip-before absolute inset-0">{before}</div>
      <span aria-hidden className={`${tag} left-3`}>{copy.before.label}</span>
      <span aria-hidden className={`${tag} right-3`}>{copy.after.label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={copy.slider}
        aria-valuetext={copy.valueText(100 - pos)}
        className="peer absolute inset-0 size-full cursor-ew-resize appearance-none opacity-0"
      />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-(--pos) w-0.5 -translate-x-1/2 bg-card" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-(--pos) grid size-11 -translate-1/2 place-items-center rounded-pill border border-hairline bg-card text-ink peer-focus-visible:ring-3 peer-focus-visible:ring-ink"
      >
        <Icon icon={ChevronsLeftRight} />
      </div>
    </div>
  )
}
