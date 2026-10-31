"use client"

import * as React from "react"
import Link from "next/link"

import { WhatsAppIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { actions, nav, services, site } from "@/content"

// The nav's Radix menus. Nav loads this module with next/dynamic after hydration, so the menu and dialog code is not
// in the first load; until it arrives Nav shows the same trigger without behaviour. The triggers' faces come from Nav.

/** Repairs opens the 8 repairs. `menu` controls it (the top bar's, which fades with the bar). */
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
      {/* The top bar's menu fades with the bar (--nav-fade, set on scroll), so it never floats on after the bar. */}
      <DropdownMenuContent align="start" sideOffset={12} style={menu && { opacity: "var(--nav-fade, 1)", transition: "opacity var(--duration-reveal) var(--ease-out)" }}>
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

/** Phones: the menu sheet. `trigger` is Nav's menu button. */
export function MobileMenu({ trigger }: { trigger: React.ReactElement }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {/* The nav lives in the layout, so a link inside the sheet would leave it open on the next page. */}
      <SheetContent side="right" aria-describedby={undefined} onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        <SheetTitle>{nav.menu}</SheetTitle>
        <nav aria-label={nav.label} className="flex flex-col">
          {nav.links.map((link) => (
            <React.Fragment key={link.href}>
              <Link href={link.href} className="flex min-h-12 items-center font-display text-title-lg text-ink">
                {link.label}
              </Link>
              {link.href === "/repairs" && (
                <ul className="mb-2 border-l border-hairline pl-4">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/repairs/${s.slug}`} className="flex min-h-11 items-center text-body-md text-body">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </nav>
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto grid gap-2.5 bg-card px-6 pt-4 pb-6">
          <Button asChild size="lg" arrow>
            <Link href="/book">{actions.book}</Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a href={site.whatsapp.href} aria-label={actions.whatsappLabel} data-track="whatsapp" data-track-from="nav">
              <WhatsAppIcon />
              {actions.whatsapp}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
