import * as React from "react"

import { cn } from "@/lib/utils"

const headingSizes = {
  "display-xl": "text-display-xl",
  "display-lg": "text-display-lg",
  "display-md": "text-display-md",
  "title-lg": "text-title-lg",
  "title-md": "text-title-md",
} as const

type HeadingProps = React.ComponentProps<"h2"> & {
  as?: "h1" | "h2" | "h3" | "h4"
  size?: keyof typeof headingSizes
  /** The 44px Signal Red rule above the heading. Counts as the view's one red element. */
  rule?: boolean
}

/** Archivo, tight, balanced. No kicker above it, ever. */
export function Heading({ as: Tag = "h2", size = "display-lg", rule, className, children, ...props }: HeadingProps) {
  return (
    <Tag className={cn("font-display text-balance text-ink", headingSizes[size], className)} {...props}>
      {rule && <span aria-hidden className="mb-5 block h-1 w-11 bg-signal" />}
      {children}
    </Tag>
  )
}

const textSizes = { "body-md": "text-body-md", "body-sm": "text-body-sm", caption: "text-caption" } as const
const textTones = { body: "text-body", muted: "text-steel", ink: "text-ink" } as const

type TextProps = React.ComponentProps<"p"> & {
  as?: "p" | "span" | "div"
  size?: keyof typeof textSizes
  tone?: keyof typeof textTones
}

/** Inter running text. Callers cap the measure (max-w-prose) where text runs long. */
export function Text({ as: Tag = "p", size = "body-md", tone = "body", className, ...props }: TextProps) {
  return <Tag className={cn("text-pretty", textSizes[size], textTones[tone], className)} {...props} />
}
