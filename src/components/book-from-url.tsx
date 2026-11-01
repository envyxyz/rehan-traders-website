"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { BookingFlow } from "@/components/booking-flow"
import { Text } from "@/components/typography"
import { services } from "@/content-large"

/** Only this reads the URL: a Suspense boundary around the flow itself would replace it on load and wipe what was typed. */
function ReadService({ onRead }: { onRead: (slug: string | null) => void }) {
  const slug = useSearchParams().get("service")
  React.useEffect(() => onRead(slug), [slug, onRead])
  return null
}

/** /book?service=SLUG: the only booking data that ever appears in a URL. Unknown slugs are ignored. */
export function BookFromUrl() {
  const [slug, setSlug] = React.useState<string | null>(null)
  const svc = services.find((s) => s.slug === slug)
  return (
    <>
      <React.Suspense>
        <ReadService onRead={setSlug} />
      </React.Suspense>
      {svc && (
        <Text tone="ink" className="-mt-1 mb-4 font-display font-bold">
          {svc.title}
        </Text>
      )}
      <BookingFlow service={svc?.slug} />
    </>
  )
}
