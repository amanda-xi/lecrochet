"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
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
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/gallery", label: "Gallery" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <header className="border-b border-gray-200 relative z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-wide">
            Le Crochet
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-light transition-colors hover:text-gray-600 ${
                  pathname === href ? "underline underline-offset-4" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <AuthButtons />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute h-0.5 w-6 bg-gray-800 transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-gray-800 transform transition-all duration-300 ease-in-out top-3 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-gray-800 transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 top-3' : 'top-5'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="space-y-1 mb-8">
            {navLinks.map(({ href, label }, index) => (
              <Link
                key={href}
                href={href}
                className={`block py-3 px-4 text-lg font-light rounded-lg transition-all duration-200 hover:bg-gray-50 hover:translate-x-1 ${
                  pathname === href ? "bg-gray-100 font-medium" : ""
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isMobileMenuOpen ? 'slideInFromRight 0.3s ease-out forwards' : ''
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Section */}
          <div className="border-t border-gray-200 pt-6">
            <MobileAuthButtons onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  )
}

function AuthButtons() {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/create">
          <Button className="bg-gray-200 text-black hover:bg-gray-300 text-sm font-light px-6 transition-colors duration-200 ease-in-out">
            Create
          </Button>
        </Link>
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
        className="text-sm font-light transition-colors duration-200 ease-in-out hover:text-gray-700 hover:bg-gray-200"
      >
        Sign In
      </Button>
      {/* <Button 
        onClick={() => signIn("google", { callbackUrl: "/create" })} 
        className="bg-black text-white hover:bg-gray-800 text-sm font-light px-6 transition-colors duration-200 ease-in-out"
      >
        Get Started
      </Button> */}
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
          <Link href="/create" onClick={onClose}>
            <Button className="w-full bg-gray-200 text-black hover:bg-gray-300 text-sm font-light py-3 transition-all duration-200 ease-in-out hover:scale-105 rounded-sm">
              Create
            </Button>
          </Link>
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