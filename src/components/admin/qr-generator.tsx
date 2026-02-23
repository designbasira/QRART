'use client'

import { useState, useRef, useEffect } from 'react'
import { createStyledQR } from '@/lib/qr/generate'
import { createClient } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'
import type { QRConfig } from '@/lib/qr/types'

interface QRGeneratorProps {
  silhouetteImage: string
  onQRGenerated: (dataUrl: string, designId: string, shortId: string) => void
}

export function QRGenerator({ silhouetteImage, onQRGenerated }: QRGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [config, setConfig] = useState<QRConfig>({
    shortId: nanoid(10),
    dotsColor: '#000000',
    dotsType: 'rounded',
    backgroundColor: '#ffffff',
    overlayImageUrl: silhouetteImage,
    width: 512,
    height: 512,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!qrRef.current) return
    qrRef.current.innerHTML = ''
    const qr = createStyledQR(config)
    qr.append(qrRef.current)
  }, [config])

  async function handleSaveDesign() {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { data, error: dbError } = await supabase
        .from('designs')
        .insert({
          short_id: config.shortId,
          owner_id: user.id,
          title: `Design ${config.shortId}`,
          silhouette_image_url: silhouetteImage,
        })
        .select()
        .single()

      if (dbError) throw new Error(dbError.message)

      // Get QR as data URL for export step
      const qr = createStyledQR(config)
      const blob = await qr.getRawData('png')
      if (!blob) throw new Error('Échec de la génération QR')

      const blobObj = blob instanceof Blob ? blob : new Blob([new Uint8Array(blob)], { type: 'image/png' })
      const dataUrl = URL.createObjectURL(blobObj)

      onQRGenerated(dataUrl, data.id, config.shortId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Générer le QR Code</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Preview */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Aperçu</p>
          <div ref={qrRef} className="border rounded-lg p-4 flex items-center justify-center bg-white" />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style des points</label>
            <select
              value={config.dotsType}
              onChange={(e) => setConfig({ ...config, dotsType: e.target.value as QRConfig['dotsType'] })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="rounded">Arrondi</option>
              <option value="dots">Points</option>
              <option value="square">Carré</option>
              <option value="classy">Classique</option>
              <option value="extra-rounded">Extra arrondi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur des points</label>
            <input
              type="color"
              value={config.dotsColor}
              onChange={(e) => setConfig({ ...config, dotsColor: e.target.value })}
              className="h-10 w-full rounded-md border border-gray-300 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur de fond</label>
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
              className="h-10 w-full rounded-md border border-gray-300 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="overlay"
              checked={!!config.overlayImageUrl}
              onChange={(e) =>
                setConfig({ ...config, overlayImageUrl: e.target.checked ? silhouetteImage : undefined })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="overlay" className="text-sm text-gray-700">
              Superposer la silhouette
            </label>
          </div>

          <p className="text-xs text-gray-400">
            ID: {config.shortId} | Correction d&apos;erreur: H (30%)
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>
      )}

      <button
        onClick={handleSaveDesign}
        disabled={loading}
        className="px-6 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Sauvegarde...' : 'Sauvegarder et continuer'}
      </button>
    </div>
  )
}
