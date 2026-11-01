import Link from "next/link"

import { Icon } from "@/components/icon"
import { ArrowUpRight } from "@/components/icons"
import { Container } from "@/components/layout"
import { Mark } from "@/components/logo"
import { Reveal } from "@/components/motion"
import { footer, nav, services, site, actions, ui } from "@/content"
import { cn } from "@/lib/utils"

const groupTitle = "font-display text-title-md text-on-band"
const linkClass = "inline-flex min-h-11 min-w-11 items-center text-on-band-soft no-underline hover:text-on-band"

function Group({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h2 className={groupTitle}>{title}</h2>
      <ul className="mt-3">{children}</ul>
    </div>
  )
}

/** Ink footer: entity line, the four link groups, then registered name and copyright. */
export function Footer() {
  return (
    <footer className="bg-band pt-section pb-28 text-body-sm text-on-band-soft md:pb-10">
      <Container>
        <Reveal className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-3">
            <Link href="/" aria-label={nav.home} className="-my-1.5 inline-flex min-h-11 items-center gap-2.5 font-display text-title-lg font-extrabold text-on-band no-underline">
              <Mark className="size-8" />
              {site.name}
            </Link>
            <p className="mt-4 max-w-xs text-pretty">{site.entity}</p>
            <a href={site.phone.href} className="mt-4 -mb-2 flex min-h-11 w-fit items-center font-display text-display-md text-on-band no-underline" data-track="call" data-track-from="footer">
              {site.phone.display}
            </a>
          </div>
          <Group title={footer.groups.repairs} className="lg:col-span-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/repairs/${s.slug}`} className={linkClass}>
                  {s.title}
                </Link>
              </li>
            ))}
          </Group>
          <Group title={footer.groups.shop} className="lg:col-span-2">
            {footer.shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Group>
          <div className="lg:col-span-3">
            <h2 className={groupTitle}>{footer.groups.visit}</h2>
            <address className="mt-3 space-y-3 not-italic">
              {[site.address.lines, site.hours.lines].map((lines) => (
                <p key={lines[0]}>
                  {/* The space keeps the lines apart as text: Google's snippet read "Saturday11:00 AM" without it. */}
                  {lines.map((line) => (
                    <span key={line} className="block">
                      {line}{" "}
                    </span>
                  ))}
                </p>
              ))}
              <p className="flex flex-col">
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={actions.whatsappLabel} className={cn(linkClass, "underline underline-offset-4")} data-track="whatsapp" data-track-from="footer">
                  {actions.whatsapp}
                </a>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={cn(linkClass, "gap-1 underline underline-offset-4")} data-track="directions" data-track-from="footer">
                  {footer.directions}
                  <span className="sr-only">, {ui.externalLink}</span>
                  <Icon icon={ArrowUpRight} size="sm" />
                </a>
              </p>
            </address>
          </div>
          <Group title={footer.groups.legal} className="lg:col-span-1">
            {footer.legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Group>
        </Reveal>
        <div className="mt-14 flex flex-wrap justify-between gap-2 pt-6 text-caption">
          <span>{footer.copyright(new Date().getFullYear())}</span>
          {footer.registered && <span>{footer.registered}</span>}
        </div>
      </Container>
    </footer>
  )
}
