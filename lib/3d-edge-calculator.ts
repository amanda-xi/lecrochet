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
  
  if (patternType === 'linear') {
    // For linear patterns, we need to handle turns properly
    // Group vertices by rows to handle turns correctly
    const rowGroups = groupVerticesByRow(vertices)
    
    // Connect stitches within each row
    rowGroups.forEach(row => {
      for (let i = 0; i < row.length - 1; i++) {
        const current = row[i]
        const next = row[i + 1]
        
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
    })
    
    // Connect between rows (end of one row to start of next)
    for (let i = 0; i < rowGroups.length - 1; i++) {
      const currentRow = rowGroups[i]
      const nextRow = rowGroups[i + 1]
      
      if (currentRow.length > 0 && nextRow.length > 0) {
        const endOfCurrentRow = currentRow[currentRow.length - 1]
        const startOfNextRow = nextRow[0]
        
        const distance = calculateDistance(endOfCurrentRow, startOfNextRow)
        
        if (distance <= rules.maxYarnDistance) {
          edges.push({
            fromVertex: endOfCurrentRow.id,
            toVertex: startOfNextRow.id,
            connectionType: 'yarn'
          })
        }
      }
    }
  } else if (patternType === 'circular' || patternType === 'granny-square') {
    // For circular patterns, connect stitches within rounds and between rounds
    const rounds = groupVerticesByRound(vertices, patternType)
    
    // Connect stitches within each round
    rounds.forEach(round => {
      for (let i = 0; i < round.length - 1; i++) {
        const current = round[i]
        const next = round[i + 1]
        
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
    })
    
    // Connect between rounds (last stitch of one round to first stitch of next)
    for (let i = 0; i < rounds.length - 1; i++) {
      const currentRound = rounds[i]
      const nextRound = rounds[i + 1]
      
      if (currentRound.length > 0 && nextRound.length > 0) {
        // Find the connection point between rounds
        const lastStitchOfCurrentRound = currentRound[currentRound.length - 1]
        const firstStitchOfNextRound = nextRound[0]
        
        // Skip magic ring connections
        if (lastStitchOfCurrentRound.stitchType === 'magic-ring' || 
            firstStitchOfNextRound.stitchType === 'magic-ring') {
          continue
        }
        
        const distance = calculateDistance(lastStitchOfCurrentRound, firstStitchOfNextRound)
        
        if (distance <= rules.maxYarnDistance * 1.5) { // Allow longer connections between rounds
          edges.push({
            fromVertex: lastStitchOfCurrentRound.id,
            toVertex: firstStitchOfNextRound.id,
            connectionType: 'yarn'
          })
        }
      }
    }
    
    // Connect from magic ring to first round
    const magicRingVertex = vertices.find(v => v.stitchType === 'magic-ring' || v.stitchType === 'ring')
    if (magicRingVertex && rounds.length > 0) {
      const firstRound = rounds[0]
      firstRound.forEach(vertex => {
        if (vertex.stitchType !== 'magic-ring' && vertex.stitchType !== 'ring') {
          const distance = calculateDistance(magicRingVertex, vertex)
          if (distance <= rules.maxYarnDistance) {
            edges.push({
              fromVertex: magicRingVertex.id,
              toVertex: vertex.id,
              connectionType: 'yarn'
            })
          }
        }
      })
    }
  }
  
  return edges
}

/**
 * Group vertices by row based on their Y coordinates
 */
function groupVerticesByRow(vertices: Vertex3D[]): Vertex3D[][] {
  const rows: Vertex3D[][] = []
  const rowMap = new Map<number, Vertex3D[]>()
  
  vertices.forEach(vertex => {
    const rowY = Math.round(vertex.y / 35) * 35 // Group by row height intervals (adjusted for better grouping)
    
    if (!rowMap.has(rowY)) {
      rowMap.set(rowY, [])
    }
    rowMap.get(rowY)!.push(vertex)
  })
  
  // Sort rows by Y coordinate and sort vertices within each row by X coordinate
  Array.from(rowMap.entries())
    .sort(([aY], [bY]) => aY - bY)
    .forEach(([, vertices]) => {
      vertices.sort((a, b) => a.x - b.x)
      rows.push(vertices)
    })
  
  return rows
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
    // Group by Z-coordinate (round level) first, then by distance as fallback
    const byZCoordinate = vertices.map(v => ({
      vertex: v,
      zLevel: Math.round(v.z / 10) // Group by height levels
    }))
    
    byZCoordinate.sort((a, b) => a.zLevel - b.zLevel)
    
    let currentRound: Vertex3D[] = []
    let currentZLevel = -1
    
    byZCoordinate.forEach(({ vertex, zLevel }) => {
      if (currentZLevel === -1 || zLevel !== currentZLevel) {
        if (currentRound.length > 0) {
          rounds.push(currentRound)
        }
        currentRound = [vertex]
        currentZLevel = zLevel
      } else {
        currentRound.push(vertex)
      }
    })
    
    if (currentRound.length > 0) {
      rounds.push(currentRound)
    }
    
    // If Z-coordinate grouping doesn't work well, fall back to distance grouping
    if (rounds.length === 1 && vertices.length > 8) {
      const byDistance = vertices.map(v => ({
        vertex: v,
        distance: Math.sqrt(v.x * v.x + v.y * v.y)
      }))
      
      byDistance.sort((a, b) => a.distance - b.distance)
      
      rounds.length = 0 // Clear the single group
      currentRound = []
      let currentDistance = -1
      
      byDistance.forEach(({ vertex, distance }) => {
        if (currentDistance === -1 || Math.abs(distance - currentDistance) > 30) {
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