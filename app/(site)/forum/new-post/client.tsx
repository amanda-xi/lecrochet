'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { ForumCategory } from '@/lib/supabase'
import { ArrowLeft, Send, Loader2, MessageCircle } from 'lucide-react'

export default function NewPostClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: ''
  })

  useEffect(() => {
    fetchCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session?.user) {
      router.push('/api/auth/signin')
    }
  }, [session, status, router])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      addToast({
        type: 'error',
        message: 'Failed to load categories'
      })
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      addToast({
        type: 'error',
        message: 'You must be logged in to create a post'
      })
      return
    }

    if (!formData.title.trim()) {
      addToast({
        type: 'error',
        message: 'Title is required'
      })
      return
    }

    if (!formData.content.trim()) {
      addToast({
        type: 'error',
        message: 'Content is required'
      })
      return
    }

    if (!formData.category_id) {
      addToast({
        type: 'error',
        message: 'Please select a category'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category_id: formData.category_id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create post')
      }

      const data = await response.json()
      
      addToast({
        type: 'success',
        message: 'Discussion created successfully!'
      })
      
      // Redirect to the new post
      router.push(`/forum/post/${data.post.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create post'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Show loading if session is still loading
  if (status === 'loading') {
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

  // Don't render form if not authenticated (will redirect)
  if (!session?.user) {
    return null
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
              
              <h1 className="text-3xl font-extralight mb-2">Start New Discussion</h1>
              <p className="text-gray-600 font-light">
                Share your thoughts, ask questions, or start a conversation with the community.
              </p>
            </div>

            {/* Form */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-light flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  New Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-light text-black mb-2">
                      Category *
                    </label>
                    {isLoadingCategories ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading categories...
                      </div>
                    ) : (
                      <select
                        value={formData.category_id}
                        onChange={(e) => handleInputChange('category_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md font-light focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSubmitting}
                      >
                        <option value="">Select a category...</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-light text-black mb-2">
                      Title *
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="What's your discussion about?"
                      className="border-gray-200 font-light"
                      disabled={isSubmitting}
                      maxLength={200}
                    />
                    <div className="text-xs text-gray-500 font-light mt-1">
                      {formData.title.length}/200 characters
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-light text-black mb-2">
                      Content *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Share your thoughts, ask questions, or start the conversation..."
                      rows={12}
                      className="border-gray-200 font-light"
                      disabled={isSubmitting}
                      maxLength={5000}
                    />
                    <div className="text-xs text-gray-500 font-light mt-1">
                      {formData.content.length}/5000 characters
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-light text-blue-900 mb-2">Community Guidelines</h4>
                    <ul className="text-xs text-blue-800 font-light space-y-1">
                      <li>• Be respectful and constructive in your discussions</li>
                      <li>• Choose the most appropriate category for your post</li>
                      <li>• Use clear, descriptive titles that summarize your topic</li>
                      <li>• Search existing discussions before creating new ones</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between">
                    <Link href="/forum">
                      <Button variant="outline" type="button" className="font-light">
                        Cancel
                      </Button>
                    </Link>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category_id}
                      className="font-light"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Create Discussion
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 