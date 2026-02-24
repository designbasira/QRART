import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Users, Shield, User } from 'lucide-react'

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-[26px] font-bold text-text-primary">Utilisateurs</h2>
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt/50 border-b border-border">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Nom</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Rôle</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-alt/30 transition-colors duration-150">
                <td className="px-5 py-3.5 font-medium text-text-primary flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-[999px] bg-primary-soft flex items-center justify-center text-primary text-xs font-semibold shrink-0">{user.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                  {user.full_name || '—'}
                </td>
                <td className="px-5 py-3.5 text-text-secondary">{user.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-[999px] font-medium capitalize inline-flex items-center gap-1 ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-text-primary'}`}>
                    {user.role === 'admin' ? <Shield size={11} /> : <User size={11} />}{user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-text-secondary text-xs hidden md:table-cell">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-[18px] bg-primary-soft flex items-center justify-center mx-auto"><Users size={24} className="text-primary" /></div>
            <p className="text-text-secondary">Aucun utilisateur.</p>
          </div>
        )}
      </div>
    </div>
  )
}
