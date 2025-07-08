import { Metadata } from 'next'
import Script from 'next/script'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  structuredData?: object
  noIndex?: boolean
  noFollow?: boolean
  lastModified?: string
  author?: string
  category?: string
}

const DEFAULT_SEO: SEOProps = {
  title: 'le Crochet - Revolutionary Crochet Pattern Designer',
  description: 'Create stunning crochet patterns with le Crochet\'s intuitive CrocheTeX platform. Design, visualize in 3D, and share beautiful patterns with our comprehensive pattern builder.',
  keywords: [
    'crochet pattern designer',
    'crochet pattern builder', 
    'CrocheTeX',
    'crochet pattern maker',
    'amigurumi patterns',
    '3D crochet visualization',
    'crochet diagram maker'
  ],
  ogType: 'website',
  twitterCard: 'summary_large_image',
  noIndex: false,
  noFollow: false
}

export function generateSEOMetadata(seoProps: SEOProps = {}): Metadata {
  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    keywords = DEFAULT_SEO.keywords,
    canonicalUrl,
    ogImage = '/gallery/01.png',
    ogType = DEFAULT_SEO.ogType,
    twitterCard = DEFAULT_SEO.twitterCard,
    noIndex = DEFAULT_SEO.noIndex,
    noFollow = DEFAULT_SEO.noFollow,
    lastModified,
    author,
    category
  } = seoProps

  const baseUrl = 'https://lecrochet.online'
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl

  return {
    title: {
      default: title!,
      template: '%s | le Crochet'
    },
    description,
    keywords,
    authors: author ? [{ name: author }] : [{ name: 'le Crochet Team' }],
    creator: 'le Crochet Platform',
    publisher: 'le Crochet Inc.',
    category: category || 'Crafts & Design Software',
    
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl || '/',
    },

    openGraph: {
      type: ogType || 'website',
      siteName: 'le Crochet',
      title,
      description,
      url: fullCanonicalUrl,
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || 'le Crochet - Crochet Pattern Designer',
          type: 'image/png'
        }
      ]
    },

    twitter: {
      card: twitterCard || 'summary_large_image',
      site: '@lecrochet',
      creator: '@lecrochet',
      title,
      description,
      images: {
        url: ogImage,
        alt: title || 'le Crochet - Crochet Pattern Designer'
      }
    },

    robots: {
      index: !noIndex,
      follow: !noFollow,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },

    other: lastModified ? {
      'article:modified_time': lastModified,
      'article:published_time': lastModified
    } : {}
  }
}

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
} 