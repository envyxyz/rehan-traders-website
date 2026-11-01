import * as React from "react"

import { Stars } from "@/components/stars"
import type { reviews } from "@/content-large"
import { cn } from "@/lib/utils"

type Review = (typeof reviews.items)[number]

/** One Google review, text exactly as written. `large` is the one-at-a-time carousel on /reviews. */
export function ReviewCard({ review, large, className, ...props }: React.ComponentProps<"figure"> & { review: Review; large?: boolean }) {
  return (
    <figure className={cn("m-0 flex flex-col gap-5 rounded-lg border border-hairline bg-card text-body", large ? "p-7 sm:p-9" : "h-full p-6", className)} {...props}>
      <figcaption className="flex items-start justify-between gap-4 text-body-sm">
        <span className="flex items-center gap-3">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-pill bg-concrete font-display text-title-md text-ink">
            {review.author[0]}
          </span>
          <span>
            <span className="block font-semibold text-ink">{review.author}</span>
            <span className="text-steel">{review.when}</span>
          </span>
        </span>
        <Stars rating={review.rating} className="mt-1 shrink-0" />
      </figcaption>
      <blockquote className={cn("text-body-md font-normal whitespace-pre-line text-ink text-pretty", large && "sm:text-title-lg sm:font-normal")}>{review.text}</blockquote>
    </figure>
  )
}
