
import { useState, useRef, useEffect } from 'react'
import { createStyledQR } from '@/lib/qr/generate'
import { createClient } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'
import type { QRConfig } from '@/lib/qr/types'
import { Save, AlertTriangle } from 'lucide-react'

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
  const [transparentBg, setTransparentBg] = useState(false)
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
      <h3 className="text-lg font-semibold text-text-primary">Générer le QR Code</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Preview */}
        <div>
          <p className="text-sm text-text-secondary mb-2">Aperçu</p>
          <div ref={qrRef} className={`border border-border rounded-[18px] p-4 flex items-center justify-center ${transparentBg ? 'bg-[length:20px_20px] bg-[position:0_0,10px_10px]' : 'bg-surface'}`} style={transparentBg ? { backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)' } : undefined} />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Style des points</label>
            <select
              value={config.dotsType}
              onChange={(e) => setConfig({ ...config, dotsType: e.target.value as QRConfig['dotsType'] })}
              className="input w-full"
            >
              <option value="rounded">Arrondi</option>
              <option value="dots">Points</option>
              <option value="square">Carré</option>
              <option value="classy">Classique</option>
              <option value="extra-rounded">Extra arrondi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Couleur des points</label>
            <input
              type="color"
              value={config.dotsColor}
              onChange={(e) => setConfig({ ...config, dotsColor: e.target.value })}
              className="h-[48px] w-full rounded-[16px] border border-border cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Couleur de fond</label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                id="transparentBg"
                checked={transparentBg}
                onChange={(e) => {
                  setTransparentBg(e.target.checked)
                  setConfig({ ...config, backgroundColor: e.target.checked ? 'transparent' : '#ffffff' })
                }}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <label htmlFor="transparentBg" className="text-sm text-text-primary">
                Fond transparent
              </label>
            </div>
            {!transparentBg && (
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                className="h-[48px] w-full rounded-[16px] border border-border cursor-pointer"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="overlay"
              checked={!!config.overlayImageUrl}
              onChange={(e) =>
                setConfig({ ...config, overlayImageUrl: e.target.checked ? silhouetteImage : undefined })
              }
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <label htmlFor="overlay" className="text-sm text-text-primary">
              Superposer la silhouette
            </label>
          </div>

          <p className="text-xs text-text-secondary">
            ID: <span className="font-mono bg-surface-alt px-1.5 py-0.5 rounded-[999px]">{config.shortId}</span> | Correction d&apos;erreur: H (30%)
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded-[16px] text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      <button
        onClick={handleSaveDesign}
        disabled={loading}
        className="btn-primary flex items-center gap-2"
      >
        <Save size={16} />
        {loading ? 'Sauvegarde...' : 'Sauvegarder et continuer'}
      </button>
    </div>
  )
}
