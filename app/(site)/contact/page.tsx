import type { Metadata } from "next";
import ContactPage from "./client";
import { createBreadcrumbSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Contact Us | Customer Support & Business Inquiries | le Crochet",
  description: "Get in touch with the le Crochet team for customer support, technical help, business partnerships, press inquiries, or general questions. Multiple contact methods available including email, live chat, and support tickets. Fast, friendly response guaranteed.",
  
  keywords: [
    // Primary contact keywords
    "contact le crochet",
    "customer support",
    "technical support",
    "help desk",
    "contact form",
    "customer service",
    
    // Support types
    "pattern help support",
    "CrocheTeX coding support",
    "account help",
    "billing support",
    "technical assistance",
    "platform support",
    "bug report contact",
    
    // Business inquiries
    "business contact",
    "partnership inquiries",
    "press contact",
    "media inquiries",
    "collaboration opportunities",
    "enterprise solutions",
    "bulk licensing",
    
    // Communication methods
    "email support",
    "live chat support",
    "phone support",
    "ticket system",
    "help center",
    "contact hours",
    
    // Specific help areas
    "marketplace support",
    "pattern designer help",
    "seller support",
    "buyer assistance",
    "payment issues",
    "refund requests",
    
    // Regional support
    "international support",
    "multilingual support",
    "time zone support",
    "global customer service",
    
    // Response expectations
    "fast response",
    "24/7 support",
    "same day response",
    "professional support",
    "friendly help team"
  ],
  
  authors: [
    { name: "le Crochet Customer Support Team" },
    { name: "Business Development Team" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Customer Support, Contact Information, Help",
  classification: "Contact Page, Customer Service, Business Contact",
  
  alternates: {
    canonical: "/contact",
    languages: {
      "en-US": "/contact",
      "en-GB": "/en-gb/contact",
      "fr": "/fr/contact",
      "es": "/es/contact"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Contact",
    title: "Contact le Crochet | Customer Support & Business Inquiries",
    description: "Need help with le Crochet? Contact our friendly support team for technical assistance, account help, business inquiries, or general questions. Multiple contact methods available with fast response times.",
    url: "/contact",
    locale: "en_US",
    images: [
      {
        url: "/gallery/contact-support.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Customer Support - Contact Us",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Contact le Crochet | Customer Support 📞💬",
    description: "Need help? Our friendly support team is here for you! Technical help, account questions, business inquiries - we're just a message away. #CustomerSupport #Help",
    images: ["/gallery/contact-support.png"]
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
    // Contact specific metadata
    "contact:methods": "Email, Chat, Form",
    "contact:response_time": "24 hours",
    "contact:languages": "English, Spanish, French",
    "contact:availability": "24/7",
    
    // Business information
    "business:email": "support@lecrochet.online",
    "business:phone": "+1-555-CROCHET",
    "business:address": "123 Craft Street, Design City, CA 90210",
    
    // Schema.org contact information
    "schema:ContactPage": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact le Crochet",
      "description": "Customer support and business contact information",
      "url": "https://lecrochet.online/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "le Crochet",
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@lecrochet.online",
            "availableLanguage": ["English", "Spanish", "French"]
          },
          {
            "@type": "ContactPoint",
            "contactType": "technical support",
            "email": "tech@lecrochet.online"
          },
          {
            "@type": "ContactPoint",
            "contactType": "sales",
            "email": "business@lecrochet.online"
          }
        ]
      }
    }),
    
    "schema:Organization": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "le Crochet Inc.",
      "url": "https://lecrochet.online",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@lecrochet.online",
        "telephone": "+1-555-CROCHET"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Craft Street",
        "addressLocality": "Design City",
        "addressRegion": "CA",
        "postalCode": "90210",
        "addressCountry": "US"
      }
    })
  }
};

// Breadcrumb structured data for contact page
const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Contact Us", url: "/contact" }
]);

export default function Contact() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <ContactPage />
    </>
  );
} 