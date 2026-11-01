"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { booking } from "@/content-large"

const copy = booking.device
const LIMIT = 60

/**
 * The device, in the customer's own words ("Samsung Galaxy Z Fold8 Ultra"). No catalogue to keep up to date: a phone
 * released tomorrow works the day it is typed. `repairFor()` reads the name to pick the service, and the shop sees
 * exactly what was typed. Reports null until something is typed.
 */
export function DeviceField({
  value,
  onChange,
  invalid,
  describedBy,
}: {
  value: string | null
  onChange: (device: string | null) => void
  /** The form's error is about the device: marks the field invalid and points at the message. */
  invalid?: boolean
  describedBy?: string
}) {
  const id = React.useId()
  // The raw text keeps its spaces while typing; only the trimmed text goes up. A device set from outside replaces it.
  const [text, setText] = React.useState(value ?? "")
  const [seen, setSeen] = React.useState(value)
  if (seen !== value) {
    setSeen(value)
    if ((value ?? "") !== text.trim()) setText(value ?? "")
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{copy.label}</Label>
      <Input
        id={id}
        value={text}
        maxLength={LIMIT}
        placeholder={copy.placeholder}
        autoComplete="off"
        autoCapitalize="words"
        enterKeyHint="next"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(e) => {
          setText(e.target.value)
          onChange(e.target.value.trim() || null)
        }}
      />
    </div>
  )
}
