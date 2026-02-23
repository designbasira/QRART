import { APP_NAME } from '@/lib/constants'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {APP_NAME}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            QR Codes artistiques dynamiques
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
