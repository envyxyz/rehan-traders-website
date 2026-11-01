"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { Icon } from "@/components/icon"
import { X } from "@/components/icons"
import { isCovering } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { ui } from "@/content"
import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

// ponytail: CSS slide with the drawer ease; swap for a Motion spring when booking/menu/chat land (Phases 3, 5, 6).
const sides = {
  right:
    "sheet-fit inset-x-2 sm:left-auto sm:w-md rounded-xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  left: "sheet-fit inset-x-2 sm:right-auto sm:w-md rounded-xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  /** Centred: inset edges with auto margins, so a max width or height (from `frame`) centres it with no transform. */
  center:
    "sheet-fit inset-x-2 m-auto rounded-xl data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  bottom:
    "inset-x-0 bottom-0 max-h-sheet rounded-t-xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
} as const

/** Keeps the sheet inside the visible area while the on-screen keyboard is up (iOS moves only the visual viewport). */
function useKeyboardFit() {
  const [sheet, setSheet] = React.useState<HTMLElement | null>(null)
  React.useEffect(() => {
    const vv = window.visualViewport
    if (!sheet || !vv) return
    const sync = () => {
      // Pinch zoom also shrinks the visual viewport: only an unzoomed page follows it.
      const zoomed = vv.scale > 1.01
      sheet.style.setProperty("--vv-top", zoomed ? "0px" : `${vv.offsetTop}px`)
      sheet.style.setProperty("--vv-bottom", zoomed ? "0px" : `${Math.max(0, window.innerHeight - vv.height - vv.offsetTop)}px`)
    }
    sync()
    vv.addEventListener("resize", sync)
    vv.addEventListener("scroll", sync)
    return () => {
      vv.removeEventListener("resize", sync)
      vv.removeEventListener("scroll", sync)
    }
  }, [sheet])
  return setSheet
}

/**
 * A skeleton stood in for this sheet while its chunk downloaded (loading.tsx): the sheet appears in its place, so its
 * opening animation is skipped (`[data-instant]`, globals.css). Runs as the element mounts, once per opening.
 */
const instantIfCovered = (el: HTMLElement | null) => {
  if (el && isCovering()) el.dataset.instant = ""
}

function SheetContent({
  className,
  children,
  side = "right",
  glass = false,
  frame,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: keyof typeof sides
  glass?: boolean
  /** Classes for the sheet's outer box; `className` styles the scroller inside it. */
  frame?: string
}) {
  const fit = useKeyboardFit()
  const mounted = React.useCallback(
    (el: HTMLElement | null) => {
      fit(el)
      instantIfCovered(el)
    },
    [fit]
  )
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        ref={instantIfCovered}
        className="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <SheetPrimitive.Content
        ref={mounted}
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden text-body shadow-float transition-none duration-(--duration-base) ease-drawer outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          sides[side],
          frame,
          glass ? "glass" : "bg-card"
        )}
        {...props}
      >
        {/* The scroller sits inside, so the close button stays put when a long sheet scrolls. */}
        <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-6", className)}>{children}</div>
        <SheetPrimitive.Close asChild>
          <Button variant="icon" className="absolute top-3 right-3 bg-concrete" aria-label={ui.close}>
            <Icon icon={X} size="lg" />
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
