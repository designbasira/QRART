import { Link } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'
import { Home, QrCode } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glass-card p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-[24px] bg-surface-alt flex items-center justify-center mx-auto">
          <QrCode size={32} className="text-accent" />
        </div>
        <div className="space-y-2">
          <h1 className="text-[42px] font-bold text-text-primary font-serif">404</h1>
          <p className="text-text-secondary">Cette page n&apos;existe pas ou a été déplacée.</p>
        </div>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={16} /> Retour à l&apos;accueil
        </Link>
        <p className="text-xs text-text-secondary">{APP_NAME}</p>
      </div>
    </div>
  )
}
