import { upload, type BookEnv } from "../worker/book"

export const config = { runtime: "edge" }

export default function handler(request: Request) {
  return upload(request, process.env as BookEnv)
}
