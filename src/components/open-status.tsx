import { Icon } from "@/components/icon"
import { Clock } from "@/components/icons"
import { site } from "@/content"
import { cn } from "@/lib/utils"

/** The shop's hours in one line. Icon and text take the surrounding text colour. */
export function OpenStatus({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Icon icon={Clock} size="sm" />
      {site.hours.short}
    </span>
  )
}
