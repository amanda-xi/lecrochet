"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EnhancedCrochetDiagram from "@/components/enhanced-crochet-diagram"
import Crochet3DRenderer from "./crochet-3d-renderer"
import ViewModeToggle, { ViewMode, View3DControls } from "./view-mode-toggle"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface PreviewPanelProps {
  compilerResult: CompilerResult | null
  isCompiling: boolean
}

export default function PreviewPanel({
  compilerResult,
  isCompiling
}: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [show3DVertices, setShow3DVertices] = useState(true)
  const [show3DEdges, setShow3DEdges] = useState(true)
  const [edgeOpacity, setEdgeOpacity] = useState(0.6)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-extralight flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <ViewModeToggle
              currentMode={viewMode}
              onModeChange={setViewMode}
              disabled={isCompiling || !compilerResult}
            />
            
            {/* Pattern stats */}
            {compilerResult && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-light">
                  {compilerResult.patternSequence.length} Stitches
                </Badge>
                {compilerResult.metadata?.rounds && compilerResult.metadata.rounds > 0 && (
                  <Badge variant="outline" className="font-light">
                    {compilerResult.metadata.rounds} Rounds
                  </Badge>
                )}
              </div>
            )}
            
            {/* Loading indicator */}
            {isCompiling && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
            )}
          </div>
        </div>
        
        {/* 3D Controls */}
        {viewMode === '3d' && compilerResult && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <View3DControls
              showVertices={show3DVertices}
              onShowVerticesChange={setShow3DVertices}
              showEdges={show3DEdges}
              onShowEdgesChange={setShow3DEdges}
              edgeOpacity={edgeOpacity}
              onEdgeOpacityChange={setEdgeOpacity}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="h-full px-6 pb-6">
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
            {viewMode === '2d' ? (
              <EnhancedCrochetDiagram 
                patternSequence={compilerResult?.patternSequence || []}
                patternType={compilerResult?.patternType || "linear"}
              />
            ) : (
              <Crochet3DRenderer
                patternSequence={compilerResult?.patternSequence || []}
                patternType={compilerResult?.patternType || "linear"}
                className="h-full"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 