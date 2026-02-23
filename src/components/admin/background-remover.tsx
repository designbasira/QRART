'use client'

import { useState } from 'react'
import { removeImageBackground, type RemovalProgress } from '@/lib/background-removal/remove'

interface BackgroundRemoverProps {
  originalImage: string
  onBgRemoved: (dataUrl: string) => void
}

export function BackgroundRemover({ originalImage, onBgRemoved }: BackgroundRemoverProps) {
  const [progress, setProgress] = useState<RemovalProgress | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRemove() {
    setError(null)
    setProgress({ phase: 'loading', progress: 0 })

    try {
      const blob = await removeImageBackground(originalImage, setProgress)
      const dataUrl = URL.createObjectURL(blob)
      setResult(dataUrl)
      onBgRemoved(dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du détourage')
      setProgress(null)
    }
  }

  const progressPercent = progress ? Math.round(progress.progress * 100) : 0
  const phaseLabel = progress?.phase === 'loading'
    ? 'Chargement du modèle IA...'
    : progress?.phase === 'processing'
      ? 'Détourage en cours...'
      : 'Terminé'

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Détourage automatique</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Original</p>
          <img src={originalImage} alt="Original" className="rounded border max-h-64 w-full object-contain" />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Résultat</p>
          {result ? (
            <img src={result} alt="Silhouette" className="rounded border max-h-64 w-full object-contain bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAYdEVYdFRpdGxlAENoZWNrZXJib2FyZCBwYXR0ZXJuN6dJTgAAAC9JREFUOI1j/P///38GJMDIwMDAQIwmBgYGBob/DAz/GdCAMcP/RsMI3UAGB/IAALlnDff3Py6bAAAAAElFTkSuQmCC')]" />
          ) : (
            <div className="rounded border h-64 flex items-center justify-center bg-gray-50">
              <p className="text-sm text-gray-400">En attente...</p>
            </div>
          )}
        </div>
      </div>

      {progress && progress.phase !== 'complete' && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{phaseLabel}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>
      )}

      {!result && (
        <button
          onClick={handleRemove}
          disabled={!!progress && progress.phase !== 'complete'}
          className="px-6 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {progress ? 'Traitement...' : 'Détourer l\'image'}
        </button>
      )}
    </div>
  )
}
