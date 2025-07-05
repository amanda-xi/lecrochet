// 3D Edge Connection Calculator for Crochet Patterns
// Handles yarn flow, structural connections, and joining relationships

import { Vertex3D, Edge3D, calculateDistance } from './3d-geometry-utils'

export interface ConnectionRules {
  maxYarnDistance: number
  maxStructuralDistance: number
  enableRoundConnections: boolean
  enableLayerConnections: boolean
}

/**
 * Calculate all edges between vertices based on crochet pattern logic
 */
export function calculateEdges(
  vertices: Vertex3D[],
  patternType: 'linear' | 'circular' | 'granny-square',
  rules: ConnectionRules = getDefaultRules()
): Edge3D[] {
  if (vertices.length === 0) return []

  const edges: Edge3D[] = []
  
  // Add sequential yarn connections (how yarn flows through stitches)
  edges.push(...calculateYarnConnections(vertices, patternType, rules))
  
  // Add structural connections (how stitches support each other)
  edges.push(...calculateStructuralConnections(vertices, patternType, rules))
  
  // Add join connections for circular patterns
  if (patternType === 'circular' || patternType === 'granny-square') {
    edges.push(...calculateJoinConnections(vertices, patternType, rules))
  }
  
  return edges
}

/**
 * Calculate yarn flow connections between consecutive stitches
 */
function calculateYarnConnections(
  vertices: Vertex3D[],
  patternType: 'linear' | 'circular' | 'granny-square',
  rules: ConnectionRules
): Edge3D[] {
  const edges: Edge3D[] = []
  
  for (let i = 0; i < vertices.length - 1; i++) {
    const current = vertices[i]
    const next = vertices[i + 1]
    
    // Skip magic ring connections as they're handled separately
    if (current.stitchType === 'magic-ring' || next.stitchType === 'magic-ring') {
      continue
    }
    
    const distance = calculateDistance(current, next)
    
    if (distance <= rules.maxYarnDistance) {
      edges.push({
        fromVertex: current.id,
        toVertex: next.id,
        connectionType: 'yarn'
      })
    }
  }
  
  return edges
}

/**
 * Calculate structural connections (stitches built on other stitches)
 */
function calculateStructuralConnections(
  vertices: Vertex3D[],
  patternType: 'linear' | 'circular' | 'granny-square',
  rules: ConnectionRules
): Edge3D[] {
  const edges: Edge3D[] = []
  
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i]
    
    // Look for structural support connections
    for (let j = 0; j < vertices.length; j++) {
      if (i === j) continue
      
      const other = vertices[j]
      const distance = calculateDistance(current, other)
      
      // Connect if vertically aligned and within structural distance
      if (distance <= rules.maxStructuralDistance && 
          isStructurallyConnected(current, other)) {
        edges.push({
          fromVertex: other.id,
          toVertex: current.id,
          connectionType: 'structure'
        })
      }
    }
  }
  
  return edges
}

/**
 * Calculate join connections for circular patterns
 */
function calculateJoinConnections(
  vertices: Vertex3D[],
  patternType: 'circular' | 'granny-square',
  rules: ConnectionRules
): Edge3D[] {
  const edges: Edge3D[] = []
  
  if (!rules.enableRoundConnections) return edges
  
  // Group vertices by rounds/layers
  const rounds = groupVerticesByRound(vertices, patternType)
  
  rounds.forEach(round => {
    if (round.length > 2) {
      // Connect first and last stitch of each round
      const first = round[0]
      const last = round[round.length - 1]
      
      if (first && last) {
        edges.push({
          fromVertex: last.id,
          toVertex: first.id,
          connectionType: 'join'
        })
      }
    }
  })
  
  return edges
}

/**
 * Check if two vertices should be structurally connected
 */
function isStructurallyConnected(
  v1: Vertex3D,
  v2: Vertex3D
): boolean {
  // Vertical alignment check
  const horizontalDistance = Math.sqrt(
    Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2)
  )
  
  // Height difference check
  const heightDiff = Math.abs(v2.z - v1.z)
  
  // Connect if one is above the other and horizontally close
  return heightDiff > 10 && horizontalDistance < 30
}

/**
 * Group vertices by their round/layer position
 */
function groupVerticesByRound(
  vertices: Vertex3D[],
  patternType: 'circular' | 'granny-square'
): Vertex3D[][] {
  const rounds: Vertex3D[][] = []
  
  if (patternType === 'circular') {
    // Group by distance from center
    const byDistance = vertices.map(v => ({
      vertex: v,
      distance: Math.sqrt(v.x * v.x + v.y * v.y)
    }))
    
    byDistance.sort((a, b) => a.distance - b.distance)
    
    let currentRound: Vertex3D[] = []
    let currentDistance = -1
    
    byDistance.forEach(({ vertex, distance }) => {
      if (currentDistance === -1 || Math.abs(distance - currentDistance) > 20) {
        if (currentRound.length > 0) {
          rounds.push(currentRound)
        }
        currentRound = [vertex]
        currentDistance = distance
      } else {
        currentRound.push(vertex)
      }
    })
    
    if (currentRound.length > 0) {
      rounds.push(currentRound)
    }
  } else if (patternType === 'granny-square') {
    // Group by layer (square ring)
    const layerMap = new Map<number, Vertex3D[]>()
    
    vertices.forEach(vertex => {
      const layer = Math.floor(Math.max(Math.abs(vertex.x), Math.abs(vertex.y)) / 30)
      if (!layerMap.has(layer)) {
        layerMap.set(layer, [])
      }
      layerMap.get(layer)!.push(vertex)
    })
    
    layerMap.forEach(layer => rounds.push(layer))
  }
  
  return rounds
}

/**
 * Get default connection rules
 */
function getDefaultRules(): ConnectionRules {
  return {
    maxYarnDistance: 80,
    maxStructuralDistance: 50,
    enableRoundConnections: true,
    enableLayerConnections: true
  }
}

/**
 * Filter edges to remove overlapping or excessive connections
 */
export function optimizeEdges(edges: Edge3D[]): Edge3D[] {
  // Remove duplicate edges
  const uniqueEdges = new Map<string, Edge3D>()
  
  edges.forEach(edge => {
    const key = `${edge.fromVertex}-${edge.toVertex}-${edge.connectionType}`
    if (!uniqueEdges.has(key)) {
      uniqueEdges.set(key, edge)
    }
  })
  
  return Array.from(uniqueEdges.values())
}

/**
 * Calculate edge curvature for yarn connections
 */
export function calculateEdgeCurvature(
  fromVertex: Vertex3D,
  toVertex: Vertex3D,
  connectionType: 'yarn' | 'structure' | 'join'
): number {
  const distance = calculateDistance(fromVertex, toVertex)
  
  if (connectionType === 'yarn') {
    // Yarn has natural drape and curve
    return Math.min(0.3, distance * 0.01)
  } else if (connectionType === 'structure') {
    // Structural connections are more rigid
    return Math.min(0.1, distance * 0.005)
  } else {
    // Join connections are typically straight
    return 0
  }
} 