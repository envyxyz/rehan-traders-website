// Three battery troubles side by side: 1 software drain (phone with a usage list), 2 worn cell (fill level), 3 swollen cell (screen lifted).
import { Marker } from "@/components/figures/marker"

export function Drawing() {
  return (
    <svg viewBox="0 0 480 300" className="h-auto w-full" aria-hidden="true" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {/* 1: phone, front, with an app battery-usage list */}
      <rect x={38} y={70} width={84} height={170} rx={14} className="fill-card stroke-ink" />
      <rect x={46} y={84} width={68} height={142} rx={6} className="fill-panel stroke-steel" />
      <path d="M70 77h20" className="stroke-steel" />
      <circle cx={58} cy={110} r={6} className="fill-card stroke-steel" />
      <circle cx={58} cy={150} r={6} className="fill-card stroke-steel" />
      <circle cx={58} cy={190} r={6} className="fill-card stroke-steel" />
      <rect x={69} y={106} width={40} height={8} rx={3} className="fill-ink" />
      <rect x={69} y={146} width={26} height={8} rx={3} className="fill-concrete stroke-steel" />
      <rect x={69} y={186} width={14} height={8} rx={3} className="fill-concrete stroke-steel" />
      <Marker n={1} x={80} y={34} />

      {/* 2: bare battery cell, flex connector, fill at about four fifths */}
      <rect x={226} y={68} width={28} height={22} rx={3} className="fill-panel stroke-ink" />
      <path d="M234 76h12M234 82h12" className="stroke-steel" />
      <rect x={190} y={90} width={100} height={150} rx={8} className="fill-card stroke-ink" />
      <rect x={198} y={125} width={84} height={107} rx={4} strokeWidth={0} className="fill-concrete" />
      <rect x={198} y={98} width={84} height={134} rx={4} className="stroke-steel" />
      <path d="M198 125h84" className="stroke-ink" />
      <Marker n={2} x={240} y={34} />

      {/* 3: phone in profile, swollen cell lifting the screen at the right edge */}
      <rect x={332} y={192} width={136} height={46} rx={7} className="fill-card stroke-ink" />
      <rect x={348} y={202} width={104} height={26} rx={3} className="fill-panel stroke-steel" />
      <path d="M362 192Q400 150 438 192Z" strokeWidth={0} className="fill-concrete" />
      <path d="M334 192v-10L466 146v10L334 192Z" className="fill-panel stroke-ink" />
      <path d="M362 192Q400 150 438 192" className="stroke-signal" />
      <path d="M400 114v32" strokeWidth={1} className="stroke-steel" />
      <Marker n={3} x={400} y={100} />
    </svg>
  )
}
