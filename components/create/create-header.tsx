"use client"

import { Play, Pause, Download, Share2, Settings, Sun, Moon, Monitor, Save, Eye, AlertCircle, CheckCircle, Sparkles, BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CreateHeaderProps {
  isCompiling: boolean
  autoCompile: boolean
  onManualCompile: () => void
  onToggleAutoCompile: () => void
  onDownloadPattern: () => void
  compilerResult: CompilerResult | null
  patternCode?: string
  onSavePattern?: (pattern: {
    id: string
    title: string
    description: string | null
    pattern_code: string
    is_public: boolean
    created_at: string
    updated_at: string
  }) => void
  editingPattern?: {
    id: string
    title: string
    description: string | null
    pattern_code: string
    is_public: boolean
    created_at: string
    updated_at: string
  } | null
}

export default function CreateHeader({
  isCompiling,
  autoCompile,
  onManualCompile,
  onToggleAutoCompile,
  onDownloadPattern,
  compilerResult,
  patternCode = "",
  onSavePattern,
  editingPattern
}: CreateHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { addToast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveTitle, setSaveTitle] = useState("")
  const [saveDescription, setSaveDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const { data: session } = useSession()

  // Initialize form with existing pattern data when editing
  useEffect(() => {
    if (editingPattern) {
      setSaveTitle(editingPattern.title)
      setSaveDescription(editingPattern.description || "")
      setIsPublic(editingPattern.is_public)
    } else {
      setSaveTitle("")
      setSaveDescription("")
      setIsPublic(false)
    }
  }, [editingPattern])

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const errorCount = compilerResult?.errors.filter(e => e.severity === "error").length || 0
  const warningCount = compilerResult?.errors.filter(e => e.severity === "warning").length || 0

  const handleSavePattern = async () => {
    if (!session?.user || !patternCode || !saveTitle.trim()) return

    setSaving(true)
    try {
      const isEditing = !!editingPattern
      const url = isEditing ? `/api/patterns/${editingPattern.id}` : '/api/patterns'
      const method = isEditing ? 'PUT' : 'POST'

      let response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: saveTitle.trim(),
          description: saveDescription.trim() || null,
          pattern_code: patternCode,
          compiled_data: compilerResult,
          is_public: isPublic,
        }),
      })

      // If pattern save fails, try to sync profile first (only for new patterns)
      if (!response.ok && !isEditing) {
        const errorData = await response.json()
        
        // If it's a profile-related error, try syncing profile
        if (response.status === 500 && errorData.error?.includes('profile')) {
          console.log('Attempting to sync user profile...')
          
          const syncResponse = await fetch('/api/sync-profile', {
            method: 'POST',
          })
          
          if (syncResponse.ok) {
            // Retry pattern save after profile sync
            response = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: saveTitle.trim(),
                description: saveDescription.trim() || null,
                pattern_code: patternCode,
                compiled_data: compilerResult,
                is_public: isPublic,
              }),
            })
          }
        }
      }

      if (response.ok) {
        const data = await response.json()
        setShowSaveDialog(false)
        setSaveTitle("")
        setSaveDescription("")
        setIsPublic(false)
        onSavePattern?.(data.pattern)
        addToast({
          type: 'success',
          title: 'Success!',
          message: isEditing ? 'Pattern updated successfully!' : 'Pattern saved successfully!'
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'save'} pattern`)
      }
    } catch (error) {
      console.error(`Error ${editingPattern ? 'updating' : 'saving'} pattern:`, error)
      addToast({
        type: 'error',
        title: 'Error',
        message: `Failed to ${editingPattern ? 'update' : 'save'} pattern: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <header className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and core controls */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="text-xl font-light tracking-wide">
            Le Crochet
          </Link>
            </div>
            
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            
            {/* Desktop compile controls */}
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onManualCompile}
                disabled={isCompiling}
                className="text-sm font-light"
              >
                {isCompiling ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isCompiling ? "Compiling..." : "Compile"}
              </Button>

              <Button
                variant={autoCompile ? "default" : "ghost"}
                size="sm"
                onClick={onToggleAutoCompile}
                className="text-sm font-light"
              >
                <Eye className="h-4 w-4 mr-2" />
                Auto
              </Button>
            </div>

            {/* Mobile compile controls */}
            <div className="flex sm:hidden items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onManualCompile}
                disabled={isCompiling}
                className="text-xs font-light px-2"
              >
                {isCompiling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>

              <Button
                variant={autoCompile ? "default" : "ghost"}
                size="sm"
                onClick={onToggleAutoCompile}
                className="text-xs font-light px-2"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>

            {/* Status badges - responsive */}
            {compilerResult && (
              <div className="flex items-center gap-1 sm:gap-2">
                {compilerResult.success ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-light text-xs sm:text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Ready</span>
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-light text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errorCount}<span className="hidden sm:inline"> Error{errorCount !== 1 ? 's' : ''}</span>
                  </Badge>
                )}
                
                {warningCount > 0 && (
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300 font-light text-xs sm:text-sm hidden sm:inline-flex">
                    {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                  </Badge>
                )}

                {compilerResult.patternType !== "linear" && (
                  <Badge variant="outline" className="text-purple-700 border-purple-300 font-light text-xs sm:text-sm hidden md:inline-flex">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {compilerResult.patternType}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Right section - Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* <Button variant="ghost" size="sm" onClick={cycleTheme} className="text-sm font-light">
              {getThemeIcon()}
            </Button> */}

            <Button variant="ghost" size="sm" onClick={onDownloadPattern} className="text-sm font-light">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-light"
              onClick={() => setShowSaveDialog(true)}
              disabled={!session?.user || !patternCode?.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {editingPattern ? 'Update' : 'Save'}
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-light">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-sm font-light">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>

            <Link href="/docs" target="_blank">
              <Button variant="ghost" size="sm" className="text-sm font-light">
                <BookOpen className="h-4 w-4 mr-2" />
                Help
              </Button>
            </Link>

            <Separator orientation="vertical" className="h-6" />

            <AuthButtons />
          </div>

          {/* Save Pattern Dialog */}
          <AnimatePresence>
            {showSaveDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-opacity-50 z-[60]"
                onClick={() => setShowSaveDialog(false)}
              >
                <div className="min-h-screen pt-20 pb-8 px-4 flex items-start justify-center">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-medium mb-4 text-black">
                      {editingPattern ? 'Update Pattern' : 'Save Pattern'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={saveTitle}
                          onChange={(e) => setSaveTitle(e.target.value)}
                          placeholder="Enter pattern title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                          maxLength={100}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Description
                        </label>
                        <textarea
                          value={saveDescription}
                          onChange={(e) => setSaveDescription(e.target.value)}
                          placeholder="Optional description"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                          maxLength={500}
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="h-4 w-4 text-black focus:ring-gray-400 border-gray-300 rounded"
                        />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-black">
                          Make this pattern public
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button
                        variant="ghost"
                        onClick={() => setShowSaveDialog(false)}
                        disabled={saving}
                        className="text-black hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSavePattern}
                        disabled={saving || !saveTitle.trim()}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        {saving ? (editingPattern ? "Updating..." : "Saving...") : (editingPattern ? "Update Pattern" : "Save Pattern")}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile/Tablet actions */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-2">
            {/* Essential actions for mobile */}
            <Button variant="ghost" size="sm" onClick={cycleTheme} className="text-sm font-light p-2">
              {getThemeIcon()}
            </Button>

            <Button variant="ghost" size="sm" onClick={onDownloadPattern} className="text-sm font-light p-2 sm:px-3">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>

            {/* Animated mobile menu button */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-sm font-light p-2 relative"
              >
                <motion.div
                  initial={false}
                  animate={mobileMenuOpen ? "open" : "closed"}
                  className="w-4 h-4 flex items-center justify-center"
                >
                  <motion.div
                    variants={{
                      closed: { rotate: 0 },
                      open: { rotate: 90 }
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </motion.div>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Animated mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.3,
                ease: [0.04, 0.62, 0.23, 0.98]
              }}
              className="lg:hidden border-t border-gray-200 bg-background/95 backdrop-blur overflow-hidden"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: 0.1,
                  ease: [0.04, 0.62, 0.23, 0.98]
                }}
                className="p-4 space-y-2"
              >
                <motion.div
                  className="grid grid-cols-2 gap-2"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm font-light justify-start w-full"
                      onClick={() => setShowSaveDialog(true)}
                      disabled={!session?.user || !patternCode?.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingPattern ? 'Update' : 'Save'}
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/settings" className="w-full">
                      <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/docs" target="_blank" className="w-full">
                      <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Help
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Separator className="my-3" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <MobileAuthButtons onClose={() => setMobileMenuOpen(false)} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function AuthButtons() {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image!} alt={session.user.name ?? ""} />
                <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Button 
        onClick={() => signIn("google", { callbackUrl: "/create" })} 
        variant="ghost" 
        size="sm"
        className="text-sm font-light"
      >
        Sign In
      </Button>
      
      <Button 
        onClick={() => signIn("google", { callbackUrl: "/create" })} 
        size="sm" 
        className="bg-black text-white hover:bg-gray-800 text-sm font-light px-6"
      >
        Sign Up
      </Button>
    </div>
  )
}

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div className="space-y-4">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image!} alt={session.user.name ?? ""} />
              <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/profile" onClick={onClose}>
              <Button variant="outline" className="w-full text-sm font-light py-3 transition-all duration-200 ease-in-out rounded-sm">
                Profile
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => {
                signOut()
                onClose()
              }}
              variant="ghost" 
              className="w-full text-sm font-light py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 ease-in-out"
            >
              Sign Out
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="space-y-3"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={() => {
            signIn("google", { callbackUrl: "/create" })
            onClose()
          }}
          className="w-full bg-black text-white hover:bg-gray-800 text-sm font-light py-3 transition-all duration-200 ease-in-out"
        >
          Sign In with Google
        </Button>
      </motion.div>
    </motion.div>
  )
}