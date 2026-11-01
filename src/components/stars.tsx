import { Star } from "@/components/icons"
import { ui } from "@/content"
import { cn } from "@/lib/utils"

export function Stars({ rating, small, className }: { rating: number; small?: boolean; className?: string }) {
  return (
    <span className={cn("flex gap-0.5 text-star", className)} role="img" aria-label={ui.stars(rating)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} aria-hidden className={cn(small ? "size-3.25" : "size-4", "fill-current", i >= Math.round(rating) && "opacity-30")} strokeWidth={0} />
      ))}
    </span>
  )
}
