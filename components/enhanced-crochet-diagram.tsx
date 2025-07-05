"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface EnhancedCrochetDiagramProps {
  patternSequence: string[]
  patternType?: "linear" | "circular" | "granny-square"
  centerX?: number
  centerY?: number
  scale?: number
}

interface StitchPosition {
  x: number
  y: number
  rotation: number
  stitchType: string
}

interface Transform {
  x: number
  y: number
  scale: number
}

// Comprehensive stitch mapping using available SVG files
const STITCH_SVG_MAP: Record<string, { file: string; width: number; height: number }> = {
  // Basic stitches
  'chain': { file: 'ch.svg', width: 32, height: 16 },
  'ch': { file: 'ch.svg', width: 32, height: 16 },
  'single-crochet': { file: 'sc.svg', width: 32, height: 32 },
  'sc': { file: 'sc.svg', width: 32, height: 32 },
  'double-crochet': { file: 'dc.svg', width: 32, height: 80 },
  'dc': { file: 'dc.svg', width: 32, height: 80 },
  'half-double': { file: 'hdc.svg', width: 32, height: 48 },
  'hdc': { file: 'hdc.svg', width: 32, height: 48 },
  'treble': { file: 'tr.svg', width: 32, height: 96 },
  'tr': { file: 'tr.svg', width: 32, height: 96 },
  'double-treble': { file: 'dtr.svg', width: 32, height: 112 },
  'dtr': { file: 'dtr.svg', width: 32, height: 112 },
  'slip-stitch': { file: 'sl_st.svg', width: 32, height: 20 },
  'sl': { file: 'sl_st.svg', width: 32, height: 20 },
  
  // Post stitches
  'front-post-dc': { file: 'FPdc.svg', width: 32, height: 80 },
  'fpdc': { file: 'FPdc.svg', width: 32, height: 80 },
  'back-post-dc': { file: 'BPdc.svg', width: 32, height: 80 },
  'bpdc': { file: 'BPdc.svg', width: 32, height: 80 },
  'front-post-tr': { file: 'FPtr.svg', width: 32, height: 96 },
  'fptr': { file: 'FPtr.svg', width: 32, height: 96 },
  'back-post-tr': { file: 'BPtr.svg', width: 32, height: 96 },
  'bptr': { file: 'BPtr.svg', width: 32, height: 96 },
  
  // Decrease stitches
  'sc2tog': { file: 'sc2tog.svg', width: 48, height: 32 },
  'dc2tog': { file: 'dc2tog.svg', width: 48, height: 80 },
  'dc3tog': { file: 'dc3tog.svg', width: 64, height: 80 },
  'sc3tog': { file: 'sc3tog.svg', width: 64, height: 32 },
  
  // Cluster stitches
  '3dc-cluster': { file: '3dc_cluster.svg', width: 48, height: 80 },
  '3hdc-cluster': { file: '3hdc_cluster.svg', width: 48, height: 48 },
  'cluster': { file: '3dc_cluster.svg', width: 48, height: 80 },
  
  // Shell and fan stitches
  '5dc-shell': { file: '5dc_shell.svg', width: 80, height: 80 },
  'shell': { file: '5dc_shell.svg', width: 80, height: 80 },
  '5dc-popcorn': { file: '5dc_popcorn.svg', width: 48, height: 80 },
  'popcorn': { file: '5dc_popcorn.svg', width: 48, height: 80 },
  
  // Special elements
  'magic-ring': { file: 'adjustable_ring.svg', width: 48, height: 48 },
  'ring': { file: 'ring.svg', width: 48, height: 48 },
  'start': { file: 'start.svg', width: 24, height: 24 },
  'end': { file: 'end.svg', width: 24, height: 24 },
  
  // Default fallback
  'unknown': { file: 'unknown.svg', width: 32, height: 32 },
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
  const [loadedSVGs, setLoadedSVGs] = useState<Map<string, string>>(new Map())
  
  // Transform state for pan and zoom
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  // Drag and zoom handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y
    
    // Apply sensitivity multiplier to reduce drag sensitivity
    const sensitivity = 0.5 // Lower value = less sensitive
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + (deltaX * sensitivity) / prev.scale,
      y: prev.y + (deltaY * sensitivity) / prev.scale
    }))
    
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }, [isDragging, lastMousePos])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.1, Math.min(5, transform.scale * scaleFactor))
    
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }))
  }, [transform.scale])

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [])

  // Load SVG content
  const loadSVG = useCallback(async (filename: string): Promise<string> => {
    if (loadedSVGs.has(filename)) {
      return loadedSVGs.get(filename)!
    }
    
    try {
      const response = await fetch(`/stitches/${filename}`)
      if (!response.ok) {
        console.warn(`Could not load SVG: ${filename}`)
        return ''
      }
      const svgContent = await response.text()
      setLoadedSVGs(prev => new Map(prev).set(filename, svgContent))
      return svgContent
    } catch (error) {
      console.error(`Error loading SVG ${filename}:`, error)
      return ''
    }
  }, [loadedSVGs])

  // Calculate positions based on pattern type
  const calculatePositions = useCallback((): StitchPosition[] => {
    if (patternSequence.length === 0) return []

    const positions: StitchPosition[] = []
    
    if (patternType === "circular" || patternType === "granny-square") {
      // Circular/granny square pattern
      let currentRadius = 60
      let currentAngle = 0
      let stitchesInCurrentRound = 0
      let expectedStitchesInRound = 6 // Start with 6 for typical granny square

      patternSequence.forEach((stitchType) => {
        // Special handling for magic ring start
        if (stitchType === 'magic-ring' || stitchType === 'ring') {
          positions.push({
            x: centerX - 24,
            y: centerY - 24,
            rotation: 0,
            stitchType
          })
          return
        }

        // Calculate position on circle
        const x = centerX + Math.cos(currentAngle) * currentRadius - 16
        const y = centerY + Math.sin(currentAngle) * currentRadius - 16
        const rotation = 0 // Keep symbols upright for readability

        positions.push({
          x,
          y,
          rotation,
          stitchType
        })

        stitchesInCurrentRound++
        
        // Move to next position
        currentAngle += (2 * Math.PI) / expectedStitchesInRound

        // Check if we've completed the round
        if (stitchesInCurrentRound >= expectedStitchesInRound) {
          currentRadius += 50 // Increase radius for next round
          expectedStitchesInRound = Math.max(6, Math.floor(expectedStitchesInRound * 1.5)) // Increase stitches per round
          stitchesInCurrentRound = 0
          currentAngle = 0
        }
      })
    } else {
      // Linear pattern
      let currentX = 50
      let currentY = 150
      let rowHeight = 0

      patternSequence.forEach((stitchType) => {
        const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
        
        // Handle row breaks and turns
        if (stitchType === 'turn') {
          currentX = 50
          currentY += rowHeight + 30
          rowHeight = 0
          return
        }

        positions.push({
          x: currentX,
          y: currentY,
          rotation: 0,
          stitchType
        })

        // Update position for next stitch
        currentX += Math.max(stitchInfo.width * 0.9, 35) // Spacing between stitches
        rowHeight = Math.max(rowHeight, stitchInfo.height)
      })
    }

    return positions
  }, [patternSequence, patternType, centerX, centerY])

  // Extract SVG content and create simplified version
  const createStitchElement = (svgContent: string): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgContent, 'image/svg+xml')
    const svgElement = doc.querySelector('svg')
    
    if (!svgElement) return `<circle r="8" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>`
    
    // Extract paths and basic shapes
    const paths = Array.from(svgElement.querySelectorAll('path, circle, ellipse, rect, line'))
    const pathElements = paths.map(el => el.outerHTML).join('')
    
    return pathElements || `<circle r="8" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>`
  }

  // Render the diagram
  useEffect(() => {
    const positions = calculatePositions()
    setStitchPositions(positions)
  }, [patternSequence, patternType, centerX, centerY, calculatePositions])

  // Load all required SVGs
  useEffect(() => {
    const uniqueStitchTypes = [...new Set(patternSequence)]
    
    const loadAllSVGs = async () => {
      const promises = uniqueStitchTypes.map(async (stitchType) => {
        const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
        return loadSVG(stitchInfo.file)
      })
      
      await Promise.all(promises)
    }

    if (uniqueStitchTypes.length > 0) {
      loadAllSVGs()
    }
  }, [patternSequence, loadSVG])

  // Global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y
      
      // Apply sensitivity multiplier to reduce drag sensitivity
      const sensitivity = 0.5 // Lower value = less sensitive
      
      setTransform(prev => ({
        ...prev,
        x: prev.x + (deltaX * sensitivity) / prev.scale,
        y: prev.y + (deltaY * sensitivity) / prev.scale
      }))
      
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, lastMousePos, transform.scale])

  return (
    <div className="w-full h-full bg-white overflow-hidden relative">
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
        onWheel={handleWheel}
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

          {/* Render connecting lines for circular patterns */}
          {stitchPositions.length > 1 && patternType === "circular" && (
            <g className="connections">
              {stitchPositions.slice(1).map((position, index) => (
                <line
                  key={`connection-${index}`}
                  x1={centerX}
                  y1={centerY}
                  x2={position.x + 16}
                  y2={position.y + 16}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  opacity="0.4"
                />
              ))}
            </g>
          )}

          {/* Render stitches */}
          {stitchPositions.map((position, index) => {
            const stitchInfo = STITCH_SVG_MAP[position.stitchType] || STITCH_SVG_MAP['unknown']
            const svgContent = loadedSVGs.get(stitchInfo.file)
            
            if (!svgContent) {
              // Fallback rendering while loading
              return (
                <circle
                  key={`stitch-fallback-${index}`}
                  cx={position.x + 16}
                  cy={position.y + 16}
                  r="8"
                  fill="#e5e7eb"
                  stroke="#9ca3af"
                  strokeWidth="2"
                />
              )
            }

            const stitchElement = createStitchElement(svgContent)
            
            return (
              <g
                key={`stitch-${index}`}
                transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
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
                
                {/* Add stitch number for reference */}
                {patternType === "linear" && index < 20 && (
                  <text
                    x={stitchInfo.width / 2}
                    y={-8}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                    className="select-none"
                  >
                    {index + 1}
                  </text>
                )}
              </g>
            )
          })}

          {/* Pattern info overlay */}
          <text x="10" y="20" fontSize="12" fill="#6b7280" className="select-none">
            Pattern: {patternType} | Stitches: {patternSequence.length}
          </text>
          
          {patternSequence.length === 0 && (
            <text 
              x="300" 
              y="300" 
              textAnchor="middle" 
              fontSize="16" 
              fill="#9ca3af"
              className="select-none"
            >
              Write CrochetScript to see your pattern
            </text>
          )}

        </g> {/* End main transform group */}
      </svg>
    </div>
  )
} 