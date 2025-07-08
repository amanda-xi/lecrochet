import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase, upsertUserProfile } from '@/lib/supabase'

// GET /api/patterns - Get user's patterns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isPublic = searchParams.get('public') === 'true'
    
    let query = supabase
      .from('patterns')
      .select('*')
      .order('updated_at', { ascending: false })

    if (isPublic) {
      query = query.eq('is_public', true)
    } else {
      query = query.eq('user_id', session.user.email)
    }

    const { data: patterns, error } = await query

    if (error) {
      console.error('Error fetching patterns:', error)
      return NextResponse.json({ error: 'Failed to fetch patterns' }, { status: 500 })
    }

    return NextResponse.json({ patterns })
  } catch (error) {
    console.error('Error in GET /api/patterns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/patterns - Create a new pattern
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user profile exists before creating pattern
    try {
      await upsertUserProfile({
        id: session.user.email,
        email: session.user.email,
        name: session.user.name,
        avatar_url: session.user.image,
      })
    } catch (profileError) {
      console.error('Error ensuring user profile exists:', profileError)
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    const body = await request.json()
    const { title, description, pattern_code, compiled_data, is_public = false } = body

    if (!title || !pattern_code) {
      return NextResponse.json({ error: 'Title and pattern code are required' }, { status: 400 })
    }

    const { data: pattern, error } = await supabase
      .from('patterns')
      .insert([
        {
          user_id: session.user.email,
          title,
          description,
          pattern_code,
          compiled_data,
          is_public
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating pattern:', error)
      return NextResponse.json({ error: 'Failed to create pattern' }, { status: 500 })
    }

    return NextResponse.json({ pattern }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/patterns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 