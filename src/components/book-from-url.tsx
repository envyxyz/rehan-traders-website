"use client"

import { useSearchParams } from "next/navigation"

import { BookingFlow } from "@/components/booking-flow"
import { Text } from "@/components/typography"
import { services } from "@/content"

/** /book?service=SLUG: the only booking data that ever appears in a URL. Unknown slugs are ignored. */
export function BookFromUrl() {
  const slug = useSearchParams().get("service")
  const svc = services.find((s) => s.slug === slug)
  return (
    <>
      {svc && (
        <Text tone="ink" className="-mt-1 mb-4 font-display font-bold">
          {svc.title}
        </Text>
      )}
      <BookingFlow key={svc?.slug} service={svc?.slug} />
    </>
  )
}
