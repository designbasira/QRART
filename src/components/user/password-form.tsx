
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, AlertTriangle, Lock } from 'lucide-react'

export function PasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw new Error(updateError.message)

      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
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
        <label className="block text-sm font-medium text-text-primary mb-1">
          <span className="flex items-center gap-1.5">
            <Lock size={14} /> Nouveau mot de passe
          </span>
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input w-full"
          placeholder="Minimum 8 caractères"
          minLength={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input w-full"
          placeholder="Retapez le mot de passe"
          minLength={8}
        />
      </div>

      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded-[16px] text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {success && (
        <div className="bg-success/10 text-success p-3 rounded-[16px] text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle size={16} /> Mot de passe mis à jour !
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
      </button>
    </form>
  )
}
