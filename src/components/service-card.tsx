import Link from "next/link"

import { BookButton } from "@/components/book-button"
import { Icon } from "@/components/icon"
import { ArrowRight, repairIcons } from "@/components/icons"
import { PriceLine } from "@/components/price-line"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { actions, type Service } from "@/content"

/**
 * One card everywhere: the repair's icon on a panel, then the name, one line of what it covers, and Book. The whole card
 * opens the repair. Phones put the panel at the side, so a card is a short row; from sm it sits on top.
 */
export function ServiceCard({ service, as }: { service: Service; as?: "h2" | "h3" }) {
  return (
    <Card className="relative flex h-full flex-row gap-0 overflow-hidden p-0 transition-colors hover:border-ink sm:flex-col">
      <div aria-hidden className="grid w-24 shrink-0 place-items-center bg-panel sm:w-auto sm:py-9">
        <Icon icon={repairIcons[service.slug]} size="repair" className="text-signal" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:p-5">
        {/* This link's ::after stretches over the whole card; Book sits above it. */}
        <Link href={`/repairs/${service.slug}`} className="-my-3 flex min-h-11 items-center no-underline after:absolute after:inset-0">
          <CardTitle as={as} className="text-body-md font-bold hover:text-ink">
            {service.title}
          </CardTitle>
        </Link>
        <CardDescription className="line-clamp-2 text-body-sm">{service.short}</CardDescription>
        <PriceLine priceFrom={service.priceFrom} className="text-body-sm font-semibold" />
        <div className="mt-auto flex justify-end pt-1">
          <BookButton service={service.slug} variant="text" className="relative z-10 text-body-sm font-bold">
            {actions.bookRepair}
            <Icon icon={ArrowRight} size="sm" />
          </BookButton>
        </div>
      </div>
    </Card>
  )
}
