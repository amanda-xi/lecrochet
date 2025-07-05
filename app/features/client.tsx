'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Box, Play, Sparkles, Users, ShoppingBag } from "lucide-react";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Features Grid */}
            <section id="features" className="py-20 border-t border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extralight mb-4">Platform Features</h2>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto">
                            Everything you need to create, visualize, and share professional crochet patterns
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                            <CardContent className="p-8">
                                <Sparkles className="w-8 h-8 mb-4 text-black" />
                                <h3 className="text-lg font-light mb-3">AI Pattern Generation</h3>
                                <p className="text-sm text-gray-600 font-light leading-relaxed">
                                    Describe your vision in natural language and watch as AI creates detailed, accurate crochet patterns.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                            <CardContent className="p-8">
                                <Box className="w-8 h-8 mb-4 text-black" />
                                <h3 className="text-lg font-light mb-3">3D Visualization</h3>
                                <p className="text-sm text-gray-600 font-light leading-relaxed">
                                    Preview your patterns in interactive 3D before you start crocheting. Rotate, zoom, and inspect every
                                    detail.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                            <CardContent className="p-8">
                                <Users className="w-8 h-8 mb-4 text-black" />
                                <h3 className="text-lg font-light mb-3">Collaboration Tools</h3>
                                <p className="text-sm text-gray-600 font-light leading-relaxed">
                                    Work together on patterns, share feedback, and build a community around your creations.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 hover:shadow-sm transition-shadow">
                            <CardContent className="p-8">
                                <ShoppingBag className="w-8 h-8 mb-4 text-black" />
                                <h3 className="text-lg font-light mb-3">Marketplace</h3>
                                <p className="text-sm text-gray-600 font-light leading-relaxed">
                                    Sell your patterns or discover unique designs from creators worldwide in our integrated marketplace.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 3D Preview Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge variant="outline" className="mb-4 border-gray-300 text-xs font-light">
                                3D VISUALIZATION
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-extralight mb-6">
                                See Your Patterns
                                <br />
                                Come to Life
                            </h2>
                            <p className="text-gray-600 font-light mb-8 leading-relaxed">
                                Our advanced 3D rendering engine transforms flat patterns into interactive models. Examine stitch
                                placement, visualize texture, and perfect your design before picking up your hook.
                            </p>
                            <div className="flex items-center space-x-6">
                                <Button variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
                                    <Play className="w-4 h-4 mr-2" />
                                    Watch Demo
                                </Button>
                                <Button variant="ghost" className="text-black hover:bg-white/50">
                                    Learn More
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-sm p-8 aspect-square flex items-center justify-center">
                            <div className="text-center">
                                <Box className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-sm text-gray-500 font-light">3D Model Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 