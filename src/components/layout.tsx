import * as React from "react"

import { cn } from "@/lib/utils"

/** 1120px content column, 16px gutters on phones, 24px from tablet up. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-content px-4 md:px-6", className)} {...props} />
}

const tones = {
  paper: "bg-paper text-body",
  panel: "bg-panel text-body",
  band: "bg-band text-on-band-soft [&_h2]:text-on-band [&_h3]:text-on-band",
} as const

/** One idea per band. 56px rhythm on phones, 88px on desktop. */
export function Section({
  tone = "paper",
  className,
  ...props
}: React.ComponentProps<"section"> & { tone?: keyof typeof tones }) {
  return <section className={cn("py-section", tones[tone], className)} {...props} />
}
