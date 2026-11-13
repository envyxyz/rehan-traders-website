"use client"

import * as React from "react"
import Link from "next/link"
import { flushSync } from "react-dom"

import { Icon, WhatsAppIcon } from "@/components/icon"
import { ChevronLeft, ChevronRight, Phone } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { actions, guidesPage, nav, site } from "@/content"
import { guides, services } from "@/content-large"
import { menuStagger } from "@/lib/tokens"
import { cn } from "@/lib/utils"

// The nav's Radix menus. Nav loads this module with next/dynamic after hydration, so the menu and dialog code is not
// in the first load; until it arrives Nav shows the same trigger without behaviour. The triggers' faces come from Nav.

/** What each menu link opens. A guide's entry is its title up to the colon: the fault, without the question. */
const menus = {
  "/repairs": { all: actions.allRepairs, items: services.map((s) => ({ href: `/repairs/${s.slug}`, label: s.title })) },
  "/guides": { all: guidesPage.all, items: guides.map((g) => ({ href: `/guides/${g.slug}`, label: g.title.split(":")[0] })) },
}
export type MenuHref = keyof typeof menus
const hasMenu = (href: string): href is MenuHref => href in menus

/** Desktop: Repairs opens the 8 repairs, Guides the guides. `menu` controls it. */
export function LinkMenu({
  href,
  className,
  menu,
  children,
}: {
  href: MenuHref
  className: string
  menu?: { open: boolean; onOpenChange: (open: boolean) => void }
  children: React.ReactNode
}) {
  return (
    <DropdownMenu modal={false} {...menu}>
      <DropdownMenuTrigger className={className}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={12}>
        {menus[href].items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={href}>{menus[href].all}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const row = "flex min-h-12 w-full items-center font-display text-title-lg text-ink"
// The header strip of both panels (Menu, Back): the same height, type, separator and tint. The sheet's X sits in its right end.
const bar = "flex h-17 shrink-0 items-center border-b border-hairline bg-sheet-bar px-6 font-display text-title-lg text-ink"
const entry = "flex min-h-11 items-center text-body-md text-body"
const rise = "animate-rise motion-reduce:animate-none"
const delay = (i: number) => ({ animationDelay: `${menuStagger.start + i * menuStagger.step}s` })

/**
 * Phones: the menu sheet, opened by Nav's menu button (`open`). The items fade in after the sheet slides in. Repairs and Guides each slide
 * a second panel over the first (Back, the link to all, then the list); whichever panel is hidden is inert.
 */
export function MobileMenu({ open, onOpenChange, returnFocus }: { open: boolean; onOpenChange: (open: boolean) => void; returnFocus: React.RefObject<HTMLElement | null> }) {
  const [sub, setSub] = React.useState(false)
  // Which list the second panel holds. It stays while the panel slides back out.
  const [list, setList] = React.useState<MenuHref>("/repairs")
  const close = () => {
    onOpenChange(false)
    setSub(false)
  }
  const opener = React.useRef<HTMLButtonElement | null>(null)
  const backButton = React.useRef<HTMLButtonElement>(null)
  // Focus follows the panel: flushSync lifts `inert` before focusing, and preventScroll keeps the clipped sheet from jumping.
  const show = (next: boolean) => {
    flushSync(() => setSub(next))
    ;(next ? backButton : opener).current?.focus({ preventScroll: true })
  }
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
    >
      {/* The nav lives in the layout, so a link inside the sheet would leave it open on the next page. */}
      <SheetContent side="right" aria-describedby={undefined} className="gap-0 bg-sheet-body p-0" onClick={(e) => (e.target as HTMLElement).closest("a") && close()} onCloseAutoFocus={(e) => { e.preventDefault(); returnFocus.current?.focus() }}>
        <div className={bar}>
          <SheetTitle>{nav.menu}</SheetTitle>
        </div>
        <nav aria-label={nav.label} inert={sub} className="flex flex-col px-6 pt-2">
          <Link href="/" className={cn(row, rise)} style={delay(0)}>
            {nav.homeLink}
          </Link>
          {nav.links.map((link, i) =>
            hasMenu(link.href) ? (
              <button
                key={link.href}
                type="button"
                className={cn(row, "cursor-pointer justify-between", rise)}
                style={delay(i + 1)}
                onClick={(e) => {
                  opener.current = e.currentTarget
                  setList(link.href as MenuHref)
                  show(true)
                }}
              >
                {link.label}
                <Icon icon={ChevronRight} size="xl" className="text-steel" />
              </button>
            ) : (
              <Link key={link.href} href={link.href} className={cn(row, rise)} style={delay(i + 1)}>
                {link.label}
              </Link>
            )
          )}
          <Link href="/courier" className={cn(row, rise)} style={delay(nav.links.length + 1)}>
            {nav.courier}
          </Link>
        </nav>
        <div inert={sub} className="sticky bottom-0 mt-auto grid gap-2.5 bg-sheet-body px-6 pt-4 pb-6">
          <p className="flex flex-col text-caption text-steel">
            <span>{site.address.short}</span>
            <span>{site.hours.short}</span>
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <Button asChild size="lg" variant="line" className="px-4">
              <a href={site.phone.href} aria-label={nav.call} data-track="call" data-track-from="nav">
                <Icon icon={Phone} />
                {actions.call}
              </a>
            </Button>
            <Button asChild size="lg" variant="whatsapp" className="px-4">
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={actions.whatsappLabel} data-track="whatsapp" data-track-from="nav">
                <WhatsAppIcon />
                {actions.whatsapp}
              </a>
            </Button>
          </div>
        </div>
        {/* Absolute against the sheet itself (the scroller is not positioned), so it covers the whole sheet and scrolls on its own. It follows the close button in paint order. */}
        <div
          inert={!sub}
          className={cn(
            "absolute inset-0 flex flex-col overflow-y-auto overscroll-contain bg-sheet-body transition-transform duration-base ease-drawer motion-reduce:transition-none",
            !sub && "translate-x-full"
          )}
        >
          <div className={bar}>
            <button ref={backButton} type="button" className="-ml-1.5 flex min-h-11 cursor-pointer items-center gap-1 pr-3 pl-1" onClick={() => show(false)}>
              <Icon icon={ChevronLeft} size="xl" />
              {nav.back}
            </button>
          </div>
          <ul className="flex flex-col px-6 pt-2 pb-6">
            <li>
              <Link href={list} className={cn(entry, sub && rise)} style={delay(0)}>
                {menus[list].all}
              </Link>
            </li>
            {menus[list].items.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} className={cn(entry, sub && rise)} style={delay(i + 1)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
