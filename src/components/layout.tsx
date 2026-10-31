import * as React from "react"

import { cn } from "@/lib/utils"

/** 1440px content column, 16px gutters on phones, 24px on tablets, 40px from desktop up. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-content px-4 md:px-6 lg:px-10", className)} {...props} />
}

const tones = {
  paper: "bg-paper text-body",
  panel: "bg-panel text-body",
  band: "bg-band text-on-band-soft [&_h2]:text-on-band [&_h3]:text-on-band",
} as const

/** One idea per band. 56px rhythm on phones, 88px on desktop. */
export function Section({
  tone = "paper",
  first,
  className,
  ...props
}: React.ComponentProps<"section"> & {
  tone?: keyof typeof tones
  /** A page's opening section: clears the fixed nav and fills the screen, so nothing below it shows before a scroll. */
  first?: boolean
}) {
  return <section className={cn("py-section", first && "min-h-svh pt-20 lg:pt-28", tones[tone], className)} {...props} />
}
