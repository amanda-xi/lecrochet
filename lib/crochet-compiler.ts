// CrochetScript Compiler
// Converts CrochetScript code into renderable pattern sequences

export interface CompilerError {
  line: number
  column: number
  message: string
  severity: "error" | "warning"
}

export interface CompilerResult {
  patternSequence: string[]
  errors: CompilerError[]
  success: boolean
}



export class CrochetScriptCompiler {
  private errors: CompilerError[] = []
  private patternSequence: string[] = []

  compile(code: string): CompilerResult {
    this.errors = []
    this.patternSequence = []

    try {
      const lines = code.split('\n')
      for (let i = 0; i < lines.length; i++) {
        this.parseLine(lines[i], i + 1)
      }
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
      errors: [...this.errors],
      success: this.errors.filter(e => e.severity === "error").length === 0
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
    
    // Function calls: stitch(count)
    const functionMatch = statement.match(/^(\w+)\s*\(\s*(\d+)\s*\)/)
    if (functionMatch) {
      const [, stitchType, countStr] = functionMatch
      const count = parseInt(countStr, 10)
      this.addStitches(stitchType, count)
      return
    }

    // Simple stitch names without parentheses
    const stitchMatch = statement.match(/^(\w+)$/)
    if (stitchMatch) {
      const [, stitchType] = stitchMatch
      this.addStitches(stitchType, 1)
      return
    }

    // Repeat blocks: repeat(count) { ... }
    const repeatMatch = statement.match(/^repeat\s*\(\s*(\d+)\s*\)\s*\{/)
    if (repeatMatch) {
      // For now, we'll handle simple cases
      // In a full implementation, this would need proper block parsing
      this.errors.push({
        line: lineNumber,
        column: 1,
        message: "Repeat blocks not fully implemented yet",
        severity: "warning"
      })
      return
    }

    // Row blocks: row { ... }
    if (statement.match(/^row\s*\{/)) {
      // Add a turn indicator
      this.patternSequence.push("turn")
      return
    }

    // Magic ring: magic_ring { ... }
    if (statement.match(/^magic_ring\s*\{/)) {
      this.patternSequence.push("magic-ring")
      return
    }

    // Block closers
    if (statement === '}') {
      return
    }

    // Common standalone commands
    if (statement === 'turn') {
      this.patternSequence.push("turn")
      return
    }

    if (statement === 'join') {
      this.patternSequence.push("join")
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

  private addStitches(stitchType: string, count: number): void {
    // Map CrochetScript stitch names to our internal pattern IDs
    const stitchMap: Record<string, string> = {
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
      'st': 'slip-stitch',
      'shell': 'shell-stitch',
      'bob': 'bobble-stitch',
      'bobble': 'bobble-stitch',
      'pc': 'popcorn-stitch',
      'popcorn': 'popcorn-stitch',
    }

    const mappedStitch = stitchMap[stitchType.toLowerCase()]
    if (!mappedStitch) {
      // Add as unknown stitch but don't error
      for (let i = 0; i < count; i++) {
        this.patternSequence.push(stitchType)
      }
      return
    }

    // Add the stitches to the pattern
    for (let i = 0; i < count; i++) {
      this.patternSequence.push(mappedStitch)
    }
  }
}

// Export a singleton instance for easy use
export const crochetCompiler = new CrochetScriptCompiler()

// Helper function for quick compilation
export function compileCrochetScript(code: string): CompilerResult {
  return crochetCompiler.compile(code)
} 