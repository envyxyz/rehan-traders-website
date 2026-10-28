"use client"

import * as React from "react"
import { ArrowRight, ArrowUpRight, Star } from "lucide-react"

import { Icon } from "@/components/icon"
import { home, reviews, ui } from "@/content"
import { cn } from "@/lib/utils"

const copy = home.reviews
const ROTATE_MS = 5000
const items = reviews.items

/**
 * One Google review at a time, cross-fading every 5 s. Each review links to itself on Google Maps.
 * Pauses on hover and focus, and does not auto-advance under reduced motion. Dots and the arrow step by hand.
 */
export function ReviewCarousel() {
  const [index, setIndex] = React.useState(0)
  const [held, setHeld] = React.useState(false)

  React.useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [held])

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
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={i !== index}
            tabIndex={i === index ? undefined : -1}
            className={cn(
              "group col-start-1 row-start-1 flex flex-col gap-5 rounded-lg border border-hairline bg-card p-7 text-body no-underline transition duration-(--duration-base) ease-out hover:border-ink sm:p-9",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <span className="flex gap-0.5 text-star" role="img" aria-label={ui.stars(r.rating)}>
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} aria-hidden className={cn("size-4 fill-current", s >= r.rating && "opacity-30")} strokeWidth={0} />
              ))}
            </span>
            <blockquote className="text-title-lg font-normal text-ink text-pretty">{r.text}</blockquote>
            <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-4 text-body-sm">
              {/* eslint-disable-next-line @next/next/no-img-element -- 96px avatar, pre-sized */}
              <img src={r.avatar} alt={ui.decorative} width={96} height={96} loading="lazy" decoding="async" className="size-10 rounded-pill bg-concrete" />
              <span>
                <span className="block font-semibold text-ink">{r.author}</span>
                <span className="text-steel">{r.date}</span>
              </span>
              <span className="inline-flex w-full items-center gap-1 font-display sm:ml-auto sm:w-auto text-button text-ink group-hover:underline group-hover:underline-offset-4">
                {copy.readOne}
                <span className="sr-only">, {ui.externalLink}</span>
                <Icon icon={ArrowUpRight} size="sm" />
              </span>
            </span>
          </a>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1">
        {items.map((r, i) => (
          <button
            key={r.url}
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
