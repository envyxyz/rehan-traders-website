import type { AiEnv } from "../worker/chat"
import { estimate } from "../worker/estimate"

export const config = { runtime: "edge" }

export default function handler(request: Request) {
  return estimate(request, process.env as AiEnv)
}
