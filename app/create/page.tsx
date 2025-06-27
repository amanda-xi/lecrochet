"use client"

import { useState } from "react"
import { Plus, Share2, Settings, Sun, Moon, Monitor, Import } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import CrochetPreview3D from "@/components/crochet-preview-3d"
import CrochetDiagram2D from "@/components/crochet-diagram-2d"
import { useTheme } from "next-themes"

const crochetPatterns = [
  { id: "single-crochet", name: "Single Crochet", abbreviation: "sc", difficulty: "Beginner" },
  { id: "double-crochet", name: "Double Crochet", abbreviation: "dc", difficulty: "Beginner" },
  { id: "half-double", name: "Half Double Crochet", abbreviation: "hdc", difficulty: "Beginner" },
  { id: "treble", name: "Treble Crochet", abbreviation: "tr", difficulty: "Intermediate" },
  { id: "shell-stitch", name: "Shell Stitch", abbreviation: "shell", difficulty: "Intermediate" },
  { id: "granny-square", name: "Granny Square", abbreviation: "gs", difficulty: "Intermediate" },
  { id: "bobble-stitch", name: "Bobble Stitch", abbreviation: "bob", difficulty: "Advanced" },
  { id: "popcorn-stitch", name: "Popcorn Stitch", abbreviation: "pc", difficulty: "Advanced" },
]

export default function CreatePage() {
  const [selectedPattern, setSelectedPattern] = useState("")
  const [notes, setNotes] = useState("")
  const [patternSequence, setPatternSequence] = useState<string[]>([])
  const { theme, setTheme } = useTheme()

  const addPatternToSequence = (patternId: string) => {
    setPatternSequence((prev) => [...prev, patternId])
  }

  const removeFromSequence = (index: number) => {
    setPatternSequence((prev) => prev.filter((_, i) => i !== index))
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-sm font-light">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={cycleTheme} className="text-sm font-light">
                {getThemeIcon()}
              </Button>

              <Button variant="ghost" size="sm" className="text-sm font-light">
                <Import className="h-4 w-4 mr-2" />
                Import
              </Button>

              <Button variant="ghost" size="sm" className="text-sm font-light">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button variant="ghost" size="sm" className="text-sm font-light">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="ghost" size="sm" className="text-sm font-light">
                Sign In
              </Button>

              <Button size="sm" className="bg-black text-white hover:bg-gray-800 text-sm font-light px-6">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight mb-4">Create Pattern</h1>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
            Design your crochet pattern with our interactive visualizer. Select stitches, add notes, and see your
            creation come to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pattern Builder */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-extralight">Pattern Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-light text-gray-600 mb-2 block">Select Stitch</label>
                  <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a stitch pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {crochetPatterns.map((pattern) => (
                        <SelectItem key={pattern.id} value={pattern.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-light">{pattern.name}</span>
                            <Badge variant="secondary" className="ml-2 text-xs font-light">
                              {pattern.difficulty}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => selectedPattern && addPatternToSequence(selectedPattern)}
                  disabled={!selectedPattern}
                  className="w-full bg-black text-white hover:bg-gray-800 text-sm font-light"
                >
                  Add to Pattern
                </Button>

                {/* Pattern Sequence */}
                {patternSequence.length > 0 && (
                  <div>
                    <label className="text-sm font-light text-gray-600 mb-2 block">Pattern Sequence</label>
                    <div className="flex flex-wrap gap-2">
                      {patternSequence.map((patternId, index) => {
                        const pattern = crochetPatterns.find((p) => p.id === patternId)
                        return (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer text-xs font-light"
                            onClick={() => removeFromSequence(index)}
                          >
                            {pattern?.abbreviation} ×
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-extralight">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add your pattern notes, yarn details, hook size, or any other important information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-32 font-light"
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panels */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2D Diagram */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="text-xl font-extralight">2D Diagram</CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0">
                <CrochetDiagram2D patternSequence={patternSequence} />
              </CardContent>
            </Card>

            {/* 3D Model */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="text-xl font-extralight">3D Preview</CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0">
                <CrochetPreview3D patternSequence={patternSequence} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-light">
            Save Pattern
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-black border border-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 text-sm font-light"
          >
            Export Pattern
          </Button>
        </div>
      </main>
    </div>
  )
}
