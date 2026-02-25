import { useState } from 'react'
import { Sparkles, Eraser, Download, Loader2, Key, ChevronDown, ExternalLink, Check, X } from 'lucide-react'
import { generateImage } from '@/lib/ai/generate'
import { AI_PROVIDERS } from '@/lib/ai/providers'
import { getApiKey, setApiKey, removeApiKey, hasApiKey } from '@/lib/ai/keys'
import { removeImageBackground, type RemovalProgress } from '@/lib/background-removal/remove'

interface AIGeneratorProps {
  onDesignReady: (dataUrl: string) => void
}

export function AIGenerator({ onDesignReady }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0].id)
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)
  const [removeProgress, setRemoveProgress] = useState<RemovalProgress | null>(null)
  const [transparentImage, setTransparentImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // API key form state
  const [keyFormOpen, setKeyFormOpen] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [keySaved, setKeySaved] = useState(false)

  const provider = AI_PROVIDERS.find((p) => p.id === selectedProvider)!

  async function handleGenerate() {
    if (!prompt.trim()) return
    setGenerating(true)
    setError(null)
    setGeneratedImage(null)
    setTransparentImage(null)

    try {
      const dataUrl = await generateImage(prompt, selectedProvider)
      setGeneratedImage(dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La génération a échoué.')
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

  function handleSaveKey() {
    if (!keyInput.trim()) return
    setApiKey(selectedProvider, keyInput.trim())
    setKeyInput('')
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  function handleRemoveKey() {
    removeApiKey(selectedProvider)
    setKeyInput('')
    setKeySaved(false)
  }

  const hasKey = hasApiKey(selectedProvider)
  const finalImage = transparentImage || generatedImage

  return (
    <div className="space-y-5">
      {/* Model selector */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Modèle IA</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value)
                setKeyFormOpen(false)
                setKeyInput('')
                setKeySaved(false)
              }}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-[16px] bg-surface-alt border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {AI_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            />
          </div>

          {/* API key toggle button */}
          <button
            onClick={() => setKeyFormOpen(!keyFormOpen)}
            className={`relative p-2.5 rounded-[12px] border transition-colors ${
              hasKey
                ? 'border-success/40 bg-success/10 text-success hover:bg-success/20'
                : 'border-border bg-surface-alt text-text-secondary hover:bg-surface-alt/80'
            }`}
            title={hasKey ? 'Clé API configurée' : 'Ajouter une clé API'}
          >
            <Key size={18} />
            {/* Status dot */}
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-surface ${
                hasKey ? 'bg-success' : 'bg-danger'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-1.5">{provider.description}</p>
      </div>

      {/* Collapsible API key form */}
      {keyFormOpen && (
        <div className="rounded-[16px] border border-border bg-surface-alt p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2 text-xs text-warning bg-warning/10 p-2.5 rounded-[12px]">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>
              La clé est stockée localement dans votre navigateur (localStorage). Ne l'utilisez pas
              sur un ordinateur partagé.
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder={provider.keyPlaceholder}
              className="flex-1 px-3 py-2 rounded-[12px] bg-surface border border-border text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
            />
            <button
              onClick={handleSaveKey}
              disabled={!keyInput.trim()}
              className="btn-primary px-3 py-2 text-sm disabled:opacity-50"
            >
              {keySaved ? <Check size={16} /> : 'Sauvegarder'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink size={12} /> Obtenir une clé
            </a>
            {hasKey && (
              <button
                onClick={handleRemoveKey}
                className="text-xs text-danger hover:underline flex items-center gap-1"
              >
                <X size={12} /> Supprimer la clé
              </button>
            )}
          </div>
        </div>
      )}

      {/* Prompt */}
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
