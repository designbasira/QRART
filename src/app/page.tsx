import Link from 'next/link'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
          {APP_NAME}
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          {APP_DESCRIPTION}
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Créer un compte
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6 rounded-lg border">
            <h3 className="font-semibold text-lg">Détourage IA</h3>
            <p className="mt-2 text-sm text-gray-600">
              Supprimez automatiquement l&apos;arrière-plan de vos photos en un clic, directement dans votre navigateur.
            </p>
          </div>
          <div className="p-6 rounded-lg border">
            <h3 className="font-semibold text-lg">QR Artistique</h3>
            <p className="mt-2 text-sm text-gray-600">
              Générez des QR Codes stylisés avec votre silhouette intégrée. Correction d&apos;erreur haute pour une scannabilité garantie.
            </p>
          </div>
          <div className="p-6 rounded-lg border">
            <h3 className="font-semibold text-lg">Contenu Dynamique</h3>
            <p className="mt-2 text-sm text-gray-600">
              Vos clients modifient le contenu affiché lors du scan à tout moment, sans changer le QR Code.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
