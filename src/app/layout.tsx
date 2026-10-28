import type { Metadata, Viewport } from "next"
import { Google_Sans_Flex } from "next/font/google"

import { MotionProvider, SmoothScroll } from "@/components/motion"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { seo, site } from "@/content"
import { themeColor } from "@/lib/tokens"
import "./globals.css"

// One variable family for headlines and body (weights 400–800). The opsz axis tightens
// large headlines and opens small text automatically (font-optical-sizing: auto).
const googleSans = Google_Sans_Flex({ subsets: ["latin"], display: "swap", axes: ["opsz"], variable: "--font-google-sans" })

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
    <html lang="en" className={googleSans.variable}>
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
