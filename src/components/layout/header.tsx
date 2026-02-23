'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { APP_NAME } from '@/lib/constants'
import type { Profile } from '@/types'

export function Header({ profile }: { profile: Profile }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">{APP_NAME}</h1>

      <div className="flex items-center gap-4">
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 capitalize">
          {profile.role}
        </span>
        <span className="text-sm text-gray-600">{profile.full_name || profile.email}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}
