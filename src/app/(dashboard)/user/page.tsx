import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Mon espace - Silhouette QR Live' }

export default async function UserPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: designs } = await supabase
    .from('designs')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mon espace</h2>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-4">Mes derniers designs</h3>
        {designs && designs.length > 0 ? (
          <ul className="space-y-2">
            {designs.map((design) => (
              <li key={design.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{design.title}</span>
                <Link
                  href={`/user/designs/${design.id}`}
                  className="text-sm text-black font-medium hover:underline"
                >
                  Modifier
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Aucun design pour le moment.</p>
        )}
      </div>
    </div>
  )
}
