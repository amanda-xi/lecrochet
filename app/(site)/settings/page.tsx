import type { Metadata } from "next";
import SettingsPage from "./client";

export const metadata: Metadata = {
  title: "Account Settings | Preferences, Privacy & Profile Management | le Crochet",
  description: "Manage your le Crochet account settings, privacy preferences, notification settings, profile information, and platform customization options. Control your data, preferences, and user experience from one centralized dashboard.",
  
  keywords: [
    // Primary settings keywords
    "account settings",
    "user preferences",
    "profile settings",
    "privacy settings",
    "notification settings",
    "account management",
    
    // Profile management
    "edit profile",
    "profile information",
    "personal details",
    "profile picture",
    "display name",
    "bio update",
    
    // Privacy controls
    "privacy controls",
    "data privacy settings",
    "visibility settings",
    "public profile",
    "private account",
    "data sharing preferences",
    
    // Notification preferences
    "email notifications",
    "push notifications",
    "newsletter subscription",
    "marketing emails",
    "community notifications",
    "pattern updates",
    
    // Security settings
    "password change",
    "two-factor authentication",
    "login security",
    "account security",
    "session management",
    "device management",
    
    // Platform preferences
    "theme settings",
    "dark mode",
    "light mode",
    "language preferences",
    "timezone settings",
    "measurement units",
    
    // Creator settings
    "seller settings",
    "marketplace preferences",
    "payment settings",
    "tax information",
    "payout preferences",
    "commission settings",
    
    // Data management
    "export data",
    "download patterns",
    "backup settings",
    "data portability",
    "account deletion",
    "data retention",
    
    // Integration settings
    "connected accounts",
    "social media integration",
    "third-party apps",
    "API access",
    "webhook settings",
    "integration preferences",
    
    // Accessibility
    "accessibility settings",
    "screen reader support",
    "keyboard navigation",
    "high contrast mode",
    "font size settings",
    "motion preferences"
  ],
  
  authors: [
    { name: "le Crochet User Experience Team" },
    { name: "Account Management Team" }
  ],
  creator: "le Crochet Platform",
  publisher: "le Crochet Inc.",
  
  category: "Account Management, User Settings, Privacy Controls",
  classification: "Settings Page, User Dashboard, Account Control",
  
  alternates: {
    canonical: "/settings",
    languages: {
      "en-US": "/settings",
      "en-GB": "/en-gb/settings",
      "fr": "/fr/settings",
      "es": "/es/settings"
    }
  },
  
  openGraph: {
    type: "website",
    siteName: "le Crochet Settings",
    title: "Account Settings | Manage Your le Crochet Experience",
    description: "Customize your le Crochet experience with comprehensive account settings. Manage privacy, notifications, profile, security, and preferences all in one place. Take full control of your account.",
    url: "/settings",
    locale: "en_US",
    images: [
      {
        url: "/gallery/settings-dashboard.png",
        width: 1200,
        height: 630,
        alt: "le Crochet Account Settings Dashboard - Privacy and Preferences",
        type: "image/png"
      }
    ]
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Account Settings | Customize Your Experience ⚙️",
    description: "Take control of your le Crochet account! Manage privacy, notifications, profile & more. Customize everything to fit your needs perfectly. #AccountSettings #Privacy #UserControl",
    images: ["/gallery/settings-dashboard.png"]
  },
  
  robots: {
    index: false, // Settings pages typically shouldn't be indexed
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  },
  
  other: {
    // Settings specific metadata
    "settings:categories": "10",
    "settings:options": "50+",
    "settings:privacy_controls": "20+",
    "settings:security_features": "5",
    
    // Access control
    "access:requires_login": "true",
    "access:member_only": "true",
    
    // Schema.org user account settings
    "schema:UserAccount": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Account Settings",
      "description": "User account management and preferences dashboard",
      "url": "https://lecrochet.online/settings",
      "isPartOf": {
        "@type": "WebSite",
        "name": "le Crochet"
      },
      "mainEntity": {
        "@type": "Thing",
        "name": "User Preferences Dashboard"
      }
    }),
    
    "schema:ControlAction": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ControlAction",
      "name": "Account Management",
      "description": "Actions for managing user account settings and preferences",
      "object": {
        "@type": "UserAccount",
        "name": "le Crochet User Account"
      }
    })
  }
};

export default function Settings() {
    return <SettingsPage />;
} 