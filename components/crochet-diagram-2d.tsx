"use client"

import { useEffect, useRef } from "react"

interface CrochetDiagram2DProps {
  patternSequence: string[]
}

export default function CrochetDiagram2D({ patternSequence }: CrochetDiagram2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    // Draw background
    ctx.fillStyle = "#fafafa"
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    if (patternSequence.length === 0) {
      // Draw placeholder
      ctx.fillStyle = "#e5e7eb"
      ctx.font = "14px system-ui"
      ctx.textAlign = "center"
      ctx.fillText("Add stitches to see diagram", canvas.offsetWidth / 2, canvas.offsetHeight / 2)
      return
    }

    // Draw crochet diagram
    const stitchWidth = 30
    const stitchHeight = 40
    const startX = 50
    const startY = 50

    patternSequence.forEach((patternId, index) => {
      const x = startX + (index % 8) * stitchWidth
      const y = startY + Math.floor(index / 8) * stitchHeight

      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2

      // Draw different stitch symbols based on pattern
      switch (patternId) {
        case "single-crochet":
          // Draw X for single crochet
          ctx.beginPath()
          ctx.moveTo(x - 8, y - 8)
          ctx.lineTo(x + 8, y + 8)
          ctx.moveTo(x + 8, y - 8)
          ctx.lineTo(x - 8, y + 8)
          ctx.stroke()
          break

        case "double-crochet":
          // Draw T for double crochet
          ctx.beginPath()
          ctx.moveTo(x, y - 12)
          ctx.lineTo(x, y + 12)
          ctx.moveTo(x - 8, y - 8)
          ctx.lineTo(x + 8, y - 8)
          ctx.stroke()
          break

        case "half-double":
          // Draw modified T for half double
          ctx.beginPath()
          ctx.moveTo(x, y - 8)
          ctx.lineTo(x, y + 8)
          ctx.moveTo(x - 6, y - 4)
          ctx.lineTo(x + 6, y - 4)
          ctx.stroke()
          break

        case "treble":
          // Draw tall T for treble
          ctx.beginPath()
          ctx.moveTo(x, y - 16)
          ctx.lineTo(x, y + 16)
          ctx.moveTo(x - 10, y - 12)
          ctx.lineTo(x + 10, y - 12)
          ctx.moveTo(x - 6, y - 8)
          ctx.lineTo(x + 6, y - 8)
          ctx.stroke()
          break

        case "shell-stitch":
          // Draw shell pattern
          ctx.beginPath()
          ctx.arc(x, y, 10, 0, Math.PI, false)
          ctx.stroke()
          for (let i = 0; i < 5; i++) {
            ctx.beginPath()
            ctx.moveTo(x - 8 + i * 4, y)
            ctx.lineTo(x - 8 + i * 4, y - 8)
            ctx.stroke()
          }
          break

        default:
          // Draw circle for other stitches
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, 2 * Math.PI)
          ctx.stroke()
      }

      // Connect stitches with chain
      if (index > 0) {
        const prevX = startX + ((index - 1) % 8) * stitchWidth
        const prevY = startY + Math.floor((index - 1) / 8) * stitchHeight

        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(prevX + 10, prevY)
        ctx.lineTo(x - 10, y)
        ctx.stroke()
      }
    })
  }, [patternSequence])

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
