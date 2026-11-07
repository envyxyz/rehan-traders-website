"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const RadioContext = React.createContext<{ value: string; select: (value: string) => void }>({ value: "", select: () => {} })
const ARROWS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

/**
 * One choice of many, as a WAI-ARIA radio group of buttons. Not Radix's RadioGroup: that renders an aria-hidden native input
 * beside every item (for form posts these forms never make), which scanners count as unnamed, focusable fields. Arrow keys move
 * and pick, as in a native group. The checked item is the tab stop; while none is checked, every item is.
 */
function RadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  onKeyDown,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "value"> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void }) {
  const [own, setOwn] = React.useState(defaultValue)
  const current = value ?? own
  const select = (next: string) => {
    if (next === current) return
    setOwn(next)
    onValueChange?.(next)
  }
  return (
    <RadioContext value={{ value: current, select }}>
      <div
        role="radiogroup"
        data-slot="radio-group"
        className={cn("flex flex-wrap gap-2", className)}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          const step = ARROWS[e.key]
          if (!step) return
          const items = [...e.currentTarget.querySelectorAll<HTMLElement>("[role=radio]:not(:disabled)")]
          const next = items[(items.indexOf(e.target as HTMLElement) + step + items.length) % items.length]
          e.preventDefault()
          next?.focus()
          next?.click()
        }}
        {...props}
      />
    </RadioContext>
  )
}

/**
 * Choices are pills, not dots. 44px target. Checked: data-state="checked" (radio) or aria-pressed (toggle). A label too long for
 * a narrow phone wraps inside its pill rather than running out of it.
 */
const pill =
  "inline-flex min-h-11 max-w-full cursor-pointer items-center rounded-pill py-2 text-balance border border-hairline bg-card px-4.5 font-display text-nav text-ink transition duration-(--duration-press) active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-action data-[state=checked]:bg-action data-[state=checked]:text-on-action aria-pressed:border-action aria-pressed:bg-action aria-pressed:text-on-action"

/** Time choices: one of many. Named by its own text unless the caller passes an aria-label (a scanner skips a button's content). */
function RadioGroupItem({ value, className, ...props }: React.ComponentProps<"button"> & { value: string }) {
  const group = React.useContext(RadioContext)
  const id = React.useId()
  const checked = group.value === value
  return (
    <button
      type="button"
      role="radio"
      id={id}
      aria-labelledby={props["aria-label"] ? undefined : id}
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      data-slot="radio-group-item"
      tabIndex={checked || !group.value ? 0 : -1}
      onClick={() => group.select(value)}
      className={cn(pill, className)}
      {...props}
    />
  )
}

/** Fault choices: any number, as toggle buttons in the same pill. */
function TogglePill({ pressed, className, ...props }: React.ComponentProps<"button"> & { pressed: boolean }) {
  return <button type="button" aria-pressed={pressed} className={cn(pill, className)} {...props} />
}

export { RadioGroup, RadioGroupItem, TogglePill }
