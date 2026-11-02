"use client"

import { ChatPanel } from "@/components/chat-panel"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { assistant } from "@/content"

/** The glass chat sheet behind the launcher. Loaded on the launcher's first hover, focus or tap, never in the page's first load. */
export function ChatSheet({
  open,
  onOpenChange,
  returnFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The launcher: focus goes back to it when the sheet closes. */
  returnFocus: React.RefObject<HTMLElement | null>
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        glass
        // Phones: rises from the thumb's corner with a fade, not across the whole width. Desktop keeps the slide from the right.
        className="gap-3 pb-6 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 max-sm:data-[state=closed]:slide-out-to-right-0 max-sm:data-[state=closed]:slide-out-to-bottom-8 max-sm:data-[state=open]:slide-in-from-right-0 max-sm:data-[state=open]:slide-in-from-bottom-8"
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          returnFocus.current?.focus()
        }}
      >
        <SheetTitle>{assistant.title}</SheetTitle>
        <SheetDescription className="text-caption">{assistant.disclosure}</SheetDescription>
        {open && <ChatPanel />}
      </SheetContent>
    </Sheet>
  )
}
