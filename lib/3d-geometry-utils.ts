// 3D Geometry Utilities for Crochet Patterns
// Handles vertex positioning, edge connections, and spatial calculations

export interface Vertex3D {
  x: number
  y: number
  z: number
  id: string
  stitchType: string
}

export interface Edge3D {
  fromVertex: string
  toVertex: string
  connectionType: 'yarn' | 'structure' | 'join'
}

export interface CrochetGeometry {
  vertices: Vertex3D[]
  edges: Edge3D[]
  bounds: {
    minX: number
    maxX: number
    minY: number
    maxY: number
    minZ: number
    maxZ: number
  }
}

/**
 * Calculate 3D position for a stitch based on its type and pattern context
 */
export function calculateStitchPosition(
  stitchType: string,
  index: number,
  patternType: 'linear' | 'circular' | 'granny-square'
): Vertex3D {
  const baseHeight = getStitchHeight(stitchType)
  const baseWidth = getStitchWidth(stitchType)
  
  let x = 0
  let y = 0
  let z = 0

  if (patternType === 'linear') {
    // Linear arrangement
    x = index * baseWidth * 1.2
    y = 0
    z = baseHeight * 0.5
  } else if (patternType === 'circular') {
    // Circular arrangement
    const radius = Math.max(50, index * 5)
    const angle = (index * 2 * Math.PI) / Math.max(6, index)
    x = Math.cos(angle) * radius
    y = Math.sin(angle) * radius
    z = baseHeight * 0.5
  } else if (patternType === 'granny-square') {
    // Granny square specific positioning
    const layer = Math.floor(index / 12) + 1
    const positionInLayer = index % 12
    const sideLength = layer * 30
    
    // Calculate position on square perimeter
    const side = Math.floor(positionInLayer / 3)
    const positionOnSide = positionInLayer % 3
    
    switch (side) {
      case 0: // Top
        x = -sideLength/2 + (positionOnSide * sideLength/2)
        y = sideLength/2
        break
      case 1: // Right
        x = sideLength/2
        y = sideLength/2 - (positionOnSide * sideLength/2)
        break
      case 2: // Bottom
        x = sideLength/2 - (positionOnSide * sideLength/2)
        y = -sideLength/2
        break
      case 3: // Left
        x = -sideLength/2
        y = -sideLength/2 + (positionOnSide * sideLength/2)
        break
    }
    z = baseHeight * 0.5
  }

  return {
    x,
    y,
    z,
    id: `stitch-${index}`,
    stitchType
  }
}

/**
 * Get the height of a stitch type for 3D positioning
 */
export function getStitchHeight(stitchType: string): number {
  const heightMap: Record<string, number> = {
    'chain': 8,
    'ch': 8,
    'single-crochet': 15,
    'sc': 15,
    'half-double': 25,
    'hdc': 25,
    'double-crochet': 40,
    'dc': 40,
    'treble': 50,
    'tr': 50,
    'double-treble': 60,
    'dtr': 60,
    'slip-stitch': 5,
    'sl': 5,
    'magic-ring': 2,
    'ring': 2,
    'cluster': 35,
    'shell': 35,
    'popcorn': 45
  }
  
  // Check for numbered clusters like '3dc-cluster'
  const clusterMatch = stitchType.match(/(\d+)(\w+)-cluster/)
  if (clusterMatch) {
    const baseHeight = heightMap[clusterMatch[2]] || 30
    return baseHeight * 0.8
  }
  
  return heightMap[stitchType] || 20
}

/**
 * Get the width of a stitch type for 3D positioning
 */
export function getStitchWidth(stitchType: string): number {
  const widthMap: Record<string, number> = {
    'chain': 20,
    'ch': 20,
    'single-crochet': 15,
    'sc': 15,
    'half-double': 18,
    'hdc': 18,
    'double-crochet': 20,
    'dc': 20,
    'treble': 22,
    'tr': 22,
    'double-treble': 24,
    'dtr': 24,
    'slip-stitch': 10,
    'sl': 10,
    'magic-ring': 25,
    'ring': 25,
    'cluster': 30,
    'shell': 40,
    'popcorn': 25
  }
  
  // Check for numbered clusters
  const clusterMatch = stitchType.match(/(\d+)(\w+)-cluster/)
  if (clusterMatch) {
    const count = parseInt(clusterMatch[1])
    const baseWidth = widthMap[clusterMatch[2]] || 15
    return baseWidth * Math.max(1, count * 0.6)
  }
  
  return widthMap[stitchType] || 15
}

/**
 * Calculate bounding box for a set of vertices
 */
export function calculateBounds(vertices: Vertex3D[]): CrochetGeometry['bounds'] {
  if (vertices.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 }
  }
  
  const bounds = {
    minX: vertices[0].x,
    maxX: vertices[0].x,
    minY: vertices[0].y,
    maxY: vertices[0].y,
    minZ: vertices[0].z,
    maxZ: vertices[0].z
  }
  
  vertices.forEach(vertex => {
    bounds.minX = Math.min(bounds.minX, vertex.x)
    bounds.maxX = Math.max(bounds.maxX, vertex.x)
    bounds.minY = Math.min(bounds.minY, vertex.y)
    bounds.maxY = Math.max(bounds.maxY, vertex.y)
    bounds.minZ = Math.min(bounds.minZ, vertex.z)
    bounds.maxZ = Math.max(bounds.maxZ, vertex.z)
  })
  
  return bounds
}

/**
 * Calculate the distance between two vertices
 */
export function calculateDistance(v1: Vertex3D, v2: Vertex3D): number {
  const dx = v2.x - v1.x
  const dy = v2.y - v1.y
  const dz = v2.z - v1.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
} 