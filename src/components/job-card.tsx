"use client"

import * as React from "react"
import { Mark } from "@/components/logo"
import { jobCardContent } from "@/content"
import { cn } from "@/lib/utils"

// 25x25 QR code SVG path matching the reference card
const QR_PATH =
  "M0,0h1v1h-1z M1,0h1v1h-1z M2,0h1v1h-1z M3,0h1v1h-1z M4,0h1v1h-1z M5,0h1v1h-1z M6,0h1v1h-1z M9,0h1v1h-1z M11,0h1v1h-1z M12,0h1v1h-1z M15,0h1v1h-1z M18,0h1v1h-1z M19,0h1v1h-1z M20,0h1v1h-1z M21,0h1v1h-1z M22,0h1v1h-1z M23,0h1v1h-1z M24,0h1v1h-1z M0,1h1v1h-1z M6,1h1v1h-1z M10,1h1v1h-1z M11,1h1v1h-1z M12,1h1v1h-1z M13,1h1v1h-1z M14,1h1v1h-1z M16,1h1v1h-1z M18,1h1v1h-1z M24,1h1v1h-1z M0,2h1v1h-1z M2,2h1v1h-1z M3,2h1v1h-1z M4,2h1v1h-1z M6,2h1v1h-1z M8,2h1v1h-1z M9,2h1v1h-1z M10,2h1v1h-1z M13,2h1v1h-1z M14,2h1v1h-1z M15,2h1v1h-1z M16,2h1v1h-1z M18,2h1v1h-1z M20,2h1v1h-1z M21,2h1v1h-1z M22,2h1v1h-1z M24,2h1v1h-1z M0,3h1v1h-1z M2,3h1v1h-1z M3,3h1v1h-1z M4,3h1v1h-1z M6,3h1v1h-1z M9,3h1v1h-1z M10,3h1v1h-1z M12,3h1v1h-1z M13,3h1v1h-1z M14,3h1v1h-1z M15,3h1v1h-1z M18,3h1v1h-1z M20,3h1v1h-1z M21,3h1v1h-1z M22,3h1v1h-1z M24,3h1v1h-1z M0,4h1v1h-1z M2,4h1v1h-1z M3,4h1v1h-1z M4,4h1v1h-1z M6,4h1v1h-1z M8,4h1v1h-1z M10,4h1v1h-1z M13,4h1v1h-1z M14,4h1v1h-1z M15,4h1v1h-1z M16,4h1v1h-1z M18,4h1v1h-1z M20,4h1v1h-1z M21,4h1v1h-1z M22,4h1v1h-1z M24,4h1v1h-1z M0,5h1v1h-1z M6,5h1v1h-1z M8,5h1v1h-1z M9,5h1v1h-1z M11,5h1v1h-1z M12,5h1v1h-1z M13,5h1v1h-1z M14,5h1v1h-1z M15,5h1v1h-1z M18,5h1v1h-1z M24,5h1v1h-1z M0,6h1v1h-1z M1,6h1v1h-1z M2,6h1v1h-1z M3,6h1v1h-1z M4,6h1v1h-1z M5,6h1v1h-1z M6,6h1v1h-1z M8,6h1v1h-1z M10,6h1v1h-1z M12,6h1v1h-1z M14,6h1v1h-1z M16,6h1v1h-1z M18,6h1v1h-1z M19,6h1v1h-1z M20,6h1v1h-1z M21,6h1v1h-1z M22,6h1v1h-1z M23,6h1v1h-1z M24,6h1v1h-1z M10,7h1v1h-1z M13,7h1v1h-1z M14,7h1v1h-1z M15,7h1v1h-1z M16,7h1v1h-1z M0,8h1v1h-1z M6,8h1v1h-1z M8,8h1v1h-1z M9,8h1v1h-1z M11,8h1v1h-1z M12,8h1v1h-1z M16,8h1v1h-1z M18,8h1v1h-1z M19,8h1v1h-1z M21,8h1v1h-1z M24,8h1v1h-1z M0,9h1v1h-1z M3,9h1v1h-1z M4,9h1v1h-1z M5,9h1v1h-1z M9,9h1v1h-1z M11,9h1v1h-1z M12,9h1v1h-1z M13,9h1v1h-1z M14,9h1v1h-1z M15,9h1v1h-1z M16,9h1v1h-1z M17,9h1v1h-1z M18,9h1v1h-1z M21,9h1v1h-1z M23,9h1v1h-1z M24,9h1v1h-1z M0,10h1v1h-1z M1,10h1v1h-1z M2,10h1v1h-1z M4,10h1v1h-1z M5,10h1v1h-1z M6,10h1v1h-1z M7,10h1v1h-1z M10,10h1v1h-1z M12,10h1v1h-1z M13,10h1v1h-1z M14,10h1v1h-1z M15,10h1v1h-1z M16,10h1v1h-1z M19,10h1v1h-1z M22,10h1v1h-1z M23,10h1v1h-1z M24,10h1v1h-1z M2,11h1v1h-1z M7,11h1v1h-1z M11,11h1v1h-1z M12,11h1v1h-1z M13,11h1v1h-1z M14,11h1v1h-1z M18,11h1v1h-1z M20,11h1v1h-1z M21,11h1v1h-1z M22,11h1v1h-1z M23,11h1v1h-1z M0,12h1v1h-1z M2,12h1v1h-1z M3,12h1v1h-1z M4,12h1v1h-1z M5,12h1v1h-1z M6,12h1v1h-1z M7,12h1v1h-1z M8,12h1v1h-1z M9,12h1v1h-1z M10,12h1v1h-1z M12,12h1v1h-1z M13,12h1v1h-1z M14,12h1v1h-1z M15,12h1v1h-1z M18,12h1v1h-1z M20,12h1v1h-1z M21,12h1v1h-1z M22,12h1v1h-1z M24,12h1v1h-1z M0,13h1v1h-1z M1,13h1v1h-1z M3,13h1v1h-1z M4,13h1v1h-1z M5,13h1v1h-1z M7,13h1v1h-1z M10,13h1v1h-1z M11,13h1v1h-1z M12,13h1v1h-1z M13,13h1v1h-1z M15,13h1v1h-1z M16,13h1v1h-1z M17,13h1v1h-1z M18,13h1v1h-1z M19,13h1v1h-1z M20,13h1v1h-1z M21,13h1v1h-1z M22,13h1v1h-1z M23,13h1v1h-1z M24,13h1v1h-1z M0,14h1v1h-1z M1,14h1v1h-1z M3,14h1v1h-1z M4,14h1v1h-1z M6,14h1v1h-1z M7,14h1v1h-1z M9,14h1v1h-1z M12,14h1v1h-1z M13,14h1v1h-1z M16,14h1v1h-1z M22,14h1v1h-1z M24,14h1v1h-1z M0,15h1v1h-1z M1,15h1v1h-1z M2,15h1v1h-1z M3,15h1v1h-1z M5,15h1v1h-1z M8,15h1v1h-1z M9,15h1v1h-1z M10,15h1v1h-1z M11,15h1v1h-1z M12,15h1v1h-1z M13,15h1v1h-1z M14,15h1v1h-1z M15,15h1v1h-1z M16,15h1v1h-1z M18,15h1v1h-1z M21,15h1v1h-1z M24,15h1v1h-1z M1,16h1v1h-1z M2,16h1v1h-1z M3,16h1v1h-1z M4,16h1v1h-1z M5,16h1v1h-1z M6,16h1v1h-1z M7,16h1v1h-1z M9,16h1v1h-1z M10,16h1v1h-1z M13,16h1v1h-1z M14,16h1v1h-1z M15,16h1v1h-1z M16,16h1v1h-1z M17,16h1v1h-1z M18,16h1v1h-1z M19,16h1v1h-1z M21,16h1v1h-1z M22,16h1v1h-1z M23,16h1v1h-1z M24,16h1v1h-1z M8,17h1v1h-1z M10,17h1v1h-1z M11,17h1v1h-1z M12,17h1v1h-1z M16,17h1v1h-1z M19,17h1v1h-1z M20,17h1v1h-1z M21,17h1v1h-1z M24,17h1v1h-1z M0,18h1v1h-1z M1,18h1v1h-1z M2,18h1v1h-1z M3,18h1v1h-1z M4,18h1v1h-1z M5,18h1v1h-1z M6,18h1v1h-1z M8,18h1v1h-1z M9,18h1v1h-1z M12,18h1v1h-1z M13,18h1v1h-1z M14,18h1v1h-1z M15,18h1v1h-1z M16,18h1v1h-1z M18,18h1v1h-1z M20,18h1v1h-1z M21,18h1v1h-1z M22,18h1v1h-1z M23,18h1v1h-1z M24,18h1v1h-1z M0,19h1v1h-1z M6,19h1v1h-1z M8,19h1v1h-1z M10,19h1v1h-1z M11,19h1v1h-1z M12,19h1v1h-1z M13,19h1v1h-1z M14,19h1v1h-1z M15,19h1v1h-1z M16,19h1v1h-1z M17,19h1v1h-1z M18,19h1v1h-1z M19,19h1v1h-1z M20,19h1v1h-1z M22,19h1v1h-1z M23,19h1v1h-1z M0,20h1v1h-1z M2,20h1v1h-1z M3,20h1v1h-1z M4,20h1v1h-1z M6,20h1v1h-1z M9,20h1v1h-1z M14,20h1v1h-1z M15,20h1v1h-1z M19,20h1v1h-1z M20,20h1v1h-1z M0,21h1v1h-1z M2,21h1v1h-1z M3,21h1v1h-1z M4,21h1v1h-1z M6,21h1v1h-1z M8,21h1v1h-1z M9,21h1v1h-1z M12,21h1v1h-1z M13,21h1v1h-1z M15,21h1v1h-1z M16,21h1v1h-1z M18,21h1v1h-1z M20,21h1v1h-1z M21,21h1v1h-1z M22,21h1v1h-1z M24,21h1v1h-1z M0,22h1v1h-1z M2,22h1v1h-1z M3,22h1v1h-1z M4,22h1v1h-1z M6,22h1v1h-1z M8,22h1v1h-1z M10,22h1v1h-1z M13,22h1v1h-1z M14,22h1v1h-1z M15,22h1v1h-1z M16,22h1v1h-1z M19,22h1v1h-1z M20,22h1v1h-1z M22,22h1v1h-1z M23,22h1v1h-1z M0,23h1v1h-1z M6,23h1v1h-1z M8,23h1v1h-1z M10,23h1v1h-1z M13,23h1v1h-1z M14,23h1v1h-1z M16,23h1v1h-1z M19,23h1v1h-1z M22,23h1v1h-1z M23,23h1v1h-1z M0,24h1v1h-1z M1,24h1v1h-1z M2,24h1v1h-1z M3,24h1v1h-1z M4,24h1v1h-1z M5,24h1v1h-1z M6,24h1v1h-1z M8,24h1v1h-1z M9,24h1v1h-1z M10,24h1v1h-1z M12,24h1v1h-1z M14,24h1v1h-1z M15,24h1v1h-1z M16,24h1v1h-1z M17,24h1v1h-1z M18,24h1v1h-1z M21,24h1v1h-1z M22,24h1v1h-1z M23,24h1v1h-1z M24,24h1v1h-1z"

export interface JobCardProps {
  className?: string
  withSeal?: boolean
}

export function JobCard({ className, withSeal = true }: JobCardProps) {
  // 3D subtle mouse movement state
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0 })
  const [isHovered, setIsHovered] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)

  // Mouse only: a tap has no "leave", so on touch the tilt would stick.
  const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !cardRef.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    // Very subtle, laser-focused tilt (max ~3.5 degrees)
    const rx = ((y - centerY) / centerY) * -3.5
    const ry = ((x - centerX) / centerX) * 3.5
    setTilt({ rx, ry })
  }, [])

  const handlePointerEnter = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setIsHovered(true)
  }, [])

  const handlePointerLeave = React.useCallback(() => {
    setIsHovered(false)
    setTilt({ rx: 0, ry: 0 })
  }, [])

  return (
    <div
      className={cn("relative mx-auto w-full select-none", className)}
      style={{ perspective: "1000px" }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Interactive 3D Card with subtle tilt */}
      <div
        ref={cardRef}
        className={cn(
          "relative grid w-full grid-cols-10",
          "overflow-hidden rounded-xl",
          "shadow-elevated",
          "border border-hairline",
          "will-change-transform"
        )}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: isHovered
            ? "transform 0.12s cubic-bezier(0.2, 0, 0, 1)"
            : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {/* Left Side: Dark background with centered RT Mark */}
        <div className="relative col-span-3 flex items-center justify-center bg-device-ink p-5 sm:p-8">
          <Mark
            tone="signal"
            className="size-20 text-device-paper sm:size-28 md:size-32 transition-transform duration-(--duration-base)"
          />
        </div>

        {/* Right Side: Off-white crisp card content */}
        <div className="col-span-7 flex flex-col justify-between bg-device-paper p-5 sm:p-7 md:p-8 text-device-ink">
          {/* Top Row: Rehan Traders Brand Lockup + QR Code */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Mark tone="signal" className="size-7 text-device-ink sm:size-8" />
              <div className="font-display text-body-sm font-extrabold leading-none tracking-tight text-device-ink sm:text-body-md">
                <div>{jobCardContent.brandFirst}</div>
                <div>{jobCardContent.brandSecond}</div>
              </div>
            </div>

            {/* Crisp QR Code */}
            <svg
              viewBox="0 0 25 25"
              className="size-12 shrink-0 text-device-ink sm:size-14 md:size-16"
              fill="currentColor"
              shapeRendering="crispEdges"
              aria-label={jobCardContent.qrAria}
            >
              <path d={QR_PATH} />
            </svg>
          </div>

          {/* Center: Large bold phone number */}
          <div className="my-4 sm:my-5 md:my-6">
            <span className="block font-display text-display-md font-bold tracking-tight whitespace-nowrap text-device-ink tabular-nums">
              {jobCardContent.phone}
            </span>
          </div>

          {/* Bottom: the card's fields, one column on a phone so every value fits on its line. */}
          <dl className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4">
            {Object.values(jobCardContent.fields).map((field) => (
              <div key={field.label} className="flex flex-col">
                <dt className="text-micro font-medium text-device-steel sm:text-caption">{field.label}</dt>
                <dd className="border-b border-device-rule pt-0.5 pb-1 font-typewriter text-caption font-bold tracking-wide text-device-ink sm:text-body-sm">{field.initial}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Tamper seal badge overlapping the bottom-right corner */}
      {withSeal && (
        // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized file
        <img
          src="/art/tamper-seal-240.webp"
          width={240}
          height={240}
          alt={jobCardContent.sealAlt}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute -right-3 -bottom-4 size-20 rotate-6 drop-shadow-xl sm:-right-4 sm:-bottom-5 sm:size-24"
        />
      )}
    </div>
  )
}
