"use client"

import React, { useMemo } from 'react'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import StitchVertex, { HoveredStitchInfo } from './3d/stitch-vertex'
import StitchEdge from './3d/stitch-edge'
import { CrochetGeometry } from '@/lib/3d-geometry-utils'
import { 
  getStitchColor,
  getVertexSize,
  getEdgeColor
} from '@/lib/3d-pattern-processor'

interface CrochetSceneProps {
  geometry: CrochetGeometry
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  showVertices?: boolean
  showEdges?: boolean
  edgeOpacity?: number
  onStitchHover: (info: HoveredStitchInfo) => void
  onStitchHoverOut: () => void
  stitchStructure: Array<{ round: number; position: number; stitchType: string }>
}

export default function CrochetScene({ 
  geometry, 
  cameraPosition, 
  cameraTarget,
  showVertices = true,
  showEdges = true,
  edgeOpacity = 0.6,
  onStitchHover,
  onStitchHoverOut,
  stitchStructure
}: CrochetSceneProps) {
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

export type { CrochetSceneProps } 