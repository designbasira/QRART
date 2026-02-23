import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Designs - Silhouette QR Live' }

export default async function AdminDesignsPage() {
  const supabase = await createClient()

  const { data: designs } = await supabase
    .from('designs')
    .select('*, profiles!designs_owner_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tous les designs</h2>
        <Link
          href="/admin/create"
          className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
        >
          + Nouveau
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Titre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">ID QR</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Propriétaire</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Scans</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {designs?.map((design) => (
              <tr key={design.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{design.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{design.short_id}</td>
                <td className="px-4 py-3 text-gray-600">
                  {(design.profiles as { full_name: string | null; email: string })?.full_name ||
                   (design.profiles as { email: string })?.email || '—'}
                </td>
                <td className="px-4 py-3">{design.scan_count}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    design.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {design.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(design.created_at)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/designs/${design.id}`} className="text-black hover:underline text-xs font-medium">
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!designs || designs.length === 0) && (
          <p className="p-6 text-center text-gray-500">Aucun design.</p>
        )}
      </div>
    </div>
  )
}
