import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { upsertUserProfile } from "./supabase"

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token) {
        (session.user as { id: string }).id = token.sub as string;
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user && account && user.email) {
        // Always use email as the consistent identifier
        token.sub = user.email
        
        // Create or update user profile in Supabase
        try {
          await upsertUserProfile({
            id: user.email, // Using email as primary key
            email: user.email,
            name: user.name || null,
            avatar_url: user.image || null,
          })
          console.log('User profile created/updated for:', user.email)
        } catch (error) {
          console.error('Error creating/updating user profile:', error)
        }
      }
      return token
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  }
} 