"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { Save, Settings, BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import AuthSection from "./auth-section"
import ShareButton from "./share-button"

interface MobileMenuProps {
  patternCode: string
  editingPattern?: {
    id: string
    title: string
    description: string | null
    pattern_code: string
    is_public: boolean
    created_at: string
    updated_at: string
  } | null
  onShowSaveDialog: () => void
  isViewingOthersPattern?: boolean
}

export default function MobileMenu({ 
  patternCode, 
  editingPattern, 
  onShowSaveDialog,
  isViewingOthersPattern = false
}: MobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <>
      {/* Mobile menu button */}
      <div className="flex lg:hidden items-center gap-1 sm:gap-2">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-sm font-light p-2 relative"
          >
            <motion.div
              initial={false}
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-4 h-4 flex items-center justify-center"
            >
              <motion.div
                variants={{
                  closed: { rotate: 0 },
                  open: { rotate: 90 }
                }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.div>
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Animated mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98]
            }}
            className="lg:hidden border-t border-gray-200 bg-background/95 backdrop-blur overflow-hidden"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ 
                duration: 0.3,
                delay: 0.1,
                ease: [0.04, 0.62, 0.23, 0.98]
              }}
              className="p-4 space-y-2"
            >
              <motion.div
                className="grid grid-cols-2 gap-2"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm font-light justify-start w-full"
                    onClick={() => {
                      onShowSaveDialog()
                      setMobileMenuOpen(false)
                    }}
                    disabled={!session?.user || !patternCode?.trim()}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isViewingOthersPattern ? 'Save' : editingPattern ? 'Update' : 'Save'}
                  </Button>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div onClick={() => setMobileMenuOpen(false)}>
                    <ShareButton 
                      editingPattern={editingPattern}
                      className="text-sm font-light justify-start w-full"
                      showText={true}
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/settings" className="w-full">
                    <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/docs" target="_blank" className="w-full">
                    <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Separator className="my-3" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <AuthSection isMobile onClose={() => setMobileMenuOpen(false)} />
              </motion.div>
            </motion.div>
          </motion.div>
                  )}
        </AnimatePresence>
    </>
  )
} 