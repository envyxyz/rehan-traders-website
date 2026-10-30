import { readFile } from "node:fs/promises"
import { join } from "node:path"
import React from "react"
import type { Metadata } from "next"
import { ImageResponse } from "next/og"

import { site } from "@/content"
import { ogColors } from "@/lib/tokens"

type PageMetaInput = {
  title: string
  description: string
  /** Canonical path, e.g. "/reviews". */
  path: string
  /** Use the title as written, without the " · Rehan Traders" template (the home page). */
  absolute?: boolean
  /** Extra Metadata fields, e.g. `robots`. */
  extra?: Metadata
}

/**
 * The metadata every route uses. Next.js replaces the parent's `openGraph` and `twitter` objects whole when a page
 * sets its own, so siteName, type and locale are repeated here instead of relying on the root layout alone.
 * Per-route Open Graph and Twitter images are generated at build time via each route's opengraph-image.tsx and twitter-image.tsx.
 */
export function pageMeta({ title, description, path, absolute, extra }: PageMetaInput): Metadata {
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, type: "website", locale: "en_PK" },
    twitter: { card: "summary_large_image", title, description },
    ...extra,
  }
}

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

let fontDataPromise: Promise<Buffer> | null = null
function getFont(): Promise<Buffer> {
  if (!fontDataPromise) {
    fontDataPromise = readFile(join(process.cwd(), "src/app/archivo.ttf"))
  }
  return fontDataPromise
}

const brandDescriptor = "Mobile & Tab Repair Lab"

type OgCardOptions = {
  title: string
  isHome?: boolean
  subtitle?: string
}

export async function createOgImage({ title, isHome, subtitle }: OgCardOptions): Promise<ImageResponse> {
  const fontData = await getFont()

  const mark = React.createElement(
    "svg",
    {
      width: isHome ? "150" : "100",
      height: isHome ? "150" : "100",
      viewBox: "0 0 256 256",
      fill: "none",
    },
    React.createElement("path", {
      d: "M40 220V89.0A44 44 0 0 1 84.0 45.0H172.0A44 44 0 0 1 216 89.0V112.0A30 30 0 0 1 186.0 142.0H171.7",
      stroke: ogColors.ink,
      strokeWidth: "26",
      strokeLinecap: "butt",
    }),
    React.createElement("circle", {
      cx: "171.7",
      cy: "142.0",
      r: "13.0",
      fill: ogColors.ink,
    }),
    React.createElement("path", {
      d: "M65.0 176.6L161.8 79.8A13.0 13.0 0 0 1 180.2 98.2L136.4 142.0L214.4 220L177.6 220L118.0 160.4L65.0 213.4Z",
      fill: ogColors.signal,
    })
  )

  const effectiveSubtitle = subtitle ?? (isHome ? brandDescriptor : undefined)
  const addressLine = `${site.address.short}, ${site.address.city} · ${site.phone.display}`

  const element = React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: ogColors.paper,
        color: ogColors.ink,
        padding: "60px 80px",
        fontFamily: "Archivo",
      },
    },
    // Top bar: RT Mark + optional brand name
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "20px",
        },
      },
      mark,
      !isHome &&
        React.createElement(
          "span",
          {
            style: {
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: ogColors.steel,
            },
          },
          site.name
        )
    ),
    // Center headline
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: isHome ? "-20px" : "0px",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            fontSize: isHome ? "110px" : title.length > 25 ? "68px" : "80px",
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: ogColors.ink,
          },
        },
        title
      ),
      effectiveSubtitle &&
        React.createElement(
          "div",
          {
            style: {
              fontSize: isHome ? "44px" : "32px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: ogColors.steel,
            },
          },
          effectiveSubtitle
        )
    ),
    // Bottom address and phone
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: ogColors.steel,
        },
      },
      addressLine
    )
  )

  return new ImageResponse(element, {
    ...ogSize,
    fonts: [
      {
        name: "Archivo",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  })
}
