import Link from "next/link"

import { Icon } from "@/components/icon"
import { ChevronRight } from "@/components/icons"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbs, site } from "@/content"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // Always start with Home
  const allItems: BreadcrumbItem[] = [{ label: breadcrumbs.home, href: "/" }, ...items]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label={breadcrumbs.label} className={cn("text-caption text-steel", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            return (
              <li key={item.label} className="inline-flex items-center gap-1.5">
                {index > 0 && <Icon icon={ChevronRight} size="sm" className="text-steel-soft" />}
                {isLast || !item.href ? (
                  <span aria-current="page" className="font-semibold text-ink">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="-mx-0.75 -my-3.25 inline-flex min-h-11 min-w-11 items-center justify-center px-0.75 text-steel underline-offset-4 hover:text-ink hover:underline">
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
