"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

interface ShareButtonProps {
  editingPattern?: {
    id: string
    title: string
    description: string | null
    pattern_code: string
    is_public: boolean
    created_at: string
    updated_at: string
  } | null
  className?: string
  size?: "sm" | "default" | "lg"
  showText?: boolean
}

export default function ShareButton({ 
  editingPattern, 
  className, 
  size = "sm", 
  showText = true 
}: ShareButtonProps) {
  const { addToast } = useToast()

  const handleShare = async () => {
    // Check if we have a pattern to share
    if (!editingPattern) {
      addToast({
        type: 'error',
        title: 'Cannot Share',
        message: 'Please save your pattern first before sharing.'
      })
      return
    }

    // Check if pattern is public
    if (!editingPattern.is_public) {
      addToast({
        type: 'error',
        title: 'Pattern Not Public',
        message: 'This pattern is private and cannot be shared. Please make it public first by updating the pattern settings.'
      })
      return
    }

    // Generate shareable URL
    const shareUrl = `${window.location.origin}/create?pattern=${editingPattern.id}`

    try {
      // Try to use the modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        addToast({
          type: 'success',
          title: 'Link Copied!',
          message: 'Pattern link has been copied to your clipboard.'
        })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          addToast({
            type: 'success',
            title: 'Link Copied!',
            message: 'Pattern link has been copied to your clipboard.'
          })
        } catch {
          throw new Error('Clipboard copy failed')
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy link to clipboard. Please try again.'
      })
    }
  }

  return (
    <Button 
      variant="ghost" 
      size={size} 
      className={`text-sm font-light ${className}`}
      onClick={handleShare}
      title="Share this pattern"
    >
      <Share2 className="h-4 w-4" />
      {showText && <span className="ml-2">Share</span>}
    </Button>
  )
} 