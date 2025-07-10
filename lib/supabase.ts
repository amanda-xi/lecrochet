import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Pattern {
  id: string
  user_id: string
  title: string
  description: string | null
  pattern_code: string
  compiled_data: Record<string, unknown> | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ForumCategory {
  id: string
  name: string
  description: string | null
  slug: string
  color: string
  icon: string
  post_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ForumPost {
  id: string
  category_id: string
  user_id: string
  title: string
  content: string
  is_pinned: boolean
  is_locked: boolean
  reply_count: number
  last_reply_at: string
  last_reply_user_id: string | null
  created_at: string
  updated_at: string
  // Relations
  category?: ForumCategory
  user?: UserProfile
  last_reply_user?: UserProfile
}

export interface ForumReply {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  // Relations
  user?: UserProfile
}

// Helper function to get the current user's profile
export async function getCurrentUser(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data as UserProfile
}

// Helper function to create or update user profile
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting user profile:', error)
    return null
  }
  
  return data as UserProfile
}

// Helper functions for forum operations

// Get all active forum categories
export async function getForumCategories() {
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) {
    console.error('Error fetching forum categories:', error)
    return null
  }
  
  return data as ForumCategory[]
}

// Get posts for a category with pagination
export async function getCategoryPosts(categoryId: string, page = 0, limit = 20) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select(`
      *,
      category:forum_categories(*),
      user:profiles!forum_posts_user_id_fkey(id, email, avatar_url),
      last_reply_user:profiles!forum_posts_last_reply_user_id_fkey(id, email, avatar_url)
    `)
    .eq('category_id', categoryId)
    .order('is_pinned', { ascending: false })
    .order('last_reply_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
  
  if (error) {
    console.error('Error fetching category posts:', error)
    return null
  }
  
  return data as ForumPost[]
}

// Get recent posts across all categories
export async function getRecentPosts(limit = 10) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select(`
      *,
      category:forum_categories(*),
      user:profiles!forum_posts_user_id_fkey(id, email, avatar_url),
      last_reply_user:profiles!forum_posts_last_reply_user_id_fkey(id, email, avatar_url)
    `)
    .order('last_reply_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching recent posts:', error)
    return null
  }
  
  return data as ForumPost[]
}

// Get a single post with replies
export async function getPostWithReplies(postId: string) {
  const [postResult, repliesResult] = await Promise.all([
    supabase
      .from('forum_posts')
      .select(`
        *,
        category:forum_categories(*),
        user:profiles!forum_posts_user_id_fkey(id, email, avatar_url)
      `)
      .eq('id', postId)
      .single(),
    
    supabase
      .from('forum_replies')
      .select(`
        *,
        user:profiles!forum_replies_user_id_fkey(id, email, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
  ])
  
  if (postResult.error) {
    console.error('Error fetching post:', postResult.error)
    return null
  }
  
  if (repliesResult.error) {
    console.error('Error fetching replies:', repliesResult.error)
    return { post: postResult.data as ForumPost, replies: [] }
  }
  
  return {
    post: postResult.data as ForumPost,
    replies: repliesResult.data as ForumReply[]
  }
} 