import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-pill whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        /** Concrete brand/device chip. */
        chip: "bg-concrete px-3.5 py-1.5 text-caption text-ink",
        /** Signal Red "New" badge. Counts as the view's one red element. */
        signal: "bg-signal px-3 py-1 font-display text-caption font-bold text-on-signal",
        line: "border border-hairline px-3 py-1 text-caption text-steel",
      },
    },
    defaultVariants: { variant: "chip" },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
