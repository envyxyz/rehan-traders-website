"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { site, ui } from "@/content"

export function ToastDemo() {
  return (
    <Button variant="line" onClick={() => toast(ui.toastSent, { description: site.hours.oneLine })}>
      {ui.toastSent}
    </Button>
  )
}
