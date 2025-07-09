"use client"

import React, { useMemo } from 'react'
import * as THREE from 'three'

interface StitchEdgeProps {
  fromPosition: [number, number, number]
  toPosition: [number, number, number]
  color: string
  connectionType: 'yarn' | 'structure' | 'join'
  opacity?: number
}

export default function StitchEdge({ 
  fromPosition, 
  toPosition, 
  color, 
  connectionType,
  opacity = 0.6
}: StitchEdgeProps) {
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

export type { StitchEdgeProps } 