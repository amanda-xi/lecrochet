"use client"

import { useState } from "react"
import { X, Send, Loader2, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PatternConverterModalProps {
  isOpen: boolean
  onClose: () => void
  onPatternConverted: (pattern: string) => void
}

export default function PatternConverterModal({
  isOpen,
  onClose,
  onPatternConverted
}: PatternConverterModalProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConvert = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/convert-pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pattern: input.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert pattern')
      }

      onPatternConverted(data.convertedPattern)
      onClose()
      setInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert pattern')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleConvert()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000, power: 0, timeConstant: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
<motion.div
  drag
  dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }}
  initial={{ opacity: 0, scale: 0.9, y: 20 }}
  dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000, power: 0, timeConstant: 0 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 20 }}
  onClick={(e) => e.stopPropagation()}
  className="w-full max-w-md cursor-grab active:cursor-grabbing"
>
            <Card className="bg-white shadow-xl">
              <CardHeader className="pb-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000, power: 0, timeConstant: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <CardTitle className="text-xl font-extralight flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: isLoading ? 360 : 0 }}
                      transition={{ 
                        duration: 1,
                        repeat: isLoading ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      <Bot className="h-5 w-5" />
                    </motion.div>
                    Pattern Converter
                  </CardTitle>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000, power: 0, timeConstant: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000, power: 0, timeConstant: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="text-sm text-gray-600 mb-3"
                  >
                    Paste a traditional crochet pattern and I'll convert it to CrocheTeX format for you.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Example: Chain 20, single crochet in next 19 stitches, chain 1, turn. Repeat 10 times."
                      className="min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                      maxLength={1000}
                      disabled={isLoading}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000, power: 0, timeConstant: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="flex justify-between items-center mt-1"
                  >
                    <span className="text-xs text-gray-500">
                      {input.length}/1000 characters
                    </span>
                    <span className="text-xs text-gray-500">
                      Press Enter to convert
                    </span>
                  </motion.div>
                </motion.div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  dragTransition={{ bounceStiffness: 1000, bounceDamping: 1000, power: 0, timeConstant: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="flex justify-end gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleConvert}
                      disabled={!input.trim() || isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ 
                              duration: 1, 
                              repeat: Infinity, 
                              ease: "linear" 
                            }}
                          >
                            <Loader2 className="h-4 w-4" />
                          </motion.div>
                          Converting...
                        </>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Send className="h-4 w-4" />
                          </motion.div>
                          Convert
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}