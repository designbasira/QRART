'use client'

import { useState } from 'react'
import { ImageUpload } from './image-upload'
import { BackgroundRemover } from './background-remover'
import { QRGenerator } from './qr-generator'
import { ExportPanel } from './export-panel'

type Step = 'upload' | 'remove-bg' | 'generate-qr' | 'export'

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: '1. Upload' },
  { key: 'remove-bg', label: '2. Détourage' },
  { key: 'generate-qr', label: '3. QR Code' },
  { key: 'export', label: '4. Export' },
]

export function CreationPipeline() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [silhouetteImage, setSilhouetteImage] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [designId, setDesignId] = useState<string | null>(null)
  const [shortId, setShortId] = useState<string | null>(null)

  function handleImageUploaded(dataUrl: string) {
    setOriginalImage(dataUrl)
    setCurrentStep('remove-bg')
  }

  function handleBgRemoved(dataUrl: string) {
    setSilhouetteImage(dataUrl)
    setCurrentStep('generate-qr')
  }

  function handleQRGenerated(dataUrl: string, newDesignId: string, newShortId: string) {
    setQrDataUrl(dataUrl)
    setDesignId(newDesignId)
    setShortId(newShortId)
    setCurrentStep('export')
  }

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex gap-2">
        {STEPS.map((step) => (
          <button
            key={step.key}
            onClick={() => {
              // Only allow going back to completed steps
              const currentIdx = STEPS.findIndex((s) => s.key === currentStep)
              const targetIdx = STEPS.findIndex((s) => s.key === step.key)
              if (targetIdx <= currentIdx) setCurrentStep(step.key)
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              step.key === currentStep
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border p-6">
        {currentStep === 'upload' && (
          <ImageUpload onImageUploaded={handleImageUploaded} />
        )}
        {currentStep === 'remove-bg' && originalImage && (
          <BackgroundRemover
            originalImage={originalImage}
            onBgRemoved={handleBgRemoved}
          />
        )}
        {currentStep === 'generate-qr' && silhouetteImage && (
          <QRGenerator
            silhouetteImage={silhouetteImage}
            onQRGenerated={handleQRGenerated}
          />
        )}
        {currentStep === 'export' && qrDataUrl && (
          <ExportPanel
            qrDataUrl={qrDataUrl}
            silhouetteImage={silhouetteImage}
            designId={designId}
            shortId={shortId}
          />
        )}
      </div>
    </div>
  )
}
