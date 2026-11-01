import * as React from "react"

import { cn } from "@/lib/utils"

/** White card, hairline border, no shadow. 18px corners, 28px padding. */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("flex flex-col gap-4 rounded-lg border border-hairline bg-card p-7 text-body", className)}
      {...props}
    />
  )
}

/** An h3 by default; `as="h2"` where the cards sit directly under the page's h1. */
function CardTitle({ className, as: Tag = "h3", ...props }: React.ComponentProps<"h3"> & { as?: "h2" | "h3" }) {
  return <Tag data-slot="card-title" className={cn("font-display text-title-md text-ink", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-body-md text-steel", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex items-center gap-3", className)} {...props} />
}

export { Card, CardTitle, CardDescription, CardFooter }
