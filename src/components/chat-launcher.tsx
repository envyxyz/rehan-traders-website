"use client"

import { MessageCircle, Phone } from "lucide-react"

import { Icon, WhatsAppIcon } from "@/components/icon"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { actions, chat, site } from "@/content"

// ponytail: placeholder sheet; Phase 6 swaps in the lazy-loaded assistant behind the same triggers.
export function ChatSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>{chat.launcher}</SheetTitle>
        <SheetDescription>{chat.greeting}</SheetDescription>
        <Text tone="muted">{chat.placeholder}</Text>
        <div className="mt-auto grid gap-2.5">
          <Button asChild size="lg" variant="whatsapp">
            <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
              <WhatsAppIcon />
              {actions.whatsapp}
            </a>
          </Button>
          <Button asChild size="lg" variant="line">
            <a href={site.phone.href}>
              <Icon icon={Phone} />
              {site.phone.display}
            </a>
          </Button>
        </div>
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
          {chat.launcher}
        </Button>
      </ChatSheet>
    </div>
  )
}
