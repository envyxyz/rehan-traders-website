import type { LucideIcon } from "lucide-react"

import { Icon } from "@/components/icon"
import { Badge } from "@/components/ui/badge"

/** Concrete brand/device chip, optional leading icon. */
export function Chip({ icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <Badge variant="chip">
      {icon && <Icon icon={icon} size="sm" />}
      {children}
    </Badge>
  )
}
