'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Design } from '@/types'

interface ContentEditorProps {
  design: Design
}

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
    <div className="bg-white rounded-lg border p-6 space-y-6">
      {/* Content type tabs */}
      <div className="flex gap-2">
        {(['text', 'image', 'link'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setContentType(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
              contentType === type ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'text' ? 'Texte' : type === 'image' ? 'Image' : 'Lien'}
          </button>
        ))}
      </div>

      {/* Content input */}
      {contentType === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message affiché lors du scan
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            maxLength={5000}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Écrivez votre message ici..."
          />
          <p className="text-xs text-gray-400 mt-1">{message.length}/5000</p>
        </div>
      )}

      {contentType === 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de l&apos;image
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="https://drive.google.com/... ou lien direct vers l'image"
          />
          <p className="text-xs text-gray-400 mt-1">
            Collez un lien de partage Google Drive, Dropbox, ou un lien direct vers une image.
          </p>
          {mediaUrl && (
            <img src={mediaUrl} alt="Preview" className="mt-2 max-h-48 rounded border" />
          )}
        </div>
      )}

      {contentType === 'link' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de redirection
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="https://exemple.com"
          />
        </div>
      )}

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}
      {saved && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">Sauvegardé !</div>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  )
}
