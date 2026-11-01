import Link from "next/link"

import { Icon } from "@/components/icon"
import { ArrowRight, repairIcons } from "@/components/icons"
import { PriceLine } from "@/components/price-line"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import type { Service } from "@/content-large"

/**
 * One card everywhere: the repair's icon on a panel, then the name and one line of what it covers. The whole card is one
 * link to the repair, whose page answers the customer's questions and holds the action; eight Book buttons in a row only
 * diluted it. Phones put the panel at the side, so a card is a short row; from sm it sits on top.
 */
export function ServiceCard({ service, as }: { service: Service; as?: "h2" | "h3" }) {
  return (
    <Card className="relative flex h-full flex-row gap-0 overflow-hidden p-0 transition-colors hover:border-ink sm:flex-col">
      <div aria-hidden className="grid w-24 shrink-0 place-items-center bg-panel sm:w-auto sm:py-9">
        <Icon icon={repairIcons[service.slug]} size="repair" className="text-signal" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:p-5">
        {/* This link's ::after stretches over the whole card. */}
        <Link href={`/repairs/${service.slug}`} className="-my-3 flex min-h-11 items-center justify-between gap-2 no-underline after:absolute after:inset-0">
          <CardTitle as={as} className="text-body-md font-bold hover:text-ink">
            {service.title}
          </CardTitle>
          <Icon icon={ArrowRight} size="sm" className="shrink-0 text-ink" />
        </Link>
        <CardDescription className="line-clamp-2 text-body-sm">{service.short}</CardDescription>
        <PriceLine priceFrom={service.priceFrom} className="text-body-sm font-semibold" />
      </div>
    </Card>
  )
}
