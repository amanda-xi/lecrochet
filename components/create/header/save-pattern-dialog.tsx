"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"

interface SavePatternDialogProps {
  isOpen: boolean
  onClose: () => void
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
  } | null
  onSavePattern?: (pattern: {
    id: string
    title: string
    description: string | null
    pattern_code: string
    is_public: boolean
    created_at: string
    updated_at: string
  }) => void
}

export default function SavePatternDialog({
  isOpen,
  onClose,
  patternCode,
  compilerResult,
  editingPattern,
  onSavePattern
}: SavePatternDialogProps) {
  const [saveTitle, setSaveTitle] = useState("")
  const [saveDescription, setSaveDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const { data: session } = useSession()
  const { addToast } = useToast()
  const router = useRouter()

  // Initialize form with existing pattern data when editing
  useEffect(() => {
    if (editingPattern) {
      setSaveTitle(editingPattern.title)
      setSaveDescription(editingPattern.description || "")
      setIsPublic(editingPattern.is_public)
    } else {
      setSaveTitle("")
      setSaveDescription("")
      setIsPublic(false)
    }
  }, [editingPattern])

  const handleSavePattern = async () => {
    if (!session?.user || !patternCode || !saveTitle.trim()) return

    setSaving(true)
    try {
      const isEditing = !!editingPattern
      const url = isEditing ? `/api/patterns/${editingPattern.id}` : '/api/patterns'
      const method = isEditing ? 'PUT' : 'POST'

      let response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: saveTitle.trim(),
          description: saveDescription.trim() || null,
          pattern_code: patternCode,
          compiled_data: compilerResult,
          is_public: isPublic,
        }),
      })

      // If pattern save fails, try to sync profile first (only for new patterns)
      if (!response.ok && !isEditing) {
        const errorData = await response.json()
        
        // If it's a profile-related error, try syncing profile
        if (response.status === 500 && errorData.error?.includes('profile')) {
          console.log('Attempting to sync user profile...')
          
          const syncResponse = await fetch('/api/sync-profile', {
            method: 'POST',
          })
          
          if (syncResponse.ok) {
            // Retry pattern save after profile sync
            response = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: saveTitle.trim(),
                description: saveDescription.trim() || null,
                pattern_code: patternCode,
                compiled_data: compilerResult,
                is_public: isPublic,
              }),
            })
          }
        }
      }

      if (response.ok) {
        const data = await response.json()
        onClose()
        setSaveTitle("")
        setSaveDescription("")
        setIsPublic(false)
        onSavePattern?.(data.pattern)
        addToast({
          type: 'success',
          title: 'Success!',
          message: isEditing ? 'Pattern updated successfully!' : 'Pattern saved successfully!'
        })

        // Redirect to the newly saved pattern if this was an initial save
        if (!isEditing && data.pattern?.id) {
          // Small delay to ensure the toast is visible before redirect
          setTimeout(() => {
            router.push(`/create?pattern=${data.pattern.id}`)
          }, 500)
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'save'} pattern`)
      }
    } catch (error) {
      console.error(`Error ${editingPattern ? 'updating' : 'saving'} pattern:`, error)
      addToast({
        type: 'error',
        title: 'Error',
        message: `Failed to ${editingPattern ? 'update' : 'save'} pattern: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-50 z-[60]"
          onClick={onClose}
        >
          <div className="min-h-screen pt-20 pb-8 px-4 flex items-start justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium mb-4 text-black">
                {editingPattern ? 'Update Pattern' : 'Save Pattern'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder="Enter pattern title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Description
                  </label>
                  <textarea
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder="Optional description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    maxLength={500}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-black focus:ring-gray-400 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-black">
                    Make this pattern public
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={saving}
                  className="text-black hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePattern}
                  disabled={saving || !saveTitle.trim()}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {saving ? (editingPattern ? "Updating..." : "Saving...") : (editingPattern ? "Update Pattern" : "Save Pattern")}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 