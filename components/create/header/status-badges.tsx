"use client"

import { AlertCircle, CheckCircle, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface StatusBadgesProps {
  compilerResult: CompilerResult | null
}

export default function StatusBadges({ compilerResult }: StatusBadgesProps) {
  if (!compilerResult) return null

  const errorCount = compilerResult.errors.filter(e => e.severity === "error").length
  const warningCount = compilerResult.errors.filter(e => e.severity === "warning").length

  return (
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
  )
} 