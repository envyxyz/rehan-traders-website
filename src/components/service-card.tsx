import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { Icon } from "@/components/icon"
import { Img } from "@/components/img"
import { PriceLine } from "@/components/price-line"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { actions, repairsPage, type Service } from "@/content"
import { cn } from "@/lib/utils"

// Rendered widths in the home grid (Container gutters 16/24/40px, 16px gaps): leads take half a row from lg, the rest a third.
const sizesLead = "(min-width: 1440px) 672px, (min-width: 1024px) calc(50vw - 3rem), (min-width: 768px) calc(50vw - 2rem), calc(100vw - 2rem)"
const sizesRest = "(min-width: 1440px) 443px, (min-width: 1024px) calc(33.33vw - 2.33rem), (min-width: 768px) calc(50vw - 2rem), calc(100vw - 2rem)"

export function ServiceCard({ service, lead }: { service: Service; lead?: boolean }) {
  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden p-0">
      {/* The title links the same page; this one is for the eye and the thumb, so it stays out of the tab order and the accessibility tree. */}
      <Link href={`/repairs/${service.slug}`} aria-hidden tabIndex={-1} className="block overflow-hidden">
        <Img
          name={service.image}
          alt={service.alt}
          sizes={lead ? sizesLead : sizesRest}
          className={cn("w-full transition-transform duration-(--duration-base) ease-out hover:scale-102", lead ? "aspect-16/10" : "aspect-4/3")}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Link href={`/repairs/${service.slug}`} className="no-underline">
          <CardTitle className={cn(lead && "text-title-lg", "hover:text-ink")}>{service.title}</CardTitle>
        </Link>
        <CardDescription className="mb-1 line-clamp-2">{service.short}</CardDescription>
        <PriceLine priceFrom={service.priceFrom} className="text-body-sm font-semibold" />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <BookButton service={service.slug} variant="line">
            {actions.bookRepair}
          </BookButton>
          <Link
            href={`/repairs/${service.slug}`}
            aria-label={repairsPage.viewDetailsOf(service.title)}
            className="inline-flex min-h-11 items-center gap-1 font-display text-caption font-bold text-steel hover:text-ink"
          >
            <span>{repairsPage.viewDetails}</span>
            <Icon icon={ArrowRight} size="sm" />
          </Link>
        </div>
      </div>
    </Card>
  )
}
