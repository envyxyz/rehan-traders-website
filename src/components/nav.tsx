"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

import { Icon } from "@/components/icon"
import { ChevronDown, Menu, Phone } from "@/components/icons"
import { Mark } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { jobCardContent, nav, site } from "@/content"
import { cn } from "@/lib/utils"

const SCROLL_SLOP = 8 // px of travel before a direction counts, so a thumb's jitter does not flick the nav
const HEADER_HEIGHT = 64 // phones: the header's h-16

const MORPH_SPRING = 10 // rad/s, desktop: the one knob for the morph's speed. Critically damped, so it settles in about 0.6s
const ISLAND_ON = 80 // px scrolled before the bar becomes the island...
const ISLAND_OFF = 32 // ...and before it goes back: apart, so the page resting on the edge cannot flicker it

// The morph's geometry in px. Each mirrors a class in DesktopNav's markup, noted beside it.
const BAR_PAD = 56 // the row's px-14
const RISE = 14 // the row's pt-7 (28) to the island's top (14)
const NAV_PAD = 5 // the nav's p-1.25
const NAV_GAP = 2 // gap-0.5 between the links and the call button
const MARK_BAR = 40 // size-10
const MARK_ISLAND = 26
const ISLAND_PAD = 12 // the island's edge to its mark
const ISLAND_LEAD = ISLAND_PAD + MARK_ISLAND + 6 // ...and on to the first link's cell: 6px of gap
const CALL_CHROME = 62 // the call button without its number: 18 pad + 18 icon + 8 gap + 18 pad
const CALL_ICON = 44 // the call button as a round icon button
const ICON_SHIFT = 5 // its phone icon moves from 18px in to the middle of the 44
const WORD_DONE = 0.55 // by this much of the morph the name has gone into the mark...
const NUMBER_DONE = 0.7 // ...and the number into the phone icon

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
// The Radix menu and sheet (about 48 KB) wait for the visitor's first interaction, out of the page load. Until then Repairs is a
// plain link to its page, and the phone menu's button is already the real one: a tap opens the sheet as soon as its code arrives.
const RepairsLink = () => (
  <Link href={repairs.href} className={triggerClass}>
    {repairsFace}
  </Link>
)
const RepairsMenu = dynamic(() => import("@/components/nav-menus").then((mod) => mod.RepairsMenu), { ssr: false, loading: RepairsLink })
const MobileMenu = dynamic(() => import("@/components/nav-menus").then((mod) => mod.MobileMenu), { ssr: false })

/** True from the visitor's first interaction of these kinds. Lighthouse never interacts, and neither has anyone who has not yet looked. */
function useWake(events: readonly (keyof WindowEventMap)[]) {
  const [awake, setAwake] = React.useState(false)
  React.useEffect(() => {
    const wake = () => setAwake(true)
    events.forEach((e) => addEventListener(e, wake, { passive: true, once: true }))
    return () => events.forEach((e) => removeEventListener(e, wake))
  }, [events])
  return awake
}
// No tap here: a tap on the plain Repairs link just opens its page, and swapping the link under the finger would lose it.
const WAKE_DESKTOP = ["pointermove", "keydown", "wheel", "scroll"] as const
const WAKE_PHONE = ["touchstart", "pointerdown", "keydown", "scroll"] as const

/** Repairs opens the 8 repairs; the other links are plain. `menu` controls the Repairs menu. */
function NavLinks({ menu }: { menu: { open: boolean; onOpenChange: (open: boolean) => void } }) {
  const awake = useWake(WAKE_DESKTOP)
  return nav.links.map((link) =>
    link === repairs ? (
      awake ? (
        <RepairsMenu key={link.href} href={link.href} className={triggerClass} menu={menu}>
          {repairsFace}
        </RepairsMenu>
      ) : (
        <RepairsLink key={link.href} />
      )
    ) : (
      <Link key={link.href} href={link.href} className={linkClass}>
        {link.label}
      </Link>
    )
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

type Geometry = { callW: number; navW: number; islandW: number; dxNav: number; dxLogo: number }

/** The measured widths in, the morph's distances out (px). The row is the viewport; the links and the number are natural width. */
function geometry(rowW: number, linksW: number, numberW: number): Geometry {
  const callW = numberW + CALL_CHROME
  const navW = NAV_PAD + linksW + NAV_GAP + callW + NAV_PAD
  const islandW = ISLAND_LEAD + linksW + NAV_GAP + CALL_ICON + NAV_PAD
  const islandLeft = (rowW - islandW) / 2
  const navLeftBar = rowW - BAR_PAD - navW
  const navLeftIsland = islandLeft + ISLAND_LEAD - NAV_PAD // the links start in the same place in both
  return {
    callW,
    navW,
    islandW,
    dxNav: Math.round(navLeftIsland - navLeftBar),
    dxLogo: Math.round(islandLeft + ISLAND_PAD + MARK_ISLAND / 2 - (BAR_PAD + MARK_BAR / 2)), // mark centre to mark centre
  }
}

type Parts = Record<"row" | "logo" | "mark" | "wordMask" | "word" | "nav" | "glass" | "call" | "callIcon" | "number", HTMLElement>

/** Every style of the morph, from p (0 the bar, 1 the island). Each is a pure function of p, so no in-between can be wrong. */
function paint(el: Parts, g: Geometry, p: number) {
  const t = Math.min(Math.max(p, 0), 1) // a spring can run a hair past its ends
  const slide = (done: number) => `${-100 * Math.min(t / done, 1)}% 0` // out of sight to the left, by `done` of the morph
  const squeeze = g.callW - CALL_ICON
  el.row.style.translate = `0 ${-RISE * t}px`
  el.logo.style.translate = `${g.dxLogo * t}px 0`
  el.mark.style.scale = String(1 - (1 - MARK_ISLAND / MARK_BAR) * t)
  el.wordMask.style.translate = `${-((MARK_BAR - MARK_ISLAND) / 2) * t}px 0` // stays against the shrinking mark
  el.word.style.translate = slide(WORD_DONE)
  el.nav.style.translate = `${g.dxNav * t}px 0`
  el.glass.style.width = `${g.navW + (g.islandW - g.navW) * t}px`
  el.glass.style.translate = `${-(ISLAND_LEAD - NAV_PAD) * t}px 0`
  el.call.style.width = `${g.callW - squeeze * t}px`
  el.call.style.marginRight = `${squeeze * t}px` // the nav's outer width stays put, so nothing around it reflows
  el.callIcon.style.translate = `${-ICON_SHIFT * t}px 0`
  el.number.style.translate = slide(NUMBER_DONE)
}

/**
 * Desktop: one header that morphs. At the top it is the bar (logo and name left, a glass pill of links and the phone number
 * right); scrolled past 80px it is the centred island (the mark, the links, a round call button), and back near the top.
 * The name slides into the mark and the number into the phone icon, each behind a mask beside it, and the glass reshapes: no
 * fading, and no second element to get out of step. A critically damped spring drives one number, p (0 bar, 1 island), and
 * paint() writes every style from it on each frame, with no re-render. Retargeting mid-way keeps the spring's speed, so
 * spamming scroll up and down only ever reverses it. Reduced motion: p jumps. Without JS the markup is the bar.
 */
function DesktopNav() {
  const row = React.useRef<HTMLDivElement>(null)
  const logo = React.useRef<HTMLAnchorElement>(null)
  const mark = React.useRef<HTMLSpanElement>(null)
  const wordMask = React.useRef<HTMLSpanElement>(null)
  const word = React.useRef<HTMLSpanElement>(null)
  const navEl = React.useRef<HTMLElement>(null)
  const glass = React.useRef<HTMLSpanElement>(null)
  const links = React.useRef<HTMLDivElement>(null)
  const call = React.useRef<HTMLAnchorElement>(null)
  const callIcon = React.useRef<HTMLSpanElement>(null)
  const number = React.useRef<HTMLSpanElement>(null)
  const [menu, setMenu] = React.useState(false)

  React.useEffect(() => {
    const el: Parts = {
      row: row.current!,
      logo: logo.current!,
      mark: mark.current!,
      wordMask: wordMask.current!,
      word: word.current!,
      nav: navEl.current!,
      glass: glass.current!,
      call: call.current!,
      callIcon: callIcon.current!,
      number: number.current!,
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let geo: Geometry | null = null
    let island = scrollY > ISLAND_ON
    let target = Number(island)
    let p = target
    let v = 0
    let frame = 0
    let last = 0
    const draw = () => geo && paint(el, geo, p)
    el.wordMask.style.pointerEvents = island ? "none" : "" // the hidden name must not catch clicks meant for the links
    // Until the visitor does something, a scroll is the browser's (a reload put back part way down, a #link): the header
    // takes its place at once instead of morphing on arrival.
    let touched = false
    const touch = () => (touched = true)
    const INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const
    INPUT.forEach((e) => addEventListener(e, touch, { passive: true, once: true }))

    const step = (now: number) => {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 30)
      last = now
      v += (-2 * MORPH_SPRING * v - MORPH_SPRING ** 2 * (p - target)) * dt
      p += v * dt
      const settled = Math.abs(p - target) < 0.001 && Math.abs(v) < 0.01
      if (settled) {
        p = target
        v = 0
      }
      frame = settled ? 0 : requestAnimationFrame(step)
      draw()
    }
    const onScroll = () => {
      const next = island ? scrollY >= ISLAND_OFF : scrollY > ISLAND_ON
      if (next === island) return
      island = next
      target = Number(island)
      el.wordMask.style.pointerEvents = island ? "none" : ""
      setMenu(false) // an open Repairs menu does not follow the nav
      if (reduced.matches || !touched) {
        cancelAnimationFrame(frame)
        frame = 0
        p = target
        v = 0
        draw()
      } else if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(step)
      }
    }
    // The header is display:none below lg, where the row measures 0 and there is nothing to paint.
    const measure = () => {
      const rowW = el.row.offsetWidth // offsetWidth ignores transforms, so painting never changes what is measured
      if (!rowW) return
      geo = geometry(rowW, links.current!.offsetWidth, el.number.offsetWidth)
      draw()
    }
    const resize = new ResizeObserver(measure)
    resize.observe(el.row)
    resize.observe(links.current!)
    resize.observe(el.number)
    measure()
    addEventListener("scroll", onScroll, { passive: true })
    document.documentElement.dataset.nav = "live" // the header is painted: lifts the pre-hydration hiding (layout.tsx)
    return () => {
      INPUT.forEach((e) => removeEventListener(e, touch))
      removeEventListener("scroll", onScroll)
      resize.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className="nav-desktop max-lg:hidden">
      <div ref={row} className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-14 pt-7 pb-6">
        <Link ref={logo} href="/" aria-label={nav.home} className="pointer-events-auto relative z-10 flex size-10 text-ink will-change-transform">
          <span ref={mark} className="flex">
            <Mark className="size-10" />
          </span>
          {/* The name sits behind this mask, beside the mark, and slides left into it. Taller than the mark so descenders stay. */}
          <span ref={wordMask} className="absolute -inset-y-2 left-full flex items-center overflow-hidden">
            <span ref={word} className="flex flex-col pl-2.5 whitespace-nowrap">
              <span className="font-display text-title-md leading-none font-extrabold tracking-tight">{site.name}</span>
              <span className="mt-1.5 text-caption leading-none text-steel">{site.descriptor}</span>
            </span>
          </span>
        </Link>
        <nav ref={navEl} aria-label={nav.label} className="pointer-events-auto relative isolate flex items-center gap-0.5 p-1.25 will-change-transform">
          <span ref={glass} aria-hidden className="glass absolute inset-0 -z-10 rounded-pill" />
          <div ref={links} className="flex items-center gap-0.5">
            <NavLinks menu={{ open: menu, onOpenChange: setMenu }} />
          </div>
          {/* The number sits behind a mask beside the icon and slides left into it, while the button narrows to a circle. */}
          <Button asChild className="justify-start overflow-hidden">
            <a ref={call} href={site.phone.href} aria-label={nav.call} data-track="call" data-track-from="nav">
              <span ref={callIcon} className="flex">
                <Icon icon={Phone} />
              </span>
              <span className="shrink-0 overflow-hidden">
                <span ref={number} className="block text-nav font-bold">
                  {site.phone.display}
                </span>
              </span>
            </a>
          </Button>
        </nav>
      </div>
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
  const menuButton = React.useRef<HTMLButtonElement>(null)
  const awake = useWake(WAKE_PHONE)
  const [menuOpen, setMenuOpen] = React.useState(false)
  // A tap before the page went live, kept by the inline script in layout.tsx.
  React.useEffect(() => {
    if ((window as Window & { menuTap?: boolean }).menuTap) requestAnimationFrame(() => setMenuOpen(true))
  }, [])

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
        <Button ref={menuButton} variant="icon" className="bg-concrete" aria-label={nav.menu} aria-haspopup="dialog" aria-expanded={menuOpen} data-menu onClick={() => setMenuOpen(true)}>
          <Icon icon={Menu} size="lg" />
        </Button>
        {(awake || menuOpen) && <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} returnFocus={menuButton} />}
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
