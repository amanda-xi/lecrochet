"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { motion, Variants, Variant } from "framer-motion"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Eye, Zap } from "lucide-react"

export default function CrochetPlatform() {
  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const floatingAnimation: Variant = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-32 md:py-46 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <Badge 
                variant="outline" 
                className="mb-6 border-gray-300 text-xs font-light px-3 py-1 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative z-10">The only pattern builder you&rsquo;ll ever need</span>
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-extralight tracking-tight mb-6 leading-tight"
              variants={fadeInUp}
            >
              <motion.span 
                className="inline-block"
                animate={floatingAnimation}
              >
                Create, Visualize, and Share
              </motion.span>
              <br />
              <motion.span 
                className="font-light inline-block"
                animate={{
                  ...floatingAnimation,
                  transition: {
                    ...floatingAnimation.transition,
                    delay: 0.5
                  }
                }}
              >
                Crochet Patterns
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-gray-600 font-light mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Transform your ideas into detailed crochet patterns using natural language. 
              Visualize in 3D, collaborate with others, and share in our marketplace.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button 
                onClick={() => signIn("google", { callbackUrl: "/create" })} 
                className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm font-light group">
                  Start building your pattern 
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-gray-200 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-32 right-20 w-1 h-1 bg-gray-300 rounded-full opacity-40"
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            opacity: [0.4, 0.1, 0.4]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </section>

      <section className="mb-20 container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight mb-4">Why Choose le Crochet?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern tools for traditional crafts. Our platform bridges the gap between 
              code and creativity, making pattern design accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-xl font-semibold">Simple Syntax</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Write patterns using intuitive CrochetScript syntax. No complex formatting, 
                  just clean, readable code that describes your stitches.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 ">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-xl font-semibold">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  See your pattern rendered instantly as you type. Visual feedback helps 
                  you catch errors early and perfect your designs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 ">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-xl font-semibold">Interactive</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Drag to pan, scroll to zoom, and explore every detail of your pattern. 
                  Perfect for analyzing complex designs and sharing with others.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pattern Types */}
        <section className="mb-20 container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight mb-4">Supports All Pattern Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From simple scarves to complex amigurumi, le Crochet handles linear, 
              circular, and granny square patterns with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl  border">
              <h3 className="font-semibold mb-3">Linear Patterns</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                <div className="text-gray-500">pattern: linear</div>
                <div>ch 21</div>
                <div>row 1: sc 20, turn</div>
                <div>row 2: ch 1, sc 20</div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Perfect for scarves, blankets, and flat pieces</p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-3">Circular Patterns</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                <div className="text-gray-500">pattern: circular</div>
                <div>magic-ring</div>
                <div>round 1: sc 6</div>
                <div>round 2: sc 2 in each</div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Ideal for hats, amigurumi, and round motifs</p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-3">Granny Squares</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                <div className="text-gray-500">pattern: granny-square</div>
                <div>magic-ring</div>
                <div>round 1: ch 3, dc 2</div>
                <div>ch 2, *dc 3, ch 2*</div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Classic granny square construction</p>
            </div>
          </div>
        </section>


      {/* CTA Section */}
      <motion.section 
        className="py-20 "
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-extralight mb-6"
              variants={fadeInUp}
            >
              Ready to Transform Your <br />
              <motion.span
                className="inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                style={{
                  background: "linear-gradient(90deg, #000, #666, #000)",
                  backgroundSize: "200% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Crochet Experience?
              </motion.span>
            </motion.h2>

            <motion.p 
              className="text-gray-600 font-light mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Join thousands of creators who are already using le crochet to bring their visions to life.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
              variants={fadeInUp}
            >
              {/* <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Input 
                  placeholder="Enter your email" 
                  className="border-gray-300 text-sm font-light focus:ring-2 focus:ring-gray-200 transition-all duration-200" 
                />
              </motion.div> */}
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button 
                 onClick={() => signIn("google", { callbackUrl: "/create" })} 
                className="bg-white text-black border border-gray-300 hover:bg-gray-800 hover:text-white px-8 text-sm font-light whitespace-nowrap relative overflow-hidden group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <span className="relative z-10">Get Started Free</span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-xs text-gray-500 font-light mt-4"
              variants={fadeInUp}
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              No credit card required. Start creating in minutes.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}