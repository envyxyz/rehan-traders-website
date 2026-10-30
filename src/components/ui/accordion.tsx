"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-hairline", className)} {...props} />
}

/** Each question is a heading: h3 by default, `as="h2"` where the list sits directly under the page's h1. */
function AccordionTrigger({ className, children, as: Tag = "h3", ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { as?: "h2" | "h3" }) {
  return (
    <AccordionPrimitive.Header asChild>
      <Tag className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "group flex min-h-14 flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-title-md text-ink",
            className
          )}
          {...props}
        >
          {children}
          <Plus
            aria-hidden
            strokeWidth={1.75}
            className="size-5 shrink-0 text-steel transition-transform duration-(--duration-base) ease-out group-data-[state=open]:rotate-45"
          />
        </AccordionPrimitive.Trigger>
      </Tag>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    // forceMount: closed answers stay in the static HTML (hidden attribute) so crawlers without JS can read them.
    <AccordionPrimitive.Content
      forceMount
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("max-w-prose pb-5 text-body-md text-body", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
