import type { Metadata, Viewport } from "next"
import { Google_Sans_Flex } from "next/font/google"

import { GoogleTagManager } from "@/components/gtm"
import { MotionProvider, SmoothScroll } from "@/components/motion"
import { seo, site } from "@/content"
import { themeColor } from "@/lib/tokens"
import "./globals.css"

// The site's one Google tag. GA4 (and any other Google tag) is set up inside this GTM container, not in code.
const gtmId = "GTM-TBXL7JMX"

// One variable family for headlines and body (weights 400–800). The opsz axis tightens
// large headlines and opens small text automatically (font-optical-sizing: auto).
const googleSans = Google_Sans_Flex({ subsets: ["latin"], display: "swap", axes: ["opsz"], variable: "--font-google-sans" })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.home.title, template: seo.titleTemplate },
  description: seo.home.description,
  // Pages replace these whole (see lib/page-meta.ts); they carry the same siteName, type and locale.
  openGraph: { siteName: site.name, type: "website", locale: "en_PK", title: seo.home.title, description: seo.home.description },
  twitter: { card: "summary_large_image", title: seo.home.title, description: seo.home.description },
  alternates: {
    types: {
      // Discoverable link for AI crawlers (per AgentReady spec).
      // Emits: <link rel="alternate" type="text/plain" href="…/llms.txt" />
      "text/plain": "/llms.txt",
    },
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  // Android shrinks the page for the keyboard; iOS ignores this, and SheetContent follows visualViewport there.
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: themeColor.dark },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={googleSans.variable}>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <SmoothScroll />
        <GoogleTagManager gtmId={gtmId} />
      </body>
    </html>
  )
}
