'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CategoryCard } from '@/components/forum/category-card'
import { PostCard } from '@/components/forum/post-card'
import { useToast } from '@/components/ui/toast'
import { ForumCategory, ForumPost } from '@/lib/supabase'
import { Plus, Loader2 } from 'lucide-react'

export default function ForumPage() {
    const { data: session } = useSession()
    const { addToast } = useToast()
    const [categories, setCategories] = useState<ForumCategory[]>([])
    const [recentPosts, setRecentPosts] = useState<ForumPost[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchForumData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchForumData = async () => {
        try {
            const [categoriesResponse, postsResponse] = await Promise.all([
                fetch('/api/forum/categories'),
                fetch('/api/forum/posts?limit=5')
            ])

            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json()
                setCategories(categoriesData.categories || [])
            }

            if (postsResponse.ok) {
                const postsData = await postsResponse.json()
                setRecentPosts(postsData.posts || [])
            }
        } catch (error) {
            console.error('Error fetching forum data:', error)
            addToast({
                type: 'error',
                message: 'Failed to load forum data'
            })
        } finally {
            setIsLoading(false)
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

    return (
        <div className="min-h-screen bg-white text-black">
            <section id="forum" className="py-12">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extralight mb-4">Community Forum</h2>
                        <p className="text-gray-600 font-light">Discuss, share, and learn with fellow crocheters.</p>
                        
                        {session?.user && (
                            <div className="mt-6">
                                <Link href="/forum/new-post">
                                    <Button className="font-light">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Start New Discussion
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                {/* Categories */}
                                <div className="mb-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-light">Discussion Categories</h3>
                                        <Badge variant="outline" className="font-light">
                                            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                                        </Badge>
                                    </div>
                                    
                                    {categories.length > 0 ? (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {categories.map((category) => (
                                                <CategoryCard 
                                                    key={category.id} 
                                                    category={category} 
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 font-light">
                                            No categories available.
                                        </div>
                                    )}
                                </div>

                                {/* Recent Posts */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-light">Recent Discussions</h3>
                                        <Link 
                                            href="/forum/recent" 
                                            className="text-sm text-blue-600 hover:text-blue-700 font-light"
                                        >
                                            View all discussions →
                                        </Link>
                                    </div>
                                    
                                    {recentPosts.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentPosts.map((post) => (
                                                <PostCard 
                                                    key={post.id} 
                                                    post={post} 
                                                    showCategory={true}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 font-light">
                                            No discussions yet. Be the first to start a conversation!
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="space-y-6">
                                    {/* Forum Stats */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h4 className="text-lg font-light mb-4">Community Stats</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 font-light">Categories</span>
                                                <span className="font-light">{categories.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 font-light">Total Posts</span>
                                                <span className="font-light">
                                                    {categories.reduce((acc, cat) => acc + cat.post_count, 0)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 font-light">Recent Activity</span>
                                                <span className="font-light">{recentPosts.length} recent</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Links */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h4 className="text-lg font-light mb-4">Quick Links</h4>
                                        <div className="space-y-2">
                                            <Link 
                                                href="/forum/category/general" 
                                                className="block text-sm text-gray-600 hover:text-gray-700 font-light"
                                            >
                                                General Discussion
                                            </Link>
                                            <Link 
                                                href="/forum/category/pattern-help" 
                                                className="block text-sm text-gray-600 hover:text-gray-700 font-light"
                                            >
                                                Pattern Help
                                            </Link>
                                            <Link 
                                                href="/forum/category/show-tell" 
                                                className="block text-sm text-gray-600 hover:text-gray-700 font-light"
                                            >
                                                Show & Tell
                                            </Link>
                                            <Link 
                                                href="/forum/category/beginners" 
                                                className="block text-sm text-gray-600 hover:text-gray-700 font-light"
                                            >
                                                Beginner Corner
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Welcome Message */}
                                    {!session?.user && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                            <h4 className="text-lg font-light mb-2">Join the Community</h4>
                                            <p className="text-sm text-gray-600 font-light mb-4">
                                                Sign in to participate in discussions, ask questions, and share your projects.
                                            </p>
                                            <Link href="/api/auth/signin">
                                                <Button variant="outline" size="sm" className="font-light">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </div>
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