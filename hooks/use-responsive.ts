import { useState, useEffect } from 'react'

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      
      setIsMobile(width < 768) // Below md breakpoint
      setIsTablet(width >= 768 && width < 1024) // md to lg breakpoint
      setIsDesktop(width >= 1024) // lg breakpoint and above
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop,
    // Helper for non-mobile (tablet + desktop)
    isLargeScreen: isTablet || isDesktop
  }
} 