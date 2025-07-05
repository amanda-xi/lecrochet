"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface StitchSymbol {
  name: string
  symbol: string
  description: string
  color?: string
  category: 'basic' | 'special' | 'decrease' | 'increase' | 'structure'
}

const STITCH_SYMBOLS: StitchSymbol[] = [
  // Basic Stitches
  { name: 'Chain', symbol: 'ch', description: 'Foundation chain or turning chain', color: '#8B5CF6', category: 'basic' },
  { name: 'Single Crochet', symbol: 'sc', description: 'Basic single crochet stitch', color: '#06B6D4', category: 'basic' },
  { name: 'Half Double', symbol: 'hdc', description: 'Half double crochet', color: '#F59E0B', category: 'basic' },
  { name: 'Double Crochet', symbol: 'dc', description: 'Double crochet stitch', color: '#10B981', category: 'basic' },
  { name: 'Treble', symbol: 'tr', description: 'Treble crochet', color: '#EF4444', category: 'basic' },
  { name: 'Double Treble', symbol: 'dtr', description: 'Double treble crochet', color: '#EC4899', category: 'basic' },
  { name: 'Slip Stitch', symbol: 'sl', description: 'Slip stitch for joining', color: '#6B7280', category: 'basic' },
  
  // Special Stitches
  { name: 'Magic Ring', symbol: 'magic-ring', description: 'Adjustable loop to start circular work', color: '#7C3AED', category: 'structure' },
  { name: 'Front Post DC', symbol: 'fpdc', description: 'Front post double crochet', color: '#059669', category: 'special' },
  { name: 'Back Post DC', symbol: 'bpdc', description: 'Back post double crochet', color: '#0D9488', category: 'special' },
  { name: 'Front Post TR', symbol: 'fptr', description: 'Front post treble', color: '#C2410C', category: 'special' },
  { name: 'Back Post TR', symbol: 'bptr', description: 'Back post treble', color: '#A21CAF', category: 'special' },
  
  // Decrease Stitches
  { name: 'SC2TOG', symbol: 'sc2tog', description: 'Single crochet 2 together', color: '#DC2626', category: 'decrease' },
  { name: 'DC2TOG', symbol: 'dc2tog', description: 'Double crochet 2 together', color: '#B91C1C', category: 'decrease' },
  { name: 'SC3TOG', symbol: 'sc3tog', description: 'Single crochet 3 together', color: '#991B1B', category: 'decrease' },
  { name: 'DC3TOG', symbol: 'dc3tog', description: 'Double crochet 3 together', color: '#7F1D1D', category: 'decrease' },
  
  // Cluster & Shell Stitches
  { name: '3DC Cluster', symbol: '3dc-cluster', description: '3 double crochet cluster', color: '#059669', category: 'increase' },
  { name: '3HDC Cluster', symbol: '3hdc-cluster', description: '3 half double cluster', color: '#0891B2', category: 'increase' },
  { name: '5DC Shell', symbol: '5dc-shell', description: '5 double crochet shell', color: '#DC2626', category: 'increase' },
  { name: 'Popcorn', symbol: 'popcorn', description: 'Popcorn stitch', color: '#D97706', category: 'increase' },
]

const CATEGORY_COLORS = {
  basic: 'bg-blue-100 text-blue-800',
  special: 'bg-purple-100 text-purple-800',
  decrease: 'bg-red-100 text-red-800',
  increase: 'bg-green-100 text-green-800',
  structure: 'bg-gray-100 text-gray-800'
}

const CATEGORY_NAMES = {
  basic: 'Basic Stitches',
  special: 'Special Stitches',
  decrease: 'Decrease Stitches',
  increase: 'Increase Stitches',
  structure: 'Structural Elements'
}

interface CrochetLegendProps {
  compact?: boolean
  showCategories?: string[]
  className?: string
}

export default function CrochetLegend({ 
  compact = false, 
  showCategories = ['basic', 'special', 'decrease', 'increase', 'structure'],
  className = ""
}: CrochetLegendProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    compact ? [] : showCategories
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredSymbols = STITCH_SYMBOLS.filter(symbol => 
    showCategories.includes(symbol.category)
  )

  const groupedSymbols = showCategories.reduce((acc, category) => {
    acc[category] = filteredSymbols.filter(symbol => symbol.category === category)
    return acc
  }, {} as Record<string, StitchSymbol[]>)

  if (compact) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {filteredSymbols.slice(0, 12).map((symbol) => (
              <div key={symbol.symbol} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: symbol.color || '#64748B' }}
                />
                <span className="font-mono">{symbol.symbol}</span>
              </div>
            ))}
          </div>
          {filteredSymbols.length > 12 && (
            <div className="text-xs text-gray-500 mt-2">
              +{filteredSymbols.length - 12} more symbols
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Crochet Symbol Legend</CardTitle>
        <p className="text-sm text-gray-600">
          Visual guide to all supported crochet symbols and their meanings
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedSymbols).map(([category, symbols]) => (
            <div key={category} className="border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2">
                  <Badge className={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}>
                    {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {symbols.length} symbols
                  </span>
                </div>
                {expandedCategories.includes(category) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedCategories.includes(category) && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {symbols.map((symbol) => (
                      <div key={symbol.symbol} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: symbol.color || '#64748B' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">{symbol.symbol}</span>
                            <span className="text-sm font-medium">{symbol.name}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{symbol.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 3D View Legend */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-900">3D View Guide</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Yarn Connections</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Structural Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Join Connections</span>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            In 3D view, vertices represent stitches and edges show yarn flow and structural relationships
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 