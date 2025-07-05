'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, Heart, Star } from "lucide-react";
import Image from "next/image";

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Gallery Section */}
            <section id="gallery" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extralight mb-4">Featured Patterns</h2>
                        <p className="text-gray-600 font-light">Discover what our community is creating</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Card key={item} className="border-gray-200 hover:shadow-sm transition-shadow group">
                                <CardContent className="p-0">
                                    <div className="aspect-square bg-gray-100 border-b border-gray-200 flex items-center justify-center">
                                        <Image
                                            src="/placeholder.svg"
                                            alt="Pattern preview"
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-light">Vintage Doily Pattern</h3>
                                            <div className="flex items-center space-x-2">
                                                <Heart className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs text-gray-500">24</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 font-light mb-4">
                                            Elegant vintage-inspired doily with intricate lacework details.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Star className="w-4 h-4 text-black fill-current" />
                                                <span className="text-sm font-light">4.8</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" className="text-xs font-light">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Preview
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-xs font-light">
                                                    <Download className="w-3 h-3 mr-1" />
                                                    $4.99
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
} 