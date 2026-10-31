// Next's static export names a page's prefetch files "__next.<segment>.<segment>.txt", but on Windows its
// collectSegmentPaths() keeps the path separator, so they land as __next.<segment>/<segment>.txt and the client's
// requests 404. Rename them to the dotted names. Does nothing where the export is already right (Linux builds).
import { readdirSync, renameSync, rmSync } from "node:fs"
import { join, relative, sep } from "node:path"

const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]))
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, e.name)
    if (!e.isDirectory()) continue
    if (!e.name.startsWith("__next.")) { walk(path); continue }
    for (const f of files(path)) renameSync(f, join(dir, [e.name, ...relative(path, f).split(sep)].join(".")))
    rmSync(path, { recursive: true })
  }
}
walk("out")
// The kitchen sink is for `pnpm dev` only; robots.txt hides /dev/ from crawlers, so it must not ship at all.
rmSync("out/dev", { recursive: true, force: true })
rmSync("out/dev.html", { force: true })
rmSync("out/dev.txt", { force: true })
