import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Determine redirect based on user role
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile) {
          return NextResponse.redirect(`${origin}${profile.role === 'admin' ? '/admin' : '/user'}`)
        }
      }

      // New user (profile created by DB trigger) — default to user dashboard
      return NextResponse.redirect(`${origin}/user`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
