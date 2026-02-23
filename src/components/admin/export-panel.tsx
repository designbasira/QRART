'use client'

import { QR_BASE_URL } from '@/lib/constants'

interface ExportPanelProps {
  qrDataUrl: string
  silhouetteImage: string | null
  designId: string | null
  shortId: string | null
}

export function ExportPanel({ qrDataUrl, shortId }: ExportPanelProps) {
  function downloadImage(format: string) {
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qrart-${shortId}.${format}`
    link.click()
  }

  const scanUrl = shortId ? `${QR_BASE_URL}/${shortId}` : ''

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Export du design</h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">QR Code final</p>
          <img src={qrDataUrl} alt="QR Code" className="rounded border max-h-80 w-full object-contain" />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">URL de scan</p>
            <code className="block bg-gray-100 p-3 rounded text-xs break-all">{scanUrl}</code>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Télécharger</p>
            <div className="flex gap-2">
              <button
                onClick={() => downloadImage('png')}
                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
              >
                PNG
              </button>
              <button
                onClick={() => downloadImage('jpg')}
                className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600"
              >
                JPG
              </button>
            </div>
          </div>

          <div className="bg-green-50 text-green-800 p-4 rounded-md text-sm">
            Design sauvegardé ! Vous pouvez maintenant l&apos;assigner à un utilisateur
            depuis la page de gestion des designs.
          </div>
        </div>
      </div>
    </div>
  )
}
