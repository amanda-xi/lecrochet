import { NextResponse } from 'next/server'
import { getForumCategories } from '@/lib/supabase'

// GET /api/forum/categories - Get all active forum categories
export async function GET() {
  try {
    const categories = await getForumCategories()
    
    if (!categories) {
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error in GET /api/forum/categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 