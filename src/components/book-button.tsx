"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { booking, services } from "@/content"

const loadFlow = () => import("@/components/booking-flow").then((m) => m.BookingFlow)
// Not in the first page load: the flow downloads on hover, focus or the first tap.
const BookingFlow = dynamic(loadFlow, { ssr: false })

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
  const svc = services.find((s) => s.slug === service)
  return (
    <>
      <Button asChild {...props}>
        <a
          href={svc ? `/book?service=${svc.slug}` : "/book"}
          onPointerEnter={() => void loadFlow()}
          onFocus={() => void loadFlow()}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
            e.preventDefault()
            setOpen(true)
          }}
        >
          {children}
        </a>
      </Button>
      <BookingSheet open={open} onOpenChange={setOpen} service={svc?.slug} device={device} />
    </>
  )
}

export function BookingSheet({
  open,
  onOpenChange,
  service,
  device,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: string
  device?: string
}) {
  const svc = services.find((s) => s.slug === service)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* No description: the flow's "Step 1 of 5" line sits under the title instead. */}
      <SheetContent side="right" className="gap-2 p-5 pb-0 sm:p-6 sm:pb-0" aria-describedby={undefined}>
        <SheetTitle>{svc ? svc.title : booking.title}</SheetTitle>
        {open && <BookingFlow service={svc?.slug} device={device} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}
