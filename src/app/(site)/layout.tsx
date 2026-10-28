import { ChatLauncher } from "@/components/chat-launcher"
import { Footer } from "@/components/footer"
import { Nav } from "@/components/nav"
import { StickyBar } from "@/components/sticky-bar"

/** Site chrome for every public page. /dev pages sit outside this group and get none. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <StickyBar />
      <ChatLauncher />
    </>
  )
}
