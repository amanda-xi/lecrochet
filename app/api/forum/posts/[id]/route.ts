import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params
        const { data: post, error } = await supabase
            .from('forum_posts')
            .select(`
                *,
                category:forum_categories(*),
                user:profiles!forum_posts_user_id_fkey(id, email, avatar_url)
            `)
            .eq('id', resolvedParams.id)
            .single()

        if (error || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error fetching post:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
        }

        const { title, content, category_id } = await request.json()

        if (!title || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const resolvedParams = await params

        // Check if user owns the post or is admin
        const { data: existingPost, error: checkError } = await supabase
            .from('forum_posts')
            .select('user_id')
            .eq('id', resolvedParams.id)
            .single()

        if (checkError || !existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        if (existingPost.user_id !== profile.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const updateData: { title: string; content: string; category_id?: string } = { title, content }
        if (category_id) {
            updateData.category_id = category_id
        }

        const { data: post, error } = await supabase
            .from('forum_posts')
            .update(updateData)
            .eq('id', resolvedParams.id)
            .select(`
                *,
                category:forum_categories(*),
                user:profiles!forum_posts_user_id_fkey(id, email, avatar_url)
            `)
            .single()

        if (error) {
            console.error('Error updating post:', error)
            return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error in post PUT:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
        }

        const resolvedParams = await params

        // Check if user owns the post or is admin
        const { data: existingPost, error: checkError } = await supabase
            .from('forum_posts')
            .select('user_id')
            .eq('id', resolvedParams.id)
            .single()

        if (checkError || !existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        if (existingPost.user_id !== profile.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { error } = await supabase
            .from('forum_posts')
            .delete()
            .eq('id', resolvedParams.id)

        if (error) {
            console.error('Error deleting post:', error)
            return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in post DELETE:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 