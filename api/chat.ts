import { chat, type AiEnv } from "../worker/chat"

export const config = { runtime: "edge" }

export default function handler(request: Request) {
  return chat(request, process.env as AiEnv)
}
