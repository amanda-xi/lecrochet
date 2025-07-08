/**
 * Utility functions for parsing pattern structure from stitch sequences
 */

export interface StitchStructureInfo {
  round: number
  position: number
  stitchType: string
}

/**
 * Parse pattern sequence and calculate round/position info for each stitch
 */
export const parsePatternStructure = (
  patternSequence: string[], 
  patternType: string
): StitchStructureInfo[] => {
  if (patternType === 'linear') {
    return parseLinearPatternStructure(patternSequence)
  } else {
    return parseCircularPatternStructure(patternSequence)
  }
}

/**
 * Parse linear pattern structure (rows with turns)
 */
const parseLinearPatternStructure = (patternSequence: string[]): StitchStructureInfo[] => {
  const stitchInfo: StitchStructureInfo[] = []
  let currentRow = 1
  let currentPosition = 1
  
  for (const stitchType of patternSequence) {
    if (stitchType === 'turn') {
      currentRow++
      currentPosition = 1
      continue
    }
    
    if (stitchType === 'start' || stitchType === 'end' || stitchType === 'join') {
      continue
    }
    
    stitchInfo.push({
      round: currentRow,
      position: currentPosition,
      stitchType
    })
    
    currentPosition++
  }
  
  return stitchInfo
}

/**
 * Parse circular pattern structure (rounds with joins)
 */
const parseCircularPatternStructure = (patternSequence: string[]): StitchStructureInfo[] => {
  const stitchInfo: StitchStructureInfo[] = []
  let sequenceWithoutMagicRing = patternSequence
  
  // Handle magic ring at the start
  if (patternSequence.length > 0 && (
    patternSequence[0] === 'magic-ring' || 
    patternSequence[0] === 'ring' ||
    patternSequence[0] === 'magic_ring'
  )) {
    stitchInfo.push({
      round: 0,
      position: 1,
      stitchType: patternSequence[0]
    })
    sequenceWithoutMagicRing = patternSequence.slice(1)
  }
  
  // Group remaining pattern into rounds
  const rounds: string[][] = []
  let currentRound: string[] = []
  
  for (const stitchType of sequenceWithoutMagicRing) {
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
  
  // Create stitch info for each round
  for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
    const round = rounds[roundIndex]
    
    for (let positionIndex = 0; positionIndex < round.length; positionIndex++) {
      stitchInfo.push({
        round: roundIndex + 1,
        position: positionIndex + 1,
        stitchType: round[positionIndex]
      })
    }
  }
  
  return stitchInfo
} 