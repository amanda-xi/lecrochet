import { useState, useCallback, useEffect } from "react"

interface Transform {
  x: number
  y: number
  scale: number
}

export function useDiagramTransform() {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y
    
    // Apply sensitivity multiplier to reduce drag sensitivity
    const sensitivity = 0.5 // Lower value = less sensitive
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + (deltaX * sensitivity) / prev.scale,
      y: prev.y + (deltaY * sensitivity) / prev.scale
    }))
    
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }, [isDragging, lastMousePos])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.1, Math.min(5, transform.scale * scaleFactor))
    
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }))
  }, [transform.scale])

  // Reset view
  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [])

  // Global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y
      
      // Apply sensitivity multiplier to reduce drag sensitivity
      const sensitivity = 0.5 // Lower value = less sensitive
      
      setTransform(prev => ({
        ...prev,
        x: prev.x + (deltaX * sensitivity) / prev.scale,
        y: prev.y + (deltaY * sensitivity) / prev.scale
      }))
      
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, lastMousePos, transform.scale])

  return {
    transform,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetView
  }
} 