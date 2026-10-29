"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { MessageCircle } from "lucide-react"

import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { assistant } from "@/content"
import { track } from "@/lib/track"

const loadPanel = () => import("@/components/chat-panel").then((m) => m.ChatPanel)
// Not in the first page load: the assistant downloads on hover, focus or the first tap of a chat button.
const ChatPanel = dynamic(loadPanel, { ssr: false })

/** The glass chat sheet behind the desktop launcher and the phone StickyBar's chat icon. */
export function ChatSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) track("chat_open", {})
      }}
    >
      <SheetTrigger asChild onPointerEnter={() => void loadPanel()} onFocus={() => void loadPanel()}>
        {children}
      </SheetTrigger>
      <SheetContent side="right" glass className="gap-3 pb-4">
        <SheetTitle>{assistant.title}</SheetTitle>
        <SheetDescription className="text-caption">{assistant.disclosure}</SheetDescription>
        {open && <ChatPanel />}
      </SheetContent>
    </Sheet>
  )
}

/** Desktop and tablet: glass "Ask a question" bottom right. Phones use the StickyBar's chat icon. */
export function ChatLauncher() {
  return (
    <div className="fixed right-6 bottom-6 z-30 max-md:hidden">
      <ChatSheet>
        <Button variant="glass">
          <Icon icon={MessageCircle} />
          {assistant.title}
        </Button>
      </ChatSheet>
    </div>
  )
}
