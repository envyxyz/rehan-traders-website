import { ChatLauncher } from "@/components/chat-launcher"
import { Footer } from "@/components/footer"
import { Nav } from "@/components/nav"
import { StickyBar } from "@/components/sticky-bar"

/**
 * Site chrome for every public page. /dev pages sit outside this group and get none.
 * The page is a column at least one screen tall and `main` takes the spare height, so on a short page (or a zoomed-out
 * or very tall window) the footer sits at the bottom edge instead of ending mid-screen above bare body colour.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyBar />
      <ChatLauncher />
    </div>
  )
}
