// 3D Pattern Processor for Crochet Patterns
// Main processor that converts pattern sequences into 3D geometry

import { 
  Vertex3D, 
  CrochetGeometry, 
  calculateStitchPosition, 
  calculateBounds 
} from './3d-geometry-utils'
import { 
  calculateEdges, 
  optimizeEdges, 
  ConnectionRules 
} from './3d-edge-calculator'

export interface ProcessingOptions {
  scale?: number
  centerPattern?: boolean
  connectionRules?: Partial<ConnectionRules>
  maxVertices?: number
}

/**
 * Process a crochet pattern sequence into 3D geometry
 */
export function processCrochetPattern(
  patternSequence: string[],
  patternType: 'linear' | 'circular' | 'granny-square',
  options: ProcessingOptions = {}
): CrochetGeometry {
  const {
    scale = 1,
    centerPattern = true,
    connectionRules = {},
    maxVertices = 500
  } = options

  // Limit vertices for performance
  const limitedSequence = patternSequence.slice(0, maxVertices)
  
  // Generate vertices from pattern sequence
  const vertices = generateVertices(limitedSequence, patternType, scale)
  
  // Center the pattern if requested
  const finalVertices = centerPattern ? centerVertices(vertices) : vertices
  
  // Calculate connections between vertices
  const rules = { ...getDefaultConnectionRules(), ...connectionRules }
  const edges = calculateEdges(finalVertices, patternType, rules)
  const optimizedEdges = optimizeEdges(edges)
  
  // Calculate bounds for the geometry
  const bounds = calculateBounds(finalVertices)
  
  return {
    vertices: finalVertices,
    edges: optimizedEdges,
    bounds
  }
}

/**
 * Generate 3D vertices from pattern sequence
 */
function generateVertices(
  patternSequence: string[],
  patternType: 'linear' | 'circular' | 'granny-square',
  scale: number
): Vertex3D[] {
  const vertices: Vertex3D[] = []
  let vertexIndex = 0 // Track actual stitch count (excluding turns and joins)
  
  patternSequence.forEach((stitchType) => {
    // Skip turn and join instructions as they don't create vertices
    if (stitchType === 'turn' || stitchType === 'join' || stitchType === 'start' || stitchType === 'end') {
      return
    }
    
    const position = calculateStitchPosition(
      stitchType,
      vertexIndex, // Use vertex index for position calculation
      patternType,
      patternSequence // Pass the full sequence for turn handling
    )
    
    // Apply scaling and create vertex with proper ID
    const scaledPosition: Vertex3D = {
      ...position,
      x: position.x * scale,
      y: position.y * scale,
      z: position.z * scale,
      id: `stitch-${vertexIndex}`, // Use vertex index for ID
      stitchType
    }
    
    vertices.push(scaledPosition)
    vertexIndex++
  })
  
  return vertices
}

/**
 * Center vertices around the origin
 */
function centerVertices(vertices: Vertex3D[]): Vertex3D[] {
  if (vertices.length === 0) return vertices
  
  const bounds = calculateBounds(vertices)
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  const centerZ = (bounds.minZ + bounds.maxZ) / 2
  
  return vertices.map(vertex => ({
    ...vertex,
    x: vertex.x - centerX,
    y: vertex.y - centerY,
    z: vertex.z - centerZ
  }))
}

/**
 * Get default connection rules
 */
function getDefaultConnectionRules(): ConnectionRules {
  return {
    maxYarnDistance: 80,
    maxStructuralDistance: 50,
    enableRoundConnections: true,
    enableLayerConnections: true
  }
}

/**
 * Calculate optimal camera position for viewing the pattern
 */
export function calculateCameraPosition(geometry: CrochetGeometry): {
  position: [number, number, number]
  target: [number, number, number]
} {
  const bounds = geometry.bounds
  const sizeX = bounds.maxX - bounds.minX
  const sizeY = bounds.maxY - bounds.minY
  const sizeZ = bounds.maxZ - bounds.minZ
  
  const maxSize = Math.max(sizeX, sizeY, sizeZ)
  const distance = Math.max(200, maxSize * 2)
  
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  const centerZ = (bounds.minZ + bounds.maxZ) / 2
  
  return {
    position: [
      centerX + distance * 0.7,
      centerY + distance * 0.7,
      centerZ + distance * 0.7
    ],
    target: [centerX, centerY, centerZ]
  }
}

/**
 * Get color for different stitch types
 */
export function getStitchColor(stitchType: string): string {
  const colorMap: Record<string, string> = {
    'chain': '#8B5CF6',
    'ch': '#8B5CF6',
    'single-crochet': '#06B6D4',
    'sc': '#06B6D4',
    'double-crochet': '#10B981',
    'dc': '#10B981',
    'half-double': '#F59E0B',
    'hdc': '#F59E0B',
    'treble': '#EF4444',
    'tr': '#EF4444',
    'double-treble': '#EC4899',
    'dtr': '#EC4899',
    'slip-stitch': '#6B7280',
    'sl': '#6B7280',
    'magic-ring': '#7C3AED',
    'ring': '#7C3AED',
    'cluster': '#059669',
    'shell': '#DC2626',
    'popcorn': '#D97706'
  }
  
  // Check for numbered variants
  const clusterMatch = stitchType.match(/(\d+)(\w+)/)
  if (clusterMatch) {
    return colorMap[clusterMatch[2]] || '#64748B'
  }
  
  return colorMap[stitchType] || '#64748B'
}

/**
 * Get color for different edge types
 */
export function getEdgeColor(connectionType: 'yarn' | 'structure' | 'join'): string {
  const colorMap: Record<string, string> = {
    'yarn': '#F59E0B',
    'structure': '#6B7280',
    'join': '#EF4444'
  }
  
  return colorMap[connectionType] || '#64748B'
}

/**
 * Calculate vertex size based on stitch type
 */
export function getVertexSize(stitchType: string): number {
  const sizeMap: Record<string, number> = {
    'chain': 0.8,
    'ch': 0.8,
    'single-crochet': 1.0,
    'sc': 1.0,
    'double-crochet': 1.2,
    'dc': 1.2,
    'half-double': 1.1,
    'hdc': 1.1,
    'treble': 1.3,
    'tr': 1.3,
    'double-treble': 1.4,
    'dtr': 1.4,
    'slip-stitch': 0.6,
    'sl': 0.6,
    'magic-ring': 1.5,
    'ring': 1.5,
    'cluster': 1.6,
    'shell': 1.8,
    'popcorn': 1.4
  }
  
  // Check for numbered variants
  const clusterMatch = stitchType.match(/(\d+)(\w+)/)
  if (clusterMatch) {
    const count = parseInt(clusterMatch[1])
    const baseSize = sizeMap[clusterMatch[2]] || 1.0
    return baseSize * (1 + count * 0.1)
  }
  
  return sizeMap[stitchType] || 1.0
}

/**
 * Animate vertices for pattern building visualization
 */
export function createAnimationSequence(
  vertices: Vertex3D[],
  duration: number = 3000
): Array<{ vertex: Vertex3D; delay: number }> {
  return vertices.map((vertex, index) => ({
    vertex,
    delay: (index / vertices.length) * duration
  }))
} 