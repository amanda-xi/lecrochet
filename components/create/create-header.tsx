"use client"

import { Play, Pause, Settings, Save, Eye, User, Calendar, Clock } from "lucide-react"
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
import ExportDropdown from "./header/export-dropdown"
import HelpDropdown from "./header/help-dropdown"

interface CreateHeaderProps {
  isCompiling: boolean
  autoCompile: boolean
  onManualCompile: () => void
  onToggleAutoCompile: () => void
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
  compilerResult,
  patternCode = "",
  onSavePattern,
  editingPattern
}: CreateHeaderProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession()

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
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="lg:hidden">
              <MobileMenu
                isOpen={mobileMenuOpen}
                setIsOpen={setMobileMenuOpen}
                patternCode={patternCode}
                editingPattern={editingPattern}
                onShowSaveDialog={() => setShowSaveDialog(true)}
                isViewingOthersPattern={!!isViewingOthersPattern}
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/" className="text-xl font-light tracking-wide">
                Le Crochet
              </Link>
            </div>
            
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            
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

            <StatusBadges compilerResult={compilerResult} />
          </div>

          <div className="hidden lg:flex items-center gap-2">

            <ExportDropdown 
              patternCode={patternCode}
              compilerResult={compilerResult}
              editingPattern={editingPattern}
            />

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

            {isViewingOthersPattern && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-light"
                onClick={() => setShowSaveDialog(true)}
                disabled={!session?.user || !patternCode?.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}

            <ShareButton editingPattern={editingPattern} />

            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-sm font-light">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>

            <HelpDropdown className="text-sm font-light" />

            <Separator orientation="vertical" className="h-6" />

            <AuthSection />
          </div>

          {/* <div className="flex lg:hidden items-center gap-1 sm:gap-2">
            <ExportDropdown 
              patternCode={patternCode}
              compilerResult={compilerResult}
              editingPattern={editingPattern}
              className="p-2 sm:px-3"
            />
          </div> */}
        </div>
      </div>
      <SavePatternDialog 
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        patternCode={patternCode}
        compilerResult={compilerResult}
        editingPattern={editingPattern}
        onSavePattern={onSavePattern}
        isCopyMode={!!isViewingOthersPattern}
      />
    </header>
  )
}