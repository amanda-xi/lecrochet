import React, { useState, useCallback, useRef, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResizableSplitProps {
  children: [React.ReactNode, React.ReactNode]
  defaultSplit?: number // Percentage for left panel (0-100)
  minSplit?: number // Minimum percentage for left panel
  maxSplit?: number // Maximum percentage for left panel
  className?: string
  onSplitChange?: (split: number) => void
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean // For mobile breakpoints
  showResetButton?: boolean // Show reset to default button
}

export default function ResizableSplit({
  children,
  defaultSplit = 50,
  minSplit = 20,
  maxSplit = 80,
  className,
  onSplitChange,
  direction = 'horizontal',
  disabled = false,
  showResetButton = true
}: ResizableSplitProps) {
  const [split, setSplit] = useState(defaultSplit)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
  }, [disabled])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || disabled) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    
    let newSplit: number
    if (direction === 'horizontal') {
      const x = e.clientX - rect.left
      newSplit = (x / rect.width) * 100
    } else {
      const y = e.clientY - rect.top
      newSplit = (y / rect.height) * 100
    }

    // Clamp the split within bounds
    newSplit = Math.max(minSplit, Math.min(maxSplit, newSplit))
    
    setSplit(newSplit)
    onSplitChange?.(newSplit)
  }, [isDragging, direction, minSplit, maxSplit, onSplitChange, disabled])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleReset = useCallback(() => {
    setSplit(defaultSplit)
    onSplitChange?.(defaultSplit)
  }, [defaultSplit, onSplitChange])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, direction])

  // If disabled (mobile), render as simple flex layout optimized for mobile
  if (disabled) {
    return (
      <div className={cn("flex flex-col gap-4 h-full", className)}>
        {/* Code Editor - fixed height on mobile to prevent collapse */}
        <div className="h-[320px] flex-shrink-0 overflow-hidden">
          {children[0]}
        </div>
        {/* Preview Panel - much larger on mobile, especially for 3D view */}
        <div className="min-h-[600px] flex-1 overflow-hidden">
          {children[1]}
        </div>
      </div>
    )
  }

  const isHorizontal = direction === 'horizontal'
  const firstPanelSize = `${split}%`
  const secondPanelSize = `${100 - split}%`

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex",
        isHorizontal ? "flex-row" : "flex-col",
        "h-full w-full",
        className
      )}
    >
      {/* First panel */}
      <div 
        className="overflow-hidden"
        style={{ 
          [isHorizontal ? 'width' : 'height']: firstPanelSize,
          minHeight: isHorizontal ? undefined : '200px',
          minWidth: isHorizontal ? '200px' : undefined
        }}
      >
        {children[0]}
      </div>

      {/* Resizer */}
      <div
        ref={resizerRef}
        className={cn(
          "group flex-shrink-0 relative flex items-center justify-center",
          isHorizontal ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize",
          "bg-gray-200 hover:bg-gray-300 transition-colors",
          isDragging && "bg-purple-400"
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className={cn(
          "absolute bg-gray-400 group-hover:bg-gray-600 transition-colors",
          isDragging && "bg-purple-600",
          isHorizontal 
            ? "left-1/2 top-1/2 w-0.5 h-8 -translate-x-1/2 -translate-y-1/2" 
            : "top-1/2 left-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2"
        )} />
        
        {/* Reset button */}
        {showResetButton && Math.abs(split - defaultSplit) > 5 && (
          <button
            onClick={handleReset}
            className={cn(
              "absolute z-10 p-1 bg-white border border-gray-300 rounded-full shadow-sm",
              "hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100",
              isHorizontal 
                ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" 
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            )}
            title={`Reset to ${defaultSplit}%`}
          >
            <RotateCcw className="h-3 w-3 text-gray-600" />
          </button>
        )}
      </div>

      {/* Second panel */}
      <div 
        className="overflow-hidden"
        style={{ 
          [isHorizontal ? 'width' : 'height']: secondPanelSize,
          minHeight: isHorizontal ? undefined : '200px',
          minWidth: isHorizontal ? '200px' : undefined
        }}
      >
        {children[1]}
      </div>
    </div>
  )
} 