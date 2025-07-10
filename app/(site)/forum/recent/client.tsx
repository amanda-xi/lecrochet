'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/components/forum/post-card'
import { useToast } from '@/components/ui/toast'
import { ForumPost } from '@/lib/supabase'
import { ArrowLeft, Loader2, Plus, Clock } from 'lucide-react'

export default function RecentPostsClient() {
  const { data: session } = useSession()
  const { addToast } = useToast()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const limit = 20

  useEffect(() => {
    fetchPosts(0, true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = async (pageNum: number, reset = false) => {
    try {
      if (reset) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const response = await fetch(`/api/forum/posts?page=${pageNum}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      const newPosts = data.posts || []
      
      if (reset) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      setHasMore(newPosts.length === limit)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching posts:', error)
      addToast({
        type: 'error',
        message: 'Failed to load discussions'
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadMore = () => {
    fetchPosts(page + 1, false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/forum">
                <Button variant="ghost" size="sm" className="mb-4 font-light">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forum
                </Button>
              </Link>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-extralight mb-2">Recent Discussions</h1>
                  <p className="text-gray-600 font-light">
                    Latest conversations from the community
                  </p>
                </div>
                
                {session?.user && (
                  <Link href="/forum/new-post">
                    <Button className="font-light">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Discussion
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats and Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="font-light">
                  <Clock className="w-3 h-3 mr-1" />
                  {posts.length} discussion{posts.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {/* Future: Add filter options */}
              <div className="flex items-center gap-2">
                {/* Placeholder for future filters */}
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      showCategory={true}
                    />
                  ))}
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center pt-8">
                      <Button
                        onClick={loadMore}
                        variant="outline"
                        disabled={isLoadingMore}
                        className="font-light"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More Discussions'
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {/* End of Results */}
                  {!hasMore && posts.length > 0 && (
                    <div className="text-center pt-8 pb-4">
                      <p className="text-gray-500 font-light text-sm">
                        You&apos;ve reached the end of the discussions.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">No discussions yet</h3>
                  <p className="text-gray-600 font-light mb-6">
                    Be the first to start a conversation in the community!
                  </p>
                  {session?.user ? (
                    <Link href="/forum/new-post">
                      <Button className="font-light">
                        <Plus className="w-4 h-4 mr-2" />
                        Start First Discussion
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/api/auth/signin">
                      <Button variant="outline" className="font-light">
                        Sign In to Participate
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-600 font-light">
                  <Link 
                    href="/forum" 
                    className="hover:text-gray-800 transition-colors"
                  >
                    Browse Categories
                  </Link>
                  <span>•</span>
                  <Link 
                    href="/forum/help" 
                    className="hover:text-gray-800 transition-colors"
                  >
                    Community Guidelines
                  </Link>
                  {session?.user && (
                    <>
                      <span>•</span>
                      <Link 
                        href="/profile" 
                        className="hover:text-gray-800 transition-colors"
                      >
                        Your Activity
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
