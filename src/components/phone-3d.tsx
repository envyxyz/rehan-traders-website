"use client"

import * as React from "react"

import type { Phone } from "@/components/phone-scene"
import { Button } from "@/components/ui/button"
import { phone3d } from "@/content"
import type { PhonePart } from "@/content-large"
import { busyStart, busyStop } from "@/lib/busy"

/**
 * A guide's 3D phone: taken apart in layers, with the guide's part lit. Nothing of it is in the page load: the button is all
 * that renders, and a tap loads three.js and opens the stage under it. Drag turns the phone; the second button puts it back
 * together. Without WebGL the button says so and nothing opens.
 */
export function Phone3D({ part }: { part: PhonePart }) {
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const phone = React.useRef<Phone | null>(null)
  const last = React.useRef<{ x: number; y: number } | null>(null)
  const toggle = React.useRef<HTMLButtonElement>(null)
  const [state, setState] = React.useState<"idle" | "loading" | "ready" | "none">("idle")
  const [open, setOpen] = React.useState(true)

  React.useEffect(() => {
    if (state !== "loading") return
    let alive = true
    busyStart()
    // No WebGL: three.js never loads (its renderer logs an error before it throws).
    const start = document.createElement("canvas").getContext("webgl2") ? import("@/components/phone-scene").then(({ createPhone }) => createPhone(canvas.current!, { part })) : Promise.reject()
    start
      .then((p) => {
        if (!alive) return p.dispose()
        phone.current = p
        setState("ready")
      })
      .catch(() => alive && setState("none"))
      .finally(busyStop)
    return () => {
      alive = false
    }
  }, [state, part])
  React.useEffect(() => () => phone.current?.dispose(), [])
  // The button that was pressed is gone once the stage opens: hand its focus to the button that replaced it.
  React.useEffect(() => {
    if (state === "ready" && (!document.activeElement || document.activeElement === document.body)) toggle.current?.focus()
  }, [state])

  if (state === "idle" || state === "none")
    return (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button variant="line" disabled={state === "none"} onClick={() => setState("loading")}>
          {phone3d.show}
        </Button>
        {state === "none" && <span className="text-body-sm text-steel">{phone3d.none}</span>}
      </div>
    )

  return (
    <div className="mt-5">
      <canvas
        ref={canvas}
        role="img"
        aria-label={phone3d.alt(phone3d.parts[part])}
        className="aspect-4/3 w-full cursor-grab touch-pan-y rounded-xl bg-panel active:cursor-grabbing"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          last.current = { x: e.clientX, y: e.clientY }
          phone.current?.hold(true)
        }}
        onPointerMove={(e) => {
          if (!last.current) return
          phone.current?.turn(e.clientX - last.current.x, e.clientY - last.current.y)
          last.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={() => {
          last.current = null
          phone.current?.hold(false)
        }}
        onPointerCancel={() => {
          last.current = null
          phone.current?.hold(false)
        }}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-body-sm text-steel">{phone3d.hint(phone3d.parts[part])}</span>
        <Button ref={toggle} variant="line" disabled={state !== "ready"} onClick={() => setOpen(phone.current?.toggle() ?? open)}>
          {open ? phone3d.close : phone3d.open}
        </Button>
      </div>
    </div>
  )
}
