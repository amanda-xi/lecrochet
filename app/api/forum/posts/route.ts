import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        const categoryId = searchParams.get('category')
        const page = parseInt(searchParams.get('page') || '0')
        const limit = parseInt(searchParams.get('limit') || '20')
        
        let query = supabase
            .from('forum_posts')
            .select(`
                *,
                category:forum_categories(*),
                user:profiles!forum_posts_user_id_fkey(id, email, name, avatar_url),
                last_reply_user:profiles!forum_posts_last_reply_user_id_fkey(id, email, name, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1)

        if (categoryId) {
            query = query.eq('category_id', categoryId)
        }

        const { data: posts, error } = await query

        if (error) {
            console.error('Error fetching posts:', error)
            return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
        }

        return NextResponse.json({ posts: posts || [] })
    } catch (error) {
        console.error('Error in posts API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
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

        if (!title || !content || !category_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data: post, error } = await supabase
            .from('forum_posts')
            .insert({
                title,
                content,
                category_id,
                user_id: profile.id
            })
            .select(`
                *,
                category:forum_categories(*),
                user:profiles!forum_posts_user_id_fkey(id, email, name, avatar_url)
            `)
            .single()

        if (error) {
            console.error('Error creating post:', error)
            return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error in posts POST:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 