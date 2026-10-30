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
        className="gap-3 pb-4"
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
