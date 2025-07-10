import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const include = searchParams.get('include')

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const result: { 
      profile: {
        id: string;
        email: string;
        name: string | null;
        avatar_url: string | null;
        created_at: string;
        updated_at: string;
      }; 
      forumPosts?: {
        id: string;
        title: string;
        content: string;
        reply_count: number;
        created_at: string;
        category: {
          id: string;
          name: string;
          slug: string;
          color: string;
        };
      }[]; 
      forumReplies?: {
        id: string;
        content: string;
        created_at: string;
        post: {
          id: string;
          title: string;
          category: {
            id: string;
            name: string;
            slug: string;
          };
        };
      }[]; 
    } = { profile }

    // Include forum posts and replies if requested
    if (include?.includes('forum')) {
      const [postsResult, repliesResult] = await Promise.all([
        // Get user's forum posts
        supabase
          .from('forum_posts')
          .select(`
            *,
            category:forum_categories(id, name, slug, color)
          `)
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false }),
        
        // Get user's forum replies with post info
        supabase
          .from('forum_replies')
          .select(`
            *,
            post:forum_posts(id, title, category:forum_categories(id, name, slug))
          `)
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
      ])

      result.forumPosts = postsResult.data || []
      result.forumReplies = repliesResult.data || []
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in profile GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, avatar_url } = await request.json()

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        name,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('email', session.user.email)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error in profile PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 