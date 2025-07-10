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
        const { data: replies, error } = await supabase
            .from('forum_replies')
            .select(`
                *,
                user:profiles!forum_replies_user_id_fkey(id, email, avatar_url)
            `)
            .eq('post_id', resolvedParams.id)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching replies:', error)
            return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 })
        }

        return NextResponse.json({ replies: replies || [] })
    } catch (error) {
        console.error('Error in replies GET:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        
        // Only logged-in users can comment/reply
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required to comment' }, { status: 401 })
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

        const { content } = await request.json()

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: 'Reply content is required' }, { status: 400 })
        }

        const resolvedParams = await params

        // Verify post exists and is not locked
        const { data: post, error: postError } = await supabase
            .from('forum_posts')
            .select('id, is_locked')
            .eq('id', resolvedParams.id)
            .single()

        if (postError || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        if (post.is_locked) {
            return NextResponse.json({ error: 'This post is locked and cannot receive new replies' }, { status: 403 })
        }

        const { data: reply, error } = await supabase
            .from('forum_replies')
            .insert({
                post_id: resolvedParams.id,
                user_id: profile.id,
                content: content.trim()
            })
            .select(`
                *,
                user:profiles!forum_replies_user_id_fkey(id, email, avatar_url)
            `)
            .single()

        if (error) {
            console.error('Error creating reply:', error)
            return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
        }

        return NextResponse.json({ reply })
    } catch (error) {
        console.error('Error in replies POST:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 