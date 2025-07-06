import { STITCH_SVG_MAP } from './stitch-mappings'

export interface StitchPosition {
  x: number
  y: number
  rotation: number
  stitchType: string
}

export function calculateStitchPositions(
  patternSequence: string[],
  patternType: "linear" | "circular" | "granny-square",
  centerX: number,
  centerY: number
): StitchPosition[] {
  if (patternSequence.length === 0) return []
  
  if (patternType === "circular" || patternType === "granny-square") {
    return calculateCircularPositions(patternSequence, centerX, centerY)
  } else {
    return calculateLinearPositions(patternSequence)
  }
}

function calculateCircularPositions(
  patternSequence: string[],
  centerX: number,
  centerY: number
): StitchPosition[] {
  const positions: StitchPosition[] = []
  let currentRadius = 60
  
  // First, group pattern into rounds based on join commands
  const rounds: string[][] = []
  let currentRound: string[] = []
  
  patternSequence.forEach((stitchType) => {
    if (stitchType === 'join') {
      if (currentRound.length > 0) {
        rounds.push([...currentRound])
        currentRound = []
      }
    } else {
      currentRound.push(stitchType)
    }
  })
  
  // Add remaining stitches as final round
  if (currentRound.length > 0) {
    rounds.push(currentRound)
  }

  // Calculate base radius for each round based on stitch count
  const baseRadiusPerStitch = 25 // Base spacing between stitches
  
  // Position each round
  rounds.forEach((round, roundIndex) => {
    const totalStitchesInRound = round.length
    
    // Calculate radius based on stitch count and round progression
    if (roundIndex > 0) {
      // For subsequent rounds, calculate radius to maintain consistent spacing
      const minRadiusForStitches = (totalStitchesInRound * baseRadiusPerStitch) / (2 * Math.PI)
      const minRadiusFromPreviousRound = currentRadius + 40 // Minimum gap between rounds
      
      // Use the larger of the two to ensure proper spacing
      currentRadius = Math.max(minRadiusForStitches, minRadiusFromPreviousRound)
    }
    
    round.forEach((stitchType, stitchIndex) => {
      // Special handling for magic ring start
      if (stitchType === 'magic-ring' || stitchType === 'ring') {
        positions.push({
          x: centerX - 16, // Center the magic ring properly
          y: centerY - 16,
          rotation: 0,
          stitchType
        })
        return
      }

      // Calculate position on circle
      const angleIncrement = (2 * Math.PI) / totalStitchesInRound
      const currentStitchAngle = stitchIndex * angleIncrement
      
      // Add slight rotation offset for better visual distribution
      const rotationOffset = roundIndex * (Math.PI / 16) // Small offset per round
      const adjustedAngle = currentStitchAngle + rotationOffset
      
      const x = centerX + Math.cos(adjustedAngle) * currentRadius - 16
      const y = centerY + Math.sin(adjustedAngle) * currentRadius - 16
      
      // Rotate stitches so they point toward center
      const rotation = (adjustedAngle * 180 / Math.PI) + 90

      positions.push({
        x,
        y,
        rotation,
        stitchType
      })
    })
    
    // Ensure minimum radius increment for next round
    currentRadius += Math.max(35, totalStitchesInRound * 3)
  })
  
  return positions
}

function calculateLinearPositions(patternSequence: string[]): StitchPosition[] {
  const positions: StitchPosition[] = []
  let currentX = 50
  let currentY = 150
  let rowHeight = 0
  let workingLeftToRight = true // Track direction of work

  patternSequence.forEach((stitchType) => {
    const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
    
    // Handle row breaks and turns
    if (stitchType === 'turn') {
      // Move to next row
      currentY += rowHeight + 30
      rowHeight = 0
      
      // Flip direction - stay at current X position (end of previous row)
      workingLeftToRight = !workingLeftToRight
      return
    }

    // Calculate stitch width and position
    const stitchWidth = Math.max(stitchInfo.width * 0.9, 35)
    
    if (workingLeftToRight) {
      // Working left to right: place stitch at current position, then move right
      positions.push({
        x: currentX,
        y: currentY,
        rotation: 0,
        stitchType
      })
      currentX += stitchWidth
    } else {
      // Working right to left: move left first, then place stitch
      currentX -= stitchWidth
      positions.push({
        x: currentX,
        y: currentY,
        rotation: 0,
        stitchType
      })
    }

    // Update row height
    rowHeight = Math.max(rowHeight, stitchInfo.height)
  })

  return positions
} 