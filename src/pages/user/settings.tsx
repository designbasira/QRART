import { useAuth } from '@/components/auth/auth-provider'
import { ProfileForm } from '@/components/user/profile-form'
import { PasswordForm } from '@/components/user/password-form'
import { ThemePreference } from '@/components/user/theme-preference'
import { Trash2, AlertTriangle, Palette } from 'lucide-react'

export function UserSettingsPage() {
  const { user, profile } = useAuth()

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-[26px] font-bold text-text-primary">Paramètres</h2>
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Informations personnelles</h3>
        <ProfileForm initialName={profile?.full_name || ''} email={user?.email || ''} />
      </div>
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Sécurité</h3>
        <PasswordForm />
      </div>
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><Palette size={18} /> Préférences</h3>
        <ThemePreference />
      </div>
      <div className="glass-card p-6 space-y-4 border-danger/30 border">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle size={18} /><h3 className="text-lg font-semibold">Zone dangereuse</h3>
        </div>
        <p className="text-sm text-text-secondary">La suppression de votre compte est irréversible. Tous vos designs et données seront perdus.</p>
        <button type="button" className="btn-danger flex items-center gap-2" onClick={() => alert('Fonctionnalité bientôt disponible')}>
          <Trash2 size={16} /> Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
