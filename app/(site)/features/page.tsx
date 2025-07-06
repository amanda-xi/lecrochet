import type { Metadata } from "next";
import FeaturesPage from "./client";

export const metadata: Metadata = {
  title: "Platform Features | CrocheTeX Editor, 3D Visualization & More | le Crochet",
  description: "Discover powerful features of le Crochet platform: intuitive CrocheTeX pattern language, real-time 3D visualization, collaborative editing, pattern marketplace, and comprehensive stitch library. Perfect for beginners and professional designers.",
  
  keywords: [
    // Core platform features
    "CrocheTeX pattern language",
    "crochet pattern editor",
    "3D crochet visualization",
    "real-time pattern preview",
    "interactive crochet editor",
    "pattern compiler features",
    
    // Advanced features
    "collaborative pattern editing",
    "pattern version control",
    "multi-format export",
    "pattern testing tools",
    "automatic error detection",
    "stitch counting features",
    
    // Visual features
    "3D pattern renderer",
    "zoom and pan visualization",
    "color customization",
    "texture mapping",
    "realistic yarn rendering",
    "pattern animation",
    
    // Code editor features
    "syntax highlighting",
    "auto-completion",
    "code folding",
    "bracket matching",
    "error highlighting",
    "intelligent suggestions",
    
    // Professional features
    "pattern optimization",
    "performance analysis", 
    "complexity metrics",
    "size calculations",
    "yarn requirements",
    "time estimations",
    
    // Collaboration features
    "team pattern editing",
    "real-time collaboration",
    "comment system",
    "review workflows",
    "shared workspaces",
    "designer tools",
    
    // Export features
    "PDF pattern export",
    "SVG diagram export",
    "PNG image export",
    "printable patterns",
    "mobile-friendly formats",
    "social media sharing",
    
    // Library features
    "comprehensive stitch library",
    "custom stitch creation",
    "pattern templates",
    "example gallery",
    "tutorial integration",
    "help documentation"
  ],
  
  authors: [
    { name: "le Crochet Development Team" },
    { name: "Platform Architects" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Software Features, Platform Capabilities, Design Tools",
  classification: "Feature Documentation, Platform Overview, Technical Specifications",
  
  alternates: {
    canonical: "/features",
    languages: {
      "en-US": "/features",
      "en-GB": "/en-gb/features",
      "fr": "/fr/features",
      "es": "/es/features"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Features",
    title: "Powerful Platform Features | CrocheTeX Editor & 3D Visualization | le Crochet",
    description: "Explore le Crochet's comprehensive feature set: intuitive pattern language, real-time 3D visualization, collaborative editing, professional export options, and extensive stitch library. Everything you need for professional pattern design.",
    url: "/features",
    locale: "en_US",
    images: [
      {
        url: "/gallery/features-overview.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Platform Features Overview - CrocheTeX Editor and 3D Visualization",
        type: "image/png"
      },
      {
        url: "/gallery/editor-screenshot.png",
        width: 1200,
        height: 630,
        alt: "CrocheTeX Code Editor with Syntax Highlighting",
        type: "image/png"
      },
      {
        url: "/gallery/3d-preview.png",
        width: 1200,
        height: 630,
        alt: "Real-time 3D Pattern Visualization",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Powerful Crochet Design Features | CrocheTeX & 3D Visualization ⚡🧶",
    description: "Discover le Crochet's amazing features: intuitive pattern language, real-time 3D preview, collaboration tools & more! Perfect for designers. #CrocheTeX #PatternDesign #3DVisualization",
    images: ["/gallery/features-overview.png"]
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
    // Technical specifications
    "platform:version": "2.0",
    "platform:compatibility": "Web Browser",
    "platform:requirements": "Modern Browser",
    
    // Feature metadata
    "features:count": "50+",
    "features:category": "Design Tools",
    "features:type": "Professional",
    
    // Schema.org hints for software features
    "schema:SoftwareApplication": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "le Crochet Pattern Designer",
      "description": "Professional crochet pattern design platform with CrocheTeX language and 3D visualization",
      "category": "DesignApplication",
      "operatingSystem": "Web Browser",
      "featureList": [
        "CrocheTeX Pattern Language",
        "Real-time 3D Visualization",
        "Collaborative Editing",
        "Pattern Marketplace",
        "Multi-format Export",
        "Comprehensive Stitch Library",
        "Automatic Error Detection",
        "Professional Design Tools"
      ],
      "screenshot": "https://lecrochet.com/gallery/features-overview.png"
    }),
    
    "schema:TechArticle": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "le Crochet Platform Features",
      "description": "Comprehensive overview of le Crochet's professional pattern design features",
      "author": {
        "@type": "Organization",
        "name": "le Crochet Team"
      },
      "about": "Pattern Design Software Features"
    })
  }
};

export default function Features() {
    return <FeaturesPage />;
} 