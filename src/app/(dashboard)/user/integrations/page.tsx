'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PROVIDERS } from '@/lib/constants'
import type { Integration } from '@/types'

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [provider, setProvider] = useState<'google_drive' | 'dropbox' | 'onedrive'>('google_drive')
  const [shareLink, setShareLink] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)

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
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('integrations').insert({
      user_id: user.id,
      provider,
      share_link: shareLink,
      label: label || null,
    })

    setShareLink('')
    setLabel('')
    setSaving(false)
    loadIntegrations()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('integrations').delete().eq('id', id)
    loadIntegrations()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Intégrations cloud</h2>

      {/* Add new */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold">Ajouter un lien de partage</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as typeof provider)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {Object.entries(PROVIDERS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input
            type="url"
            value={shareLink}
            onChange={(e) => setShareLink(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nom (optionnel)"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={saving || !shareLink}
          className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          Ajouter
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border">
        {integrations.length > 0 ? (
          <ul className="divide-y">
            {integrations.map((integration) => (
              <li key={integration.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {PROVIDERS[integration.provider]} {integration.label ? `— ${integration.label}` : ''}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-md">{integration.share_link}</p>
                </div>
                <button
                  onClick={() => handleDelete(integration.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-sm text-gray-500">Aucune intégration.</p>
        )}
      </div>
    </div>
  )
}
