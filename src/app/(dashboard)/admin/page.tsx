import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Admin - Silhouette QR Live' }

export default async function AdminPage() {
  const supabase = await createClient()

  const { count: designCount } = await supabase
    .from('designs')
    .select('*', { count: 'exact', head: true })

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-500">Designs</p>
          <p className="text-3xl font-bold">{designCount ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-500">Utilisateurs</p>
          <p className="text-3xl font-bold">{userCount ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <Link
            href="/admin/create"
            className="block text-center py-4 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
          >
            + Nouveau design
          </Link>
        </div>
      </div>
    </div>
  )
}
