"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AuthSectionProps {
  isMobile?: boolean
  onClose?: () => void
}

export default function AuthSection({ isMobile = false, onClose }: AuthSectionProps) {

  if (isMobile) {
    return <MobileAuthButtons onClose={onClose} />
  }

  return <DesktopAuthButtons />
}

function DesktopAuthButtons() {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image!} alt={session.user.name ?? ""} />
                <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Button 
        onClick={() => signIn("google", { callbackUrl: "/create" })} 
        variant="ghost" 
        size="sm"
        className="text-sm font-light"
      >
        Sign In
      </Button>
      
      <Button 
        onClick={() => signIn("google", { callbackUrl: "/create" })} 
        size="sm" 
        className="bg-black text-white hover:bg-gray-800 text-sm font-light px-6"
      >
        Sign Up
      </Button>
    </div>
  )
}

function MobileAuthButtons({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div className="space-y-4">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image!} alt={session.user.name ?? ""} />
              <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/profile" onClick={onClose}>
              <Button variant="outline" className="w-full text-sm font-light py-3 transition-all duration-200 ease-in-out rounded-sm">
                Profile
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => {
                signOut()
                onClose?.()
              }}
              variant="ghost" 
              className="w-full text-sm font-light py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 ease-in-out"
            >
              Sign Out
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="space-y-3"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={() => {
            signIn("google", { callbackUrl: "/create" })
            onClose?.()
          }}
          className="w-full bg-black text-white hover:bg-gray-800 text-sm font-light py-3 transition-all duration-200 ease-in-out"
        >
          Sign In with Google
        </Button>
      </motion.div>
    </motion.div>
  )
} 