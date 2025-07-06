"use client"

import { Book } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXAMPLE_PATTERNS } from "@/lib/pattern-examples"

interface ExamplePatternsSelectorProps {
  selectedExample: string
  onExampleChange: (exampleKey: string) => void
}

export default function ExamplePatternsSelector({
  selectedExample,
  onExampleChange
}: ExamplePatternsSelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-extralight flex items-center gap-2">
          <Book className="h-5 w-5" />
          Example Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedExample} onValueChange={onExampleChange}>
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder="Choose an example pattern" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXAMPLE_PATTERNS).map(([key, pattern]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col">
                      <span className="font-light text-left">{pattern.name}</span>
                      <span className="text-xs text-gray-500">{pattern.description}</span>
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