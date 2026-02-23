'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { QR_BASE_URL } from '@/lib/constants'
import type { Design, Profile } from '@/types'

export default function AdminDesignDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [design, setDesign] = useState<Design | null>(null)
  const [users, setUsers] = useState<Profile[]>([])
  const [selectedOwner, setSelectedOwner] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return

    async function load() {
      const supabase = createClient()
      const designRes = await supabase.from('designs').select('*').eq('id', id).single()
      const usersRes = await supabase.from('profiles').select('*').eq('role', 'user')

      if (designRes.data) {
        setDesign(designRes.data as Design)
        setSelectedOwner((designRes.data as Design).owner_id)
      }
      if (usersRes.data) setUsers(usersRes.data as Profile[])
    }

    load()
  }, [id])

  async function handleTogglePublish() {
    if (!design) return
    setSaving(true)
    const supabase = createClient()
    const res = await supabase.from('designs').update({ is_published: !design.is_published }).eq('id', design.id).select().single()
    if (res.data) setDesign(res.data as Design)
    setSaving(false)
  }

  async function handleAssign() {
    if (!design || !selectedOwner) return
    setSaving(true)
    const supabase = createClient()
    const res = await supabase.from('designs').update({ owner_id: selectedOwner }).eq('id', design.id).select().single()
    if (res.data) setDesign(res.data as Design)
    setSaving(false)
  }

  async function handleDelete() {
    if (!design || !confirm('Supprimer ce design ?')) return
    const supabase = createClient()
    await supabase.from('designs').delete().eq('id', design.id)
    router.push('/admin/designs')
  }

  if (!design) return <p className="text-gray-500">Chargement...</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{design.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h3 className="font-semibold">Informations</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Short ID</dt>
              <dd className="font-mono">{design.short_id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">URL de scan</dt>
              <dd className="font-mono text-xs">{QR_BASE_URL}/{design.short_id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Scans</dt>
              <dd>{design.scan_count}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Type de contenu</dt>
              <dd className="capitalize">{design.content_type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Statut</dt>
              <dd>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  design.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {design.is_published ? 'Publié' : 'Brouillon'}
                </span>
              </dd>
            </div>
          </dl>

          <button
            onClick={handleTogglePublish}
            disabled={saving}
            className="w-full px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {design.is_published ? 'Dépublier' : 'Publier'}
          </button>
        </div>

        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h3 className="font-semibold">Assigner à un utilisateur</h3>
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name || user.email}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={saving}
            className="w-full px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            Assigner
          </button>

          <hr />

          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Supprimer le design
          </button>
        </div>
      </div>
    </div>
  )
}
