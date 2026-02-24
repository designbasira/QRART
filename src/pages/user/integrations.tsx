import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PROVIDERS } from '@/lib/constants'
import { Plus, Trash2, Link2, Cloud, AlertTriangle, CheckCircle } from 'lucide-react'
import type { Integration } from '@/types'

const providerIcons: Record<string, string> = {
  google_drive: '📁',
  dropbox: '📦',
  onedrive: '☁️',
}

export function UserIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [provider, setProvider] = useState<'google_drive' | 'dropbox' | 'onedrive'>('google_drive')
  const [shareLink, setShareLink] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [])

  async function loadIntegrations() {
    const supabase = createClient()
    const { data } = await supabase
      .from('integrations')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setIntegrations(data)
  }

  async function handleAdd() {
    if (!shareLink) return
    setError(null)
    setSuccess(false)

    try {
      new URL(shareLink)
    } catch {
      setError('Veuillez entrer une URL valide')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error: dbError } = await supabase.from('integrations').insert({
        user_id: user.id,
        provider,
        share_link: shareLink,
        label: label || null,
      })

      if (dbError) throw new Error(dbError.message)

      setShareLink('')
      setLabel('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadIntegrations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('integrations').delete().eq('id', id)
    loadIntegrations()
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-[26px] font-bold text-text-primary">Intégrations cloud</h2>
        <p className="text-text-secondary mt-1">Connectez vos services de stockage pour importer du contenu</p>
      </div>

      {/* Provider cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.entries(PROVIDERS) as [keyof typeof PROVIDERS, string][]).map(([key, name]) => {
          const count = integrations.filter((i) => i.provider === key).length
          return (
            <div key={key} className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center text-lg">
                {providerIcons[key]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{name}</p>
                <p className="text-xs text-text-secondary">
                  {count > 0 ? `${count} lien${count > 1 ? 's' : ''}` : 'Non connecté'}
                </p>
              </div>
              {count > 0 && (
                <div className="w-2 h-2 rounded-full bg-success" />
              )}
            </div>
          )
        })}
      </div>

      {/* Add form */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Plus size={18} /> Ajouter un lien de partage
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as typeof provider)}
            className="input"
          >
            {Object.entries(PROVIDERS).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <input
            type="url"
            value={shareLink}
            onChange={(e) => setShareLink(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="input"
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nom (optionnel)"
            className="input"
          />
        </div>

        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-[16px] text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="bg-success/10 text-success p-3 rounded-[16px] text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle size={16} /> Intégration ajoutée !
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={saving || !shareLink}
          className="btn-primary flex items-center gap-2"
        >
          <Link2 size={16} />
          {saving ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>

      {/* List */}
      <div className="glass-card overflow-hidden">
        {integrations.length > 0 ? (
          <ul className="divide-y divide-border">
            {integrations.map((integration) => (
              <li key={integration.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-[12px] bg-surface-alt flex items-center justify-center text-sm shrink-0">
                    {providerIcons[integration.provider]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {PROVIDERS[integration.provider]} {integration.label ? `— ${integration.label}` : ''}
                    </p>
                    <p className="text-xs text-text-secondary truncate max-w-md">{integration.share_link}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(integration.id)}
                  className="p-2 rounded-[12px] text-text-secondary hover:text-danger hover:bg-surface-alt transition-colors shrink-0"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center space-y-2">
            <Cloud size={32} className="text-accent mx-auto" />
            <p className="text-sm text-text-secondary">Aucune intégration pour le moment.</p>
            <p className="text-xs text-text-secondary">Ajoutez un lien de partage pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}
