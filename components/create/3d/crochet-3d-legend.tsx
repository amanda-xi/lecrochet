"use client"

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'
import { getStitchColor } from '@/lib/3d-pattern-processor'
import { STITCH_SVG_MAP } from '@/lib/stitch-mappings'

interface CrochetLegendProps {
  patternSequence: string[]
  className?: string
}

interface StitchInfo {
  type: string
  displayName: string
  color: string
  count: number
  svgFile?: string
}

// Human-readable names for stitch types
const STITCH_DISPLAY_NAMES: Record<string, string> = {
  'chain': 'Chain',
  'ch': 'Chain',
  'single-crochet': 'Single Crochet',
  'sc': 'Single Crochet',
  'double-crochet': 'Double Crochet',
  'dc': 'Double Crochet',
  'half-double': 'Half Double Crochet',
  'hdc': 'Half Double Crochet',
  'treble': 'Treble Crochet',
  'tr': 'Treble Crochet',
  'double-treble': 'Double Treble',
  'dtr': 'Double Treble',
  'slip-stitch': 'Slip Stitch',
  'sl': 'Slip Stitch',
  'magic-ring': 'Magic Ring',
  'ring': 'Ring',
  'cluster': 'Cluster',
  'shell': 'Shell',
  'popcorn': 'Popcorn',
  'front-post-dc': 'Front Post DC',
  'fpdc': 'Front Post DC',
  'back-post-dc': 'Back Post DC',
  'bpdc': 'Back Post DC',
  'front-post-tr': 'Front Post TR',
  'fptr': 'Front Post TR',
  'back-post-tr': 'Back Post TR',
  'bptr': 'Back Post TR',
  'sc2tog': 'SC2TOG',
  'dc2tog': 'DC2TOG',
  'dc3tog': 'DC3TOG',
  'sc3tog': 'SC3TOG',
  '3dc-cluster': '3DC Cluster',
  '3hdc-cluster': '3HDC Cluster',
  '5dc-shell': '5DC Shell',
  '5dc-popcorn': '5DC Popcorn',
  'picot': 'Picot',
  'turn': 'Turn',
  'join': 'Join',
  'start': 'Start',
  'end': 'End'
}

export default function CrochetLegend({ patternSequence, className = "" }: CrochetLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const stitchInfo = useMemo(() => {
    const stitchCounts: Record<string, number> = {}
    
    // Count occurrences of each stitch type (excluding special commands)
    patternSequence.forEach(stitch => {
      if (stitch !== 'turn' && stitch !== 'join' && stitch !== 'start' && stitch !== 'end') {
        stitchCounts[stitch] = (stitchCounts[stitch] || 0) + 1
      }
    })
    
    // Convert to array of stitch info objects
    const stitches: StitchInfo[] = Object.entries(stitchCounts).map(([type, count]) => ({
      type,
      displayName: STITCH_DISPLAY_NAMES[type] || type.charAt(0).toUpperCase() + type.slice(1),
      color: getStitchColor(type),
      count,
      svgFile: STITCH_SVG_MAP[type]?.file
    }))
    
    // Sort by count descending, then by display name
    return stitches.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      }
      return a.displayName.localeCompare(b.displayName)
    })
  }, [patternSequence])
  
  const totalStitches = stitchInfo.reduce((sum, stitch) => sum + stitch.count, 0)
  
  if (stitchInfo.length === 0) {
    return null
  }
  
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-sm">Stitch Legend</span>
          <span className="text-xs text-gray-500">({totalStitches} total)</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </div>
      
      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {stitchInfo.map((stitch) => (
              <div key={stitch.type} className="flex items-center gap-3 text-sm">
                {/* Color indicator */}
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-300"
                  style={{ backgroundColor: stitch.color }}
                />
                
                {/* Stitch name and count */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {stitch.displayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stitch.count} {stitch.count === 1 ? 'stitch' : 'stitches'}
                  </div>
                </div>
                
                {/* SVG icon if available */}
                {stitch.svgFile && (
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <Image 
                      src={`/stitches/${stitch.svgFile}`}
                      alt={stitch.displayName}
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 rounded-b-lg">
            <div className="text-xs text-gray-600">
              <span className="font-medium">{stitchInfo.length}</span> different stitch types
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 