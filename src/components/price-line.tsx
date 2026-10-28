import { price, priceMode } from "@/content"
import { cn } from "@/lib/utils"

/** "From Rs X" or "Get a quote in 5 minutes", per the one switch in content.ts. */
export function PriceLine({ priceFrom, className }: { priceFrom?: number; className?: string }) {
  const showFrom = priceMode === "from" && priceFrom !== undefined
  return (
    <p className={cn("font-display text-title-md tabular-nums text-ink", className)}>
      {showFrom ? price.from(priceFrom) : price.quote}
    </p>
  )
}
