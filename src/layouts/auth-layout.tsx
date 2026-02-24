import { Link, Outlet } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative floating glass shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-[28px] bg-primary-soft/20 animate-float-slow rotate-12" />
        <div className="absolute top-[60%] right-[8%] w-24 h-24 rounded-[24px] bg-accent/10 animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-16 h-16 rounded-full bg-primary/5 animate-float-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[30%] right-[25%] w-20 h-20 rounded-[18px] bg-surface-alt/60 animate-float-slow rotate-45" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-[440px] space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-text-primary">
              {APP_NAME}
            </h1>
          </Link>
          <p className="mt-2 text-sm text-text-secondary">
            QR Codes artistiques dynamiques
          </p>
        </div>
        <div className="glass-card !p-8 animate-slide-up">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
