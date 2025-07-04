"use client"

import { Book } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { EXAMPLE_PATTERNS } from "@/lib/pattern-examples"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface ExamplePatternsSelectorProps {
  selectedExample: string
  onExampleChange: (exampleKey: string) => void
  compilerResult: CompilerResult | null
}

export default function ExamplePatternsSelector({
  selectedExample,
  onExampleChange,
  compilerResult
}: ExamplePatternsSelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-extralight flex items-center gap-2">
          <Book className="h-5 w-5" />
          Example Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedExample} onValueChange={onExampleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an example pattern" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXAMPLE_PATTERNS).map(([key, pattern]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col">
                      <span className="font-light">{pattern.name}</span>
                      <span className="text-xs text-gray-500">{pattern.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {compilerResult?.metadata.techniques && compilerResult.metadata.techniques.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {compilerResult.metadata.techniques.slice(0, 3).map((technique, index) => (
                <Badge key={index} variant="outline" className="text-xs font-light">
                  {technique}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 