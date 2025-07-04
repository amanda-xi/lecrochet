import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Eye, Zap, BookOpen, Play, Download } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">lC</span>
              </div>
              <h1 className="text-xl font-extralight">le Crochet</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </Link>
              <Link href="/create">
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Try it Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extralight tracking-tight leading-tight mb-6">
              Design Crochet Patterns
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                Visually
              </span>
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
              Write patterns using CrochetScript and see them rendered as beautiful, 
              interactive diagrams in real-time. Perfect for designers, makers, and educators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8">
                  <Play className="h-5 w-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="px-8">
                  <BookOpen className="h-5 w-5 mr-2" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
         <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight mb-4">Why Choose le Crochet?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern tools for traditional crafts. Our platform bridges the gap between 
              code and creativity, making pattern design accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-purple-600" />
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

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
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

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
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
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extralight mb-4">Supports All Pattern Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From simple scarves to complex amigurumi, le Crochet handles linear, 
              circular, and granny square patterns with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-3">Linear Patterns</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                <div className="text-gray-500">pattern: linear</div>
                <div>ch 21</div>
                <div>row 1: sc 20, turn</div>
                <div>row 2: ch 1, sc 20</div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Perfect for scarves, blankets, and flat pieces</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-3">Circular Patterns</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                <div className="text-gray-500">pattern: circular</div>
                <div>magic-ring</div>
                <div>round 1: sc 6</div>
                <div>round 2: sc 2 in each</div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Ideal for hats, amigurumi, and round motifs</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
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
        <section className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
            <CardContent className="py-16 px-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join the modern crochet community and bring your patterns to life 
                with our intuitive visual editor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                    <Play className="h-5 w-5 mr-2" />
                    Open Editor
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">lC</span>
              </div>
              <span className="text-gray-600">le Crochet - Visual Pattern Designer</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/docs" className="hover:text-purple-600 transition-colors">
                Documentation
              </Link>
              <Link href="/create" className="hover:text-purple-600 transition-colors">
                Create Patterns
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
