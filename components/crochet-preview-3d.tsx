"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"

interface CrochetPreview3DProps {
  patternSequence: string[]
}

function CrochetMesh({ patternSequence }: { patternSequence: string[] }) {
  if (patternSequence.length === 0) {
    return (
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#e5e7eb" transparent opacity={0.3} />
      </mesh>
    )
  }

  // Create a simple yarn-like structure based on pattern sequence
  const points: THREE.Vector3[] | undefined = []
  const radius = 2

  patternSequence.forEach((pattern, index) => {
    const angle = (index / patternSequence.length) * Math.PI * 4
    const height = index * 0.1

    // Vary the radius based on stitch type
    let stitchRadius = radius
    switch (pattern) {
      case "shell-stitch":
        stitchRadius = radius * 1.3
        break
      case "bobble-stitch":
        stitchRadius = radius * 1.2
        break
      case "single-crochet":
        stitchRadius = radius * 0.8
        break
    }

    points.push(new THREE.Vector3(Math.cos(angle) * stitchRadius, height, Math.sin(angle) * stitchRadius))
  })

  if (points.length < 2) return null

  const curve = new THREE.CatmullRomCurve3(points)
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false)

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial color="#8b5cf6" roughness={0.8} metalness={0.1} />
    </mesh>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f3f4f6" />
    </mesh>
  )
}

export default function CrochetPreview3D({ patternSequence }: CrochetPreview3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={<LoadingFallback />}>
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <CrochetMesh patternSequence={patternSequence} />

          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true} 
            minDistance={2} 
            maxDistance={10}
            enableDamping={true}
            dampingFactor={0.1}
            rotateSpeed={0.3}
            panSpeed={0.3}
            zoomSpeed={0.3}
          />
        </Suspense>
      </Canvas>

      {patternSequence.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-500 text-sm font-light">Add stitches to see 3D preview</p>
        </div>
      )}
    </div>
  )
}
