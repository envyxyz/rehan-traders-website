import { ChatLauncher } from "@/components/chat-launcher"
import { Footer } from "@/components/footer"
import { LinkTracker } from "@/components/link-tracker"
import { Nav } from "@/components/nav"
import { StickyBar } from "@/components/sticky-bar"
import { ui } from "@/content"

/**
 * Site chrome for every public page. /dev pages sit outside this group and get none.
 * The page is a column at least one screen tall and `main` takes the spare height, so on a short page (or a zoomed-out
 * or very tall window) the footer sits at the bottom edge instead of ending mid-screen above bare body colour.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-pill focus:bg-card focus:px-4.5 focus:font-display focus:text-nav focus:text-ink focus:shadow-float"
      >
        {ui.skipToContent}
      </a>
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyBar />
      <ChatLauncher />
      <LinkTracker />
    </div>
  )
}
