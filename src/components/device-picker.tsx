"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { Icon } from "@/components/icon"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { booking } from "@/content"
import { brandOf, brands, deviceName, isTablet, match, modelsOf, tabletBrands } from "@/lib/devices"

const copy = booking.device
const LIMIT = 60
const typed = (q: string) => q.trim().slice(0, LIMIT)

/** A dropdown you can type in: the list floats over the page, opens on focus, narrows as you type, and offers what you typed if it is not listed. */
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
  const show = open && !disabled
  // cmdk marks the input expanded and controlling its list even while the list is not mounted (axe: aria-valid-attr-value).
  const listId = React.useRef<string | null>(null)
  React.useEffect(() => {
    const el = input.current
    if (!el) return
    listId.current ??= el.getAttribute("aria-controls")
    el.setAttribute("aria-expanded", String(show))
    if (show && listId.current) el.setAttribute("aria-controls", listId.current)
    else el.removeAttribute("aria-controls")
  }, [show])
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
      <Command label={label} shouldFilter={false}>
        <Popover open={show} onOpenChange={setOpen}>
          <PopoverAnchor>
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
            />
          </PopoverAnchor>
          {/* Focus stays in the input: nothing moves focus in or out, and a press on an option must not blur it first. */}
          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
          >
            <CommandList>
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
          </PopoverContent>
        </Popover>
      </Command>
    </div>
  )
}

/** Brand, then model; both typeable. `lockedBrand` (the iPhone repair: Apple) fixes the first. Reports "" until a model is picked. */
export function DevicePicker({
  value,
  onChange,
  lockedBrand,
  tabletsOnly,
}: {
  value: string | null
  onChange: (device: string | null) => void
  lockedBrand?: string
  /** The tablet repair: only brands that make tablets, and only their tablets. */
  tabletsOnly?: boolean
}) {
  const [brand, setBrand] = React.useState(lockedBrand ?? (value ? (brandOf(value) ?? "") : ""))
  const options = React.useMemo(() => modelsOf(brand).filter((m) => !tabletsOnly || isTablet(m)), [brand, tabletsOnly])

  return (
    <div className="flex flex-col gap-4">
      <Combo
        label={copy.brand}
        placeholder={copy.brandSearch}
        options={tabletsOnly ? tabletBrands : brands}
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
