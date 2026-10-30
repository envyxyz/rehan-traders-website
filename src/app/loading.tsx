import { Container, Section } from "@/components/layout"
import { states } from "@/content"

export default function Loading() {
  return (
    <Section className="flex min-h-svh flex-col justify-center pt-32 lg:pt-36">
      <Container className="text-center">
        <div aria-hidden className="mx-auto size-10 animate-spin rounded-full border-2 border-concrete border-t-signal" />
        <p className="mt-4 font-display text-body-sm font-semibold text-steel">
          {states.loading.text}
        </p>
      </Container>
    </Section>
  )
}
