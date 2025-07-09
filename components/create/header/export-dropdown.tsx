"use client"

import { useState } from "react"
import { Download, FileText, FileImage, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/toast"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface ExportDropdownProps {
  patternCode: string
  compilerResult: CompilerResult | null
  editingPattern?: {
    id: string
    title: string
    description: string | null
    pattern_code: string
    is_public: boolean
    created_at: string
    updated_at: string
    author?: {
      name: string | null
      email: string
    } | null
  } | null
  className?: string
}

export default function ExportDropdown({
  patternCode,
  compilerResult,
  editingPattern,
  className
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { addToast } = useToast()

  const convertSvgToDataUrl = async (svgPath: string): Promise<string | null> => {
    try {
      const response = await fetch(svgPath)
      if (!response.ok) return null
      
      const svgText = await response.text()
      
      // Create a canvas to convert SVG to image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return null
      
             // Canvas size will be set based on image natural dimensions
      
      // Create an image from SVG
      const img = new Image()
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      
             return new Promise((resolve) => {
         img.onload = () => {
           // Use natural dimensions instead of fixed size
           canvas.width = img.naturalWidth || 100
           canvas.height = img.naturalHeight || 100
           
           const ctx = canvas.getContext('2d')
           if (!ctx) {
             URL.revokeObjectURL(url)
             resolve(null)
             return
           }
           
           ctx.fillStyle = 'white'
           ctx.fillRect(0, 0, canvas.width, canvas.height)
           ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
           URL.revokeObjectURL(url)
           resolve(canvas.toDataURL('image/png'))
         }
         img.onerror = () => {
           URL.revokeObjectURL(url)
           resolve(null)
         }
         img.src = url
       })
    } catch (error) {
      console.error('Error converting SVG to data URL:', error)
      return null
    }
  }

  const downloadAsText = () => {
    try {
      const blob = new Blob([patternCode], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = editingPattern ? `${editingPattern.title}.txt` : 'pattern.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      addToast({
        type: "success",
        title: "Pattern exported",
        message: "Pattern downloaded as text file",
      })
    } catch (error) {
      console.error('Error exporting as text:', error)
      addToast({
        type: "error",
        title: "Export failed",
        message: "Failed to export pattern as text",
      })
    }
  }

  const capturePreviewElement = async (selector: string): Promise<HTMLCanvasElement | null> => {
    const element = document.querySelector(selector) as HTMLElement
    if (!element) {
      console.warn(`Element not found: ${selector}`)
      return null
    }

    try {
      // Ensure the diagram is fully rendered before capture
      element.scrollIntoView({ behavior: 'instant', block: 'nearest' })
      await new Promise(requestAnimationFrame) // Wait for one frame
      await new Promise(resolve => setTimeout(resolve, 500)) // Extra time for SVG rendering
      
             // Try html2canvas first with robust options
       try {
         const canvas = await html2canvas(element)
        
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          return canvas
        }
      } catch (html2canvasError) {
        console.warn('html2canvas failed, trying SVG fallback:', html2canvasError)
      }
      
      // Fallback: Manual SVG to PNG conversion
      const svg = element.querySelector('svg') as SVGElement
      if (svg) {
        return await convertSvgToPng(svg)
      }
      
      return null
    } catch (error) {
      console.error(`Error capturing ${selector}:`, error)
      return null
    }
  }

  const convertSvgToPng = async (svg: SVGElement): Promise<HTMLCanvasElement | null> => {
    return new Promise((resolve) => {
      try {
        const data = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const img = new Image()

        img.onload = () => {
          const canvas = document.createElement("canvas")
          const rect = svg.getBoundingClientRect()
          canvas.width = rect.width * 2 // 2x scale for quality
          canvas.height = rect.height * 2
          
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            URL.revokeObjectURL(url)
            resolve(null)
            return
          }
          
          ctx.scale(2, 2) // Apply scale
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, rect.width, rect.height)
          ctx.drawImage(img, 0, 0, rect.width, rect.height)
          
          URL.revokeObjectURL(url)
          resolve(canvas)
        }

        img.onerror = () => {
          URL.revokeObjectURL(url)
          resolve(null)
        }

        img.src = url
      } catch (error) {
        console.error('SVG conversion failed:', error)
        resolve(null)
      }
    })
  }

  const downloadAsPDF = async () => {
    setIsExporting(true)
    
    try {
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - (margin * 2)
      
      // Try to load the yarn logo
      const logoDataUrl = await convertSvgToDataUrl('/yarn.svg')
      
      // Add yarn logo with dynamic sizing
      let logoWidth = 10
      let logoHeight = 10
      if (logoDataUrl) {
        try {
          // Try to get natural dimensions for better logo scaling
          const tempImg = new Image()
          tempImg.src = logoDataUrl
          const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight || 1
          logoHeight = 10
          logoWidth = logoHeight * aspectRatio
          
          pdf.addImage(logoDataUrl, 'PNG', margin, margin + 2, logoWidth, logoHeight)
        } catch (error) {
          console.warn('Failed to add logo:', error)
          logoWidth = 10 // fallback
        }
      }
      
      // Add Le Crochet branding header (positioned after logo)
      const textXPosition = margin + logoWidth + 5
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0) // Black color
      pdf.text('Le Crochet', textXPosition, margin + 12)
      
      // Add subtitle
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(80, 80, 80) // Dark gray
      pdf.text('CrocheTeX Pattern Generator', textXPosition, margin + 20)
      
      // Add separator line
      pdf.setDrawColor(0, 0, 0) // Black line
      pdf.line(margin, margin + 25, pageWidth - margin, margin + 25)
      
      let yPosition = margin + 35
      
      // Add pattern title
      const title = editingPattern?.title || 'Untitled Pattern'
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text(title, margin, yPosition)
      
      yPosition += 12
      
      // Add pattern metadata
      if (compilerResult) {
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const metadata = [
          `Pattern Type: ${compilerResult.patternType}`,
          `Total Stitches: ${compilerResult.patternSequence.length}`,
          ...(compilerResult.metadata?.rounds ? [`Rounds: ${compilerResult.metadata.rounds}`] : []),
          ...(compilerResult.metadata?.techniques ? [`Techniques: ${compilerResult.metadata.techniques.join(', ')}`] : [])
        ]
        
        metadata.forEach(info => {
          pdf.text(info, margin, yPosition)
          yPosition += 5
        })
        yPosition += 5
      }
      
      // Add description if available
      if (editingPattern?.description) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Description:', margin, yPosition)
        yPosition += 7
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const lines = pdf.splitTextToSize(editingPattern.description, contentWidth)
        pdf.text(lines, margin, yPosition)
        yPosition += lines.length * 5 + 10
      }
      
      // Capture and add 2D diagram
      const diagramElement = document.querySelector('[data-testid="2d-diagram"]') as HTMLElement
      if (diagramElement) {
        const diagramCanvas = await capturePreviewElement('[data-testid="2d-diagram"]')
        
        // Add section title
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('2D Pattern Diagram', margin, yPosition)
        yPosition += 10
        
        if (diagramCanvas) {
          // Calculate dimensions to fit on page
          const canvasRatio = diagramCanvas.width / diagramCanvas.height
          let imgWidth = contentWidth
          let imgHeight = imgWidth / canvasRatio
          
          // If image is too tall, scale it down
          const maxImageHeight = (pageHeight - yPosition - margin - 20)
          if (imgHeight > maxImageHeight) {
            imgHeight = maxImageHeight
            imgWidth = imgHeight * canvasRatio
          }
          
          // Add image
          const imgData = diagramCanvas.toDataURL('image/png')
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 15
        } else {
          // Fallback message when capture fails
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(150, 150, 150)
          pdf.text('⚠️ 2D diagram could not be captured automatically.', margin, yPosition)
          pdf.text('Please export the pattern as text or take a screenshot of the 2D view.', margin, yPosition + 5)
          pdf.setTextColor(0, 0, 0) // Reset color
          yPosition += 20
        }
      }
      
      // Add new page if needed for 3D view
      if (yPosition > pageHeight - 100) {
        pdf.addPage()
        yPosition = margin + 10
      }
      
      // Capture and add 3D view (if visible)
      const view3D = document.querySelector('[data-testid="3d-view"]') as HTMLElement
      if (view3D) {
        const view3DCanvas = await capturePreviewElement('[data-testid="3d-view"]')
        
        // Add section title
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('3D Pattern View', margin, yPosition)
        yPosition += 10
        
        if (view3DCanvas) {
          // Calculate dimensions to fit on page
          const canvasRatio = view3DCanvas.width / view3DCanvas.height
          let imgWidth = contentWidth
          let imgHeight = imgWidth / canvasRatio
          
          // If image is too tall, scale it down
          const maxImageHeight = (pageHeight - yPosition - margin - 20)
                      if (imgHeight > maxImageHeight) {
              imgHeight = maxImageHeight
              imgWidth = imgHeight * canvasRatio
            }
          
          // Add image
          const imgData = view3DCanvas.toDataURL('image/png')
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 15
        } else {
          // Fallback message when 3D capture fails
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(150, 150, 150)
          pdf.text('⚠️ 3D view could not be captured automatically.', margin, yPosition)
          pdf.text('Please take a screenshot of the 3D view if needed.', margin, yPosition + 5)
          pdf.setTextColor(0, 0, 0) // Reset color
          yPosition += 20
        }
      }
      
      // Add new page for pattern code
      pdf.addPage()
      yPosition = margin + 10
      
      // Add pattern code
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Pattern Code (CrocheTeX)', margin, yPosition)
      yPosition += 10
      
      pdf.setFontSize(9)
      pdf.setFont('courier', 'normal')
      
      // Split code into lines and add to PDF
      const codeLines = patternCode.split('\n')
      const maxLinesPerPage = Math.floor((pageHeight - yPosition - margin) / 4)
      
      for (let i = 0; i < codeLines.length; i++) {
        if ((i % maxLinesPerPage) === 0 && i > 0) {
          pdf.addPage()
          yPosition = margin + 10
        }
        
        const line = codeLines[i]
        const wrappedLines = pdf.splitTextToSize(line || ' ', contentWidth)
        
        wrappedLines.forEach((wrappedLine: string) => {
          pdf.text(wrappedLine, margin, yPosition)
          yPosition += 4
        })
      }
      
      // Add footer with Le Crochet branding on each page
      const totalPages = pdf.internal.pages.length - 1 // Subtract 1 because pages array includes a blank first element
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        
        // Footer line
        pdf.setDrawColor(0, 0, 0)
        pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20)
        
        // Footer text
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)
        pdf.text('Generated by Le Crochet - lecrochet.online', margin, pageHeight - 12)
        
        // Page number
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 12)
      }
      
      // Save the PDF
      const filename = editingPattern ? `${editingPattern.title}-pattern.pdf` : 'crochet-pattern.pdf'
      pdf.save(filename)
      
      addToast({
        type: "success",
        title: "PDF exported",
        message: "Pattern downloaded as PDF. Check the document for visual previews.",
      })
      
    } catch (error) {
      console.error('Error exporting as PDF:', error)
      addToast({
        type: "error",
        title: "Export failed",
        message: "Failed to export pattern as PDF",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`text-sm font-light ${className}`} disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          Export
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={downloadAsText} disabled={!patternCode?.trim()}>
          <FileText className="h-4 w-4 mr-2" />
          Download as Text
          <span className="ml-auto text-xs text-muted-foreground">.txt</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={downloadAsPDF} 
          disabled={!patternCode?.trim() || isExporting}
        >
          <FileImage className="h-4 w-4 mr-2" />
          {isExporting ? 'Generating PDF...' : 'Download as PDF'}
          <span className="ml-auto text-xs text-muted-foreground">.pdf</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 