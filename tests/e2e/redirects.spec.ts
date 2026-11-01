import { expect, test } from "@playwright/test"

// The page moved from /estimate to /quote: public/_redirects, served by the static assets. Search results and shared links keep working.
test("/estimate redirects permanently to /quote and keeps the query", async ({ request }) => {
  for (const [from, to] of [
    ["/estimate", "/quote"],
    ["/estimate/", "/quote"],
    ["/estimate?tab=describe", "/quote?tab=describe"],
    ["/estimate?q=cracked", "/quote?q=cracked"],
  ]) {
    const res = await request.get(from, { maxRedirects: 0 })
    expect(res.status(), from).toBe(301)
    expect(new URL(res.headers().location, "http://x").pathname + new URL(res.headers().location, "http://x").search, from).toBe(to)
  }
  expect((await request.get("/quote")).status()).toBe(200)
})
