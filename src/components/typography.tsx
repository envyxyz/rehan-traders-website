import * as React from "react"
import Link from "next/link"

import type { InlineLink } from "@/content"
import { cn } from "@/lib/utils"

const headingSizes = {
  "display-hero": "text-display-hero",
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
  /** Centre the heading and its rule. */
  centered?: boolean
}

/** Display face, tight, balanced. No kicker above it, ever. */
export function Heading({ as: Tag = "h2", size = "display-lg", rule, centered, className, children, ...props }: HeadingProps) {
  return (
    <Tag className={cn("font-display text-balance text-ink", headingSizes[size], centered && "text-center", className)} {...props}>
      {rule && <span aria-hidden className={cn("mb-5 block h-1 w-11 bg-signal", centered && "mx-auto")} />}
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

/** Body running text. Callers cap the measure (max-w-prose) where text runs long. */
export function Text({ as: Tag = "p", size = "body-md", tone = "body", className, ...props }: TextProps) {
  return <Tag className={cn("text-pretty", textSizes[size], textTones[tone], className)} {...props} />
}

/** Copy with one phrase of it linked (set in content.ts). The text itself stays plain, so schema, llms.txt and the assistant read it as is. A phrase that is not in the text fails the build. */
export function Linked({ link, children }: { link?: InlineLink; children: string }) {
  if (!link) return children
  const at = children.indexOf(link.phrase)
  if (at < 0) throw new Error(`Linked: "${link.phrase}" is not in "${children}"`)
  return (
    <>
      {children.slice(0, at)}
      <Link href={link.href} className="text-ink underline underline-offset-4">
        {link.phrase}
      </Link>
      {children.slice(at + link.phrase.length)}
    </>
  )
}
