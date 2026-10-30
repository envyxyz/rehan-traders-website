import Link from "next/link"

import { Footer } from "@/components/footer"
import { Container, Section } from "@/components/layout"
import { Nav } from "@/components/nav"
import { Heading, Text } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { states } from "@/content"

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <Section className="flex min-h-svh flex-col justify-center pt-32 lg:pt-36">
          <Container className="text-center">
            <span aria-hidden className="block font-display text-display-xl font-extrabold text-signal tabular-nums">
              {states.notFound.code}
            </span>
            <Heading as="h1" size="display-lg" className="mt-4">
              {states.notFound.title}
            </Heading>
            <Text tone="muted" size="body-md" className="mx-auto mt-4 max-w-md">
              {states.notFound.lede}
            </Text>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" arrow>
                <Link href="/">{states.notFound.home}</Link>
              </Button>
              <Button asChild size="lg" variant="line">
                <Link href="/repairs">{states.notFound.repairs}</Link>
              </Button>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
