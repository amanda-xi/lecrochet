import type { Metadata } from "next";
import { Suspense } from "react";
import CreatePageClient from "./client";
import { createBreadcrumbSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Create Crochet Pattern | le Crochet",
  description: "Create beautiful crochet patterns using CrocheTeX - our intuitive pattern language. Write patterns in code and see them render in real-time with 2D and 3D previews.",
  keywords: [
    "crochet pattern creator",
    "CrocheTeX",
    "crochet pattern editor",
    "crochet diagram",
    "pattern visualization",
    "crochet design tool",
    "interactive crochet patterns",
    "crochet programming"
  ],
  authors: [{ name: "le Crochet Team" }],
  creator: "le Crochet",
  publisher: "le Crochet",
  openGraph: {
    title: "Create Crochet Pattern | le Crochet",
    description: "Create beautiful crochet patterns using CrocheTeX - our intuitive pattern language. Write patterns in code and see them render in real-time.",
    url: "/create",
    siteName: "le Crochet",
    type: "website",
    images: [
      {
        url: "/gallery/01.png",
        width: 1200,
        height: 630,
        alt: "Crochet pattern creation interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Crochet Pattern | le Crochet",
    description: "Create beautiful crochet patterns using CrocheTeX - our intuitive pattern language.",
    images: ["/gallery/01.png"]
  },
  alternates: {
    canonical: "/create"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

// Breadcrumb structured data for create page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Pattern Creator", url: "/create" }
]);

export default function CreatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-gray-500">Loading pattern editor...</div></div>}>
        <CreatePageClient />
      </Suspense>
    </>
  );
}
