"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useDiagramTransform } from "@/hooks/use-diagram-transform"
import { calculateStitchPositions, type StitchPosition } from "@/lib/pattern-positioning"
import { loadAllSVGs, getSVGContent, createStitchElement } from "@/lib/svg-utils"
import { STITCH_SVG_MAP } from "@/lib/stitch-mappings"

interface EnhancedCrochetDiagramProps {
  patternSequence: string[]
  patternType?: "linear" | "circular" | "granny-square"
  centerX?: number
  centerY?: number
  scale?: number
}

export default function EnhancedCrochetDiagram({ 
  patternSequence, 
  patternType = "linear",
  centerX = 300,
  centerY = 300,
  scale = 0.8
}: EnhancedCrochetDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [stitchPositions, setStitchPositions] = useState<StitchPosition[]>([])
  const [svgsLoaded, setSvgsLoaded] = useState(false)
  
  // Find the index of the first turn command
  const firstTurnIndex = patternSequence.findIndex(stitch => 
    stitch.toLowerCase().includes('turn')
  )
  
  const {
    transform,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetView
  } = useDiagramTransform()

  // Calculate stitch positions
  useEffect(() => {
    const positions = calculateStitchPositions(patternSequence, patternType, centerX, centerY)
    setStitchPositions(positions)
  }, [patternSequence, patternType, centerX, centerY])

  // Load all required SVGs
  useEffect(() => {
    if (patternSequence.length > 0) {
      loadAllSVGs(patternSequence).then(() => {
        setSvgsLoaded(true)
      })
    }
  }, [patternSequence])

  // Container ref for event listeners
  const containerRef = useRef<HTMLDivElement>(null)

  // Prevent page scrolling and zooming when interacting with diagram
  const handleContainerWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleWheel(e)
  }, [handleWheel])

  const handleContainerContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
    // Prevent default to stop page zooming on mobile
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  }, [])

  const handleContainerTouchMove = useCallback((e: React.TouchEvent) => {
    // Prevent default to stop page scrolling on mobile
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // Add native event listeners for better scroll prevention
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Convert to React wheel event format and call handleWheel
      const event = {
        preventDefault: () => {},
        stopPropagation: () => {},
        deltaY: e.deltaY,
        clientX: e.clientX,
        clientY: e.clientY,
        currentTarget: e.currentTarget,
        target: e.target
      } as React.WheelEvent<SVGSVGElement>
      
      handleWheel(event)
    }

    const handleNativeScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    // Add listeners with passive: false to ensure preventDefault works
    container.addEventListener('wheel', handleNativeWheel, { passive: false })
    container.addEventListener('scroll', handleNativeScroll, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleNativeWheel)
      container.removeEventListener('scroll', handleNativeScroll)
    }
  }, [handleWheel, transform.scale])

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-white overflow-hidden relative"
      onWheel={handleContainerWheel}
      onContextMenu={handleContainerContextMenu}
      onTouchStart={handleContainerTouchStart}
      onTouchMove={handleContainerTouchMove}
      style={{ 
        touchAction: 'none', // Disable browser touch gestures
        userSelect: 'none', // Prevent text selection
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Control overlay */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={resetView}
          className="px-3 py-1 bg-white border border-gray-300 rounded-md text-xs hover:bg-gray-50 shadow-sm"
          title="Reset View"
        >
          Reset
        </button>
        <div className="px-3 py-1 bg-white border border-gray-300 rounded-md text-xs shadow-sm">
          {Math.round(transform.scale * 100)}%
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-2 left-2 z-10 px-3 py-1 bg-white/90 border border-gray-300 rounded-md text-xs text-gray-600 shadow-sm">
        Drag to pan • Scroll to zoom
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        className={`border border-gray-200 rounded-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ background: 'linear-gradient(to bottom, #fafafa, #f5f5f5)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleContainerWheel}
      >
        {/* Grid background for reference */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Main transform group */}
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>

          {/* Render stitches */}
          {stitchPositions.map((position, index) => {
            const stitchInfo = STITCH_SVG_MAP[position.stitchType] || STITCH_SVG_MAP['unknown']
            const svgContent = getSVGContent(stitchInfo.file)
            
            if (!svgContent && svgsLoaded) {
              // Fallback rendering when SVG not found
              const halfWidth = stitchInfo.width / 2
              const halfHeight = stitchInfo.height / 2
              
              return (
                <g
                  key={`stitch-fallback-${index}`}
                  transform={`translate(${position.x}, ${position.y}) rotate(${position.rotation}, ${halfWidth}, ${halfHeight})`}
                >
                  <circle
                    cx={halfWidth}
                    cy={halfHeight}
                    r="8"
                    fill="#e5e7eb"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                </g>
              )
            }

            const stitchElement = createStitchElement(svgContent)
            
            return (
              <g
                key={`stitch-${index}`}
                transform={`translate(${position.x}, ${position.y}) scale(${scale}) rotate(${position.rotation}, ${stitchInfo.width / 2}, ${stitchInfo.height / 2})`}
                className="stitch-group"
              >
                <g
                  dangerouslySetInnerHTML={{ __html: stitchElement }}
                  style={{ 
                    stroke: '#374151',
                    strokeWidth: '2',
                    fill: 'none'
                  }}
                />
              </g>
            )
          })}

          {/* Pattern info overlay */}
          {/* <text x="10" y="20" fontSize="12" fill="#6b7280" className="select-none">
            Pattern: {patternType} | Stitches: {patternSequence.length}
          </text> */}
          
          {patternSequence.length === 0 && (
            <text 
              x="300" 
              y="300" 
              textAnchor="middle" 
              fontSize="16" 
              fill="#9ca3af"
              className="select-none"
            >
              Write CrocheTeX to see your pattern
            </text>
          )}

        </g> {/* End main transform group */}
      </svg>
    </div>
  )
} 