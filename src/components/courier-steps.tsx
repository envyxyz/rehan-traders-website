import Link from "next/link"

import { Icon, WhatsAppIcon } from "@/components/icon"
import { Phone } from "@/components/icons"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { site, visitPage } from "@/content"

/** One numbered step as a card: the red number, the title, the text. The courier steps and the home "How a repair works". */
export function StepCard({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <Card className="h-full p-6">
      <span aria-hidden className="block font-display text-display-md text-signal tabular-nums">
        {String(n).padStart(2, "0")}
      </span>
      <h3 className="mt-3 font-display text-title-md text-ink">{title}</h3>
      <Text tone="body" className="mt-1.5">
        {text}
      </Text>
    </Card>
  )
}

/** The four courier steps, the delivery line and the three ways to start. Used by /visit#courier and /courier. */
export function CourierSteps({ from }: { from: string }) {
  return (
    <>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visitPage.courierSteps.map((step, i) => (
          <li key={step.title}>
            <StepCard n={i + 1} title={step.title} text={step.text} />
          </li>
        ))}
      </ol>

      <Text tone="muted" size="body-sm" className="mt-5 max-w-2xl">
        {visitPage.courierDelivery}
      </Text>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg" arrow>
          <Link href={`/quote?q=${encodeURIComponent(visitPage.courierActions.ticketText)}`}>{visitPage.courierActions.ticket}</Link>
        </Button>
        <Button asChild size="lg" variant="whatsapp">
          <a href={site.whatsapp.withText(visitPage.courierActions.whatsappText)} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-from={from}>
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
