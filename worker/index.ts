import { book, type BookEnv } from "./book"

// Runs only for /api/* (wrangler.jsonc run_worker_first). Every other path is a static file from out/.
// Phase 6 adds /api/chat and /api/estimate here.
const worker = {
  async fetch(request: Request, env: BookEnv): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === "/api/book") return book(request, env)
    return Response.json({ ok: false, error: "not_found" }, { status: 404 })
  },
}

export default worker
