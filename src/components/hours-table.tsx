"use client"

import * as React from "react"

import { site, visit } from "@/content"
import { weekdayIn } from "@/lib/hours"
import { cn } from "@/lib/utils"

const noSubscribe = () => () => {}

/** Compact hours; the row covering today gets the 4px Signal Red bar once the client knows the day in Lahore. */
export function HoursTable({ className }: { className?: string }) {
  // Undefined in the static HTML; the client fills in today's weekday after hydration.
  const today = React.useSyncExternalStore(noSubscribe, () => weekdayIn(new Date(), site.hours.timezone), () => undefined)
  const current = today === undefined ? -1 : visit.hours.findLastIndex((row) => (row.days as readonly number[]).includes(today))

  return (
    <table className={cn("w-full text-body-sm", className)}>
      <caption className="sr-only">{visit.hoursTitle}</caption>
      <tbody>
        {visit.hours.map((row, i) => {
          const isToday = i === current
          return (
            <tr key={row.label} aria-current={isToday ? "date" : undefined} className="border-b border-hairline last:border-0">
              <th
                scope="row"
                className={cn(
                  "border-l-4 py-2.5 pl-3 text-left font-normal text-steel",
                  isToday ? "border-signal font-semibold text-ink" : "border-transparent"
                )}
              >
                {row.label}
                {isToday && <span className="sr-only">, {visit.today}</span>}
              </th>
              <td className={cn("py-2.5 pl-4 text-right tabular-nums", isToday ? "font-semibold text-ink" : "text-body")}>{row.value}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
