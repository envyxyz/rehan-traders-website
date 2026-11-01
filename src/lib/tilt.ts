// Phone tilt from the gyroscope, shared by the job card and the hero fold.

/** -1..1 from where the phone is held: x left/right, y towards/away from you. */
export type Tilt = { x: number; y: number }

const RANGE = 20 // degrees away from the resting angle that give full deflection
const RECENTER = 0.02 // the resting angle drifts towards how the phone is held now, so the tilt never sticks at an edge

const clamp = (v: number) => Math.max(-1, Math.min(1, v / RANGE))

const ASKED = "rt-tilt-asked"

/**
 * iOS sends orientation only after asking, and only from a tap: call this in the tap handler. It asks once per device,
 * ever (remembered in localStorage), whatever the answer was; elsewhere it does nothing.
 */
export function askTilt() {
  const ask = (globalThis.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission
  if (typeof ask !== "function") return
  try {
    if (localStorage.getItem(ASKED)) return
    localStorage.setItem(ASKED, "1")
  } catch {
    // Storage refused (private mode): asking every visit is better than never.
  }
  void ask().catch(() => {})
}

/** Calls `cb` on every orientation event, on touch screens without reduced motion. Returns the unsubscribe. */
export function onTilt(cb: (tilt: Tilt) => void) {
  if (!matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {}
  let rest: { beta: number; gamma: number } | null = null
  // shortcut: reads portrait axes only; a phone held in landscape tilts on the swapped axis. Map with screen.orientation if that matters.
  const handler = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return
    rest ??= { beta: e.beta, gamma: e.gamma }
    rest.beta += (e.beta - rest.beta) * RECENTER
    rest.gamma += (e.gamma - rest.gamma) * RECENTER
    cb({ x: clamp(e.gamma - rest.gamma), y: clamp(e.beta - rest.beta) })
  }
  addEventListener("deviceorientation", handler)
  return () => removeEventListener("deviceorientation", handler)
}
