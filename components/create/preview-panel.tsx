"use client"

import { useState } from "react"
import { Eye, Maximize2, Minimize2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import EnhancedCrochetDiagram from "@/components/enhanced-crochet-diagram"
import Crochet3DRenderer from "./3d/crochet-3d-renderer"
import ViewModeToggle, { ViewMode, View3DControls } from "./view-mode-toggle"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface PreviewPanelProps {
  compilerResult: CompilerResult | null
  isCompiling: boolean
  isFullScreen?: boolean
  onToggleFullScreen?: () => void
}

export default function PreviewPanel({
  compilerResult,
  isCompiling,
  isFullScreen = false,
  onToggleFullScreen
}: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [show3DVertices, setShow3DVertices] = useState(true)
  const [show3DEdges, setShow3DEdges] = useState(true)
  const [edgeOpacity, setEdgeOpacity] = useState(0.6)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl font-extralight flex items-center gap-2">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              Live Preview
            </CardTitle>
            <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
              {/* Full screen toggle */}
              {onToggleFullScreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleFullScreen}
                  className="flex items-center gap-1 flex-shrink-0 px-2 sm:px-3"
                  title={isFullScreen ? "Exit Full Screen (Esc)" : "Enter Full Screen"}
                >
                  {isFullScreen ? <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {/* <span className="hidden sm:inline">{isFullScreen ? "Exit Full Screen" : "Full Screen"}</span> */}
                </Button>
              )}
              
              {/* View mode toggle */}
              <ViewModeToggle
                currentMode={viewMode}
                onModeChange={setViewMode}
                disabled={isCompiling || !compilerResult}
              />
              
              {/* Pattern stats */}
              {compilerResult && (
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <Badge variant="outline" className="font-light text-xs px-1.5 py-0.5">
                    {compilerResult.patternSequence.length} Stitches
                  </Badge>
                  {compilerResult.metadata?.rounds && compilerResult.metadata.rounds > 0 && (
                    <Badge variant="outline" className="font-light text-xs px-1.5 py-0.5">
                      {compilerResult.metadata.rounds} Rounds
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Loading indicator */}
              {isCompiling && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent flex-shrink-0"></div>
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
      
      <CardContent className="flex-1 p-0 min-h-0">
        <div className="h-full px-6 pb-6">
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
            {viewMode === '2d' ? (
              <div className="w-full h-full">
                <EnhancedCrochetDiagram 
                  patternSequence={compilerResult?.patternSequence || []}
                  patternType={compilerResult?.patternType || "linear"}
                />
              </div>
            ) : (
              <div className="w-full h-full">
                <Crochet3DRenderer
                  patternSequence={compilerResult?.patternSequence || []}
                  patternType={compilerResult?.patternType || "linear"}
                  className="w-full h-full"
                  showVertices={show3DVertices}
                  showEdges={show3DEdges}
                  edgeOpacity={edgeOpacity}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 