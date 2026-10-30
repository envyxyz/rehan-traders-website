import { book, upload, type BookEnv } from "./book"
import { chat, type AiEnv } from "./chat"
import { estimate } from "./estimate"

// Runs only for /api/* (wrangler.jsonc run_worker_first). Every other path is a static file from out/.
const worker = {
  async fetch(request: Request, env: BookEnv & AiEnv): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === "/api/book") return book(request, env)
    if (pathname === "/api/chat") return chat(request, env)
    if (pathname === "/api/estimate") return estimate(request, env)
    if (pathname === "/api/upload") return upload(request, env)
    return Response.json({ ok: false, error: "not_found" }, { status: 404 })
  },
}

export default worker
