"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { MessageCircle } from "lucide-react"

import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { assistant } from "@/content"
import { track } from "@/lib/track"

const loadSheet = () => import("@/components/chat-sheet").then((m) => m.ChatSheet)
// Not in the first page load: the assistant downloads on hover, focus or the first tap.
const ChatSheet = dynamic(loadSheet, { ssr: false })

/** Glass chat button on every screen from page load: "Ask a question" on desktop, a round icon on phones, above the StickyBar while it shows. */
export function ChatLauncher() {
  const [open, setOpen] = React.useState(false)
  // Mounted on the first tap and kept, so the sheet can play its closing animation.
  const [asked, setAsked] = React.useState(false)
  const button = React.useRef<HTMLButtonElement>(null)
  return (
    <div className="typing-hidden fixed right-3 bottom-safe-bottom z-30 transition-transform duration-base ease-drawer peer-data-shown:-translate-y-18 md:right-6 md:bottom-6 md:peer-data-shown:translate-y-0">
      <Button
        ref={button}
        variant="glass"
        className="max-md:size-12 max-md:px-0"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={() => void loadSheet()}
        onFocus={() => void loadSheet()}
        onClick={() => {
          setAsked(true)
          setOpen(true)
          track("chat_open", {})
        }}
      >
        <Icon icon={MessageCircle} />
        <span className="max-md:sr-only">{assistant.title}</span>
      </Button>
      {asked && <ChatSheet open={open} onOpenChange={setOpen} returnFocus={button} />}
    </div>
  )
}
