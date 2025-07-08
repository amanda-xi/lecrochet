import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET /api/patterns/[id] - Get a specific pattern
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    
    const { data: pattern, error } = await supabase
      .from('patterns')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error || !pattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
    }

    // Check if user can access this pattern
    if (!pattern.is_public && (!session?.user?.email || pattern.user_id !== session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ pattern })
  } catch (error) {
    console.error('Error in GET /api/patterns/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/patterns/[id] - Update a pattern
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, pattern_code, compiled_data, is_public } = body

    // First check if the pattern exists and belongs to the user
    const { data: existingPattern, error: fetchError } = await supabase
      .from('patterns')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single()

    if (fetchError || !existingPattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
    }

    if (existingPattern.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update the pattern
    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (pattern_code !== undefined) updateData.pattern_code = pattern_code
    if (compiled_data !== undefined) updateData.compiled_data = compiled_data
    if (is_public !== undefined) updateData.is_public = is_public

    const { data: pattern, error } = await supabase
      .from('patterns')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating pattern:', error)
      return NextResponse.json({ error: 'Failed to update pattern' }, { status: 500 })
    }

    return NextResponse.json({ pattern })
  } catch (error) {
    console.error('Error in PUT /api/patterns/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/patterns/[id] - Delete a pattern
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First check if the pattern exists and belongs to the user
    const { data: existingPattern, error: fetchError } = await supabase
      .from('patterns')
      .select('user_id')
      .eq('id', resolvedParams.id)
      .single()

    if (fetchError || !existingPattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
    }

    if (existingPattern.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the pattern
    const { error } = await supabase
      .from('patterns')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) {
      console.error('Error deleting pattern:', error)
      return NextResponse.json({ error: 'Failed to delete pattern' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Pattern deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/patterns/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 