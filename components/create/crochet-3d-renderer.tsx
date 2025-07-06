"use client"

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
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
}

// Individual vertex component
function StitchVertex({ 
  position, 
  color, 
  size 
}: { 
  position: [number, number, number]
  color: string
  size: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Add subtle animation for better visualization
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
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
  connectionType 
}: { 
  fromPosition: [number, number, number]
  toPosition: [number, number, number]
  color: string
  connectionType: 'yarn' | 'structure' | 'join'
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

  const opacity = connectionType === 'yarn' ? 0.8 : 0.4

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={opacity}
      />
    </mesh>
  )
}

// Main 3D scene component
function CrochetScene({ 
  geometry, 
  cameraPosition, 
  cameraTarget 
}: { 
  geometry: CrochetGeometry
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
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
      {geometry.vertices.map((vertex) => (
        <StitchVertex
          key={vertex.id}
                     position={[vertex.x, vertex.y, vertex.z]}
           color={getStitchColor(vertex.stitchType)}
           size={getVertexSize(vertex.stitchType)}
        />
      ))}
      
      {/* Render edges */}
      {geometry.edges.map((edge, index) => {
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
          />
        )
      })}
    </>
  )
}

export default function Crochet3DRenderer({ 
  patternSequence, 
  patternType, 
  className = "" 
}: Crochet3DRendererProps) {
  const geometry = useMemo(() => {
    return processCrochetPattern(patternSequence, patternType, {
      scale: 1,
      centerPattern: true,
      maxVertices: 200 // Limit for performance
    })
  }, [patternSequence, patternType])

  const { position: cameraPosition, target: cameraTarget } = useMemo(() => {
    return calculateCameraPosition(geometry)
  }, [geometry])

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
        />
      </Canvas>
      
      {/* Pattern info overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm space-y-1">
        <div className="font-medium">3D Pattern View</div>
        <div className="text-gray-600">
          {geometry.vertices.length} vertices, {geometry.edges.length} connections
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