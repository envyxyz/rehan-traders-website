import { estimator } from "@/content"
import { createOgImage, ogContentType, ogSize } from "@/lib/page-meta"

export const dynamic = "force-static"
export const size = ogSize
export const contentType = ogContentType
export const alt = estimator.seo.title

export default async function Image() {
  return createOgImage({ title: estimator.seo.title })
}
