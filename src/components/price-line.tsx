import { price, priceMode } from "@/content"
import { cn } from "@/lib/utils"

/** "From Rs X" in `from` mode when a price exists. Renders nothing in `quote` mode: quotes are given on WhatsApp. */
export function PriceLine({ priceFrom, className }: { priceFrom?: number; className?: string }) {
  if (priceMode !== "from" || priceFrom === undefined) return null
  return <p className={cn("font-display text-title-md tabular-nums text-ink", className)}>{price.from(priceFrom)}</p>
}
