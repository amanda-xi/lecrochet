"use client"

import React from 'react'
import Image from 'next/image'
import { STITCH_SVG_MAP } from '@/lib/stitch-mappings'
import { HoveredStitchInfo } from './stitch-vertex'

interface StitchTooltipProps {
  hoveredStitch: HoveredStitchInfo | null
  patternType: 'linear' | 'circular' | 'granny-square'
}

// Enhanced SVG mapping function that uses the comprehensive stitch mappings
const getStitchSVG = (stitchType: string): string => {
  // First try to get from the comprehensive mapping
  const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP[stitchType.toLowerCase()]
  if (stitchInfo) {
    return stitchInfo.file
  }

  // Enhanced fallback mapping for edge cases and variations
  const fallbackMap: Record<string, string> = {
    // Basic stitch variations
    'single': 'sc.svg',
    'double': 'dc.svg', 
    'half-double': 'hdc.svg',
    'treble': 'tr.svg',
    'double-treble': 'dtr.svg',
    'chain': 'ch.svg',
    'slip': 'sl_st.svg',
    'slip-stitch': 'sl_st.svg',
    'sl_st': 'sl_st.svg',
    
    // Magic ring variations
    'magic-ring': 'adjustable_ring.svg',
    'adjustable-ring': 'adjustable_ring.svg',
    'ring': 'ring.svg',
    'magic_ring': 'adjustable_ring.svg',
    
    // Post stitch variations
    'FPdc': 'FPdc.svg',
    'BPdc': 'BPdc.svg', 
    'FPtr': 'FPtr.svg',
    'BPtr': 'BPtr.svg',
    'front-post-dc': 'FPdc.svg',
    'back-post-dc': 'BPdc.svg',
    'front-post-tr': 'FPtr.svg',
    'back-post-tr': 'BPtr.svg',
    
    // Decrease variations  
    'sc2tog': 'sc2tog.svg',
    'dc2tog': 'dc2tog.svg',
    'sc3tog': 'sc3tog.svg', 
    'dc3tog': 'dc3tog.svg',
    
    // Complex stitches
    'picot': 'ch3_picot.svg',
    'ch3-picot': 'ch3_picot.svg',
    'ch3_picot': 'ch3_picot.svg',
    'shell': '5dc_shell.svg',
    '5dc-shell': '5dc_shell.svg',
    'cluster': '3dc_cluster.svg',
    '3dc-cluster': '3dc_cluster.svg',
    '3hdc-cluster': '3hdc_cluster.svg',
    'popcorn': '5dc_popcorn.svg',
    '5dc-popcorn': '5dc_popcorn.svg',
    
    // Special commands
    'start': 'start.svg',
    'end': 'normal_closing.svg',
    'turn': 'turn.svg',
    'join': 'normal_closing.svg'
  }
  
  // Try normalized lookup
  const normalized = stitchType.toLowerCase().replace(/[^a-z0-9]/g, '-')
  if (fallbackMap[normalized]) {
    return fallbackMap[normalized]
  }
  
  // Try original stitch type
  if (fallbackMap[stitchType.toLowerCase()]) {
    return fallbackMap[stitchType.toLowerCase()]
  }
  
  // Check for numbered cluster patterns (e.g., "5dc-cluster")
  const clusterMatch = stitchType.match(/(\d+)(dc|hdc|tr)-?cluster/i)
  if (clusterMatch) {
    const [, count, baseStitch] = clusterMatch
    return `${count}${baseStitch.toLowerCase()}_cluster.svg`
  }
  
  // Check for numbered shell patterns
  const shellMatch = stitchType.match(/(\d+)(dc|hdc|tr)-?shell/i)
  if (shellMatch) {
    const [, count, baseStitch] = shellMatch
    return `${count}${baseStitch.toLowerCase()}_shell.svg`
  }
  
  // Check for numbered popcorn patterns
  const popcornMatch = stitchType.match(/(\d+)(dc|hdc|tr)-?popcorn/i)
  if (popcornMatch) {
    const [, count, baseStitch] = popcornMatch
    return `${count}${baseStitch.toLowerCase()}_popcorn.svg`
  }
  
  // Check for numbered decrease patterns
  const decreaseMatch = stitchType.match(/(sc|dc|hdc|tr)(\d+)tog/i)
  if (decreaseMatch) {
    const [, baseStitch, count] = decreaseMatch
    return `${baseStitch.toLowerCase()}${count}tog.svg`
  }
  
  // Try numbered stitch files as last resort (st1.svg, st2.svg, etc.)
  const numberMatch = stitchType.match(/(\d+)/)
  if (numberMatch) {
    const num = parseInt(numberMatch[1])
    if (num >= 1 && num <= 77) {
      return `st${num}.svg`
    }
  }
  
  // Default fallback
  console.warn(`No SVG mapping found for stitch type: "${stitchType}". Using unknown.svg`)
  return 'unknown.svg'
}

export default function StitchTooltip({ 
  hoveredStitch,
  patternType 
}: StitchTooltipProps) {
  if (!hoveredStitch) return null
  
  const formatStitchName = (stitchType: string) => {
    const nameMap: Record<string, string> = {
      'sc': 'single crochet',
      'single-crochet': 'single crochet',
      'dc': 'double crochet',
      'double-crochet': 'double crochet', 
      'hdc': 'half double crochet',
      'half-double': 'half double crochet',
      'tr': 'treble crochet',
      'treble': 'treble crochet',
      'dtr': 'double treble crochet',
      'double-treble': 'double treble crochet',
      'ch': 'chain',
      'chain': 'chain',
      'sl': 'slip stitch',
      'slip-stitch': 'slip stitch',
      'sl_st': 'slip stitch',
      'sc2tog': 'single crochet 2 together',
      'dc2tog': 'double crochet 2 together',
      'sc3tog': 'single crochet 3 together', 
      'dc3tog': 'double crochet 3 together',
      'magic-ring': 'magic ring',
      'magic_ring': 'magic ring',
      'ring': 'magic ring',
      'fpdc': 'front post double crochet',
      'front-post-dc': 'front post double crochet',
      'bpdc': 'back post double crochet',
      'back-post-dc': 'back post double crochet',
      'fptr': 'front post treble crochet',
      'front-post-tr': 'front post treble crochet',
      'bptr': 'back post treble crochet',
      'back-post-tr': 'back post treble crochet',
      'shell': 'shell stitch',
      'cluster': 'cluster stitch',
      'popcorn': 'popcorn stitch',
      'picot': 'picot'
    }
    
    // Handle numbered variations
    const clusterMatch = stitchType.match(/(\d+)(dc|hdc|tr)-?cluster/i)
    if (clusterMatch) {
      const [, count, baseStitch] = clusterMatch
      return `${count} ${baseStitch.toLowerCase()} cluster`
    }
    
    const shellMatch = stitchType.match(/(\d+)(dc|hdc|tr)-?shell/i)
    if (shellMatch) {
      const [, count, baseStitch] = shellMatch
      return `${count} ${baseStitch.toLowerCase()} shell`
    }
    
    return nameMap[stitchType.toLowerCase()] || stitchType
  }

  const getPositionLabel = () => {
    const { round, position, stitchType } = hoveredStitch
    
    // Special handling for magic ring
    if (round === 0 && (stitchType === 'magic-ring' || stitchType === 'ring' || stitchType === 'magic_ring')) {
      return 'Magic Ring (center)'
    }
    
    // Determine whether to use "Round" or "Row"
    const roundOrRow = patternType === 'linear' ? 'Row' : 'Round'
    
    // Format position with ordinal suffix
    const getOrdinal = (n: number) => {
      if (n === 1) return '1st'
      if (n === 2) return '2nd' 
      if (n === 3) return '3rd'
      return `${n}th`
    }
    
    return `${roundOrRow} ${round}, ${getOrdinal(position)} ${stitchType}`
  }

  const svgFile = getStitchSVG(hoveredStitch.stitchType)
  
  return (
    <div 
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none"
      style={{
        left: `${hoveredStitch.screenX + 10}px`,
        top: `${hoveredStitch.screenY - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded border">
          <Image
            src={`/stitches/${svgFile}`}
            alt={hoveredStitch.stitchType}
            width={32}
            height={32}
            className="w-8 h-8"
            onError={(e) => {
              console.warn(`Failed to load SVG: ${svgFile} for stitch: ${hoveredStitch.stitchType}`)
              // Fallback to unknown.svg
              const target = e.target as HTMLImageElement
              target.src = '/stitches/unknown.svg'
            }}
          />
        </div>
        <div>
          <div className="font-medium text-sm">
            {getPositionLabel()}
          </div>
          <div className="text-xs text-gray-500">
            {formatStitchName(hoveredStitch.stitchType)}
          </div>
          <div className="text-xs text-gray-400">
            SVG: {svgFile}
          </div>
        </div>
      </div>
    </div>
  )
}

export { getStitchSVG }
export type { StitchTooltipProps } 