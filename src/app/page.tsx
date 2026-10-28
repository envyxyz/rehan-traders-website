import { Container, Section } from "@/components/layout"
import { Heading, Text } from "@/components/typography"
import { hero } from "@/content"

// ponytail: placeholder until the hero lands in Phase 3.
export default function Home() {
  return (
    <Section>
      <Container>
        <Heading as="h1" size="display-xl" rule>{hero.title}</Heading>
        <Text tone="muted" className="mt-4 max-w-prose">{hero.lede}</Text>
      </Container>
    </Section>
  )
}
