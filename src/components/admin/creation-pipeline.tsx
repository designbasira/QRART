
import { useState } from 'react'
import { ImageUpload } from './image-upload'
import { BackgroundRemover } from './background-remover'
import { QRGenerator } from './qr-generator'
import { ExportPanel } from './export-panel'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'upload' | 'remove-bg' | 'generate-qr' | 'export'

const STEPS: { key: Step; label: string; number: number }[] = [
  { key: 'upload', label: 'Upload', number: 1 },
  { key: 'remove-bg', label: 'Détourage', number: 2 },
  { key: 'generate-qr', label: 'QR Code', number: 3 },
  { key: 'export', label: 'Export', number: 4 },
]

export function CreationPipeline() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [silhouetteImage, setSilhouetteImage] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [designId, setDesignId] = useState<string | null>(null)
  const [shortId, setShortId] = useState<string | null>(null)

  const currentIdx = STEPS.findIndex((s) => s.key === currentStep)

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
    <div className="space-y-8">
      {/* Pipeline stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const stepIdx = i
          const isActive = step.key === currentStep
          const isCompleted = stepIdx < currentIdx
          const isUpcoming = stepIdx > currentIdx

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <button
                onClick={() => {
                  if (stepIdx <= currentIdx) setCurrentStep(step.key)
                }}
                className="flex flex-col items-center gap-2"
                disabled={isUpcoming}
              >
                <div className={cn(
                  'w-10 h-10 rounded-[999px] flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  isActive && 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/15 scale-110',
                  isCompleted && 'bg-primary text-white',
                  isUpcoming && 'bg-surface-alt text-text-secondary border border-border'
                )}>
                  {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                </div>
                <span className={cn(
                  'text-xs font-medium hidden sm:block',
                  isActive && 'text-primary',
                  isCompleted && 'text-text-primary',
                  isUpcoming && 'text-text-secondary'
                )}>
                  {step.label}
                </span>
              </button>

              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 rounded-[999px]">
                  <div className={cn(
                    'h-full rounded-[999px] transition-all',
                    stepIdx < currentIdx ? 'bg-primary' : 'bg-border'
                  )} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="glass-card animate-scale-in">
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
