"use client"

import { useState } from "react"
import { FileCode, Bot, Maximize2, Minimize2 } from "lucide-react"
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
  isFullScreen?: boolean
  onToggleFullScreen?: () => void
}

export default function CodeEditorPanel({
  code,
  onCodeChange,
  onCompile,
  theme,
  compilerResult,
  isFullScreen = false,
  onToggleFullScreen
}: CodeEditorPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePatternConverted = (convertedPattern: string) => {
    // Replace the current code with the converted pattern
    onCodeChange(convertedPattern)
  }

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl font-extralight flex items-center gap-2">
              <FileCode className="h-4 w-4 sm:h-5 sm:w-5" />
              CrocheTeX Code
            </CardTitle>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {onToggleFullScreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleFullScreen}
                  className="flex items-center gap-1 flex-shrink-0 px-2 sm:px-3"
                  title={isFullScreen ? "Exit Full Screen (Esc)" : "Enter Full Screen"}
                >
                  {isFullScreen ? <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {/* <span className="hidden sm:inline">{isFullScreen ? "Exit Code Editor" : "Code Editor"}</span> */}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 flex-shrink-0 px-2 sm:px-3"
              >
                <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Convert Pattern</span>
                <span className="sm:hidden text-xs">Convert</span>
              </Button>
            </div>
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