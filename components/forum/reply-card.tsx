'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { ForumReply } from '@/lib/supabase'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ReplyCardProps {
  reply: ForumReply
}

export function ReplyCard({ reply }: ReplyCardProps) {
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
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <Avatar className="w-8 h-8 bg-gray-100">
            {reply.user?.avatar_url ? (
              <Image 
                src={reply.user.avatar_url} 
                alt={getDisplayName(reply.user)} 
                className="w-full h-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-light">
                {getAvatarInitial(reply.user)}
              </div>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Reply Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-light text-black">
                  {getDisplayName(reply.user)}
                </span>
                <div className="flex items-center text-xs text-gray-500 font-light">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(reply.created_at)}
                </div>
              </div>
            </div>

            {/* Reply Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 font-light leading-relaxed whitespace-pre-wrap">
                {reply.content}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 