"use client"

import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

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

interface StitchVertexProps {
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
}

export default function StitchVertex({ 
  position, 
  color, 
  size,
  stitchInfo,
  onHover,
  onHoverOut
}: StitchVertexProps) {
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

export type { HoveredStitchInfo, StitchVertexProps } 