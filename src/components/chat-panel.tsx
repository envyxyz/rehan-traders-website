"use client"

import * as React from "react"

import { Icon, WhatsAppIcon } from "@/components/icon"
import { ArrowRight, ArrowUp, Phone } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { assistant, site } from "@/content"
import { MAX_INPUT, MAX_TURNS, parseReply, pieces } from "@/lib/assistant"
import { chipStagger } from "@/lib/tokens"
import { track } from "@/lib/track"
import { cn } from "@/lib/utils"

type Msg = { role: "user" | "assistant"; content: string }

// ponytail: module-level, so the chat survives closing and reopening the sheet; a reload starts fresh.
let saved: Msg[] = []

/** Finished replies only: a reply cut off before its first word is not history. */
const answered = (m: Msg) => m.role === "user" || !!parseReply(m.content).body

// The only replies that carry buttons: the model never writes them, so a model reply cannot show any.
const fixed = (text: string) => `${text}
>> buttons: whatsapp call
>> chips:`

/** The assistant inside ChatSheet: streamed replies with links inside the sentences, and quick-reply chips. */
export function ChatPanel() {
  const [messages, setMessages] = React.useState<Msg[]>(saved)
  const [draft, setDraft] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [typing, setTyping] = React.useState(false)
  const log = React.useRef<HTMLDivElement>(null)
  const request = React.useRef<AbortController>(null)
  const count = React.useRef(messages.length)
  // Reopening the sheet shows the chat as it was; only what is new rises in.
  const [restored] = React.useState(messages.length)
  const ids = React.useId()

  // Closing the sheet mid-reply stops the stream and drops the empty placeholder it was filling.
  React.useEffect(
    () => () => {
      request.current?.abort()
      saved = saved.filter(answered)
    },
    []
  )

  // Glides for a new bubble and for the chips arriving; follows streaming text at once, or each chunk restarts the glide and it judders.
  React.useEffect(() => {
    saved = messages
    const added = messages.length !== count.current
    count.current = messages.length
    const smooth = (added || !busy) && !matchMedia("(prefers-reduced-motion: reduce)").matches
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: smooth ? "smooth" : "auto" })
  }, [messages, busy])

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
      <div ref={log} role="log" aria-busy={busy} className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-6 py-4">
        <Bubble role="assistant" enter={restored === 0}>
          {assistant.greeting}
        </Bubble>
        {messages.map((m, i) => {
          const { body, buttons, page } = m.role === "assistant" ? parseReply(m.content) : { body: m.content, buttons: [] as ("whatsapp" | "call")[], page: null }
          const streaming = busy && i === messages.length - 1
          const enter = i >= restored
          return (
            <Bubble
              key={i}
              role={m.role}
              enter={enter}
              footer={
                !streaming && buttons.length > 0 ? (
                  <>
                    {buttons.includes("whatsapp") && (
                      <a href={site.whatsapp.withText(assistant.whatsappText)} target="_blank" rel="noopener noreferrer" className={attached} onClick={() => track("chat_handoff", { action: "whatsapp" })} data-track="whatsapp" data-track-from="chat">
                        <WhatsAppIcon />
                        {assistant.actions.whatsapp}
                      </a>
                    )}
                    {buttons.includes("call") && (
                      <a href={site.phone.href} className={attached} onClick={() => track("chat_handoff", { action: "call" })} data-track="call" data-track-from="chat">
                        <Icon icon={Phone} />
                        {site.phone.display}
                      </a>
                    )}
                  </>
                ) : !streaming && page ? (
                  // The guide or repair page the answer came from (the Worker adds it; the model cannot).
                  <a href={page.href} className={attached} onClick={() => track("chat_handoff", { action: "page" })}>
                    {page.title}
                    <Icon icon={ArrowRight} />
                  </a>
                ) : null
              }
            >
              {m.role === "user"
                ? body
                : body
                  ? (
                      // The dots give way to the words with a fade: same height for a one-line reply, so the bubble keeps its place.
                      <span className={cn(enter && "animate-reply")}>
                        {pieces(body, streaming).map((p, j) =>
                          p.type === "send" ? (
                            <button key={j} type="button" className={inline} disabled={busy || atLimit} onClick={() => void send(p.text)}>
                              {p.text}
                            </button>
                          ) : p.type === "form" ? (
                            <a key={j} href={assistant.formHref} className={inline} onClick={() => track("chat_handoff", { action: "form" })}>
                              {p.text}
                            </a>
                          ) : (
                            <React.Fragment key={j}>{buttons.length ? p.text : withPhoneLink(p.text)}</React.Fragment>
                          )
                        )}
                      </span>
                    )
                  : streaming && (
                      // Waiting for the first words: three bouncing dots. Screen readers hear "typing".
                      <>
                        <span className="sr-only">{assistant.typing}</span>
                        <span aria-hidden className="typing-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                      </>
                    )}
            </Bubble>
          )
        })}
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-hairline px-6 pt-4">
        {chips.length > 0 && (
          // With the keyboard up the conversation gets the room; the chips return when the field lets go.
          <div className={cn("flex flex-wrap gap-2", typing && "max-md:hidden")}>
            {chips.map((c, i) => (
              <Button key={c} type="button" variant="line" dir="auto" className="h-auto min-h-11 animate-bubble px-3.5 py-2 text-left text-caption whitespace-normal" style={{ animationDelay: `${i * chipStagger}s` }} onClick={() => void send(c)}>
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
          // One pill: the field and the round send button share it, so every corner is concentric with the sheet's.
          className={cn(
            "flex items-center gap-2 rounded-pill border border-hairline bg-paper p-1.5 pl-5 transition-colors duration-(--duration-fast) focus-within:border-ink focus-within:bg-card focus-within:ring-3 focus-within:ring-ink/12",
            tooLong && "border-error ring-3 ring-error/15"
          )}
        >
          <Label htmlFor={`${ids}-q`} className="sr-only">
            {assistant.input}
          </Label>
          <Input
            id={`${ids}-q`}
            dir="auto"
            className="h-11 border-0 bg-transparent px-0 focus-visible:bg-transparent focus-visible:ring-0 aria-invalid:ring-0"
            autoComplete="off"
            enterKeyHint="send"
            placeholder={assistant.placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setTyping(true)}
            onBlur={() => setTyping(false)}
            disabled={atLimit}
            aria-invalid={tooLong}
            aria-describedby={tooLong ? `${ids}-err` : undefined}
          />
          <Button type="submit" variant="icon" size="md" aria-label={assistant.send} disabled={busy || atLimit || tooLong || !draft.trim()} className="bg-action text-on-action hover:bg-action-active">
            <Icon icon={ArrowUp} />
          </Button>
        </form>
        {tooLong && (
          <p id={`${ids}-err`} role="alert" className="text-body-sm text-error">
            {assistant.tooLong(MAX_INPUT)}
          </p>
        )}
      </div>
    </div>
  )
}

const inline = "inline cursor-pointer font-medium text-ink underline underline-offset-2 hover:no-underline disabled:cursor-default disabled:no-underline"

// WhatsApp-style buttons attached to the bottom of a bubble, each under a hairline.
const attached = "flex min-h-11 items-center justify-center gap-2 border-t border-hairline px-4 text-body-md font-medium text-ink hover:bg-concrete"

/** The shop's number inside a reply links to WhatsApp, the same way the inline links work: part of the sentence. */
function withPhoneLink(text: string) {
  const at = text.indexOf(site.phone.display)
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <a href={site.whatsapp.withText(assistant.whatsappText)} target="_blank" rel="noopener noreferrer" className={inline} onClick={() => track("chat_handoff", { action: "whatsapp" })} data-track="whatsapp" data-track-from="chat">
        {site.phone.display}
      </a>
      {text.slice(at + site.phone.display.length)}
    </>
  )
}

function Bubble({ role, children, footer, enter }: { role: Msg["role"]; children: React.ReactNode; footer?: React.ReactNode; enter?: boolean }) {
  return (
    <div
      dir="auto"
      className={cn(
        // shrink-0: in a scrolling flex column the bubbles must never squash to fit; the log scrolls instead.
        "max-w-5/6 shrink-0 overflow-hidden rounded-lg text-body-md wrap-anywhere",
        role === "user" ? "origin-bottom-right self-end bg-action text-on-action" : "origin-bottom-left self-start border border-hairline bg-card text-body",
        enter && "animate-bubble"
      )}
    >
      <div className="px-4 py-3 whitespace-pre-line">{children}</div>
      {footer}
    </div>
  )
}
