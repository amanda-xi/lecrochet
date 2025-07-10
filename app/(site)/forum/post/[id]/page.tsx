import type { Metadata } from "next"
import PostClient from "./client"
import { createBreadcrumbSchema } from "@/components/seo/structured-data"

interface PostPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  // In a real app, you might want to fetch the post title for the metadata
  return {
    title: `Forum Discussion | Community Forum | le Crochet`,
    description: `Join the discussion in the le Crochet community forum. Share your thoughts, get help, and connect with fellow crocheters.`,
    keywords: [
      "crochet discussion",
      "crochet community",
      "crochet forum",
      "pattern help",
      "crochet questions",
      "crochet support",
      "community discussion"
    ],
  }
}

// Breadcrumb structured data for post page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Forum", url: "/forum" },
  { name: "Discussion", url: "#" }
])

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <PostClient postId={id} />
    </>
  )
} 