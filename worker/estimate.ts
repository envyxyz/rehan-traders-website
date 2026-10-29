import { generateText, Output } from "ai"
import { z } from "zod"

import { estimateSystem, faultSlugs, MAX_INPUT } from "../src/lib/assistant"
import { providers, type AiEnv } from "./chat"

const TIMEOUT_MS = 10000

const Body = z.object({ text: z.string().trim().min(3).max(MAX_INPUT) }).strict()

// The model only names the device and picks a fault slug; the page takes the repair and price line from content.ts.
// generateObject is deprecated in AI SDK 7: generateText with Output.object is its replacement.
const Estimate = z.object({
  device: z.string().max(60).nullable(),
  faultSlug: z.enum(faultSlugs),
  confidence: z.enum(["high", "medium", "low"]),
})

const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status })

/** POST /api/estimate: { text } to { ok, device, faultSlug, confidence, provider }. 503 when every model is down. */
export async function estimate(request: Request, env: AiEnv): Promise<Response> {
  if (request.method !== "POST") return fail(405, "method")
  if (!request.headers.get("content-type")?.startsWith("application/json")) return fail(415, "type")
  const raw = await request.text()
  if (raw.length > 4096) return fail(413, "size")
  let parsed
  try {
    parsed = Body.safeParse(JSON.parse(raw))
  } catch {
    return fail(400, "invalid")
  }
  if (!parsed.success) return fail(400, "invalid")

  for (const p of providers(env)) {
    try {
      const { output } = await generateText({
        model: p.model,
        instructions: estimateSystem,
        prompt: parsed.data.text,
        output: Output.object({ schema: Estimate }),
        maxOutputTokens: p.maxOutput,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(TIMEOUT_MS),
        providerOptions: p.options as never,
      })
      // Same character rule as a booking's device name: it may end up in a WhatsApp text or the Sheet.
      const device = output.device?.trim().replace(/[\p{C}<>]/gu, "").replace(/^[=+\-@]+/, "") || null
      return Response.json({ ok: true, ...output, device, provider: p.name }, { headers: { "cache-control": "no-store" } })
    } catch (err) {
      console.error("estimate provider failed", p.name, String(err).slice(0, 200))
    }
  }
  return fail(503, "unavailable")
}
