"use client"

import { FileCode } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CrochetCodeEditor from "@/components/crochet-code-editor"

interface CodeEditorPanelProps {
  code: string
  onCodeChange: (code: string) => void
  onCompile?: (code: string) => void
  theme?: "light" | "dark"
}

export default function CodeEditorPanel({
  code,
  onCodeChange,
  onCompile,
  theme
}: CodeEditorPanelProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-extralight flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          CrochetScript Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-full px-6 pb-6">
          <CrochetCodeEditor
            value={code}
            onChange={onCodeChange}
            onCompile={onCompile}
            theme={theme === "dark" ? "dark" : "light"}
          />
        </div>
      </CardContent>
    </Card>
  )
} 