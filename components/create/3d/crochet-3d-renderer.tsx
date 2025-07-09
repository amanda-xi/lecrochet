"use client"

import React, { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  processCrochetPattern, 
  calculateCameraPosition
} from '@/lib/3d-pattern-processor'
import CrochetScene from '../crochet-scene'
import StitchTooltip from './stitch-tooltip'
import { HoveredStitchInfo } from './stitch-vertex'
import { parsePatternStructure } from '../pattern-structure-parser'
import CrochetLegend from './crochet-3d-legend'

interface Crochet3DRendererProps {
  patternSequence: string[]
  patternType: 'linear' | 'circular' | 'granny-square'
  className?: string
  showVertices?: boolean
  showEdges?: boolean
  edgeOpacity?: number
}











export default function Crochet3DRenderer({ 
  patternSequence, 
  patternType, 
  className = "",
  showVertices = true,
  showEdges = true,
  edgeOpacity = 0.6
}: Crochet3DRendererProps) {
  const [hoveredStitch, setHoveredStitch] = useState<HoveredStitchInfo | null>(null)
  
  const geometry = useMemo(() => {
    return processCrochetPattern(patternSequence, patternType, {
      scale: 1,
      centerPattern: true,
      maxVertices: 200 // Limit for performance
    })
  }, [patternSequence, patternType])

  const stitchStructure = useMemo(() => {
    return parsePatternStructure(patternSequence, patternType)
  }, [patternSequence, patternType])

  const { position: cameraPosition, target: cameraTarget } = useMemo(() => {
    return calculateCameraPosition(geometry)
  }, [geometry])

  const handleStitchHover = (info: HoveredStitchInfo) => {
    setHoveredStitch(info)
  }

  const handleStitchHoverOut = () => {
    setHoveredStitch(null)
  }

  if (patternSequence.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-2">🧶</div>
          <div>No pattern to display</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className}`} data-testid="3d-view">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <CrochetScene 
          geometry={geometry}
          cameraPosition={cameraPosition}
          cameraTarget={cameraTarget}
          showVertices={showVertices}
          showEdges={showEdges}
          edgeOpacity={edgeOpacity}
          onStitchHover={handleStitchHover}
          onStitchHoverOut={handleStitchHoverOut}
          stitchStructure={stitchStructure}
        />
      </Canvas>
      
      {/* Stitch hover tooltip */}
      <StitchTooltip hoveredStitch={hoveredStitch} patternType={patternType} />
      
      {/* Pattern info overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm space-y-1">
        <div className="font-medium">3D Pattern View</div>
        <div className="text-gray-600">
          {geometry.vertices.length} vertices, {geometry.edges.length} connections
        </div>
        <div className="text-gray-500 text-xs">
          {showVertices ? '✓' : '✗'} Vertices {showEdges ? '✓' : '✗'} Edges
          {showEdges && ` (${Math.round(edgeOpacity * 100)}% opacity)`}
        </div>
        <div className="text-gray-500 text-xs">
          Use mouse to rotate, zoom, and hold command to pan
        </div>
      </div>
      
      {/* Stitch Legend */}
      <CrochetLegend 
        patternSequence={patternSequence}
        className="absolute bottom-4 left-4 w-64 max-w-[calc(100vw-2rem)]"
      />
    </div>
  )
} 