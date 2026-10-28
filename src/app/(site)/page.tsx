import { CtaBand } from "@/components/cta-band"
import { Hero } from "@/components/hero"

// ponytail: sections 2 to 8 of PRD §5 land in Phase 4, between the hero and the CTA band.
export default function Home() {
  return (
    <>
      <Hero />
      <CtaBand />
    </>
  )
}
