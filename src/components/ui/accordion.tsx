import * as React from "react"

import { Plus } from "@/components/icons"
import { cn } from "@/lib/utils"

// Native <details>: opens with no JavaScript, so a slow phone can read answers before the page is live, and find-in-page
// reaches closed answers. The open and close animation is CSS (::details-content in globals.css), ignored where unsupported.

function Accordion(props: React.ComponentProps<"div">) {
  return <div {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<"details">) {
  return <details data-slot="accordion-item" className={cn("group border-b border-hairline", className)} {...props} />
}

/** Each question is a heading: h3 by default, `as="h2"` where the list sits directly under the page's h1. */
function AccordionTrigger({ className, children, as: Tag = "h3", ...props }: React.ComponentProps<"summary"> & { as?: "h2" | "h3" }) {
  return (
    <summary
      data-slot="accordion-trigger"
      className={cn("flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left [&::-webkit-details-marker]:hidden", className)}
      {...props}
    >
      <Tag className="min-w-0 font-display text-title-md text-ink">{children}</Tag>
      <Plus aria-hidden strokeWidth={1.75} className="size-5 shrink-0 text-steel transition-transform duration-(--duration-base) ease-out group-open:rotate-45" />
    </summary>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="accordion-content" className={cn("max-w-prose pb-5 text-body-md text-body", className)} {...props}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
