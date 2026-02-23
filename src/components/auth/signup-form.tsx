'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupInput } from '@/lib/validators'
import { ADMIN_INVITE_CODE } from '@/lib/constants'
import { AlertCircle, Mail } from 'lucide-react'

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [wantAdmin, setWantAdmin] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const input: SignupInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      full_name: formData.get('full_name') as string,
      role: wantAdmin ? 'admin' : 'user',
      invite_code: wantAdmin ? (formData.get('invite_code') as string) : undefined,
    }

    const result = signupSchema.safeParse(input)
    if (!result.success) {
      setError(result.error.issues[0].message)
      setLoading(false)
      return
    }

    if (input.role === 'admin' && input.invite_code !== ADMIN_INVITE_CODE) {
      setError("Code d'invitation admin invalide")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name,
          role: input.role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push(input.role === 'admin' ? '/admin' : '/user')
      router.refresh()
      return
    }

    setEmailSent(true)
    setLoading(false)
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4 animate-scale-in">
        <div className="w-14 h-14 rounded-[999px] bg-success/10 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Vérifiez votre email</h3>
        <p className="text-sm text-text-secondary">
          Un lien de confirmation a été envoyé à votre adresse email.
          Cliquez dessus pour activer votre compte.
        </p>
        <Link href="/login" className="inline-block text-sm font-semibold text-primary hover:underline mt-2">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="btn-secondary w-full !gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {googleLoading ? 'Redirection...' : 'Continuer avec Google'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-text-secondary">ou par email</span>
        </div>
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-danger/10 text-danger p-4 rounded-[16px] text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-text-primary mb-2">
            Nom complet
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className="input"
            placeholder="Jean Dupont"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="vous@exemple.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="input"
            placeholder="Minimum 6 caractères"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="want_admin"
            type="checkbox"
            checked={wantAdmin}
            onChange={(e) => setWantAdmin(e.target.checked)}
            className="h-5 w-5 rounded-[6px] border-border accent-primary"
          />
          <label htmlFor="want_admin" className="text-sm text-text-secondary">
            Compte administrateur
          </label>
        </div>

        {wantAdmin && (
          <div className="animate-scale-in">
            <label htmlFor="invite_code" className="block text-sm font-medium text-text-primary mb-2">
              Code d&apos;invitation admin
            </label>
            <input
              id="invite_code"
              name="invite_code"
              type="text"
              required
              className="input"
              placeholder="XXXX-XXXX-XXXX"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
