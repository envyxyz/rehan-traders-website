import { Phone } from "lucide-react"
import Link from "next/link"

import { Icon, WhatsAppIcon } from "@/components/icon"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { site, visitPage } from "@/content"

/** The four courier steps, the delivery line and the three ways to start. Used by /visit#courier and /courier. */
export function CourierSteps({ from }: { from: string }) {
  return (
    <>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visitPage.courierSteps.map((step, i) => (
          <li key={step.title}>
            <Card className="h-full p-6">
              <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-title-md text-ink">{step.title}</h3>
              <Text tone="body" size="body-sm" className="mt-1.5">
                {step.text}
              </Text>
            </Card>
          </li>
        ))}
      </ol>

      <Text tone="muted" size="body-sm" className="mt-5 max-w-2xl">
        {visitPage.courierDelivery}
      </Text>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg" arrow>
          <Link href="/estimate?tab=describe">{visitPage.courierActions.ticket}</Link>
        </Button>
        <Button asChild size="lg" variant="whatsapp">
          <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-from={from}>
            <WhatsAppIcon />
            {visitPage.courierActions.whatsapp}
          </a>
        </Button>
        <Button asChild size="lg" variant="line">
          <a href={site.phone.href} data-track="call" data-track-from={from}>
            <Icon icon={Phone} />
            {visitPage.courierActions.call}
          </a>
        </Button>
      </div>
    </>
  )
}
