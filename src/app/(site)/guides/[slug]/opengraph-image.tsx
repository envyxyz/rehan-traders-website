import { seo, site } from "@/content"
import { guides } from "@/content-large"
import { createOgImage, ogContentType, ogSize } from "@/lib/page-meta"

export const dynamic = "force-static"
export const size = ogSize
export const contentType = ogContentType
export const alt = seo.guides.title

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const guide = guides.find((g) => g.slug === slug)
  const title = guide ? guide.title : site.name
  return createOgImage({ title })
}
