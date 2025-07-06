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
  patternType: 'linear' | 'circular' | 'granny-square',
  patternSequence?: string[]
): Vertex3D {
  const baseHeight = getStitchHeight(stitchType)
  const baseWidth = getStitchWidth(stitchType)
  
  let x = 0
  let y = 0
  let z = 0

  if (patternType === 'linear') {
    // Linear arrangement with proper turn handling
    if (patternSequence) {
      const position = calculateLinearPositionWithTurns(patternSequence, index, baseWidth)
      x = position.x
      y = position.y
      z = position.z
    } else {
      // Fallback to simple linear
      x = index * baseWidth * 1.2
      y = 0
      z = baseHeight * 0.5
    }
  } else if (patternType === 'circular') {
    // Circular arrangement with proper round handling
    if (patternSequence) {
      const position = calculateCircularPositionWithRounds(patternSequence, index)
      x = position.x
      y = position.y
      z = position.z
    } else {
      // Fallback to simple circular
      const radius = Math.max(50, index * 5)
      const angle = (index * 2 * Math.PI) / Math.max(6, index)
      x = Math.cos(angle) * radius
      y = Math.sin(angle) * radius
      z = baseHeight * 0.5
    }
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
 * Calculate linear position with proper turn handling
 */
function calculateLinearPositionWithTurns(
  patternSequence: string[],
  targetIndex: number,
  baseWidth: number
): { x: number; y: number; z: number } {
  const standardWidth = 25 // Use consistent width for all stitches for visual clarity
  const rowHeight = 45 // Standard spacing between rows
  
  let currentX = 0
  let currentY = 0
  let direction = 1 // 1 for left-to-right, -1 for right-to-left
  let stitchesProcessed = 0
  
  // Process the pattern sequence up to our target stitch
  for (let i = 0; i < patternSequence.length; i++) {
    const stitchType = patternSequence[i]
    
    if (stitchType === 'turn') {
      // Turn: move to next row and reverse direction
      // Important: Don't change X position - stay where we were
      currentY += rowHeight
      direction *= -1
      continue
    }
    
    if (stitchType === 'start' || stitchType === 'end') {
      // Skip special commands
      continue
    }
    
    // If this is our target stitch, return its position
    if (stitchesProcessed === targetIndex) {
      return {
        x: currentX,
        y: currentY,
        z: getStitchHeight(stitchType) * 0.5
      }
    }
    
    // Move to the next stitch position AFTER we've checked if this is our target
    currentX += standardWidth * direction
    stitchesProcessed++
  }
  
  // Fallback if we didn't find the target stitch
  return { x: currentX, y: currentY, z: 10 }
}

/**
 * Calculate circular position with proper round handling
 */
function calculateCircularPositionWithRounds(
  patternSequence: string[],
  targetIndex: number
): { x: number; y: number; z: number } {
  // Parse pattern into rounds based on join commands
  const rounds: string[][] = []
  let currentRound: string[] = []
  
  // Group pattern into rounds
  for (let i = 0; i < patternSequence.length; i++) {
    const stitchType = patternSequence[i]
    
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
  
  // Find which round and position within round our target stitch is in
  let targetRound = 0
  let positionInRound = 0
  let tempIndex = 0
  
  for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
    const round = rounds[roundIndex]
    
    if (tempIndex + round.length > targetIndex) {
      targetRound = roundIndex
      positionInRound = targetIndex - tempIndex
      break
    }
    
    tempIndex += round.length
  }
  
  // Handle positioning for each round
  if (targetRound < rounds.length) {
    const round = rounds[targetRound]
    const stitchType = round[positionInRound]
    
    // Special handling for magic ring (center)
    if (stitchType === 'magic-ring' || stitchType === 'ring') {
      return {
        x: 0,
        y: 0,
        z: getStitchHeight(stitchType) * 0.5
      }
    }
    
    // Calculate position on circle for this round
    const baseRadius = 40
    const radiusIncrement = 50
    const currentRadius = baseRadius + (targetRound * radiusIncrement)
    
    const totalStitchesInRound = round.length
    const angleIncrement = (2 * Math.PI) / totalStitchesInRound
    const currentAngle = positionInRound * angleIncrement
    
    const x = Math.cos(currentAngle) * currentRadius
    const y = Math.sin(currentAngle) * currentRadius
    const z = getStitchHeight(stitchType) * 0.5 + (targetRound * 5) // Slight height variation per round
    
    return { x, y, z }
  }
  
  // Fallback if something goes wrong
  return { x: 0, y: 0, z: 10 }
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
  // Return consistent width for all stitches for visual clarity
  return 25
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