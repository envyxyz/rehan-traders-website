import * as React from "react"

import { cn } from "@/lib/utils"

const field =
  "w-full min-w-0 rounded-sm border border-hairline bg-paper px-4 text-body-md text-ink transition-colors duration-(--duration-fast) outline-none placeholder:text-steel focus-visible:border-ink focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ink/12 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-3 aria-invalid:ring-error/15"

/** 52px, paper fill, hairline border. Focus: card fill, ink border, soft ink ring. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} data-slot="input" className={cn(field, "h-13", className)} {...props} />
}

/** The Input's look over several lines. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(field, "min-h-24 resize-none py-3", className)} {...props} />
}

export { Input, Textarea }
