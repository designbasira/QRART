
import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem('install-dismissed')) {
      setDismissed(true)
      return
    }

    function handler(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem('install-dismissed', '1')
  }

  if (!deferredPrompt || dismissed) return null

  return (
    <div className="fixed bottom-20 inset-x-4 z-50 md:hidden animate-slide-up">
      <div className="glass-card p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-[18px] bg-primary flex items-center justify-center shrink-0">
          <Download size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">Installer QR Live</p>
          <p className="text-xs text-text-secondary">Accès rapide depuis votre écran d&apos;accueil</p>
        </div>
        <button onClick={handleInstall} className="btn-primary !text-xs !px-4 !py-2 shrink-0">
          Installer
        </button>
        <button onClick={handleDismiss} className="p-1.5 rounded-[12px] hover:bg-surface-alt transition-colors shrink-0">
          <X size={14} className="text-text-secondary" />
        </button>
      </div>
    </div>
  )
}
