"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Code, Play, Zap, Box, Layers } from "lucide-react"
import CrochetLegend from "@/components/crochet-legend"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-grey-600" />
                <h1 className="text-2xl font-extralight">Documentation</h1>
              </div>
            </div>
            <Link href="/create">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Try it Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-3xl font-extralight mb-4">Welcome to le Crochet</h2>
          <p className="text-lg text-gray-600 mb-6">
            A modern crochet pattern designer that lets you write patterns using CrochetScript 
            and see them rendered as beautiful visual diagrams in real-time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 text-grey-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Write Code</h3>
                <p className="text-sm text-gray-600">Use simple CrochetScript syntax to describe your patterns</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Layers className="h-8 w-8 text-grey-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">2D Diagrams</h3>
                <p className="text-sm text-gray-600">Traditional crochet symbol charts with pan and zoom</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Box className="h-8 w-8 text-grey-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">3D Visualization</h3>
                <p className="text-sm text-gray-600">Interactive 3D view showing stitch structure and yarn flow</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-grey-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Interactive</h3>
                <p className="text-sm text-gray-600">Real-time preview with multiple viewing modes</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Getting Started</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Basic Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Navigate to the <Link href="/create" className="text-grey-600 underline">Create page</Link></li>
                <li>Choose an example pattern or start writing your own CrochetScript</li>
                <li>Watch your pattern render in real-time in the preview panel</li>
                <li>Use drag and zoom controls to explore your pattern diagram</li>
                <li>Download your pattern when you&apos;re satisfied</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* CrochetScript Syntax */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">CrochetScript Syntax</h2>
          
          {/* Basic Stitches */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Basic Stitches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Common Stitches</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <Badge variant="outline">ch - Chain</Badge>
                    <Badge variant="outline">sc - Single Crochet</Badge>
                    <Badge variant="outline">hdc - Half Double</Badge>
                    <Badge variant="outline">dc - Double Crochet</Badge>
                    <Badge variant="outline">tr - Treble</Badge>
                    <Badge variant="outline">dtr - Double Treble</Badge>
                    <Badge variant="outline">sl - Slip Stitch</Badge>
                    <Badge variant="outline">fpdc - Front Post DC</Badge>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example: Basic Row</h4>
                  <code className="text-sm">ch 20, sc 19, turn, ch 1, sc 19</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Types */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pattern Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Linear Patterns</h4>
                  <p className="text-sm text-gray-600 mb-2">For scarves, blankets, and flat pieces</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      pattern: linear<br/>
                      ch 21<br/>
                      row 1: sc 20, turn<br/>
                      row 2: ch 1, sc 20, turn<br/>
                      repeat row 2 for desired length
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Circular Patterns</h4>
                  <p className="text-sm text-gray-600 mb-2">For hats, amigurumi, and round motifs</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      pattern: circular<br/>
                      magic-ring<br/>
                      round 1: sc 6<br/>
                      round 2: sc 2 in each st (12)<br/>
                      round 3: *sc 1, sc 2 in next st* repeat (18)
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Granny Square</h4>
                  <p className="text-sm text-gray-600 mb-2">Traditional granny square patterns</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      pattern: granny-square<br/>
                      magic-ring<br/>
                      round 1: ch 3, dc 2, ch 2, *dc 3, ch 2* repeat 3 times<br/>
                      round 2: sl to ch-2 space, ch 3, dc 2, ch 2, dc 3, ch 1, *dc 3, ch 2, dc 3, ch 1* repeat
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Stitches */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Special Stitches & Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Decreases</h4>
                  <div className="space-y-1 text-sm">
                    <Badge variant="outline">sc2tog - SC 2 together</Badge>
                    <Badge variant="outline">dc2tog - DC 2 together</Badge>
                    <Badge variant="outline">sc3tog - SC 3 together</Badge>
                    <Badge variant="outline">dc3tog - DC 3 together</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Clusters & Shells</h4>
                  <div className="space-y-1 text-sm">
                    <Badge variant="outline">3dc-cluster - 3 DC cluster</Badge>
                    <Badge variant="outline">3hdc-cluster - 3 HDC cluster</Badge>
                    <Badge variant="outline">5dc-shell - 5 DC shell</Badge>
                    <Badge variant="outline">popcorn - Popcorn stitch</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Preview Controls */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Using the Preview Panel</h2>
          
          {/* View Mode Toggle */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">View Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      2D Diagram View
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Traditional crochet symbol charts</li>
                      <li>• Pan and zoom navigation</li>
                      <li>• Perfect for following patterns</li>
                      <li>• Drag to move, scroll to zoom</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Box className="h-4 w-4" />
                      3D Visualization
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Interactive 3D structure view</li>
                      <li>• Vertices represent stitches</li>
                      <li>• Edges show yarn flow connections</li>
                      <li>• Rotate, pan, and zoom in 3D space</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>New Feature:</strong> Toggle between 2D and 3D views using the view mode buttons 
                    in the preview panel header. The 3D view helps visualize complex stitch relationships 
                    and yarn flow patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3D Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">3D View Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Mouse Controls</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li><strong>Left Click + Drag:</strong> Rotate view</li>
                      <li><strong>Right Click + Drag:</strong> Pan view</li>
                      <li><strong>Mouse Wheel:</strong> Zoom in/out</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Display Options</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li><strong>Vertices:</strong> Show/hide stitches</li>
                      <li><strong>Edges:</strong> Show/hide connections</li>
                      <li><strong>Opacity:</strong> Adjust edge transparency</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Connection Types</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li><span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>Yarn Flow</li>
                      <li><span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>Structural</li>
                      <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Joins</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traditional Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Pattern Statistics</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li><strong>Stitch Count:</strong> Total stitches in pattern</li>
                      <li><strong>Round Count:</strong> Number of rounds (circular patterns)</li>
                      <li><strong>Vertex Count:</strong> 3D vertices displayed</li>
                      <li><strong>Connection Count:</strong> 3D edges shown</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Performance</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li><strong>Compilation:</strong> Real-time pattern processing</li>
                      <li><strong>Optimization:</strong> Automatic edge optimization</li>
                      <li><strong>Limits:</strong> Max 200 vertices in 3D for performance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Performance Tip:</strong> Large patterns are automatically optimized. 
                    Use the 2D view for very complex patterns and 3D view to understand 
                    structure and stitch relationships.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Symbol Legend */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Symbol Reference</h2>
          <CrochetLegend />
        </section>

        {/* Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Example Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Simple Scarf</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <code>
                    pattern: linear<br/>
                    foundation: ch 31<br/>
                    row 1: sc 30, turn<br/>
                    row 2: ch 1, sc 30, turn<br/>
                    repeat row 2 for 100 rows
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Basic Hat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <code>
                    pattern: circular<br/>
                    magic-ring<br/>
                    round 1: sc 6<br/>
                    round 2: sc 2 in each (12)<br/>
                    round 3: *sc 1, inc* repeat (18)<br/>
                    round 4: *sc 2, inc* repeat (24)
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Tips & Best Practices</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-700">Do&apos;s</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>✓ Use clear, descriptive comments</li>
                    <li>✓ Start with example patterns to learn syntax</li>
                    <li>✓ Test small sections before building complex patterns</li>
                    <li>✓ Save your work frequently</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-red-700">Don&apos;ts</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>✗ Don&apos;t forget to specify pattern type</li>
                    <li>✗ Don&apos;t mix pattern types in one script</li>
                    <li>✗ Don&apos;t use unsupported stitch abbreviations</li>
                    <li>✗ Don&apos;t create overly complex patterns without testing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Get Started CTA */}
        <section className="text-center">
          <Card className="bg-grey-50 border-grey-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Ready to Create?</h3>
              <p className="text-gray-600 mb-6">
                Start designing your crochet patterns with our interactive editor.
              </p>
              <Link href="/create">
                <Button size="lg" className="bg-grey-600 hover:bg-grey-700">
                  <Play className="h-5 w-5 mr-2" />
                  Open Pattern Editor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
} 