import type { Metadata } from "next"
import CategoryClient from "./client"
import { createBreadcrumbSchema } from "@/components/seo/structured-data"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  
  // Convert slug to display name
  const displayName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  return {
    title: `${displayName} | Community Forum | le Crochet`,
    description: `Explore ${displayName} discussions in the le Crochet community forum. Get help, share projects, and connect with fellow crocheters.`,
    keywords: [
      `${displayName} crochet`,
      "crochet community",
      "crochet forum",
      "crochet discussion",
      "pattern help",
      "crochet questions",
      "crochet support"
    ],
  }
}

// Breadcrumb structured data for category page
const breadcrumbSchema = (slug: string) => createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Forum", url: "/forum" },
  { name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), url: `/forum/category/${slug}` }
])

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(resolvedParams.slug))
        }}
      />
      <CategoryClient slug={resolvedParams.slug} />
    </>
  )
} 