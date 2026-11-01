import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Chip } from "@/components/chip"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { ArrowRight, Clock, MapPin, Phone, repairIcons, ShieldCheck, Smartphone, Star, Wrench } from "@/components/icons"
import { Container, Section } from "@/components/layout"
import { Reveal } from "@/components/reveal"
import { PriceLine } from "@/components/price-line"
import { Heading, Text } from "@/components/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { actions, estimate, faq, hero, nav, seo, site, ui } from "@/content"
import { faults, services } from "@/content-large"
import { duration } from "@/lib/tokens"
import { ToastDemo } from "./toast-demo"

export const metadata: Metadata = { title: seo.kitchenSink.title, robots: { index: false, follow: false } }

// ponytail: dev-only labels stay here, not in content.ts; this route 404s in production.
const L = {
  colours: "Colours",
  type: "Type scale",
  spacing: "Spacing and radii",
  depth: "Depth and glass",
  motion: "Motion",
  buttons: "Buttons",
  chips: "Badges and chips",
  cards: "Card and price line",
  form: "Form",
  overlays: "Overlays",
  faq: "Accordion",
  icons: "Icons",
  openDialog: "Open dialog",
  openSheet: "Open sheet",
  openBottom: "Bottom sheet",
  openMenu: "Repairs menu",
  tooltip: "Hover or focus me",
  newBadge: "New",
  revealed: "Revealed once on scroll (8px rise)",
  disabled: "Disabled",
  depthNote: "glass · shadow-float · bg-panel rounded-xl",
  ms: "ms",
}

const colours = [
  "paper", "panel", "card", "concrete", "hairline", "ink", "body", "steel", "steel-soft",
  "action", "action-active", "on-action", "signal", "whatsapp", "star", "open",
  "success", "warning", "error", "band", "band-elevated", "on-band", "on-band-soft",
]

const typeSamples = [
  { token: "display-xl", className: "font-display text-display-xl", text: hero.title },
  { token: "display-lg", className: "font-display text-display-lg", text: "Touch glass, replaced." },
  { token: "display-md", className: "font-display text-display-md", text: services[1].title },
  { token: "title-lg", className: "font-display text-title-lg", text: services[2].title },
  { token: "title-md", className: "font-display text-title-md", text: services[0].title },
  { token: "body-md", className: "text-body-md", text: hero.lede },
  { token: "body-sm", className: "text-body-sm", text: site.hours.oneLine },
  { token: "caption", className: "text-caption", text: site.address.short },
  { token: "button", className: "font-display text-button", text: actions.book },
  { token: "nav", className: "font-display text-nav", text: nav.links.map((l) => l.label).join("  ·  ") },
]

const spaces = ["w-1", "w-2", "w-3", "w-4", "w-6", "w-8", "w-12", "w-section"]
const radii = ["rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-pill"]

function Label2({ children }: { children: React.ReactNode }) {
  return <Text size="caption" tone="muted" className="mb-3">{children}</Text>
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 border-t border-hairline py-12 md:grid-cols-4">
      <Heading as="h2" size="title-lg">{title}</Heading>
      <div className="min-w-0 md:col-span-3">{children}</div>
    </div>
  )
}

const devices = [
  { brand: "Apple", models: ["iPhone 15", "iPhone 15 Pro"] },
  { brand: "Samsung", models: ["Galaxy S24", "Galaxy Z Fold5"] },
]

export default function KitchenSink() {
  if (process.env.NODE_ENV === "production") notFound()

  return (
    <TooltipProvider>
    <Section>
      <Container>
        <Heading as="h1" size="display-xl" rule className="mb-4">{seo.kitchenSink.title}</Heading>
        <Text tone="muted" className="mb-8">{site.entity}</Text>

        <Block title={L.colours}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {colours.map((c) => (
              <div key={c}>
                <div className="h-14 rounded-sm border border-hairline" style={{ background: `var(--${c})` }} />
                <Text size="caption" tone="muted" className="mt-1.5">{c}</Text>
              </div>
            ))}
          </div>
        </Block>

        <Block title={L.type}>
          <div className="grid gap-6">
            {typeSamples.map((s) => (
              <div key={s.token}>
                <Label2>{s.token}</Label2>
                <p className={`${s.className} text-ink`}>{s.text}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title={L.spacing}>
          <div className="grid gap-2">
            {spaces.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <Text size="caption" tone="muted" className="w-24">{s}</Text>
                <div className={`${s} h-3 bg-ink`} />
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            {radii.map((r) => (
              <div key={r} className="text-center">
                <div className={`${r} size-20 border border-hairline bg-card`} />
                <Text size="caption" tone="muted" className="mt-1.5">{r}</Text>
              </div>
            ))}
          </div>
        </Block>

        <Block title={L.depth}>
          <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-xl bg-panel p-8">
            <p aria-hidden className="absolute inset-x-8 top-8 font-display text-display-lg text-steel-soft">{hero.title}</p>
            <div className="relative flex flex-wrap items-center gap-4">
              <div className="glass flex flex-wrap items-center gap-1 rounded-xl p-1.5 sm:rounded-pill">
                {nav.links.map((l) => (
                  <span key={l.href} className="rounded-pill px-3 py-2 font-display text-nav">{l.label}</span>
                ))}
                <Button size="md" className="h-9.5 px-3.5">
                  <Icon icon={Phone} size="sm" />
                </Button>
              </div>
              <div className="grid size-15 place-items-center rounded-pill bg-whatsapp text-on-whatsapp shadow-float">
                <WhatsAppIcon size="xl" />
              </div>
            </div>
          </div>
          <Text size="caption" tone="muted" className="mt-3">{L.depthNote}</Text>
        </Block>

        <Block title={L.motion}>
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(duration).map(([k, v]) => (
              <Badge key={k} variant="line">{`${k} ${v * 1000}${L.ms}`}</Badge>
            ))}
            {["ease-out", "ease-in-out", "ease-drawer"].map((e) => (
              <Badge key={e} variant="line">{e}</Badge>
            ))}
          </div>
          <Reveal>
            <Card><CardDescription>{L.revealed}</CardDescription></Card>
          </Reveal>
        </Block>

        <Block title={L.buttons}>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" arrow>{actions.book}</Button>
              <Button size="lg" variant="whatsapp"><WhatsAppIcon />{actions.whatsapp}</Button>
              <Button size="lg" variant="line"><Icon icon={Phone} />{site.phone.display}</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button arrow>{actions.bookRepair}</Button>
              <Button variant="whatsapp"><WhatsAppIcon />{actions.whatsapp}</Button>
              <Button variant="line">{actions.directions}</Button>
              <Button variant="glass">{nav.links[0].label}</Button>
              <Button variant="icon" aria-label={nav.call}><Icon icon={Phone} size="lg" /></Button>
              <Button variant="icon" size="lg" aria-label={nav.call}><Icon icon={Phone} size="xl" /></Button>
              <Button asChild variant="line"><a href={site.mapsUrl}>{actions.directions}<Icon icon={ArrowRight} size="sm" /></a></Button>
              <Button disabled>{L.disabled}</Button>
            </div>
          </div>
        </Block>

        <Block title={L.chips}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="signal">{L.newBadge}</Badge>
            {devices.map((d) => <Chip key={d.brand}>{d.brand}</Chip>)}
            <Chip icon={Smartphone}>{devices[0].models[0]}</Chip>
            <Badge variant="line">{site.payments}</Badge>
          </div>
        </Block>

        <Block title={L.cards}>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.slice(0, 2).map((s) => (
              <Card key={s.slug}>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.short}</CardDescription>
                <PriceLine priceFrom={s.priceFrom} />
                <CardFooter><Button variant="line">{actions.bookRepair}</Button></CardFooter>
              </Card>
            ))}
          </div>
        </Block>

        <Block title={L.form}>
          <div className="grid max-w-md gap-6">
            <div className="grid gap-2">
              <Label htmlFor="ks-problem">{estimate.label}</Label>
              <Input id="ks-problem" placeholder={estimate.placeholder} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ks-bad">{site.phone.display}</Label>
              <Input id="ks-bad" aria-invalid defaultValue={site.phone.dial} />
            </div>
            <RadioGroup defaultValue={faults[0]} aria-label={estimate.label}>
              {faults.slice(0, 6).map((f) => <RadioGroupItem key={f} value={f}>{f}</RadioGroupItem>)}
            </RadioGroup>
            <Command>
              <CommandInput placeholder={ui.search} />
              <CommandList className="mt-2 rounded-lg border border-hairline bg-card">
                <CommandEmpty>{ui.noResults}</CommandEmpty>
                {devices.map((d) => (
                  <CommandGroup key={d.brand} heading={d.brand}>
                    {d.models.map((m) => <CommandItem key={m} value={m}><Icon icon={Smartphone} size="sm" />{m}</CommandItem>)}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </div>
        </Block>

        <Block title={L.overlays}>
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild><Button variant="line">{L.openDialog}</Button></DialogTrigger>
              <DialogContent>
                <DialogTitle>{services[0].title}</DialogTitle>
                <DialogDescription>{services[0].long}</DialogDescription>
                <Button arrow>{actions.bookRepair}</Button>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger asChild><Button variant="line">{L.openSheet}</Button></SheetTrigger>
              <SheetContent>
                <SheetTitle>{actions.book}</SheetTitle>
                <SheetDescription>{site.hours.oneLine}</SheetDescription>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild><Button variant="line">{L.openBottom}</Button></SheetTrigger>
              <SheetContent side="bottom">
                <SheetTitle>{nav.menu}</SheetTitle>
                <SheetDescription>{site.address.lines.join(", ")}</SheetDescription>
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="line">{L.openMenu}</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                {services.map((s) => <DropdownMenuItem key={s.slug}>{s.title}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="line">{L.tooltip}</Button></TooltipTrigger>
              <TooltipContent>{site.hours.fridayBreak}</TooltipContent>
            </Tooltip>
            <ToastDemo />
          </div>
        </Block>

        <Block title={L.faq}>
          <Accordion>
            {faq.slice(0, 3).map((f) => (
              <AccordionItem key={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Block>

        <Block title={L.icons}>
          <div className="flex flex-wrap items-center gap-5 text-ink">
            {[Phone, MapPin, Clock, Wrench, ShieldCheck, Smartphone].map((I, i) => <Icon key={i} icon={I} size="lg" />)}
            <span className="text-star"><Icon icon={Star} size="lg" /></span>
            <WhatsAppIcon size="lg" />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-signal">
            {Object.entries(repairIcons).map(([slug, I]) => <Icon key={slug} icon={I} size="repair" />)}
          </div>
        </Block>
      </Container>
      <Toaster />
    </Section>
    </TooltipProvider>
  )
}
