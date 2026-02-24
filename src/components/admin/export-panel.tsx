import { QR_BASE_URL } from '@/lib/constants'
import { generateMockup as generateMockupImage } from '@/lib/whisk'
import { Download, Copy, CheckCircle, Link, Shirt, Coffee, Frame, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ExportPanelProps {
  qrDataUrl: string
  silhouetteImage: string | null
  designId: string | null
  shortId: string | null
}

const MOCKUP_TYPES = [
  { id: 'tshirt', label: 'T-shirt', icon: Shirt, prompt: 'A white premium t-shirt with an artistic QR code printed on the front, studio photography, clean background' },
  { id: 'mug', label: 'Mug', icon: Coffee, prompt: 'A white ceramic coffee mug with an artistic QR code printed on it, studio photography, clean background' },
  { id: 'frame', label: 'Cadre', icon: Frame, prompt: 'A modern picture frame with an artistic QR code as the artwork, mounted on a white wall, studio photography' },
]

export function ExportPanel({ qrDataUrl, shortId }: ExportPanelProps) {
  const [copied, setCopied] = useState(false)
  const [mockups, setMockups] = useState<{ id: string; dataUrl: string }[]>([])
  const [loadingMockup, setLoadingMockup] = useState<string | null>(null)
  const [mockupError, setMockupError] = useState<string | null>(null)

  function downloadImage(format: string) {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qrart-${shortId}.${format}`
    link.click()
  }

  const scanUrl = shortId ? `${QR_BASE_URL}/${shortId}` : ''

  function copyUrl() {
    navigator.clipboard.writeText(scanUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function generateMockup(type: typeof MOCKUP_TYPES[number]) {
    setLoadingMockup(type.id)
    setMockupError(null)

    try {
      const base64 = await generateMockupImage(type.prompt)
      const dataUrl = `data:image/png;base64,${base64}`
      setMockups((prev) => [...prev, { id: type.id, dataUrl }])
    } catch {
      setMockupError('La génération de mockup a échoué. Vérifiez votre clé API Google AI.')
    } finally {
      setLoadingMockup(null)
    }
  }

  function downloadMockup(mockup: { id: string; dataUrl: string }) {
    const link = document.createElement('a')
    link.href = mockup.dataUrl
    link.download = `qrart-mockup-${mockup.id}-${shortId}.png`
    link.click()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary">Export du design</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <p className="text-sm text-text-secondary mb-2">QR Code final</p>
          <img src={qrDataUrl} alt="QR Code" className="rounded-[18px] border border-border max-h-80 w-full object-contain" />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
              <Link size={14} /> URL de scan
            </p>
            <div className="flex gap-2">
              <code className="flex-1 bg-surface-alt p-3 rounded-[16px] text-xs break-all text-text-secondary">
                {scanUrl}
              </code>
              <button onClick={copyUrl} className="btn-secondary !px-3 shrink-0">
                {copied ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
              <Download size={14} /> Télécharger
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => downloadImage('png')}
                className="btn-primary flex items-center gap-1.5 !text-sm"
              >
                PNG
              </button>
              <button
                onClick={() => downloadImage('jpg')}
                className="btn-secondary flex items-center gap-1.5 !text-sm"
              >
                JPG
              </button>
            </div>
          </div>

          <div className="bg-success/10 text-success p-4 rounded-[16px] text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            Design sauvegardé !
          </div>
        </div>
      </div>

      {/* Mockups Section */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary">Mockups produit</h3>
        <p className="text-sm text-text-secondary">
          Générez un aperçu de votre QR Code sur un produit via l&apos;IA.
        </p>

        <div className="flex gap-3">
          {MOCKUP_TYPES.map((type) => {
            const Icon = type.icon
            const isLoading = loadingMockup === type.id
            const hasResult = mockups.some((m) => m.id === type.id)
            return (
              <button
                key={type.id}
                onClick={() => generateMockup(type)}
                disabled={isLoading || hasResult}
                className="btn-secondary flex items-center gap-2 !text-sm"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                {type.label}
                {hasResult && <CheckCircle size={14} className="text-success" />}
              </button>
            )
          })}
        </div>

        {mockupError && (
          <p className="text-sm text-danger">{mockupError}</p>
        )}

        {/* Mockup Gallery */}
        {mockups.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {mockups.map((mockup) => (
              <div key={mockup.id} className="relative group">
                <img
                  src={mockup.dataUrl}
                  alt={`Mockup ${mockup.id}`}
                  className="rounded-[18px] border border-border w-full aspect-square object-cover"
                />
                <button
                  onClick={() => downloadMockup(mockup)}
                  className="absolute bottom-2 right-2 p-2 rounded-[12px] bg-surface/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={14} className="text-text-primary" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
