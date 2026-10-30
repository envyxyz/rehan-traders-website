import { expect, test } from "@playwright/test"

import { assistant } from "../../src/content"
import { chat, type AiEnv } from "../../worker/chat"

// Node-side, no browser: worker/chat.ts runs against a stubbed globalThis.fetch that plays the three providers, so the
// fallback chain (OpenRouter Haiku, then the Gemini key/model pairs, then Groq, then the fixed reply) is proven without
// a key or a network. Browser-side chat behaviour is in assistant.spec.ts.
test.skip(({ isMobile }) => isMobile, "Worker code, nothing to do with the device: runs once")

const sse = (...events: object[]) => events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("")
const stream = (body: string) => new Response(body, { headers: { "content-type": "text/event-stream" } })

// What each provider's streaming endpoint sends for one short reply.
const openAi = (text: string) =>
  stream(
    sse(
      { id: "1", object: "chat.completion.chunk", created: 1, model: "m", choices: [{ index: 0, delta: { role: "assistant", content: text }, finish_reason: null }] },
      { id: "1", object: "chat.completion.chunk", created: 1, model: "m", choices: [{ index: 0, delta: {}, finish_reason: "stop" }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }
    ) + "data: [DONE]\n\n"
  )
const gemini = (text: string) =>
  stream(sse({ candidates: [{ content: { role: "model", parts: [{ text }] }, finishReason: "STOP", index: 0 }], usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 1, totalTokenCount: 2 } }))
const down = (status = 500) => Response.json({ error: { message: "down", code: status } }, { status })

type Route = "openrouter" | "google" | "groq"
const which = (url: string): Route => (url.includes("openrouter.ai") ? "openrouter" : url.includes("googleapis.com") ? "google" : "groq")

const keys: AiEnv = { OPENROUTER_API_KEY: "k1", GOOGLE_AI_PRO_API_KEY: "k2", GOOGLE_AI_API_KEY: "k3", GROQ_API_KEY: "k4" }
const request = (text = "Do you repair Fold hinges?") =>
  new Request("https://x/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: text }] }) })

/** Runs chat() with `answer` standing in for the network; returns the response, its text and the calls made, in order. */
async function run(answer: (route: Route, url: string, init?: RequestInit) => Response | Promise<Response>, env: AiEnv = keys) {
  const real = globalThis.fetch
  const realError = console.error
  const calls: string[] = []
  globalThis.fetch = (async (input: unknown, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input)
    calls.push(url)
    return answer(which(url), url, init)
  }) as typeof fetch
  console.error = () => {} // the Worker logs each failed provider
  try {
    const res = await chat(request(), env)
    return { res, text: await res.text(), calls, provider: res.headers.get("x-chat-provider") }
  } finally {
    globalThis.fetch = real
    console.error = realError
  }
}

test("the first provider answers: OpenRouter, one call, a plain-text stream", async () => {
  const { res, text, calls, provider } = await run((route) => (route === "openrouter" ? openAi("Yes, we do.") : down()))
  expect(res.status).toBe(200)
  expect(res.headers.get("content-type")).toContain("text/plain")
  expect(res.headers.get("cache-control")).toBe("no-store")
  expect(provider).toBe("openrouter")
  expect(text).toBe("Yes, we do.")
  expect(calls).toHaveLength(1)
  expect(calls[0]).toContain("openrouter.ai")
})

test("OpenRouter fails: the first Gemini key and model answers", async () => {
  const { text, calls, provider } = await run((route) => (route === "openrouter" ? down(503) : gemini("From Gemini.")))
  expect(provider).toBe("google/gemini-3.8-flash/pro")
  expect(text).toBe("From Gemini.")
  expect(calls.map(which)).toEqual(["openrouter", "google"])
})

test("a Gemini quota error moves on to the next key and model, in order", async () => {
  let google = 0
  const { text, provider, calls } = await run((route) => {
    if (route === "openrouter") return down()
    if (route === "google" && ++google < 4) return down(429)
    return gemini("Fourth Gemini pair.")
  })
  expect(provider).toBe("google/gemini-3.6-flash/free")
  expect(text).toBe("Fourth Gemini pair.")
  expect(calls.map(which)).toEqual(["openrouter", "google", "google", "google", "google"])
  expect(calls[1]).toContain("gemini-3.8-flash")
  expect(calls[3]).toContain("gemini-3.6-flash")
})

test("OpenRouter and every Gemini pair fail: Groq answers", async () => {
  const { text, provider, calls } = await run((route) => (route === "groq" ? openAi("From Groq.") : down(429)))
  expect(provider).toBe("groq")
  expect(text).toBe("From Groq.")
  expect(calls.map(which)).toEqual(["openrouter", "google", "google", "google", "google", "groq"])
})

test("all providers fail: the fixed reply with the contact buttons and no chips", async () => {
  const { res, text, provider, calls } = await run(() => down())
  expect(res.status).toBe(200) // the page shows a reply, not an error
  expect(provider).toBe("none")
  expect(text).toBe(`${assistant.fallback}\n>> buttons: whatsapp call\n>> chips:`)
  expect(calls).toHaveLength(6)
})

test("no keys at all: the fixed reply without calling anyone", async () => {
  const { text, provider, calls } = await run(() => down(), {})
  expect(provider).toBe("none")
  expect(text).toContain(assistant.fallback)
  expect(calls).toHaveLength(0)
})

test("an empty reply counts as a failure and the next provider is tried", async () => {
  const { provider } = await run((route) => (route === "openrouter" ? openAi("") : route === "google" ? gemini("Second.") : down()))
  expect(provider).toBe("google/gemini-3.8-flash/pro")
})

test("a reply that breaks off mid-way ends with the fixed contact reply", async () => {
  const { provider, text } = await run((route) => {
    if (route !== "openrouter") return down()
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        const first = sse({ id: "1", object: "chat.completion.chunk", created: 1, model: "m", choices: [{ index: 0, delta: { role: "assistant", content: "Half a rep" }, finish_reason: null }] })
        c.enqueue(new TextEncoder().encode(first))
        setTimeout(() => c.error(new Error("connection reset")), 20)
      },
    })
    return new Response(body, { headers: { "content-type": "text/event-stream" } })
  })
  expect(provider).toBe("openrouter")
  expect(text.startsWith("Half a rep")).toBe(true)
  expect(text).toContain(assistant.fallback)
})

test("a provider that never starts answering is skipped after 8 seconds", async () => {
  test.setTimeout(30_000)
  const t0 = Date.now()
  const { provider } = await run(
    (route, _url, init) =>
      route === "openrouter"
        ? new Promise<Response>((_, reject) => init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))
        : gemini("After the wait."),
  )
  expect(provider).toBe("google/gemini-3.8-flash/pro")
  expect(Date.now() - t0).toBeGreaterThanOrEqual(7500)
  expect(Date.now() - t0).toBeLessThan(15_000)
})

test("AI_FORCE_FAIL sends a bad key to the named provider, so the chain can be tested live", async () => {
  const seen: string[] = []
  await run((route, _url, init) => {
    seen.push(`${route}:${new Headers(init?.headers).get("authorization") ?? new Headers(init?.headers).get("x-goog-api-key")}`)
    return route === "groq" ? openAi("ok") : down()
  }, { ...keys, AI_FORCE_FAIL: "openrouter" })
  expect(seen[0]).toBe("openrouter:Bearer forced-fail")
})
