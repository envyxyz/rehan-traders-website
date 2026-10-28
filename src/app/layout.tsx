import type { Metadata, Viewport } from "next"
import { Archivo, Inter } from "next/font/google"

import { MotionProvider, SmoothScroll } from "@/components/motion"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { seo, site } from "@/content"
import { themeColor } from "@/lib/tokens"
import "./globals.css"

// Variable fonts: one file each covers the weights in use (Archivo 500–800, Inter 400–600).
const archivo = Archivo({ subsets: ["latin"], display: "swap", variable: "--font-archivo" })
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.home.title, template: seo.titleTemplate },
  description: seo.home.description,
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: themeColor.dark },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <MotionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </MotionProvider>
        <Toaster />
        <SmoothScroll />
      </body>
    </html>
  )
}
