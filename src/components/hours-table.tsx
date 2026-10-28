"use client"

import * as React from "react"

import { site, visit } from "@/content"
import { formatTime, weekdayIn } from "@/lib/hours"
import { cn } from "@/lib/utils"

const { hours } = site
const noSubscribe = () => () => {}

/** Week from Monday; today's row gets the 4px Signal Red bar once the client knows the day in Lahore. */
export function HoursTable({ className }: { className?: string }) {
  // Undefined in the static HTML; the client fills in today's weekday after hydration.
  const today = React.useSyncExternalStore(noSubscribe, () => weekdayIn(new Date(), hours.timezone), () => undefined)

  return (
    <table className={cn("w-full text-body-sm", className)}>
      <caption className="sr-only">{visit.hoursTitle}</caption>
      <tbody>
        {hours.days.map((d) => {
          const isToday = d.day === today
          const brk = "break" in d ? d.break : undefined
          return (
            <tr key={d.day} aria-current={isToday ? "date" : undefined} className="border-b border-hairline last:border-0">
              <th
                scope="row"
                className={cn(
                  "border-l-4 py-2.5 pl-3 text-left font-normal text-steel",
                  isToday ? "border-signal font-semibold text-ink" : "border-transparent"
                )}
              >
                {d.label}
                {isToday && <span className="sr-only">, {visit.today}</span>}
              </th>
              <td className={cn("py-2.5 text-right tabular-nums", isToday ? "font-semibold text-ink" : "text-body")}>
                {d.open && d.close ? visit.hoursRange(formatTime(d.open), formatTime(d.close)) : visit.closed}
                {brk && <span className="block text-caption text-steel">{visit.hoursBreak(formatTime(brk.from), formatTime(brk.to))}</span>}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
