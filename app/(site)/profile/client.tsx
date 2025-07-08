"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Edit2, Save, X, Trash2, Eye, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

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

export function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (session?.user && (session.user as { id?: string }).id) {
      fetchProfile()
      fetchPatterns()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setEditedName(data.profile.name || "")
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatterns = async () => {
    try {
      const response = await fetch('/api/patterns')
      if (response.ok) {
        const data = await response.json()
        setPatterns(data.patterns)
      }
    } catch (error) {
      console.error('Error fetching patterns:', error)
    }
  }

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
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const deletePattern = async (patternId: string) => {
    if (!confirm('Are you sure you want to delete this pattern?')) return

    try {
      const response = await fetch(`/api/patterns/${patternId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPatterns(patterns.filter(p => p.id !== patternId))
      }
    } catch (error) {
      console.error('Error deleting pattern:', error)
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
          <p className="text-gray-600">Manage your account and view your patterns</p>
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

        {/* Patterns Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-light">Your Patterns</CardTitle>
              <CardDescription>Patterns you&apos;ve created and saved</CardDescription>
            </div>
            <Badge variant="secondary">{patterns.length} pattern{patterns.length !== 1 && "s"}</Badge>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 