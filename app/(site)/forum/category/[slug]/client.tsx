'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/forum/post-card'
import { useToast } from '@/components/ui/toast'
import { ForumCategory, ForumPost } from '@/lib/supabase'
import { ArrowLeft, Plus, Loader2, MessageCircle } from 'lucide-react'

interface CategoryClientProps {
  slug: string
}

export default function CategoryClient({ slug }: CategoryClientProps) {
  const { data: session } = useSession()
  const { addToast } = useToast()
  const [category, setCategory] = useState<ForumCategory | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    fetchCategoryData()
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategoryData = async () => {
    try {
      // First get the category info
      const categoriesResponse = await fetch('/api/forum/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        const foundCategory = categoriesData.categories?.find((cat: ForumCategory) => cat.slug === slug)
        
        if (!foundCategory) {
          addToast({
            type: 'error',
            message: 'Category not found'
          })
          return
        }
        
        setCategory(foundCategory)
        
        // Then get posts for this category
        const postsResponse = await fetch(`/api/forum/posts?category=${foundCategory.id}&page=0&limit=20`)
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setPosts(postsData.posts || [])
          setHasMore(postsData.posts?.length === 20)
        }
      }
    } catch (error) {
      console.error('Error fetching category data:', error)
      addToast({
        type: 'error',
        message: 'Failed to load category data'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadMorePosts = async () => {
    if (!category || isLoadingMore) return
    
    setIsLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/forum/posts?category=${category.id}&page=${nextPage}&limit=20`)
      
      if (response.ok) {
        const data = await response.json()
        const newPosts = data.posts || []
        setPosts(prev => [...prev, ...newPosts])
        setPage(nextPage)
        setHasMore(newPosts.length === 20)
      }
    } catch (error) {
      console.error('Error loading more posts:', error)
      addToast({
        type: 'error',
        message: 'Failed to load more posts'
      })
    } finally {
      setIsLoadingMore(false)
    }
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

  if (!category) {
    return (
      <div className="min-h-screen bg-white text-black">
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extralight mb-4">Category Not Found</h2>
              <p className="text-gray-600 font-light mb-6">
                The category you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link href="/forum">
                <Button variant="outline" className="font-light">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forum
                </Button>
              </Link>
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
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}10` }}
                    >
                      <MessageCircle 
                        className="w-6 h-6" 
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl font-extralight">{category.name}</h1>
                      {category.description && (
                        <p className="text-gray-600 font-light mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-light">
                    <span>{category.post_count} {category.post_count === 1 ? 'post' : 'posts'}</span>
                    <span>•</span>
                    <span>{posts.length} {posts.length === 1 ? 'discussion' : 'discussions'}</span>
                  </div>
                </div>
                
                {session?.user && (
                  <Link href="/forum/new-post">
                    <Button className="font-light">
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Posts List */}
            <div>
              {posts.length > 0 ? (
                <>
                  <div className="space-y-4 mb-8">
                    {posts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        showCategory={false}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        onClick={loadMorePosts}
                        disabled={isLoadingMore}
                        className="font-light"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More Posts'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-light mb-2">No discussions yet</h3>
                  <p className="text-gray-600 font-light mb-6">
                    Be the first to start a conversation in this category.
                  </p>
                  {session?.user ? (
                    <Link href="/forum/new-post">
                      <Button className="font-light">
                        <Plus className="w-4 h-4 mr-2" />
                        Start Discussion
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/api/auth/signin">
                      <Button variant="outline" className="font-light">
                        Sign In to Post
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 