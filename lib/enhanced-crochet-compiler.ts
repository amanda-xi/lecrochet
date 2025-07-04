// Enhanced CrochetScript Compiler
// Handles complex patterns including granny squares, circular patterns, and advanced stitches

// Safety limits to prevent system crashes
const SAFETY_LIMITS = {
  MAX_SINGLE_OPERATION_STITCHES: 1000,   // Maximum stitches in one operation (e.g., chain(1000))
  MAX_TOTAL_PATTERN_STITCHES: 5000,      // Maximum total stitches in entire pattern
  WARNING_SINGLE_OPERATION: 100,         // Warn when single operation exceeds this
  WARNING_TOTAL_PATTERN: 1000            // Warn when pattern exceeds this
} as const

export interface CompilerError {
  line: number
  column: number
  message: string
  severity: "error" | "warning"
}

export interface CompilerResult {
  patternSequence: string[]
  patternType: "linear" | "circular" | "granny-square"
  errors: CompilerError[]
  success: boolean
  metadata: {
    rounds?: number
    stitchCount?: number
    techniques?: string[]
  }
}

export class EnhancedCrochetScriptCompiler {
  private errors: CompilerError[] = []
  private patternSequence: string[] = []
  private patternType: "linear" | "circular" | "granny-square" = "linear"
  private currentContext: string[] = []
  private metadata = {
    rounds: 0,
    stitchCount: 0,
    techniques: [] as string[]
  }

  compile(code: string): CompilerResult {
    this.errors = []
    this.patternSequence = []
    this.patternType = "linear"
    this.currentContext = []
    this.metadata = { rounds: 0, stitchCount: 0, techniques: [] }

    try {
      // Detect pattern type from code
      this.detectPatternType(code)
      
      const lines = code.split('\n')
      for (let i = 0; i < lines.length; i++) {
        this.parseLine(lines[i], i + 1)
      }
      
      this.metadata.stitchCount = this.patternSequence.length
    } catch (error) {
      this.errors.push({
        line: 1,
        column: 1,
        message: `Compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: "error"
      })
    }

    return {
      patternSequence: [...this.patternSequence],
      patternType: this.patternType,
      errors: [...this.errors],
      success: this.errors.filter(e => e.severity === "error").length === 0,
      metadata: { ...this.metadata }
    }
  }

  private detectPatternType(code: string): void {
    const lowerCode = code.toLowerCase()
    
    if (lowerCode.includes('magic_ring') || lowerCode.includes('magic ring') || lowerCode.includes('granny')) {
      this.patternType = lowerCode.includes('granny') ? "granny-square" : "circular"
      this.metadata.techniques.push('circular construction')
    } else if (lowerCode.includes('round') || lowerCode.includes('join')) {
      this.patternType = "circular"
      this.metadata.techniques.push('circular construction')
    }
  }

  private parseLine(line: string, lineNumber: number): void {
    const trimmed = line.trim()
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//')) {
      return
    }

    // Remove inline comments
    const codeOnly = trimmed.split('//')[0].trim()
    if (!codeOnly) return

    try {
      this.parseStatement(codeOnly, lineNumber)
    } catch (error) {
      this.errors.push({
        line: lineNumber,
        column: 1,
        message: error instanceof Error ? error.message : 'Parse error',
        severity: "error"
      })
    }
  }

  private parseStatement(statement: string, lineNumber: number): void {
    // Handle different statement types
    
    // Round definitions: round { ... } or round(number) { ... }
    const roundMatch = statement.match(/^round(?:\s*\(\s*(\d+)\s*\))?\s*\{/)
    if (roundMatch) {
      this.metadata.rounds++
      this.currentContext.push('round')
      this.metadata.techniques.push('rounds')
      return
    }

    // Magic ring with stitches: magic_ring { ... }
    if (statement.match(/^magic_ring\s*\{/)) {
      this.patternSequence.push('magic-ring')
      this.currentContext.push('magic_ring')
      this.metadata.techniques.push('magic ring')
      return
    }

    // Granny square specific patterns
    const grannyMatch = statement.match(/^granny(?:_square)?\s*\{/)
    if (grannyMatch) {
      this.patternType = "granny-square"
      this.patternSequence.push('magic-ring')
      this.currentContext.push('granny')
      this.metadata.techniques.push('granny square')
      return
    }

    // Repeat blocks with enhanced syntax: repeat(count) { ... }
    const repeatMatch = statement.match(/^repeat\s*\(\s*(\d+)\s*\)\s*\{(.*)/)
    if (repeatMatch) {
      let count = parseInt(repeatMatch[1], 10)
      const content = repeatMatch[2]?.trim()
      
      if (content && content !== '') {
        // Safety check for repeat operations
        if (count > SAFETY_LIMITS.MAX_SINGLE_OPERATION_STITCHES) {
          this.errors.push({
            line: lineNumber,
            column: 1,
            message: `Excessive repeat count (${count}). Maximum allowed is ${SAFETY_LIMITS.MAX_SINGLE_OPERATION_STITCHES}. Repeat truncated to prevent system crash.`,
            severity: "error"
          })
          count = SAFETY_LIMITS.MAX_SINGLE_OPERATION_STITCHES
        } else if (count > SAFETY_LIMITS.WARNING_SINGLE_OPERATION) {
          this.errors.push({
            line: lineNumber,
            column: 1,
            message: `Large repeat count (${count}). Consider breaking into smaller repeats for better performance.`,
            severity: "warning"
          })
        }

        // Inline repeat - parse content immediately
        for (let i = 0; i < count; i++) {
          this.parseStatement(content.replace(/\}$/, ''), lineNumber)
        }
      } else {
        // Block repeat - handle in block parsing
        this.currentContext.push(`repeat:${count}`)
      }
      return
    }

    // Function calls with multiple parameters: stitch(count, modifier)
    const complexFunctionMatch = statement.match(/^(\w+)\s*\(\s*(\d+)(?:\s*,\s*(\w+))?\s*\)/)
    if (complexFunctionMatch) {
      const [, stitchType, countStr, modifier] = complexFunctionMatch
      const count = parseInt(countStr, 10)
      
      let actualStitchType = stitchType
      if (modifier) {
        // Handle modifiers like dc(3, cluster) or tr(4, together)
        if (modifier === 'cluster') {
          actualStitchType = `${count}${stitchType}-cluster`
          this.addStitches(actualStitchType, 1, lineNumber)
          this.metadata.techniques.push('clusters')
          return
        } else if (modifier === 'together' || modifier === 'tog') {
          actualStitchType = `${stitchType}${count}tog`
          this.addStitches(actualStitchType, 1, lineNumber)
          this.metadata.techniques.push('decreases')
          return
        }
      }
      
      this.addStitches(stitchType, count, lineNumber)
      return
    }

    // Simple function calls: stitch(count)
    const functionMatch = statement.match(/^(\w+)\s*\(\s*(\d+)\s*\)/)
    if (functionMatch) {
      const [, stitchType, countStr] = functionMatch
      const count = parseInt(countStr, 10)
      this.addStitches(stitchType, count, lineNumber)
      return
    }

    // Post stitch notation: fpdc, bpdc, fptr, bptr
    const postStitchMatch = statement.match(/^([fb]p)(dc|tr|hdc)\s*(?:\(\s*(\d+)\s*\))?/)
    if (postStitchMatch) {
      const [, postType, baseStitch, countStr] = postStitchMatch
      const count = countStr ? parseInt(countStr, 10) : 1
      const stitchName = `${postType === 'fp' ? 'front-post' : 'back-post'}-${baseStitch}`
      this.addStitches(stitchName, count, lineNumber)
      this.metadata.techniques.push('post stitches')
      return
    }

    // Shell stitches: shell(count) or shell
    const shellMatch = statement.match(/^shell\s*(?:\(\s*(\d+)\s*\))?/)
    if (shellMatch) {
      const count = shellMatch[1] ? parseInt(shellMatch[1], 10) : 1
      this.addStitches('shell', count, lineNumber)
      this.metadata.techniques.push('shells')
      return
    }

    // Cluster stitches: 3dc_cluster, 5dc_cluster, etc.
    const clusterMatch = statement.match(/^(\d+)(dc|hdc|tr)_cluster/)
    if (clusterMatch) {
      const [, , baseStitch] = clusterMatch
      this.addStitches(`cluster`, 1, lineNumber)
      this.metadata.techniques.push('clusters')
      return
    }

    // Decrease stitches: sc2tog, dc3tog, etc.
    const decreaseMatch = statement.match(/^(sc|dc|hdc|tr)(\d+)tog/)
    if (decreaseMatch) {
      const [, baseStitch, countStr] = decreaseMatch
      this.addStitches(`${baseStitch}${countStr}tog`, 1, lineNumber)
      this.metadata.techniques.push('decreases')
      return
    }

    // Chain spaces and arches: ch(count) space
    const chainSpaceMatch = statement.match(/^ch\s*\(\s*(\d+)\s*\)\s*(?:space|sp|arch)/)
    if (chainSpaceMatch) {
      const count = parseInt(chainSpaceMatch[1], 10)
      this.addStitches('ch', count, lineNumber)
      this.metadata.techniques.push('chain spaces')
      return
    }

    // Picots: ch3_picot, picot
    if (statement.match(/^(?:ch3_)?picot/)) {
      this.addStitches('picot', 1, lineNumber)
      this.metadata.techniques.push('picots')
      return
    }

    // Simple stitch names without parentheses
    const stitchMatch = statement.match(/^(\w+)$/)
    if (stitchMatch) {
      const [, stitchType] = stitchMatch
      this.addStitches(stitchType, 1, lineNumber)
      return
    }

    // Block closers
    if (statement === '}') {
      this.currentContext.pop()
      return
    }

    // Special commands
    const specialCommands = ['turn', 'join', 'sl_st', 'ch', 'start', 'end']
    if (specialCommands.includes(statement)) {
      this.patternSequence.push(statement)
      return
    }

    // Unknown statement
    this.errors.push({
      line: lineNumber,
      column: 1,
      message: `Unknown statement: ${statement}`,
      severity: "warning"
    })
  }

  private addStitches(stitchType: string, count: number, lineNumber: number = 1): void {
    // Safety check for single operation
    if (count > SAFETY_LIMITS.MAX_SINGLE_OPERATION_STITCHES) {
      this.errors.push({
        line: lineNumber,
        column: 1,
        message: `Excessive stitch count (${count}). Maximum allowed per operation is ${SAFETY_LIMITS.MAX_SINGLE_OPERATION_STITCHES}. Operation truncated to prevent system crash.`,
        severity: "error"
      })
      count = SAFETY_LIMITS.MAX_SINGLE_OPERATION_STITCHES
    } else if (count > SAFETY_LIMITS.WARNING_SINGLE_OPERATION) {
      this.errors.push({
        line: lineNumber,
        column: 1,
        message: `Large stitch count (${count}). Consider breaking into smaller operations for better performance.`,
        severity: "warning"
      })
    }

    // Safety check for total pattern size
    const newTotalSize = this.patternSequence.length + count
    if (newTotalSize > SAFETY_LIMITS.MAX_TOTAL_PATTERN_STITCHES) {
      const allowedCount = Math.max(0, SAFETY_LIMITS.MAX_TOTAL_PATTERN_STITCHES - this.patternSequence.length)
      this.errors.push({
        line: lineNumber,
        column: 1,
        message: `Pattern too large. Maximum total stitches is ${SAFETY_LIMITS.MAX_TOTAL_PATTERN_STITCHES}. Only adding ${allowedCount} more stitches to prevent system crash.`,
        severity: "error"
      })
      count = allowedCount
    } else if (newTotalSize > SAFETY_LIMITS.WARNING_TOTAL_PATTERN) {
      this.errors.push({
        line: lineNumber,
        column: 1,
        message: `Large pattern detected (${newTotalSize} stitches). Performance may be affected.`,
        severity: "warning"
      })
    }

    // Don't add any stitches if we've hit the limit
    if (count <= 0) {
      return
    }
    // Enhanced stitch mapping with aliases and variations
    const stitchMap: Record<string, string> = {
      // Basic stitches
      'chain': 'chain',
      'ch': 'chain',
      'sc': 'single-crochet',
      'single_crochet': 'single-crochet',
      'dc': 'double-crochet',
      'double_crochet': 'double-crochet',
      'hdc': 'half-double',
      'half_double': 'half-double',
      'half_double_crochet': 'half-double',
      'tr': 'treble',
      'treble': 'treble',
      'treble_crochet': 'treble',
      'dtr': 'double-treble',
      'double_treble': 'double-treble',
      'sl': 'slip-stitch',
      'slip_stitch': 'slip-stitch',
      'sl_st': 'slip-stitch',
      
      // Post stitches
      'front-post-dc': 'front-post-dc',
      'fpdc': 'front-post-dc',
      'back-post-dc': 'back-post-dc',
      'bpdc': 'back-post-dc',
      'front-post-tr': 'front-post-tr',
      'fptr': 'front-post-tr',
      'back-post-tr': 'back-post-tr',
      'bptr': 'back-post-tr',
      
      // Decrease stitches
      'sc2tog': 'sc2tog',
      'dc2tog': 'dc2tog',
      'dc3tog': 'dc3tog',
      'sc3tog': 'sc3tog',
      
      // Complex stitches
      'shell': 'shell',
      '5dc-shell': '5dc-shell',
      'cluster': 'cluster',
      '3dc-cluster': '3dc-cluster',
      '3hdc-cluster': '3hdc-cluster',
      'popcorn': 'popcorn',
      '5dc-popcorn': '5dc-popcorn',
      
      // Special elements
      'magic_ring': 'magic-ring',
      'magic-ring': 'magic-ring',
      'ring': 'ring',
      'picot': 'picot',
      'ch3_picot': 'ch3-picot',
      'start': 'start',
      'end': 'end',
      'turn': 'turn',
      'join': 'join',
    }

    const mappedStitch = stitchMap[stitchType.toLowerCase()]
    if (!mappedStitch) {
      // Try to handle unknown compound stitches
      if (stitchType.includes('tog')) {
        this.patternSequence.push(stitchType)
        this.metadata.techniques.push('decreases')
        return
      } else if (stitchType.includes('cluster')) {
        this.patternSequence.push('cluster')
        this.metadata.techniques.push('clusters')
        return
      } else {
        // Add as unknown stitch
        for (let i = 0; i < count; i++) {
          this.patternSequence.push(stitchType)
        }
        return
      }
    }

    // Add the stitches to the pattern
    for (let i = 0; i < count; i++) {
      this.patternSequence.push(mappedStitch)
    }
  }
}

// Export a singleton instance for easy use
export const enhancedCrochetCompiler = new EnhancedCrochetScriptCompiler()

// Helper function for quick compilation
export function compileEnhancedCrochetScript(code: string): CompilerResult {
  return enhancedCrochetCompiler.compile(code)
} 