import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { cn } from "@/lib/utils"

// Phase 2 writes public/images/<name>-<width>.avif|webp at these widths (scripts/images/export.mjs).
const WIDTHS = [640, 720, 960, 1280, 1920]
const dir = path.join(process.cwd(), "public", "images")
// Pixel size of each image's largest export (written by export.mjs): width and height attributes, for the aspect ratio before CSS loads.
const meta: Record<string, { width: number; height: number; alt: string }> = JSON.parse(readFileSync(path.join(dir, "alt.json"), "utf8"))

const srcSet = (name: string, ext: string, widths: number[]) =>
  widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(", ")

type ImgProps = {
  name: string
  /** Defaults to the image's alt text in alt.json. */
  alt?: string
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string
  /** Sizing and aspect classes for the frame, e.g. "aspect-4/3 rounded-lg". */
  className?: string
  priority?: boolean
}

/**
 * Pre-sized Phase 2 image with AVIF/WebP srcset (static export, no optimizer). Server only:
 * checks the files at build time and renders a quiet placeholder surface when they are missing.
 */
export function Img({ name, alt, sizes, className, priority }: ImgProps) {
  const widths = WIDTHS.filter((w) => existsSync(path.join(dir, `${name}-${w}.webp`)))
  if (!widths.length) return <div aria-hidden className={cn("bg-concrete", className)} />
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, "avif", widths)} sizes={sizes} />
      <img
        src={`/images/${name}-${widths[0]}.webp`}
        srcSet={srcSet(name, "webp", widths)}
        sizes={sizes}
        width={meta[name]?.width}
        height={meta[name]?.height}
        alt={alt ?? meta[name]?.alt ?? ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("skeleton object-cover", className)}
      />
    </picture>
  )
}
