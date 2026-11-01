"use client"

import * as React from "react"

import { Icon } from "@/components/icon"
import { ArrowLeft, ArrowRight } from "@/components/icons"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { reviewsPage } from "@/content"
import { reviews } from "@/content-large"
import { cn } from "@/lib/utils"

const SWIPE_PX = 48 // ponytail: a plain distance threshold is all a swipe needs here.

/**
 * The /reviews page: one Google review at a time, every review in its listed order, no autoplay. Prev and next arrows, a
 * counter, arrow keys and a swipe step by hand. Every review is in the static HTML (stacked in one grid cell).
 */
export function ReviewCarousel() {
  const items = reviews.items
  const [index, setIndex] = React.useState(0)
  const swipe = React.useRef<number | null>(null)

  const step = (by: number) => setIndex((i) => (i + by + items.length) % items.length)

  return (
    <div
      role="region"
      aria-roledescription={reviewsPage.carouselRole}
      aria-label={reviewsPage.carouselLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
        e.preventDefault()
        step(e.key === "ArrowLeft" ? -1 : 1)
      }}
      onPointerDown={(e) => (swipe.current = e.pointerType === "touch" ? e.clientX : null)}
      onPointerCancel={() => (swipe.current = null)}
      onPointerUp={(e) => {
        if (swipe.current === null) return
        const dx = e.clientX - swipe.current
        swipe.current = null
        if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1)
      }}
      className="touch-pan-y rounded-lg outline-offset-4"
    >
      {/* All cards share one grid cell, so the box is as tall as the longest review and never jumps. */}
      <div className="grid">
        {items.map((r, i) => (
          <ReviewCard
            key={r.author + r.text}
            review={r}
            large
            aria-hidden={i !== index}
            inert={i !== index}
            className={cn("col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-out", i === index ? "opacity-100" : "pointer-events-none opacity-0")}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 max-sm:justify-between">
        <Button type="button" variant="icon" onClick={() => step(-1)} aria-label={reviewsPage.prev}>
          <Icon icon={ArrowLeft} />
        </Button>
        <p aria-live="polite" className="min-w-16 text-center text-body-sm text-steel tabular-nums">
          {reviewsPage.counter(index + 1, items.length)}
        </p>
        <Button type="button" variant="icon" onClick={() => step(1)} aria-label={reviewsPage.next}>
          <Icon icon={ArrowRight} />
        </Button>
      </div>
    </div>
  )
}
