import { cn } from "@/lib/utils"

/** The mark's geometry in its 256 box, shared with the 3D fold's canvas screens. */
export const MARK = {
  stroke: "M40 220V89A44 44 0 0 1 84 45H172A44 44 0 0 1 216 89V112A30 30 0 0 1 186 142H171.7",
  dot: { cx: 171.7, cy: 142, r: 13 },
  t: "M65 176.6L161.8 79.8A13 13 0 0 1 180.2 98.2L136.4 142L214.4 220H177.6L118 160.4L65 213.4Z",
  width: 26,
} as const

/** Device R mark (../growth/Brand/rehan-traders-mark.svg). Stroke follows currentColor; the T is Signal Red. */
export function Mark({ className, tone = "signal" }: { className?: string; tone?: "signal" | "device" }) {
  return (
    <svg viewBox="0 0 256 256" fill="none" aria-hidden className={cn("shrink-0", className)}>
      <path d={MARK.stroke} stroke="currentColor" strokeWidth={MARK.width} />
      <circle {...MARK.dot} fill="currentColor" />
      <path d={MARK.t} className={tone === "signal" ? "fill-signal" : "fill-(--device-red)"} />
    </svg>
  )
}
