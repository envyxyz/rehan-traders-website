"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import * as m from "motion/react-m"
import { ChevronDown, Equal, Phone } from "lucide-react"

import { Icon } from "@/components/icon"
import { Mark } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { nav, site } from "@/content"
import { spring } from "@/lib/tokens"
import { cn } from "@/lib/utils"

const ISLAND_AT = 80 // phones: px of scroll before the bar gathers into the island
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
    <Icon icon={Equal} size="lg" />
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

/** Phone button: number on the bar, icon only in the island and on phones. */
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
 * Below lg: logo and name left, glass pill of the phone button and menu right.
 * After 80px it gathers into one centred glass island (Motion layout spring, no bounce).
 * It hides on scroll down and returns on scroll up.
 */
function MobileNav() {
  const [island, setIsland] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      setIsland(y > ISLAND_AT)
      if (y <= ISLAND_AT) setHidden(false)
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
        "pointer-events-none fixed inset-x-0 top-0 z-40 flex px-5 pt-5 pb-6 transition-transform duration-base ease-drawer sm:px-7 sm:pt-7 lg:hidden",
        island && "pt-3.5 sm:pt-3.5",
        hidden && "-translate-y-full focus-within:translate-y-0"
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
          <Link href="/" aria-label={nav.home} className={cn("flex min-h-11 items-center gap-2.25 font-display text-title-md font-extrabold tracking-tight text-ink", island && "-mx-2.25 min-w-11 justify-center")}>
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
          <m.div layout transition={spring.layout}>
            <CallButton compact />
          </m.div>
          <MobileMenu trigger={menuButton} />
        </m.nav>
      </m.div>
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
