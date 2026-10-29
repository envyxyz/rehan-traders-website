"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { Icon } from "@/components/icon"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { booking } from "@/content"
import { brandOf, brands, deviceName, match, modelsOf } from "@/lib/devices"

const copy = booking.device
const LIMIT = 60
const typed = (q: string) => q.trim().slice(0, LIMIT)

/** A dropdown you can type in: the list opens on focus, narrows as you type, and offers what you typed if it is not listed. */
function Combo({
  label,
  placeholder,
  options,
  value,
  onPick,
  disabled,
}: {
  label: string
  placeholder: string
  options: readonly string[]
  value: string
  onPick: (v: string) => void
  disabled?: boolean
}) {
  const [query, setQuery] = React.useState(value)
  const [open, setOpen] = React.useState(false)
  const input = React.useRef<HTMLInputElement>(null)
  // A new value from outside (picked, or cleared by a brand change) replaces what is typed.
  const [seen, setSeen] = React.useState(value)
  if (seen !== value) {
    setSeen(value)
    setQuery(value)
  }
  // Opened on a picked value: show the whole list, not just that one.
  const shown = match(options, query === value ? "" : query).slice(0, LIMIT)
  const own = typed(query)
  const pick = (v: string) => {
    onPick(v)
    setQuery(v)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* cmdk sets the input's id and names it with its own hidden label (Command label), so this one is for sight and clicks. */}
      <Label aria-hidden onClick={() => input.current?.focus()}>
        {label}
      </Label>
      <Command label={label} shouldFilter={false} className="bg-paper">
        <CommandInput
          ref={input}
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false)
            setQuery(value)
          }}
          onValueChange={(v) => {
            setQuery(v)
            setOpen(true)
          }}
          onKeyDown={(e) => e.key === "Escape" && open && (e.stopPropagation(), setOpen(false))}
        />
        {open && !disabled && (
          // Keep focus in the input while an option is clicked, so blur does not close the list first.
          <CommandList onMouseDown={(e) => e.preventDefault()}>
            {shown.length > 0 && (
              <CommandGroup>
                {shown.map((o) => (
                  <CommandItem key={o} value={`pick:${o}`} onSelect={() => pick(o)} aria-checked={o === value}>
                    <span className="flex-1">{o}</span>
                    {o === value && <Icon icon={Check} />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {own && !options.some((o) => o.toLowerCase() === own.toLowerCase()) && (
              <CommandGroup heading={copy.notListed}>
                <CommandItem value={`typed:${own}`} onSelect={() => pick(own)}>
                  {copy.useTyped(own)}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  )
}

/** Brand, then model; both typeable. `lockedBrand` (the iPhone repair: Apple) fixes the first. Reports "" until a model is picked. */
export function DevicePicker({
  value,
  onChange,
  lockedBrand,
}: {
  value: string | null
  onChange: (device: string | null) => void
  lockedBrand?: string
}) {
  const [brand, setBrand] = React.useState(lockedBrand ?? (value ? (brandOf(value) ?? "") : ""))
  const options = React.useMemo(() => modelsOf(brand), [brand])

  return (
    <div className="flex flex-col gap-4">
      <Combo
        label={copy.brand}
        placeholder={copy.brandSearch}
        options={brands}
        value={brand}
        disabled={!!lockedBrand}
        onPick={(b) => {
          if (b === brand) return
          setBrand(b)
          onChange(null)
        }}
      />
      <Combo
        label={copy.model}
        placeholder={brand ? copy.modelSearch : copy.brandFirst}
        options={options}
        value={value ?? ""}
        disabled={!brand}
        // A typed model gets its brand in front ("Nokia 3310"), the way listed ones read.
        onPick={(m) => onChange(options.includes(m) ? m : deviceName(brand, m))}
      />
    </div>
  )
}
