"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ChevronDown, Menu, Phone } from "lucide-react"

import { Icon } from "@/components/icon"
import { Mark } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { jobCardContent, nav, site } from "@/content"
import { cn } from "@/lib/utils"

const SCROLL_SLOP = 8 // px of travel before a direction counts, so a thumb's jitter does not flick the nav
const BAR_TRAVEL = 96 // desktop: px of scroll over which the top bar leaves with the page, and the island takes over
const HEADER_HEIGHT = 64 // phones: the header's h-16

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

/** Repairs opens the 8 repairs; the other links are plain. `menu` controls the Repairs menu; `fades` is the top bar's. */
function NavLinks({ menu, fades }: { menu: { open: boolean; onOpenChange: (open: boolean) => void }; fades?: boolean }) {
  return nav.links.map((link) =>
    link === repairs ? (
      <RepairsMenu key={link.href} href={link.href} className={triggerClass} menu={menu} fades={fades}>
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

type Headroom = {
  /** Scroll position, clamped so iOS's bounce past either end never reads as a scroll the other way. */
  y: number
  /** Scrolling up, so the nav comes back into view. */
  shown: boolean
  /** Still near the top since the page's start: the nav moves with the page, so top to sticky has no seam. */
  linked: boolean
  /** Reduced motion: the nav never moves. */
  still: boolean
}

/** Calls `paint` on every scroll. It writes styles directly, so scrolling never re-renders the nav. */
function useHeadroom(distance: number, paint: (head: Headroom) => void) {
  React.useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let last = scrollY
    let shown = false
    let linked = true
    const onScroll = () => {
      const y = Math.max(0, Math.min(scrollY, document.documentElement.scrollHeight - innerHeight))
      if (y === 0) linked = true
      else if (y >= distance) linked = false
      if (y === 0) {
        shown = false
        last = 0
      } else if (Math.abs(y - last) >= SCROLL_SLOP) {
        shown = y < last
        last = y
      }
      paint({ y, shown, linked, still: reduced.matches })
    }
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [distance, paint])
}

const startsAtTop = { "--nav-y": "0px" } as React.CSSProperties

/**
 * Desktop. From the top the bar (logo and name left, glass pill of links and phone right) leaves with the page, fading as it goes.
 * Past it, a centred glass island slides in on scroll up and out on scroll down, and cross-fades back to the bar near the top.
 * No morph between them. Reduced motion: nothing moves, and the bar swaps for an island that stays.
 */
function DesktopNav() {
  const bar = React.useRef<HTMLDivElement>(null)
  const island = React.useRef<HTMLElement>(null)
  const [gone, setGone] = React.useState(false)
  const [menu, setMenu] = React.useState(false)
  const [islandMenu, setIslandMenu] = React.useState(false)

  const paint = React.useCallback(({ y, shown, still }: Headroom) => {
    const fade = still ? Number(y >= BAR_TRAVEL) : Math.min(y / BAR_TRAVEL, 1)
    if (bar.current) {
      bar.current.style.opacity = String(1 - fade)
      bar.current.style.translate = still ? "" : `0 ${-Math.min(y, BAR_TRAVEL)}px`
    }
    document.documentElement.style.setProperty("--nav-fade", String(1 - fade))
    const up = shown || (still && fade === 1)
    if (island.current) {
      island.current.style.opacity = String(fade)
      island.current.style.setProperty("--nav-y", up ? "0px" : "-150%")
    }
    setGone(fade > 0.5)
    if (fade > 0.5) setMenu(false)
    if (!up) setIslandMenu(false) // an open menu leaves with the island
  }, [])
  useHeadroom(BAR_TRAVEL, paint)

  return (
    <header className="max-lg:hidden">
      <div ref={bar} inert={gone} className="pointer-events-none fixed inset-x-0 top-0 z-40 flex px-14 pt-7 pb-6 transition duration-fast ease-out motion-reduce:transition-none">
        <div className="pointer-events-auto flex flex-1 items-center justify-between">
          <Link href="/" aria-label={nav.home} className="flex items-center gap-2.5 text-ink">
            <Mark className="size-10" />
            <span className="flex flex-col">
              <span className="font-display text-title-md leading-none font-extrabold tracking-tight">{site.name}</span>
              <span className="mt-1.5 text-caption leading-none text-steel">{site.descriptor}</span>
            </span>
          </Link>
          <nav aria-label={nav.label} className="glass flex items-center gap-0.5 rounded-pill p-1.25">
            <NavLinks menu={{ open: menu, onOpenChange: setMenu }} fades />
            <CallButton />
          </nav>
        </div>
      </div>
      <nav
        ref={island}
        aria-label={nav.label}
        inert={!gone}
        style={startsAtTop}
        className={cn(
          "glass fixed inset-x-0 top-3.5 z-40 mx-auto flex w-fit translate-y-(--nav-y) items-center gap-0.5 rounded-pill p-1.25 pl-3 transition duration-(--duration-nav) ease-nav focus-within:translate-y-0 motion-reduce:transition-none",
          !gone && "motion-reduce:hidden"
        )}
      >
        <Link href="/" aria-label={nav.home} className="mr-1.5 flex items-center">
          <Mark className="size-6.5" />
        </Link>
        <NavLinks menu={{ open: islandMenu, onOpenChange: setIslandMenu }} />
        <CallButton compact />
      </nav>
    </header>
  )
}

/**
 * Below lg: the lockup (home) left, the call and menu buttons right. From the top it leaves with the page, still transparent, so
 * there is no seam; past that it slides in, solid with a hairline, on scroll up and out on scroll down, and the solid fades back
 * out as the page reaches the top. Reduced motion: it stays put, and turns solid once scrolled.
 */
function MobileNav() {
  const header = React.useRef<HTMLElement>(null)
  const solid = React.useRef<HTMLSpanElement>(null)

  const paint = React.useCallback(({ y, shown, linked, still }: Headroom) => {
    const el = header.current
    if (!el) return
    el.style.setProperty("--nav-y", still || shown ? "0px" : `${-(linked ? y : HEADER_HEIGHT)}px`)
    el.style.transition = linked && !still ? "none" : "" // linked moves with the finger; a transition would trail behind it
    if (solid.current) solid.current.style.opacity = String(still ? Number(y > 0) : linked ? 0 : Math.min(y / HEADER_HEIGHT, 1))
  }, [])
  useHeadroom(HEADER_HEIGHT, paint)

  return (
    <header
      ref={header}
      style={startsAtTop}
      className="fixed inset-x-0 top-0 z-40 flex h-16 translate-y-(--nav-y) items-center justify-between px-5 transition-transform duration-(--duration-nav) ease-nav focus-within:translate-y-0 motion-reduce:transition-none sm:px-7 lg:hidden"
    >
      <span ref={solid} aria-hidden className="absolute inset-0 -z-10 border-b border-hairline bg-paper opacity-0" />
      <Link href="/" aria-label={nav.home} className="-ml-1.5 flex h-11 items-center gap-2 px-1.5 text-ink">
        <Mark className="size-9" />
        <span className="flex flex-col font-display text-title-md leading-none font-extrabold tracking-tight">
          <span>{jobCardContent.brandFirst}</span>
          <span>{jobCardContent.brandSecond}</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="icon" className="bg-concrete">
          <a href={site.phone.href} aria-label={nav.call} data-track="call" data-track-from="nav">
            <Icon icon={Phone} size="lg" />
          </a>
        </Button>
        <MobileMenu trigger={menuButton} />
      </div>
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
