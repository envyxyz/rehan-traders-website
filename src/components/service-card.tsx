import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Icon } from "@/components/icon"
import { Img } from "@/components/img"
import { PriceLine } from "@/components/price-line"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { repairsPage, type Service } from "@/content"
import { cn } from "@/lib/utils"

// Rendered widths in the home grid (Container gutters 16/24/40px, 16px gaps): leads take half a row from lg, the rest a third.
const sizesLead = "(min-width: 1440px) 672px, (min-width: 1024px) calc(50vw - 3rem), (min-width: 768px) calc(50vw - 2rem), calc(100vw - 2rem)"
const sizesRest = "(min-width: 1440px) 443px, (min-width: 1024px) calc(33.33vw - 2.33rem), (min-width: 768px) calc(50vw - 2rem), calc(100vw - 2rem)"

export function ServiceCard({ service, lead, priority, as }: { service: Service; lead?: boolean; priority?: boolean; as?: "h2" | "h3" }) {
  return (
    <Card className="relative flex h-full flex-col gap-0 overflow-hidden p-0">
      {/* The title links the same page; this one is for the eye and the thumb, so it stays out of the tab order and the accessibility tree. */}
      <Link href={`/repairs/${service.slug}`} aria-hidden tabIndex={-1} className="block overflow-hidden">
        <Img
          name={service.image}
          alt={service.alt}
          priority={priority}
          sizes={lead ? sizesLead : sizesRest}
          className={cn("aspect-video w-full transition-transform duration-(--duration-base) ease-out hover:scale-102", lead ? "md:aspect-16/10" : "md:aspect-4/3")}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        {/* On phones this link's ::after stretches over the whole card, so any tap on it opens the repair. */}
        <Link href={`/repairs/${service.slug}`} className="-my-2.25 flex min-h-11 items-center no-underline after:absolute after:inset-0 md:after:hidden">
          <CardTitle as={as} className={cn(lead && "text-title-lg", "hover:text-ink")}>{service.title}</CardTitle>
        </Link>
        <CardDescription className="mb-1 line-clamp-2">{service.short}</CardDescription>
        <PriceLine priceFrom={service.priceFrom} className="text-body-sm font-semibold" />
        <div className="mt-auto flex justify-end pt-3 max-md:hidden">
          <Link
            href={`/repairs/${service.slug}`}
            aria-label={repairsPage.viewDetailsOf(service.title)}
            className="hidden min-h-11 items-center gap-1 font-display text-caption font-bold text-steel hover:text-ink md:inline-flex"
          >
            <span>{repairsPage.viewDetails}</span>
            <Icon icon={ArrowRight} size="sm" />
          </Link>
        </div>
      </div>
    </Card>
  )
}
