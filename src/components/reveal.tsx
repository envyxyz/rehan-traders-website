import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Fade + 8px rise as the block enters the screen: CSS on the browser's scroll timeline (`.reveal` in globals.css), so it needs
 * no JavaScript and hydrates nothing. Browsers without scroll timelines, and reduced motion, simply show it. Never wrap the h1.
 */
export function Reveal({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("reveal", className)} {...props} />
}
