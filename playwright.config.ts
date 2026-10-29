import { defineConfig, devices } from "@playwright/test"

// Runs against `pnpm preview` (the static export plus the Worker, as production runs it).
// Uses the installed Microsoft Edge, so no browser download is needed.
// E2E_PORT runs it beside another checkout's `pnpm preview` on 8787 (parallel phase worktrees).
const port = process.env.E2E_PORT ?? "8787"
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://localhost:${port}`, channel: "msedge", timezoneId: "Asia/Karachi" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Edge"], channel: "msedge" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "msedge" } },
  ],
  webServer: { command: `pnpm build && wrangler dev --port ${port}`, url: `http://localhost:${port}/book`, reuseExistingServer: true, timeout: 300_000 },
})
