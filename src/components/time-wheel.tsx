"use client"

import * as React from "react"

import { booking } from "@/content"
import { cn } from "@/lib/utils"

const VISIBLE = 3 // rows on show; the middle one is the pick. Three keep the whole visit step on one screen.
const ROW_REM = 2.75 // h-11, the 44px target
const ROW_PX = 44

type Item = { value: number; text: string }

/**
 * One iOS-style wheel column. Wheel or drag over it to roll, arrow keys to step, click the middle number (or start
 * typing) to type one. Only `items` exist, so it can never roll past the shop's hours.
 */
function Wheel({
  label,
  items,
  index,
  onIndex,
  valueText,
  parse,
}: {
  label: string
  items: Item[]
  index: number
  onIndex: (i: number) => void
  valueText: string
  /** Typed text → the index to jump to (nearest valid), or null to ignore it. */
  parse: (typed: string) => number | null
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [typing, setTyping] = React.useState<string | null>(null)
  const clamp = (i: number) => Math.max(0, Math.min(items.length - 1, i))
  const step = React.useRef({ index, onIndex, clamp })
  React.useEffect(() => {
    step.current = { index, onIndex, clamp }
  })

  // Native, non-passive listener: React's onWheel cannot preventDefault, and the page must not scroll under the wheel.
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let acc = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      // A mouse notch (a big jump, or a line-based delta) is one row; a trackpad's small deltas add up to rows.
      const notch = e.deltaMode === 1 || Math.abs(e.deltaY) >= 50
      acc = notch ? Math.sign(e.deltaY) * ROW_PX : acc + e.deltaY
      const rows = Math.trunc(acc / ROW_PX)
      if (!rows) return
      acc -= rows * ROW_PX
      const s = step.current
      s.onIndex(s.clamp(s.index + rows))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const drag = React.useRef<{
    y: number
    start: number
    moved: boolean
  } | null>(null)

  const commit = () => {
    if (typing !== null) {
      const i = parse(typing)
      if (i !== null) onIndex(clamp(i))
    }
    setTyping(null)
  }

  return (
    <div
      ref={ref}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={items[index]?.value}
      aria-valuetext={valueText}
      aria-valuemin={items[0]?.value}
      aria-valuemax={items.at(-1)?.value}
      data-lenis-prevent
      className="relative h-33 w-20 cursor-ns-resize touch-none overflow-hidden rounded-md outline-none select-none focus-visible:ring-3 focus-visible:ring-ink/20"
      onKeyDown={(e) => {
        if (typing !== null) return
        const keys: Record<string, number> = {
          ArrowUp: -1,
          ArrowDown: 1,
          PageUp: -3,
          PageDown: 3,
        }
        if (e.key in keys) onIndex(clamp(index + keys[e.key]))
        else if (e.key === "Home") onIndex(0)
        else if (e.key === "End") onIndex(items.length - 1)
        else if (e.key === "Enter") setTyping("")
        else if (/^\d$/.test(e.key)) setTyping(e.key)
        else return
        e.preventDefault()
      }}
      onPointerDown={(e) => {
        if (typing !== null) return
        drag.current = { y: e.clientY, start: index, moved: false }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        const d = drag.current
        if (!d) return
        const rows = Math.round((d.y - e.clientY) / ROW_PX)
        if (rows) d.moved = true
        onIndex(clamp(d.start + rows))
      }}
      onPointerUp={(e) => {
        const d = drag.current
        drag.current = null
        if (!d || d.moved) return
        // A tap: on the middle row it starts typing, on another row it rolls there.
        const box = e.currentTarget.getBoundingClientRect()
        const offset = Math.round((e.clientY - box.top - box.height / 2) / ROW_PX)
        if (offset === 0) setTyping("")
        else onIndex(clamp(index + offset))
      }}
    >
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-11 -translate-y-1/2 rounded-md bg-card" />
      <ul
        aria-hidden
        className="relative transition-transform duration-(--duration-fast) ease-out motion-reduce:transition-none"
        style={{
          transform: `translateY(${(Math.floor(VISIBLE / 2) - index) * ROW_REM}rem)`,
        }}
      >
        {items.map((item, i) => (
          <li
            key={item.value}
            className={cn(
              "flex h-11 items-center justify-center font-display text-title-lg text-ink tabular-nums transition-opacity duration-(--duration-fast)",
              Math.abs(i - index) === 0 ? "opacity-100" : Math.abs(i - index) === 1 ? "opacity-45" : "opacity-15",
            )}
          >
            {item.text}
          </li>
        ))}
      </ul>
      {typing !== null && (
        <input
          autoFocus
          inputMode="numeric"
          maxLength={2}
          aria-label={label}
          value={typing}
          onChange={(e) => setTyping(e.target.value.replace(/\D/g, ""))}
          onBlur={commit}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commit()
              ref.current?.focus()
            } else if (e.key === "Escape") {
              e.stopPropagation()
              setTyping(null)
              ref.current?.focus()
            }
          }}
          className="absolute inset-x-1 top-1/2 h-11 -translate-y-1/2 rounded-md border border-ink bg-card text-center font-display text-title-lg text-ink tabular-nums outline-none"
        />
      )}
    </div>
  )
}

const hourOf = (iso: string) => Number(iso.slice(11, 13))
const minuteOf = (iso: string) => Number(iso.slice(14, 16))
const h12 = (h: number) => h % 12 || 12
const nearest = (values: number[], n: number) => values.reduce((best, v, i) => (Math.abs(v - n) < Math.abs(values[best] - n) ? i : best), 0)

/**
 * Hours on the left, minutes on the right, AM/PM beside them, built only from the day's bookable `slots`
 * (ISO strings), so every reachable time is one the shop takes.
 */
export function TimeWheel({ slots, value, onChange }: { slots: string[]; value: string; onChange: (iso: string) => void }) {
  const hours = [...new Set(slots.map(hourOf))]
  const h = hourOf(value)
  const inHour = slots.filter((s) => hourOf(s) === h)
  const minutes = inHour.map(minuteOf)
  const m = minuteOf(value)

  // A new hour keeps the minutes when that hour has them (no 1:30 on a Friday break, say), else takes the nearest.
  const toHour = (hour: number) => {
    const options = slots.filter((s) => hourOf(s) === hour)
    onChange(options[nearest(options.map(minuteOf), m)])
  }

  const hourItems = hours.map((x) => ({ value: x, text: String(h12(x)) }))
  const minuteItems = minutes.map((x) => ({
    value: x,
    text: String(x).padStart(2, "0"),
  }))
  const period = h < 12 ? "AM" : "PM"

  return (
    <div className="flex items-center justify-center gap-1 rounded-lg border border-hairline bg-paper px-4">
      <Wheel
        label={booking.time.hour}
        items={hourItems}
        index={hours.indexOf(h)}
        onIndex={(i) => toHour(hours[i])}
        valueText={`${h12(h)} ${period}`}
        parse={(t) => {
          const n = Number(t)
          if (!t || Number.isNaN(n)) return null
          // "7" means 7 PM here (the shop is closed at 7 AM): pick the 12-hour match, else the nearest open hour.
          const exact = hours.findIndex((x) => x === n || h12(x) === n)
          return exact >= 0 ? exact : nearest(hours, n)
        }}
      />
      <span aria-hidden className="font-display text-title-lg text-ink">
        :
      </span>
      <Wheel
        label={booking.time.minute}
        items={minuteItems}
        index={minutes.indexOf(m)}
        onIndex={(i) => onChange(inHour[i])}
        valueText={String(m).padStart(2, "0")}
        parse={(t) => (t ? nearest(minutes, Number(t)) : null)}
      />
      <span aria-hidden className="w-12 pl-2 font-display text-title-md text-steel">
        {period}
      </span>
    </div>
  )
}
