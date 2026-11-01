import { BookButton } from "@/components/book-button"
import { AskAiButton } from "@/components/chat-launcher"
import { Fold3D } from "@/components/fold-3d"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { MapPin } from "@/components/icons"
import { OpenStatus } from "@/components/open-status"
import { Stars } from "@/components/stars"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { actions, hero, site } from "@/content"
import { reviews } from "@/content-large"
import { heroStagger } from "@/lib/tokens"

// Copy rises in with a stagger; the h1 never animates (it is the LCP element).
const rise = (step: number) => ({
  className: "animate-rise motion-reduce:animate-none",
  style: { animationDelay: `${step * heroStagger}s` },
})

/** 100svh inset panel: copy left, 3D fold right. On a phone the copy comes first and the fold follows it. */
export function Hero() {
  const proof = hero.proof(reviews.rating)
  return (
    <section id="top" className="flex min-h-svh p-2 sm:p-3">
      {/* The panel always fills the window (the fixed nav sits inside it at any width); only the content is capped. */}
      <div className="flex flex-1 overflow-hidden rounded-xl bg-panel">
        <div className="mx-auto grid w-full max-w-panel grid-cols-1 content-start gap-8 px-5 pt-20 pb-6 sm:px-6 sm:pt-28 sm:pb-8 lg:grid-cols-2 lg:content-center lg:items-center lg:px-12 lg:pb-12 xl:px-20">
          <div className="min-w-0">
            <span aria-hidden className="mb-4 block h-1 w-11 bg-signal" />
            <p className={`font-display text-body-sm font-bold whitespace-nowrap text-ink ${rise(0).className}`} style={rise(0).style}>
              {hero.track}
            </p>
            <Heading as="h1" size="display-hero" className="mt-4">
              {hero.title}
            </Heading>
            <Text tone="muted" className={`mt-4 max-w-120 ${rise(0).className}`} style={rise(0).style}>
              <span className="max-sm:hidden">{hero.ledeLead}</span>
              {hero.lede}
            </Text>
            <div className={`mt-hero-gap grid justify-start gap-1.5 text-caption ${rise(1).className}`} style={rise(1).style}>
              <p className="text-ink">
                {proof.before}{" "}
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink/80 transition-colors duration-fast hover:text-ink" data-track="directions" data-track-from="hero">
                  {proof.link}
                </a>
              </p>
              <Stars rating={reviews.rating} small />
            </div>
            <div className={`mt-hero-gap grid gap-3 sm:max-w-md ${rise(2).className}`} style={rise(2).style}>
              <BookButton size="lg" arrow wide className="btn-wide-full sm:w-full sm:justify-between sm:pl-2">
                {actions.start}
              </BookButton>
              <div className="flex gap-3">
                <AskAiButton className="flex-1" />
                <Button asChild size="lg" variant="whatsapp" className="size-13 px-0">
                  <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={actions.whatsappLabel} data-track="whatsapp" data-track-from="hero">
                    <WhatsAppIcon />
                  </a>
                </Button>
              </div>
            </div>
            <div className={`mt-hero-gap grid gap-2 text-caption text-steel sm:flex sm:flex-wrap sm:gap-x-5 ${rise(3).className}`} style={rise(3).style}>
              <span className="inline-flex items-center gap-1.5">
                <Icon icon={MapPin} size="sm" />
                {site.address.short}
              </span>
              <OpenStatus />
            </div>
          </div>
          <Fold3D />
        </div>
      </div>
    </section>
  )
}
