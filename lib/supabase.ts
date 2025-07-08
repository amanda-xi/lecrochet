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