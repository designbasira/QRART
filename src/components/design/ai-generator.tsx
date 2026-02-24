import { useState } from 'react'
import { Sparkles, Eraser, Download, Loader2 } from 'lucide-react'
import { generateMockup } from '@/lib/whisk'
import { removeImageBackground, type RemovalProgress } from '@/lib/background-removal/remove'

interface AIGeneratorProps {
  onDesignReady: (dataUrl: string) => void
}

export function AIGenerator({ onDesignReady }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)
  const [removeProgress, setRemoveProgress] = useState<RemovalProgress | null>(null)
  const [transparentImage, setTransparentImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setGenerating(true)
    setError(null)
    setGeneratedImage(null)
    setTransparentImage(null)

    try {
      const base64 = await generateMockup(prompt)
      const dataUrl = `data:image/png;base64,${base64}`
      setGeneratedImage(dataUrl)
    } catch {
      setError('La génération a échoué. Vérifiez votre clé API Google AI.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleRemoveBackground() {
    if (!generatedImage) return
    setRemoving(true)
    setError(null)

    try {
      const blob = await removeImageBackground(generatedImage, (p) => setRemoveProgress(p))
      const dataUrl = URL.createObjectURL(blob)
      setTransparentImage(dataUrl)
      onDesignReady(dataUrl)
    } catch {
      setError('Le détourage a échoué.')
    } finally {
      setRemoving(false)
      setRemoveProgress(null)
    }
  }

  function handleDownload() {
    const url = transparentImage || generatedImage
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = `design-ai-${Date.now()}.png`
    a.click()
  }

  const finalImage = transparentImage || generatedImage

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Décrivez votre design
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Un lion majestueux en style géométrique, noir sur fond blanc, minimaliste..."
          rows={3}
          className="w-full px-4 py-3 rounded-[16px] bg-surface-alt border border-border text-text-primary placeholder:text-text-secondary/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating || !prompt.trim()}
        className="btn-primary flex items-center gap-2 disabled:opacity-50"
      >
        {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {generating ? 'Génération en cours...' : 'Générer avec l\'IA'}
      </button>

      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded-[16px] text-sm">{error}</div>
      )}

      {finalImage && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-text-primary">Résultat</p>
          <div
            className="rounded-[18px] border border-border p-4 flex items-center justify-center bg-[length:20px_20px] bg-[position:0_0,10px_10px]"
            style={{ backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)' }}
          >
            <img src={finalImage} alt="Design généré" className="max-h-72 rounded-[12px]" />
          </div>

          <div className="flex gap-2">
            {generatedImage && !transparentImage && (
              <button
                onClick={handleRemoveBackground}
                disabled={removing}
                className="btn-primary flex items-center gap-2 flex-1 disabled:opacity-50"
              >
                {removing ? <Loader2 size={16} className="animate-spin" /> : <Eraser size={16} />}
                {removing ? `Détourage ${removeProgress ? Math.round(removeProgress.progress * 100) + '%' : '...'}` : 'Retirer le fond'}
              </button>
            )}
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download size={16} /> Télécharger
            </button>
          </div>

          {transparentImage && (
            <div className="bg-success/10 text-success p-3 rounded-[16px] text-sm">
              Fond retiré avec succès ! Le design est prêt pour l'impression.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
