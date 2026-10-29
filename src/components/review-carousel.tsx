"use client"

import * as React from "react"
import { ArrowRight, Star } from "lucide-react"

import { Icon } from "@/components/icon"
import { home, reviews, ui } from "@/content"
import { cn } from "@/lib/utils"

const copy = home.reviews
const ROTATE_MS = 5000
type Review = (typeof reviews.items)[number]

/** `reviews.show` reviews, weighted random without replacement (Efraimidis-Spirakis: key = u^(1/w), keep the top). */
const pick = (all: readonly Review[]) =>
  all
    .map((r) => ({ r, key: Math.random() ** (1 / r.weight) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, reviews.show)
    .map((x) => x.r)

// ponytail: one draw per page load is what "random on each reload" needs; no seed, no storage.
let drawn: readonly Review[] | undefined
const drawOnce = () => (drawn ??= pick(reviews.items))
const first = reviews.items.slice(0, reviews.show)
const noSubscribe = () => () => {}

/**
 * One Google review at a time, cross-fading every 5 s, from a fresh random 10 of the 32 written reviews per visit
 * (the clearest ones most often). The static HTML shows the first 10; the draw happens after load.
 * Pauses on hover and focus, and does not auto-advance under reduced motion. Dots and the arrow step by hand.
 */
export function ReviewCarousel() {
  const items = React.useSyncExternalStore(noSubscribe, drawOnce, () => first)
  const [index, setIndex] = React.useState(0)
  const [held, setHeld] = React.useState(false)

  React.useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [held, items.length])

  return (
    <div
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {/* All cards share one grid cell, so the box is as tall as the longest review and never jumps. */}
      <div className="grid">
        {items.map((r, i) => (
          <figure
            key={r.author + r.text}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 m-0 flex flex-col gap-5 rounded-lg border border-hairline bg-card p-7 text-body transition-opacity duration-(--duration-base) ease-out sm:p-9",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <span className="flex gap-0.5 text-star" role="img" aria-label={ui.stars(r.rating)}>
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} aria-hidden className={cn("size-4 fill-current", s >= r.rating && "opacity-30")} strokeWidth={0} />
              ))}
            </span>
            <blockquote className="text-title-lg font-normal whitespace-pre-line text-ink text-pretty">{r.text}</blockquote>
            <figcaption className="mt-auto flex items-center gap-3 text-body-sm">
              <span aria-hidden className="grid size-10 place-items-center rounded-pill bg-concrete font-display text-title-md text-ink">
                {r.author[0]}
              </span>
              <span>
                <span className="block font-semibold text-ink">{r.author}</span>
                <span className="text-steel">{r.date}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1">
        {items.map((r, i) => (
          <button
            key={r.author + r.text}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={copy.show(i + 1, items.length)}
            aria-current={i === index}
            className="grid size-11 cursor-pointer place-items-center"
          >
            <span className={cn("h-1 rounded-pill", i === index ? "w-6 bg-ink" : "w-2 bg-steel-soft")} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % items.length)}
          aria-label={copy.next}
          className="ml-auto grid size-11 cursor-pointer place-items-center rounded-pill text-ink hover:bg-concrete"
        >
          <Icon icon={ArrowRight} />
        </button>
      </div>
    </div>
  )
}
