"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

import { Icon } from "@/components/icon"
import { MessageCircle } from "@/components/icons"
import { SheetSkeleton } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { actions, assistant } from "@/content"
import { track } from "@/lib/track"
import { cn } from "@/lib/utils"

const loadSheet = () => import("@/components/chat-sheet").then((m) => m.ChatSheet)
// Not in the first page load: the assistant downloads on hover, focus or the first tap. If the tap comes first, a skeleton of the sheet shows.
const ChatSheet = dynamic(loadSheet, { ssr: false, loading: () => <SheetSkeleton kind="chat" /> })

const OPEN_CHAT = "open-chat"

/** Opens the launcher's chat from elsewhere on the page (the hero), so there is one conversation. */
export function AskAiButton({ className }: { className?: string }) {
  return (
    <Button
      size="lg"
      variant="line"
      className={className}
      aria-haspopup="dialog"
      onPointerEnter={() => void loadSheet()}
      onFocus={() => void loadSheet()}
      onClick={(e) => dispatchEvent(new CustomEvent(OPEN_CHAT, { detail: e.currentTarget }))}
    >
      <Icon icon={MessageCircle} />
      {actions.askAi}
    </Button>
  )
}

/**
 * Glass chat button: "Ask a question" on desktop, a round icon on phones. On every screen from page load, except the home hero,
 * which has its own Ask AI button: it comes in once the hero fills less than 40% of the screen.
 */
export function ChatLauncher() {
  const [open, setOpen] = React.useState(false)
  // Mounted on the first tap and kept, so the sheet can play its closing animation.
  const [asked, setAsked] = React.useState(false)
  const button = React.useRef<HTMLButtonElement>(null)
  const opener = React.useRef<HTMLElement>(null)
  const path = usePathname()
  const home = path === "/"
  const [pastHero, setPastHero] = React.useState(false)

  React.useEffect(() => {
    const hero = document.getElementById("top")
    if (!home || !hero) return
    const watch = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: "-40% 0px 0px" })
    watch.observe(hero)
    return () => watch.disconnect()
  }, [home])

  const start = React.useCallback((from: HTMLElement | null) => {
    opener.current = from
    setAsked(true)
    setOpen(true)
    track("chat_open", {})
  }, [])

  React.useEffect(() => {
    const onOpen = (e: Event) => start((e as CustomEvent<HTMLElement>).detail)
    addEventListener(OPEN_CHAT, onOpen)
    return () => removeEventListener(OPEN_CHAT, onOpen)
  }, [start])

  // The booking page is one task, and on phones the button sat on its last step's WhatsApp link.
  if (path === "/book") return null

  return (
    <div
      className={cn(
        "typing-hidden fixed right-3 bottom-safe-bottom z-30 transition duration-(--duration-base) ease-out motion-reduce:transition-none md:right-6 md:bottom-6",
        home && !pastHero && "invisible translate-y-2 opacity-0"
      )}
    >
      <Button
        ref={button}
        variant="glass"
        className="max-md:size-12 max-md:px-0"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={() => void loadSheet()}
        onFocus={() => void loadSheet()}
        onClick={() => start(button.current)}
      >
        <Icon icon={MessageCircle} />
        <span className="max-md:sr-only">{assistant.title}</span>
      </Button>
      {asked && <ChatSheet open={open} onOpenChange={setOpen} returnFocus={opener} />}
    </div>
  )
}
