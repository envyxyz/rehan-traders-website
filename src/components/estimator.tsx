"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Check, Phone } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { actions, booking, estimator, priceMode, site } from "@/content"
import { MAX_INPUT, repairFor } from "@/lib/assistant"
import { findModels } from "@/lib/devices"
import { track } from "@/lib/track"

type Result = { device: string | null; faultSlug: string; confidence: "high" | "medium" | "low"; path: "pick" | "describe" }

/** POST /api/estimate. null when the Worker or every model is down. */
async function fetchEstimate(text: string): Promise<Result | null> {
  try {
    const res = await fetch("/api/estimate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    })
    const out = (await res.json()) as Partial<Result> & { ok?: boolean }
    if (!out.ok || !out.faultSlug || !out.confidence) return null
    const r: Result = { device: out.device ?? null, faultSlug: out.faultSlug, confidence: out.confidence, path: "describe" }
    track("estimate_complete", { path: "describe", fault: r.faultSlug, service: repairFor(r.faultSlug, r.device).service?.slug ?? null })
    return r
  } catch {
    return null
  }
}

/** /estimate?q=…: the homepage's "Describe the problem" box lands here and runs the description at once. */
export function EstimatorFromUrl() {
  const q = useSearchParams().get("q")?.slice(0, MAX_INPUT) ?? ""
  return <Estimator key={q} q={q} />
}

/**
 * Two paths to one result: pick device + fault (no model needed), or describe it (the Worker maps the words to a
 * device and fault). Either way the repair and price line come from content.ts, never from the model.
 */
export function Estimator({ q = "" }: { q?: string }) {
  const [mode, setMode] = React.useState<"pick" | "describe">(q ? "describe" : "pick")
  const [device, setDevice] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")
  const [fault, setFault] = React.useState("")
  const [text, setText] = React.useState(q)
  const [result, setResult] = React.useState<Result | null>(null)
  const runsQ = q.trim().length >= 3
  const [status, setStatus] = React.useState<"idle" | "working" | "unavailable">(runsQ ? "working" : "idle")
  const [error, setError] = React.useState<string | null>(null)
  const ids = React.useId()
  const found = findModels(query)

  const settle = React.useCallback((r: Result | null) => {
    setStatus(r ? "idle" : "unavailable")
    setResult(r)
  }, [])

  function describe(words: string) {
    setStatus("working")
    setResult(null)
    void fetchEstimate(words).then(settle)
  }

  // A description from the homepage box runs once on arrival.
  React.useEffect(() => {
    if (runsQ) void fetchEstimate(q).then(settle)
  }, [q, runsQ, settle])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (mode === "pick") {
      if (!device || !fault) return setError(estimator.pickError)
      setResult({ device, faultSlug: fault, confidence: "high", path: "pick" })
      return track("estimate_complete", { path: "pick", fault, service: repairFor(fault, device).service?.slug ?? null })
    }
    if (text.trim().length < 3) return setError(estimator.describeError)
    describe(text.trim())
  }

  return (
    <div className="flex flex-col gap-6">
      <form noValidate onSubmit={submit} className="flex flex-col gap-5">
        <RadioGroup
          aria-label={estimator.mode.label}
          value={mode}
          onValueChange={(m) => {
            setMode(m as typeof mode)
            setError(null)
          }}
        >
          <RadioGroupItem value="pick">{estimator.mode.pick}</RadioGroupItem>
          <RadioGroupItem value="describe">{estimator.mode.describe}</RadioGroupItem>
        </RadioGroup>

        {mode === "pick" ? (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${ids}-device`}>{estimator.device}</Label>
              <Command label={estimator.device} shouldFilter={false} className="bg-paper">
                <CommandInput
                  id={`${ids}-device`}
                  placeholder={booking.device.search}
                  value={query}
                  onValueChange={(v) => {
                    setQuery(v)
                    setDevice(null)
                  }}
                />
                {query.trim() && !device && (
                  <CommandList>
                    {found.length > 0 && (
                      <CommandGroup heading={booking.device.models}>
                        {found.map((m) => (
                          <CommandItem key={m} value={`pick:${m}`} onSelect={() => (setDevice(m), setQuery(m))}>
                            {m}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {!found.some((m) => m.toLowerCase() === query.trim().toLowerCase()) && (
                      <CommandGroup heading={booking.device.notListed}>
                        <CommandItem value={`typed:${query}`} onSelect={() => setDevice(query.trim().slice(0, 60))}>
                          {booking.device.useTyped(query.trim().slice(0, 60))}
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                )}
              </Command>
              {device && (
                <p className="flex items-center gap-2 text-body-sm font-semibold text-ink">
                  <Icon icon={Check} size="sm" />
                  {device}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label id={`${ids}-fault`}>{estimator.fault}</Label>
              <RadioGroup aria-labelledby={`${ids}-fault`} value={fault} onValueChange={setFault}>
                {estimator.faults.map((f) => (
                  <RadioGroupItem key={f.slug} value={f.slug}>
                    {f.label}
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${ids}-text`}>{estimator.describe}</Label>
            <textarea
              id={`${ids}-text`}
              dir="auto"
              rows={3}
              maxLength={MAX_INPUT}
              placeholder={estimator.describePlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-describedby={`${ids}-hint`}
              className="w-full min-w-0 resize-none rounded-sm border border-hairline bg-paper px-4 py-3.5 text-body-md text-ink outline-none placeholder:text-steel focus-visible:border-ink focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ink/12"
            />
            <p id={`${ids}-hint`} className="text-caption text-steel">
              {estimator.describeHint}
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="text-body-sm text-error">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" arrow className="justify-between self-stretch sm:self-start" disabled={status === "working"}>
          {status === "working" ? estimator.working : estimator.submit}
        </Button>
      </form>

      <div aria-live="polite">
        {status === "unavailable" && <Unavailable />}
        {result && <Outcome result={result} />}
      </div>
    </div>
  )
}

function Outcome({ result }: { result: Result }) {
  const { fault, service, price } = repairFor(result.faultSlug, result.device)
  const device = result.device ?? estimator.result.unknownDevice
  const quote = site.whatsapp.withText(estimator.whatsapp(device, fault.label))
  const ref = React.useRef<HTMLElement>(null)
  // On a phone the result lands below the form, out of view.
  React.useEffect(() => ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), [result])
  return (
    <section ref={ref} className="flex animate-rise flex-col gap-4 border-t border-hairline pt-6 motion-reduce:animate-none">
      <h2 className="text-body-sm text-steel">{estimator.result.title}</h2>
      {service ? (
        <>
          <p className="-mt-2 font-display text-title-lg text-ink">{service.title}</p>
          <dl className="divide-y divide-hairline rounded-lg border border-hairline">
            {[
              [estimator.result.device, device],
              [estimator.result.fault, fault.label],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 px-4 py-3">
                <dt className="w-16 shrink-0 text-body-sm text-steel">{label}</dt>
                <dd className="min-w-0 text-body-md font-semibold break-words text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {fault.panel && <Text>{estimator.result.panel[fault.panel]}</Text>}
          {result.confidence !== "high" && (
            <Text size="body-sm" tone="muted">
              {estimator.result.guess}
            </Text>
          )}
          <p className="font-display text-title-md tabular-nums text-ink">{price}</p>
          <div className="flex flex-wrap gap-2.5">
            {priceMode === "quote" && (
              <Button asChild size="lg" variant="whatsapp">
                <a href={quote}>
                  <WhatsAppIcon />
                  {estimator.result.quote}
                </a>
              </Button>
            )}
            <BookButton size="lg" variant={priceMode === "quote" ? "line" : "ink"} service={service.slug} device={result.device ?? undefined}>
              {actions.bookRepair}
            </BookButton>
          </div>
        </>
      ) : (
        <>
          <Text>{estimator.result.other}</Text>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild size="lg" variant="whatsapp">
              <a href={quote}>
                <WhatsAppIcon />
                {estimator.result.quote}
              </a>
            </Button>
          </div>
        </>
      )}
    </section>
  )
}

function Unavailable() {
  return (
    <section className="flex flex-col gap-4 border-t border-hairline pt-6">
      <Text>{estimator.unavailable}</Text>
      <div className="flex flex-wrap gap-2.5">
        <Button asChild size="lg" variant="whatsapp">
          <a href={site.whatsapp.href}>
            <WhatsAppIcon />
            {estimator.result.quote}
          </a>
        </Button>
        <Button asChild size="lg" variant="line">
          <a href={site.phone.href}>
            <Icon icon={Phone} />
            {site.phone.display}
          </a>
        </Button>
      </div>
    </section>
  )
}
