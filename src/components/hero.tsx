import { Star } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { Fold3D } from "@/components/fold-3d"
import { WhatsAppIcon } from "@/components/icon"
import { OpenStatus } from "@/components/open-status"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { actions, hero, reviews, site, ui } from "@/content"
import { heroStagger } from "@/lib/tokens"

// Copy rises in with a stagger; the h1 never animates (it is the LCP element).
const rise = (step: number) => ({
  className: "animate-rise motion-reduce:animate-none",
  style: { animationDelay: `${step * heroStagger}s` },
})

/** 100svh inset panel: copy left, CSS fold right. */
export function Hero() {
  const proof = hero.proof(reviews.rating, reviews.count)
  return (
    <section id="top" className="flex min-h-svh p-2 sm:p-3">
      <div className="mx-auto grid w-full max-w-panel flex-1 content-start overflow-hidden rounded-xl bg-panel px-5 pt-22 pb-2 sm:px-6 sm:pt-26 sm:pb-4 lg:grid-cols-2 lg:content-center lg:items-center lg:gap-8 lg:px-12 lg:pt-28 lg:pb-12 xl:px-20">
        <div className="min-w-0">
          <p {...rise(0)}>
            <span className="flex items-center gap-2 text-caption text-steel">
              <span className="flex gap-0.5 text-star" role="img" aria-label={ui.stars(reviews.rating)}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} aria-hidden className="size-3.25 fill-current" strokeWidth={0} />
                ))}
              </span>
              <span>
                <b className="font-display text-body-sm font-bold text-ink">{proof.rating}</b> {proof.rest}
              </span>
            </span>
          </p>
          <Heading as="h1" size="display-xl" rule className="mt-4.5">
            {hero.title}
          </Heading>
          <Text tone="muted" className={`mt-4 max-w-120 ${rise(1).className}`} style={rise(1).style}>
            {hero.lede}
          </Text>
          <div className={`mt-7 flex flex-wrap gap-2.5 ${rise(2).className}`} style={rise(2).style}>
            <BookButton size="lg" arrow className="flex-1 sm:flex-none">
              {actions.book}
            </BookButton>
            <Button asChild size="lg" variant="whatsapp" className="flex-1 sm:flex-none">
              <a href={site.whatsapp.href} aria-label={actions.whatsappLabel}>
                <WhatsAppIcon />
                {actions.whatsapp}
              </a>
            </Button>
          </div>
          <div
            className={`mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-caption text-steel ${rise(3).className}`}
            style={rise(3).style}
          >
            <a href={site.phone.href} className="font-display text-body-sm font-bold text-ink no-underline">
              {site.phone.display}
            </a>
            <span>{site.address.short}</span>
            <OpenStatus />
          </div>
        </div>
        <Fold3D />
      </div>
    </section>
  )
}
