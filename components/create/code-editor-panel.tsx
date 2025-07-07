"use client"

import { useState } from "react"
import { FileCode, Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CrochetCodeEditor from "@/components/crochet-code-editor"
import PatternConverterModal from "./pattern-converter-modal"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface CodeEditorPanelProps {
  code: string
  onCodeChange: (code: string) => void
  onCompile?: (code: string) => void
  theme?: "light" | "dark"
  compilerResult?: CompilerResult | null
}

export default function CodeEditorPanel({
  code,
  onCodeChange,
  onCompile,
  theme,
  compilerResult
}: CodeEditorPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePatternConverted = (convertedPattern: string) => {
    // Replace the current code with the converted pattern
    onCodeChange(convertedPattern)
  }

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="text-xl font-extralight flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              CrocheTeX Code
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Convert Pattern</span>
              <span className="sm:hidden">Convert</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 min-h-0">
          <div className="h-full px-6 pb-6">
            <CrochetCodeEditor
              value={code}
              onChange={onCodeChange}
              onCompile={onCompile}
              theme={theme === "dark" ? "dark" : "light"}
              compilerResult={compilerResult}
            />
          </div>
        </CardContent>
      </Card>

      <PatternConverterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatternConverted={handlePatternConverted}
      />
    </>
  )
} 