"use client"

import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const floatingYarn: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          src="/yarn.mov"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-48 pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-center gap-2 mb-4 text-gray-800">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-sm uppercase tracking-widest font-light">4🧶4 Not Found</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-extralight mb-6 leading-tight"
            variants={fadeInUp}
          >
            Oops! This thread doesn&apos;t exist.
          </motion.h1>

          <motion.p 
            className="text-lg text-gray-600 max-w-xl mx-auto font-light mb-8"
            variants={fadeInUp}
          >
            The page you&apos;re looking for might&apos;ve unraveled or never existed. Let&apos;s stitch you back on track.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link href="/">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 text-sm font-light shadow-md">
                Go back home
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative yarn */}
        <motion.div
          className="absolute bottom-12 right-12 opacity-10 pointer-events-none"
          variants={floatingYarn}
          initial="hidden"
          animate="animate"
        >
          <Image
            src="/yarn.svg"
            alt="Floating yarn"
            width={96}
            height={96}
            className="w-24 h-24 rotate-12"
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  )
}