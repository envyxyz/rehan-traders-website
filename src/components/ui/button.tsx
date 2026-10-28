import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Hover (pointer devices only): a 2px lift and the arrow chip turning to point right; on arrow buttons the chip's
  // colour also fills the button (btn-fill). Press: scale 0.97.
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-pill font-display text-button whitespace-nowrap select-none transition duration-(--duration-base) ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-97 motion-reduce:hover:translate-y-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        ink: "bg-action text-on-action hover:bg-action-active active:bg-action-active",
        /** Primary action on an ink band (CTA, footer). */
        inverse: "bg-on-band text-band hover:brightness-95 active:brightness-90",
        line: "border border-hairline bg-card text-ink hover:border-ink active:bg-concrete",
        whatsapp: "bg-whatsapp text-on-whatsapp hover:brightness-105 active:brightness-95",
        glass: "glass active:brightness-95",
        icon: "text-ink hover:translate-y-0 hover:bg-concrete active:bg-concrete",
      },
      size: {
        md: "h-11 px-4.5",
        lg: "h-13 px-6",
      },
    },
    compoundVariants: [
      { variant: "icon", size: "md", className: "size-11 px-0" },
      { variant: "icon", size: "lg", className: "size-13 px-0" },
    ],
    defaultVariants: { variant: "ink", size: "md" },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Round arrow chip on the right, for the primary action. */
    arrow?: boolean
  }

function Button({ className, variant, size, asChild = false, arrow = false, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        arrow && "relative isolate pr-2",
        // Label and, once the fill has covered it (delay in globals.css), the button itself take the chip's colours.
        arrow &&
          (variant === "inverse"
            ? "hover:bg-band hover:text-on-band focus-visible:text-on-band"
            : "hover:bg-on-action hover:text-action focus-visible:text-action"),
        className
      )}
      {...props}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      {arrow && <span aria-hidden className={cn("btn-fill", variant === "inverse" ? "bg-band" : "bg-on-action")} />}
      {arrow && (
        <span
          aria-hidden
          className={cn(
            "grid size-7.5 place-items-center rounded-pill",
            variant === "inverse" ? "bg-band text-on-band" : "bg-on-action text-action"
          )}
        >
          <ArrowUpRight className="size-4 transition-transform duration-(--duration-base) ease-out group-hover/button:rotate-45 motion-reduce:transition-none" strokeWidth={2} />
        </span>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
