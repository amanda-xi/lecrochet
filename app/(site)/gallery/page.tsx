import type { Metadata } from "next";
import GalleryPage from "./client";

export const metadata: Metadata = {
  title: "Crochet Pattern Gallery | Inspiring Designs & Community Showcase | le Crochet",
  description: "Explore a stunning gallery of crochet patterns and finished projects from our creative community. Find inspiration for your next project with beautiful amigurumi, blankets, accessories, and more. Discover trending designs and see what's possible with CrocheTeX.",
  
  keywords: [
    // Primary gallery keywords
    "crochet pattern gallery",
    "crochet inspiration gallery",
    "crochet project showcase", 
    "crochet community gallery",
    "finished crochet projects",
    "crochet pattern examples",
    
    // Visual content keywords
    "crochet pattern photos",
    "crochet design inspiration",
    "crochet project ideas",
    "beautiful crochet patterns",
    "stunning crochet designs",
    "creative crochet projects",
    "colorful crochet patterns",
    
    // Project types in gallery
    "amigurumi gallery",
    "granny square showcase",
    "blanket pattern gallery",
    "crochet accessories gallery",
    "baby crochet gallery",
    "home decor crochet",
    "fashion crochet gallery",
    "holiday crochet patterns",
    
    // Skill levels
    "beginner crochet gallery",
    "intermediate crochet projects",
    "advanced crochet showcase",
    "expert crochet designs",
    
    // Trending and popular
    "trending crochet patterns",
    "popular crochet designs",
    "featured crochet projects",
    "award-winning patterns",
    "community favorites",
    
    // Inspiration keywords
    "crochet motivation",
    "pattern design ideas",
    "color combination inspiration",
    "texture pattern ideas",
    "stitch pattern gallery",
    
    // Community aspects
    "user submitted patterns",
    "community creations",
    "member showcase",
    "collaborative projects",
    "pattern challenges"
  ],
  
  authors: [
    { name: "le Crochet Community" },
    { name: "Featured Pattern Designers" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Art Gallery, Design Inspiration, Community Showcase",
  classification: "Visual Gallery, Pattern Showcase, Creative Inspiration",
  
  alternates: {
    canonical: "/gallery",
    languages: {
      "en-US": "/gallery",
      "en-GB": "/en-gb/gallery",
      "fr": "/fr/gallery",
      "es": "/es/gallery"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Gallery",
    title: "Stunning Crochet Pattern Gallery | Community Showcase & Design Inspiration",
    description: "Browse hundreds of beautiful crochet patterns and finished projects from our talented community. Find your next project inspiration with stunning amigurumi, blankets, accessories, and innovative designs.",
    url: "/gallery",
    locale: "en_US",
    images: [
      {
        url: "/gallery/01.png",
        width: 1200,
        height: 630,
        alt: "Beautiful Crochet Pattern Gallery - Community Showcase",
        type: "image/png"
      },
      {
        url: "/gallery/02.png",
        width: 1200,
        height: 630,
        alt: "Featured Amigurumi and Pattern Designs",
        type: "image/png"
      },
      {
        url: "/gallery/03.png",
        width: 1200,
        height: 630,
        alt: "Colorful Crochet Projects and Inspiration",
        type: "image/png"
      },
      {
        url: "/gallery/04.png",
        width: 1200,
        height: 630,
        alt: "Advanced Crochet Techniques and Patterns",
        type: "image/png"
      },
      {
        url: "/gallery/05.png",
        width: 1200,
        height: 630,
        alt: "Trending Crochet Designs and Community Favorites",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Stunning Crochet Gallery | Community Showcase 🎨🧶",
    description: "Browse beautiful crochet patterns & finished projects from our talented community! Find inspiration for amigurumi, blankets & more. #CrochetGallery #CrochetInspiration #Handmade",
    images: ["/gallery/01.png"]
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
    // Image gallery specific metadata
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    
    // Content type metadata
    "content-type": "Visual Gallery",
    "gallery:count": "500+",
    "gallery:featured": "true",
    
    // Schema.org hints for image gallery
    "schema:ImageGallery": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "le Crochet Pattern Gallery",
      "description": "Community showcase of beautiful crochet patterns and finished projects",
      "url": "https://lecrochet.com/gallery",
      "mainEntity": {
        "@type": "CollectionPage",
        "name": "Crochet Pattern Showcase",
        "description": "Curated collection of inspiring crochet designs"
      }
    }),
    
    "schema:CreativeWork": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "Community Crochet Gallery",
      "description": "Showcase of creative crochet patterns and finished projects",
      "creator": {
        "@type": "Organization",
        "name": "le Crochet Community"
      },
      "genre": "Fiber Arts, Handicrafts, Pattern Design"
    })
  }
};

export default function Gallery() {
    return <GalleryPage />;
} 