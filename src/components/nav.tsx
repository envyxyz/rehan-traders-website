"use client"

import * as React from "react"
import Link from "next/link"
import * as m from "motion/react-m"
import { ChevronDown, Equal, Phone } from "lucide-react"

import { Icon, WhatsAppIcon } from "@/components/icon"
import { Mark } from "@/components/logo"
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
import { spring } from "@/lib/tokens"
import { cn } from "@/lib/utils"

const ISLAND_AT = 80 // px of scroll before the bar gathers into the island

const linkClass = "inline-flex h-11 items-center gap-1 rounded-pill px-3.5 font-display text-nav text-ink active:bg-concrete"

/** Repairs opens the 8 repairs; the other links are plain. */
function NavLinks() {
  return nav.links.map((link) =>
    link.href === "/repairs" ? (
      <DropdownMenu key={link.href} modal={false}>
        <DropdownMenuTrigger className={cn(linkClass, "cursor-pointer outline-none focus-visible:outline-2")}>
          {link.label}
          <Icon icon={ChevronDown} size="sm" className="text-steel" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={12}>
          {services.map((s) => (
            <DropdownMenuItem key={s.slug} asChild>
              <Link href={`/repairs/${s.slug}`}>{s.title}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={link.href}>{actions.allRepairs}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Link key={link.href} href={link.href} className={linkClass}>
        {link.label}
      </Link>
    )
  )
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="icon" className="bg-concrete lg:hidden" aria-label={nav.menu}>
          <Icon icon={Equal} size="lg" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" aria-describedby={undefined}>
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
        <div className="mt-auto grid gap-2.5 pt-4">
          <Button asChild size="lg" arrow>
            <Link href="/book">{actions.book}</Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
              <WhatsAppIcon />
              {actions.whatsapp}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/**
 * Top: logo and name left, glass pill of links and the phone button right.
 * After 80px it gathers into one centred glass island (Motion layout spring, no bounce).
 * Below lg it hides on scroll down and returns on scroll up.
 */
export function Nav() {
  const [island, setIsland] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    const desktop = matchMedia("(width >= 64rem)")
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      setIsland(y > ISLAND_AT)
      setHidden(!desktop.matches && y > last && y > ISLAND_AT)
      last = y
    }
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40 flex px-5 pt-5 pb-6 transition-transform duration-base ease-drawer sm:px-7 sm:pt-7 lg:px-14",
        island && "pt-3.5 sm:pt-3.5",
        hidden && "-translate-y-full"
      )}
    >
      <m.div
        layout
        transition={spring.layout}
        style={{ borderRadius: 9999 }}
        className={cn(
          "pointer-events-auto flex items-center gap-1",
          island ? "glass mx-auto p-1.25 pl-3" : "flex-1 justify-between"
        )}
      >
        <m.div layout="position" transition={spring.layout}>
          <Link href="/" aria-label={nav.home} className="flex items-center gap-2.25 font-display text-title-md font-extrabold tracking-tight text-ink">
            <Mark className={island ? "size-6.5" : "size-7.5"} />
            {!island && <span>{site.name}</span>}
          </Link>
        </m.div>
        <m.nav
          layout="position"
          transition={spring.layout}
          aria-label={nav.label}
          className={cn("flex items-center gap-0.5 rounded-pill", !island && "glass p-1.25")}
        >
          <div className="flex items-center gap-0.5 max-lg:hidden">
            <NavLinks />
          </div>
          <Button asChild className={cn(island ? "w-11 px-0" : "max-lg:w-11 max-lg:px-0")}>
            <m.a layout transition={spring.layout} href={site.phone.href} aria-label={nav.call}>
              <Icon icon={Phone} />
              {!island && <span className="text-nav font-bold max-lg:hidden">{site.phone.display}</span>}
            </m.a>
          </Button>
          <MobileMenu />
        </m.nav>
      </m.div>
    </header>
  )
}
