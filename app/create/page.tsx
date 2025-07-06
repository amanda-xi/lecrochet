"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { compileEnhancedCrocheTeX, type CompilerResult } from "@/lib/enhanced-crochet-compiler"
import { EXAMPLE_PATTERNS } from "@/lib/pattern-examples"
import CreateHeader from "@/components/create/create-header"
import ExamplePatternsSelector from "@/components/create/example-patterns-selector"
import CodeEditorPanel from "@/components/create/code-editor-panel"
import PreviewPanel from "@/components/create/preview-panel"



export default function CreatePage() {
  const [code, setCode] = useState(EXAMPLE_PATTERNS["granny-square"].code)
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [autoCompile, setAutoCompile] = useState(true)
  const [selectedExample, setSelectedExample] = useState("granny-square")
  const { theme } = useTheme()

  const handleCompile = useCallback(async (crochetCode: string) => {
    if (!autoCompile) return
    
    setIsCompiling(true)
    try {
      // Simulate compilation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100))
      const result = compileEnhancedCrocheTeX(crochetCode)
      setCompilerResult(result)
    } catch (error) {
      console.error("Compilation error:", error)
    } finally {
      setIsCompiling(false)
    }
  }, [autoCompile])

  const manualCompile = () => {
    handleCompile(code)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleExampleChange = (exampleKey: string) => {
    setSelectedExample(exampleKey)
    const example = EXAMPLE_PATTERNS[exampleKey as keyof typeof EXAMPLE_PATTERNS]
    if (example) {
      setCode(example.code)
    }
  }

  const downloadPattern = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pattern.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Initial compilation
  useEffect(() => {
    handleCompile(code)
  }, [code, handleCompile])

  return (
    <div className="min-h-screen bg-background">
      <CreateHeader
        isCompiling={isCompiling}
        autoCompile={autoCompile}
        onManualCompile={manualCompile}
        onToggleAutoCompile={() => setAutoCompile(!autoCompile)}
        onDownloadPattern={downloadPattern}
        compilerResult={compilerResult}
      />

      <main className="container mx-auto px-6 py-6 max-w-none">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight leading-tight mb-2">Create Pattern</h1>
          <p className="text-base text-gray-600 font-light leading-relaxed">
            Write your crochet pattern using CrocheTeX and see it render in real-time.
          </p>
        </div>

        <div className="mb-6">
          <ExamplePatternsSelector
            selectedExample={selectedExample}
            onExampleChange={handleExampleChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
          <CodeEditorPanel
            code={code}
            onCodeChange={handleCodeChange}
            onCompile={autoCompile ? handleCompile : undefined}
            theme={theme === "dark" ? "dark" : "light"}
            compilerResult={compilerResult}
          />

          <PreviewPanel
            compilerResult={compilerResult}
            isCompiling={isCompiling}
          />
        </div>
      </main>
    </div>
  )
}
