"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { useConfirm } from "@/components/ui/confirm-dialog"
import { useState, useEffect, useCallback } from "react"
import { Edit2, Save, X, Trash2, Eye, Calendar, FileText, MessageCircle, Reply, Hash } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDistanceToNow } from 'date-fns'

interface Pattern {
  id: string
  title: string
  description: string | null
  pattern_code: string
  is_public: boolean
  created_at: string
  updated_at: string
}

interface UserProfile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface ForumPost {
  id: string
  title: string
  content: string
  reply_count: number
  created_at: string
  category: {
    id: string
    name: string
    slug: string
    color: string
  }
}

interface ForumReply {
  id: string
  content: string
  created_at: string
  post: {
    id: string
    title: string
    category: {
      id: string
      name: string
      slug: string
    }
  }
}

export function ProfilePage() {
  const { data: session } = useSession()
  const { addToast } = useToast()
  const { showConfirm, ConfirmComponent } = useConfirm()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [forumReplies, setForumReplies] = useState<ForumReply[]>([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'patterns' | 'posts' | 'replies'>('patterns')

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile?include=forum')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setEditedName(data.profile.name || "")
        setForumPosts(data.forumPosts || [])
        setForumReplies(data.forumReplies || [])
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load profile data. Please refresh the page.'
      })
    } finally {
      setLoading(false)
    }
  }, [addToast])

  const fetchPatterns = useCallback(async () => {
    try {
      const response = await fetch('/api/patterns')
      if (response.ok) {
        const data = await response.json()
        setPatterns(data.patterns)
      } else {
        throw new Error('Failed to fetch patterns')
      }
    } catch (error) {
      console.error('Error fetching patterns:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load patterns. Please refresh the page.'
      })
    }
  }, [addToast])

  useEffect(() => {
    if (session?.user && (session.user as { id?: string }).id) {
      fetchProfile()
      fetchPatterns()
    }
  }, [session, fetchProfile, fetchPatterns])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          avatar_url: session?.user?.image,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setIsEditingProfile(false)
        addToast({
          type: 'success',
          title: 'Success!',
          message: 'Profile updated successfully!'
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile. Please try again.'
      })
    } finally {
      setSaving(false)
    }
  }

  const deletePattern = async (patternId: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Pattern',
      message: 'Are you sure you want to delete this pattern? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    })

    if (!confirmed) return

    try {
      const response = await fetch(`/api/patterns/${patternId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPatterns(patterns.filter(p => p.id !== patternId))
        addToast({
          type: 'success',
          title: 'Success!',
          message: 'Pattern deleted successfully!'
        })
      } else {
        throw new Error('Failed to delete pattern')
      }
    } catch (error) {
      console.error('Error deleting pattern:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete pattern. Please try again.'
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  if (!session || !session.user) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">You need to be signed in to view this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your activity</p>
        </div>

        {/* Profile Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-light">Personal Information</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={session.user.image!} alt={session.user.name ?? ""} />
                <AvatarFallback className="text-xl">{session.user.name?.[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  {isEditingProfile ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Enter your name"
                        className="max-w-sm"
                      />
                      <Button
                        size="sm"
                        onClick={saveProfile}
                        disabled={saving}
                        className="px-3"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsEditingProfile(false)
                          setEditedName(profile?.name || "")
                        }}
                        className="px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-lg">{profile?.name || "No name set"}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingProfile(true)}
                        className="px-2"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-600 mt-1">{session.user.email}</p>
                </div>
                
                {profile && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member since</label>
                    <p className="text-gray-600 mt-1">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Card>
          <CardHeader>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('patterns')}
                className={`flex-1 px-4 py-2 text-sm font-light rounded-md transition-colors ${
                  activeTab === 'patterns'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Patterns ({patterns.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 px-4 py-2 text-sm font-light rounded-md transition-colors ${
                  activeTab === 'posts'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Posts ({forumPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('replies')}
                className={`flex-1 px-4 py-2 text-sm font-light rounded-md transition-colors ${
                  activeTab === 'replies'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Reply className="h-4 w-4 inline mr-2" />
                Replies ({forumReplies.length})
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Patterns Tab */}
            {activeTab === 'patterns' && (
              <div>
                {patterns.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven&apos;t saved any patterns yet.</p>
                    <Link href="/create">
                      <Button>Create Your First Pattern</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patterns.map((pattern) => (
                      <motion.div
                        key={pattern.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{pattern.title}</h3>
                              {pattern.is_public && (
                                <Badge variant="outline" className="text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Public
                                </Badge>
                              )}
                            </div>
                            
                            {pattern.description && (
                              <p className="text-gray-600 text-sm mb-2">{pattern.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Created {new Date(pattern.created_at).toLocaleDateString()}
                              </span>
                              {pattern.updated_at !== pattern.created_at && (
                                <span className="flex items-center">
                                  Updated {new Date(pattern.updated_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Link href={`/create?pattern=${pattern.id}`}>
                              <Button size="sm" variant="ghost">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deletePattern(pattern.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Forum Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                {forumPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven&apos;t started any discussions yet.</p>
                    <Link href="/forum/new-post">
                      <Button>Start Your First Discussion</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forumPosts.map((post) => (
                      <Link key={post.id} href={`/forum/post/${post.id}`} passHref>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                {post.title}
                              </span>
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ backgroundColor: `${post.category.color}20`, borderColor: post.category.color }}
                              >
                                <Hash className="h-3 w-3 mr-1" />
                                {post.category.name}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {post.content.length > 100 
                                ? `${post.content.substring(0, 100)}...`
                                : post.content
                              }
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(post.created_at)}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Forum Replies Tab */}
            {activeTab === 'replies' && (
              <div>
                {forumReplies.length === 0 ? (
                  <div className="text-center py-8">
                    <Reply className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven&apos;t replied to any discussions yet.</p>
                    <Link href="/forum">
                      <Button>Browse Forum Discussions</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forumReplies.map((reply) => (
                      <Link key={reply.id} href={`/forum/post/${reply.post.id}`} passHref>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm text-gray-500">Reply to:</span>
                              <span className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                {reply.post.title}
                              </span>
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                <Hash className="h-3 w-3 mr-1" />
                                {reply.post.category.name}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                              {reply.content}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(reply.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <ConfirmComponent />
    </div>
  )
} 