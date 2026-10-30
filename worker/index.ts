import { book, upload, type BookEnv } from "./book"
import { chat, type AiEnv } from "./chat"

/** Static files get their headers from public/_headers; the Worker's own answers get these. */
const secure = (res: Response) => {
  const out = new Response(res.body, res)
  out.headers.set("x-content-type-options", "nosniff")
  if (!out.headers.has("cache-control")) out.headers.set("cache-control", "no-store")
  return out
}

// Runs only for /api/* (wrangler.jsonc run_worker_first). Every other path is a static file from out/.
const worker = {
  async fetch(request: Request, env: BookEnv & AiEnv): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === "/api/book") return secure(await book(request, env))
    if (pathname === "/api/chat") return secure(await chat(request, env))
    if (pathname === "/api/upload") return secure(await upload(request, env))
    return secure(Response.json({ ok: false, error: "not_found" }, { status: 404 }))
  },
}

export default worker
