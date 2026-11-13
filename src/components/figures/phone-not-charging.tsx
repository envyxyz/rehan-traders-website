import { Marker } from "@/components/figures/marker"

// Charging path of a phone: wall adapter and cable, then a cutaway phone showing the port (with lint in it), battery and main board.
export function Drawing() {
  return (
    <svg viewBox="0 0 480 300" className="h-auto w-full" aria-hidden="true" fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(0 26)">
      {/* wall adapter, prongs and cable */}
      <path d="M24 140H36M24 160H36" className="stroke-ink" />
      <rect x={36} y={126} width={50} height={48} rx={7} className="fill-card stroke-ink" />
      <path d="M48 140V160M56 140V160" className="stroke-steel" />
      <path d="M86 150H118" className="stroke-ink" />
      <rect x={118} y={141} width={32} height={18} rx={4} className="fill-panel stroke-ink" />
      <path d="M126 146V154M133 146V154" className="stroke-steel" />

      {/* phone, back removed */}
      <rect x={170} y={70} width={290} height={160} rx={18} className="fill-panel stroke-ink" />
      <rect x={180} y={80} width={270} height={140} rx={10} className="stroke-hairline" />

      {/* charging port at the left edge */}
      <rect x={170} y={136} width={22} height={28} rx={3} className="fill-concrete stroke-ink" />
      <path d="M192 150H198" className="stroke-steel" />
      {/* flex cable from the port to the board */}
      <path d="M181 164V212H405V208" className="stroke-steel" />

      {/* battery */}
      <rect x={206} y={92} width={140} height={116} rx={8} className="fill-card stroke-ink" />
      <rect x={346} y={142} width={10} height={16} rx={2} className="fill-concrete stroke-steel" />
      <path d="M222 112H330M222 128H330" className="stroke-hairline" />
      <path d="M222 188H260" className="stroke-steel" />

      {/* main board with chips */}
      <rect x={358} y={92} width={90} height={116} rx={6} className="fill-panel stroke-ink" />
      <rect x={370} y={104} width={32} height={30} rx={3} className="fill-card stroke-ink" />
      <rect x={410} y={104} width={26} height={30} rx={3} className="fill-card stroke-steel" />
      <rect x={370} y={150} width={66} height={22} rx={3} className="fill-concrete stroke-ink" />
      <path d="M370 188H436" className="stroke-steel" />

      {/* lint clump in the port: the one red element */}
      <path d="M174 154C175 142 180 160 183 144C186 138 187 160 189 150" className="stroke-signal" />

      {/* markers and leaders */}
      <path d="M60 106V126" className="stroke-steel" strokeWidth={1} />
      <Marker n={1} x={60} y={90} />
      <path d="M155 196L177 156" className="stroke-steel" strokeWidth={1} />
      <Marker n={2} x={150} y={212} />
      <path d="M183 52V137" className="stroke-steel" strokeWidth={1} />
      <Marker n={3} x={183} y={36} />
      <path d="M276 52V92" className="stroke-steel" strokeWidth={1} />
      <Marker n={4} x={276} y={36} />
      <path d="M403 52V104" className="stroke-steel" strokeWidth={1} />
      <Marker n={5} x={403} y={36} />
      </g>
    </svg>
  )
}
