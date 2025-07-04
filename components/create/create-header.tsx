"use client"

import { Play, Pause, Download, Share2, Settings, Sun, Moon, Monitor, Save, FileCode, Eye, AlertCircle, CheckCircle, Sparkles, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import Link from "next/link"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface CreateHeaderProps {
  isCompiling: boolean
  autoCompile: boolean
  onManualCompile: () => void
  onToggleAutoCompile: () => void
  onDownloadPattern: () => void
  compilerResult: CompilerResult | null
}

export default function CreateHeader({
  isCompiling,
  autoCompile,
  onManualCompile,
  onToggleAutoCompile,
  onDownloadPattern,
  compilerResult
}: CreateHeaderProps) {
  const { theme, setTheme } = useTheme()

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

  return (
    <header className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-extralight">Le Crochet</span>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-2">
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

            {compilerResult && (
              <div className="flex items-center gap-2">
                {compilerResult.success ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-light">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-light">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errorCount} Error{errorCount !== 1 ? 's' : ''}
                  </Badge>
                )}
                
                {warningCount > 0 && (
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300 font-light">
                    {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                  </Badge>
                )}

                {compilerResult.patternType !== "linear" && (
                  <Badge variant="outline" className="text-purple-700 border-purple-300 font-light">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {compilerResult.patternType}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={cycleTheme} className="text-sm font-light">
              {getThemeIcon()}
            </Button>

            <Button variant="ghost" size="sm" onClick={onDownloadPattern} className="text-sm font-light">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-light">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-light">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-light">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <Link href="/docs" target="_blank">
              <Button variant="ghost" size="sm" className="text-sm font-light">
                <BookOpen className="h-4 w-4 mr-2" />
                Help
              </Button>
            </Link>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" className="text-sm font-light">
              Sign In
            </Button>

            <Button size="sm" className="bg-black text-white hover:bg-gray-800 text-sm font-light px-6">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 