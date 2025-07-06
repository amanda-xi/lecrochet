export interface PatternExample {
  name: string
  description: string
  code: string
}

export const EXAMPLE_PATTERNS: Record<string, PatternExample> = {

  "Custom-Pattern": {
    name: "Custom Pattern",
    description: "Custom pattern",
    code: `// Custom Pattern

end`
  },

  "basic-scarf": {
    name: "Basic Scarf",
    description: "Simple linear pattern with single crochet",
    code: `// Basic Scarf Pattern
// Foundation chain
chain(30)
turn

// Row 1
sc(28)
ch(1)
turn

// Repeat rows
repeat(10) {
  sc(28)
  ch(1) 
  turn
}

// Finish
end`
  },
  
  "granny-square": {
    name: "Granny Square",
    description: "Classic granny square with shells and chains",
    code: `// Classic Granny Square
// Start with magic ring
magic_ring {
  // Round 1: Foundation
  ch(3)
  dc(2)
  ch(2)
  repeat(3) {
    dc(3)
    ch(2)
  }
  join
}

// Round 2: Corner shells
round {
  ch(3)
  repeat(4) {
    shell(5)
    ch(2)
  }
  join
}

// Round 3: Sides and corners
round {
  repeat(4) {
    dc(3)
    ch(1)
    shell(5)
    ch(2)
  }
  join
}

end`
  },

  "circular-doily": {
    name: "Circular Doily",
    description: "Circular pattern with picots and chains",
    code: `// Circular Doily Pattern
magic_ring {
  // Round 1
  sc(8)
  join
}

// Round 2: Increase
round {
  repeat(8) {
    sc(2)
  }
  join
}

// Round 3: Chain arches
round {
  repeat(8) {
    ch(3)
    sc(1)
  }
  join
}

// Round 4: Picot round
round {
  repeat(8) {
    dc(3)
    picot
    ch(2)
  }
  join
}

end`
  },

  "post-stitch-sample": {
    name: "Post Stitch Pattern",
    description: "Demonstrating front and back post stitches",
    code: `// Post Stitch Ribbing
chain(24)
turn

// Foundation row
dc(22)
ch(3)
turn

// Ribbing pattern
repeat(8) {
  dc(2)
  tr(2)
  repeat(5) {
    dc(2)
    tr(2)
  }
  ch(3)
  turn
}

end`
  },

  "cluster-pattern": {
    name: "Cluster Stitch Pattern",
    description: "Advanced pattern with clusters and shells",
    code: `// Cluster and Shell Pattern
chain(32)
turn

// Row 1: Foundation
dc(30)
ch(3)
turn

// Row 2: Cluster row
repeat(10) {
  cluster
  ch(2)
}
turn

// Row 3: Shell row  
repeat(5) {
  dc(5)
  ch(1)
}

end`
  },

  "magic-ring-test": {
    name: "Magic Ring Test",
    description: "Simple magic ring with basic stitches for testing centering",
    code: `// Magic Ring Test
magic_ring {
  dc(11)
  join
}

round {
  repeat(12) {
    dc(2)
  }
  join
}

end`
  }
} 