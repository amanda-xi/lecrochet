import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { upsertUserProfile } from '@/lib/supabase'

// POST /api/sync-profile - Manually sync user profile
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await upsertUserProfile({
      id: session.user.email,
      email: session.user.email,
      name: session.user.name,
      avatar_url: session.user.image,
    })

    if (!profile) {
      return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Profile synced successfully', profile })
  } catch (error) {
    console.error('Error syncing profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 