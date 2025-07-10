"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { compileEnhancedCrocheTeX, type CompilerResult } from "@/lib/enhanced-crochet-compiler"
import { EXAMPLE_PATTERNS } from "@/lib/pattern-examples"
import CreateHeader from "@/components/create/create-header"
import ExamplePatternsSelector from "@/components/create/example-patterns-selector"
import CodeEditorPanel from "@/components/create/code-editor-panel"
import PreviewPanel from "@/components/create/preview-panel"
import ResizableSplit from "@/components/ui/resizable-split"
import { useResponsive } from "@/hooks/use-responsive"

interface Pattern {
  id: string
  title: string
  description: string | null
  pattern_code: string
  is_public: boolean
  created_at: string
  updated_at: string
  user_id?: string
  author?: {
    name: string | null
    email: string
  } | null
}

export default function CreatePage() {
  const searchParams = useSearchParams()
  const patternId = searchParams.get('pattern')
  const { data: session } = useSession()
  
  const [code, setCode] = useState(EXAMPLE_PATTERNS["circular-doily"].code)
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [autoCompile, setAutoCompile] = useState(true)
  const [selectedExample, setSelectedExample] = useState("circular-doily")
  const [editingPattern, setEditingPattern] = useState<Pattern | null>(null)
  const [isLoadingPattern, setIsLoadingPattern] = useState(false)
  const [savedPatterns, setSavedPatterns] = useState<Pattern[]>([])
  const { theme } = useTheme()
  const { isMobile } = useResponsive()
  const [fullScreenMode, setFullScreenMode] = useState<'none' | 'code' | 'preview'>('none')

  // Load user's saved patterns
  const loadSavedPatterns = useCallback(async () => {
    try {
      const response = await fetch('/api/patterns')
      if (response.ok) {
        const data = await response.json()
        setSavedPatterns(data.patterns || [])
      }
    } catch (error) {
      console.error('Error loading saved patterns:', error)
    }
  }, [])

  // Load specific pattern for editing
  const loadPattern = useCallback(async (id: string) => {
    setIsLoadingPattern(true)
    try {
      const response = await fetch(`/api/patterns/${id}`)
      if (response.ok) {
        const data = await response.json()
        const pattern = data.pattern
        setEditingPattern(pattern)
        setCode(pattern.pattern_code)
        setSelectedExample(`saved-${pattern.id}`)
      } else {
        console.error('Failed to load pattern')
      }
    } catch (error) {
      console.error('Error loading pattern:', error)
    } finally {
      setIsLoadingPattern(false)
    }
  }, [])

  // Load patterns and handle URL pattern parameter
  useEffect(() => {
    loadSavedPatterns()
    
    if (patternId) {
      loadPattern(patternId)
    }
  }, [patternId, loadPattern, loadSavedPatterns])

  const handleCompile = useCallback(async (crochetCode: string) => {
    if (!autoCompile) return
    
    setIsCompiling(true)
    try {
      // Simulate compilation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100))
      const result = compileEnhancedCrocheTeX(crochetCode)
      setCompilerResult(result)
    } catch (error) {
      console.error("Compilation error:", error)
    } finally {
      setIsCompiling(false)
    }
  }, [autoCompile])

  const manualCompile = () => {
    handleCompile(code)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleExampleChange = (exampleKey: string) => {
    setSelectedExample(exampleKey)
    
    // Handle saved patterns
    if (exampleKey.startsWith('saved-')) {
      const patternId = exampleKey.replace('saved-', '')
      const pattern = savedPatterns.find(p => p.id === patternId)
      if (pattern) {
        setCode(pattern.pattern_code)
        setEditingPattern(pattern)
        // Update URL without triggering a reload
        window.history.pushState({}, '', `/create?pattern=${pattern.id}`)
      }
    } else {
      // Handle static examples
      const example = EXAMPLE_PATTERNS[exampleKey as keyof typeof EXAMPLE_PATTERNS]
      if (example) {
        setCode(example.code)
        setEditingPattern(null)
        // Clear URL parameter when switching to examples
        window.history.pushState({}, '', '/create')
      }
    }
  }



  const handleSavePattern = (pattern: Pattern) => {
    console.log('Pattern saved:', pattern)
    
    // If we were editing, update the editing pattern
    if (editingPattern) {
      setEditingPattern(pattern)
    }
    
    // Refresh saved patterns list
    loadSavedPatterns()
  }

  // Full screen functionality
  const toggleCodeFullScreen = useCallback(() => {
    setFullScreenMode(prev => prev === 'code' ? 'none' : 'code')
  }, [])

  const togglePreviewFullScreen = useCallback(() => {
    setFullScreenMode(prev => prev === 'preview' ? 'none' : 'preview')
  }, [])

  const exitFullScreen = useCallback(() => {
    setFullScreenMode('none')
  }, [])

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullScreenMode !== 'none') {
        exitFullScreen()
      }
    }

    if (fullScreenMode !== 'none') {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fullScreenMode, exitFullScreen])

  // Initial compilation
  useEffect(() => {
    handleCompile(code)
  }, [code, handleCompile])

  const isEditMode = !!editingPattern
  const isOwnPattern = editingPattern && (
    editingPattern.user_id === session?.user?.email || 
    editingPattern.author?.email === session?.user?.email
  )
  const isViewingOthersPattern = editingPattern && !isOwnPattern

  const getPageTitle = () => {
    if (!isEditMode) return 'Create Pattern'
    if (isViewingOthersPattern) return `View: ${editingPattern.title}`
    return `Edit: ${editingPattern.title}`
  }

  const getPageDescription = () => {
    if (!isEditMode) {
      return 'Write your crochet pattern using CrocheTeX and see it render in real-time.'
    }
    if (isViewingOthersPattern) {
      const authorName = editingPattern.author?.name || 'Unknown Author'
      return `You're viewing ${authorName}'s pattern. You can save a copy to your account to make edits.`
    }
    return 'Editing your saved pattern. Changes will update the existing pattern.'
  }

  return (
    <div className="min-h-screen bg-background">
      <CreateHeader
        isCompiling={isCompiling}
        autoCompile={autoCompile}
        onManualCompile={manualCompile}
        onToggleAutoCompile={() => setAutoCompile(!autoCompile)}
        compilerResult={compilerResult}
        patternCode={code}
        onSavePattern={handleSavePattern}
        editingPattern={editingPattern}
      />

      <main className="container mx-auto px-6 py-6 max-w-none">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight leading-tight mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-base text-gray-600 font-light leading-relaxed">
            {getPageDescription()}
          </p>
        </div>

        <div className="mb-6">
          <ExamplePatternsSelector
            selectedExample={selectedExample}
            onExampleChange={handleExampleChange}
            savedPatterns={savedPatterns}
            isLoading={isLoadingPattern}
          />
        </div>

        <div className={fullScreenMode !== 'none' ? "fixed inset-0 z-50 bg-background" : "min-h-[700px] lg:h-[calc(100vh-300px)]"}>
          {fullScreenMode === 'code' ? (
            <div className="h-full w-full">
              <CodeEditorPanel
                code={code}
                onCodeChange={handleCodeChange}
                onCompile={autoCompile ? handleCompile : undefined}
                theme={theme === "dark" ? "dark" : "light"}
                compilerResult={compilerResult}
                isFullScreen={true}
                onToggleFullScreen={toggleCodeFullScreen}
              />
            </div>
          ) : fullScreenMode === 'preview' ? (
            <div className="h-full w-full">
              <PreviewPanel
                compilerResult={compilerResult}
                isCompiling={isCompiling}
                isFullScreen={true}
                onToggleFullScreen={togglePreviewFullScreen}
              />
            </div>
          ) : (
            <ResizableSplit
              disabled={isMobile}
              defaultSplit={50}
              minSplit={25}
              maxSplit={75}
              className="h-full"
            >
              <CodeEditorPanel
                code={code}
                onCodeChange={handleCodeChange}
                onCompile={autoCompile ? handleCompile : undefined}
                theme={theme === "dark" ? "dark" : "light"}
                compilerResult={compilerResult}
                isFullScreen={false}
                onToggleFullScreen={toggleCodeFullScreen}
              />
              <PreviewPanel
                compilerResult={compilerResult}
                isCompiling={isCompiling}
                isFullScreen={false}
                onToggleFullScreen={togglePreviewFullScreen}
              />
            </ResizableSplit>
          )}
        </div>
      </main>
    </div>
  )
}