"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Custom hook for animating numbers
const useCountUp = (end: number, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasStarted) {
        setHasStarted(true);
        let startTime: number;
        
        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentCount = Math.floor(easeOutQuart * end);
          
          setCount(currentCount);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay, hasStarted]);

  return count;
};

// Component for animated stat
const AnimatedStat = ({ label, value, prefix = "", delay = 0 }: { label: string, value: number, prefix?: string, delay?: number }) => {
  const animatedValue = useCountUp(value, 2000, delay);
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-light">{label}</span>
      <span className="font-light">
        {prefix}{animatedValue.toLocaleString()}
      </span>
    </div>
  );
};

export default function MarketplacePage() {
  return (
    <div className="bg-white text-black">
      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="font-light">Marketplace Dashboard</h3>
                  <Badge variant="outline" className="text-xs font-light">
                    SELLER
                  </Badge>
                </div>
                <div className="space-y-4">
                  <AnimatedStat 
                    label="Total Sales" 
                    value={2847} 
                    prefix="$" 
                    delay={200}
                  />
                  <AnimatedStat 
                    label="Active Patterns" 
                    value={23} 
                    delay={400}
                  />
                  <AnimatedStat 
                    label="Downloads" 
                    value={1247} 
                    delay={600}
                  />
                </div>
              </div>
            </div>
            <div>
              <Badge
                variant="outline"
                className="mb-4 border-gray-300 text-xs font-light"
              >
                MARKETPLACE
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extralight mb-6">
                Monetize Your
                <br />
                Creative Work
              </h2>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                Turn your passion into profit. Our integrated marketplace makes
                it easy to sell your patterns, track sales, and build a
                following. Set your own prices and keep 85% of every sale.
              </p>
              <div className="flex items-center space-x-6">
              <Link href="/marketplace/more">
                <Button className="bg-black text-white hover:bg-gray-800 text-sm font-light">
                  Start Selling
                </Button>
                </Link>
                <Link href="/marketplace/more">
                  <Button
                    variant="ghost"
                    className="bg-gray-200 text-black hover:bg-gray-300 text-sm font-light px-6 transition-colors duration-200 ease-in-out"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}