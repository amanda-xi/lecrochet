import type { Metadata } from "next";
import MarketplaceMorePage from "./client";
import { createBreadcrumbSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
    title: "Marketplace | Le Crochet",
    description: "Sell your patterns or discover unique designs from creators worldwide in our integrated marketplace.",
};

// Breadcrumb structured data for marketplace/more page showing proper hierarchy
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Marketplace", url: "/marketplace" },
  { name: "More Patterns", url: "/marketplace/more" }
]);

export default function MarketplaceMore() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <MarketplaceMorePage />
    </>
  );
} 