"use client"

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'
import { 
  processCrochetPattern, 
  calculateCameraPosition,
  getStitchColor,
  getEdgeColor,
  getVertexSize
} from '@/lib/3d-pattern-processor'
import { CrochetGeometry } from '@/lib/3d-geometry-utils'
import CrochetLegend from './crochet-3d-legend'

interface Crochet3DRendererProps {
  patternSequence: string[]
  patternType: 'linear' | 'circular' | 'granny-square'
  className?: string
  showVertices?: boolean
  showEdges?: boolean
  edgeOpacity?: number
}

interface HoveredStitchInfo {
  id: string
  stitchType: string
  round: number
  position: number
  x: number
  y: number
  z: number
  screenX: number
  screenY: number
}

// Map stitch types to SVG filenames
const getStitchSVG = (stitchType: string): string => {
  const stitchMap: Record<string, string> = {
    'sc': 'sc.svg',
    'single': 'sc.svg',
    'dc': 'dc.svg',
    'double': 'dc.svg',
    'hdc': 'hdc.svg',
    'half-double': 'hdc.svg',
    'tr': 'tr.svg',
    'treble': 'tr.svg',
    'dtr': 'dtr.svg',
    'double-treble': 'dtr.svg',
    'ch': 'ch.svg',
    'chain': 'ch.svg',
    'sl': 'sl_st.svg',
    'slip': 'sl_st.svg',
    'sl_st': 'sl_st.svg',
    'slip-stitch': 'sl_st.svg',
    'sc2tog': 'sc2tog.svg',
    'dc2tog': 'dc2tog.svg',
    'sc3tog': 'sc3tog.svg',
    'dc3tog': 'dc3tog.svg',
    'ring': 'ring.svg',
    'magic-ring': 'adjustable_ring.svg',
    'adjustable-ring': 'adjustable_ring.svg',
    'FPdc': 'FPdc.svg',
    'BPdc': 'BPdc.svg',
    'FPtr': 'FPtr.svg',
    'BPtr': 'BPtr.svg',
    'picot': 'ch3_picot.svg',
    'shell': '5dc_shell.svg',
    'cluster': '3dc_cluster.svg',
    'popcorn': '5dc_popcorn.svg'
  }
  
  const normalized = stitchType.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return stitchMap[normalized] || stitchMap[stitchType.toLowerCase()] || 'unknown.svg'
}

// Individual vertex component
function StitchVertex({ 
  position, 
  color, 
  size,
  stitchInfo,
  onHover,
  onHoverOut
}: { 
  position: [number, number, number]
  color: string
  size: number
  stitchInfo: {
    id: string
    stitchType: string
    round: number
    position: number
  }
  onHover: (info: HoveredStitchInfo) => void
  onHoverOut: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, gl } = useThree()
  
  // Add subtle animation for better visualization
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  const handlePointerOver = () => {
    // Convert 3D position to screen coordinates
    const vector = new THREE.Vector3(...position)
    vector.project(camera)
    
    const canvas = gl.domElement
    const rect = canvas.getBoundingClientRect()
    const x = (vector.x * 0.5 + 0.5) * canvas.clientWidth + rect.left
    const y = (-vector.y * 0.5 + 0.5) * canvas.clientHeight + rect.top
    
    onHover({
      ...stitchInfo,
      x: position[0],
      y: position[1], 
      z: position[2],
      screenX: x,
      screenY: y
    })
  }

  const handlePointerOut = () => {
    onHoverOut()
  }

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[size * 2, 12, 8]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.4}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}

// Individual edge component
function StitchEdge({ 
  fromPosition, 
  toPosition, 
  color, 
  connectionType,
  opacity = 0.6
}: { 
  fromPosition: [number, number, number]
  toPosition: [number, number, number]
  color: string
  connectionType: 'yarn' | 'structure' | 'join'
  opacity?: number
}) {
  const points = useMemo(() => {
    const from = new THREE.Vector3(...fromPosition)
    const to = new THREE.Vector3(...toPosition)
    
    // Add curvature for yarn connections
    if (connectionType === 'yarn') {
      const midpoint = from.clone().add(to).multiplyScalar(0.5)
      const distance = from.distanceTo(to)
      const curvature = Math.min(10, distance * 0.2)
      
      // Add some downward sag for yarn
      midpoint.y -= curvature
      
      return [from, midpoint, to]
    }
    
    return [from, to]
  }, [fromPosition, toPosition, connectionType])

  const curve = useMemo(() => {
    if (points.length === 3) {
      return new THREE.QuadraticBezierCurve3(points[0], points[1], points[2])
    }
    return new THREE.LineCurve3(points[0], points[1])
  }, [points])

  const geometry = useMemo(() => {
    const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.5, 8, false)
    return tubeGeometry
  }, [curve])

  const finalOpacity = connectionType === 'yarn' ? opacity : opacity * 0.5

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={finalOpacity}
      />
    </mesh>
  )
}

// Tooltip component for showing stitch information
function StitchTooltip({ 
  hoveredStitch,
  patternType 
}: { 
  hoveredStitch: HoveredStitchInfo | null
  patternType: 'linear' | 'circular' | 'granny-square'
}) {
  if (!hoveredStitch) return null
  
  const formatStitchName = (stitchType: string) => {
    const nameMap: Record<string, string> = {
      'sc': 'single crochet',
      'dc': 'double crochet', 
      'hdc': 'half double crochet',
      'tr': 'treble crochet',
      'dtr': 'double treble crochet',
      'ch': 'chain',
      'sl': 'slip stitch',
      'sl_st': 'slip stitch',
      'sc2tog': 'single crochet 2 together',
      'dc2tog': 'double crochet 2 together',
      'magic-ring': 'magic ring',
      'ring': 'magic ring'
    }
    return nameMap[stitchType.toLowerCase()] || stitchType
  }

  const getPositionLabel = () => {
    const { round, position, stitchType } = hoveredStitch
    
    // Special handling for magic ring
    if (round === 0 && (stitchType === 'magic-ring' || stitchType === 'ring')) {
      return 'Magic Ring (center)'
    }
    
    // Determine whether to use "Round" or "Row"
    const roundOrRow = patternType === 'linear' ? 'Row' : 'Round'
    
    // Format position with ordinal suffix
    const getOrdinal = (n: number) => {
      if (n === 1) return '1st'
      if (n === 2) return '2nd' 
      if (n === 3) return '3rd'
      return `${n}th`
    }
    
    return `${roundOrRow} ${round}, ${getOrdinal(position)} ${stitchType}`
  }

  const svgFile = getStitchSVG(hoveredStitch.stitchType)
  
  return (
    <div 
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none"
      style={{
        left: `${hoveredStitch.screenX + 10}px`,
        top: `${hoveredStitch.screenY - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded border">
          <Image
            src={`/stitches/${svgFile}`}
            alt={hoveredStitch.stitchType}
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
        <div>
          <div className="font-medium text-sm">
            {getPositionLabel()}
          </div>
          <div className="text-xs text-gray-500">
            {formatStitchName(hoveredStitch.stitchType)}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main 3D scene component
function CrochetScene({ 
  geometry, 
  cameraPosition, 
  cameraTarget,
  showVertices = true,
  showEdges = true,
  edgeOpacity = 0.6,
  onStitchHover,
  onStitchHoverOut,
  stitchStructure
}: { 
  geometry: CrochetGeometry
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  showVertices?: boolean
  showEdges?: boolean
  edgeOpacity?: number
  onStitchHover: (info: HoveredStitchInfo) => void
  onStitchHoverOut: () => void
  stitchStructure: Array<{ round: number; position: number; stitchType: string }>
}) {
  const vertexMap = useMemo(() => {
    const map = new Map()
    geometry.vertices.forEach(vertex => {
      map.set(vertex.id, vertex)
    })
    return map
  }, [geometry.vertices])

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={cameraPosition} 
        fov={60}
        near={0.1}
        far={2000}
      />
      
      <OrbitControls 
        target={cameraTarget}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={1000}
        minDistance={50}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[100, 100, 100]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-50, -50, -50]} intensity={0.4} />
      
      {/* Render vertices */}
      {showVertices && geometry.vertices.map((vertex, index) => {
        // Get stitch structure info for this vertex
        const stitchInfo = stitchStructure[index] || {
          round: 1,
          position: index + 1,
          stitchType: vertex.stitchType
        }
        
        return (
          <StitchVertex
            key={vertex.id}
            position={[vertex.x, vertex.y, vertex.z]}
            color={getStitchColor(vertex.stitchType)}
            size={getVertexSize(vertex.stitchType)}
            stitchInfo={{
              id: vertex.id,
              stitchType: vertex.stitchType,
              round: stitchInfo.round,
              position: stitchInfo.position
            }}
            onHover={onStitchHover}
            onHoverOut={onStitchHoverOut}
          />
        )
      })}
      
      {/* Render edges */}
      {showEdges && geometry.edges.map((edge, index) => {
        const fromVertex = vertexMap.get(edge.fromVertex)
        const toVertex = vertexMap.get(edge.toVertex)
        
        if (!fromVertex || !toVertex) return null
        
        return (
          <StitchEdge
            key={`edge-${index}`}
            fromPosition={[fromVertex.x, fromVertex.y, fromVertex.z]}
            toPosition={[toVertex.x, toVertex.y, toVertex.z]}
            color={getEdgeColor(edge.connectionType)}
            connectionType={edge.connectionType}
            opacity={edgeOpacity}
          />
        )
      })}
    </>
  )
}

// Function to parse pattern sequence and calculate round/position info
const parsePatternStructure = (patternSequence: string[], patternType: string) => {
  const stitchInfo: Array<{ round: number; position: number; stitchType: string }> = []
  
  if (patternType === 'linear') {
    // For linear patterns, calculate rows based on 'turn' commands
    let currentRow = 1
    let currentPosition = 1
    
    for (const stitchType of patternSequence) {
      if (stitchType === 'turn') {
        currentRow++
        currentPosition = 1
        continue
      }
      
      if (stitchType === 'start' || stitchType === 'end' || stitchType === 'join') {
        continue
      }
      
      stitchInfo.push({
        round: currentRow,
        position: currentPosition,
        stitchType
      })
      
      currentPosition++
    }
  } else {
    // For circular patterns, parse rounds based on 'join' commands
    let sequenceWithoutMagicRing = patternSequence
    
    // Handle magic ring at the start
    if (patternSequence.length > 0 && (patternSequence[0] === 'magic-ring' || patternSequence[0] === 'ring')) {
      stitchInfo.push({
        round: 0,
        position: 1,
        stitchType: patternSequence[0]
      })
      sequenceWithoutMagicRing = patternSequence.slice(1)
    }
    
    // Group remaining pattern into rounds
    const rounds: string[][] = []
    let currentRound: string[] = []
    
    for (const stitchType of sequenceWithoutMagicRing) {
      if (stitchType === 'join') {
        if (currentRound.length > 0) {
          rounds.push([...currentRound])
          currentRound = []
        }
      } else {
        currentRound.push(stitchType)
      }
    }
    
    // Add remaining stitches as final round
    if (currentRound.length > 0) {
      rounds.push(currentRound)
    }
    
    // Create stitch info for each round
    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      const round = rounds[roundIndex]
      
      for (let positionIndex = 0; positionIndex < round.length; positionIndex++) {
        stitchInfo.push({
          round: roundIndex + 1,
          position: positionIndex + 1,
          stitchType: round[positionIndex]
        })
      }
    }
  }
  
  return stitchInfo
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
    <div className={`w-full h-full ${className}`}>
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