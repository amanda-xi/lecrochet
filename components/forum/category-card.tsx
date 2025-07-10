'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ForumCategory } from '@/lib/supabase'
import { 
  MessageCircle, 
  HelpCircle, 
  Image, 
  Code, 
  Heart, 
  ShoppingBag,
  Users
} from 'lucide-react'

interface CategoryCardProps {
  category: ForumCategory
  recentPostsCount?: number
}

const iconMap = {
  'message-circle': MessageCircle,
  'help-circle': HelpCircle,
  'image': Image,
  'code': Code,
  'heart': Heart,
  'shopping-bag': ShoppingBag,
  'users': Users,
}

export function CategoryCard({ category, recentPostsCount }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || MessageCircle

  return (
    <Link href={`/forum/category/${category.slug}`}>
      <Card className="border-gray-200 hover:shadow-sm transition-shadow group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div 
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category.color}10` }}
            >
              <IconComponent 
                className="w-6 h-6" 
                style={{ color: category.color }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-light text-black group-hover:text-gray-600 transition-colors">
                  {category.name}
                </h3>
                {category.post_count > 0 && (
                  <Badge variant="outline" className="text-xs font-light">
                    {category.post_count} {category.post_count === 1 ? 'post' : 'posts'}
                  </Badge>
                )}
              </div>
              
              {category.description && (
                <p className="text-gray-600 font-light text-sm leading-relaxed mb-3">
                  {category.description}
                </p>
              )}
              
              {recentPostsCount !== undefined && recentPostsCount > 0 && (
                <div className="flex items-center text-xs text-gray-500 font-light">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {recentPostsCount} recent {recentPostsCount === 1 ? 'discussion' : 'discussions'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 