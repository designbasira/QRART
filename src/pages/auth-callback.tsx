import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const supabase = createClient()

    async function redirectToDashboard(userId: string) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      window.location.href = profile?.role === 'admin' ? '/admin' : '/user'
    }

    // Listen for auth events (SIGNED_IN or INITIAL_SESSION with PKCE)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          redirectToDashboard(session.user.id)
        }
      }
    )

    // Also check if session already exists (in case event fired before listener)
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        redirectToDashboard(session.user.id)
      }
    })

    // Fallback: if nothing works within 10s, redirect to login
    const timeout = setTimeout(() => {
      navigate('/login?error=auth_timeout', { replace: true })
    }, 10000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass-card p-8 text-center space-y-4 animate-fade-in">
        <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center mx-auto animate-pulse">
          <span className="text-primary font-bold">Q</span>
        </div>
        <p className="text-text-secondary">Connexion en cours...</p>
      </div>
    </div>
  )
}
