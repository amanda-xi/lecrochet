"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { Save, Settings, BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import AuthSection from "./auth-section"
import ShareButton from "./share-button"

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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
  isOpen,
  setIsOpen,
  patternCode, 
  editingPattern, 
  onShowSaveDialog,
  isViewingOthersPattern = false
}: MobileMenuProps) {
  const { data: session } = useSession()

  return (
    <>
      <div className="lg:hidden">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm font-light p-2 relative"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isOpen ? "open" : "closed"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 flex items-center justify-center"
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98]
            }}
            className="lg:hidden absolute top-full left-0 right-0 border-t border-gray-200 bg-background/95 backdrop-blur overflow-hidden"
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
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm font-light justify-start w-full"
                  onClick={() => {
                    onShowSaveDialog()
                    setIsOpen(false)
                  }}
                  disabled={!session?.user || !patternCode?.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isViewingOthersPattern ? 'Save' : editingPattern ? 'Update' : 'Save'}
                </Button>

                <div onClick={() => setIsOpen(false)}>
                  <ShareButton 
                    editingPattern={editingPattern}
                    className="text-sm font-light justify-start w-full"
                    showText={true}
                  />
                </div>

                <Link href="/settings" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>

                <Link href="/docs" target="_blank" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </Link>
              </div>

              <Separator className="my-3" />

              <AuthSection isMobile onClose={() => setIsOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}