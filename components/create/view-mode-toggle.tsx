"use client"

import React from 'react'
import { Box, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ViewMode = '2d' | '3d'

interface ViewModeToggleProps {
  currentMode: ViewMode
  onModeChange: (mode: ViewMode) => void
  disabled?: boolean
}

export default function ViewModeToggle({ 
  currentMode, 
  onModeChange, 
  disabled = false 
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-2 border rounded-lg p-1 bg-gray-50">
      <Button
        variant={currentMode === '2d' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('2d')}
        disabled={disabled}
        className="flex items-center gap-1 h-8 px-3"
      >
        <Layers className="h-4 w-4" />
        <span className="text-xs font-medium">2D</span>
      </Button>
      
      <Button
        variant={currentMode === '3d' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('3d')}
        disabled={disabled}
        className="flex items-center gap-1 h-8 px-3"
      >
        <Box className="h-4 w-4" />
        <span className="text-xs font-medium">3D</span>
      </Button>
    </div>
  )
}

// Additional controls for 3D view
interface View3DControlsProps {
  showEdges: boolean
  onShowEdgesChange: (show: boolean) => void
  showVertices: boolean
  onShowVerticesChange: (show: boolean) => void
  edgeOpacity: number
  onEdgeOpacityChange: (opacity: number) => void
}

export function View3DControls({
  showEdges,
  onShowEdgesChange,
  showVertices,
  onShowVerticesChange,
  edgeOpacity,
  onEdgeOpacityChange
}: View3DControlsProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={showVertices}
          onChange={(e) => onShowVerticesChange(e.target.checked)}
          className="rounded border-gray-400 bg-gray-100 text-indigo-600 accent-indigo-500"
        />
        <span>Vertices</span>
      </label>
  
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="checkbox"
          checked={showEdges}
          onChange={(e) => onShowEdgesChange(e.target.checked)}
          className="rounded border-gray-400 bg-gray-100 text-indigo-600 accent-indigo-500"
        />
        <span>Edges</span>
      </label>
  
      {showEdges && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-600">Opacity:</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={edgeOpacity}
            onChange={(e) => onEdgeOpacityChange(parseFloat(e.target.value))}
            className="w-16 accent-indigo-500"
          />
          <span className="text-xs text-gray-600 w-8">
            {Math.round(edgeOpacity * 100)}%
          </span>
        </div>
      )}
    </div>
  )
} 