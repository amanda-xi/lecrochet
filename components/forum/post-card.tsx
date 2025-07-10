'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { ForumPost } from '@/lib/supabase'
import { MessageCircle, Pin, Lock, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: ForumPost
  showCategory?: boolean
}

export function PostCard({ post, showCategory = false }: PostCardProps) {
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

  return (
    <Card className="border-gray-200 hover:shadow-sm transition-shadow group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <Avatar className="w-10 h-10 bg-gray-100">
            {post.user?.avatar_url ? (
              <Image 
                src={post.user.avatar_url} 
                alt={getDisplayName(post.user)} 
                className="w-full h-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-light">
                {getAvatarInitial(post.user)}
              </div>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/forum/post/${post.id}`}
                  className="block"
                >
                  <h3 className="text-lg font-light text-black group-hover:text-gray-600 transition-colors line-clamp-2">
                    {post.is_pinned && <Pin className="inline w-4 h-4 mr-1 text-blue-500" />}
                    {post.is_locked && <Lock className="inline w-4 h-4 mr-1 text-gray-500" />}
                    {post.title}
                  </h3>
                </Link>
                
                {/* Category and User Info */}
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 font-light">
                  <span>{getDisplayName(post.user)}</span>
                  {showCategory && post.category && (
                    <>
                      <span>in</span>
                      <Link 
                        href={`/forum/category/${post.category.slug}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {post.category.name}
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Post Stats */}
              <div className="flex items-center gap-3 ml-4">
                {post.reply_count > 0 && (
                  <div className="flex items-center text-gray-500 text-xs font-light">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {post.reply_count}
                  </div>
                )}
              </div>
            </div>

            {/* Post Preview */}
            <p className="text-gray-700 font-light text-sm leading-relaxed mb-3 line-clamp-2">
              {post.content.length > 150 
                ? `${post.content.substring(0, 150)}...`
                : post.content
              }
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-light">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(post.created_at)}
              </div>
              
              {post.last_reply_at && post.last_reply_at !== post.created_at && (
                <div className="flex items-center">
                  <span className="mr-1">Last reply</span>
                  {formatDate(post.last_reply_at)}
                  {post.last_reply_user && (
                    <span className="ml-1">by {getDisplayName(post.last_reply_user)}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 