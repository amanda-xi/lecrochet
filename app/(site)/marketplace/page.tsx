import type { Metadata } from "next";
import MarketplacePage from "./client";
import { createBreadcrumbSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Crochet Pattern Marketplace | Buy & Sell Patterns | le Crochet",
  description: "Discover and purchase unique crochet patterns from talented designers worldwide. Sell your own creations in our thriving marketplace. From beginner-friendly tutorials to advanced amigurumi patterns - find your next project or monetize your designs.",
  
  keywords: [
    // Primary marketplace keywords
    "crochet pattern marketplace",
    "buy crochet patterns",
    "sell crochet patterns", 
    "crochet patterns for sale",
    "premium crochet patterns",
    "digital crochet patterns",
    
    // Pattern types for sale
    "amigurumi patterns marketplace",
    "granny square patterns shop",
    "baby crochet patterns",
    "blanket crochet patterns",
    "scarf crochet patterns",
    "hat crochet patterns",
    "sweater crochet patterns",
    "doily crochet patterns",
    
    // User intent - buying
    "download crochet patterns",
    "instant download patterns",
    "PDF crochet patterns",
    "beginner crochet patterns",
    "advanced crochet patterns",
    "unique crochet designs",
    "exclusive crochet patterns",
    
    // User intent - selling
    "sell crochet patterns online",
    "monetize crochet designs",
    "pattern designer income",
    "crochet pattern business",
    "passive income crochet",
    "designer marketplace",
    
    // Community aspects
    "crochet community marketplace",
    "support indie designers",
    "handmade pattern creators",
    "artisan crochet patterns",
    "independent pattern designers",
    
    // Quality indicators
    "tested crochet patterns",
    "professional crochet patterns",
    "high-quality patterns",
    "detailed instructions",
    "photo tutorials included"
  ],
  
  authors: [
    { name: "le Crochet Marketplace Team" },
    { name: "Independent Pattern Designers" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "E-commerce, Digital Marketplace, Crafts",
  classification: "Pattern Marketplace, Digital Downloads, Crafts Commerce",
  
  alternates: {
    canonical: "/marketplace",
    languages: {
      "en-US": "/marketplace",
      "en-GB": "/en-gb/marketplace",
      "fr": "/fr/marketplace",
      "es": "/es/marketplace"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Marketplace",
    title: "Crochet Pattern Marketplace - Buy & Sell Premium Patterns | le Crochet",
    description: "Discover thousands of unique crochet patterns from talented designers worldwide. Support independent creators while finding your perfect next project. Premium patterns with detailed instructions and photo tutorials.",
    url: "/marketplace",
    locale: "en_US",
    images: [
      {
        url: "/gallery/marketplace-hero.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Pattern Marketplace - Premium Patterns from Independent Designers",
        type: "image/png"
      },
      {
        url: "/gallery/02.png",
        width: 1200,
        height: 630,
        alt: "Featured Crochet Patterns in Marketplace",
        type: "image/png"
      },
      {
        url: "/gallery/03.png",
        width: 1200,
        height: 630,
        alt: "Designer Showcase - Sell Your Patterns",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Crochet Pattern Marketplace | Buy & Sell Premium Patterns 🧶",
    description: "Discover unique crochet patterns from talented designers worldwide. Support indie creators & find your perfect next project! Premium patterns with detailed tutorials. #CrochetPatterns #Marketplace",
    images: ["/gallery/marketplace-hero.png"]
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
    // E-commerce specific metadata
    "product:retailer": "le Crochet",
    "product:availability": "instock",
    "product:condition": "new",
    "product:category": "Digital Patterns",
    
    // Business metadata
    "business:contact_data:website": "https://lecrochet.online/marketplace",
    
    // Schema.org hints for marketplace
    "schema:Marketplace": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "le Crochet Marketplace",
      "description": "Premium crochet pattern marketplace connecting designers with crafters",
      "url": "https://lecrochet.online/marketplace",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lecrochet.online/marketplace/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }),
    
    "schema:Store": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "le Crochet Pattern Store",
      "description": "Digital marketplace for premium crochet patterns",
      "currenciesAccepted": "USD, EUR, GBP",
      "paymentAccepted": "Credit Card, PayPal, Apple Pay",
      "priceRange": "$1-$50"
    })
  }
};

// Breadcrumb structured data for marketplace page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Marketplace", url: "/marketplace" }
]);

export default function Marketplace() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <MarketplacePage />
    </>
  );
} 