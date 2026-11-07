"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("flex flex-wrap gap-2", className)} {...props} />
}

/**
 * Choices are pills, not dots. 44px target. Checked: data-state="checked" (radio) or aria-pressed (toggle). A label too long for
 * a narrow phone wraps inside its pill rather than running out of it.
 */
const pill =
  "inline-flex min-h-11 max-w-full cursor-pointer items-center rounded-pill py-2 text-balance border border-hairline bg-card px-4.5 font-display text-nav text-ink transition duration-(--duration-press) active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-action data-[state=checked]:bg-action data-[state=checked]:text-on-action aria-pressed:border-action aria-pressed:bg-action aria-pressed:text-on-action"

/** Time choices: one of many. */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return <RadioGroupPrimitive.Item data-slot="radio-group-item" className={cn(pill, className)} {...props} />
}

/** Fault choices: any number, as toggle buttons in the same pill. */
function TogglePill({ pressed, className, ...props }: React.ComponentProps<"button"> & { pressed: boolean }) {
  return <button type="button" aria-pressed={pressed} className={cn(pill, className)} {...props} />
}

export { RadioGroup, RadioGroupItem, TogglePill }
