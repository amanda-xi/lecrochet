import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "./button"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'warning'
}: ConfirmDialogProps) {
  const getTypeStyles = (type: 'danger' | 'warning' | 'info') => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          confirmBg: 'bg-red-600 hover:bg-red-700'
        }
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'info':
      default:
        return {
          iconColor: 'text-blue-500',
          confirmBg: 'bg-blue-600 hover:bg-blue-700'
        }
    }
  }

  const styles = getTypeStyles(type)

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`mt-1 ${styles.iconColor}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                {title && (
                  <h3 className="text-lg font-medium text-black mb-2">
                    {title}
                  </h3>
                )}
                <p className="text-sm font-light text-gray-700">
                  {message}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-sm font-light"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className={`text-sm font-light text-white ${styles.confirmBg}`}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for easier usage
export function useConfirm() {
  const [confirmData, setConfirmData] = React.useState<{
    isOpen: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
    onConfirm?: () => void
  }>({
    isOpen: false,
    message: ''
  })

  const showConfirm = React.useCallback((options: {
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
  }) => {
    return new Promise<boolean>((resolve) => {
      setConfirmData({
        isOpen: true,
        ...options,
        onConfirm: () => resolve(true)
      })
    })
  }, [])

  const closeConfirm = React.useCallback(() => {
    setConfirmData(prev => ({ ...prev, isOpen: false }))
  }, [])

  const ConfirmComponent = React.useCallback(() => (
    <ConfirmDialog
      isOpen={confirmData.isOpen}
      onClose={closeConfirm}
      onConfirm={confirmData.onConfirm || (() => {})}
      title={confirmData.title}
      message={confirmData.message}
      confirmText={confirmData.confirmText}
      cancelText={confirmData.cancelText}
      type={confirmData.type}
    />
  ), [confirmData, closeConfirm])

  return { showConfirm, ConfirmComponent }
} 