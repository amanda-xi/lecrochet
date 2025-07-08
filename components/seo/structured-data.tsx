import { StructuredData } from './seo-head'

// Website Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "le Crochet",
  "url": "https://lecrochet.online",
  "logo": "https://lecrochet.online/yarn.svg",
  "description": "Revolutionary crochet pattern designer platform with 3D visualization and CrocheTeX code editor",
  "foundingDate": "2025",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://lecrochet.online/contact",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://twitter.com/lecrochet",
    "https://instagram.com/lecrochet",
    "https://facebook.com/lecrochet"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
}

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "le Crochet",
  "url": "https://lecrochet.online",
  "description": "Create stunning crochet patterns with le Crochet's intuitive CrocheTeX platform",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://lecrochet.online/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "le Crochet",
    "url": "https://lecrochet.online"
  }
}

// WebApplication Schema
export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "le Crochet Pattern Designer",
  "url": "https://lecrochet.online",
  "description": "Revolutionary crochet pattern designer with 3D visualization",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "3D Pattern Visualization",
    "CrocheTeX Code Editor", 
    "Real-time Pattern Preview",
    "Pattern Gallery",
    "Pattern Marketplace",
    "Community Forum"
  ],
  "screenshot": [
    "https://lecrochet.online/gallery/01.png",
    "https://lecrochet.online/gallery/02.png",
    "https://lecrochet.online/gallery/03.png"
  ]
}

// Software Application Schema for SEO
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "le Crochet",
  "applicationCategory": "DesignApplication",
  "applicationSubCategory": "Pattern Design",
  "operatingSystem": "Web",
  "description": "Professional crochet pattern design platform with 3D visualization",
  "url": "https://lecrochet.online",
  "screenshot": "https://lecrochet.online/gallery/01.png",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}

// FAQ Schema for common questions
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is CrocheTeX?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CrocheTeX is our proprietary code language for creating crochet patterns. It allows you to write patterns using simple text commands that are then visualized in 2D and 3D."
      }
    },
    {
      "@type": "Question", 
      "name": "Can I create 3D visualizations of my patterns?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! le Crochet provides real-time 3D visualization of your crochet patterns as you design them, helping you see exactly how your finished project will look."
      }
    },
    {
      "@type": "Question",
      "name": "Is le Crochet free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, le Crochet is completely free to use. You can create, design, and visualize crochet patterns without any cost."
      }
    },
    {
      "@type": "Question",
      "name": "What types of crochet patterns can I create?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can create any type of crochet pattern including amigurumi, granny squares, linear patterns, circular patterns, and complex multi-dimensional designs."
      }
    }
  ]
}

// BreadcrumbList Schema
export function createBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://lecrochet.online${item.url}`
    }))
  }
}

// Article Schema for blog posts/documentation
export function createArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  url,
  image
}: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  url: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization", 
      "name": "le Crochet",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lecrochet.online/yarn.svg"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "url": `https://lecrochet.online${url}`,
    "image": image ? `https://lecrochet.online${image}` : "https://lecrochet.online/gallery/01.png",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lecrochet.online${url}`
    }
  }
}

// Product Schema for marketplace items
export function createProductSchema({
  name,
  description,
  price,
  currency = 'USD',
  availability = 'InStock',
  image,
  url,
  brand = 'le Crochet'
}: {
  name: string
  description: string
  price: string
  currency?: string
  availability?: string
  image: string
  url: string
  brand?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": `https://lecrochet.online${image}`,
    "url": `https://lecrochet.online${url}`,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "url": `https://lecrochet.online${url}`
    }
  }
}

// Default structured data components
export function OrganizationStructuredData() {
  return <StructuredData data={organizationSchema} />
}

export function WebsiteStructuredData() {
  return <StructuredData data={websiteSchema} />
}

export function WebApplicationStructuredData() {
  return <StructuredData data={webApplicationSchema} />
}

export function SoftwareApplicationStructuredData() {
  return <StructuredData data={softwareApplicationSchema} />
}

export function FAQStructuredData() {
  return <StructuredData data={faqSchema} />
} 