import { defineConfig, devices } from "@playwright/test"

// Runs against `pnpm preview` (the static export plus the Worker, as production runs it).
// Uses the installed Microsoft Edge, so no browser download is needed.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:8787", channel: "msedge", timezoneId: "Asia/Karachi" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Edge"], channel: "msedge" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "msedge" } },
  ],
  webServer: { command: "pnpm preview", url: "http://localhost:8787/book", reuseExistingServer: true, timeout: 300_000 },
})
