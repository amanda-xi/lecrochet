'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, Heart, Star } from "lucide-react";
import Image from "next/image";

const galleryItems = [
    {
        id: 1,
        image: "/gallery/01.png",
        title: "Vintage Doily Pattern",
        description: "Elegant vintage-inspired doily with intricate lacework details.",
        likes: 24,
        rating: 4.8,
        price: "$4.99"
    },
    {
        id: 2,
        image: "/gallery/02.png",
        title: "Granny Square Blanket",
        description: "Classic granny square design perfect for beginners and experts alike.",
        likes: 32,
        rating: 4.7,
        price: "$6.99"
    },
    {
        id: 3,
        image: "/gallery/03.png",
        title: "Flower Motif Collection",
        description: "Beautiful floral motifs that can be combined for stunning projects.",
        likes: 18,
        rating: 4.9,
        price: "$3.99"
    },
    {
        id: 4,
        image: "/gallery/04.png",
        title: "Mandala Circle Pattern",
        description: "Intricate mandala design with detailed color work and texture.",
        likes: 41,
        rating: 4.6,
        price: "$7.99"
    },
    {
        id: 5,
        image: "/gallery/05.png",
        title: "Lace Edging Design",
        description: "Delicate lace edging perfect for finishing blankets and garments.",
        likes: 27,
        rating: 4.8,
        price: "$2.99"
    }
];

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
                        {galleryItems.map((item) => (
                            <Card key={item.id} className="border-gray-200 hover:shadow-sm transition-shadow group">
                                <CardContent className="p-0">
                                    <div className="aspect-square bg-gray-100 border-b border-gray-200 flex items-center justify-center">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-light">{item.title}</h3>
                                            <div className="flex items-center space-x-2">
                                                <Heart className="w-4 h-4 text-gray-400" />
                                                <span className="text-xs text-gray-500">{item.likes}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 font-light mb-4">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Star className="w-4 h-4 text-black fill-current" />
                                                <span className="text-sm font-light">{item.rating}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" className="text-xs font-light">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Preview
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-xs font-light">
                                                    <Download className="w-3 h-3 mr-1" />
                                                    {item.price}
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