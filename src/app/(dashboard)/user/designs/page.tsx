import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QR_BASE_URL } from '@/lib/constants'

export const metadata = { title: 'Mes designs - Silhouette QR Live' }

export default async function UserDesignsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: designs } = await supabase
    .from('designs')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes designs</h2>

      {designs && designs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {designs.map((design) => (
            <div key={design.id} className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{design.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  design.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {design.is_published ? 'Publié' : 'Brouillon'}
                </span>
              </div>

              <p className="text-xs text-gray-500 truncate">
                {design.current_message || 'Aucun message'}
              </p>

              <div className="text-xs text-gray-400">
                Scans: {design.scan_count} | ID: {design.short_id}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/user/designs/${design.id}`}
                  className="flex-1 text-center px-3 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-gray-800"
                >
                  Modifier
                </Link>
                {design.is_published && (
                  <a
                    href={`${QR_BASE_URL}/${design.short_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border rounded text-xs font-medium hover:bg-gray-50"
                  >
                    Tester
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 text-center">
          <p className="text-gray-500">Aucun design assigné pour le moment.</p>
        </div>
      )}
    </div>
  )
}
