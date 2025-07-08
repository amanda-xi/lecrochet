import type { Metadata } from "next";
import ForumPage from "./client";
import { createBreadcrumbSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Crochet Community Forum | Help, Tips & Pattern Discussions | le Crochet",
  description: "Join our vibrant crochet community forum! Get help with patterns, share tips and techniques, discuss CrocheTeX coding, showcase your projects, and connect with fellow crocheters worldwide. Expert advice and friendly support available 24/7.",
  
  keywords: [
    // Primary forum keywords
    "crochet community forum",
    "crochet help forum",
    "pattern discussion forum",
    "crochet support community",
    "CrocheTeX help forum",
    "crochet advice forum",
    
    // Help and support
    "crochet pattern help",
    "CrocheTeX coding help",
    "stitch technique help",
    "pattern troubleshooting",
    "beginner crochet help",
    "advanced crochet support",
    "pattern debugging help",
    
    // Discussion topics
    "crochet technique discussions",
    "yarn recommendations",
    "hook size advice",
    "color theory crochet",
    "gauge discussions",
    "pattern modifications",
    "design inspiration sharing",
    
    // Community features
    "crochet project sharing",
    "finished object showcase",
    "work in progress sharing",
    "pattern challenges",
    "crochet competitions",
    "skill building community",
    
    // Learning and education
    "crochet tutorials forum",
    "technique explanations",
    "video tutorials sharing",
    "learning resources",
    "skill development",
    "expert tips sharing",
    
    // Platform specific
    "CrocheTeX syntax help",
    "3D visualization questions",
    "platform feature discussions",
    "bug reports forum",
    "feature requests",
    "user feedback",
    
    // Problem solving
    "pattern error fixes",
    "compilation issues",
    "export problems",
    "technical support",
    "account help",
    "troubleshooting guide",
    
    // Social aspects
    "crochet friends",
    "crafting community",
    "maker network",
    "fiber arts forum",
    "handmade community",
    "creative support group"
  ],
  
  authors: [
    { name: "le Crochet Community Moderators" },
    { name: "Expert Contributors" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Community Forum, Support, Discussion",
  classification: "Online Community, Help Center, User Forum",
  
  alternates: {
    canonical: "/forum",
    languages: {
      "en-US": "/forum",
      "en-GB": "/en-gb/forum",
      "fr": "/fr/forum",
      "es": "/es/forum"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Community Forum",
    title: "Vibrant Crochet Community Forum | Help, Tips & Pattern Discussions",
    description: "Join thousands of crocheters sharing knowledge, getting help, and discussing patterns. Expert advice, friendly support, and inspiring conversations about all things crochet. Your go-to place for CrocheTeX and pattern design help.",
    url: "/forum",
    locale: "en_US",
    images: [
      {
        url: "/gallery/forum-community.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Community Forum - Help and Discussions",
        type: "image/png"
      },
      {
        url: "/gallery/forum-discussions.png",
        width: 1200,
        height: 630,
        alt: "Active Forum Discussions and Pattern Help",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Crochet Community Forum | Help & Discussions 💬🧶",
    description: "Join our amazing crochet community! Get help with patterns, share tips, discuss CrocheTeX coding & connect with fellow makers worldwide. #CrochetCommunity #CrochetHelp #PatternHelp",
    images: ["/gallery/forum-community.png"]
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
  },
  
  other: {
    // Forum specific metadata
    "forum:type": "Community Discussion",
    "forum:members": "10000+",
    "forum:posts": "50000+",
    "forum:active": "true",
    
    // Community metadata
    "community:size": "Large",
    "community:activity": "High",
    "community:moderated": "true",
    
    // Schema.org hints for forum
    "schema:DiscussionForumPosting": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "le Crochet Community Forum",
      "description": "Community forum for crochet patterns, techniques, and CrocheTeX help",
      "url": "https://lecrochet.online/forum",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lecrochet.online/forum/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }),
    
    "schema:Organization": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "le Crochet Community",
      "description": "Supportive community of crochet enthusiasts and pattern designers",
      "memberOf": {
        "@type": "Organization",
        "name": "le Crochet Platform"
      }
    })
  }
};

// Breadcrumb structured data for forum page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Community Forum", url: "/forum" }
]);

export default function Forum() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <ForumPage />
    </>
  );
} 