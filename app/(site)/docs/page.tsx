import type { Metadata } from "next"
import DocsClient from "./client"
import { createBreadcrumbSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Documentation | CrocheTeX API, Developer Guides & Technical Reference | le Crochet",
  description: "Complete technical documentation for le Crochet platform. CrocheTeX language reference, API documentation, developer guides, integration tutorials, and comprehensive technical specifications for building with our platform.",
  
  keywords: [
    // Primary documentation keywords
    "CrocheTeX documentation",
    "API documentation",
    "developer guide",
    "technical reference",
    "integration guide",
    "platform documentation",
    
    // CrocheTeX language
    "CrocheTeX syntax",
    "CrocheTeX language reference",
    "pattern language docs",
    "stitch notation guide",
    "code examples",
    "syntax highlighting",
    
    // API and integration
    "REST API documentation",
    "API endpoints",
    "authentication guide",
    "SDK documentation",
    "webhook documentation",
    "rate limiting",
    
    // Developer resources
    "getting started guide",
    "quick start tutorial",
    "code samples",
    "example projects",
    "best practices",
    "troubleshooting guide",
    
    // Technical specifications
    "architecture overview",
    "system requirements",
    "performance specifications",
    "security guidelines",
    "deployment guide",
    "configuration options",
    
    // Integration types
    "third-party integrations",
    "plugin development",
    "custom extensions",
    "marketplace integration",
    "export formats",
    "import specifications",
    
    // Advanced topics
    "compiler architecture",
    "3D rendering engine",
    "pattern optimization",
    "algorithm documentation",
    "data structures",
    "rendering pipeline",
    
    // Platform features
    "feature documentation",
    "component library",
    "UI framework",
    "theming guide",
    "localization support",
    "accessibility features",
    
    // Version information
    "changelog",
    "release notes",
    "version history",
    "migration guide",
    "breaking changes",
    "deprecation notices"
  ],
  
  authors: [
    { name: "le Crochet Engineering Team" },
    { name: "Technical Writers" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Technical Documentation, Developer Resources, API Reference",
  classification: "Documentation, Technical Guides, Developer Tools",
  
  alternates: {
    canonical: "/docs",
    languages: {
      "en-US": "/docs",
      "en-GB": "/en-gb/docs",
      "fr": "/fr/docs",
      "es": "/es/docs"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Documentation",
    title: "Complete Technical Documentation | CrocheTeX API & Developer Guides",
    description: "Comprehensive documentation for developers and integrators. CrocheTeX language reference, API docs, integration guides, and technical specifications. Everything you need to build with le Crochet.",
    url: "/docs",
    locale: "en_US",
    images: [
      {
        url: "/gallery/docs-overview.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Technical Documentation - API and Developer Guides",
        type: "image/png"
      },
      {
        url: "/gallery/api-reference.png",
        width: 1200,
        height: 630,
        alt: "CrocheTeX API Documentation and Code Examples",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Technical Documentation | CrocheTeX API & Dev Guides 🛠️📚",
    description: "Comprehensive docs for developers! CrocheTeX language reference, API docs, integration guides & technical specs. Build amazing things! #CrocheTeX #API #DevDocs #Documentation",
    images: ["/gallery/docs-overview.png"]
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
    // Documentation metadata
    "docs:version": "2.0",
    "docs:last_updated": "2024-01-01",
    "docs:sections": "25",
    "docs:pages": "200+",
    
    // Technical metadata
    "api:version": "v2",
    "api:format": "REST",
    "api:authentication": "OAuth2",
    "api:rate_limit": "1000/hour",
    
    // Schema.org technical documentation
    "schema:TechArticle": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "le Crochet Technical Documentation",
      "description": "Comprehensive technical documentation and API reference for le Crochet platform",
      "author": {
        "@type": "Organization",
        "name": "le Crochet Engineering Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "le Crochet Inc."
      },
      "dateModified": "2024-01-01",
      "about": "Software Documentation"
    }),
    
    "schema:SoftwareSourceCode": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "name": "CrocheTeX Language Specification",
      "description": "Complete language specification and documentation for CrocheTeX pattern language",
      "programmingLanguage": "CrocheTeX",
      "runtimePlatform": "Web Browser",
      "codeRepository": "https://github.com/lecrochet/crochetex"
    }),
    
    "schema:APIReference": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebAPI",
      "name": "le Crochet API",
      "description": "RESTful API for integrating with le Crochet platform",
      "documentation": "https://lecrochet.online/docs/api",
      "termsOfService": "https://lecrochet.online/terms"
    })
  }
};

// Breadcrumb structured data for docs page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Documentation", url: "/docs" }
]);

export default function Docs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <DocsClient />
    </>
  );
} 