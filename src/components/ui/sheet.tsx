"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ui } from "@/content"
import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

// ponytail: CSS slide with the drawer ease; swap for a Motion spring when booking/menu/chat land (Phases 3, 5, 6).
const sides = {
  right:
    "inset-2 sm:left-auto sm:w-md rounded-xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  left: "inset-2 sm:right-auto sm:w-md rounded-xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  bottom:
    "inset-x-0 bottom-0 max-h-sheet rounded-t-xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
} as const

function SheetContent({
  className,
  children,
  side = "right",
  glass = false,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: keyof typeof sides; glass?: boolean }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 overflow-y-auto overscroll-contain p-6 text-body shadow-float duration-(--duration-base) ease-drawer outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          sides[side],
          glass ? "glass" : "bg-card",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close asChild>
          <Button variant="icon" className="absolute top-3 right-3" aria-label={ui.close}>
            <X aria-hidden className="size-5" strokeWidth={1.75} />
          </Button>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("pr-10 font-display text-title-lg text-ink", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-body-md text-steel", className)} {...props} />
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription }
