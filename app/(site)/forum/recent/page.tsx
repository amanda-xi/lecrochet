import { Metadata } from 'next'
import RecentPostsClient from './client'

export const metadata: Metadata = {
  title: 'Recent Discussions - Le Crochet Forum',
  description: 'Browse recent discussions and conversations in the Le Crochet community forum.',
  openGraph: {
    title: 'Recent Discussions - Le Crochet Forum',
    description: 'Browse recent discussions and conversations in the Le Crochet community forum.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Recent Discussions - Le Crochet Forum',
    description: 'Browse recent discussions and conversations in the Le Crochet community forum.',
  },
}

export default function RecentPostsPage() {
  return <RecentPostsClient />
}
