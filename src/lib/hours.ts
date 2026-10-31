const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Intl formatters are slow to build (tens of ms on a phone), so each is built once per time zone.
const formatters = new Map<string, Intl.DateTimeFormat>()
const formatter = (timeZone: string, options: Intl.DateTimeFormatOptions) => {
  const key = timeZone + JSON.stringify(options)
  if (!formatters.has(key)) formatters.set(key, new Intl.DateTimeFormat("en-US", { timeZone, ...options }))
  return formatters.get(key)!
}

/** Day of the week (0 = Sunday) at `now` in `timeZone`. */
export const weekdayIn = (now: Date, timeZone: string) => weekdays.indexOf(formatter(timeZone, { weekday: "short" }).format(now))
