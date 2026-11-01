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
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { actions, nav, site } from "@/content"
import { services } from "@/content-large"
import { menuStagger } from "@/lib/tokens"
import { cn } from "@/lib/utils"

// The nav's Radix menus. Nav loads this module with next/dynamic after hydration, so the menu and dialog code is not
// in the first load; until it arrives Nav shows the same trigger without behaviour. The triggers' faces come from Nav.

/** Repairs opens the 8 repairs. `menu` controls it. */
export function RepairsMenu({
  href,
  className,
  menu,
  children,
}: {
  href: string
  className: string
  menu?: { open: boolean; onOpenChange: (open: boolean) => void }
  children: React.ReactNode
}) {
  return (
    <DropdownMenu modal={false} {...menu}>
      <DropdownMenuTrigger className={className}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={12}>
        {services.map((s) => (
          <DropdownMenuItem key={s.slug} asChild>
            <Link href={`/repairs/${s.slug}`}>{s.title}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={href}>{actions.allRepairs}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const repairs = nav.links.find((link) => link.href === "/repairs")!
const row = "flex min-h-12 w-full items-center font-display text-title-lg text-ink"
// The header strip of both panels (Menu, Back): the same height, type, separator and tint. The sheet's X sits in its right end.
const bar = "flex h-17 shrink-0 items-center border-b border-hairline bg-sheet-bar px-6 font-display text-title-lg text-ink"
const entry = "flex min-h-11 items-center text-body-md text-body"
const rise = "animate-rise motion-reduce:animate-none"
const delay = (i: number) => ({ animationDelay: `${menuStagger.start + i * menuStagger.step}s` })

/**
 * Phones: the menu sheet. `trigger` is Nav's menu button. The items fade in after the sheet slides in. Repairs slides a
 * second panel over the first (Back, All repairs, the eight repairs); whichever panel is hidden is inert.
 */
export function MobileMenu({ trigger }: { trigger: React.ReactElement }) {
  const [open, setOpen] = React.useState(false)
  const [sub, setSub] = React.useState(false)
  const repairsButton = React.useRef<HTMLButtonElement>(null)
  const backButton = React.useRef<HTMLButtonElement>(null)
  // Focus follows the panel: flushSync lifts `inert` before focusing, and preventScroll keeps the clipped sheet from jumping.
  const show = (next: boolean) => {
    flushSync(() => setSub(next))
    ;(next ? backButton : repairsButton).current?.focus({ preventScroll: true })
  }
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setSub(false)
      }}
    >
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {/* The nav lives in the layout, so a link inside the sheet would leave it open on the next page. */}
      <SheetContent side="right" aria-describedby={undefined} className="gap-0 bg-sheet-body p-0" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        <div className={bar}>
          <SheetTitle>{nav.menu}</SheetTitle>
        </div>
        <nav aria-label={nav.label} inert={sub} className="flex flex-col px-6 pt-2">
          <Link href="/" className={cn(row, rise)} style={delay(0)}>
            {nav.homeLink}
          </Link>
          {nav.links.map((link, i) =>
            link === repairs ? (
              <button key={link.href} ref={repairsButton} type="button" className={cn(row, "cursor-pointer justify-between", rise)} style={delay(i + 1)} onClick={() => show(true)}>
                {link.label}
                <Icon icon={ChevronRight} size="xl" className="text-steel" />
              </button>
            ) : (
              <Link key={link.href} href={link.href} className={cn(row, rise)} style={delay(i + 1)}>
                {link.label}
              </Link>
            )
          )}
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
              <Link href={repairs.href} className={cn(entry, sub && rise)} style={delay(0)}>
                {actions.allRepairs}
              </Link>
            </li>
            {services.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/repairs/${s.slug}`} className={cn(entry, sub && rise)} style={delay(i + 1)}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
