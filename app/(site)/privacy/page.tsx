import type { Metadata } from "next";
import PrivacyPage from "./client";

export const metadata: Metadata = {
  title: "Privacy Policy | Data Protection & User Rights | le Crochet",
  description: "Our comprehensive privacy policy explains how le Crochet collects, uses, and protects your personal data. Learn about your privacy rights, data security measures, cookie usage, and how we comply with GDPR, CCPA, and other privacy regulations.",
  
  keywords: [
    // Primary privacy keywords
    "privacy policy",
    "data protection",
    "user privacy rights",
    "personal data protection",
    "privacy statement",
    "data security",
    
    // Legal compliance
    "GDPR compliance",
    "CCPA compliance",
    "privacy regulations",
    "data protection law",
    "user consent",
    "privacy rights",
    
    // Data handling
    "data collection",
    "data usage",
    "data sharing",
    "data retention",
    "data deletion",
    "data portability",
    
    // Security measures
    "data encryption",
    "secure storage",
    "access controls",
    "security protocols",
    "breach notification",
    "data backup",
    
    // Cookie policy
    "cookie policy",
    "tracking cookies",
    "analytics cookies",
    "cookie consent",
    "cookie preferences",
    "third-party cookies",
    
    // User rights
    "right to access",
    "right to deletion",
    "right to rectification",
    "right to portability",
    "opt-out rights",
    "consent withdrawal",
    
    // Platform specific
    "pattern data privacy",
    "user account privacy",
    "marketplace privacy",
    "creator privacy",
    "community privacy",
    "forum privacy",
    
    // International
    "global privacy policy",
    "international data transfer",
    "cross-border data",
    "regional privacy laws",
    
    // Contact and requests
    "privacy officer contact",
    "data request form",
    "privacy questions",
    "rights exercise"
  ],
  
  authors: [
    { name: "le Crochet Legal Team" },
    { name: "Privacy Officers" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Legal, Privacy Policy, Data Protection",
  classification: "Privacy Statement, Legal Documentation, Compliance",
  
  alternates: {
    canonical: "/privacy",
    languages: {
      "en-US": "/privacy",
      "en-GB": "/en-gb/privacy",
      "fr": "/fr/privacy",
      "es": "/es/privacy"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Privacy",
    title: "Privacy Policy | Data Protection & User Rights | le Crochet",
    description: "Transparent privacy policy explaining how we protect your data, respect your privacy rights, and comply with global privacy regulations. Your privacy is our priority.",
    url: "/privacy",
    locale: "en_US",
    images: [
      {
        url: "/gallery/privacy-security.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Privacy Policy - Data Protection and Security",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Your Data Protection Rights 🔒",
    description: "Transparent privacy policy: how we protect your data, respect your rights & comply with privacy laws. Your privacy matters to us. #Privacy #DataProtection #GDPR",
    images: ["/gallery/privacy-security.png"]
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
    // Privacy specific metadata
    "privacy:last_updated": "2024-01-01",
    "privacy:version": "3.0",
    "privacy:effective_date": "2024-01-01",
    "privacy:jurisdiction": "Global",
    
    // Compliance metadata
    "compliance:gdpr": "true",
    "compliance:ccpa": "true",
    "compliance:coppa": "true",
    "compliance:pipeda": "true",
    
    // Schema.org privacy policy
    "schema:PrivacyPolicy": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "le Crochet Privacy Policy",
      "description": "Comprehensive privacy policy covering data protection, user rights, and regulatory compliance",
      "url": "https://lecrochet.online/privacy",
      "dateModified": "2024-01-01",
      "mainEntity": {
        "@type": "Article",
        "headline": "Privacy Policy",
        "author": {
          "@type": "Organization",
          "name": "le Crochet Legal Team"
        },
        "about": "Data privacy and protection practices"
      }
    }),
    
    "schema:Organization": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "le Crochet Inc.",
      "url": "https://lecrochet.online",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "privacy officer",
        "email": "privacy@lecrochet.online"
      },
      "privacyPolicy": "https://lecrochet.online/privacy"
    })
  }
};

export default function Privacy() {
    return <PrivacyPage />;
} 