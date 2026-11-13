import { Marker } from "@/components/figures/marker"

/** A phone that fell in water: power button, unplugged cable, SIM tray out, port facing down with drops, moving air. */
export function Drawing() {
  return (
    <svg viewBox="0 0 480 300" className="h-auto w-full" aria-hidden="true" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {/* phone body and screen */}
      <rect x={170} y={14} width={110} height={230} rx={18} className="stroke-ink fill-card" />
      <rect x={179} y={28} width={92} height={202} rx={9} className="stroke-steel fill-panel" strokeWidth={1} />
      <path d="M215 21h20" className="stroke-steel" />
      {/* screen is off: power symbol */}
      <path d="M233.5 112a14 14 0 1 1-17 0" className="stroke-steel" />
      <path d="M225 105v12" className="stroke-steel" />

      {/* 1: power button on the right edge */}
      <rect x={280} y={64} width={5} height={34} rx={2} className="stroke-ink fill-panel" />
      <path d="M317 81h-29" className="stroke-steel" strokeWidth={1} />
      <Marker n={1} x={330} y={81} />

      {/* 3: SIM tray pulled part-way out of the left edge */}
      <path d="M170 124h-3" className="stroke-steel" />
      <rect x={138} y={118} width={32} height={12} rx={3} className="stroke-ink fill-card" />
      <circle cx={146} cy={124} r={2.5} className="stroke-steel" strokeWidth={1.25} />
      <path d="M103 80l32 36" className="stroke-steel" strokeWidth={1} />
      <Marker n={3} x={96} y={72} />

      {/* 4: charging port at the bottom edge, drops falling */}
      <rect x={212} y={236} width={26} height={5} rx={2.5} className="stroke-ink fill-ink" />
      <path d="M222 245l-4 11M228 245l5 11" className="stroke-steel" strokeWidth={1} />
      <g className="stroke-signal">
        <path d="M217 254c5 8 7 13 0 16-7-3-5-8 0-16z" />
        <path d="M235 258c5 8 7 13 0 16-7-3-5-8 0-16z" />
        <path d="M225 277c4 6 5 10 0 12-5-2-4-6 0-12z" />
      </g>
      <path d="M126 246l82-4" className="stroke-steel" strokeWidth={1} />
      <Marker n={4} x={113} y={247} />

      {/* 2: charging cable end set aside, its plug turned away from the port: not plugged in */}
      <g transform="translate(305 270) rotate(-12)">
        <rect x={-9} y={-40} width={18} height={14} rx={3} className="stroke-ink fill-card" />
        <path d="M-4 -33h8" className="stroke-steel" />
        <rect x={-13} y={-26} width={26} height={26} rx={6} className="stroke-ink fill-panel" />
      </g>
      <path d="M311 271c40 14 70-8 110 6" className="stroke-ink" />
      <path d="M355 214l-45 40" className="stroke-steel" strokeWidth={1} />
      <Marker n={2} x={364} y={206} />

      {/* 5: moving air */}
      <path d="M312 130c16-9 32 9 48 0s32-9 52 0M300 158c18-9 36 9 54 0s36-9 58 0M312 186c16-9 32 9 48 0s32-9 52 0" className="stroke-steel" />
      <path d="M404 125l8 5-8 5M404 153l8 5-8 5M404 181l8 5-8 5" className="stroke-ink" />
      <path d="M440 130l-26 25" className="stroke-steel" strokeWidth={1} />
      <Marker n={5} x={448} y={122} />
    </svg>
  )
}
