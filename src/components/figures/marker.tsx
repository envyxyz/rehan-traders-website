/** A numbered marker in a figure's drawing (viewBox units). The number matches the key under the drawing. */
export function Marker({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} strokeWidth={0} className="fill-ink" />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} strokeWidth={0} className="fill-paper font-display">
        {n}
      </text>
    </g>
  )
}
