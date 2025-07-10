'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { Loader2, Send } from 'lucide-react'
import Link from 'next/link'

interface ReplyFormProps {
  postId: string
  onReplyAdded?: () => void
}

export function ReplyForm({ postId, onReplyAdded }: ReplyFormProps) {
  const { data: session } = useSession()
  const { addToast } = useToast()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      addToast({
        type: 'error',
        message: 'You must be logged in to reply'
      })
      return
    }

    if (!content.trim()) {
      addToast({
        type: 'error',
        message: 'Reply content is required'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/forum/posts/${postId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create reply')
      }

      setContent('')
      addToast({
        type: 'success',
        message: 'Reply posted successfully!'
      })
      
      if (onReplyAdded) {
        onReplyAdded()
      }
    } catch (error) {
      console.error('Error creating reply:', error)
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create reply'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session?.user) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 font-light mb-4">
            Please sign in to join the discussion.
          </p>
          <Link href="/api/auth/signin">
            <Button variant="outline" className="font-light">
              Sign In to Comment
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <Avatar className="w-8 h-8 bg-gray-100">
              {session.user.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-full h-full object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-light">
                  {session.user.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </Avatar>

            <div className="flex-1">
              <div className="mb-3">
                <span className="text-sm font-light text-black">
                  {session.user.name || 'You'}
                </span>
              </div>
              
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your reply..."
                rows={4}
                className="mb-4 border-gray-200 font-light"
                disabled={isSubmitting}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 font-light">
                  {content.length}/2000 characters
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !content.trim() || content.length > 2000}
                  className="font-light"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 