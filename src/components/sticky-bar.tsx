"use client"

import * as React from "react"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

import { ChatSheet } from "@/components/chat-launcher"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { actions, chat, site } from "@/content"
import { cn } from "@/lib/utils"

/** Phones: glass bottom bar (Book a visit, WhatsApp, chat), shown once the hero has scrolled past. */
export function StickyBar() {
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    // ponytail: "past the hero" = scrolled 80% of a viewport; the hero is 100svh on every page that has one.
    const onScroll = () => setShown(scrollY > innerHeight * 0.8)
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      inert={!shown}
      className={cn(
        "glass fixed inset-x-3 bottom-safe-bottom z-30 flex gap-1.5 rounded-pill p-1.5 transition duration-base ease-drawer md:hidden",
        !shown && "translate-y-full opacity-0"
      )}
    >
      <Button asChild className="flex-1">
        <Link href="/book">{actions.book}</Link>
      </Button>
      <Button asChild variant="whatsapp" className="flex-1">
        <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
          <WhatsAppIcon />
          {actions.whatsapp}
        </a>
      </Button>
      <ChatSheet>
        <Button variant="icon" aria-label={chat.launcher}>
          <Icon icon={MessageCircle} size="lg" />
        </Button>
      </ChatSheet>
    </div>
  )
}
