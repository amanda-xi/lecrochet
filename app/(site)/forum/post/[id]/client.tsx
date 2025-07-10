'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { ReplyCard } from '@/components/forum/reply-card'
import { ReplyForm } from '@/components/forum/reply-form'
import { useToast } from '@/components/ui/toast'
import { ForumPost, ForumReply } from '@/lib/supabase'
import { ArrowLeft, MessageCircle, Pin, Lock, Clock, Edit, Loader2, Save, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostClientProps {
  postId: string
}

export default function PostClient({ postId }: PostClientProps) {
  const { data: session } = useSession()
  const { addToast } = useToast()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    fetchPostData()
  }, [postId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPostData = async () => {
    try {
      const [postResponse, repliesResponse] = await Promise.all([
        fetch(`/api/forum/posts/${postId}`),
        fetch(`/api/forum/posts/${postId}/replies`)
      ])
      
      if (!postResponse.ok) {
        if (postResponse.status === 404) {
          addToast({
            type: 'error',
            message: 'Post not found'
          })
        } else {
          addToast({
            type: 'error',
            message: 'Failed to load post'
          })
        }
        return
      }

      const postData = await postResponse.json()
      const repliesData = repliesResponse.ok ? await repliesResponse.json() : { replies: [] }
      
      setPost(postData.post)
      setReplies(repliesData.replies || [])
      
      // Initialize edit form
      setEditForm({
        title: postData.post.title,
        content: postData.post.content
      })
    } catch (error) {
      console.error('Error fetching post data:', error)
      addToast({
        type: 'error',
        message: 'Failed to load post'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReplyAdded = () => {
    // Refresh the post data to get updated reply count and new replies
    fetchPostData()
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  // Helper function to get display name
  const getDisplayName = (user: { name: string | null; email: string; } | null | undefined) => {
    if (user?.name) return user.name
    if (user?.email) {
      // Extract username from email (before @)
      return user.email.split('@')[0]
    }
    return 'Unknown User'
  }

  // Helper function to get avatar initial
  const getAvatarInitial = (user: { name: string | null; email: string; } | null | undefined) => {
    const displayName = getDisplayName(user)
    return displayName[0]?.toUpperCase() || '?'
  }

  // Check if current user is the post author
  const isAuthor = () => {
    if (!session?.user?.email || !post?.user?.email) return false
    return session.user.email === post.user.email
  }

  const handleEditStart = () => {
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    // Reset form to original values
    setEditForm({
      title: post?.title || '',
      content: post?.content || ''
    })
  }

  const handleEditSave = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      addToast({
        type: 'error',
        message: 'Title and content are required'
      })
      return
    }

    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/forum/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title.trim(),
          content: editForm.content.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update post')
      }

      const data = await response.json()
      setPost(data.post)
      setIsEditing(false)
      
      addToast({
        type: 'success',
        message: 'Post updated successfully!'
      })
    } catch (error) {
      console.error('Error updating post:', error)
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update post'
      })
    } finally {
      setIsUpdating(false)
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

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-black">
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extralight mb-4">Post Not Found</h2>
              <p className="text-gray-600 font-light mb-6">
                The discussion you&apos;re looking for doesn&apos;t exist or has been removed.
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
            {/* Navigation */}
            <div className="mb-6">
              <Link href="/forum">
                <Button variant="ghost" size="sm" className="mb-2 font-light">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forum
                </Button>
              </Link>
              
              {post.category && (
                <div className="flex items-center gap-2 text-sm text-gray-600 font-light">
                  <Link 
                    href={`/forum/category/${post.category.slug}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {post.category.name}
                  </Link>
                  <span>→</span>
                  <span>{post.title}</span>
                </div>
              )}
            </div>

            {/* Main Post */}
            <Card className="border-gray-200 mb-8">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <Avatar className="w-12 h-12 bg-gray-100">
                    {post.user?.avatar_url ? (
                      <Image 
                        src={post.user.avatar_url} 
                        alt={getDisplayName(post.user)} 
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-light">
                        {getAvatarInitial(post.user)}
                      </div>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    {/* Post Header */}
                    <div className="mb-4">
                      {isEditing ? (
                        <div className="space-y-4">
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            placeholder="Post title"
                            className="text-2xl font-light border-gray-200"
                            disabled={isUpdating}
                          />
                        </div>
                      ) : (
                        <h1 className="text-2xl font-light text-black mb-2">
                          {post.is_pinned && <Pin className="inline w-5 h-5 mr-2 text-blue-500" />}
                          {post.is_locked && <Lock className="inline w-5 h-5 mr-2 text-gray-500" />}
                          {post.title}
                        </h1>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 font-light">
                        <span>{getDisplayName(post.user)}</span>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(post.created_at)}
                        </div>
                        {post.reply_count > 0 && (
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="prose prose-sm max-w-none mb-4">
                      {isEditing ? (
                        <Textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          placeholder="Write your post content..."
                          rows={8}
                          className="border-gray-200 font-light"
                          disabled={isUpdating}
                        />
                      ) : (
                        <p className="text-gray-700 font-light leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                      )}
                    </div>

                    {/* Post Actions */}
                    {isAuthor() && (
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Button 
                              onClick={handleEditSave}
                              size="sm" 
                              className="font-light"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button 
                              onClick={handleEditCancel}
                              variant="ghost" 
                              size="sm" 
                              className="font-light"
                              disabled={isUpdating}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={handleEditStart}
                            variant="ghost" 
                            size="sm" 
                            className="font-light"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies Section */}
            <div className="mb-8">
              <h3 className="text-xl font-light mb-6">
                {replies.length === 0 ? 'No replies yet' : 
                 `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`}
              </h3>
              
              {replies.length > 0 && (
                <div className="space-y-4 mb-8">
                  {replies.map((reply) => (
                    <ReplyCard key={reply.id} reply={reply} />
                  ))}
                </div>
              )}
            </div>

            {/* Reply Form */}
            {!post.is_locked ? (
              <ReplyForm postId={postId} onReplyAdded={handleReplyAdded} />
            ) : (
              <Card className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <Lock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 font-light">
                    This discussion has been locked and no longer accepts new replies.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 