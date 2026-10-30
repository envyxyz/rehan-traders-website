"use client"

import * as React from "react"
import { ArrowUp, Phone } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { Icon, WhatsAppIcon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { assistant, site } from "@/content"
import { MAX_INPUT, MAX_TURNS, parseReply } from "@/lib/assistant"
import { track } from "@/lib/track"
import { cn } from "@/lib/utils"

type Msg = { role: "user" | "assistant"; content: string }

// ponytail: module-level, so the chat survives closing and reopening the sheet; a reload starts fresh.
let saved: Msg[] = []

/** Finished replies only: a reply cut off before its first word is not history. */
const answered = (m: Msg) => m.role === "user" || !!parseReply(m.content).body

const fixed = (text: string) => `${text}\n>> actions: whatsapp call\n>> chips:`

/** The assistant inside ChatSheet: streamed replies, quick-reply chips and Book / WhatsApp / Call from the model. */
export function ChatPanel() {
  const [messages, setMessages] = React.useState<Msg[]>(saved)
  const [draft, setDraft] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const log = React.useRef<HTMLDivElement>(null)
  const request = React.useRef<AbortController>(null)
  const ids = React.useId()

  // Closing the sheet mid-reply stops the stream and drops the empty placeholder it was filling.
  React.useEffect(
    () => () => {
      request.current?.abort()
      saved = saved.filter(answered)
    },
    []
  )

  React.useEffect(() => {
    saved = messages
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [messages])

  const turns = messages.filter((m) => m.role === "user").length
  const atLimit = turns >= MAX_TURNS
  const last = messages.at(-1)
  const reply = last?.role === "assistant" ? parseReply(last.content) : null
  const chips = busy || atLimit ? [] : (reply?.chips ?? (messages.length === 0 ? assistant.chips : []))
  const tooLong = draft.length > MAX_INPUT

  async function send(text: string) {
    const q = text.trim()
    if (!q || busy || atLimit || q.length > MAX_INPUT) return
    const history: Msg[] = [...messages, { role: "user", content: q }]
    setMessages([...history, { role: "assistant", content: "" }])
    setDraft("")
    setBusy(true)
    const show = (content: string) => setMessages([...history, { role: "assistant", content }])
    let content = ""
    const ctrl = (request.current = new AbortController())
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: ctrl.signal,
        // Only finished replies go back, without their button lines: the Worker caps both.
        body: JSON.stringify({ messages: history.filter(answered).map((m) => (m.role === "user" ? m : { ...m, content: parseReply(m.content).body })) }),
      })
      if (!res.ok || !res.body) throw new Error(String(res.status))
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        content += value
        show(content)
      }
      if (!parseReply(content).body) throw new Error("empty")
    } catch {
      if (ctrl.signal.aborted) return
      show(fixed(assistant.fallback))
    }
    if (history.filter((m) => m.role === "user").length >= MAX_TURNS) setMessages((m) => [...m, { role: "assistant", content: fixed(assistant.limit) }])
    setBusy(false)
  }

  return (
    <div className="-mx-6 flex min-h-0 flex-1 flex-col border-t border-hairline">
      <div ref={log} role="log" aria-busy={busy} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-6 py-4">
        <Bubble role="assistant">{assistant.greeting}</Bubble>
        {messages.map((m, i) => {
          const { body, actions } = m.role === "assistant" ? parseReply(m.content) : { body: m.content, actions: [] as string[] }
          const streaming = busy && i === messages.length - 1
          return (
            <React.Fragment key={i}>
              <Bubble role={m.role}>{body || (streaming && <span className="animate-pulse text-steel">{assistant.typing}</span>)}</Bubble>
              {!streaming && actions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {actions.includes("book") && (
                    <span className="contents" onClickCapture={() => track("chat_handoff", { action: "book" })}>
                      <BookButton arrow>{assistant.actions.book}</BookButton>
                    </span>
                  )}
                  {actions.includes("whatsapp") && (
                    <Button asChild variant="whatsapp">
                      <a href={site.whatsapp.withText(assistant.whatsappText)} onClick={() => track("chat_handoff", { action: "whatsapp" })}>
                        <WhatsAppIcon />
                        {assistant.actions.whatsapp}
                      </a>
                    </Button>
                  )}
                  {actions.includes("call") && (
                    <Button asChild variant="line">
                      <a href={site.phone.href} onClick={() => track("chat_handoff", { action: "call" })}>
                        <Icon icon={Phone} />
                        {site.phone.display}
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 border-t border-hairline px-6 pt-4">
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Button key={c} type="button" variant="line" dir="auto" className="h-auto min-h-11 py-2 text-left whitespace-normal" onClick={() => void send(c)}>
                {c}
              </Button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void send(draft)
          }}
          className="flex items-center gap-2"
        >
          <Label htmlFor={`${ids}-q`} className="sr-only">
            {assistant.input}
          </Label>
          <Input
            id={`${ids}-q`}
            dir="auto"
            autoComplete="off"
            enterKeyHint="send"
            placeholder={assistant.placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={atLimit}
            aria-invalid={tooLong}
            aria-describedby={tooLong ? `${ids}-err` : undefined}
          />
          <Button type="submit" variant="icon" size="lg" aria-label={assistant.send} disabled={busy || atLimit || tooLong || !draft.trim()} className="bg-action text-on-action hover:bg-action-active">
            <Icon icon={ArrowUp} size="lg" />
          </Button>
        </form>
        {tooLong && (
          <p id={`${ids}-err`} className="text-body-sm text-error">
            {assistant.tooLong(MAX_INPUT)}
          </p>
        )}
      </div>
    </div>
  )
}

function Bubble({ role, children }: { role: Msg["role"]; children: React.ReactNode }) {
  return (
    <div
      dir="auto"
      className={cn(
        "max-w-5/6 rounded-lg px-4 py-3 text-body-md whitespace-pre-line",
        role === "user" ? "self-end bg-action text-on-action" : "self-start border border-hairline bg-card text-body"
      )}
    >
      {children}
    </div>
  )
}
