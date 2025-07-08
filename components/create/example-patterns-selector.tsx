"use client"

import { Book, User, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXAMPLE_PATTERNS } from "@/lib/pattern-examples"

interface Pattern {
  id: string
  title: string
  description: string | null
  pattern_code: string
  is_public: boolean
  created_at: string
  updated_at: string
}

interface ExamplePatternsSelectorProps {
  selectedExample: string
  onExampleChange: (exampleKey: string) => void
  savedPatterns?: Pattern[]
  isLoading?: boolean
}

export default function ExamplePatternsSelector({
  selectedExample,
  onExampleChange,
  savedPatterns = [],
  isLoading = false
}: ExamplePatternsSelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-extralight flex items-center gap-2">
          <Book className="h-5 w-5" />
          Pattern Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedExample} onValueChange={onExampleChange}>
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder="Choose a pattern to start with" />
              </SelectTrigger>
              <SelectContent>
                {/* User's Saved Patterns */}
                {savedPatterns.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Your Patterns
                    </div>
                    {savedPatterns.map((pattern) => (
                      <SelectItem key={`saved-${pattern.id}`} value={`saved-${pattern.id}`}>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-blue-500" />
                          <div className="flex flex-col">
                            <span className="font-light text-left">{pattern.title}</span>
                            <span className="text-xs text-gray-500">
                              {pattern.description || 'No description'}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="border-t my-1" />
                  </>
                )}
                
                {/* Loading state for saved patterns */}
                {isLoading && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Your Patterns
                    </div>
                    <div className="flex items-center gap-2 px-2 py-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm text-gray-500">Loading your patterns...</span>
                    </div>
                    <div className="border-t my-1" />
                  </>
                )}

                {/* Static Example Patterns */}
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Example Patterns
                </div>
                {Object.entries(EXAMPLE_PATTERNS).map(([key, pattern]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Book className="h-3 w-3 text-green-500" />
                      <div className="flex flex-col">
                        <span className="font-light text-left">{pattern.name}</span>
                        <span className="text-xs text-gray-500">{pattern.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 