import { Container, Section } from "@/components/layout"
import { Heading, Linked, Text } from "@/components/typography"
import type { InlineLink } from "@/content"

type Content = {
  title: string
  lede: string
  steps: readonly { title: string; text: string }[]
  notes: readonly { text: string; link: InlineLink }[]
  faqTitle: string
  faq: readonly { q: string; a: string; link?: InlineLink }[]
}

/** Plain, always-visible text under a form page: numbered steps, short notes with links, and the questions answered. */
export function AfterForm({ c }: { c: Content }) {
  return (
    <Section tone="panel">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Heading>{c.title}</Heading>
          <Text tone="muted" className="mt-4 max-w-120">
            {c.lede}
          </Text>
          <ol className="mt-8 border-t border-hairline">
            {c.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 border-b border-hairline py-5">
                <span aria-hidden className="font-display text-title-md text-steel tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-title-md text-ink">{step.title}</h3>
                  <Text className="mt-1.5">{step.text}</Text>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-3">
            {c.notes.map((n) => (
              <Text key={n.text} size="body-sm" tone="muted">
                <Linked link={n.link}>{n.text}</Linked>
              </Text>
            ))}
          </div>
        </div>
        <div>
          <Heading as="h2" size="display-md">
            {c.faqTitle}
          </Heading>
          <dl className="mt-6 border-t border-hairline">
            {c.faq.map((f) => (
              <div key={f.q} className="border-b border-hairline py-5">
                <dt className="font-display text-title-md text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-body-md text-body">
                  <Linked link={f.link}>{f.a}</Linked>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  )
}
