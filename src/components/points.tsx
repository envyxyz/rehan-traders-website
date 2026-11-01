import * as React from "react"

/** A short list of plain answers between hairlines: How pricing works, The open bench, and a repair page's six questions. */
export function Points({ items }: { items: readonly { title: string; text: React.ReactNode }[] }) {
  return (
    <dl className="border-t border-hairline">
      {items.map((p) => (
        <div key={p.title} className="border-b border-hairline py-4">
          <dt className="font-display text-title-md text-ink">{p.title}</dt>
          <dd className="mt-1 text-body-md text-body">{p.text}</dd>
        </div>
      ))}
    </dl>
  )
}
