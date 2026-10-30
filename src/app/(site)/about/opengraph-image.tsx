import { seo } from "@/content"
import { createOgImage, ogContentType, ogSize } from "@/lib/page-meta"

export const dynamic = "force-static"
export const size = ogSize
export const contentType = ogContentType
export const alt = seo.about.title

export default async function Image() {
  return createOgImage({ title: seo.about.title })
}
