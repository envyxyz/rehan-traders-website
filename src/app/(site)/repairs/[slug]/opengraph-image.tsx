import { seo, services, site } from "@/content"
import { createOgImage, ogContentType, ogSize } from "@/lib/page-meta"

export const dynamic = "force-static"
export const size = ogSize
export const contentType = ogContentType
export const alt = seo.repairs.title

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)
  const title = service ? service.title : site.name
  return createOgImage({ title })
}
