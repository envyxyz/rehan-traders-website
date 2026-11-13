// Exploded view of a phone screen: cracked outer glass (1) above the display panel (2), which joins the body through its flex cable (3).
import { Marker } from "@/components/figures/marker"

// Point on a layer's top face; a runs across the width, b along the length, y0 is the layer's front corner height.
const pt = (y0: number, a: number, b: number) => `${150 + 60 * a + 120 * b},${(y0 + 34 * a - 69 * b).toFixed(1)}`
const face = (y0: number, ...ab: [number, number][]) => ab.map(([a, b]) => pt(y0, a, b)).join(" ")
const slab = [[0, 0], [1, 0], [1, 1], [0, 1]] as [number, number][]
// Front and right side walls of a layer with thickness t.
const walls = (y0: number, t: number) => (
  <>
    <polygon points={`${pt(y0, 0, 0)} ${pt(y0, 1, 0)} ${pt(y0 + t, 1, 0)} ${pt(y0 + t, 0, 0)}`} className="fill-concrete stroke-ink" />
    <polygon points={`${pt(y0, 1, 0)} ${pt(y0, 1, 1)} ${pt(y0 + t, 1, 1)} ${pt(y0 + t, 1, 0)}`} className="fill-concrete stroke-ink" />
  </>
)

export function Drawing() {
  return (
    <svg viewBox="0 0 480 300" className="h-auto w-full" aria-hidden="true" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {/* Phone body with battery bay and display socket */}
      {walls(226, 8)}
      <polygon points={face(226, ...slab)} className="fill-panel stroke-ink" />
      <polygon points={face(226, [0.15, 0.3], [0.85, 0.3], [0.85, 0.9], [0.15, 0.9])} className="fill-card stroke-steel" strokeWidth={1.25} />
      <polygon points={face(226, [0.33, 0.09], [0.67, 0.09], [0.67, 0.16], [0.33, 0.16])} className="fill-concrete stroke-ink" strokeWidth={1.25} />

      {/* Flex cable dropping from the panel into the socket */}
      <polygon points="186,185 186,229 204,239 204,195" className="fill-card stroke-ink" />
      <path d="M192 200 V228 M198 203 V232" className="stroke-steel" strokeWidth={1} />

      {/* Display panel */}
      {walls(164, 6)}
      <polygon points={face(164, ...slab)} className="fill-panel stroke-ink" />
      <polygon points={face(164, [0.06, 0.05], [0.94, 0.05], [0.94, 0.95], [0.06, 0.95])} className="fill-card stroke-steel" strokeWidth={1.25} />
      <polygon points={face(164, [0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8])} className="stroke-hairline" strokeWidth={1.25} />

      {/* Outer glass */}
      {walls(102, 6)}
      <polygon points={face(102, ...slab)} className="fill-card stroke-ink" />
      <polygon points={face(102, [0.06, 0.05], [0.94, 0.05], [0.94, 0.95], [0.06, 0.95])} className="stroke-steel" strokeWidth={1.25} />
      <path d="M248 52 L254 48" className="stroke-steel" strokeWidth={1.25} />

      {/* The fault: cracks radiating from a point of impact */}
      <g className="stroke-signal">
        <path d="M300 50 L280 66 L262 70 L246 88 L228 92 L214 100" strokeWidth={2.25} />
        <path d="M262 70 L252 58" strokeWidth={1.25} />
        <path d="M246 88 L258 100" strokeWidth={1.25} />
      </g>

      {/* Markers with leaders */}
      <g className="stroke-steel" strokeWidth={1}>
        <path d="M410 56 L312 68" />
        <path d="M410 130 L300 128" />
        <path d="M96 214 L192 214" />
      </g>
      <Marker n={1} x={420} y={55} />
      <Marker n={2} x={420} y={130} />
      <Marker n={3} x={84} y={214} />
    </svg>
  )
}
