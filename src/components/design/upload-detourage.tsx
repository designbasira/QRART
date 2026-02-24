import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, Image, Eraser, Download, Loader2 } from 'lucide-react'
import { removeImageBackground, type RemovalProgress } from '@/lib/background-removal/remove'

interface UploadDetourageProps {
  onDesignReady: (dataUrl: string) => void
}

export function UploadDetourage({ onDesignReady }: UploadDetourageProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [transparentImage, setTransparentImage] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)
  const [removeProgress, setRemoveProgress] = useState<RemovalProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    setTransparentImage(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = () => setOriginalImage(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  async function handleRemoveBackground() {
    if (!originalImage) return
    setRemoving(true)
    setError(null)

    try {
      const blob = await removeImageBackground(originalImage, (p) => setRemoveProgress(p))
      const dataUrl = URL.createObjectURL(blob)
      setTransparentImage(dataUrl)
      onDesignReady(dataUrl)
    } catch {
      setError('Le détourage a échoué. Essayez avec une autre image.')
    } finally {
      setRemoving(false)
      setRemoveProgress(null)
    }
  }

  function handleDownload() {
    const url = transparentImage || originalImage
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = `design-detourage-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="space-y-5">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-[24px] p-6 sm:p-10 text-center cursor-pointer transition-all duration-240 ${
          isDragActive ? 'border-primary bg-primary-soft/30' : 'border-border hover:border-accent hover:bg-surface-alt/30'
        }`}
      >
        <input {...getInputProps()} />
        {originalImage ? (
          <img src={originalImage} alt="Image uploadée" className="max-h-48 mx-auto rounded-[18px]" />
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[18px] bg-surface-alt flex items-center justify-center mx-auto">
              {isDragActive ? <Image size={24} className="text-primary" /> : <CloudUpload size={24} className="text-accent" />}
            </div>
            <p className="text-text-secondary">
              {isDragActive ? 'Déposez l\'image ici...' : 'Glissez-déposez une image ou cliquez pour sélectionner'}
            </p>
            <span className="inline-block text-xs bg-surface-alt text-text-secondary px-3 py-1 rounded-[999px]">
              PNG, JPG, WEBP — Max 10 Mo
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded-[16px] text-sm">{error}</div>
      )}

      {originalImage && (
        <div className="space-y-4">
          {!transparentImage ? (
            <button
              onClick={handleRemoveBackground}
              disabled={removing}
              className="btn-primary flex items-center gap-2 w-full justify-center disabled:opacity-50"
            >
              {removing ? <Loader2 size={16} className="animate-spin" /> : <Eraser size={16} />}
              {removing
                ? `Détourage ${removeProgress ? Math.round(removeProgress.progress * 100) + '%' : '...'}`
                : 'Retirer le fond automatiquement'}
            </button>
          ) : (
            <>
              <p className="text-sm font-medium text-text-primary">Résultat — Fond transparent</p>
              <div
                className="rounded-[18px] border border-border p-4 flex items-center justify-center bg-[length:20px_20px] bg-[position:0_0,10px_10px]"
                style={{ backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)' }}
              >
                <img src={transparentImage} alt="Design détouré" className="max-h-72 rounded-[12px]" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
                  <Download size={16} /> Télécharger
                </button>
              </div>
              <div className="bg-success/10 text-success p-3 rounded-[16px] text-sm">
                Fond retiré avec succès ! Le design est prêt pour l'impression.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
