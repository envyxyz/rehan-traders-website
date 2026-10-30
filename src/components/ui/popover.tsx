"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverAnchor = PopoverPrimitive.Anchor

/**
 * Floats over the page, as wide as its anchor and no taller than the room left (flips up when there is none).
 * Not portaled: inside a Sheet it has to stay in the dialog's DOM, or the dialog's scroll lock blocks wheel
 * scrolling in the list. It stays a list, not a dialog, so the default role="dialog" is dropped. The bottom
 * padding keeps it clear of the bar along the bottom (booking Back/Next, the phone's sticky bar).
 */
function PopoverContent({ className, sideOffset = 6, collisionPadding = { top: 8, left: 8, right: 8, bottom: 88 }, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Content
      data-slot="popover-content"
      role="presentation"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "z-50 flex max-h-(--radix-popper-available-height) w-(--radix-popper-anchor-width) flex-col overflow-hidden rounded-lg border border-hairline bg-card text-ink shadow-float outline-none",
        className
      )}
      {...props}
    />
  )
}

export { Popover, PopoverAnchor, PopoverContent }
