import { Icon } from "@/components/icon"
import type { IconGlyph } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

/** Concrete brand/device chip, optional leading icon. */
export function Chip({ icon, children }: { icon?: IconGlyph; children: React.ReactNode }) {
  return (
    <Badge variant="chip">
      {icon && <Icon icon={icon} size="sm" />}
      {children}
    </Badge>
  )
}
