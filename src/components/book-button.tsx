"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { SheetSkeleton } from "@/components/loading"
import { Button } from "@/components/ui/button"

const loadSheet = () => import("@/components/booking-sheet").then((m) => m.BookingSheet)
// Not in the first page load: the sheet and flow download on hover, focus or the first tap. If the tap comes first, a skeleton of the sheet shows.
const BookingSheet = dynamic(loadSheet, { ssr: false, loading: () => <SheetSkeleton kind="booking" /> })

type BookButtonProps = Omit<React.ComponentProps<typeof Button>, "asChild" | "onClick"> & {
  /** Service slug: narrows the faults and offers "Get a quote". The only thing that may go in the URL. */
  service?: string
  device?: string
}

/**
 * Every Book button. A real link to /book (works without JS, opens in a new tab with a modifier key);
 * a plain click opens the BookingSheet instead.
 */
export function BookButton({ service, device, children, ...props }: BookButtonProps) {
  const [open, setOpen] = React.useState(false)
  // Mounted on the first click and kept, so the sheet can play its closing animation.
  const [asked, setAsked] = React.useState(false)
  const link = React.useRef<HTMLAnchorElement>(null)
  return (
    <>
      <Button asChild {...props}>
        <a
          ref={link}
          href={service ? `/book?service=${service}` : "/book"}
          data-sheet
          onPointerEnter={() => void loadSheet()}
          onFocus={() => void loadSheet()}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
            e.preventDefault()
            setAsked(true)
            setOpen(true)
          }}
        >
          {children}
        </a>
      </Button>
      {asked && <BookingSheet open={open} onOpenChange={setOpen} service={service} device={device} returnFocus={link} />}
    </>
  )
}
