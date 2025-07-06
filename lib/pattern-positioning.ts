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
  
  // Position each round
  rounds.forEach((round) => {
    const totalStitchesInRound = round.length
    
    round.forEach((stitchType, stitchIndex) => {
      // Special handling for magic ring start
      if (stitchType === 'magic-ring' || stitchType === 'ring') {
        positions.push({
          x: centerX - 38, // Move a little more left to center properly
          y: centerY - 14, // Adjusted for visual centering
          rotation: 0,
          stitchType
        })
        return
      }

      // Calculate position on circle
      const angleIncrement = (2 * Math.PI) / totalStitchesInRound
      const currentStitchAngle = stitchIndex * angleIncrement
      
      const x = centerX + Math.cos(currentStitchAngle) * currentRadius - 16
      const y = centerY + Math.sin(currentStitchAngle) * currentRadius - 16
      // Rotate stitches so bottoms face toward center (angle + 90 degrees)
      const rotation = (currentStitchAngle * 180 / Math.PI) + 90

      positions.push({
        x,
        y,
        rotation,
        stitchType
      })
    })
    
    // Move to next radius for next round
    currentRadius += 50
  })
  
  return positions
}

function calculateLinearPositions(patternSequence: string[]): StitchPosition[] {
  const positions: StitchPosition[] = []
  let currentX = 50
  let currentY = 150
  let rowHeight = 0

  patternSequence.forEach((stitchType) => {
    const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
    
    // Handle row breaks and turns
    if (stitchType === 'turn') {
      currentX = 50
      currentY += rowHeight + 30
      rowHeight = 0
      return
    }

    positions.push({
      x: currentX,
      y: currentY,
      rotation: 0,
      stitchType
    })

    // Update position for next stitch
    currentX += Math.max(stitchInfo.width * 0.9, 35) // Spacing between stitches
    rowHeight = Math.max(rowHeight, stitchInfo.height)
  })

  return positions
} 