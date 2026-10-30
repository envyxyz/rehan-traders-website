"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"

import { Icon } from "@/components/icon"
import { home, reviews, reviewsPage, ui } from "@/content"
import { cn } from "@/lib/utils"

const copy = home.reviews
const ROTATE_MS = 5000
const SWIPE_PX = 48 // ponytail: a plain distance threshold is all a swipe needs here.
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
 * One Google review at a time. Two uses, one component:
 * - `home` (default): cross-fades every 5 s through a fresh random 10 of the written reviews per visit (the clearest
 *   ones most often). The static HTML shows the first 10; the draw happens after load. Pauses on hover and focus,
 *   and does not auto-advance under reduced motion. Dots and the arrow step by hand.
 * - `all`: the /reviews page. Every review in its listed order, no autoplay. Prev and next arrows, a counter,
 *   arrow keys and a swipe step by hand. Every review is in the static HTML either way (stacked in one grid cell).
 */
export function ReviewCarousel({ variant = "home" }: { variant?: "home" | "all" }) {
  const all = variant === "all"
  const drawn = React.useSyncExternalStore(noSubscribe, drawOnce, () => first)
  const items = all ? reviews.items : drawn
  const [index, setIndex] = React.useState(0)
  const [held, setHeld] = React.useState(false)
  const swipe = React.useRef<number | null>(null)

  const step = (by: number) => setIndex((i) => (i + by + items.length) % items.length)

  React.useEffect(() => {
    if (all || held || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [all, held, items.length])

  return (
    <div
      role={all ? "region" : undefined}
      aria-roledescription={all ? reviewsPage.carouselRole : undefined}
      aria-label={all ? reviewsPage.carouselLabel : undefined}
      tabIndex={all ? 0 : undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onKeyDown={
        all
          ? (e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
              e.preventDefault()
              step(e.key === "ArrowLeft" ? -1 : 1)
            }
          : undefined
      }
      onPointerDown={all ? (e) => (swipe.current = e.pointerType === "touch" ? e.clientX : null) : undefined}
      onPointerCancel={all ? () => (swipe.current = null) : undefined}
      onPointerUp={
        all
          ? (e) => {
              if (swipe.current === null) return
              const dx = e.clientX - swipe.current
              swipe.current = null
              if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1)
            }
          : undefined
      }
      className={cn(all && "touch-pan-y rounded-lg outline-offset-4")}
    >
      {/* All cards share one grid cell, so the box is as tall as the longest review and never jumps. */}
      <div className="grid">
        {items.map((r, i) => (
          <figure
            key={r.author + r.text}
            aria-hidden={i !== index}
            inert={i !== index}
            className={cn(
              "col-start-1 row-start-1 m-0 flex flex-col gap-5 rounded-lg border border-hairline bg-card p-7 text-body transition-opacity duration-(--duration-base) ease-out sm:p-9",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <figcaption className="flex items-start justify-between gap-4 text-body-sm">
              <span className="flex items-center gap-3">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-pill bg-concrete font-display text-title-md text-ink">
                  {r.author[0]}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{r.author}</span>
                  <span className="text-steel">{r.date}</span>
                </span>
              </span>
              <span className="mt-1 flex shrink-0 gap-0.5 text-star" role="img" aria-label={ui.stars(r.rating)}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} aria-hidden className={cn("size-4 fill-current", s >= r.rating && "opacity-30")} strokeWidth={0} />
                ))}
              </span>
            </figcaption>
            <blockquote className="text-title-lg font-normal whitespace-pre-line text-ink text-pretty">{r.text}</blockquote>
          </figure>
        ))}
      </div>
      {all ? (
        <div className={cn("mt-3 flex items-center gap-4", all && "justify-center")}>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={reviewsPage.prev}
            className="grid size-11 cursor-pointer place-items-center rounded-pill text-ink hover:bg-concrete"
          >
            <Icon icon={ArrowLeft} />
          </button>
          <p aria-live="polite" className="min-w-16 text-center text-body-sm text-steel tabular-nums">
            {reviewsPage.counter(index + 1, items.length)}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={reviewsPage.next}
            className="grid size-11 cursor-pointer place-items-center rounded-pill text-ink hover:bg-concrete"
          >
            <Icon icon={ArrowRight} />
          </button>
        </div>
      ) : (
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
            onClick={() => step(1)}
            aria-label={copy.next}
            className="ml-auto grid size-11 cursor-pointer place-items-center rounded-pill text-ink hover:bg-concrete"
          >
            <Icon icon={ArrowRight} />
          </button>
        </div>
      )}
    </div>
  )
}
