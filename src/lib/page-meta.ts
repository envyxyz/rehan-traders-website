import type { Metadata } from "next"

import shareImage from "@/app/opengraph-image.png"
import { seo, site } from "@/content"

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

const images = [{ url: shareImage.src, width: shareImage.width, height: shareImage.height, alt: seo.shareImageAlt }]

/**
 * The metadata every route uses. Next.js replaces the parent's `openGraph` and `twitter` objects whole when a page
 * sets its own, so siteName, type and locale are repeated here instead of relying on the root layout alone.
 * Images are set here too, for the same reason: a page's own openGraph does not inherit the layout's file-convention
 * image. The import is the same PNG the app/opengraph-image.png convention serves, with a content-hashed URL.
 */
export function pageMeta({ title, description, path, absolute, extra }: PageMetaInput): Metadata {
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, type: "website", locale: "en_PK", images },
    twitter: { card: "summary_large_image", title, description, images },
    ...extra,
  }
}
