"use client"

import { Play, Pause, Download, Settings, Save, Eye, BookOpen, User, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"
import SavePatternDialog from "./header/save-pattern-dialog"
import StatusBadges from "./header/status-badges"
import AuthSection from "./header/auth-section"
import MobileMenu from "./header/mobile-menu"
import ShareButton from "./header/share-button"

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
    author?: {
      name: string | null
      email: string
    } | null
  }) => void
  editingPattern?: {
    id: string
    title: string
    description: string | null
    pattern_code: string
    is_public: boolean
    created_at: string
    updated_at: string
    author?: {
      name: string | null
      email: string
    } | null
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
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const { data: session } = useSession()

  // Check if this is someone else's pattern
  const isViewingOthersPattern = editingPattern && editingPattern.author && 
    session?.user?.email !== editingPattern.author.email

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <header className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Author info banner for shared patterns */}
        {isViewingOthersPattern && (
          <div className="border-b border-gray-100 bg-gray-50/50 py-2 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-800">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  Pattern by {editingPattern.author?.name || 'Unknown Author'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(editingPattern.created_at)}
                </span>
                {editingPattern.updated_at !== editingPattern.created_at && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {formatDate(editingPattern.updated_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

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

            {/* Status badges */}
            <StatusBadges compilerResult={compilerResult} />
          </div>

          {/* Right section - Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">

            <Button variant="ghost" size="sm" onClick={onDownloadPattern} className="text-sm font-light">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* Hide Save/Update button for other people's patterns */}
            {!isViewingOthersPattern && (
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
            )}

            <ShareButton editingPattern={editingPattern} />

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

            <AuthSection />
          </div>

          {/* Save Pattern Dialog */}
          <SavePatternDialog 
            isOpen={showSaveDialog}
            onClose={() => setShowSaveDialog(false)}
            patternCode={patternCode}
            compilerResult={compilerResult}
            editingPattern={editingPattern}
            onSavePattern={onSavePattern}
          />

          {/* Mobile/Tablet actions */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-2">
            {/* Essential actions for mobile */}

            <Button variant="ghost" size="sm" onClick={onDownloadPattern} className="text-sm font-light p-2 sm:px-3">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>

            <MobileMenu 
              patternCode={patternCode}
              editingPattern={editingPattern}
              onShowSaveDialog={() => setShowSaveDialog(true)}
            />
          </div>
        </div>

        <MobileMenu 
          patternCode={patternCode}
          editingPattern={editingPattern}
          onShowSaveDialog={() => setShowSaveDialog(true)}
        />
      </div>
    </header>
  )
}