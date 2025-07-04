"use client"

import { Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EnhancedCrochetDiagram from "@/components/enhanced-crochet-diagram"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface PreviewPanelProps {
  compilerResult: CompilerResult | null
  isCompiling: boolean
}

export default function PreviewPanel({
  compilerResult,
  isCompiling
}: PreviewPanelProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-extralight flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            {compilerResult && (
              <>
                <Badge variant="outline" className="font-light">
                  {compilerResult.patternSequence.length} Stitches
                </Badge>
                {compilerResult.metadata?.rounds && compilerResult.metadata.rounds > 0 && (
                  <Badge variant="outline" className="font-light">
                    {compilerResult.metadata.rounds} Rounds
                  </Badge>
                )}
              </>
            )}
            {isCompiling && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-full px-6 pb-6">
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <EnhancedCrochetDiagram 
              patternSequence={compilerResult?.patternSequence || []}
              patternType={compilerResult?.patternType || "linear"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 