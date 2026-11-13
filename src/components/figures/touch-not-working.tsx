// Exploded view of a phone's touch stack: screen protector, glass with touch layer (dead zone in red), display panel, phone body.
import { Marker } from "@/components/figures/marker";

// Point on a layer's top face: s runs along the long edge, t across it, y is the layer height.
const P = (y: number, s: number, t: number) =>
  `${64 + 190 * s + 44 * t},${(y - 26 * s + 28 * t).toFixed(1)}`;
const poly = (y: number, pts: number[][]) =>
  `M${pts.map(([s, t]) => P(y, s, t)).join("L")}Z`;

function Slab({ y, t, top, side }: { y: number; t: number; top: string; side: string }) {
  return (
    <g className="stroke-ink">
      <path className={side} d={`M64,${y}L108,${y + 28}L298,${y + 2}v${t}L108,${y + 28 + t}L64,${y + t}Z`} />
      <path d={`M108,${y + 28}v${t}`} />
      <path className={top} d={poly(y, [[0, 0], [1, 0], [1, 1], [0, 1]])} />
    </g>
  );
}

const grid = [
  ...[1, 2, 3, 4, 5, 6, 7].map((i) => `M${P(114, i / 8, 0.1)}L${P(114, i / 8, 0.9)}`),
  ...[1, 2, 3].map((i) => `M${P(114, 0.04, i / 4)}L${P(114, 0.96, i / 4)}`),
].join("");

export function Drawing() {
  return (
    <svg
      viewBox="0 0 480 300"
      className="h-auto w-full"
      aria-hidden="true"
      fill="none"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* corner guides, behind the layers */}
      <path className="stroke-steel" strokeWidth={1} strokeDasharray="3 4" d="M64,54V238M108,82V266M298,118V240" />

      {/* phone body */}
      <Slab y={238} t={9} top="fill-card" side="fill-panel" />
      <path className="stroke-steel fill-panel" strokeWidth={1} d={poly(238, [[0.05, 0.12], [0.95, 0.12], [0.95, 0.88], [0.05, 0.88]])} />
      <path className="stroke-steel" strokeWidth={1} d={poly(238, [[0.14, 0.28], [0.5, 0.28], [0.5, 0.72], [0.14, 0.72]])} />

      {/* display panel */}
      <Slab y={176} t={5} top="fill-panel" side="fill-concrete" />
      <path className="stroke-steel fill-concrete" strokeWidth={1} d={poly(176, [[0.04, 0.1], [0.96, 0.1], [0.96, 0.9], [0.04, 0.9]])} />

      {/* outer glass with touch layer */}
      <Slab y={114} t={5} top="fill-card" side="fill-panel" />
      <path className="stroke-hairline" strokeWidth={1} d={grid} />
      <rect
        className="fill-card stroke-signal"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="4 3"
        width={1}
        height={1}
        rx={0.25}
        ry={0.25}
        transform="matrix(57 -7.8 30.8 19.6 146.6 107.8)"
      />

      {/* screen protector with one corner lifted */}
      <path className="stroke-ink fill-card" d={`M${P(52, 0, 0)}L${P(52, 1, 0)}L${P(52, 1, 0.6)}L${P(52, 0.9, 1)}L${P(52, 0, 1)}Z`} />
      <path className="stroke-ink fill-panel" d={`M${P(52, 1, 0.6)}L${P(52, 0.9, 1)}L314,18Z`} />

      {/* markers and leaders */}
      <path className="stroke-steel" strokeWidth={1} d="M397,31H297M397,102H277M397,164H277" />
      <Marker n={1} x={410} y={31} />
      <Marker n={2} x={410} y={102} />
      <Marker n={3} x={410} y={164} />
    </svg>
  );
}
