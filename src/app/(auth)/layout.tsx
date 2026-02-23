import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center animate-fade-in">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-text-primary">
              {APP_NAME}
            </h1>
          </Link>
          <p className="mt-2 text-sm text-text-secondary">
            QR Codes artistiques dynamiques
          </p>
        </div>
        <div className="glass-card animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  )
}
