"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfilePage() {
  const { data: session } = useSession()

  if (!session || !session.user) {
    return <div>You need to be signed in to view this page.</div>
  }

  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={session.user.image!} alt={session.user.name ?? ""} />
          <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{session.user.name}</h2>
          <p className="text-gray-500">{session.user.email}</p>
        </div>
      </div>
    </div>
  )
} 