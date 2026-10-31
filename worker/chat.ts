import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createGroq } from "@ai-sdk/groq"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { streamText, type LanguageModel, type ModelMessage } from "ai"
import { z } from "zod"

import { assistant } from "../src/content"
import { chatSystem, MAX_INPUT, MAX_TURNS } from "../src/lib/assistant"

export type AiEnv = {
  OPENROUTER_API_KEY?: string
  GOOGLE_AI_API_KEY?: string
  GOOGLE_AI_PRO_API_KEY?: string
  GROQ_API_KEY?: string
  /** Testing only: comma list of providers (openrouter, google, groq) given a bad key, to prove the fallback chain. */
  AI_FORCE_FAIL?: string
}

/** maxOutput counts thinking too on Gemini, so it gets more room for the same short reply. */
type Provider = { name: string; model: LanguageModel; options: Record<string, Record<string, unknown>>; maxOutput: number }

const FIRST_TOKEN_MS = 8000 // a provider that has not started answering by then is skipped
const REPLY_MS = 25000

/** In order: Claude Haiku via OpenRouter, Gemini Flash via Google AI Studio, then Groq. Missing keys are skipped. */
export function providers(env: AiEnv): Provider[] {
  const fail = new Set((env.AI_FORCE_FAIL ?? "").split(",").map((s) => s.trim()))
  const key = (name: string, k?: string) => (k && fail.has(name) ? "forced-fail" : k)
  const list: Provider[] = []
  const or = key("openrouter", env.OPENROUTER_API_KEY)
  if (or)
    list.push({
      name: "openrouter",
      model: createOpenRouter({ apiKey: or }).chat("anthropic/claude-haiku-5.5"),
      // Short answers from a fixed knowledge block: no thinking needed, and it keeps the first token fast.
      options: { openrouter: { reasoning: { effort: "none" } } },
      maxOutput: 400,
    })
  // The newest Flash first, then the one before it: on 29 Oct 2026 the newest was overloaded for minutes at a time.
  // ponytail: both keys are AI Studio free tier, 20 requests a day per model per key, so four model/key pairs give
  // the fallback about 80 replies a day. A quota error fails in about a second, so trying them in turn is cheap.
  // Upgrade path: a paid Gemini key (needs Google billing), then one model and one key here.
  for (const id of ["gemini-3.8-flash", "gemini-3.6-flash"])
    for (const [label, k] of [["pro", env.GOOGLE_AI_PRO_API_KEY], ["free", env.GOOGLE_AI_API_KEY]] as const) {
      const g = key("google", k)
      if (g)
        list.push({
          name: `google/${id}/${label}`,
          model: createGoogleGenerativeAI({ apiKey: g })(id),
          options: { google: { thinkingConfig: { thinkingLevel: "low" } } },
          maxOutput: 1200,
        })
    }
  // Last model before the fixed reply: Groq's free tier has a far larger daily quota than Gemini's.
  const gq = key("groq", env.GROQ_API_KEY)
  if (gq)
    list.push({
      name: "groq",
      model: createGroq({ apiKey: gq })("openai/gpt-oss-120b"),
      options: { groq: { reasoningEffort: "low", reasoningFormat: "hidden" } },
      maxOutput: 1200,
    })
  return list
}

/** The system block, marked for prompt caching on OpenRouter (Anthropic); Google caches repeated prefixes on its own. */
const instructions = { role: "system" as const, content: chatSystem, providerOptions: { openrouter: { cacheControl: { type: "ephemeral" } } } }

// Which script the customer wrote in, worked out here rather than left to the model: Haiku answered Urdu script in
// Roman Urdu, and gpt-oss answered Roman Urdu in Urdu script.
const scriptHint = (text: ModelMessage["content"]) => {
  const s = typeof text === "string" ? text : ""
  const urdu = (s.match(/\p{Script=Arabic}/gu)?.length ?? 0) > s.replace(/[^\p{L}]/gu, "").length / 2
  // ponytail: two common Urdu words in Latin letters means Roman Urdu; a word list, so mixed or rare phrasing can miss.
  const roman = (s.match(romanWords)?.length ?? 0) >= 2
  return {
    role: "system" as const,
    content: urdu
      ? "The customer's latest message is in Urdu script. Reply in Urdu script (اردو), not Roman Urdu."
      : roman
        ? "The customer's latest message is in Roman Urdu. Reply in Roman Urdu (Urdu in English letters), not English and not Urdu script."
        : "Reply in the language of the customer's latest message, in English letters. Never Urdu script unless they wrote it.",
  }
}
const romanWords = /\b(hai|hain|ka|ki|ke|ko|aap|ap|nahi|nahin|kya|karein|karna|karwani|sakta|sakte|sakti|mein|mera|meri|wala|wali|gaya|gayi|kitne|kitna|bhai|theek|hoon|hun|jao|liye|kab|kahan)\b/gi

const Message = z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(2000) }).strict()
const Body = z
  .object({ messages: z.array(Message).min(1).max(MAX_TURNS * 2 - 1) })
  .strict()
  .refine((b) => b.messages.at(-1)!.role === "user")
  .refine((b) => b.messages.every((m) => m.role !== "user" || m.content.length <= MAX_INPUT))

const encoder = new TextEncoder()
const fixedReply = `${assistant.fallback}\n>> buttons: whatsapp call\n>> chips:`

/** Starts one provider and waits for its first words, so a dead provider fails here and the next one is tried. */
async function start(p: Provider, messages: ModelMessage[]) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FIRST_TOKEN_MS)
  const result = streamText({
    model: p.model,
    // The hint goes after the cached block, so the cache still hits.
    instructions: [instructions, scriptHint(messages.at(-1)!.content)],
    messages,
    maxOutputTokens: p.maxOutput,
    maxRetries: 0,
    abortSignal: ctrl.signal,
    providerOptions: p.options as never,
  })
  const parts = result.stream[Symbol.asyncIterator]()
  try {
    for (;;) {
      const { value, done } = await parts.next()
      if (done) throw new Error("empty reply")
      if (value.type === "error") throw value.error
      if (value.type === "abort") throw new Error("timed out")
      if (value.type === "text-delta" && value.text) {
        clearTimeout(timer)
        setTimeout(() => ctrl.abort(), REPLY_MS)
        return { first: value.text, parts }
      }
    }
  } catch (err) {
    clearTimeout(timer)
    ctrl.abort()
    throw err
  }
}

/** POST /api/chat: plain-text stream of the reply. The x-chat-provider header says which model answered. */
export async function chat(request: Request, env: AiEnv): Promise<Response> {
  if (request.method !== "POST") return Response.json({ ok: false, error: "method" }, { status: 405 })
  if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ ok: false, error: "type" }, { status: 415 })
  if (Number(request.headers.get("content-length")) > 96_000) return Response.json({ ok: false, error: "size" }, { status: 413 })
  const raw = await request.text()
  if (raw.length > 32_000) return Response.json({ ok: false, error: "size" }, { status: 413 })
  let parsed
  try {
    parsed = Body.safeParse(JSON.parse(raw))
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 })
  }
  if (!parsed.success) return Response.json({ ok: false, error: "invalid" }, { status: 400 })

  const headers = (name: string) => ({ "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-chat-provider": name })
  for (const p of providers(env)) {
    let started
    try {
      started = await start(p, parsed.data.messages)
    } catch (err) {
      // Status and message only: never the customer's text.
      console.error("chat provider failed", p.name, String(err).slice(0, 200))
      continue
    }
    const { first, parts } = started
    const body = new ReadableStream<Uint8Array>({
      async start(c) {
        c.enqueue(encoder.encode(first))
        try {
          for (;;) {
            const { value, done } = await parts.next()
            if (done) break
            if (value.type === "text-delta") c.enqueue(encoder.encode(value.text))
            if (value.type === "error" || value.type === "abort") throw new Error(value.type)
          }
        } catch (err) {
          // Broke off mid-reply: end it with the contact buttons rather than leave it hanging.
          console.error("chat stream broke", p.name, String(err).slice(0, 200))
          c.enqueue(encoder.encode(`\n\n${fixedReply}`))
        }
        c.close()
      },
    })
    return new Response(body, { headers: headers(p.name) })
  }
  return new Response(fixedReply, { headers: headers("none") })
}
