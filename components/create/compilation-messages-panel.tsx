"use client"

import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface CompilationMessagesPanelProps {
  compilerResult: CompilerResult | null
}

export default function CompilationMessagesPanel({
  compilerResult
}: CompilationMessagesPanelProps) {
  if (!compilerResult || compilerResult.errors.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-extralight flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Compilation Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {compilerResult.errors.map((error, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                error.severity === "error" 
                  ? "bg-red-50 border border-red-200" 
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <div className={`mt-0.5 ${
                error.severity === "error" ? "text-red-500" : "text-yellow-600"
              }`}>
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant={error.severity === "error" ? "destructive" : "secondary"}
                    className="text-xs font-light"
                  >
                    Line {error.line}
                  </Badge>
                  <span className={`text-xs font-medium ${
                    error.severity === "error" ? "text-red-700" : "text-yellow-700"
                  }`}>
                    {error.severity.toUpperCase()}
                  </span>
                </div>
                <p className={`text-sm font-light ${
                  error.severity === "error" ? "text-red-700" : "text-yellow-700"
                }`}>
                  {error.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 