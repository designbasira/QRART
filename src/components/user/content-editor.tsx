
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Type, ImageIcon, Link2, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Design } from '@/types'

interface ContentEditorProps {
  design: Design
}

const TABS = [
  { key: 'text' as const, label: 'Texte', icon: Type },
  { key: 'image' as const, label: 'Image', icon: ImageIcon },
  { key: 'link' as const, label: 'Lien', icon: Link2 },
]

export function ContentEditor({ design }: ContentEditorProps) {
  const [contentType, setContentType] = useState(design.content_type)
  const [message, setMessage] = useState(design.current_message || '')
  const [mediaUrl, setMediaUrl] = useState(design.current_media_url || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('designs')
      .update({
        content_type: contentType,
        current_message: contentType === 'text' ? message : design.current_message,
        current_media_url: contentType !== 'text' ? mediaUrl : design.current_media_url,
      })
      .eq('id', design.id)

    if (dbError) {
      setError(dbError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="glass-panel p-6 space-y-6">
      <h3 className="font-semibold text-lg text-text-primary">Modifier le contenu</h3>

      {/* Content type tabs — glass pill row */}
      <div className="flex gap-1.5 p-1.5 rounded-[22px] bg-surface-alt/80">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setContentType(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-[18px] text-sm font-semibold transition-all flex-1 justify-center',
              contentType === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content input */}
      {contentType === 'text' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Message affiché lors du scan
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            maxLength={5000}
            className="input !h-auto py-3 resize-none"
            placeholder="Écrivez votre message ici..."
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-text-secondary">{message.length}/5000</p>
            <div className="h-1 w-20 rounded-full bg-surface-alt overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((message.length / 5000) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {contentType === 'image' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            URL de l&apos;image
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="input"
            placeholder="https://drive.google.com/... ou lien direct"
          />
          <p className="text-xs text-text-secondary mt-2">
            Collez un lien de partage Google Drive, Dropbox, ou un lien direct vers une image.
          </p>
          {mediaUrl && (
            <img src={mediaUrl} alt="Preview" className="mt-3 max-h-48 rounded-[16px] border border-border" />
          )}
        </div>
      )}

      {contentType === 'link' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            URL de redirection
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="input"
            placeholder="https://exemple.com"
          />
        </div>
      )}

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 bg-danger/10 text-danger p-4 rounded-[16px] text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-success/10 text-success p-4 rounded-[16px] text-sm">
          <Check className="w-4 h-4 shrink-0" />
          Sauvegardé !
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full"
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  )
}
