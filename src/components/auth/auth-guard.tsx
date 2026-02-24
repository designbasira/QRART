import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth-provider'

export function AuthGuard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center animate-pulse">
          <span className="text-primary font-bold">Q</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
