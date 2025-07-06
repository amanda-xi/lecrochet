"use client"

import { Play, Pause, Download, Share2, Settings, Sun, Moon, Monitor, Save, Eye, AlertCircle, CheckCircle, Sparkles, BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useState } from "react"
import type { CompilerResult } from "@/lib/enhanced-crochet-compiler"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CreateHeaderProps {
  isCompiling: boolean
  autoCompile: boolean
  onManualCompile: () => void
  onToggleAutoCompile: () => void
  onDownloadPattern: () => void
  compilerResult: CompilerResult | null
}

export default function CreateHeader({
  isCompiling,
  autoCompile,
  onManualCompile,
  onToggleAutoCompile,
  onDownloadPattern,
  compilerResult
}: CreateHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const errorCount = compilerResult?.errors.filter(e => e.severity === "error").length || 0
  const warningCount = compilerResult?.errors.filter(e => e.severity === "warning").length || 0

  return (
    <header className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and core controls */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="text-xl font-light tracking-wide">
            Le Crochet
          </Link>
            </div>
            
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            
            {/* Desktop compile controls */}
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onManualCompile}
                disabled={isCompiling}
                className="text-sm font-light"
              >
                {isCompiling ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isCompiling ? "Compiling..." : "Compile"}
              </Button>

              <Button
                variant={autoCompile ? "default" : "ghost"}
                size="sm"
                onClick={onToggleAutoCompile}
                className="text-sm font-light"
              >
                <Eye className="h-4 w-4 mr-2" />
                Auto
              </Button>
            </div>

            {/* Mobile compile controls */}
            <div className="flex sm:hidden items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onManualCompile}
                disabled={isCompiling}
                className="text-xs font-light px-2"
              >
                {isCompiling ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>

              <Button
                variant={autoCompile ? "default" : "ghost"}
                size="sm"
                onClick={onToggleAutoCompile}
                className="text-xs font-light px-2"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>

            {/* Status badges - responsive */}
            {compilerResult && (
              <div className="flex items-center gap-1 sm:gap-2">
                {compilerResult.success ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-light text-xs sm:text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Ready</span>
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-light text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errorCount}<span className="hidden sm:inline"> Error{errorCount !== 1 ? 's' : ''}</span>
                  </Badge>
                )}
                
                {warningCount > 0 && (
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300 font-light text-xs sm:text-sm hidden sm:inline-flex">
                    {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                  </Badge>
                )}

                {compilerResult.patternType !== "linear" && (
                  <Badge variant="outline" className="text-purple-700 border-purple-300 font-light text-xs sm:text-sm hidden md:inline-flex">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {compilerResult.patternType}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Right section - Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* <Button variant="ghost" size="sm" onClick={cycleTheme} className="text-sm font-light">
              {getThemeIcon()}
            </Button> */}

            <Button variant="ghost" size="sm" onClick={onDownloadPattern} className="text-sm font-light">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-light">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button variant="ghost" size="sm" className="text-sm font-light">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-sm font-light">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>

            <Link href="/docs" target="_blank">
              <Button variant="ghost" size="sm" className="text-sm font-light">
                <BookOpen className="h-4 w-4 mr-2" />
                Help
              </Button>
            </Link>

            <Separator orientation="vertical" className="h-6" />

            <AuthButtons />
          </div>

          {/* Mobile/Tablet actions */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-2">
            {/* Essential actions for mobile */}
            <Button variant="ghost" size="sm" onClick={cycleTheme} className="text-sm font-light p-2">
              {getThemeIcon()}
            </Button>

            <Button variant="ghost" size="sm" onClick={onDownloadPattern} className="text-sm font-light p-2 sm:px-3">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-sm font-light p-2"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-background/95 backdrop-blur">
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" size="sm" className="text-sm font-light justify-start">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>

                <Button variant="ghost" size="sm" className="text-sm font-light justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                <Link href="/settings" className="w-full">
                  <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>

                <Link href="/docs" target="_blank" className="w-full">
                  <Button variant="ghost" size="sm" className="text-sm font-light justify-start w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </Link>
              </div>

              <Separator className="my-3" />

              <MobileAuthButtons onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function AuthButtons() {
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
            <DropdownMenuItem>
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

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-sm">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session.user.image!} alt={session.user.name ?? ""} />
            <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/profile" onClick={onClose}>
            <Button variant="outline" className="w-full text-sm font-light py-3 transition-all duration-200 ease-in-out hover:scale-105 rounded-sm">
              Profile
            </Button>
          </Link>
          <Button 
            onClick={() => {
              signOut()
              onClose()
            }}
            variant="ghost" 
            className="w-full text-sm font-light py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 ease-in-out"
          >
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button 
        onClick={() => {
          signIn("google", { callbackUrl: "/create" })
          onClose()
        }}
        className="w-full bg-black text-white hover:bg-gray-800 text-sm font-light py-3 transition-all duration-200 ease-in-out hover:scale-105"
      >
        Sign In with Google
      </Button>
    </div>
  )
}