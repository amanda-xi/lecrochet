import type { Metadata } from "next"
import NewPostClient from "./client"
import { createBreadcrumbSchema } from "@/components/seo/structured-data"

export const metadata: Metadata = {
  title: "New Discussion | Community Forum | le Crochet",
  description: "Start a new discussion in the le Crochet community forum. Share your projects, ask questions, and connect with fellow crocheters.",
  keywords: [
    "new crochet discussion",
    "crochet community",
    "crochet forum",
    "start discussion",
    "crochet questions",
    "pattern help",
    "share crochet project"
  ],
}

// Breadcrumb structured data for new post page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Forum", url: "/forum" },
  { name: "New Discussion", url: "/forum/new-post" }
])

export default function NewPostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <NewPostClient />
    </>
  )
} 