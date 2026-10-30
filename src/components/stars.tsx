import { Star } from "lucide-react"

import { ui } from "@/content"
import { cn } from "@/lib/utils"

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5 text-star", className)} role="img" aria-label={ui.stars(rating)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn("size-4 fill-current", i >= Math.round(rating) && "opacity-30")}
          strokeWidth={0}
        />
      ))}
    </span>
  )
}
