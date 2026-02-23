import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { APP_NAME } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Scan ${id} - ${APP_NAME}` }
}

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: design } = await supabase
    .from('designs')
    .select('*')
    .eq('short_id', id)
    .eq('is_active', true)
    .single()

  if (!design) notFound()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{APP_NAME}</p>
          <h1 className="text-2xl font-bold mt-2">{design.title}</h1>
        </div>

        {design.content_type === 'text' && design.current_message && (
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-800 whitespace-pre-wrap">{design.current_message}</p>
          </div>
        )}

        {design.content_type === 'image' && design.current_media_url && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={design.current_media_url}
              alt={design.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {design.content_type === 'link' && design.current_media_url && (
          <div className="text-center">
            <a
              href={design.current_media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
            >
              Ouvrir le lien
            </a>
          </div>
        )}

        {!design.current_message && !design.current_media_url && (
          <div className="text-center text-gray-400 py-8">
            <p>Aucun contenu pour le moment.</p>
            <p className="text-sm mt-1">Le propriétaire n&apos;a pas encore personnalisé ce design.</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-300">
            Scans: {design.scan_count}
          </p>
        </div>
      </div>
    </div>
  )
}
