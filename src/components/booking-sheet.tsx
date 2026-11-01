"use client"

import * as React from "react"

import { BookingFlow } from "@/components/booking-flow"
import { Icon } from "@/components/icon"
import { ChevronRight, CircleHelp, repairIcons, type IconGlyph } from "@/components/icons"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { booking, services } from "@/content-large"

/** One choice: a short row on a phone, a card from md. */
function Choice({ icon, title, short, tone, onClick }: { icon: IconGlyph; title: string; short: string; tone: string; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex h-full min-h-15 w-full cursor-pointer items-center overflow-hidden rounded-lg border border-hairline bg-card text-left transition-colors duration-fast hover:border-ink md:flex-col md:items-stretch"
      >
        <span aria-hidden className="grid w-11 shrink-0 place-items-center self-stretch bg-panel md:w-auto md:py-6">
          <Icon icon={icon} size="xl" className={`${tone} md:size-10`} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1 px-2.5 py-2 md:px-4 md:py-3">
          <span className="font-display text-caption font-bold tracking-tight text-ink md:text-body-md md:tracking-normal">{title}</span>
          <span className="text-body-sm text-steel max-md:hidden">{short}</span>
        </span>
        <Icon icon={ChevronRight} className="mr-1.5 shrink-0 text-steel md:hidden" />
      </button>
    </li>
  )
}

/**
 * The booking in a centred dialog. Without a service it first asks which repair, then runs the flow for that repair ("not sure"
 * runs it with none). Loaded by BookButton on the first hover, focus or tap, never in the page's first load.
 */
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
  // null: "not sure". undefined: not asked yet.
  const [picked, setPicked] = React.useState<string | null | undefined>(undefined)
  const title = React.useRef<HTMLHeadingElement>(null)
  const slug = service ?? picked
  const svc = services.find((s) => s.slug === slug)
  const picking = !service && picked === undefined

  // The button that was pressed has gone: focus moves to the new view's title.
  const choose = (next: string | null | undefined) => {
    setPicked(next)
    requestAnimationFrame(() => title.current?.focus())
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* No description: the flow's "Step 1 of 5" line sits under the title instead. */}
      <SheetContent
        side="center"
        frame={picking ? "fit-height max-w-4xl" : "sm:max-h-dialog sm:max-w-md"}
        className={picking ? "p-4 sm:p-6" : "gap-2 p-5 pb-0 sm:p-6 sm:pb-0"}
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
        <SheetTitle ref={title} tabIndex={-1} className="outline-none">
          {picking ? booking.picker.title : svc ? svc.title : booking.title}
        </SheetTitle>
        {picking ? (
          <ul className="grid gap-2 md:grid-cols-3 md:gap-3">
            {services.map((s) => (
              <Choice key={s.slug} icon={repairIcons[s.slug]} title={s.title} short={s.short} tone="text-signal" onClick={() => choose(s.slug)} />
            ))}
            <Choice icon={CircleHelp} title={booking.picker.unsure.title} short={booking.picker.unsure.short} tone="text-steel" onClick={() => choose(null)} />
          </ul>
        ) : (
          open && <BookingFlow service={svc?.slug} device={device} onDone={() => onOpenChange(false)} onBack={service ? undefined : () => choose(undefined)} />
        )}
      </SheetContent>
    </Sheet>
  )
}
