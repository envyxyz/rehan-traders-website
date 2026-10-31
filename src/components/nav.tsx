"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ChevronDown, Menu, Phone } from "lucide-react"

import { Icon } from "@/components/icon"
import { Mark } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { nav, site } from "@/content"
import { cn } from "@/lib/utils"

const HIDE_AFTER = 80 // phones: px of scroll before the header may hide, so it never leaves the top of a page
const SCROLL_SLOP = 8 // phones: px of travel before a direction counts, so a thumb's jitter does not flick the nav
const BAR_FADE = 240 // desktop: px of scroll over which the top bar fades out

const linkClass = "inline-flex h-11 items-center gap-1 rounded-pill px-3.5 font-display text-nav text-ink active:bg-concrete"
// No outline utilities: the global :focus-visible ring applies (`outline-none` here used to hide it for keyboard users too).
const triggerClass = cn(linkClass, "cursor-pointer")
const repairs = nav.links.find((link) => link.href === "/repairs")!
const repairsFace = (
  <>
    {repairs.label}
    <Icon icon={ChevronDown} size="sm" className="text-steel" />
  </>
)
const menuButton = (
  <Button variant="icon" className="bg-concrete" aria-label={nav.menu}>
    <Icon icon={Menu} size="lg" />
  </Button>
)

// The Radix menu and sheet load after hydration, out of the first load; until then the same triggers show, inert.
const RepairsMenu = dynamic(() => import("@/components/nav-menus").then((mod) => mod.RepairsMenu), {
  ssr: false,
  loading: () => (
    <button type="button" className={triggerClass}>
      {repairsFace}
    </button>
  ),
})
const MobileMenu = dynamic(() => import("@/components/nav-menus").then((mod) => mod.MobileMenu), { ssr: false, loading: () => menuButton })

/** Repairs opens the 8 repairs; the other links are plain. `menu` controls the Repairs menu (the top bar's). */
function NavLinks({ menu }: { menu?: { open: boolean; onOpenChange: (open: boolean) => void } }) {
  return nav.links.map((link) =>
    link === repairs ? (
      <RepairsMenu key={link.href} href={link.href} className={triggerClass} menu={menu}>
        {repairsFace}
      </RepairsMenu>
    ) : (
      <Link key={link.href} href={link.href} className={linkClass}>
        {link.label}
      </Link>
    )
  )
}

/** Phone button: number on the bar, icon only in the island. */
function CallButton({ compact }: { compact?: boolean }) {
  return (
    <Button asChild className={compact ? "w-11 px-0" : undefined}>
      <a href={site.phone.href} aria-label={nav.call} data-track="call" data-track-from="nav">
        <Icon icon={Phone} />
        {!compact && <span className="text-nav font-bold">{site.phone.display}</span>}
      </a>
    </Button>
  )
}

/**
 * Desktop. Scrolling fades the top bar (logo and name left, glass pill of links and phone right) out.
 * Once the hero is behind you, a separate centred glass island fades in. No morph between them.
 */
function DesktopNav() {
  const bar = React.useRef<HTMLDivElement>(null)
  const [gone, setGone] = React.useState(false)
  const [island, setIsland] = React.useState(false)
  const [menu, setMenu] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      const fade = Math.min(scrollY / BAR_FADE, 1)
      bar.current?.style.setProperty("opacity", String(1 - fade))
      document.documentElement.style.setProperty("--nav-fade", String(1 - fade))
      setGone(fade === 1)
      if (fade === 1) setMenu(false)
      // Only the home page has a hero (#top); elsewhere the island takes over as soon as the bar is gone.
      const hero = document.getElementById("top")
      setIsland(hero ? hero.getBoundingClientRect().bottom <= 0 : fade === 1)
    }
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="max-lg:hidden">
      <div ref={bar} inert={gone} className="pointer-events-none fixed inset-x-0 top-0 z-40 flex px-14 pt-7 pb-6 transition-opacity duration-(--duration-reveal) ease-out motion-reduce:transition-none">
        <div className="pointer-events-auto flex flex-1 items-center justify-between">
          <Link href="/" aria-label={nav.home} className="flex items-center gap-2.5 text-ink">
            <Mark className="size-10" />
            <span className="flex flex-col">
              <span className="font-display text-title-md leading-none font-extrabold tracking-tight">{site.name}</span>
              <span className="mt-1.5 text-caption leading-none text-steel">{site.descriptor}</span>
            </span>
          </Link>
          <nav aria-label={nav.label} className="glass flex items-center gap-0.5 rounded-pill p-1.25">
            <NavLinks menu={{ open: menu, onOpenChange: setMenu }} />
            <CallButton />
          </nav>
        </div>
      </div>
      <nav
        aria-label={nav.label}
        inert={!island}
        className={cn(
          "glass fixed inset-x-0 top-3.5 z-40 mx-auto flex w-fit items-center gap-0.5 rounded-pill p-1.25 pl-3 transition duration-(--duration-reveal) ease-out motion-reduce:transition-none",
          !island && "-translate-y-2 opacity-0 motion-reduce:translate-y-0"
        )}
      >
        <Link href="/" aria-label={nav.home} className="mr-1.5 flex items-center">
          <Mark className="size-6.5" />
        </Link>
        <NavLinks />
        <CallButton compact />
      </nav>
    </header>
  )
}

/**
 * Below lg: the mark (home) left, the menu button right. Transparent at the top of the page, solid with a hairline once
 * scrolled. It slides up out of view on scroll down and back on scroll up.
 */
function MobileNav() {
  const [scrolled, setScrolled] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      // Clamped: iOS bounces past the end of the page, and the bounce back would read as a scroll up.
      const y = Math.min(scrollY, document.documentElement.scrollHeight - innerHeight)
      setScrolled(y > 0)
      if (y <= HIDE_AFTER) setHidden(false)
      else if (Math.abs(y - last) >= SCROLL_SLOP) setHidden(y > last)
      else return
      last = y
    }
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-transparent px-5 transition duration-base ease-drawer motion-reduce:transition-none sm:px-7 lg:hidden",
        scrolled && "border-hairline bg-paper",
        hidden && "-translate-y-full focus-within:translate-y-0"
      )}
    >
      <Link href="/" aria-label={nav.home} className="-ml-1.5 flex size-11 items-center justify-center text-ink">
        <Mark className="size-8" />
      </Link>
      <MobileMenu trigger={menuButton} />
    </header>
  )
}

export function Nav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}
