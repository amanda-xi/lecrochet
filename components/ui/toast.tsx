"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast, onClose: () => void }) {
  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500',
          textColor: 'text-green-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-500',
          textColor: 'text-red-700'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-700'
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: AlertCircle,
          iconColor: 'text-blue-500',
          textColor: 'text-blue-700'
        }
    }
  }

  const styles = getToastStyles(toast.type)
  const Icon = styles.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-sm bg-white",
        styles.bg,
        styles.border
      )}
    >
      <div className={cn("mt-0.5", styles.iconColor)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={cn("text-sm font-medium mb-1", styles.textColor)}>
            {toast.title}
          </p>
        )}
        <p className={cn("text-sm font-light", styles.textColor)}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className={cn(
          "ml-auto flex-shrink-0 p-1 rounded-md hover:bg-white/50 transition-colors",
          styles.iconColor
        )}
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  )
}

// Utility functions for easy usage
export function showSuccessToast(message: string, title?: string) {
  const event = new CustomEvent('addToast', {
    detail: { type: 'success', message, title }
  })
  window.dispatchEvent(event)
}

export function showErrorToast(message: string, title?: string) {
  const event = new CustomEvent('addToast', {
    detail: { type: 'error', message, title }
  })
  window.dispatchEvent(event)
}

export function showWarningToast(message: string, title?: string) {
  const event = new CustomEvent('addToast', {
    detail: { type: 'warning', message, title }
  })
  window.dispatchEvent(event)
}

export function showInfoToast(message: string, title?: string) {
  const event = new CustomEvent('addToast', {
    detail: { type: 'info', message, title }
  })
  window.dispatchEvent(event)
} 