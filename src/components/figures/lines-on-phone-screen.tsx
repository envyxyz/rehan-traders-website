import { Marker } from "@/components/figures/marker"

/** Screenshot test: a phone with a screen line, and two phones showing the screenshot (clean = hardware, line present = software). */
export function Drawing() {
  return (
    <svg viewBox="0 0 480 300" className="h-auto w-full" aria-hidden="true" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {/* phone 1: the line on the live screen */}
      <rect x={64} y={38} width={120} height={224} rx={16} className="fill-card stroke-ink" />
      <rect x={72} y={58} width={104} height={184} rx={6} className="fill-panel stroke-steel" />
      <path d="M112 48H136M112 252H136" className="stroke-steel" />
      <path d="M140 58V242" className="stroke-signal" />

      {/* arrow that splits in two */}
      <path d="M196 150H224M224 84V216M224 84H270M224 216H270" className="stroke-ink" />
      <path d="M263 77L270 84L263 91M263 209L270 216L263 223" className="stroke-ink" />

      {/* phone 2: screenshot opened, clean */}
      <rect x={292} y={24} width={72} height={120} rx={12} className="fill-card stroke-ink" />
      <rect x={300} y={40} width={56} height={96} rx={4} className="fill-panel stroke-steel" />
      <path d="M320 32H336" className="stroke-steel" />
      <rect x={306} y={48} width={44} height={80} rx={2} className="fill-card stroke-hairline" />

      {/* phone 3: screenshot opened, line is in it */}
      <rect x={292} y={156} width={72} height={120} rx={12} className="fill-card stroke-ink" />
      <rect x={300} y={172} width={56} height={96} rx={4} className="fill-panel stroke-steel" />
      <path d="M320 164H336" className="stroke-steel" />
      <rect x={306} y={180} width={44} height={80} rx={2} className="fill-card stroke-hairline" />
      <path d="M335 180V260" className="stroke-ink" />

      {/* markers and leaders */}
      <path d="M45 150H64M415 84H364M415 216H364" strokeWidth={1} className="stroke-steel" />
      <Marker n={1} x={32} y={150} />
      <Marker n={2} x={428} y={84} />
      <Marker n={3} x={428} y={216} />
    </svg>
  )
}
