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
  
  // Check if pattern starts with magic ring
  let sequenceWithoutMagicRing = patternSequence
  
  if (patternSequence.length > 0 && (patternSequence[0] === 'magic-ring' || patternSequence[0] === 'ring')) {
    sequenceWithoutMagicRing = patternSequence.slice(1) // Remove magic ring from sequence
    
    // Position magic ring at center (adjusted slightly left and down)
    const magicRingInfo = STITCH_SVG_MAP[patternSequence[0]] || STITCH_SVG_MAP['unknown']
    positions.push({
      x: centerX - magicRingInfo.width / 2 - 18, //adjust  left
      y: centerY - magicRingInfo.height / 2 + 10, // adjust  down
      rotation: 0,
      stitchType: patternSequence[0]
    })
  }
  
  // Group remaining pattern into rounds based on join commands
  const rounds: string[][] = []
  let currentRound: string[] = []
  
  sequenceWithoutMagicRing.forEach((stitchType) => {
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
      const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
      const halfWidth = stitchInfo.width / 2
      const halfHeight = stitchInfo.height / 2
      
      // Calculate position on circle
      const angleIncrement = (2 * Math.PI) / totalStitchesInRound
      const currentStitchAngle = stitchIndex * angleIncrement
      
      // Add slight rotation offset for better visual distribution
      const rotationOffset = roundIndex * (Math.PI / 16) // Small offset per round
      const adjustedAngle = currentStitchAngle + rotationOffset
      
      const x = centerX + Math.cos(adjustedAngle) * currentRadius - halfWidth
      const y = centerY + Math.sin(adjustedAngle) * currentRadius - halfHeight
      
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
  
  // First pass: group stitches by rows
  const rows: string[][] = []
  let currentRow: string[] = []
  
  patternSequence.forEach((stitchType) => {
    if (stitchType === 'turn') {
      if (currentRow.length > 0) {
        rows.push([...currentRow])
        currentRow = []
      }
    } else if (stitchType !== 'start' && stitchType !== 'end') {
      currentRow.push(stitchType)
    }
  })
  
  // Add the last row if it has stitches
  if (currentRow.length > 0) {
    rows.push(currentRow)
  }
  
  if (rows.length === 0) return positions
  
  // Calculate row heights based on tallest stitch in each row
  const rowHeights: number[] = []
  const rowYPositions: number[] = []
  
  rows.forEach((row, rowIndex) => {
    let maxHeight = 0
    row.forEach((stitchType) => {
      const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
      maxHeight = Math.max(maxHeight, stitchInfo.height)
    })
    rowHeights[rowIndex] = maxHeight
  })
  
  // Calculate Y positions from bottom to top with proper spacing
  const baseY = 150
  const rowSpacing = 10 // Additional spacing between rows
  
  // Start from the bottom row (last row in the array)
  let cumulativeHeight = baseY
  for (let i = rows.length - 1; i >= 0; i--) {
    rowYPositions[i] = cumulativeHeight
    if (i > 0) {
      // Add height of current row plus spacing for next row up
      cumulativeHeight += rowHeights[i] + rowSpacing
    }
  }
  
  // Second pass: position stitches with proper spacing
  let currentX = 50
  let workingLeftToRight = true
  
  rows.forEach((row, rowIndex) => {
    const currentY = rowYPositions[rowIndex]
    
    row.forEach((stitchType) => {
      const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
      const stitchWidth = Math.max(stitchInfo.width * 0.7, 28)
      
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
    })
    
    // Flip direction for next row (don't change X position)
    workingLeftToRight = !workingLeftToRight
  })

  return positions
} 