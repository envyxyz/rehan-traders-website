"use client"

import { BookingFlow } from "@/components/booking-flow"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { booking, services } from "@/content-large"

/** The booking flow in a side sheet. Loaded by BookButton on the first hover, focus or tap, never in the page's first load. */
export function BookingSheet({
  open,
  onOpenChange,
  service,
  device,
  returnFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: string
  device?: string
  /** The Book button: focus goes back to it when the sheet closes. */
  returnFocus: React.RefObject<HTMLElement | null>
}) {
  const svc = services.find((s) => s.slug === service)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* No description: the flow's "Step 1 of 5" line sits under the title instead. */}
      <SheetContent
        side="right"
        className="gap-2 p-5 pb-0 sm:p-6 sm:pb-0"
        aria-describedby={undefined}
        // Focus the sheet, not its first field: that would open the brand list and raise the keyboard before anyone asked.
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          const sheet = e.target as HTMLElement
          sheet.focus()
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          returnFocus.current?.focus()
        }}
      >
        <SheetTitle>{svc ? svc.title : booking.title}</SheetTitle>
        {open && <BookingFlow service={svc?.slug} device={device} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}
