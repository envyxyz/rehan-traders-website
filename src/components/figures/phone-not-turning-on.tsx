import { Marker } from "@/components/figures/marker"

/** Four checks for a phone that will not turn on: charge it, force restart, vibrates but black screen, battery or board. */
export function Drawing() {
  return (
    <svg viewBox="0 0 480 300" className="h-auto w-full" aria-hidden="true" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {/* 1: charge it */}
      <rect x={28} y={66} width={64} height={130} rx={11} className="fill-card stroke-ink" />
      <rect x={33} y={72} width={54} height={118} rx={6} className="fill-panel stroke-steel" />
      <circle cx={60} cy={79} r={2} className="fill-ink stroke-ink" />
      <rect x={53} y={196} width={14} height={12} rx={2} className="fill-concrete stroke-ink" />
      <path d="M60 208 V232" className="stroke-ink" />
      <rect x={42} y={232} width={36} height={28} rx={5} className="fill-card stroke-ink" />
      <path d="M52 260 V270 M68 260 V270" className="stroke-ink" />
      <Marker n={1} x={60} y={30} />

      {/* 2: force restart */}
      <rect x={148} y={66} width={64} height={130} rx={11} className="fill-card stroke-ink" />
      <rect x={153} y={72} width={54} height={118} rx={6} className="fill-panel stroke-steel" />
      <circle cx={180} cy={79} r={2} className="fill-ink stroke-ink" />
      <rect x={144} y={92} width={4} height={16} rx={1.5} className="fill-concrete stroke-ink" />
      <rect x={144} y={114} width={4} height={16} rx={1.5} className="fill-concrete stroke-ink" />
      <rect x={212} y={104} width={4} height={28} rx={1.5} className="fill-concrete stroke-ink" />
      <path d="M122 111 H140 M134 105 L140 111 L134 117" className="stroke-ink" />
      <path d="M238 118 H220 M226 112 L220 118 L226 124" className="stroke-ink" />
      <Marker n={2} x={180} y={30} />

      {/* 3: vibrates but the screen stays black */}
      <rect x={268} y={66} width={64} height={130} rx={11} className="fill-card stroke-ink" />
      <rect x={273} y={72} width={54} height={118} rx={6} className="fill-panel stroke-steel" />
      <circle cx={300} cy={79} r={2} className="fill-ink stroke-ink" />
      <path d="M258 111 Q252 131 258 151 M248 103 Q240 131 248 159" className="stroke-steel" />
      <path d="M342 111 Q348 131 342 151 M352 103 Q360 131 352 159" className="stroke-steel" />
      <Marker n={3} x={300} y={30} />

      {/* 4: cutaway, battery and main board */}
      <rect x={388} y={66} width={64} height={130} rx={11} className="fill-card stroke-ink" />
      <rect x={396} y={74} width={48} height={42} rx={4} className="fill-concrete stroke-signal" />
      <rect x={406} y={83} width={18} height={18} rx={2} className="fill-panel stroke-ink" />
      <circle cx={434} cy={88} r={5} className="fill-panel stroke-steel" />
      <path d="M420 116 V128" className="stroke-steel" />
      <rect x={396} y={128} width={48} height={58} rx={4} className="fill-panel stroke-ink" />
      <path d="M412 128 V124 H428 V128" className="stroke-steel" />
      <Marker n={4} x={420} y={30} />
    </svg>
  )
}
