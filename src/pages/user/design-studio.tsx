import { useState } from 'react'
import { Sparkles, Upload, Download, ShoppingBag } from 'lucide-react'
import { AIGenerator } from '@/components/design/ai-generator'
import { UploadDetourage } from '@/components/design/upload-detourage'
import { Link } from 'react-router-dom'

type Tab = 'ai' | 'upload'

export function DesignStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('ai')
  const [readyDesign, setReadyDesign] = useState<string | null>(null)

  function handleDesignReady(dataUrl: string) {
    setReadyDesign(dataUrl)
  }

  function handleDownload() {
    if (!readyDesign) return
    const a = document.createElement('a')
    a.href = readyDesign
    a.download = `design-studio-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-[26px] font-bold text-text-primary">Design Studio</h2>
        <p className="text-sm text-text-secondary mt-1">
          Créez des designs avec fond transparent pour l'impression sur t-shirts, mugs et plus.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('ai'); setReadyDesign(null) }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all ${
            activeTab === 'ai'
              ? 'bg-primary text-white shadow-sm shadow-primary/20'
              : 'bg-surface-alt text-text-secondary hover:text-text-primary'
          }`}
        >
          <Sparkles size={16} /> Générer avec l'IA
        </button>
        <button
          onClick={() => { setActiveTab('upload'); setReadyDesign(null) }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-primary text-white shadow-sm shadow-primary/20'
              : 'bg-surface-alt text-text-secondary hover:text-text-primary'
          }`}
        >
          <Upload size={16} /> Uploader une image
        </button>
      </div>

      {/* Content */}
      <div className="glass-card p-5 sm:p-6">
        {activeTab === 'ai' ? (
          <AIGenerator onDesignReady={handleDesignReady} />
        ) : (
          <UploadDetourage onDesignReady={handleDesignReady} />
        )}
      </div>

      {/* Actions when design is ready */}
      {readyDesign && (
        <div className="glass-card p-5 space-y-4 animate-fade-in">
          <h3 className="font-semibold text-text-primary">Design prêt</h3>
          <p className="text-sm text-text-secondary">
            Votre design avec fond transparent est prêt. Vous pouvez le télécharger ou passer commande.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download size={16} /> Télécharger PNG
            </button>
            <Link to="/user/pod" className="btn-primary flex items-center gap-2">
              <ShoppingBag size={16} /> Commander sur POD
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
