'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupInput } from '@/lib/validators'
import { ADMIN_INVITE_CODE } from '@/lib/constants'

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [wantAdmin, setWantAdmin] = useState(false)

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
      invite_code: formData.get('invite_code') as string | undefined,
    }

    const result = signupSchema.safeParse(input)
    if (!result.success) {
      setError(result.error.issues[0].message)
      setLoading(false)
      return
    }

    // Validate admin invite code
    if (input.role === 'admin' && input.invite_code !== ADMIN_INVITE_CODE) {
      setError("Code d'invitation admin invalide")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name,
          role: input.role,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push(input.role === 'admin' ? '/admin' : '/user')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-sm border">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Jean Dupont"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="vous@exemple.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="want_admin"
            type="checkbox"
            checked={wantAdmin}
            onChange={(e) => setWantAdmin(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="want_admin" className="text-sm text-gray-700">
            Compte administrateur
          </label>
        </div>

        {wantAdmin && (
          <div>
            <label htmlFor="invite_code" className="block text-sm font-medium text-gray-700">
              Code d&apos;invitation admin
            </label>
            <input
              id="invite_code"
              name="invite_code"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="XXXX-XXXX-XXXX"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Inscription...' : "S'inscrire"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-medium text-black hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  )
}
