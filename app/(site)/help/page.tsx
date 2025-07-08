import type { Metadata } from "next";
import HelpPage from "./client";
import { createBreadcrumbSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Help Center | CrocheTeX Tutorials, Guides & Documentation | le Crochet",
  description: "Comprehensive help center with CrocheTeX tutorials, pattern creation guides, 3D visualization tips, troubleshooting help, and step-by-step documentation. Everything you need to master le Crochet platform and create stunning patterns with confidence.",
  
  keywords: [
    // Primary help keywords
    "CrocheTeX help",
    "crochet pattern tutorials",
    "le crochet documentation",
    "pattern creation guide",
    "help center",
    "user manual",
    
    // Tutorial categories
    "CrocheTeX syntax tutorial",
    "pattern coding tutorial",
    "3D visualization guide",
    "beginner CrocheTeX guide",
    "advanced pattern techniques",
    "step-by-step tutorials",
    
    // Feature help
    "how to use CrocheTeX",
    "pattern editor help",
    "3D preview tutorial",
    "export pattern guide",
    "marketplace seller guide",
    "collaboration features help",
    
    // Troubleshooting
    "pattern compilation errors",
    "troubleshooting guide",
    "common issues fixes",
    "error message help",
    "debugging patterns",
    "performance issues",
    
    // Learning resources
    "crochet pattern basics",
    "stitch library guide",
    "color theory tutorial",
    "gauge calculation help",
    "pattern sizing guide",
    "yarn substitution guide",
    
    // Video tutorials
    "video tutorials",
    "screen recordings",
    "walkthroughs",
    "demo videos",
    "live tutorials",
    "interactive guides",
    
    // Documentation types
    "API documentation",
    "feature documentation",
    "release notes",
    "changelog",
    "best practices guide",
    "tips and tricks",
    
    // Skill building
    "learn CrocheTeX",
    "pattern design course",
    "skill building resources",
    "practice exercises",
    "challenges and projects",
    "certification program"
  ],
  
  authors: [
    { name: "le Crochet Documentation Team" },
    { name: "Tutorial Creators" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Help Documentation, Tutorials, Learning Resources",
  classification: "Help Center, Educational Content, User Guides",
  
  alternates: {
    canonical: "/help",
    languages: {
      "en-US": "/help",
      "en-GB": "/en-gb/help",
      "fr": "/fr/help",
      "es": "/es/help"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Help Center",
    title: "Comprehensive Help Center | CrocheTeX Tutorials & Pattern Guides",
    description: "Master le Crochet with our extensive help center. CrocheTeX tutorials, pattern creation guides, troubleshooting help, and step-by-step documentation. From beginner basics to advanced techniques.",
    url: "/help",
    locale: "en_US",
    images: [
      {
        url: "/gallery/help-tutorials.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Help Center - Tutorials and Guides",
        type: "image/png"
      },
      {
        url: "/gallery/documentation.png",
        width: 1200,
        height: 630,
        alt: "CrocheTeX Documentation and Learning Resources",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Help Center | CrocheTeX Tutorials & Guides 📚🧶",
    description: "Master le Crochet with comprehensive tutorials! CrocheTeX guides, pattern tips, troubleshooting help & more. Everything you need to succeed! #CrocheTeXTutorials #PatternHelp #Learning",
    images: ["/gallery/help-tutorials.png"]
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
    // Help center metadata
    "help:articles": "100+",
    "help:videos": "50+",
    "help:categories": "15",
    "help:updated": "daily",
    
    // Content types
    "content:tutorials": "true",
    "content:documentation": "true",
    "content:videos": "true",
    "content:interactive": "true",
    
    // Schema.org help documentation
    "schema:HowTo": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "le Crochet Help Center",
      "description": "Comprehensive help and tutorial resources for CrocheTeX and pattern creation",
      "url": "https://lecrochet.online/help",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Help Topics",
        "numberOfItems": 100,
        "itemListElement": [
          {
            "@type": "HowTo",
            "name": "Getting Started with CrocheTeX"
          },
          {
            "@type": "HowTo", 
            "name": "Creating Your First Pattern"
          },
          {
            "@type": "HowTo",
            "name": "Understanding 3D Visualization"
          }
        ]
      }
    }),
    
    "schema:LearningResource": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "name": "CrocheTeX Learning Center",
      "description": "Complete learning resource for mastering pattern design with CrocheTeX",
      "educationalLevel": "Beginner to Advanced",
      "learningResourceType": "Tutorial",
      "teaches": ["CrocheTeX Programming", "Pattern Design", "3D Visualization"]
    })
  }
};

// Breadcrumb structured data for help page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Help Center", url: "/help" }
]);

export default function Help() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <HelpPage />
    </>
  );
} 