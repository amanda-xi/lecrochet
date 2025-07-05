// Comprehensive stitch mapping using available SVG files
export const STITCH_SVG_MAP: Record<string, { file: string; width: number; height: number }> = {
  // Basic stitches
  'chain': { file: 'ch.svg', width: 32, height: 16 },
  'ch': { file: 'ch.svg', width: 32, height: 16 },
  'single-crochet': { file: 'sc.svg', width: 32, height: 32 },
  'sc': { file: 'sc.svg', width: 32, height: 32 },
  'double-crochet': { file: 'dc.svg', width: 32, height: 80 },
  'dc': { file: 'dc.svg', width: 32, height: 80 },
  'half-double': { file: 'hdc.svg', width: 32, height: 48 },
  'hdc': { file: 'hdc.svg', width: 32, height: 48 },
  'treble': { file: 'tr.svg', width: 32, height: 96 },
  'tr': { file: 'tr.svg', width: 32, height: 96 },
  'double-treble': { file: 'dtr.svg', width: 32, height: 112 },
  'dtr': { file: 'dtr.svg', width: 32, height: 112 },
  'slip-stitch': { file: 'sl_st.svg', width: 32, height: 20 },
  'sl': { file: 'sl_st.svg', width: 32, height: 20 },
  
  // Post stitches
  'front-post-dc': { file: 'FPdc.svg', width: 32, height: 80 },
  'fpdc': { file: 'FPdc.svg', width: 32, height: 80 },
  'back-post-dc': { file: 'BPdc.svg', width: 32, height: 80 },
  'bpdc': { file: 'BPdc.svg', width: 32, height: 80 },
  'front-post-tr': { file: 'FPtr.svg', width: 32, height: 96 },
  'fptr': { file: 'FPtr.svg', width: 32, height: 96 },
  'back-post-tr': { file: 'BPtr.svg', width: 32, height: 96 },
  'bptr': { file: 'BPtr.svg', width: 32, height: 96 },
  
  // Decrease stitches
  'sc2tog': { file: 'sc2tog.svg', width: 48, height: 32 },
  'dc2tog': { file: 'dc2tog.svg', width: 48, height: 80 },
  'dc3tog': { file: 'dc3tog.svg', width: 64, height: 80 },
  'sc3tog': { file: 'sc3tog.svg', width: 64, height: 32 },
  
  // Cluster stitches
  '3dc-cluster': { file: '3dc_cluster.svg', width: 48, height: 80 },
  '3hdc-cluster': { file: '3hdc_cluster.svg', width: 48, height: 48 },
  'cluster': { file: '3dc_cluster.svg', width: 48, height: 80 },
  
  // Shell and fan stitches
  '5dc-shell': { file: '5dc_shell.svg', width: 80, height: 80 },
  'shell': { file: '5dc_shell.svg', width: 80, height: 80 },
  '5dc-popcorn': { file: '5dc_popcorn.svg', width: 48, height: 80 },
  'popcorn': { file: '5dc_popcorn.svg', width: 48, height: 80 },
  
  // Special elements
  'magic-ring': { file: 'adjustable_ring.svg', width: 48, height: 48 },
  'ring': { file: 'ring.svg', width: 48, height: 48 },
  'start': { file: 'start.svg', width: 24, height: 24 },
  'end': { file: 'end.svg', width: 24, height: 24 },
  'join': { file: 'normal_closing.svg', width: 24, height: 24 },
  
  // Default fallback
  'unknown': { file: 'unknown.svg', width: 32, height: 32 },
} 