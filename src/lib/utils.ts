import { createCn } from "cn/engine"

import tables from "@/lib/cn-tables"

// Class merging with tables compiled at build time (withCn in next.config.ts) from our sources and the @theme tokens
// in globals.css, so `text-display-lg` (size) and `text-ink` (colour) never cancel each other and `rounded-md` passed
// in replaces a primitive's `rounded-pill`. The browser gets the small engine, not the runtime compiler.
export const cn = createCn(tables)

/** Form onKeyDown: the keyboard's "next" key moves to the next field; on the last field Enter submits as usual. */
export function nextField(e: React.KeyboardEvent<HTMLFormElement>) {
  const field = e.target
  if (e.key !== "Enter" || !(field instanceof HTMLInputElement) || field.enterKeyHint !== "next") return
  const fields = [...e.currentTarget.querySelectorAll<HTMLElement>("input:not([tabindex='-1']):not([type=file]), textarea")]
  const after = fields[fields.indexOf(field) + 1]
  if (!after) return
  e.preventDefault()
  after.focus()
}
