import { Metadata } from "next"
import CrochetPlatformClient from "./client"

// Comprehensive SEO configuration for the homepage
export const metadata: Metadata = {
  title: {
    default: "le Crochet - Revolutionary Crochet Pattern Designer & Builder Platform",
    template: "%s | le Crochet"
  },
  description: "Create stunning crochet patterns with le Crochet's revolutionary CrocheTeX platform. Design, visualize in 3D, and share beautiful patterns with our intuitive pattern builder. From simple scarves to complex amigurumi - bring your crochet vision to life instantly.",
  
  // Comprehensive keyword optimization
  keywords: [
    // Primary keywords
    "crochet pattern designer",
    "crochet pattern builder",
    "crochet pattern creator",
    "CrocheTeX",
    "crochet pattern maker",
    
    // Pattern types
    "amigurumi pattern designer",
    "granny square patterns",
    "circular crochet patterns", 
    "linear crochet patterns",
    "crochet diagram maker",
    "crochet chart creator",
    
    // Features
    "3D crochet visualization",
    "real-time pattern preview",
    "interactive crochet designer",
    "crochet pattern compiler",
    "visual crochet editor",
    "crochet symbol library",
    
    // User intent
    "how to design crochet patterns",
    "crochet pattern software",
    "digital crochet patterns",
    "crochet pattern templates",
    "professional crochet design",
    "crochet business tools",
    
    // Related crafts
    "fiber arts designer",
    "yarn craft patterns",
    "handmade pattern creator",
    "DIY crochet tools",
    
    // Technical terms
    "pattern visualization software",
    "textile design platform",
    "craft pattern generator",
    "stitch diagram creator",
    "pattern development tools",
    
    // Community aspects
    "crochet community platform",
    "share crochet patterns",
    "crochet marketplace",
    "pattern collaboration tools"
  ],
  
  // Author and publisher information
  authors: [
    { name: "le Crochet Team", url: "https://lecrochet.com/about" },
    { name: "Pattern Design Experts" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  // Content classification
  category: "Crafts & Design Software",
  classification: "Design Tools, Crafts, Fiber Arts, Pattern Making",
  
  // URL and canonical settings
  metadataBase: new URL("https://lecrochet.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-GB": "/en-gb",
      "fr": "/fr",
      "es": "/es",
      "de": "/de"
    }
  },
  
  // Open Graph optimization for social sharing
  openGraph: {
    type: "website",
    siteName: "le Crochet - Crochet Pattern Designer",
    title: "le Crochet - Revolutionary Crochet Pattern Designer & 3D Visualization Platform",
    description: "Design stunning crochet patterns with our intuitive CrocheTeX platform. Create amigurumi, granny squares, and complex patterns with real-time 3D visualization. Join thousands of creators bringing their crochet visions to life.",
    url: "/",
    locale: "en_US",
    countryName: "United States",
    images: [
      {
        url: "/gallery/01.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Pattern Designer - Create Beautiful Crochet Patterns",
        type: "image/png"
      },
      {
        url: "/gallery/02.png", 
        width: 1200,
        height: 630,
        alt: "3D Crochet Pattern Visualization - le Crochet Platform",
        type: "image/png"
      },
      {
        url: "/gallery/03.png",
        width: 1200, 
        height: 630,
        alt: "CrocheTeX Code Editor - Intuitive Pattern Design",
        type: "image/png"
      },
      {
        url: "/yarn.gif",
        width: 800,
        height: 600,
        alt: "Animated crochet creation process - le Crochet demo",
        type: "image/gif"
      }
    ],
    videos: [
      {
        url: "/yarn.mov",
        width: 1920,
        height: 1080,
        type: "video/quicktime"
      }
    ]
  },
  
  // Twitter Card optimization
  twitter: {
    card: "summary_large_image",
    site: "@lecrochet",
    creator: "@lecrochet", 
    title: "le Crochet - Revolutionary Crochet Pattern Designer & 3D Visualization",
    description: "Design stunning crochet patterns with intuitive CrocheTeX platform. Create amigurumi, granny squares & complex patterns with real-time 3D visualization. Join thousands of creators! 🧶✨",
    images: {
      url: "/gallery/01.png",
      alt: "le Crochet Pattern Designer - Create Beautiful Crochet Patterns"
    }
  },
  
  // Advanced robot directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  
  // Verification codes for major search engines
  verification: {
    google: "lecrochet-google-verification-2024",
    yandex: "lecrochet-yandex-verification-2024", 
    yahoo: "lecrochet-yahoo-verification-2024"
  },
  
  // App-specific metadata
  appleWebApp: {
    capable: true,
    title: "le Crochet Designer",
    statusBarStyle: "default",
    startupImage: [
      {
        url: "/gallery/01.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  },
  
  // Format detection settings
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
    date: false,
    url: false
  },
  
  // Additional structured metadata
  other: {
    // Business information
    "business:contact_data:street_address": "123 Craft Street",
    "business:contact_data:locality": "Design City", 
    "business:contact_data:region": "CA",
    "business:contact_data:postal_code": "90210",
    "business:contact_data:country_name": "United States",
    
    // App store information  
    "al:ios:app_store_id": "lecrochet-ios-app",
    "al:android:package": "com.lecrochet.android",
    "al:web:url": "https://lecrochet.com",
    
    // Pricing and availability
    "product:price:amount": "0.00",
    "product:price:currency": "USD",
    "product:availability": "instock",
    
    // Content rating
    "rating": "general",
    "target_audience": "crafters, designers, artists, hobbyists",
    
    // Technical specifications
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "black-translucent",
    "application-name": "le Crochet",
    
    // Schema.org structured data hints
    "schema:WebSite": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "le Crochet",
      "description": "Revolutionary crochet pattern designer and builder platform",
      "url": "https://lecrochet.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lecrochet.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }),
    
    "schema:Organization": JSON.stringify({
      "@context": "https://schema.org", 
      "@type": "Organization",
      "name": "le Crochet",
      "description": "Leading platform for crochet pattern design and visualization",
      "url": "https://lecrochet.com",
      "logo": "https://lecrochet.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Spanish", "French"]
      }
    }),
    
    "schema:SoftwareApplication": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication", 
      "name": "le Crochet Pattern Designer",
      "description": "Professional crochet pattern design software with 3D visualization",
      "category": "DesignApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })
  },
  
  // Manifest reference
  manifest: "/manifest.json",
  
  // Archive and referrer settings
  referrer: "origin-when-cross-origin",
  archives: ["https://lecrochet.com/archive"],
  
  // Booking and app linking
  bookmarks: "https://lecrochet.com/bookmarks",
  
  // Icon configurations
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico"
  }
}

// JSON-LD structured data for enhanced SEO
const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://lecrochet.com/#website",
      "url": "https://lecrochet.com/",
      "name": "le Crochet",
      "description": "Revolutionary crochet pattern designer and builder platform with 3D visualization",
      "publisher": {
        "@id": "https://lecrochet.com/#organization"
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://lecrochet.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": "en-US"
    },
    {
      "@type": "Organization",
      "@id": "https://lecrochet.com/#organization", 
      "name": "le Crochet",
      "url": "https://lecrochet.com/",
      "logo": {
        "@type": "ImageObject",
        "inLanguage": "en-US",
        "@id": "https://lecrochet.com/#/schema/logo/image/",
        "url": "https://lecrochet.com/logo.png",
        "contentUrl": "https://lecrochet.com/logo.png",
        "width": 512,
        "height": 512,
        "caption": "le Crochet"
      },
      "image": {
        "@id": "https://lecrochet.com/#/schema/logo/image/"
      },
      "sameAs": [
        "https://twitter.com/lecrochet",
        "https://facebook.com/lecrochet",
        "https://instagram.com/lecrochet"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://lecrochet.com/#webpage",
      "url": "https://lecrochet.com/",
      "name": "le Crochet - Revolutionary Crochet Pattern Designer & Builder Platform",
      "isPartOf": {
        "@id": "https://lecrochet.com/#website"
      },
      "about": {
        "@id": "https://lecrochet.com/#organization"
      },
      "description": "Create stunning crochet patterns with le Crochet's revolutionary CrocheTeX platform. Design, visualize in 3D, and share beautiful patterns with our intuitive pattern builder.",
      "breadcrumb": {
        "@id": "https://lecrochet.com/#breadcrumb"
      },
      "inLanguage": "en-US",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": ["https://lecrochet.com/"]
        }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "le Crochet Pattern Designer",
      "operatingSystem": "Web Browser",
      "category": "DesignApplication",
      "description": "Professional crochet pattern design software with real-time 3D visualization and CrocheTeX coding language",
      "screenshot": "https://lecrochet.com/gallery/01.png",
      "featureList": [
        "CrocheTeX Pattern Language",
        "Real-time 3D Visualization", 
        "Interactive Pattern Editor",
        "Pattern Marketplace",
        "Collaborative Design Tools",
        "Export to Multiple Formats"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdData)
        }}
      />
      <CrochetPlatformClient />
    </>
  )
}