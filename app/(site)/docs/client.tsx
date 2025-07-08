"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Code, Play, Zap, Box, Layers } from "lucide-react"
import CrochetLegend from "@/components/crochet-legend"

export default function DocsClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
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
            A modern crochet pattern designer that lets you write patterns using CrocheTeX 
            and see them rendered as beautiful visual diagrams in real-time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 text-grey-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Write Code</h3>
                <p className="text-sm text-gray-600">Use structured CrocheTeX syntax with blocks and functions</p>
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
                <li>Choose an example pattern or start writing your own CrocheTeX</li>
                <li>Watch your pattern render in real-time in the preview panel</li>
                <li>Use drag and zoom controls to explore your pattern diagram</li>
                <li>Download your pattern when you&apos;re satisfied</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* CrocheTeX Syntax */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">CrocheTeX Syntax</h2>
          
          {/* Basic Stitches */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Basic Stitches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Common Stitches (Function Call Syntax)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <Badge variant="outline">ch(n) - Chain</Badge>
                    <Badge variant="outline">sc(n) - Single Crochet</Badge>
                    <Badge variant="outline">hdc(n) - Half Double</Badge>
                    <Badge variant="outline">dc(n) - Double Crochet</Badge>
                    <Badge variant="outline">tr(n) - Treble</Badge>
                    <Badge variant="outline">dtr(n) - Double Treble</Badge>
                    <Badge variant="outline">sl_st(n) - Slip Stitch</Badge>
                    <Badge variant="outline">fpdc(n) - Front Post DC</Badge>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example: Basic Foundation Chain</h4>
                  <code className="text-sm">
                    ch(20)<br/>
                    turn<br/><br/>
                    sc(19)<br/>
                    turn
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Block Structure */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Block Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Core Blocks</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <strong className="text-sm">magic_ring &#123; &#125;</strong>
                      <p className="text-xs text-gray-600 mt-1">Start circular patterns with adjustable ring</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <strong className="text-sm">round &#123; &#125;</strong>
                      <p className="text-xs text-gray-600 mt-1">Define a round in circular patterns</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <strong className="text-sm">row &#123; &#125;</strong>
                      <p className="text-xs text-gray-600 mt-1">Define a row in linear patterns</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <strong className="text-sm">repeat(n) &#123; &#125;</strong>
                      <p className="text-xs text-gray-600 mt-1">Repeat enclosed stitches n times</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Control Keywords</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <Badge variant="outline">join - Join round</Badge>
                    <Badge variant="outline">turn - Turn work</Badge>
                    <Badge variant="outline">end - End pattern</Badge>
                    <Badge variant="outline">skip - Skip stitch</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Examples */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pattern Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Linear Pattern (Scarf)</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      {`// Simple scarf pattern`}<br/>
                      ch(31)<br/>
                      turn<br/><br/>
                      
                      sc(30)<br/>
                      turn<br/><br/>
                      
                      repeat(50) &#123;<br/>
                      &nbsp;&nbsp;ch(1)<br/>
                      &nbsp;&nbsp;sc(30)<br/>
                      &nbsp;&nbsp;turn<br/>
                      &#125;<br/><br/>
                      
                      end
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Circular Pattern (Hat Crown)</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      {`// Basic hat crown`}<br/>
                      magic_ring &#123;<br/>
                      &nbsp;&nbsp;sc(6)<br/>
                      &#125;<br/>
                      join<br/><br/>

                      round &#123;<br/>
                      &nbsp;&nbsp;repeat(6) &#123;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;sc(2)<br/>
                      &nbsp;&nbsp;&#125;<br/>
                      &#125;<br/>
                      join<br/><br/>

                      round &#123;<br/>
                      &nbsp;&nbsp;repeat(6) &#123;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;sc(1)<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;sc(2)<br/>
                      &nbsp;&nbsp;&#125;<br/>
                      &#125;<br/>
                      join<br/><br/>

                      end
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Granny Square</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      {`// Traditional granny square`}<br/>
                      magic_ring &#123;<br/>
                      &nbsp;&nbsp;ch(3)<br/>
                      &nbsp;&nbsp;dc(2)<br/>
                      &nbsp;&nbsp;ch(2)<br/>
                      &nbsp;&nbsp;repeat(3) &#123;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;dc(3)<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;ch(2)<br/>
                      &nbsp;&nbsp;&#125;<br/>
                      &#125;<br/>
                      join<br/><br/>

                      round &#123;<br/>
                      &nbsp;&nbsp;repeat(4) &#123;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;ch(3)<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;dc(2)<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;ch(2)<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;dc(3)<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;ch(1)<br/>
                      &nbsp;&nbsp;&#125;<br/>
                      &#125;<br/>
                      join<br/><br/>

                      end
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Advanced Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Advanced Features</h2>
          
          {/* Special Stitches */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Special Stitches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Decorative Stitches</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <Badge variant="outline">shell(n) - Shell stitch</Badge>
                    <Badge variant="outline">cluster(n) - Cluster stitch</Badge>
                    <Badge variant="outline">popcorn(n) - Popcorn stitch</Badge>
                    <Badge variant="outline">picot - Picot loop</Badge>
                    <Badge variant="outline">bobble(n) - Bobble stitch</Badge>
                    <Badge variant="outline">puff(n) - Puff stitch</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Post Stitches</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <Badge variant="outline">fpdc(n) - Front Post DC</Badge>
                    <Badge variant="outline">bpdc(n) - Back Post DC</Badge>
                    <Badge variant="outline">fptr(n) - Front Post TR</Badge>
                    <Badge variant="outline">bptr(n) - Back Post TR</Badge>
                    <Badge variant="outline">fphdc(n) - Front Post HDC</Badge>
                    <Badge variant="outline">bphdc(n) - Back Post HDC</Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example: Shell Border</h4>
                  <code className="text-sm">
                    {`// Shell stitch border`}<br/>
                    repeat(10) &#123;<br/>
                    &nbsp;&nbsp;skip(2)<br/>
                    &nbsp;&nbsp;shell(5)<br/>
                    &nbsp;&nbsp;skip(2)<br/>
                    &nbsp;&nbsp;sc(1)<br/>
                    &#125;<br/>
                    turn
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Changes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Color Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Color Commands</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <Badge variant="outline">color(name) - Change yarn color</Badge>
                    <Badge variant="outline">join_color(name) - Join new color</Badge>
                    <Badge variant="outline">cut_yarn - Cut current yarn</Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example: Striped Pattern</h4>
                  <code className="text-sm">
                    {`// Two-color stripe pattern`}<br/>
                    color(blue)<br/>
                    sc(20)<br/>
                    turn<br/><br/>

                    color(white)<br/>
                    sc(20)<br/>
                    turn<br/><br/>

                    color(blue)<br/>
                    sc(20)<br/>
                    turn
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decreases and Increases */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Shaping: Increases & Decreases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Increase Commands</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <Badge variant="outline">inc - Increase by 1</Badge>
                    <Badge variant="outline">inc(n) - Increase by n</Badge>
                    <Badge variant="outline">sc_inc - SC increase</Badge>
                    <Badge variant="outline">dc_inc - DC increase</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Decrease Commands</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <Badge variant="outline">dec - Decrease by 1</Badge>
                    <Badge variant="outline">dec(n) - Decrease by n</Badge>
                    <Badge variant="outline">sc2tog - SC 2 together</Badge>
                    <Badge variant="outline">dc2tog - DC 2 together</Badge>
                    <Badge variant="outline">sc3tog - SC 3 together</Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Example: Circle Shaping</h4>
                  <code className="text-sm">
                    {`// Increasing circle`}<br/>
                    magic_ring &#123; sc(6) &#125;<br/>
                    join<br/><br/>

                    round &#123; repeat(6) &#123; inc &#125; &#125;<br/>
                    join // 12 stitches<br/><br/>

                    round &#123; repeat(6) &#123; sc(1), inc &#125; &#125;<br/>
                    join // 18 stitches<br/><br/>

                    round &#123; repeat(6) &#123; sc(2), inc &#125; &#125;<br/>
                    join // 24 stitches
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3D Visualization */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">3D Visualization Features</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Interactive 3D View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">View Controls</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><strong>Rotate:</strong> Click and drag to rotate the 3D model</li>
                    <li><strong>Zoom:</strong> Use mouse wheel or pinch to zoom in/out</li>
                    <li><strong>Pan:</strong> Right-click and drag to pan the view</li>
                    <li><strong>Reset:</strong> Double-click to reset to default view</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Display Options</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><strong>Wireframe Mode:</strong> Show stitch structure outline</li>
                    <li><strong>Solid Mode:</strong> Show realistic yarn rendering</li>
                    <li><strong>Stitch Highlighting:</strong> Hover to highlight individual stitches</li>
                    <li><strong>Row/Round Isolation:</strong> Focus on specific sections</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Symbol Legend */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Crochet Symbol Legend</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Standard Crochet Symbols</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                The 2D diagram view uses standard international crochet symbols. Here&apos;s a reference for the most common symbols:
              </p>
              <CrochetLegend />
            </CardContent>
          </Card>
        </section>

        {/* Export Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Export & Sharing</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Available Export Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Pattern Files</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><strong>PDF:</strong> Printable pattern with diagrams and instructions</li>
                    <li><strong>TXT:</strong> Plain text CrocheTeX source code</li>
                    <li><strong>JSON:</strong> Structured pattern data for sharing</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Images</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><strong>PNG:</strong> High-quality diagram images</li>
                    <li><strong>SVG:</strong> Scalable vector diagrams</li>
                    <li><strong>WebP:</strong> Optimized for web sharing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sharing Options</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Public Gallery:</strong> Share your patterns with the community</li>
                <li><strong>Direct Link:</strong> Generate shareable URLs for your patterns</li>
                <li><strong>Social Media:</strong> Optimized previews for social platforms</li>
                <li><strong>Marketplace:</strong> Sell your patterns to other crocheters</li>
                <li><strong>Embed Code:</strong> Embed interactive previews in your website</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Best Practices</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Writing Clean CrocheTeX</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Code Organization</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Use consistent indentation for nested blocks</li>
                    <li>Add comments to explain complex sections</li>
                    <li>Group related rounds or rows together</li>
                    <li>Use descriptive names for custom functions</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Pattern Testing</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Always test your patterns before sharing</li>
                    <li>Use the 3D preview to catch structural issues</li>
                    <li>Verify stitch counts at each step</li>
                    <li>Check gauge and sizing calculations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Performance Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Large patterns may take longer to render in 3D</li>
                    <li>Use the 2D view for quick previews of complex patterns</li>
                    <li>Break very large patterns into sections</li>
                    <li>Optimize repeat blocks for better performance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-extralight mb-6">Getting Help</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Support Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Community Support</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><Link href="/forum" className="text-grey-600 underline">Community Forum</Link> - Ask questions and share tips</li>
                    <li><Link href="/gallery" className="text-grey-600 underline">Pattern Gallery</Link> - See examples from other creators</li>
                    <li><strong>Discord Server</strong> - Real-time chat with other users</li>
                    <li><strong>YouTube Channel</strong> - Video tutorials and walkthroughs</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Direct Support</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><Link href="/contact" className="text-grey-600 underline">Contact Form</Link> - Direct support requests</li>
                    <li><strong>Email Support</strong> - help@lecrochet.online</li>
                    <li><strong>Bug Reports</strong> - GitHub issues for technical problems</li>
                    <li><strong>Feature Requests</strong> - Submit ideas for new features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
