"use client"

import { useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import type * as Monaco from "monaco-editor"

interface CrochetCodeEditorProps {
  value: string
  onChange: (value: string) => void
  onCompile?: (code: string) => void
  theme?: "light" | "dark"
}

export default function CrochetCodeEditor({ 
  value, 
  onChange, 
  onCompile, 
  theme = "light" 
}: CrochetCodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
    editorRef.current = editor

    // Register CrochetScript language
    monaco.languages.register({ id: "crochetscript" })

    // Define CrochetScript syntax highlighting
    monaco.languages.setMonarchTokensProvider("crochetscript", {
      tokenizer: {
        root: [
          // Comments
          [/\/\/.*$/, "comment"],
          [/\/\*/, "comment", "@comment"],

          // Keywords
          [/\b(chain|sc|dc|hdc|tr|dtr|sl|st|repeat|row|magic_ring|join|turn|ch|with_color|pattern|function|let|if|else|for|while|import|as|extends)\b/, "keyword"],

          // Numbers
          [/\d+/, "number"],

          // Strings
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string"],

          // Operators
          [/[=(){}[\],]/, "delimiter"],
          [/[+\-*/]/, "operator"],

          // Identifiers
          [/[a-zA-Z_]\w*/, "identifier"],
        ],

        comment: [
          [/[^/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[/*]/, "comment"],
        ],

        string: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, "string", "@pop"],
        ],
      },
    })

    // Define CrochetScript theme
    monaco.editor.defineTheme("crochet-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "8b5cf6", fontStyle: "bold" },
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "string", foreground: "059669" },
        { token: "number", foreground: "dc2626" },
        { token: "identifier", foreground: "374151" },
      ],
      colors: {
        "editor.background": "#fafafa",
        "editor.foreground": "#374151",
        "editor.lineHighlightBackground": "#f3f4f6",
        "editor.selectionBackground": "#e0e7ff",
        "editorLineNumber.foreground": "#9ca3af",
        "editorCursor.foreground": "#8b5cf6",
      },
    })

    monaco.editor.defineTheme("crochet-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "a78bfa", fontStyle: "bold" },
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "string", foreground: "10b981" },
        { token: "number", foreground: "f87171" },
        { token: "identifier", foreground: "e5e7eb" },
      ],
      colors: {
        "editor.background": "#1f2937",
        "editor.foreground": "#e5e7eb",
        "editor.lineHighlightBackground": "#374151",
        "editor.selectionBackground": "#3730a3",
        "editorLineNumber.foreground": "#6b7280",
        "editorCursor.foreground": "#a78bfa",
      },
    })

    // Set up autocomplete
    monaco.languages.registerCompletionItemProvider("crochetscript", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }

        const suggestions: Monaco.languages.CompletionItem[] = [
          {
            label: "chain",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "chain(${1:count})",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Create a chain of specified length",
            range,
          },
          {
            label: "sc",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "sc(${1:count})",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Single crochet stitch",
            range,
          },
          {
            label: "dc",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "dc(${1:count})",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Double crochet stitch",
            range,
          },
          {
            label: "hdc",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "hdc(${1:count})",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Half double crochet stitch",
            range,
          },
          {
            label: "repeat",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "repeat(${1:count}) {\n\t${2:stitches}\n}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Repeat a block of stitches",
            range,
          },
          {
            label: "row",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "row {\n\t${1:stitches}\n\tch(1)\n\tturn\n}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Create a new row",
            range,
          },
          {
            label: "magic_ring",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "magic_ring {\n\t${1:stitches}\n\tjoin\n}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Start with a magic ring",
            range,
          },
        ]

        return { suggestions }
      },
    })

    // Set initial theme
    monaco.editor.setTheme(theme === "dark" ? "crochet-dark" : "crochet-light")

    // Trigger compilation on content change with debounce
    let timeoutId: NodeJS.Timeout
    editor.onDidChangeModelContent(() => {
      const currentValue = editor.getValue()
      onChange(currentValue)
      
      if (onCompile) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => onCompile(currentValue), 500)
      }
    })
  }

  useEffect(() => {
    if (editorRef.current) {
      const globalWindow = window as typeof window & { monaco?: typeof Monaco }
      const monaco = globalWindow.monaco
      if (monaco) {
        monaco.editor.setTheme(theme === "dark" ? "crochet-dark" : "crochet-light")
      }
    }
  }, [theme])

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language="crochetscript"
        value={value}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          folding: true,
          lineHeight: 1.5,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "gutter",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
      />
    </div>
  )
} 