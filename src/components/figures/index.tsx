import { Drawing as Battery } from "@/components/figures/battery-draining-fast"
import { Drawing as Cracked } from "@/components/figures/cracked-screen-glass-or-full-screen"
import { Drawing as Lines } from "@/components/figures/lines-on-phone-screen"
import { Drawing as Water } from "@/components/figures/phone-fell-in-water"
import { Drawing as Charging } from "@/components/figures/phone-not-charging"
import { Drawing as Dead } from "@/components/figures/phone-not-turning-on"
import { Drawing as Touch } from "@/components/figures/touch-not-working"
import { Phone3D } from "@/components/phone-3d"
import type { Guide } from "@/content-large"

const drawings: Record<string, () => React.JSX.Element> = {
  "battery-draining-fast": Battery,
  "cracked-screen-glass-or-full-screen": Cracked,
  "lines-on-phone-screen": Lines,
  "phone-fell-in-water": Water,
  "phone-not-charging": Charging,
  "phone-not-turning-on": Dead,
  "touch-not-working": Touch,
}

/**
 * A guide's infographic: a numbered drawing and its key, all in the server HTML (no JS). The key is real text, so it reads at
 * any width and search engines index it; the same picture is a PNG in /guides/figures for image search and the Article schema.
 * Under it, the button that opens the 3D phone.
 */
export function GuideFigure({ guide }: { guide: Guide }) {
  const Drawing = drawings[guide.slug]
  if (!Drawing) return null
  const id = `figure-${guide.slug}`
  return (
    <figure data-figure aria-labelledby={id} className="mt-10 rounded-xl border border-hairline bg-card p-5 sm:p-7">
      <h2 id={id} className="font-display text-title-md text-ink">
        {guide.figure.title}
      </h2>
      <div className="mt-4">
        <Drawing />
      </div>
      <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {guide.figure.items.map((item, i) => (
          <li key={item.label} className="flex gap-3 text-body-sm text-body">
            <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-pill bg-ink font-display text-caption font-bold text-paper tabular-nums">
              {i + 1}
            </span>
            <span>
              <strong className="font-display font-semibold text-ink">{item.label}.</strong> {item.text}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 border-t border-hairline pt-4 text-caption text-steel">{guide.figure.caption}</figcaption>
      <div data-no-shot>
        <Phone3D part={guide.part} />
      </div>
    </figure>
  )
}
