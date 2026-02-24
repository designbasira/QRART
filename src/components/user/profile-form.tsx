
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface ProfileFormProps {
  initialName: string
  email: string
}

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id)

      if (dbError) throw new Error(dbError.message)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Nom complet</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-full"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="input w-full opacity-60 cursor-not-allowed"
        />
        <p className="text-xs text-text-secondary mt-1">L&apos;email ne peut pas être modifié.</p>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded-[16px] text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 text-success p-3 rounded-[16px] text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle size={16} /> Profil mis à jour !
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </form>
  )
}
