import { book, type BookEnv } from "../worker/book"

export const config = { runtime: "edge" }

export default function handler(request: Request) {
  return book(request, process.env as BookEnv)
}
