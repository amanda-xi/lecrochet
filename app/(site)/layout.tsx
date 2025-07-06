import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <SpeedInsights />
      <Analytics />
      <Footer />
    </>
  );
} 