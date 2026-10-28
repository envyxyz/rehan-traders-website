"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

// Theme follows the device; our tokens already switch with prefers-color-scheme.
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="system"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-lg border border-hairline bg-card px-4 py-3.5 text-body-sm text-ink shadow-float",
          title: "font-display font-semibold",
          description: "text-steel",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
