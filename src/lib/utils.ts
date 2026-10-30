import { createCn } from "cn/engine"

import tables from "@/lib/cn-tables"

// Class merging with tables compiled at build time (withCn in next.config.ts) from our sources and the @theme tokens
// in globals.css, so `text-display-lg` (size) and `text-ink` (colour) never cancel each other and `rounded-md` passed
// in replaces a primitive's `rounded-pill`. The browser gets the small engine, not the runtime compiler.
export const cn = createCn(tables)
