import type { Metadata, Viewport } from "next"
import { Google_Sans_Flex } from "next/font/google"

import { GoogleTagManager } from "@/components/gtm"
import { SmoothScroll } from "@/components/motion"
import { seo, site } from "@/content"
import { themeColor } from "@/lib/tokens"
import "./globals.css"

// The site's one Google tag. GA4 (and any other Google tag) is set up inside this GTM container, not in code.
const gtmId = "GTM-TBXL7JMX"
// Before the page is live, a page that opens part way down (a reload, a back) would show the desktop bar over its content
// until nav.tsx paints the island. This marks <html> while scrolled, and globals.css keeps the header out of sight until then.
const scrolledFlag = `(()=>{const d=document.documentElement,f=()=>d.dataset.nav?removeEventListener("scroll",f):d.toggleAttribute("data-scrolled",scrollY>80);addEventListener("scroll",f,{passive:true});f()})()`

// One variable family for headlines and body (weights 400–800). No opsz axis: it nearly doubled the file on slow data.
const googleSans = Google_Sans_Flex({ subsets: ["latin"], display: "swap", variable: "--font-google-sans" })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.home.title, template: seo.titleTemplate },
  description: seo.home.description,
  // Stable URLs in public/. Google's favicon crawler takes the PNG (a multiple of 48px); browsers take the SVG, which is
  // transparent and turns light in dark mode. Listing favicon.ico with a 16 or 32 size would make Chrome pick it over
  // the SVG, so it is not listed: it stays at /favicon.ico for clients that ask for that path. None of these may live in
  // src/app: one icon file there replaces this whole list.
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
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
    <html lang="en" className={googleSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scrolledFlag }} />
      </head>
      <body>
        {children}
        <SmoothScroll />
        <GoogleTagManager gtmId={gtmId} />
      </body>
    </html>
  )
}
